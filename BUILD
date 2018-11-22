load("//tools/bzl:js.bzl", "bundle_assets", "polygerrit_plugin")

bundle_assets(
    name = "image-diff-assets",
    split = False,
    deps = [":resemblejs"],
)

polygerrit_plugin(
    name = "image-diff",
    srcs = glob(["**/*.html", "**/*.js"]),
    app = "plugin.html",
    assets = [":image-diff-assets"],
)
