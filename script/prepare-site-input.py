"""Prepare checkout and generated artifact inputs for the Jekyll build."""

import os
import shutil
from pathlib import Path


def directory_inside(root, value):
    """Resolve an existing directory relative to the checkout."""
    path = (root / value).resolve()
    if "\n" in str(path) or "\r" in str(path) or not path.is_relative_to(root) or not path.is_dir():
        raise SystemExit(f"Expected a directory inside the checkout: {value!r}")
    return path


def overlay_generated(source, generated):
    """Copy generated regular files into the site's source tree."""
    entries = list(generated.rglob("*"))
    for entry in entries:
        relative = entry.relative_to(generated)
        target = (source / relative).resolve()
        if entry.is_symlink() or not target.is_relative_to(source):
            raise SystemExit(f"Unsupported generated path: {relative}")
        if ".git" in relative.parts or ".git" in target.relative_to(source).parts:
            raise SystemExit(f"Unsupported generated path: {relative}")
    shutil.copytree(generated, source, dirs_exist_ok=True)


def main():
    """Validate paths and optionally unpack and overlay a same-run artifact."""
    checkout = (Path(os.environ["GITHUB_WORKSPACE"]) / "project").resolve()
    source = directory_inside(checkout, os.environ["SITE_SOURCE"])
    bundle = directory_inside(checkout, os.environ["BUNDLE_DIR"])
    archive_name = os.environ["EXTRACT_ARCHIVE"]
    temp = Path(os.environ["RUNNER_TEMP"])

    if os.environ["SITE_ARTIFACT"]:
        generated = temp / "jackal-generated"
        if archive_name:
            archive = generated / archive_name
            if Path(archive_name).name != archive_name or not archive.is_file() or archive.is_symlink():
                raise SystemExit("extract_archive must name a file at the root of site_artifact")
            generated = temp / "jackal-extracted"
            if archive.suffix.lower() == ".zip":
                shutil.unpack_archive(archive, generated, format="zip")
            elif archive.name.endswith((".tar", ".tar.gz", ".tgz")):
                shutil.unpack_archive(archive, generated, filter="data")
            else:
                raise SystemExit("extract_archive must use ZIP, TAR or TAR.GZ")
        overlay_generated(source, generated)
    elif archive_name:
        raise SystemExit("extract_archive requires site_artifact")

    if not (bundle / "Gemfile").is_file():
        raise SystemExit(f"No Gemfile found in {bundle.relative_to(checkout)}")
    with open(os.environ["GITHUB_OUTPUT"], "a", encoding="utf-8") as output:
        output.write(f"source_dir={source}\nbundle_dir={bundle}\n")


if __name__ == "__main__":
    main()
