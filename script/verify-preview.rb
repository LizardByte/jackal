# frozen_string_literal: true

require "json"

site_dir, baseurl, umbrella_url, origin = ARGV
abort "Usage: ruby script/verify-preview.rb SITE_DIR BASEURL UMBRELLA_URL ORIGIN" unless origin

def require_fragment(html, fragment)
  abort "Missing rendered fragment: #{fragment}" unless html.include?(fragment)
end

def read_page(site_dir, path)
  html = File.read(File.join(site_dir, path), encoding: "UTF-8")
  abort "Unexpected source markup in #{path}" if html.include?("Liquid Exception:") || html.include?("{% include")
  html
end

post_path = "2026-01-01-a-home-for-each-project/"
showcase_path = "blog/markdown-showcase/"
pages = %w[index.html sunshine/index.html themerr/index.html koko/index.html catalog/index.html
           blog/index.html about/index.html getting-started/index.html examples/index.html
           examples/community/index.html examples/product/index.html blog/page2/index.html
           search/index.html tags/index.html 404.html] + ["#{post_path}index.html", "#{showcase_path}index.html"]

pages.each do |path|
  html = read_page(site_dir, path)
  require_fragment(html, %(href="#{baseurl}/assets/jackal/landing.css"))
  require_fragment(html, %(src="#{baseurl}/assets/jackal/landing/theme.js"))
  product = path.split("/").first
  if %w[sunshine themerr koko].include?(product)
    require_fragment(html, %(href="#{baseurl}/assets/example/#{product}-brand.css"))
    require_fragment(html, %(href="#{baseurl}/#{product}/"))
    require_fragment(html, 'class="footer-top"')
    require_fragment(html, %(href="#{umbrella_url.sub(%r{/$}, "")}/support/"))
  else
    require_fragment(html, %(href="#{baseurl}/assets/jackal/jackal.css"))
    abort "Unexpected umbrella branding in #{path}" if html.include?('class="umbrella"')
  end
  public_path = path.delete_suffix("index.html")
  require_fragment(html, %(rel="canonical" href="#{origin}#{baseurl}/#{public_path}"))
  require_fragment(html, %(href="#{baseurl}/feed.xml"))
end

home = read_page(site_dir, "index.html")
jackal_icon = "#{baseurl}/assets/example/jackal.svg"
require_fragment(home, %(<link rel="icon" href="#{jackal_icon}">))
require_fragment(home, %(src="#{jackal_icon}"))
require_fragment(home, 'class="hero hero--centered"')
require_fragment(home, 'class="client-grid jackal-section-cards"')
require_fragment(home, %(href="#{baseurl}/#{post_path}"))
require_fragment(home, %(href="#{baseurl}/examples/"))
require_fragment(home, %(href="#{baseurl}/getting-started/"))
require_fragment(home, %(href="#{baseurl}/assets/jackal/social.svg#github"))
require_fragment(home, %(href="#{baseurl}/assets/jackal/social.svg#rss"))

gallery = read_page(site_dir, "examples/index.html")
%W[sunshine/ themerr/ koko/ examples/community/ examples/product/ #{showcase_path} catalog/].each do |path|
  require_fragment(gallery, %(href="#{baseurl}/#{path}"))
end
require_fragment(gallery, 'data-jackal-carousel')
require_fragment(gallery, %(src="#{baseurl}/assets/jackal/carousel.js"))
require_fragment(gallery, %(src="#{baseurl}/assets/example/maple-makers-preview.jpg"))
require_fragment(gallery, %(src="#{baseurl}/assets/example/trail-ledger-preview.jpg"))
abort "Carousel script loaded outside the gallery" if home.include?("carousel.js")

community = read_page(site_dir, "examples/community/index.html")
require_fragment(community, %(href="#{baseurl}/assets/example/maple-makers.css"))
require_fragment(community, 'id="workshops"')
require_fragment(community, 'id="membership"')

product = read_page(site_dir, "examples/product/index.html")
require_fragment(product, %(href="#{baseurl}/assets/example/trail-ledger.css"))
require_fragment(product, 'class="jackal-faq"')
require_fragment(product, %(href="#{baseurl}/#{showcase_path}"))

showcase = read_page(site_dir, "#{showcase_path}index.html")
%w[<blockquote> <table> <pre <sup].each { |fragment| require_fragment(showcase, fragment) }
require_fragment(showcase, %(src="#{jackal_icon}"))
require_fragment(showcase, %(property="og:image" content="#{origin}#{baseurl}/assets/example/jackal-theme.jpg"))
require_fragment(showcase, 'name="twitter:card" content="summary_large_image"')
require_fragment(showcase, 'class="jackal-post-cover"')
require_fragment(showcase, "Jackal maintainers")
require_fragment(showcase, "Trail Ledger")
require_fragment(showcase, " min read")
require_fragment(showcase, %(href="#{baseurl}/tags/#markdown"))
require_fragment(showcase, %(rel="prev" href="#{baseurl}/#{post_path}"))
require_fragment(showcase, 'class="jackal-share"')
require_fragment(showcase, %(href="#{baseurl}/assets/jackal/social.svg#bluesky"))
require_fragment(showcase, 'data-code-dark="slate"')

blog = read_page(site_dir, "blog/index.html")
require_fragment(blog, 'class="jackal-post-thumbnail"')
require_fragment(blog, %(rel="next" href="#{baseurl}/blog/page2/"))
require_fragment(blog, "Page 1 of 2")
older_posts = read_page(site_dir, "blog/page2/index.html")
require_fragment(older_posts, %(rel="prev" href="#{baseurl}/blog/"))
require_fragment(older_posts, "Page 2 of 2")
require_fragment(older_posts, %(href="#{baseurl}/#{post_path}"))
abort "Pagination repeated a newer post" if older_posts.include?(%(href="#{baseurl}/#{showcase_path}"))

archive = read_page(site_dir, "tags/index.html")
require_fragment(archive, 'id="markdown"')
require_fragment(archive, %(href="#{baseurl}/#{showcase_path}"))
not_found = read_page(site_dir, "404.html")
require_fragment(not_found, 'name="robots" content="noindex"')
require_fragment(not_found, '<h1>Page not found</h1>')
require_fragment(not_found, %(href="#{baseurl}/">Return home</a>))
require_fragment(not_found, %(href="#{baseurl}/search/"))
search = read_page(site_dir, "search/index.html")
require_fragment(search, %(data-search-index="#{baseurl}/search-index.json"))
require_fragment(search, 'aria-label="Color theme"')
%w[system light dark].each do |mode|
  require_fragment(search, %(data-theme-mode="#{mode}"))
  require_fragment(search, %(data-theme-icon="#{mode}"))
end
require_fragment(search, '<output id="jackal-search-status" for="jackal-query">')

search_entries = JSON.parse(File.read(File.join(site_dir, "search-index.json"), encoding: "UTF-8"))
abort "Search index includes excluded pages" if search_entries.any? { |entry| entry.fetch("url").end_with?("/404.html") }
search_paths = search_entries.map { |entry| entry.fetch("url") }
abort "Search index contains duplicate URLs" unless search_paths.uniq == search_paths
search_post = search_entries.find { |entry| entry.fetch("url") == "#{baseurl}/#{showcase_path}" }
abort "Search index is missing post content" unless search_post&.fetch("text")&.include?("Morning loop")
abort "Search index is missing pages" unless search_paths.include?("#{baseurl}/about/")

feed = read_page(site_dir, "feed.xml")
require_fragment(feed, '<rss version="2.0"')
require_fragment(feed, "<link>#{origin}#{baseurl}/#{showcase_path}</link>")
require_fragment(feed, %(<guid isPermaLink="true">#{origin}#{baseurl}/#{showcase_path}</guid>))
require_fragment(feed, %(<atom:link href="#{origin}#{baseurl}/feed.xml"))
abort "Feed must include RFC 822 publication dates" unless feed.match?(%r{<pubDate>\w{3}, \d{1,2} \w{3} \d{4} \d{2}:\d{2}:\d{2} [+-]\d{4}</pubDate>})
sitemap = read_page(site_dir, "sitemap.xml")
require_fragment(sitemap, "<loc>#{origin}#{baseurl}/#{showcase_path}</loc>")
abort "Sitemap includes the 404 page" if sitemap.include?("/404.html")

guide = read_page(site_dir, "getting-started/index.html")
require_fragment(guide, "language-ruby")
require_fragment(guide, "bundle exec jekyll serve")

sunshine = read_page(site_dir, "sunshine/index.html")
require_fragment(sunshine, 'class="stream-scene"')
require_fragment(sunshine, 'class="hero hero--devices wrap"')
require_fragment(sunshine, 'class="platform-strip wrap"')
require_fragment(sunshine, 'class="download-grid"')
require_fragment(sunshine, %(src="#{baseurl}/assets/example/sunshine.js"))
require_fragment(sunshine, "sunshine-web-ui-dark.jpg")
require_fragment(sunshine, %(href="#download"))

themerr = read_page(site_dir, "themerr/index.html")
require_fragment(themerr, %(data-default-theme="dark"))
require_fragment(themerr, 'class="hero hero--centered"')
require_fragment(themerr, 'class="wrap hero-content"')
require_fragment(themerr, 'class="start-panel"')
require_fragment(themerr, %(href="https://themerr.lizardbyte.dev/ThemerrDB/"))

koko = read_page(site_dir, "koko/index.html")
require_fragment(koko, 'class="hero-art"')
require_fragment(koko, 'class="wrap hero hero--illustrated"')
require_fragment(koko, 'class="shell project-strip"')
require_fragment(koko, 'class="media-grid"')
require_fragment(koko, 'class="development-panel"')

catalog = read_page(site_dir, "catalog/index.html")
require_fragment(catalog, %(src="#{baseurl}/assets/example/catalog.js"))
require_fragment(catalog, %(href="#{baseurl}/catalog/index.json"))
require_fragment(catalog, "jackal-full-width")
require_fragment(catalog, "Download catalog JSON")

orgs = JSON.parse(File.read(File.join(site_dir, "catalog/index.json"))).map { |entry| entry.fetch("organization") }
abort "Catalog JSON contains unexpected organizations" unless orgs.sort == %w[KokoStreamTV SunshineStream Themerr]

%w[assets/jackal/jackal.css assets/jackal/landing/theme.js assets/jackal/landing.css
   assets/jackal/landing/chrome.css assets/jackal/landing/sections.css assets/jackal/fonts/manrope.woff2
   assets/example/jackal.svg assets/example/catalog.js assets/example/sunshine.js assets/example/sunshine-brand.css
   assets/example/themerr-brand.css assets/example/koko-brand.css assets/example/maple-makers.css
   assets/example/trail-ledger.css assets/example/jackal-theme.jpg assets/jackal/search.js
   assets/example/maple-makers-preview.jpg assets/example/trail-ledger-preview.jpg assets/jackal/social.svg
   assets/jackal/carousel.js].each do |path|
  abort "Missing static asset #{path}" unless File.file?(File.join(site_dir, path))
end

puts "Verified #{pages.size} pages, their URLs and assets, and the feed, sitemap, search index, and catalog."
