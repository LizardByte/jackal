# frozen_string_literal: true

Gem::Specification.new do |spec|
  spec.name = "jekyll-theme-jackal"
  spec.version = "0.1.0"
  spec.authors = ["LizardByte"]
  spec.summary = "A shared Jekyll theme for organizations and their project sites."
  spec.homepage = "https://github.com/LizardByte/jackal"
  spec.files = Dir.chdir(__dir__) do
    Dir.glob("{_layouts,_includes,assets}/**/*").select { |path| File.file?(path) } + %w[README.md LICENSE]
  end
  spec.required_ruby_version = ">= 2.7"
  spec.add_runtime_dependency "jekyll", ">= 3.10", "< 5"
end
