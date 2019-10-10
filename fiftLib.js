const ffi = require('ffi');
const path = require('path');
const ArrayType = require('ref-array');

const StringArray = ArrayType('CString');

const { platform } = process;
let fiftlibLoc = null;

// Hack for electron asar package
const basePath = __dirname.replace('app.asar', 'app.asar.unpacked');

if (platform === 'darwin') {
  fiftlibLoc = path.join(basePath, '/lib/libfiftlib.dylib');
} else if (platform === 'win32') {
  fiftlibLoc = path.join(basePath, '/lib/fiftlib.dll');

  // add ./lib to dll directory (for windows we need linked libraries)
  process.env.PATH = process.env.PATH === '' ? path.join(basePath, '/lib') : `${process.env.PATH};${path.join(basePath, '/lib')}`;
} else if (platform === 'linux') {
  fiftlibLoc = path.join(basePath, '/lib/libfiftlib.so');
} else {
  throw new Error('unsupported platform for libfift');
}

const callback = ffi.Function('void', [StringArray, 'CString']);

const fiftLib = ffi.Library(fiftlibLoc, {
  run: ['void', ['CString', 'CString', StringArray, 'int', StringArray, 'int', StringArray, 'int', callback]],
});

module.exports = fiftLib;
