const { test, expect, beforeEach, describe } = require('@playwright/test')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await page.goto('/')
    await request.post('/api/testing/reset')
    await request.post('/api/users', {
      data: {
        username: 'Gorilla',
        name: 'Rakib',
        password: 'rz12345'
      }
    })
  })

  test('Login form is shown', async({ page }) => {
    const loginForm = page.locator('.loginForm')

    await expect(loginForm).toHaveText(/Log in to application/i)
    await expect(loginForm.getByRole('button', { name: 'Login' })).toBeVisible()
    await expect(loginForm).toHaveText(/Don't have any account\?/i)
  })

  describe('Login', () => {
    test('success with correct credentials', async ({ page }) => {
      const usernameInput = page.getByRole('textbox', { name: 'username' })
      const passwordInput = page.getByRole('textbox', { name: 'password' })

      await usernameInput.fill('Gorilla')
      await passwordInput.fill('rz12345')
      await page.getByRole('button', { name: 'Login' }).click()

      await expect(page.getByRole('button', { name: 'logout' }).locator('..').getByText('Rakib logged in')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      const usernameInput = page.getByRole('textbox', { name: 'username' })
      const passwordInput = page.getByRole('textbox', { name: 'password' })

      await usernameInput.fill('Gorill')
      await passwordInput.fill('rz12345')
      await page.getByRole('button', { name: 'Login' }).click()

      await expect(page.getByText('invalid username or password')).toBeVisible()
    })

    test('a new blog can be created', async ( { page } ) => {
      const usernameInput = page.getByRole('textbox', { name: 'username' })
      const passwordInput = page.getByRole('textbox', { name: 'password' })

      await usernameInput.fill('Gorilla')
      await passwordInput.fill('rz12345')
      await page.getByRole('button', { name: 'Login' }).click()

      await page.getByRole('button', { name: 'Create new blog' }).click()

      await page.getByLabel('title').fill('Testing with playwright')
      await page.getByLabel('author').fill('Rakib Zaman')
      await page.getByLabel('url').fill('www.testing.com')
      await page.getByRole('button', { name: 'create' }).click()

      expect(page.locator('.blogSummary').getByText('Testing with playwright')).toBeVisible()
      expect(page.locator('.blogSummary').getByText('Rakib Zaman')).toBeVisible()
    })
  })
})
