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

pages = %w[index.html sunshine/index.html themerr/index.html koko/index.html catalog/index.html
           blog/index.html 2026-01-01-a-home-for-each-project/index.html about/index.html]

pages.each do |path|
  html = read_page(site_dir, path)
  require_fragment(html, %(href="#{baseurl}/assets/jackal/jackal.css"))
  require_fragment(html, %(src="#{baseurl}/assets/jackal/theme.js"))
  require_fragment(html, %(href="#{umbrella_url.sub(%r{/$}, "")}/support/"))
  public_path = path.delete_suffix("index.html")
  require_fragment(html, %(rel="canonical" href="#{origin}#{baseurl}/#{public_path}"))
end

home = read_page(site_dir, "index.html")
require_fragment(home, %(href="#projects"))
require_fragment(home, %(href="#{baseurl}/sunshine/"))

sunshine = read_page(site_dir, "sunshine/index.html")
require_fragment(sunshine, %(data-jackal-palette="sunshine"))
require_fragment(sunshine, %(href="#{baseurl}/assets/jackal/product.css"))
require_fragment(sunshine, "jackal-device-scene__handheld")
require_fragment(sunshine, %(href="#{baseurl}/sunshine/"))
require_fragment(sunshine, "sunshine-web-ui-dark.jpg")
require_fragment(sunshine, %(href="#download"))

themerr = read_page(site_dir, "themerr/index.html")
require_fragment(themerr, %(data-jackal-palette="themerr"))
require_fragment(themerr, %(data-default-theme="dark"))
require_fragment(themerr, "jackal-hero--centered")
require_fragment(themerr, %(href="https://themerr.lizardbyte.dev/ThemerrDB/"))

koko = read_page(site_dir, "koko/index.html")
require_fragment(koko, %(data-jackal-palette="koko"))
require_fragment(koko, "jackal-media--bare")
require_fragment(koko, "See the source code and current work")

catalog = read_page(site_dir, "catalog/index.html")
require_fragment(catalog, %(src="#{baseurl}/assets/example/catalog.js"))
require_fragment(catalog, %(href="#{baseurl}/catalog/index.json"))

orgs = JSON.parse(File.read(File.join(site_dir, "catalog/index.json"))).map { |entry| entry.fetch("organization") }
abort "Catalog JSON contains unexpected organizations" unless orgs.sort == %w[KokoStreamTV SunshineStream Themerr]

%w[assets/jackal/theme.js assets/jackal/jackal.css assets/jackal/product.css
   assets/jackal/fonts/manrope.woff2 assets/example/catalog.js].each do |path|
  abort "Missing static asset #{path}" unless File.file?(File.join(site_dir, path))
end

puts "Verified #{pages.size} pages, their URLs and assets, and the catalog JSON."
