#!/usr/bin/env zx
import { $, cd } from 'zx'

cd('src')
await $`curl -O https://github.com/arianrhodsandlot/retro-assembly-vendors/releases/download/v202306181619/retro-assembly-vendor.zip`
await $`mkdir vendor`
await $`unzip -q retro-assembly-vendor.zip -d vendor`
await $`mv retro-assembly-vendor.zip vendor`
