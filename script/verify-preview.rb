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
  product = path.split("/").first
  if %w[sunshine themerr koko].include?(product)
    require_fragment(html, %(href="#{baseurl}/assets/jackal/landing/#{product}.css"))
    require_fragment(html, %(src="#{baseurl}/assets/jackal/landing/theme.js"))
    require_fragment(html, %(href="#{baseurl}/#{product}/"))
    require_fragment(html, 'class="footer-top"')
  else
    require_fragment(html, %(href="#{baseurl}/assets/jackal/jackal.css"))
    require_fragment(html, %(src="#{baseurl}/assets/jackal/theme.js"))
  end
  require_fragment(html, %(href="#{umbrella_url.sub(%r{/$}, "")}/support/"))
  public_path = path.delete_suffix("index.html")
  require_fragment(html, %(rel="canonical" href="#{origin}#{baseurl}/#{public_path}"))
end

home = read_page(site_dir, "index.html")
require_fragment(home, %(href="#projects"))
require_fragment(home, %(href="#{baseurl}/sunshine/"))

sunshine = read_page(site_dir, "sunshine/index.html")
require_fragment(sunshine, 'class="stream-scene"')
require_fragment(sunshine, 'class="platform-strip wrap"')
require_fragment(sunshine, 'class="download-grid"')
require_fragment(sunshine, %(src="#{baseurl}/assets/example/sunshine.js"))
require_fragment(sunshine, "sunshine-web-ui-dark.jpg")
require_fragment(sunshine, %(href="#download"))

themerr = read_page(site_dir, "themerr/index.html")
require_fragment(themerr, %(data-default-theme="dark"))
require_fragment(themerr, 'class="shell hero-content"')
require_fragment(themerr, 'class="start-panel"')
require_fragment(themerr, %(href="https://themerr.lizardbyte.dev/ThemerrDB/"))

koko = read_page(site_dir, "koko/index.html")
require_fragment(koko, 'class="hero-art"')
require_fragment(koko, 'class="shell project-strip"')
require_fragment(koko, 'class="media-grid"')
require_fragment(koko, 'class="development-panel"')

catalog = read_page(site_dir, "catalog/index.html")
require_fragment(catalog, %(src="#{baseurl}/assets/example/catalog.js"))
require_fragment(catalog, %(href="#{baseurl}/catalog/index.json"))

orgs = JSON.parse(File.read(File.join(site_dir, "catalog/index.json"))).map { |entry| entry.fetch("organization") }
abort "Catalog JSON contains unexpected organizations" unless orgs.sort == %w[KokoStreamTV SunshineStream Themerr]

%w[assets/jackal/theme.js assets/jackal/jackal.css assets/jackal/landing/theme.js
   assets/jackal/landing/sunshine.css assets/jackal/landing/themerr.css assets/jackal/landing/koko.css
   assets/jackal/fonts/manrope.woff2 assets/example/catalog.js assets/example/sunshine.js].each do |path|
  abort "Missing static asset #{path}" unless File.file?(File.join(site_dir, path))
end

puts "Verified #{pages.size} pages, their URLs and assets, and the catalog JSON."
