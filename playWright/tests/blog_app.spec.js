const { test, expect, beforeEach, describe } = require('@playwright/test')

describe('Blog app', () => {
  beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('Login form is shown', async({ page }) => {
    const loginForm = page.locator('.loginForm')

    await expect(loginForm).toHaveText(/Log in to application/i)
    await expect(loginForm.getByRole('button', { name: 'Login' })).toBeVisible()
    await expect(loginForm).toHaveText(/Don't have any account\?/i)

  })
})
