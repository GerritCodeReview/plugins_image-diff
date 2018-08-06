# Image Diff

A plugin that provides a rich image diffing experience in PolyGerrit.
Currently, the plugin features two modes: Highlight Mode and Onion Skin.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

[Yarn](https://yarnpkg.com/en/) - Node package manager

### Installing

Use Homebrew to install yarn on macOS:

'''
brew install yarn
'''

else reference [here](https://yarnpkg.com/en/docs/install#mac-stable) for instruction on how to install on other systems.

Clone the repo and run

'''
yarn install
'''

to install the dependencies.

## Highlight Mode

![Highlight example](gr-resemble-diff-mode/example.png)

This mode uses the [Resemble.JS](https://github.com/HuddleEng/Resemble.js?files=1)(1.2.1) library in its development
The following features are included in this mode:

* Percentage of difference between the images
* Ability to ignore color in the comparison
* Ability to make the diff color more discernible
* Change the diff color
* View the diff in full screen

## Onion Skin

## Testing

This plugin uses [polymer-cli](https://www.polymer-project.org/1.0/docs/tools/polymer-cli#install) to test.