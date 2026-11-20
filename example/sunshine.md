---
layout: product
title: Sunshine
permalink: /sunshine/
product:
  name: Sunshine
  url: /sunshine/
  logo: https://sunshine.lizardbyte.dev/assets/sunshine.svg
  palette: sunshine
  nav:
    - label: How it works
      url: '#setup'
    - label: Support Sunshine
      url: '#support'
    - label: Docs
      url: https://docs.lizardbyte.dev/projects/sunshine/latest/
    - label: Jackal demo
      url: /
  action:
    label: Get Sunshine
    url: '#download'
hero:
  eyebrow: Your hardware. Your rules.
  title: |-
    Your games.
    Your PC.
  accent: Every screen.
  description: Turn your PC into your own game streaming host, then play through Moonlight.
  note: Free and open source. No cloud subscription.
  actions:
    - label: Download Sunshine
      url: '#download'
      primary: true
    - label: Read the docs
      url: https://docs.lizardbyte.dev/projects/sunshine/latest/
  devices:
    src: https://sunshine.lizardbyte.dev/assets/landscape.svg
    alt: A PC showing the same canyon landscape as the handheld it streams to.
    label: Sunshine host
sections:
  - type: cards
    id: setup
    title: Two apps. One connection.
    items:
      - title: Install Sunshine
        description: Set up the host on the computer that runs your games.
      - title: Get Moonlight
        description: Install a Moonlight client on the screen you want to play on.
        actions:
          - label: Explore Moonlight clients
            url: https://moonlight-stream.org/
      - title: Pair your devices
        description: Use the Sunshine web interface to pair your client and start streaming.
  - type: gallery
    title: Sunshine web interface
    items:
      - src: https://sunshine.lizardbyte.dev/assets/sunshine-web-ui-light.jpg
        dark_src: https://sunshine.lizardbyte.dev/assets/sunshine-web-ui-dark.jpg
        alt: Sunshine's welcome screen for creating web interface credentials.
        caption: Create your web interface account to get started.
  - type: cards
    id: download
    title: Download Sunshine
    description: Install Sunshine on the computer that runs your games.
    items:
      - title: Windows
        description: Get the installer for your host computer.
        actions:
          - label: Windows builds
            url: https://github.com/SunshineStream/Sunshine/releases/latest
      - title: Linux
        description: Find the package for your distribution.
        actions:
          - label: Linux packages
            url: https://github.com/SunshineStream/Sunshine/releases/latest
      - title: macOS
        description: Use a DMG package from the latest release.
        actions:
          - label: macOS DMGs
            url: https://github.com/SunshineStream/Sunshine/releases/latest
      - title: FreeBSD
        description: Install the FreeBSD package on your host.
        actions:
          - label: FreeBSD packages
            url: https://github.com/SunshineStream/Sunshine/releases/latest
  - type: callout
    id: support
    title: Keep Sunshine independent.
    description: >-
      A libvirtualhid license is the best way to support Sunshine and unlocks
      full controller support on Windows and macOS. Donations are welcome, too.
    actions:
      - label: Buy a libvirtualhid license
        url: https://buy.polar.sh/polar_cl_zj6Io5NVukXfZSl97ULtFvImfI5L1jbL2cSnc0Y72Pt
        primary: true
      - label: GitHub Sponsors
        url: https://github.com/sponsors/LizardByte
---
