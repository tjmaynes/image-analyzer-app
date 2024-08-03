export const scroll = async ({
  direction,
  speed,
}: {
  direction: string
  speed: string
}) => {
  const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))
  const scrollHeight = () => document.body.scrollHeight
  const shouldStop = (position: number) =>
    direction === 'down' ? position > scrollHeight() : position < 0

  const start = direction === 'down' ? 0 : scrollHeight()

  const increment = direction === 'down' ? 100 : -100
  const delayTime = speed === 'slow' ? 50 : 10
  console.error(start, shouldStop(start), increment)

  for (let i = start; !shouldStop(i); i += increment) {
    window.scrollTo(0, i)
    await delay(delayTime)
  }
}
