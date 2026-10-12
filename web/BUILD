load("@aspect_rules_ts//ts:defs.bzl", "ts_config", "ts_project")
load("//tools/bzl:js.bzl", "gerrit_js_bundle", "web_test_runner")
load("//tools/js:eslint.bzl", "plugin_eslint")

package_group(
    name = "visibility",
    packages = ["//plugins/image-diff/..."],
)

package(default_visibility = [":visibility"])

ts_config(
    name = "tsconfig",
    src = "tsconfig.json",
    deps = [
        "//plugins:tsconfig-plugins-base",
    ],
)

ts_project(
    name = "image-diff-ts",
    srcs = glob(
        ["**/*.ts"],
        exclude = ["**/*test*"],
    ),
    incremental = True,
    out_dir = "_bazel_ts_out",
    tsconfig = ":tsconfig",
    deps = [
        "//plugins:node_modules",
    ],
)

ts_project(
    name = "image-diff-ts-tests",
    srcs = glob(["**/*.ts"]),
    incremental = True,
    out_dir = "_bazel_ts_out_tests",
    tsc = "//tools/node_tools:tsc-bin",
    tsconfig = ":tsconfig",
    visibility = ["//visibility:public"],
    deps = [
        "//plugins:node_modules",
        "//polygerrit-ui:node_modules",
    ],
)

gerrit_js_bundle(
    name = "image_diff",
    srcs = [":image-diff-ts"],
    entry_point = "_bazel_ts_out/plugin.js",
)

web_test_runner(
    name = "karma_test",
    srcs = ["karma_test.sh"],
    data = [
        ":image-diff-ts-tests",
        ":tsconfig",
        "//plugins:node_modules",
        "//polygerrit-ui:node_modules",
    ],
)

plugin_eslint()
