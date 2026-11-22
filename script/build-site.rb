# frozen_string_literal: true

require "fileutils"
require "jekyll"

# Load Bundler's Jekyll plugins as the Jekyll executable does.
Jekyll::PluginManager.require_from_bundler

temp = ENV.fetch("RUNNER_TEMP")
destination = File.join(temp, "jackal-site")
options = {
  "source" => ENV.fetch("JEKYLL_SOURCE"),
  "destination" => destination,
  "incremental" => false,
  "strict_front_matter" => true,
}
config_files = ENV.fetch("CONFIG_FILES", "").split(",").map(&:strip)
options["config"] = config_files unless config_files.empty?
site = Jekyll::Site.new(Jekyll.configuration(options))
Jekyll::Commands::Build.build(site, site.config)

return unless ENV["PREVIEW"] == "true"

# GitHub Pages supplies the mount path in production. Replicate that path
# locally without changing the rendered site or its configured URLs.
baseurl = site.config["baseurl"].to_s.sub(%r{/\z}, "")
segments = baseurl.split("/").drop(1)
valid_segment = ->(part) { part.match?(/\A[A-Za-z0-9._~-]+\z/) && !%w[. ..].include?(part) }
unless baseurl.empty? || (baseurl.start_with?("/") && segments.all?(&valid_segment))
  abort "baseurl must be an empty string or a URL path with simple segments"
end

preview = File.join(temp, "jackal-preview")
if baseurl.empty?
  FileUtils.mv(destination, preview)
else
  site_path = File.join(preview, *segments)
  FileUtils.mkdir_p(File.dirname(site_path))
  FileUtils.mv(destination, site_path)
  File.write(File.join(preview, "index.html"), <<~HTML)
    <!doctype html>
    <html lang="en">
    <meta charset="utf-8">
    <title>Jackal preview</title>
    <meta http-equiv="refresh" content="0; url=#{baseurl}/">
    <a href="#{baseurl}/">Open the preview</a>
    </html>
  HTML
end
