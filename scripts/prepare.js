#!/usr/bin/env zx
import { $, cd } from 'zx'

cd('src')
await $`curl -LO https://github.com/arianrhodsandlot/retro-assembly-vendors/releases/download/v202306182202/retro-assembly-vendor.zip`
await $`mkdir -p vendor`
await $`unzip -q retro-assembly-vendor.zip -d vendor`
await $`mv retro-assembly-vendor.zip vendor`
