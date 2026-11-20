<div align="center">
  <img
    src="https://raw.githubusercontent.com/LizardByte/.github/refs/heads/master/branding/logos/logo.svg"
    alt="LizardByte icon"
    width="256"
  />
  <h1 align="center">Jackal</h1>
  <h4 align="center">A shared Jekyll theme for organizations and their project sites.</h4>
</div>

Jackal provides product landing pages, a project hub, articles, a blog index, and wide catalog pages.
Sites choose their own branding, navigation, content, and deployment paths. The theme provides
the shared page structure, responsive components, and system, light, and dark color modes.

## Preview

From the theme checkout, install Ruby and Bundler, then run:

```sh
bundle install
bundle exec jekyll serve --source example --config example/_config.yml
```

Open the address printed by Jekyll to preview the Sunshine, Themerr, and Koko examples,
the blog, and the filterable release catalog. Product artwork in the examples is served
by the original sites. Example content and assets are separate from the theme package.

For a PR, copy the preview command from the CI run summary or preview comment.
It serves the files GitHub already built. See [Build and preview a Jackal site](docs/build-and-preview.md)
for the reusable workflow, GitHub Pages publishing, and generated catalogs.

## Use Jackal

For a Jekyll build in GitHub Actions or on your machine, add Jackal to the site's
`Gemfile`. Use a tag or commit that contains the theme:

```ruby
gem "jekyll-theme-jackal", git: "https://github.com/LizardByte/jackal.git", ref: "YOUR_THEME_REF"
```

Set `theme: jekyll-theme-jackal` in `_config.yml` and run `bundle install`.
During development, use `path: "../jackal"` in place of `git:` and `ref:`.

GitHub Pages' branch builds can instead use
[`jekyll-remote-theme`](https://github.com/benbalter/jekyll-remote-theme).
Set `remote_theme: LizardByte/jackal@YOUR_THEME_REF`, enable `jekyll-remote-theme`
in `plugins`, and omit `theme`. Jackal's layouts require no custom plugins.

## Configure a site

```yaml
theme: jekyll-theme-jackal
title: ThemerrDB
description: Browse themes for your media library.
url: https://themerr.lizardbyte.dev
baseurl: /ThemerrDB

jackal:
  logo: /assets/project-logo.svg
  icon: /assets/favicon.svg
  styles:
    - /assets/project.css
  nav:
    - label: Browse
      url: /
    - label: Resources
      items:
        - label: Themerr
          url: https://themerr.lizardbyte.dev/
        - label: LizardByte blog
          url: /blog/
          scope: umbrella
  umbrella:
    name: LizardByte
    url: https://app.lizardbyte.dev/
    logo: /assets/lizardbyte-wordmark.svg
  footer:
    - label: Explore projects
      url: /
      scope: umbrella
    - label: Get support
      url: /support/
      scope: umbrella
  copyright: LizardByte
```

- Use an empty `baseurl` for a domain root. Set a subpath such as `/ThemerrDB` for a
  project site. Local links and assets automatically use the consumer's `baseurl`.
- Set `jackal.umbrella.url` to a full origin when the parent site is on another domain.
  Use `/` for the root of the same origin, or a path such as `/previews/42` when a
  preview hosts the umbrella site there. Links marked `scope: umbrella` use that
  URL, independently of the project's own `baseurl`.
- `jackal.umbrella.logo` is a project asset unless it is an absolute URL or
  `jackal.umbrella.logo_scope: umbrella` is set. If `jackal.umbrella` is omitted,
  the footer displays the site's own name.
- Set `jackal.name` to override the displayed site name. Set `jackal.styles` and
  `jackal.scripts` for site-wide assets. Pages can also specify their own
  `styles` and `scripts` lists in front matter.
- Adjust the theme tokens in your stylesheet. Set `--jackal-accent`,
  `--jackal-on-accent`, and `--jackal-accent-soft` together so buttons and links
  remain readable in both modes.

## Layouts

- `home` displays the shared landing hero, project sections, and recent posts. The hero
  is centered by default. Set
  `show_posts: false` to hide the post list, or use `posts_title` and
  `posts_limit` to customize it.
- `product` displays a branded hero, page content, and reusable sections. It uses
  [Manrope](assets/jackal/fonts/OFL-Manrope.txt) for product pages.
- `landing` provides a shared header, footer, theme switcher, and reusable styles
  for product landing pages.
- `page` and `post` provide a reading layout. Use `blog` for a post index.
- `catalog` provides a full-width layout for a data browser. Catalogs can use the
  theme's grid, table, and toolbar styles with their own data and JavaScript.
- `jackal` provides the shared navigation, footer, typography, and theme controls
  for all layouts and custom pages.

Product and home pages build their content using these section types:

- `cards` for features, linked projects, or platform downloads.
- `gallery` for screenshots, with optional alternate images for dark mode.
- `faq` for expandable questions and answers.
- `callout` for a highlighted action such as sponsorship or installation help.
- `custom` for a site-owned template in `_includes`. Set `template` to its
  filename and read any section fields with `include.section`.

Use [the catalog example](example/catalog/index.html) as a starting point for a
project with its own generated data.

### Product pages

Set `product` in a page's front matter, or `jackal.product` in `_config.yml`
to configure the site's product branding. `name`, `logo`, `icon`, `url`, and
`nav` control the header. Set `action` with a `label` and `url` to add a call to
action. `default_theme` accepts `system`, `light`, or `dark`. A visitor's saved
choice takes precedence. Set `brand_styles` to the path of a site-owned stylesheet
that overrides the theme's color tokens in light and dark mode.

The hero accepts an `eyebrow`, an accent-colored ending in `accent`, a
`note`, and a list of `highlights`. Use `alignment: center` for a
centered hero. Use `image` for a screenshot or illustration, with optional
`dark_src`, `width`, `height`, and `caption`. Set `presentation: bare`
on the image to omit its frame. Use `devices` with `src`, `alt`, and
an optional `label` to show one image on a monitor and handheld.

### Landing pages

Use `layout: landing` for a product homepage. Set `hero.layout` to `devices`,
`centered`, or `illustrated` in the page's front matter. Each hero works with
any site's colors, navigation, and footer. Supply `title`, `accent`,
`description`, `eyebrow`, and `actions` as needed. The illustrated hero uses
`hero.image`, the device scene uses `hero.devices`, and the centered hero
can show a list of `highlights`. Build the rest of the page with the shared
section styles shown in the examples below.

- `product.container` selects `narrow`, `standard`, or `wide` page gutters.
- `product.density: compact` uses tighter body and navigation styles.
- `product.typography: editorial` uses editorial headings and button styling.
- `product.navigation: menu` collapses the navigation behind a menu button on mobile.
- `product.wordmark`, `wordmark_suffix`, and `logo_size` customize the brand lockup.
  Set `product.icons` to a site-owned SVG sprite include or `icon_style: glyph` for text icons.
- `product.footer` supplies `tagline`, `action`, and `links`. It accepts
  `style: inline` and an optional `logo_size`.

Links with `scope: umbrella` resolve against the umbrella site, including under
a nested preview URL.

To switch a `picture` source with the selected theme, add `data-jackal-dark-image`
to its dark-mode `source` and supply the default image in the `img` element.

- [Sunshine](example/sunshine.html) includes the device scene, setup illustration, clients, and download grid.
- [Themerr](example/themerr.html) includes the centered coral hero, server features, and setup panels.
- [Koko](example/koko.html) includes the collection artwork, media categories, and development panel.

The examples supply their own logos, icons, colors, and content. The landing CSS
and layout ship in the theme package. Shared styles and example files adapted
from the original sites retain their source attribution in [the landing notices](docs/landing-notices.md).

When migrating a site, keep its existing `url`, `baseurl`, permalinks, feeds, and redirects.
Keep generated data, release assets, and downloads at their existing public paths.
Build and compare the new output before changing a site's publishing workflow.
