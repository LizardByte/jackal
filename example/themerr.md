---
layout: product
title: Themerr
permalink: /themerr/
product:
  name: Themerr
  url: /themerr/
  logo: https://themerr.lizardbyte.dev/assets/themerr-icon.png
  palette: themerr
  default_theme: dark
  nav:
    - label: Features
      url: '#features'
    - label: How it works
      url: '#setup'
    - label: ThemerrDB
      url: https://themerr.lizardbyte.dev/ThemerrDB/
    - label: Jackal demo
      url: /
  action:
    label: Get Themerr
    url: '#get-themerr'
hero:
  alignment: center
  eyebrow: Theme music for your media server
  title: Give your library
  accent: a soundtrack.
  description: Add theme music to your movies, shows, and collections in Plex or Jellyfin.
  highlights: [Plex, Jellyfin]
  actions:
    - label: Get Themerr
      url: '#get-themerr'
      primary: true
    - label: Installation guide
      url: https://docs.lizardbyte.dev/projects/themerr/latest/
sections:
  - type: cards
    id: features
    items:
      - title: For your Plex library
        description: Use Plex Movie and Series agents to find themes, and add music when new titles arrive.
      - title: For your Jellyfin library
        description: Choose the libraries to connect and schedule scans for new themes.
  - type: cards
    id: setup
    title: How Themerr works
    items:
      - title: Connect your server
        description: Run Themerr alongside Plex or Jellyfin and choose your libraries.
      - title: Find a theme
        description: Match your titles against the community-maintained ThemerrDB.
      - title: Keep it in sync
        description: Respond to library updates or schedule scans as your collection grows.
  - type: callout
    id: get-themerr
    title: Bring music to your library.
    description: Follow the installation guide to set up Themerr for Plex or Jellyfin.
    actions:
      - label: Read the docs
        url: https://docs.lizardbyte.dev/projects/themerr/latest/
        primary: true
      - label: Latest release
        url: https://github.com/Themerr/Themerr/releases/latest
  - type: callout
    title: Powered by ThemerrDB
    description: Browse the theme song database or contribute a theme.
    actions:
      - label: Explore ThemerrDB
        url: https://themerr.lizardbyte.dev/ThemerrDB/
---
