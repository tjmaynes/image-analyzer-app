import fs from 'fs/promises'
import OpenAI from 'openai'
import imageClasses from './image-classes.json'

const throwIfEnvVarDoesNotExist = (envVarName) => {
  if (!process.env[envVarName]) {
    console.error(`Unable to find required env var: "${envVarName}"`)
    process.exit(1)
  }
}

const getFlagValue = (flagName) => {
  const flagIndex = process.argv.indexOf(`--${flagName}`)
  const flagValue = flagIndex > -1 ? process.argv[flagIndex + 1] : ''

  if (!flagValue) {
    console.error(
      `Expected required flag '--${flagName}' to be passed to script!`
    )
    process.exit(1)
  }

  return flagValue
}

const batchSeedProcess = async (
  currentSeedFileContent,
  seedFile,
  limitBatchSize = 5
) => {
  const currentClassifications = imageClasses.slice(
    currentSeedFileContent.data.length
  )
  let currentSeedFileData = currentSeedFileContent.data

  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

  const getSeedData = (classifications) => {
    const getImageDescription = async (classification) => {
      const content = `What is a '${classification}'? I'm new to this world and I don't know what a '${classification}' is...`

      const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        stream: false,
        messages: [{ role: 'user', content: content }],
      })

      if (response && response.choices && response.choices.length > 0) {
        return response.choices[0].message.content
      } else {
        return 'N/A'
      }
    }

    return classifications.map((imageClass) =>
      getImageDescription(imageClass).then((description) => ({
        name: imageClass,
        description: description,
      }))
    )
  }

  // or: currentSeedFileContent.data.length
  const totalBatchJobs = imageClasses.length / limitBatchSize

  let latestSeedFileContent = currentSeedFileContent

  for (let i = 0; i < totalBatchJobs; i++) {
    const currentBatch = currentClassifications.slice(
      i * limitBatchSize,
      i * limitBatchSize + limitBatchSize
    )

    const batchJobNumber =
      totalBatchJobs *
        Math.floor(latestSeedFileContent.data.length / imageClasses.length) +
      1

    console.log(
      `Attempting to add the following batch (group ${batchJobNumber} of ${totalBatchJobs}) to seed file:`,
      currentBatch
    )

    const newSeedData = await Promise.all(getSeedData(currentBatch))

    currentSeedFileData = [...currentSeedFileData, ...newSeedData]

    const newSeedFileContent = {
      last_updated_timestamp: new Date(),
      length: currentSeedFileData.length,
      data: currentSeedFileData,
    }

    await fs.writeFile(seedFile, JSON.stringify(newSeedFileContent, null, 2), {
      flag: 'w',
    })

    latestSeedFileContent = newSeedFileContent
  }

  return latestSeedFileContent
}

const ensureSeedFileExists = (seedFile, onSeedFileConfirmation) =>
  fs
    .readFile(seedFile, { encoding: 'utf8' })
    .then((rawData) => onSeedFileConfirmation(JSON.parse(rawData)))
    .catch((error) => {
      if (error.code === 'ENOENT') {
        const initialSeedObject = {
          last_updated_timestamp: new Date(),
          length: 0,
          data: [],
        }

        return fs
          .writeFile(seedFile, JSON.stringify(initialSeedObject), {
            flag: 'wx',
          })
          .then(() => onSeedFileConfirmation(initialSeedObject))
      } else {
        throw new Error(error)
      }
    })

const main = async () => {
  ;['CLOUDFLARE_ACCOUNT_ID', 'CLOUDFLARE_API_TOKEN', 'OPENAI_API_KEY'].forEach(
    (envVarName) => throwIfEnvVarDoesNotExist(envVarName)
  )

  if (process.argv.length === 2) {
    console.error('Expected at least one argument!')
    process.exit(1)
  }

  const seedFile = getFlagValue('seed-file')

  return await ensureSeedFileExists(seedFile, (currentSeedData) =>
    currentSeedData.data.length !== imageClasses.length
      ? batchSeedProcess(currentSeedData, seedFile, 5)
      : currentSeedData
  )
}

main().then(() => console.log('Done!'))
