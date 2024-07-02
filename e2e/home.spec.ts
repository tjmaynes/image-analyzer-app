import { test, expect } from '@playwright/test'

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

  test('shows an image description for a dog', async ({ page }) => {
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
})