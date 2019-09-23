const ffi = require('ffi');
const ArrayType = require('ref-array');

const StringArray = ArrayType('CString');

const { platform } = process;
let fiftlibLoc = null;

if (platform === 'darwin') {
  fiftlibLoc = `${__dirname}/lib/libfiftlib.dylib`;
} else {
  throw new Error('unsupported platform for libfift');
}

const callback = ffi.Function('void', [StringArray, 'CString']);

const fiftLib = ffi.Library(fiftlibLoc, {
  run: ['void', ['CString', 'CString', StringArray, 'int', StringArray, 'int', callback]],
});

module.exports = fiftLib;
