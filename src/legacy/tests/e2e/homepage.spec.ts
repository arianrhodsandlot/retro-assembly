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
    await page.routeFromHAR(harPath, { update: true, updateMode: 'minimal', url: harUrlPattern })
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
})

test('navigate systems', async ({ page }) => {
  const navigation = page.getByTestId('platform-navigation')
  const gbNavigationButton = navigation.getByTitle('Nintendo - Game Boy', { exact: true })
  const gbaNavigationButton = navigation.getByTitle('Nintendo - Game Boy Advance', { exact: true })
  const gameEntryButton = page.getByTestId('game-entry-button').first()

  await expect(gbNavigationButton).toHaveText('Game Boy')
  await expect(gbaNavigationButton).toBeEmpty()
  await expect(gameEntryButton).toHaveText('Tobu Tobu Girl')

  await gbaNavigationButton.click()

  await expect(gbNavigationButton).toBeEmpty()
  await expect(gbaNavigationButton).toHaveText('Game Boy Advance')
  await expect(gameEntryButton).toHaveText('Celeste Classic')
})

test('launch game', async ({ page }) => {
  const gameEntryButton = page.getByTestId('game-entry-button').first()
  const emulator = page.locator('#canvas')
  await expect(emulator).not.toBeAttached()

  await gameEntryButton.click()
  await expect(emulator).toBeVisible()
})
