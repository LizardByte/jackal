---
layout: page
title: Getting started
description: Build a small Jackal site with Jekyll and Bundler.
permalink: /getting-started/
---

## Add the theme

Add Jackal to your site's `Gemfile`. Replace `YOUR_THEME_REF` with a tag or commit that contains the theme.

```ruby
source "https://rubygems.org"

gem "jekyll", "~> 4.4"
gem "jekyll-theme-jackal",
    git: "https://github.com/LizardByte/jackal.git",
    ref: "YOUR_THEME_REF"
```

Select the theme in your `_config.yml` and give the site a title.

```yaml
theme: jekyll-theme-jackal
title: My project
description: News and resources for my project.
```

## Create a homepage

Create `index.md` with the `home` layout and a short introduction.

```yaml
---
layout: home
title: My project
hero:
  title: Welcome to my project
  description: Read the latest updates and learn how to get involved.
---
```

Run `bundle install`, then `bundle exec jekyll serve`. Open the address printed
by Jekyll to see your site.

## Make it your own

Use the [examples gallery]({{ '/examples/' | relative_url }}) to choose a layout.
The [Jackal README](https://github.com/LizardByte/jackal#configure-a-site)
describes how to configure a logo, navigation, styles, and links to a parent site.
