
load("@build_bazel_rules_nodejs//:index.bzl", "nodejs_binary")
load("//tools/bzl:js.bzl", "polygerrit_plugin")
load("@npm_bazel_rollup//:index.bzl", "rollup_bundle")


polygerrit_plugin(
    name = "image-diff",
    app = "plugin-bundle.js",
)

filegroup(
  name = "node_modules",
  srcs = glob(
    include = [
      "node_modules/**/*.js",
    ],
    exclude = [
      "node_modules/**/test/**",
      "node_modules/**/docs/**",
      # Files with spaces in the name are not legal Bazel labels
      "node_modules/**/* */**",
      "node_modules/**/* *",
    ],
  ),
)

nodejs_binary(
    name = "rollup_bin",
    entry_point = ":node_modules/rollup/dist/bin/rollup",
    # Point bazel to your node_modules to find the entry point
    node_modules = ":node_modules",
)

rollup_bundle(
    name = "plugin-bundle",
    srcs = glob([
        "**/*.js",
    ]) + [":node_modules"],
    config_file = "rollup.config.js",
    entry_point = "plugin.js",
    format = "iife",
    rollup_bin = ":rollup_bin",
    sourcemap = "hidden",
    deps = [
        "@tools_npm//rollup-plugin-node-resolve",
    ],
)