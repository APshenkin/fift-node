const ffi = require('ffi');
const path = require('path');
const ArrayType = require('ref-array');

const StringArray = ArrayType('CString');

const { platform } = process;
let fiftlibLoc = null;

if (platform === 'darwin') {
  fiftlibLoc = path.join(__dirname, '/lib/libfiftlib.dylib');
} else if (platform === 'win32') {
  fiftlibLoc = path.join(__dirname, '/lib/fiftlib.dll');

  // add /lib to dll directory (for windows we need linked libraries)
  const kernel32 = ffi.Library('kernel32', {
    SetDllDirectoryA: ['bool', ['string']],
  });
  kernel32.SetDllDirectoryA(path.join(__dirname, '/lib'));
} else if (platform === 'linux') {
  fiftlibLoc = path.join(__dirname, '/lib/libfiftlib.so');
} else {
  throw new Error('unsupported platform for libfift');
}

const callback = ffi.Function('void', [StringArray, 'CString']);

const fiftLib = ffi.Library(fiftlibLoc, {
  run: ['void', ['CString', 'CString', StringArray, 'int', StringArray, 'int', StringArray, 'int', callback]],
});

module.exports = fiftLib;
