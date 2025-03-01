import { $ } from 'zx'

while (true) {
  await $`rm -rf node_modules/.vite/waku-dev-server-*`
  try {
    await $`waku dev`
  } catch (error) {
    console.warn(error)
  }
}
