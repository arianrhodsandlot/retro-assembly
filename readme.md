<p align="center">
  <img src="public/assets/logo/logo-512x512.png" alt="logo" width="100" height="100">
  <h1 align="center">RetroAssembly</h1>
</p>

<p align="center">
  <a href="https://github.com/arianrhodsandlot/retroassembly"><img src="https://img.shields.io/github/stars/arianrhodsandlot/retroassembly" alt="GitHub"></a>
  <a href="https://discord.gg/gwaKRAYG6t"><img src="https://img.shields.io/discord/1129062038543548496?logo=discord" alt="Discord"></a>
  <a href="https://hub.docker.com/r/arianrhodsandlot/retroassembly"><img src="https://img.shields.io/docker/pulls/arianrhodsandlot/retroassembly" alt="Docker Hub"></a>
</p>

<p align="center">
  <a href="https://discord.gg/gwaKRAYG6t">
    <picture width="320">
      <source media="(prefers-color-scheme: light)" srcset="https://invidget.switchblade.xyz/gwaKRAYG6t?theme=light">
      <source media="(prefers-color-scheme: dark)" srcset="https://invidget.switchblade.xyz/gwaKRAYG6t">
      <img width="320" alt="Join our Discord server" src="https://invidget.switchblade.xyz/gwaKRAYG6t?theme=light">
    </picture>
  </a>
</p>

<p align="center">
  <a href="https://ko-fi.com/arianrhodsandlot">
    <img width="320" src="https://cdn.prod.website-files.com/5c14e387dab576fe667689cf/670f5a0171bfb928b21a7e00_support_me_on_kofi_beige.png" alt="Support me on Ko-fi">
  </a>
</p>

RetroAssembly is the personal retro game collection cabinet in your browser.

## Features

- [x] Relive memories from numerous retro gaming consoles in the browser. NES, SNES, Genesis, GameBoy, Arcade... See [Supported Platforms](#supported-platforms) below.
- [x] See your game collection displayed with auto-detected beautiful box arts and covers.
- [x] Save and synchronize your game at any point and resume later.
- [x] Made a mistake? Some emulators allow you to rewind gameplay.
- [x] Browse through platforms and your game library with an intuitive interface with [spatial navigation](https://en.wikipedia.org/wiki/Spatial_navigation), which means you can just use a keyboard or a gamepad to navigate between games.
- [x] Enhance your gaming experience with beautiful visual effects with retro-style shaders.
- [x] Play on the go, even without a physical gamepad, using our on-screen virtual controller.

## Screenshots

|          | Desktop                                                                                                                                                                                                 | Mobile                                                                                                                                                                                               |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Library  | <img src="https://cdn.jsdelivr.net/gh/arianrhodsandlot/retroassembly-assets@657978eba57dd4920d57436feaa5dbb7a775e5eb/screenshots/desktop/library.jpg" alt="library-desktop" width="240" height="135">   | <img src="https://cdn.jsdelivr.net/gh/arianrhodsandlot/retroassembly-assets@657978eba57dd4920d57436feaa5dbb7a775e5eb/screenshots/mobile/library.jpg" alt="library-mobile" width="62" height="135">   |
| Games    | <img src="https://cdn.jsdelivr.net/gh/arianrhodsandlot/retroassembly-assets@657978eba57dd4920d57436feaa5dbb7a775e5eb/screenshots/desktop/games.jpg" alt="games-desktop" width="240" height="135">       | <img src="https://cdn.jsdelivr.net/gh/arianrhodsandlot/retroassembly-assets@657978eba57dd4920d57436feaa5dbb7a775e5eb/screenshots/mobile/games.jpg" alt="games-mobile" width="62" height="135">       |
| Platform | <img src="https://cdn.jsdelivr.net/gh/arianrhodsandlot/retroassembly-assets@657978eba57dd4920d57436feaa5dbb7a775e5eb/screenshots/desktop/platform.jpg" alt="platform-desktop" width="240" height="135"> | <img src="https://cdn.jsdelivr.net/gh/arianrhodsandlot/retroassembly-assets@657978eba57dd4920d57436feaa5dbb7a775e5eb/screenshots/mobile/platform.jpg" alt="platform-mobile" width="62" height="135"> |
| ROM      | <img src="https://cdn.jsdelivr.net/gh/arianrhodsandlot/retroassembly-assets@657978eba57dd4920d57436feaa5dbb7a775e5eb/screenshots/desktop/rom.jpg" alt="rom-desktop" width="240" height="135">           | <img src="https://cdn.jsdelivr.net/gh/arianrhodsandlot/retroassembly-assets@657978eba57dd4920d57436feaa5dbb7a775e5eb/screenshots/mobile/rom.jpg" alt="rom-mobile" width="62" height="135">           |
| Menu     | <img src="https://cdn.jsdelivr.net/gh/arianrhodsandlot/retroassembly-assets@657978eba57dd4920d57436feaa5dbb7a775e5eb/screenshots/desktop/menu.jpg" alt="menu-desktop" width="240" height="135">         | <img src="https://cdn.jsdelivr.net/gh/arianrhodsandlot/retroassembly-assets@657978eba57dd4920d57436feaa5dbb7a775e5eb/screenshots/mobile/menu.jpg" alt="menu-mobile" width="62" height="135">         |

## Getting Started

### Choose Your Setup

You have two options to get started with RetroAssembly:

#### Option 1: Use the Official Hosted Version

> <small>Recommended for most users. Perfect if you want to get started quickly without any setup.</small>

1. Visit [retroassembly.com](https://retroassembly.com/) in your web browser.
2. _(Optional)_ If you're new here, explore the library and try out the available [demo games](https://retroassembly.com/demo) to see how it works.
3. [Login](https://retroassembly.com/login) and create your personal game library by uploading your own ROM files.
4. Once your ROMs are uploaded, select any game from your library to launch it directly in your browser and start playing.
5. Don't forget to use the in-game menu to save your progress, which will be synchronized for you.

#### Option 2: Self-Host with Docker

> <small>For advanced users who want full control. Perfect if you prefer to host your own instance, have privacy concerns, or want to customize the deployment.</small>

See [RetroAssembly's homepage on Docker Hub](https://hub.docker.com/r/arianrhodsandlot/retroassembly#quick-start).

### OIDC Authentication for Self-Hosted Instances

Node.js and Docker deployments can replace password login with a single OpenID Connect provider. Configure all of the following variables to enable OIDC:

```properties
RETROASSEMBLY_RUN_TIME_OIDC_ISSUER=https://id.example.com
RETROASSEMBLY_RUN_TIME_OIDC_CLIENT_ID=retroassembly
RETROASSEMBLY_RUN_TIME_OIDC_CLIENT_SECRET=replace-with-client-secret
```

Register `https://retroassembly.example.com/login/oidc/callback` as the callback URL. RetroAssembly requests `openid profile email` by default. The provider must return the user's username in `preferred_username`.

Create a client with your OIDC provider, register the callback URL, and grant access to the intended users or groups.

On the first login, an existing RetroAssembly account is linked when the OIDC `preferred_username` exactly matches its local username. Otherwise, RetroAssembly creates a new account. The link is stored using the stable OIDC issuer and subject claims, so later logins do not depend on the username. An identity cannot claim a username that is already linked to a different OIDC identity.

To add an application-side role gate, set `RETROASSEMBLY_RUN_TIME_OIDC_REQUIRED_ROLE`, configure `RETROASSEMBLY_RUN_TIME_OIDC_SCOPES` with any scope your provider requires to expose roles, and configure the provider to include the required value in a `roles` claim. When no required role is configured, any identity accepted by the OIDC provider can log in.

The following settings are optional:

| Variable                                      | Default                | Description                                         |
| --------------------------------------------- | ---------------------- | --------------------------------------------------- |
| `RETROASSEMBLY_RUN_TIME_OIDC_REDIRECT_URI`    | Inferred callback URL  | Explicit callback URL for reverse-proxy deployments |
| `RETROASSEMBLY_RUN_TIME_OIDC_REQUIRED_ROLE`   | Unset                  | Optional value required in the `roles` claim        |
| `RETROASSEMBLY_RUN_TIME_OIDC_SCOPES`          | `openid profile email` | Space-separated scopes                              |
| `RETROASSEMBLY_RUN_TIME_OIDC_SESSION_MAX_AGE` | `28800000`             | OIDC session lifetime in milliseconds               |

OIDC and Supabase authentication cannot be enabled together. OIDC is not available in the Cloudflare Workers build. Before enabling OIDC on an existing instance, confirm that the first local user's username matches the intended OIDC administrator; the oldest active local user remains RetroAssembly's super user.

## Supported Platforms

RetroAssembly aims to support a wide range of vintage gaming systems. Emulation is powered by [Nostalgist.js](https://nostalgist.js.org/).

<details>
  <summary>Click here to view the full list.</summary>

| Console                                 | Available Emulators                                |
| --------------------------------------- | -------------------------------------------------- |
| Arcade                                  | `fbneo`, `mame2003_plus`                           |
| Atari 2600                              | `stella2014`                                       |
| Atari 5200                              | `a5200`                                            |
| Atari 7800                              | `prosystem`                                        |
| Atari Lynx                              | `mednafen_lynx`                                    |
| Channel F                               | `freechaf`                                         |
| ColecoVision                            | `gearcoleco`                                       |
| Famicom Disk System                     | `fceumm`, `nestopia`                               |
| Game & Watch                            | `gw`                                               |
| Game Boy                                | `mgba`, `gearboy`, `gambatte`, `tgbdual`           |
| Game Boy Advance                        | `mgba`, `vba_next`                                 |
| Game Boy Color                          | `mgba`, `gearboy`, `gambatte`, `tgbdual`           |
| Game Gear                               | `genesis_plus_gx`, `gearsystem`                    |
| Genesis / Megadrive                     | `genesis_plus_gx`                                  |
| Magnavox - Odyssey2 / Philips Videopac+ | `o2em`                                             |
| Master System                           | `genesis_plus_gx`, `picodrive`, `gearsystem`       |
| Neo Geo Pocket                          | `mednafen_ngp`                                     |
| Neo Geo Pocket Color                    | `mednafen_ngp`                                     |
| NES / Family Computer                   | `fceumm`, `nestopia`, `quicknes`                   |
| PC Engine (TurboGrafx 16)               | `mednafen_pce_fast`                                |
| Sega SG-1000                            | `gearsystem`                                       |
| Super NES / Super Famicom               | `snes9x`, `snes9x2002`, `snes9x2005`, `snes9x2010` |
| Virtual Boy                             | `mednafen_vb`                                      |
| WonderSwan                              | `mednafen_wswan`                                   |
| WonderSwan Color                        | `mednafen_wswan`                                   |

</details>

## Contributing

See [Contributing](docs/contributing.md).

## Sponsorship

Sponsor this project on [Ko-fi](https://ko-fi.com/arianrhodsandlot) (or alternatively on [GitHub Sponsors](https://github.com/sponsors/arianrhodsandlot) / [Buy Me a Coffee](https://buymeacoffee.com/arianrhodsandlot)) to show your appreciation!

This keeps the project sustainable and ensures continuous improvements and new features.

## Open-source Alternatives

We hope you have a fantastic time revisiting your favorite retro games... Even with applications other than RetroAssembly.

- [EmulatorJS](https://emulatorjs.org) [:octocat:](https://github.com/EmulatorJS/EmulatorJS)
- [GamePlayColor](https://gameplaycolor.com) [:octocat:](https://github.com/gameplaycolor/gameplaycolor)
- [Gaseous](https://github.com/gaseous-project/gaseous-server)
- [RetroArch Web Player](https://web.libretro.com) [:octocat:](https://github.com/libretro/RetroArch/tree/master/pkg/emscripten)
- [RomM](https://romm.app/) [:octocat:](https://github.com/rommapp/romm)
- [vme](https://gitgalu.github.io/vme/) [:octocat:](https://github.com/gitGalu/vme)
- [webrcade](https://www.webrcade.com) [:octocat:](https://github.com/webrcade/webrcade)
- [webretro](https://binbashbanana.github.io/webretro/) [:octocat:](https://github.com/BinBashBanana/webretro)

## License

[MIT](license)
