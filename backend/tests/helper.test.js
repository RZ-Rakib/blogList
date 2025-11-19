const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')

test('dummy returns one', () => {
  const blogs = [
    { title: 'hgelllo us' },
    { title: 'jdhjksd' }
  ]

  const result = listHelper.dummy(blogs)
  assert.strictEqual(result, 1)
})