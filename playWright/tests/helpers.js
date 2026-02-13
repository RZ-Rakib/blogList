import { expect } from "@playwright/test"

const loginWith = async (page, username, password) => {
  await page.getByRole('textbox', { name: /username/i }).fill(username)
  await page.getByRole('textbox', { name: /password/i }).fill(password)
  await page.getByRole('button', { name: /Login/i }).click()
}

const createBlog = async (page, title, author, url) => {
  const form = page.locator('.newBlogForm')

  if(await form.count() === 0 || !(await form.isVisible())) {
    await page.getByRole('button', { name: /Create new blog/i }).click()
    await expect(form).toBeVisible()
  }

  await page.getByLabel('title').fill(title)
  await page.getByLabel('author').fill(author)
  await page.getByLabel('url').fill(url)
  await page.getByRole('button', { name: /create/i }).click()
  await expect(page.locator('.blogSummary').filter({ hasText: `${title}`})).toBeVisible()
}

const showBlogDetails = async (locator) => {
  await expect(locator).toBeVisible()
  await locator.getByRole('button', { name: 'show' }).click()
}

const likeToBlog = async (blog, times) => {
  const likeButton = blog.getByRole('button', { name: /like/i })
  for(let i = 0; i < times; i++){
    await likeButton.click()
  }
}

export { loginWith, createBlog, showBlogDetails, likeToBlog }