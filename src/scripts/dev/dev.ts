import { $ } from 'zx'

while (true) {
  await $`rm -rf node_modules/.vite`
  try {
    await $`waku dev`
  } catch (error) {
    console.warn(error)
  }
}
