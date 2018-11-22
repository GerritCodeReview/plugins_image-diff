load("//tools/bzl:js.bzl", "bower_archive", "bower_component")

def external_plugin_deps():
    bower_component(
        name = "resemblejs",
        license = "//lib:LICENSE-DO_NOT_DISTRIBUTE",
    )

    bower_archive(
        name = "resemblejs",
        package = "rsmbl/Resemble.js",
        version = "2.10.2",
        sha1 = "324444ea79509fd53f9947b947a0365adba14f64",
    )
