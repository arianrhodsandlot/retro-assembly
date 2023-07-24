#!/usr/bin/env zx
import { $, cd } from 'zx'

cd('public')
await $`curl -LO https://github.com/arianrhodsandlot/retro-assembly-vendors/releases/download/v202307241603/retro-assembly-vendor.zip`
await $`mkdir -p vendor`
await $`unzip -q retro-assembly-vendor.zip -d vendor`
await $`rm retro-assembly-vendor.zip`
