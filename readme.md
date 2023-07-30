<p align="center">
  <img src="public/assets/logo/logo-512x512.png" alt="logo" width="128" height="128">
</p>

<h1 align="center">Retro Assembly</h1>

## Overview
A personal retro game collection cabinet in your browser.

<p align="center">
  <img src="docs/screenshots/home.png" width="400" />
</p>

## Usage
1. Visit [retroassembly.com](https://retroassembly.com)
2. Pick a method you prefer to provide your ROMs
3. Start to play!

## Features
|Description|Screenshot|
|---|---|
|📁 Import a directory from your OneDrive/Google Drive or disk, then a game list will appear|<img src="docs/screenshots/import.gif" width="200" />|
|🖼️ Automatically grab game cover images|<img src="docs/screenshots/cover.gif" width="200" />|
|🎮 Joystick friendly, no need to switch between joysticks and mouse while navigating through different games or consoles |<img src="docs/screenshots/joystick.gif" width="200" />|
|⏳ Of course, rewinding|<img src="docs/screenshots/rewind.gif" width="200" />|
|💾 Save states and sync them to with different devices (if using a cloud disk we support)|<img src="docs/screenshots/save.gif" width="200" />|
|🗎 Play a single ROM file without initializing a game library|<img src="docs/screenshots/single.gif" width="200" />|
|🍎 Super convenient for iOS/iPadOS, no AltStore/jailbreak required. Either play directly in your browser or add it to home screen. Notice: a joystick is necessary.  |<img src="docs/screenshots/add-to-home-screen.png" width="200" />|

## Supported Consoles
We support mainstream fourth-generation and earlier consoles as well as some handhelds. The detailed list is as follows.
> ⚠️ As this project is still in an early stage, only some of the most popular consoles are supported.
> However, more consoles will be supported in the future.

<table>
  <thead>
    <tr>
      <th>Firm</th>
      <th>Platform</th>
      <th>ROM Extensions</th>
      <th>Emulator</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td rowspan="3">Atari</td>
      <td>Atari - 2600</td>
      <td>.a26, .zip</td>
      <td>
        <b>Stella</b>
        <br>
        <a href="https://github.com/libretro/stella-libretro">libretro core</a>,
        <a href="https://github.com/stella-emu/stella">origin</a>
      </td>
    </tr>
    <tr>
      <td>Atari - 5200</td>
      <td>.a52, .zip</td>
      <td>
        <b>Atari800</b>
        <br>
        <a href="https://github.com/libretro/libretro-atari800">libretro core</a>,
        <a href="https://github.com/atari800/atari800">origin</a>
      </td>
    </tr>
    <tr>
      <td>Atari - 7800</td>
      <td>.a78, .zip</td>
      <td>
        <b>ProSystem</b>
        <br>
        <a href="https://github.com/libretro/prosystem-libretro">libretro core</a>,
        <a href="https://github.com/gstanton/ProSystem1_3">origin</a>
      </td>
    </tr>
    <tr>
      <td rowspan="5">Nintendo</td>
      <td>Nintendo - Nintendo Entertainment System / Famicom</td>
      <td>.nes, .zip</td>
      <td>
        <b>FCEUmm</b>
        <br>
        <a href="https://github.com/libretro/libretro-fceumm">libretro core</a>,
        <a href="https://sourceforge.net/projects/fceumm/">origin</a>
      </td>
    </tr>
    <tr>
      <td>Nintendo - Super Nintendo Entertainment System / Super Famicom</td>
      <td>.sfc, .zip</td>
      <td>
        <b>Snes9x</b>
        <br>
        <a href="https://github.com/libretro/snes9x">libretro core</a>,
        <a href="https://github.com/snes9xgit/snes9x">origin</a>
      </td>
    </tr>
    <tr>
      <td>Nintendo - Game Boy Color</td>
      <td>.gbc, .zip</td>
      <td rowspan="2">
        <b>Gearboy</b>
        <br>
        <a href="https://github.com/libretro/Gearboy">libretro core</a>,
        <a href="https://github.com/drhelius/Gearboy">origin</a>
      </td>
    </tr>
    <tr>
      <td>Nintendo - Game Boy</td>
      <td>.gb, .zip</td>
    </tr>
    <tr>
      <td>Nintendo - Virtual Boy</td>
      <td>.vb, .zip</td>
      <td>
        <b>Mednafen VB</b>
        <br>
        <a href="https://github.com/libretro/beetle-vb-libretro">libretro core</a>,
        <a href="https://mednafen.github.io/">origin</a>
      </td>
    </tr>
    <tr>
      <td rowspan="3">Sega</td>
      <td>Master System / Mark III</td>
      <td>.sms, .zip</td>
      <td rowspan="3">
        <b>Genesis Plus GX</b>
        <br>
        <a href="https://github.com/libretro/Genesis-Plus-GX">libretro core</a>,
        <a href="https://github.com/ekeeke/Genesis-Plus-GX">origin</a>
      </td>
    </tr>
    <tr>
      <td>Genesis / Mega Drive</td>
      <td>.md, .zip</td>
    </tr>
    <tr>
      <td>Game Gear</td>
      <td>.gg, .zip</td>
    </tr>
    <tr>
      <td rowspan="2">Bandai</td>
      <td>WonderSwan Color</td>
      <td>.wsc, .zip</td>
      <td rowspan="2">
        <b>Mednafen WonderSwan</b>
        <br>
        <a href="https://github.com/libretro/beetle-wswan-libretro">libretro core</a>,
        <a href="https://mednafen.github.io/">origin</a>
      </td>
    </tr>
    <tr>
      <td>WonderSwan</td>
      <td>.ws, .zip</td>
    </tr>
    <tr>
      <td rowspan="2">SNK</td>
      <td>Neo Geo Pocket Color</td>
      <td>.ngc, .zip</td>
      <td rowspan="2">
        <b>Mednafen NGP</b>
        <br>
        <a href="https://github.com/libretro/beetle-ngp-libretro">libretro core</a>,
        <a href="https://mednafen.github.io/">origin</a>
      </td>
    </tr>
    <tr>
      <td>Neo Geo Pocket</td>
      <td>.ngp, .zip</td>
    </tr>
  </tbody>
</table>

## Alternatives
+ [Afterplay.io](https://afterplay.io)
+ [Eclipse](https://eclipseemu.me)
+ [EmulatorJS](https://emulatorjs.org) [:octocat:](https://github.com/EmulatorJS/EmulatorJS)
+ [GamePlayColor](https://gameplaycolor.com) [:octocat:](https://github.com/gameplaycolor/gameplaycolor)
+ [RetroArch Web Player](https://web.libretro.com) [:octocat:](https://github.com/libretro/RetroArch/blob/master/pkg/emscripten/README.md)
+ [webrcade](https://www.webrcade.com) [:octocat:](https://github.com/webrcade/webrcade)
+ [webretro](https://binbashbanana.github.io/webretro/) [:octocat:](https://github.com/BinBashBanana/webretro)

## License
[MIT](license)
