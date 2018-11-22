load("//tools/bzl:js.bzl", "bundle_assets", "polygerrit_plugin")

bundle_assets(
    name = "image-diff-assets",
    srcs = glob(["gr-editor/codemirror-assets.html"]),
    app = "gr-editor/codemirror-assets.html",
    split = False,
    deps = ["//lib/js:resemblejs"],
)

polygerrit_plugin(
    name = "image-diff",
    srcs = glob(["**/*.html", "**/*.js"]),
    app = "plugin.html",
    assets = [":image-diff-assets"],
)
