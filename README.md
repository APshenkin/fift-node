# fift-node
Node JS bindings for Fift compiler (for Telegram Open Network). You can run Fift from your JS code and receive output and files directly in code without FS.

Current TON implementation don't allow to run Fift programmatically. So I created a small patch for it [here](https://github.com/APshenkin/ton)
It allows to create shared library that this project use.

The library is currently compiled only for Mac OS and Windows x64.

Binding are created using [FFI project](https://www.npmjs.com/package/node-ffi)

## Features
* run Fift programmatically
* receive result directly from code (you don't need to read files)
* ability to pass hex strings as arguments (custom word in Fift)
* pass files to your Fift run
* predefined methods to create wallet, create message to testgiver, create message to send grams

## Installation
```Shell
$ npm install --save fift-node
```

## Usage
Check `test` folder

## Current State
THIS IS NOT FOR COMMERTIAL USE, BECAUSE IT MAY BE UNSTABLE!!!
