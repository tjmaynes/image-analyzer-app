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
    await expect(page).toHaveURL('https://github.com/tjmaynes/image-analyzer-app')
  })

  test('has footer', async ({ page }) => {
    await page.getByText('TJ Maynes').click()
    await expect(page).toHaveURL('https://tjmaynes.com/')
  })

  test('shows the correct classification for a beautiful dog', async ({ page }) => {
    await expect(page.getByText("I'm a Labrador Retriever!")).toBeVisible({
      timeout: 30000,
    })
  })

  test.describe('and when they upload an image of a snake', () => {
    test.beforeEach(async ({ page, browserName }) => {
      if (browserName !== 'chromium') test.skip()

      await page.locator('input[name="image-upload"]').click()

      await page.locator('input[name="image-upload"]').setInputFiles('./tests/e2e/images/snake.jpg')
    })

    test('shows the correct classification for a snake', async ({ page, browserName }) => {
      if (browserName !== 'chromium') test.skip()

      await page.evaluate(scroll, { direction: 'down', speed: 'fast' })

      await expect(page.getByText("I'm a Indian Cobra, Naja Naja!")).toBeVisible({
        timeout: 30000,
      })
    })
  })
})
