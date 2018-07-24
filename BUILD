load("//tools/bzl:js.bzl", "bundle_assets", "polygerrit_plugin")

polygerrit_plugin(
    name = "image-diff",
    srcs = glob(["**/*.html", "**/*.js"]),
    app = "plugin.html",
    deps = ["//lib/js:resemblejs"],
)

bundle_assets(
    name = "resemble-assets",
    srcs = glob(["gr-resemble-diff-mode/resemble-assets.html"]),
    app = "gr-resemble-diff-mode/resemble-assets.html",
    deps = ["//lib/js:resemblejs"],
    split = False,
)