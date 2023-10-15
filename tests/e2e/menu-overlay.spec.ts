import { expect, test } from '@playwright/test'

const isUpdatingHar = false
const harPath = 'tests/fixtures/hars/onedrive.har/onedrive.har'
const harUrlPattern = /1drv\.com|graph\.microsoft\.com/

function setMockLocalStorage() {
  if (!localStorage.getItem('onedrive-token')) {
    localStorage.setItem('onedrive-token', JSON.stringify({ value: { access_token: 'test-token' } }))
  }
}

test.beforeEach(async ({ page }) => {
  await page.goto('/')

  const dialog = page.getByRole('dialog')

  const button = page.getByTestId('select-onedrive-directory')
  if (isUpdatingHar) {
    await page.routeFromHAR(harPath, { url: harUrlPattern, update: true, updateMode: 'minimal' })
    await button.click()
    await dialog.getByRole('link').click()
  } else {
    await page.evaluate(setMockLocalStorage)
    await page.routeFromHAR(harPath, { url: harUrlPattern })
    await button.click()
  }

  const node = dialog.getByTestId('directory-tree-node')
  await node.filter({ hasText: 'games' }).click()
  await node.filter({ hasText: 'retro-game-roms-test' }).getByRole('button').click()

  await expect(dialog).not.toBeVisible()

  await page.getByTestId('game-entry-button').click()
  await page.locator('#canvas').waitFor()
})

test('open and close menu overlay', async ({ page }) => {
  const menuOverlay = page.getByTestId('menu-overlay')

  await expect(menuOverlay).not.toBeVisible()

  await page.keyboard.press('Escape')
  await expect(menuOverlay).toBeVisible()

  await page.keyboard.press('Escape')
  await expect(menuOverlay).not.toBeAttached()
})

test('resume', async ({ page }) => {
  const menuOverlay = page.getByTestId('menu-overlay')
  const emulator = page.locator('#canvas')

  await page.keyboard.press('Escape')
  await expect(menuOverlay).toBeVisible()

  await page.getByTestId('menu-item-resume').click()
  await expect(menuOverlay).not.toBeAttached()
  await expect(emulator).toBeVisible()
})

test('restart', async ({ page }) => {
  const menuOverlay = page.getByTestId('menu-overlay')
  const emulator = page.locator('#canvas')

  await page.keyboard.press('Escape')
  await page.getByTestId('menu-item-restart').click()
  await expect(menuOverlay).not.toBeAttached()
  await expect(emulator).toBeVisible()
})

test('save state', async ({ page }) => {
  await page.route('**/*.state:/content', async (route) => {
    await route.fulfill({})
  })

  const menuOverlay = page.getByTestId('menu-overlay')
  const emulator = page.locator('#canvas')
  const loadingScreen = page.getByTestId('loading-screen')

  await expect(loadingScreen).not.toBeAttached()

  await page.keyboard.press('Escape')
  await page.getByTestId('menu-item-save-state').click()

  await expect(loadingScreen).toBeVisible()

  await expect(loadingScreen).not.toBeAttached()
  await expect(menuOverlay).not.toBeAttached()
  await expect(emulator).toBeVisible()
})

test('load state', async ({ page }) => {
  const menuOverlay = page.getByTestId('menu-overlay')
  const emulator = page.locator('#canvas')

  await page.keyboard.press('Escape')
  await page.getByTestId('menu-item-load-state').click()
  await page.getByTestId('state-item').first().click()
  await expect(menuOverlay).not.toBeAttached()
  await expect(emulator).toBeVisible()
})

test('save and exit', async ({ page }) => {
  await page.route('**/*.state:/content', async (route) => {
    await route.fulfill({})
  })

  const menuOverlay = page.getByTestId('menu-overlay')
  const emulator = page.locator('#canvas')
  const loadingScreen = page.getByTestId('loading-screen')

  await expect(loadingScreen).not.toBeAttached()

  await page.keyboard.press('Escape')
  await page.getByTestId('menu-item-save-and-exit').click()

  await expect(loadingScreen).toBeVisible()

  await expect(loadingScreen).not.toBeAttached()
  await expect(menuOverlay).not.toBeAttached()
  await expect(emulator).not.toBeAttached()
})
