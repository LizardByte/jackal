# Publishing and migration

## Publishing routes

Create the routes your site needs. The front matter can contain just a layout and
permalink, plus a title for HTML pages. See the working files in the [example site](../example).

| File                | Layout         | Permalink            | Configuration                         |
| ------------------- | -------------- | -------------------- | ------------------------------------- |
| `feed.xml`          | `feed`         | `/feed.xml`          | `jackal.feed: /feed.xml`              |
| `sitemap.xml`       | `sitemap`      | `/sitemap.xml`       | Set the site's `url` and `baseurl`.   |
| `search-index.json` | `search-index` | `/search-index.json` | `jackal.search_index` for custom URLs |
| `search.html`       | `search`       | `/search/`           | `jackal.search: /search/`             |
| `tags.html`         | `tags`         | `/tags/`             | `jackal.tags: /tags/`                 |
| `404.html`          | `404`          | `/404.html`          | `noindex: true` on the page           |

Set `site.url` to the public origin. URLs in metadata, the feed, and the sitemap
include `baseurl`. `jackal.feed` adds the feed discovery link to the head.
Add a link to search in your navigation if you publish it. Search covers titled
pages and posts, including their text and tags. Set `search: false` to exclude
a page from search, or `noindex: true` to exclude it from search and the sitemap.
Use `sitemap: false` to exclude a page from the sitemap alone.

The `blog` layout lists all posts by default. For pagination, add
`gem "jekyll-paginate", "~> 1.1"` to your Gemfile, enable `jekyll-paginate` in
`plugins`, place the blog layout in `blog/index.html`, and set `paginate: 10`
and `paginate_path: /blog/page:num/` in `_config.yml`.

## Posts and appearance

```yaml
layout: post
title: Field notes
description: Photos and notes from the first workshop.
cover: /assets/workshop.jpg
cover_alt: An overhead view of the workshop table.
thumbnail: /assets/workshop-thumbnail.jpg
tags: [events, workshops]
reading_time: true
authors:
  - name: Erin Lee
    avatar: /assets/erin.jpg
  - name: Taylor Green
    github: taylorgreen
github_repository: owner/repo
github_badges: [stars, issues]
share: true
```

Use `author` for a single author or `authors` for a list. Author names can be
keys in `_data/authors.yml`. Profiles accept `name`, `avatar`, `url`, and
`github`. Jackal uses the GitHub avatar when a profile sets `github` and omits
`avatar`. GitHub badges support stars, forks, open issues, license, and the
owner's follower count.

Post tags link to the configured tag archive. Posts link to adjacent posts.
Open Graph and Twitter cards use the page title and description by default.
Use `share_title`, `share_description`, and `share_image` to override them, or
`jackal.share_image` for a site-wide fallback image. A post cover also works as a
share image.

Set `jackal.theme_control: select` to show System, Light, and Dark in the theme
control. Set `jackal.code.light` and `jackal.code.dark` independently to
`default`, `ayu`, or `slate`. A page can override either under `code`.

## Optional integrations

- Set `jackal.giscus` with `repo`, `repo_id`, `category`, and `category_id`
  from the [Giscus configuration generator](https://giscus.app/). Enable
  `comments: true` on a page or post. Use `mapping: specific` with `term` to
  retain a known discussion mapping when changing a page's URL.
- Set `jackal.analytics` to a GA4 measurement ID. Jackal loads it in production
  builds. For previews, use a config override with `jackal.analytics: false`.
- Set `jackal.social` to footer links with `label`, `url`, and an optional
  `icon` from Jackal's icon set. Set `jackal.share: true` for post sharing links
  site-wide, with `share: false` for individual posts.
- Set `jackal.edit_url` to the repository's edit URL up to the branch name.
  Jackal appends the source file's path.
- Set `mathjax: true` on pages using TeX math. MathJax loads on those pages.
- Set `affiliate_products` on a page to a list of `name` and `url` pairs.
  Jackal shows a disclosure and marks links as sponsored. Customize the
  disclosure with `jackal.affiliate_disclosure`.

## Moving a Beautiful Jekyll Next site

Jackal accepts existing front matter for `cover-img`, `thumbnail-img`,
`share-title`, `share-description`, `share-img`, `gh-repo`, `gh-badge`, and
`readtime`. It also accepts `full-width`, `before-content`, `after-content`,
`head-extra`, `footer-extra`, `css`, `js`, `ext-css`, and `ext-js` on an
individual page. The modern hook names use underscores. Put hook files in the
site's `_includes` directory and specify their filenames as a list.

Asset lists accept URL strings or mappings with `href` for styles, `src` for
scripts, and optional `integrity` and `crossorigin` fields. `sri` is accepted as
an alias for `integrity`. Dependencies in `ext-js` load before the page's
`js` and `scripts` files.

Use `layout: page` with `full_width: true` for a wide page with content hooks,
or `layout: catalog` for a custom data browser. A generated site can keep its
own dependencies, including Bootstrap and DataTables, via these asset lists.
The [release catalog example](../example/catalog/index.html) shows a wide page
and an after-content hook.
