#!/usr/bin/env zx
import { $, cd } from 'zx'

cd('public')
await $`curl -LO https://github.com/arianrhodsandlot/retro-assembly-vendors/releases/download/v202307301633/retro-assembly-vendors.zip`
await $`mkdir -p vendors`
await $`unzip -q retro-assembly-vendors.zip -d vendors`
await $`rm retro-assembly-vendors.zip`
