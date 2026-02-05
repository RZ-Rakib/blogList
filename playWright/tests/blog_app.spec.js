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
    await expect(loginForm.getByRole('button', { name: /Login/i })).toBeVisible()
    await expect(loginForm).toHaveText(/Don't have any account\?/i)
  })

  describe('When login', () => {
    test('success with correct credentials', async ({ page }) => {
      const usernameInput = page.getByRole('textbox', { name: /username/i })
      const passwordInput = page.getByRole('textbox', { name: /password/i })

      await usernameInput.fill('Gorilla')
      await passwordInput.fill('rz12345')
      await page.getByRole('button', { name: /Login/i }).click()

      await expect(page.getByRole('button', { name: /logout/i }).locator('..').getByText(/Rakib logged in/i)).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      const usernameInput = page.getByRole('textbox', { name: /username/i })
      const passwordInput = page.getByRole('textbox', { name: /password/i })

      await usernameInput.fill('Gorill')
      await passwordInput.fill('rz12345')
      await page.getByRole('button', { name: /Login/i }).click()

      await expect(page.getByText(/invalid username or password/i)).toBeVisible()
    })

    test('a new blog can be created', async ( { page } ) => {
      const usernameInput = page.getByRole('textbox', { name: /username/i })
      const passwordInput = page.getByRole('textbox', { name: /password/i })

      await usernameInput.fill('Gorilla')
      await passwordInput.fill('rz12345')
      await page.getByRole('button', { name: /Login/i }).click()

      await page.getByRole('button', { name: /Create new blog/i }).click()

      await page.getByLabel('title').fill('Testing with playwright')
      await page.getByLabel('author').fill('Rakib Zaman')
      await page.getByLabel('url').fill('www.testing.com')
      await page.getByRole('button', { name: /create/i }).click()

      await expect(page.locator('.blogSummary').getByText(/Testing with playwright/i)).toBeVisible()
      await expect(page.locator('.blogSummary').getByText(/Rakib Zaman/i)).toBeVisible()
    })

    test('a blog can be like', async ({ page }) => {
      const usernameInput = page.getByRole('textbox', { name: /username/i })
      const passwordInput = page.getByRole('textbox', { name: /password/i })

      await usernameInput.fill('Gorilla')
      await passwordInput.fill('rz12345')
      await page.getByRole('button', { name: /Login/i }).click()

      await page.getByRole('button', { name: /Create new blog/i }).click()

      await page.getByLabel('title').fill('Testing with playwright')
      await page.getByLabel('author').fill('Rakib Zaman')
      await page.getByLabel('url').fill('www.testing.com')
      await page.getByRole('button', { name: /create/i }).click()

      const blogLocator = page.locator('.blogSummary').filter({ hasText: /Testing with playwright/i })
      await expect(blogLocator).toBeVisible()

      await blogLocator.getByRole('button', { name: /show/i }).click()

      const likeButton = blogLocator.getByRole('button', { name: /like/i })
      await likeButton.click()
      await likeButton.click()

      await expect(blogLocator.locator('span', { hasText: 'likes:' })).toHaveText('likes:2')

    })
  })
})
