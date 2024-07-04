import { test, expect } from '@playwright/test'
import { scroll } from './helpers'

test.describe('when a user navigates to the homepage', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('has title', async ({ page }) => {
    await expect(page).toHaveTitle(/Image Analyzer/)
  })

  test('has heading', async ({ page }) => {
    await page.getByText('Image Analyzer').click()
    await expect(page).toHaveURL(
      'https://github.com/tjmaynes/image-analyzer-app'
    )
  })

  test('has footer', async ({ page }) => {
    await page.getByText('TJ Maynes').click()
    await expect(page).toHaveURL('https://tjmaynes.com/')
  })

  test('shows the correct classification for a beautiful dog', async ({
    page,
  }) => {
    await expect(page.getByText(/^Labrador Retriever: ([0-9]+)%$/)).toBeVisible(
      {
        timeout: 30000,
      }
    )

    await expect(
      page.getByText(/^Flat-coated Retriever: ([0-9]+)%$/)
    ).toBeVisible({
      timeout: 30000,
    })

    await expect(
      page.getByText(
        /^Staffordshire Bullterrier, Staffordshire Bull Terrier: ([0-9]+)%$/
      )
    ).toBeVisible({
      timeout: 30000,
    })
  })

  test.describe('and when they upload an image of a snake', () => {
    test.beforeEach(async ({ page }) => {
      await page.locator('input[name="image-upload"]').click()

      await page
        .locator('input[name="image-upload"]')
        .setInputFiles('./e2e/images/snake.jpg')
    })

    test('shows the correct classification for a snake', async ({
      page,
      browserName,
    }) => {
      if (browserName === 'firefox') test.skip()

      await page.evaluate(scroll, { direction: 'down', speed: 'fast' })

      await expect(
        page.getByText(/^Indian Cobra, Naja Naja: ([0-9]+)%$/)
      ).toBeVisible({
        timeout: 30000,
      })

      await expect(
        page.getByText(
          /^Diamondback, Diamondback Rattlesnake, Crotalus Adamanteus: ([0-9]+)%$/
        )
      ).toBeVisible({
        timeout: 30000,
      })

      await expect(
        page.getByText(
          /^Horned Viper, Cerastes, Sand Viper, Horned Asp, Cerastes Cornutus: ([0-9]+)%$/
        )
      ).toBeVisible({
        timeout: 30000,
      })
    })
  })
})
