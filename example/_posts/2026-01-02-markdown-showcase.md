---
layout: post
title: Markdown showcase
description: A sample field note with headings, lists, a table, code, an image, and a footnote.
author: Jackal
permalink: /blog/markdown-showcase/
---

This sample post uses a fictional hike to show how Jackal renders everyday Markdown.

## Morning loop

We followed the creek to the ridge. The first mile was **shaded**, and the
ground near the footbridge was *still wet*.

> The last bend before the ridge is a good place to stop and look back.

### Route notes

- Start at the south gate.
- Follow the creek to the footbridge.
- Return by the ridge trail.

| Stop       | Distance | Note           |
| ---------- | -------: | -------------- |
| South gate |     0 km | Start          |
| Footbridge |     2 km | Creek crossing |
| Ridge      |     4 km | Open view      |

### Export the entry

Use `date`, `route`, and `distance_km` to describe the entry in YAML.

```yaml
date: 2026-01-02
route: Morning loop
distance_km: 6
observations:
  - Wet ground near the footbridge
  - Clear view from the ridge
```

### Images and links

![Jackal icon]({{ '/assets/example/jackal.svg' | relative_url }}){: width="64" height="64" }

The [product example]({{ '/examples/product/' | relative_url }}) uses this entry
to demonstrate how a landing page can link to a longer article.[^example]

[^example]: The trail names and observations are sample content.
