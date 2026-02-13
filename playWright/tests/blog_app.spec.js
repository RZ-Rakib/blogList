const { test, expect, beforeEach, describe } = require('@playwright/test')
const { loginWith, createBlog, showBlogDetails, likeToBlog } = require('./helpers')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('/api/testing/reset')
    await request.post('/api/users', {
      data: {
        username: 'Gorilla',
        name: 'Rakib',
        password: 'rz12345'
      }
    })
    await request.post('/api/users', {
      data: {
        username: 'Godzilla',
        name: 'zaman',
        password: 'rz12345'
      }
    })
    await page.goto('/')
  })

  test('Login form is shown', async({ page }) => {
    const loginForm = page.locator('.loginForm')

    await expect(loginForm).toHaveText(/Log in to application/i)
    await expect(loginForm.getByRole('button', { name: /Login/i })).toBeVisible()
    await expect(loginForm).toHaveText(/Don't have any account\?/i)
  })

  describe('Login', () => {
    test('success with correct credentials', async ({ page }) => {
      await loginWith(page, 'Gorilla', 'rz12345')

      await expect(page.getByRole('button', { name: /logout/i }).locator('..').getByText(/Rakib logged in/i)).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await loginWith(page, 'Gorill', 'rz12345')

      await expect(page.getByText(/invalid username or password/i)).toBeVisible()
    })

    describe('when logged in', () => {
      test('a new blog can be created', async ( { page } ) => {
        await loginWith(page, 'Gorilla', 'rz12345')
        await createBlog(page, 'Testing with playwright', 'Rakib Zaman', 'wwwtesting.com')

        await expect(page.locator('.blogSummary').getByText(/Rakib Zaman/i)).toBeVisible()
      })

      test('a blog can be like', async ({ page }) => {
        await loginWith(page, 'Gorilla', 'rz12345')
        await createBlog(page, 'Testing with playwright', 'Rakib Zaman', 'wwwtesting.com')

        const locator = page.locator('.blogSummary').filter({ hasText: 'Testing with playwright' })
        await showBlogDetails(locator)
        await likeToBlog(locator, 2)

        await expect(locator.locator('span', { hasText: 'likes:' })).toHaveText('likes:2')
      })

      test('onwer can remove their blog', async ({ page }) => {
        await loginWith(page, 'Gorilla', 'rz12345')
        await createBlog(page, 'second note', 'Rakib Zaman', 'www.testing.com')

        const locator = page.locator('.blogSummary').filter({ hasText: 'second note' })
        await showBlogDetails(locator)

        page.once('dialog', async (dialog) => {
          await dialog.accept()
        })
        const removeButton = locator.getByRole('button', { name: 'remove' })
        await removeButton.click()
        await expect(locator).toHaveCount(0)
      })

      test('only owner sees the remove button', async ({ page }) => {
        //first user
        await loginWith(page, 'Gorilla', 'rz12345')
        await createBlog(page, 'second note', 'Rakib Zaman', 'www.testing.com')

        const firstUserBlogLocator = page.locator('.blogSummary').filter({ hasText: 'second note' })
        await expect(firstUserBlogLocator).toBeVisible()

        await page.getByRole('button', { name: /logout/i }).click()

        //second user
        await loginWith(page, 'Godzilla', 'rz12345')
        const secondUserBlogLocator = page.locator('.blogSummary').filter({ hasText: 'second note' })

        await expect(secondUserBlogLocator).toBeVisible()
        await secondUserBlogLocator.getByRole('button', { name: 'show' }).click()
        await expect(secondUserBlogLocator.getByRole('button', { name: 'remove' })).toHaveCount(0)
      })

      describe('several blogs exist', () => {
        test('blogs position sorted by like', async ({ page }) => {
          await loginWith(page, 'Gorilla', 'rz12345')
          await createBlog(page, 'first blog', 'rakib 1', 'testing.com')
          await createBlog(page, 'second blog', 'rakib 2', 'testing.com')
          await createBlog(page, 'third blog', 'rakib 3', 'testing.com')

          const firstBlog = page.locator('.blogSummary').filter({ hasText: /first blog/i })
          const secondBlog = page.locator('.blogSummary').filter({ hasText: /second blog/i })
          const thirdBlog = page.locator('.blogSummary').filter({ hasText: /third blog/i })
          // first blog likes
          await showBlogDetails(firstBlog)
          await likeToBlog(firstBlog, 1)
          await expect(firstBlog.locator('span', { hasText: 'likes:' })).toHaveText('likes:1')
          // second blog likes
          await showBlogDetails(secondBlog)
          await likeToBlog(secondBlog, 3)
          await expect(secondBlog.locator('span', { hasText: 'likes:' })).toHaveText('likes:3')
          // third blog likes
          await showBlogDetails(thirdBlog)
          await likeToBlog(thirdBlog, 6)
          await expect(thirdBlog.locator('span', { hasText: 'likes:' })).toHaveText('likes:6')

          const titles = await page.locator('.blogTitle').allTextContents()
          expect(titles).toEqual(['third blog', 'second blog', 'first blog'])
        })
      })
    })
  })
})
