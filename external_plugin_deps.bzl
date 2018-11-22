load("//tools/bzl:js.bzl", "bower_archive")

def external_plugin_deps():
    bower_archive(
        name = "resemblejs",
        package = "rsmbl/Resemble.js",
        version = "2.10.2",
        sha1 = "324444ea79509fd53f9947b947a0365adba14f64",
    )
