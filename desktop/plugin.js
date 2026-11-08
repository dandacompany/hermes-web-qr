var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
  try {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  } catch (e) {
    throw mod = 0, e;
  }
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// node_modules/qrcode/lib/can-promise.js
var require_can_promise = __commonJS({
  "node_modules/qrcode/lib/can-promise.js"(exports, module) {
    module.exports = function() {
      return typeof Promise === "function" && Promise.prototype && Promise.prototype.then;
    };
  }
});

// node_modules/qrcode/lib/core/utils.js
var require_utils = __commonJS({
  "node_modules/qrcode/lib/core/utils.js"(exports) {
    var toSJISFunction;
    var CODEWORDS_COUNT = [
      0,
      // Not used
      26,
      44,
      70,
      100,
      134,
      172,
      196,
      242,
      292,
      346,
      404,
      466,
      532,
      581,
      655,
      733,
      815,
      901,
      991,
      1085,
      1156,
      1258,
      1364,
      1474,
      1588,
      1706,
      1828,
      1921,
      2051,
      2185,
      2323,
      2465,
      2611,
      2761,
      2876,
      3034,
      3196,
      3362,
      3532,
      3706
    ];
    exports.getSymbolSize = function getSymbolSize(version) {
      if (!version) throw new Error('"version" cannot be null or undefined');
      if (version < 1 || version > 40) throw new Error('"version" should be in range from 1 to 40');
      return version * 4 + 17;
    };
    exports.getSymbolTotalCodewords = function getSymbolTotalCodewords(version) {
      return CODEWORDS_COUNT[version];
    };
    exports.getBCHDigit = function(data) {
      let digit = 0;
      while (data !== 0) {
        digit++;
        data >>>= 1;
      }
      return digit;
    };
    exports.setToSJISFunction = function setToSJISFunction(f) {
      if (typeof f !== "function") {
        throw new Error('"toSJISFunc" is not a valid function.');
      }
      toSJISFunction = f;
    };
    exports.isKanjiModeEnabled = function() {
      return typeof toSJISFunction !== "undefined";
    };
    exports.toSJIS = function toSJIS(kanji) {
      return toSJISFunction(kanji);
    };
  }
});

// node_modules/qrcode/lib/core/error-correction-level.js
var require_error_correction_level = __commonJS({
  "node_modules/qrcode/lib/core/error-correction-level.js"(exports) {
    exports.L = { bit: 1 };
    exports.M = { bit: 0 };
    exports.Q = { bit: 3 };
    exports.H = { bit: 2 };
    function fromString(string) {
      if (typeof string !== "string") {
        throw new Error("Param is not a string");
      }
      const lcStr = string.toLowerCase();
      switch (lcStr) {
        case "l":
        case "low":
          return exports.L;
        case "m":
        case "medium":
          return exports.M;
        case "q":
        case "quartile":
          return exports.Q;
        case "h":
        case "high":
          return exports.H;
        default:
          throw new Error("Unknown EC Level: " + string);
      }
    }
    exports.isValid = function isValid(level) {
      return level && typeof level.bit !== "undefined" && level.bit >= 0 && level.bit < 4;
    };
    exports.from = function from(value, defaultValue) {
      if (exports.isValid(value)) {
        return value;
      }
      try {
        return fromString(value);
      } catch (e) {
        return defaultValue;
      }
    };
  }
});

// node_modules/qrcode/lib/core/bit-buffer.js
var require_bit_buffer = __commonJS({
  "node_modules/qrcode/lib/core/bit-buffer.js"(exports, module) {
    function BitBuffer() {
      this.buffer = [];
      this.length = 0;
    }
    BitBuffer.prototype = {
      get: function(index) {
        const bufIndex = Math.floor(index / 8);
        return (this.buffer[bufIndex] >>> 7 - index % 8 & 1) === 1;
      },
      put: function(num, length) {
        for (let i = 0; i < length; i++) {
          this.putBit((num >>> length - i - 1 & 1) === 1);
        }
      },
      getLengthInBits: function() {
        return this.length;
      },
      putBit: function(bit) {
        const bufIndex = Math.floor(this.length / 8);
        if (this.buffer.length <= bufIndex) {
          this.buffer.push(0);
        }
        if (bit) {
          this.buffer[bufIndex] |= 128 >>> this.length % 8;
        }
        this.length++;
      }
    };
    module.exports = BitBuffer;
  }
});

// node_modules/qrcode/lib/core/bit-matrix.js
var require_bit_matrix = __commonJS({
  "node_modules/qrcode/lib/core/bit-matrix.js"(exports, module) {
    function BitMatrix(size) {
      if (!size || size < 1) {
        throw new Error("BitMatrix size must be defined and greater than 0");
      }
      this.size = size;
      this.data = new Uint8Array(size * size);
      this.reservedBit = new Uint8Array(size * size);
    }
    BitMatrix.prototype.set = function(row, col, value, reserved) {
      const index = row * this.size + col;
      this.data[index] = value;
      if (reserved) this.reservedBit[index] = true;
    };
    BitMatrix.prototype.get = function(row, col) {
      return this.data[row * this.size + col];
    };
    BitMatrix.prototype.xor = function(row, col, value) {
      this.data[row * this.size + col] ^= value;
    };
    BitMatrix.prototype.isReserved = function(row, col) {
      return this.reservedBit[row * this.size + col];
    };
    module.exports = BitMatrix;
  }
});

// node_modules/qrcode/lib/core/alignment-pattern.js
var require_alignment_pattern = __commonJS({
  "node_modules/qrcode/lib/core/alignment-pattern.js"(exports) {
    var getSymbolSize = require_utils().getSymbolSize;
    exports.getRowColCoords = function getRowColCoords(version) {
      if (version === 1) return [];
      const posCount = Math.floor(version / 7) + 2;
      const size = getSymbolSize(version);
      const intervals = size === 145 ? 26 : Math.ceil((size - 13) / (2 * posCount - 2)) * 2;
      const positions = [size - 7];
      for (let i = 1; i < posCount - 1; i++) {
        positions[i] = positions[i - 1] - intervals;
      }
      positions.push(6);
      return positions.reverse();
    };
    exports.getPositions = function getPositions(version) {
      const coords = [];
      const pos = exports.getRowColCoords(version);
      const posLength = pos.length;
      for (let i = 0; i < posLength; i++) {
        for (let j = 0; j < posLength; j++) {
          if (i === 0 && j === 0 || // top-left
          i === 0 && j === posLength - 1 || // bottom-left
          i === posLength - 1 && j === 0) {
            continue;
          }
          coords.push([pos[i], pos[j]]);
        }
      }
      return coords;
    };
  }
});

// node_modules/qrcode/lib/core/finder-pattern.js
var require_finder_pattern = __commonJS({
  "node_modules/qrcode/lib/core/finder-pattern.js"(exports) {
    var getSymbolSize = require_utils().getSymbolSize;
    var FINDER_PATTERN_SIZE = 7;
    exports.getPositions = function getPositions(version) {
      const size = getSymbolSize(version);
      return [
        // top-left
        [0, 0],
        // top-right
        [size - FINDER_PATTERN_SIZE, 0],
        // bottom-left
        [0, size - FINDER_PATTERN_SIZE]
      ];
    };
  }
});

// node_modules/qrcode/lib/core/mask-pattern.js
var require_mask_pattern = __commonJS({
  "node_modules/qrcode/lib/core/mask-pattern.js"(exports) {
    exports.Patterns = {
      PATTERN000: 0,
      PATTERN001: 1,
      PATTERN010: 2,
      PATTERN011: 3,
      PATTERN100: 4,
      PATTERN101: 5,
      PATTERN110: 6,
      PATTERN111: 7
    };
    var PenaltyScores = {
      N1: 3,
      N2: 3,
      N3: 40,
      N4: 10
    };
    exports.isValid = function isValid(mask) {
      return mask != null && mask !== "" && !isNaN(mask) && mask >= 0 && mask <= 7;
    };
    exports.from = function from(value) {
      return exports.isValid(value) ? parseInt(value, 10) : void 0;
    };
    exports.getPenaltyN1 = function getPenaltyN1(data) {
      const size = data.size;
      let points = 0;
      let sameCountCol = 0;
      let sameCountRow = 0;
      let lastCol = null;
      let lastRow = null;
      for (let row = 0; row < size; row++) {
        sameCountCol = sameCountRow = 0;
        lastCol = lastRow = null;
        for (let col = 0; col < size; col++) {
          let module2 = data.get(row, col);
          if (module2 === lastCol) {
            sameCountCol++;
          } else {
            if (sameCountCol >= 5) points += PenaltyScores.N1 + (sameCountCol - 5);
            lastCol = module2;
            sameCountCol = 1;
          }
          module2 = data.get(col, row);
          if (module2 === lastRow) {
            sameCountRow++;
          } else {
            if (sameCountRow >= 5) points += PenaltyScores.N1 + (sameCountRow - 5);
            lastRow = module2;
            sameCountRow = 1;
          }
        }
        if (sameCountCol >= 5) points += PenaltyScores.N1 + (sameCountCol - 5);
        if (sameCountRow >= 5) points += PenaltyScores.N1 + (sameCountRow - 5);
      }
      return points;
    };
    exports.getPenaltyN2 = function getPenaltyN2(data) {
      const size = data.size;
      let points = 0;
      for (let row = 0; row < size - 1; row++) {
        for (let col = 0; col < size - 1; col++) {
          const last = data.get(row, col) + data.get(row, col + 1) + data.get(row + 1, col) + data.get(row + 1, col + 1);
          if (last === 4 || last === 0) points++;
        }
      }
      return points * PenaltyScores.N2;
    };
    exports.getPenaltyN3 = function getPenaltyN3(data) {
      const size = data.size;
      let points = 0;
      let bitsCol = 0;
      let bitsRow = 0;
      for (let row = 0; row < size; row++) {
        bitsCol = bitsRow = 0;
        for (let col = 0; col < size; col++) {
          bitsCol = bitsCol << 1 & 2047 | data.get(row, col);
          if (col >= 10 && (bitsCol === 1488 || bitsCol === 93)) points++;
          bitsRow = bitsRow << 1 & 2047 | data.get(col, row);
          if (col >= 10 && (bitsRow === 1488 || bitsRow === 93)) points++;
        }
      }
      return points * PenaltyScores.N3;
    };
    exports.getPenaltyN4 = function getPenaltyN4(data) {
      let darkCount = 0;
      const modulesCount = data.data.length;
      for (let i = 0; i < modulesCount; i++) darkCount += data.data[i];
      const k = Math.abs(Math.ceil(darkCount * 100 / modulesCount / 5) - 10);
      return k * PenaltyScores.N4;
    };
    function getMaskAt(maskPattern, i, j) {
      switch (maskPattern) {
        case exports.Patterns.PATTERN000:
          return (i + j) % 2 === 0;
        case exports.Patterns.PATTERN001:
          return i % 2 === 0;
        case exports.Patterns.PATTERN010:
          return j % 3 === 0;
        case exports.Patterns.PATTERN011:
          return (i + j) % 3 === 0;
        case exports.Patterns.PATTERN100:
          return (Math.floor(i / 2) + Math.floor(j / 3)) % 2 === 0;
        case exports.Patterns.PATTERN101:
          return i * j % 2 + i * j % 3 === 0;
        case exports.Patterns.PATTERN110:
          return (i * j % 2 + i * j % 3) % 2 === 0;
        case exports.Patterns.PATTERN111:
          return (i * j % 3 + (i + j) % 2) % 2 === 0;
        default:
          throw new Error("bad maskPattern:" + maskPattern);
      }
    }
    exports.applyMask = function applyMask(pattern, data) {
      const size = data.size;
      for (let col = 0; col < size; col++) {
        for (let row = 0; row < size; row++) {
          if (data.isReserved(row, col)) continue;
          data.xor(row, col, getMaskAt(pattern, row, col));
        }
      }
    };
    exports.getBestMask = function getBestMask(data, setupFormatFunc) {
      const numPatterns = Object.keys(exports.Patterns).length;
      let bestPattern = 0;
      let lowerPenalty = Infinity;
      for (let p = 0; p < numPatterns; p++) {
        setupFormatFunc(p);
        exports.applyMask(p, data);
        const penalty = exports.getPenaltyN1(data) + exports.getPenaltyN2(data) + exports.getPenaltyN3(data) + exports.getPenaltyN4(data);
        exports.applyMask(p, data);
        if (penalty < lowerPenalty) {
          lowerPenalty = penalty;
          bestPattern = p;
        }
      }
      return bestPattern;
    };
  }
});

// node_modules/qrcode/lib/core/error-correction-code.js
var require_error_correction_code = __commonJS({
  "node_modules/qrcode/lib/core/error-correction-code.js"(exports) {
    var ECLevel = require_error_correction_level();
    var EC_BLOCKS_TABLE = [
      // L  M  Q  H
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      1,
      2,
      2,
      1,
      2,
      2,
      4,
      1,
      2,
      4,
      4,
      2,
      4,
      4,
      4,
      2,
      4,
      6,
      5,
      2,
      4,
      6,
      6,
      2,
      5,
      8,
      8,
      4,
      5,
      8,
      8,
      4,
      5,
      8,
      11,
      4,
      8,
      10,
      11,
      4,
      9,
      12,
      16,
      4,
      9,
      16,
      16,
      6,
      10,
      12,
      18,
      6,
      10,
      17,
      16,
      6,
      11,
      16,
      19,
      6,
      13,
      18,
      21,
      7,
      14,
      21,
      25,
      8,
      16,
      20,
      25,
      8,
      17,
      23,
      25,
      9,
      17,
      23,
      34,
      9,
      18,
      25,
      30,
      10,
      20,
      27,
      32,
      12,
      21,
      29,
      35,
      12,
      23,
      34,
      37,
      12,
      25,
      34,
      40,
      13,
      26,
      35,
      42,
      14,
      28,
      38,
      45,
      15,
      29,
      40,
      48,
      16,
      31,
      43,
      51,
      17,
      33,
      45,
      54,
      18,
      35,
      48,
      57,
      19,
      37,
      51,
      60,
      19,
      38,
      53,
      63,
      20,
      40,
      56,
      66,
      21,
      43,
      59,
      70,
      22,
      45,
      62,
      74,
      24,
      47,
      65,
      77,
      25,
      49,
      68,
      81
    ];
    var EC_CODEWORDS_TABLE = [
      // L  M  Q  H
      7,
      10,
      13,
      17,
      10,
      16,
      22,
      28,
      15,
      26,
      36,
      44,
      20,
      36,
      52,
      64,
      26,
      48,
      72,
      88,
      36,
      64,
      96,
      112,
      40,
      72,
      108,
      130,
      48,
      88,
      132,
      156,
      60,
      110,
      160,
      192,
      72,
      130,
      192,
      224,
      80,
      150,
      224,
      264,
      96,
      176,
      260,
      308,
      104,
      198,
      288,
      352,
      120,
      216,
      320,
      384,
      132,
      240,
      360,
      432,
      144,
      280,
      408,
      480,
      168,
      308,
      448,
      532,
      180,
      338,
      504,
      588,
      196,
      364,
      546,
      650,
      224,
      416,
      600,
      700,
      224,
      442,
      644,
      750,
      252,
      476,
      690,
      816,
      270,
      504,
      750,
      900,
      300,
      560,
      810,
      960,
      312,
      588,
      870,
      1050,
      336,
      644,
      952,
      1110,
      360,
      700,
      1020,
      1200,
      390,
      728,
      1050,
      1260,
      420,
      784,
      1140,
      1350,
      450,
      812,
      1200,
      1440,
      480,
      868,
      1290,
      1530,
      510,
      924,
      1350,
      1620,
      540,
      980,
      1440,
      1710,
      570,
      1036,
      1530,
      1800,
      570,
      1064,
      1590,
      1890,
      600,
      1120,
      1680,
      1980,
      630,
      1204,
      1770,
      2100,
      660,
      1260,
      1860,
      2220,
      720,
      1316,
      1950,
      2310,
      750,
      1372,
      2040,
      2430
    ];
    exports.getBlocksCount = function getBlocksCount(version, errorCorrectionLevel) {
      switch (errorCorrectionLevel) {
        case ECLevel.L:
          return EC_BLOCKS_TABLE[(version - 1) * 4 + 0];
        case ECLevel.M:
          return EC_BLOCKS_TABLE[(version - 1) * 4 + 1];
        case ECLevel.Q:
          return EC_BLOCKS_TABLE[(version - 1) * 4 + 2];
        case ECLevel.H:
          return EC_BLOCKS_TABLE[(version - 1) * 4 + 3];
        default:
          return void 0;
      }
    };
    exports.getTotalCodewordsCount = function getTotalCodewordsCount(version, errorCorrectionLevel) {
      switch (errorCorrectionLevel) {
        case ECLevel.L:
          return EC_CODEWORDS_TABLE[(version - 1) * 4 + 0];
        case ECLevel.M:
          return EC_CODEWORDS_TABLE[(version - 1) * 4 + 1];
        case ECLevel.Q:
          return EC_CODEWORDS_TABLE[(version - 1) * 4 + 2];
        case ECLevel.H:
          return EC_CODEWORDS_TABLE[(version - 1) * 4 + 3];
        default:
          return void 0;
      }
    };
  }
});

// node_modules/qrcode/lib/core/galois-field.js
var require_galois_field = __commonJS({
  "node_modules/qrcode/lib/core/galois-field.js"(exports) {
    var EXP_TABLE = new Uint8Array(512);
    var LOG_TABLE = new Uint8Array(256);
    (function initTables() {
      let x = 1;
      for (let i = 0; i < 255; i++) {
        EXP_TABLE[i] = x;
        LOG_TABLE[x] = i;
        x <<= 1;
        if (x & 256) {
          x ^= 285;
        }
      }
      for (let i = 255; i < 512; i++) {
        EXP_TABLE[i] = EXP_TABLE[i - 255];
      }
    })();
    exports.log = function log(n) {
      if (n < 1) throw new Error("log(" + n + ")");
      return LOG_TABLE[n];
    };
    exports.exp = function exp(n) {
      return EXP_TABLE[n];
    };
    exports.mul = function mul(x, y) {
      if (x === 0 || y === 0) return 0;
      return EXP_TABLE[LOG_TABLE[x] + LOG_TABLE[y]];
    };
  }
});

// node_modules/qrcode/lib/core/polynomial.js
var require_polynomial = __commonJS({
  "node_modules/qrcode/lib/core/polynomial.js"(exports) {
    var GF = require_galois_field();
    exports.mul = function mul(p1, p2) {
      const coeff = new Uint8Array(p1.length + p2.length - 1);
      for (let i = 0; i < p1.length; i++) {
        for (let j = 0; j < p2.length; j++) {
          coeff[i + j] ^= GF.mul(p1[i], p2[j]);
        }
      }
      return coeff;
    };
    exports.mod = function mod(divident, divisor) {
      let result = new Uint8Array(divident);
      while (result.length - divisor.length >= 0) {
        const coeff = result[0];
        for (let i = 0; i < divisor.length; i++) {
          result[i] ^= GF.mul(divisor[i], coeff);
        }
        let offset = 0;
        while (offset < result.length && result[offset] === 0) offset++;
        result = result.slice(offset);
      }
      return result;
    };
    exports.generateECPolynomial = function generateECPolynomial(degree) {
      let poly = new Uint8Array([1]);
      for (let i = 0; i < degree; i++) {
        poly = exports.mul(poly, new Uint8Array([1, GF.exp(i)]));
      }
      return poly;
    };
  }
});

// node_modules/qrcode/lib/core/reed-solomon-encoder.js
var require_reed_solomon_encoder = __commonJS({
  "node_modules/qrcode/lib/core/reed-solomon-encoder.js"(exports, module) {
    var Polynomial = require_polynomial();
    function ReedSolomonEncoder(degree) {
      this.genPoly = void 0;
      this.degree = degree;
      if (this.degree) this.initialize(this.degree);
    }
    ReedSolomonEncoder.prototype.initialize = function initialize(degree) {
      this.degree = degree;
      this.genPoly = Polynomial.generateECPolynomial(this.degree);
    };
    ReedSolomonEncoder.prototype.encode = function encode(data) {
      if (!this.genPoly) {
        throw new Error("Encoder not initialized");
      }
      const paddedData = new Uint8Array(data.length + this.degree);
      paddedData.set(data);
      const remainder = Polynomial.mod(paddedData, this.genPoly);
      const start = this.degree - remainder.length;
      if (start > 0) {
        const buff = new Uint8Array(this.degree);
        buff.set(remainder, start);
        return buff;
      }
      return remainder;
    };
    module.exports = ReedSolomonEncoder;
  }
});

// node_modules/qrcode/lib/core/version-check.js
var require_version_check = __commonJS({
  "node_modules/qrcode/lib/core/version-check.js"(exports) {
    exports.isValid = function isValid(version) {
      return !isNaN(version) && version >= 1 && version <= 40;
    };
  }
});

// node_modules/qrcode/lib/core/regex.js
var require_regex = __commonJS({
  "node_modules/qrcode/lib/core/regex.js"(exports) {
    var numeric = "[0-9]+";
    var alphanumeric = "[A-Z $%*+\\-./:]+";
    var kanji = "(?:[u3000-u303F]|[u3040-u309F]|[u30A0-u30FF]|[uFF00-uFFEF]|[u4E00-u9FAF]|[u2605-u2606]|[u2190-u2195]|u203B|[u2010u2015u2018u2019u2025u2026u201Cu201Du2225u2260]|[u0391-u0451]|[u00A7u00A8u00B1u00B4u00D7u00F7])+";
    kanji = kanji.replace(/u/g, "\\u");
    var byte = "(?:(?![A-Z0-9 $%*+\\-./:]|" + kanji + ")(?:.|[\r\n]))+";
    exports.KANJI = new RegExp(kanji, "g");
    exports.BYTE_KANJI = new RegExp("[^A-Z0-9 $%*+\\-./:]+", "g");
    exports.BYTE = new RegExp(byte, "g");
    exports.NUMERIC = new RegExp(numeric, "g");
    exports.ALPHANUMERIC = new RegExp(alphanumeric, "g");
    var TEST_KANJI = new RegExp("^" + kanji + "$");
    var TEST_NUMERIC = new RegExp("^" + numeric + "$");
    var TEST_ALPHANUMERIC = new RegExp("^[A-Z0-9 $%*+\\-./:]+$");
    exports.testKanji = function testKanji(str) {
      return TEST_KANJI.test(str);
    };
    exports.testNumeric = function testNumeric(str) {
      return TEST_NUMERIC.test(str);
    };
    exports.testAlphanumeric = function testAlphanumeric(str) {
      return TEST_ALPHANUMERIC.test(str);
    };
  }
});

// node_modules/qrcode/lib/core/mode.js
var require_mode = __commonJS({
  "node_modules/qrcode/lib/core/mode.js"(exports) {
    var VersionCheck = require_version_check();
    var Regex = require_regex();
    exports.NUMERIC = {
      id: "Numeric",
      bit: 1 << 0,
      ccBits: [10, 12, 14]
    };
    exports.ALPHANUMERIC = {
      id: "Alphanumeric",
      bit: 1 << 1,
      ccBits: [9, 11, 13]
    };
    exports.BYTE = {
      id: "Byte",
      bit: 1 << 2,
      ccBits: [8, 16, 16]
    };
    exports.KANJI = {
      id: "Kanji",
      bit: 1 << 3,
      ccBits: [8, 10, 12]
    };
    exports.MIXED = {
      bit: -1
    };
    exports.getCharCountIndicator = function getCharCountIndicator(mode, version) {
      if (!mode.ccBits) throw new Error("Invalid mode: " + mode);
      if (!VersionCheck.isValid(version)) {
        throw new Error("Invalid version: " + version);
      }
      if (version >= 1 && version < 10) return mode.ccBits[0];
      else if (version < 27) return mode.ccBits[1];
      return mode.ccBits[2];
    };
    exports.getBestModeForData = function getBestModeForData(dataStr) {
      if (Regex.testNumeric(dataStr)) return exports.NUMERIC;
      else if (Regex.testAlphanumeric(dataStr)) return exports.ALPHANUMERIC;
      else if (Regex.testKanji(dataStr)) return exports.KANJI;
      else return exports.BYTE;
    };
    exports.toString = function toString(mode) {
      if (mode && mode.id) return mode.id;
      throw new Error("Invalid mode");
    };
    exports.isValid = function isValid(mode) {
      return mode && mode.bit && mode.ccBits;
    };
    function fromString(string) {
      if (typeof string !== "string") {
        throw new Error("Param is not a string");
      }
      const lcStr = string.toLowerCase();
      switch (lcStr) {
        case "numeric":
          return exports.NUMERIC;
        case "alphanumeric":
          return exports.ALPHANUMERIC;
        case "kanji":
          return exports.KANJI;
        case "byte":
          return exports.BYTE;
        default:
          throw new Error("Unknown mode: " + string);
      }
    }
    exports.from = function from(value, defaultValue) {
      if (exports.isValid(value)) {
        return value;
      }
      try {
        return fromString(value);
      } catch (e) {
        return defaultValue;
      }
    };
  }
});

// node_modules/qrcode/lib/core/version.js
var require_version = __commonJS({
  "node_modules/qrcode/lib/core/version.js"(exports) {
    var Utils = require_utils();
    var ECCode = require_error_correction_code();
    var ECLevel = require_error_correction_level();
    var Mode = require_mode();
    var VersionCheck = require_version_check();
    var G18 = 1 << 12 | 1 << 11 | 1 << 10 | 1 << 9 | 1 << 8 | 1 << 5 | 1 << 2 | 1 << 0;
    var G18_BCH = Utils.getBCHDigit(G18);
    function getBestVersionForDataLength(mode, length, errorCorrectionLevel) {
      for (let currentVersion = 1; currentVersion <= 40; currentVersion++) {
        if (length <= exports.getCapacity(currentVersion, errorCorrectionLevel, mode)) {
          return currentVersion;
        }
      }
      return void 0;
    }
    function getReservedBitsCount(mode, version) {
      return Mode.getCharCountIndicator(mode, version) + 4;
    }
    function getTotalBitsFromDataArray(segments, version) {
      let totalBits = 0;
      segments.forEach(function(data) {
        const reservedBits = getReservedBitsCount(data.mode, version);
        totalBits += reservedBits + data.getBitsLength();
      });
      return totalBits;
    }
    function getBestVersionForMixedData(segments, errorCorrectionLevel) {
      for (let currentVersion = 1; currentVersion <= 40; currentVersion++) {
        const length = getTotalBitsFromDataArray(segments, currentVersion);
        if (length <= exports.getCapacity(currentVersion, errorCorrectionLevel, Mode.MIXED)) {
          return currentVersion;
        }
      }
      return void 0;
    }
    exports.from = function from(value, defaultValue) {
      if (VersionCheck.isValid(value)) {
        return parseInt(value, 10);
      }
      return defaultValue;
    };
    exports.getCapacity = function getCapacity(version, errorCorrectionLevel, mode) {
      if (!VersionCheck.isValid(version)) {
        throw new Error("Invalid QR Code version");
      }
      if (typeof mode === "undefined") mode = Mode.BYTE;
      const totalCodewords = Utils.getSymbolTotalCodewords(version);
      const ecTotalCodewords = ECCode.getTotalCodewordsCount(version, errorCorrectionLevel);
      const dataTotalCodewordsBits = (totalCodewords - ecTotalCodewords) * 8;
      if (mode === Mode.MIXED) return dataTotalCodewordsBits;
      const usableBits = dataTotalCodewordsBits - getReservedBitsCount(mode, version);
      switch (mode) {
        case Mode.NUMERIC:
          return Math.floor(usableBits / 10 * 3);
        case Mode.ALPHANUMERIC:
          return Math.floor(usableBits / 11 * 2);
        case Mode.KANJI:
          return Math.floor(usableBits / 13);
        case Mode.BYTE:
        default:
          return Math.floor(usableBits / 8);
      }
    };
    exports.getBestVersionForData = function getBestVersionForData(data, errorCorrectionLevel) {
      let seg;
      const ecl = ECLevel.from(errorCorrectionLevel, ECLevel.M);
      if (Array.isArray(data)) {
        if (data.length > 1) {
          return getBestVersionForMixedData(data, ecl);
        }
        if (data.length === 0) {
          return 1;
        }
        seg = data[0];
      } else {
        seg = data;
      }
      return getBestVersionForDataLength(seg.mode, seg.getLength(), ecl);
    };
    exports.getEncodedBits = function getEncodedBits(version) {
      if (!VersionCheck.isValid(version) || version < 7) {
        throw new Error("Invalid QR Code version");
      }
      let d = version << 12;
      while (Utils.getBCHDigit(d) - G18_BCH >= 0) {
        d ^= G18 << Utils.getBCHDigit(d) - G18_BCH;
      }
      return version << 12 | d;
    };
  }
});

// node_modules/qrcode/lib/core/format-info.js
var require_format_info = __commonJS({
  "node_modules/qrcode/lib/core/format-info.js"(exports) {
    var Utils = require_utils();
    var G15 = 1 << 10 | 1 << 8 | 1 << 5 | 1 << 4 | 1 << 2 | 1 << 1 | 1 << 0;
    var G15_MASK = 1 << 14 | 1 << 12 | 1 << 10 | 1 << 4 | 1 << 1;
    var G15_BCH = Utils.getBCHDigit(G15);
    exports.getEncodedBits = function getEncodedBits(errorCorrectionLevel, mask) {
      const data = errorCorrectionLevel.bit << 3 | mask;
      let d = data << 10;
      while (Utils.getBCHDigit(d) - G15_BCH >= 0) {
        d ^= G15 << Utils.getBCHDigit(d) - G15_BCH;
      }
      return (data << 10 | d) ^ G15_MASK;
    };
  }
});

// node_modules/qrcode/lib/core/numeric-data.js
var require_numeric_data = __commonJS({
  "node_modules/qrcode/lib/core/numeric-data.js"(exports, module) {
    var Mode = require_mode();
    function NumericData(data) {
      this.mode = Mode.NUMERIC;
      this.data = data.toString();
    }
    NumericData.getBitsLength = function getBitsLength(length) {
      return 10 * Math.floor(length / 3) + (length % 3 ? length % 3 * 3 + 1 : 0);
    };
    NumericData.prototype.getLength = function getLength() {
      return this.data.length;
    };
    NumericData.prototype.getBitsLength = function getBitsLength() {
      return NumericData.getBitsLength(this.data.length);
    };
    NumericData.prototype.write = function write(bitBuffer) {
      let i, group, value;
      for (i = 0; i + 3 <= this.data.length; i += 3) {
        group = this.data.substr(i, 3);
        value = parseInt(group, 10);
        bitBuffer.put(value, 10);
      }
      const remainingNum = this.data.length - i;
      if (remainingNum > 0) {
        group = this.data.substr(i);
        value = parseInt(group, 10);
        bitBuffer.put(value, remainingNum * 3 + 1);
      }
    };
    module.exports = NumericData;
  }
});

// node_modules/qrcode/lib/core/alphanumeric-data.js
var require_alphanumeric_data = __commonJS({
  "node_modules/qrcode/lib/core/alphanumeric-data.js"(exports, module) {
    var Mode = require_mode();
    var ALPHA_NUM_CHARS = [
      "0",
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "A",
      "B",
      "C",
      "D",
      "E",
      "F",
      "G",
      "H",
      "I",
      "J",
      "K",
      "L",
      "M",
      "N",
      "O",
      "P",
      "Q",
      "R",
      "S",
      "T",
      "U",
      "V",
      "W",
      "X",
      "Y",
      "Z",
      " ",
      "$",
      "%",
      "*",
      "+",
      "-",
      ".",
      "/",
      ":"
    ];
    function AlphanumericData(data) {
      this.mode = Mode.ALPHANUMERIC;
      this.data = data;
    }
    AlphanumericData.getBitsLength = function getBitsLength(length) {
      return 11 * Math.floor(length / 2) + 6 * (length % 2);
    };
    AlphanumericData.prototype.getLength = function getLength() {
      return this.data.length;
    };
    AlphanumericData.prototype.getBitsLength = function getBitsLength() {
      return AlphanumericData.getBitsLength(this.data.length);
    };
    AlphanumericData.prototype.write = function write(bitBuffer) {
      let i;
      for (i = 0; i + 2 <= this.data.length; i += 2) {
        let value = ALPHA_NUM_CHARS.indexOf(this.data[i]) * 45;
        value += ALPHA_NUM_CHARS.indexOf(this.data[i + 1]);
        bitBuffer.put(value, 11);
      }
      if (this.data.length % 2) {
        bitBuffer.put(ALPHA_NUM_CHARS.indexOf(this.data[i]), 6);
      }
    };
    module.exports = AlphanumericData;
  }
});

// node_modules/qrcode/lib/core/byte-data.js
var require_byte_data = __commonJS({
  "node_modules/qrcode/lib/core/byte-data.js"(exports, module) {
    var Mode = require_mode();
    function ByteData(data) {
      this.mode = Mode.BYTE;
      if (typeof data === "string") {
        this.data = new TextEncoder().encode(data);
      } else {
        this.data = new Uint8Array(data);
      }
    }
    ByteData.getBitsLength = function getBitsLength(length) {
      return length * 8;
    };
    ByteData.prototype.getLength = function getLength() {
      return this.data.length;
    };
    ByteData.prototype.getBitsLength = function getBitsLength() {
      return ByteData.getBitsLength(this.data.length);
    };
    ByteData.prototype.write = function(bitBuffer) {
      for (let i = 0, l = this.data.length; i < l; i++) {
        bitBuffer.put(this.data[i], 8);
      }
    };
    module.exports = ByteData;
  }
});

// node_modules/qrcode/lib/core/kanji-data.js
var require_kanji_data = __commonJS({
  "node_modules/qrcode/lib/core/kanji-data.js"(exports, module) {
    var Mode = require_mode();
    var Utils = require_utils();
    function KanjiData(data) {
      this.mode = Mode.KANJI;
      this.data = data;
    }
    KanjiData.getBitsLength = function getBitsLength(length) {
      return length * 13;
    };
    KanjiData.prototype.getLength = function getLength() {
      return this.data.length;
    };
    KanjiData.prototype.getBitsLength = function getBitsLength() {
      return KanjiData.getBitsLength(this.data.length);
    };
    KanjiData.prototype.write = function(bitBuffer) {
      let i;
      for (i = 0; i < this.data.length; i++) {
        let value = Utils.toSJIS(this.data[i]);
        if (value >= 33088 && value <= 40956) {
          value -= 33088;
        } else if (value >= 57408 && value <= 60351) {
          value -= 49472;
        } else {
          throw new Error(
            "Invalid SJIS character: " + this.data[i] + "\nMake sure your charset is UTF-8"
          );
        }
        value = (value >>> 8 & 255) * 192 + (value & 255);
        bitBuffer.put(value, 13);
      }
    };
    module.exports = KanjiData;
  }
});

// node_modules/dijkstrajs/dijkstra.js
var require_dijkstra = __commonJS({
  "node_modules/dijkstrajs/dijkstra.js"(exports, module) {
    "use strict";
    var dijkstra = {
      single_source_shortest_paths: function(graph, s, d) {
        var predecessors = {};
        var costs = {};
        costs[s] = 0;
        var open = dijkstra.PriorityQueue.make();
        open.push(s, 0);
        var closest, u, v, cost_of_s_to_u, adjacent_nodes, cost_of_e, cost_of_s_to_u_plus_cost_of_e, cost_of_s_to_v, first_visit;
        while (!open.empty()) {
          closest = open.pop();
          u = closest.value;
          cost_of_s_to_u = closest.cost;
          adjacent_nodes = graph[u] || {};
          for (v in adjacent_nodes) {
            if (adjacent_nodes.hasOwnProperty(v)) {
              cost_of_e = adjacent_nodes[v];
              cost_of_s_to_u_plus_cost_of_e = cost_of_s_to_u + cost_of_e;
              cost_of_s_to_v = costs[v];
              first_visit = typeof costs[v] === "undefined";
              if (first_visit || cost_of_s_to_v > cost_of_s_to_u_plus_cost_of_e) {
                costs[v] = cost_of_s_to_u_plus_cost_of_e;
                open.push(v, cost_of_s_to_u_plus_cost_of_e);
                predecessors[v] = u;
              }
            }
          }
        }
        if (typeof d !== "undefined" && typeof costs[d] === "undefined") {
          var msg = ["Could not find a path from ", s, " to ", d, "."].join("");
          throw new Error(msg);
        }
        return predecessors;
      },
      extract_shortest_path_from_predecessor_list: function(predecessors, d) {
        var nodes = [];
        var u = d;
        var predecessor;
        while (u) {
          nodes.push(u);
          predecessor = predecessors[u];
          u = predecessors[u];
        }
        nodes.reverse();
        return nodes;
      },
      find_path: function(graph, s, d) {
        var predecessors = dijkstra.single_source_shortest_paths(graph, s, d);
        return dijkstra.extract_shortest_path_from_predecessor_list(
          predecessors,
          d
        );
      },
      /**
       * A very naive priority queue implementation.
       */
      PriorityQueue: {
        make: function(opts) {
          var T = dijkstra.PriorityQueue, t = {}, key;
          opts = opts || {};
          for (key in T) {
            if (T.hasOwnProperty(key)) {
              t[key] = T[key];
            }
          }
          t.queue = [];
          t.sorter = opts.sorter || T.default_sorter;
          return t;
        },
        default_sorter: function(a, b) {
          return a.cost - b.cost;
        },
        /**
         * Add a new item to the queue and ensure the highest priority element
         * is at the front of the queue.
         */
        push: function(value, cost) {
          var item = { value, cost };
          this.queue.push(item);
          this.queue.sort(this.sorter);
        },
        /**
         * Return the highest priority element in the queue.
         */
        pop: function() {
          return this.queue.shift();
        },
        empty: function() {
          return this.queue.length === 0;
        }
      }
    };
    if (typeof module !== "undefined") {
      module.exports = dijkstra;
    }
  }
});

// node_modules/qrcode/lib/core/segments.js
var require_segments = __commonJS({
  "node_modules/qrcode/lib/core/segments.js"(exports) {
    var Mode = require_mode();
    var NumericData = require_numeric_data();
    var AlphanumericData = require_alphanumeric_data();
    var ByteData = require_byte_data();
    var KanjiData = require_kanji_data();
    var Regex = require_regex();
    var Utils = require_utils();
    var dijkstra = require_dijkstra();
    function getStringByteLength(str) {
      return unescape(encodeURIComponent(str)).length;
    }
    function getSegments(regex, mode, str) {
      const segments = [];
      let result;
      while ((result = regex.exec(str)) !== null) {
        segments.push({
          data: result[0],
          index: result.index,
          mode,
          length: result[0].length
        });
      }
      return segments;
    }
    function getSegmentsFromString(dataStr) {
      const numSegs = getSegments(Regex.NUMERIC, Mode.NUMERIC, dataStr);
      const alphaNumSegs = getSegments(Regex.ALPHANUMERIC, Mode.ALPHANUMERIC, dataStr);
      let byteSegs;
      let kanjiSegs;
      if (Utils.isKanjiModeEnabled()) {
        byteSegs = getSegments(Regex.BYTE, Mode.BYTE, dataStr);
        kanjiSegs = getSegments(Regex.KANJI, Mode.KANJI, dataStr);
      } else {
        byteSegs = getSegments(Regex.BYTE_KANJI, Mode.BYTE, dataStr);
        kanjiSegs = [];
      }
      const segs = numSegs.concat(alphaNumSegs, byteSegs, kanjiSegs);
      return segs.sort(function(s1, s2) {
        return s1.index - s2.index;
      }).map(function(obj) {
        return {
          data: obj.data,
          mode: obj.mode,
          length: obj.length
        };
      });
    }
    function getSegmentBitsLength(length, mode) {
      switch (mode) {
        case Mode.NUMERIC:
          return NumericData.getBitsLength(length);
        case Mode.ALPHANUMERIC:
          return AlphanumericData.getBitsLength(length);
        case Mode.KANJI:
          return KanjiData.getBitsLength(length);
        case Mode.BYTE:
          return ByteData.getBitsLength(length);
      }
    }
    function mergeSegments(segs) {
      return segs.reduce(function(acc, curr) {
        const prevSeg = acc.length - 1 >= 0 ? acc[acc.length - 1] : null;
        if (prevSeg && prevSeg.mode === curr.mode) {
          acc[acc.length - 1].data += curr.data;
          return acc;
        }
        acc.push(curr);
        return acc;
      }, []);
    }
    function buildNodes(segs) {
      const nodes = [];
      for (let i = 0; i < segs.length; i++) {
        const seg = segs[i];
        switch (seg.mode) {
          case Mode.NUMERIC:
            nodes.push([
              seg,
              { data: seg.data, mode: Mode.ALPHANUMERIC, length: seg.length },
              { data: seg.data, mode: Mode.BYTE, length: seg.length }
            ]);
            break;
          case Mode.ALPHANUMERIC:
            nodes.push([
              seg,
              { data: seg.data, mode: Mode.BYTE, length: seg.length }
            ]);
            break;
          case Mode.KANJI:
            nodes.push([
              seg,
              { data: seg.data, mode: Mode.BYTE, length: getStringByteLength(seg.data) }
            ]);
            break;
          case Mode.BYTE:
            nodes.push([
              { data: seg.data, mode: Mode.BYTE, length: getStringByteLength(seg.data) }
            ]);
        }
      }
      return nodes;
    }
    function buildGraph(nodes, version) {
      const table = {};
      const graph = { start: {} };
      let prevNodeIds = ["start"];
      for (let i = 0; i < nodes.length; i++) {
        const nodeGroup = nodes[i];
        const currentNodeIds = [];
        for (let j = 0; j < nodeGroup.length; j++) {
          const node = nodeGroup[j];
          const key = "" + i + j;
          currentNodeIds.push(key);
          table[key] = { node, lastCount: 0 };
          graph[key] = {};
          for (let n = 0; n < prevNodeIds.length; n++) {
            const prevNodeId = prevNodeIds[n];
            if (table[prevNodeId] && table[prevNodeId].node.mode === node.mode) {
              graph[prevNodeId][key] = getSegmentBitsLength(table[prevNodeId].lastCount + node.length, node.mode) - getSegmentBitsLength(table[prevNodeId].lastCount, node.mode);
              table[prevNodeId].lastCount += node.length;
            } else {
              if (table[prevNodeId]) table[prevNodeId].lastCount = node.length;
              graph[prevNodeId][key] = getSegmentBitsLength(node.length, node.mode) + 4 + Mode.getCharCountIndicator(node.mode, version);
            }
          }
        }
        prevNodeIds = currentNodeIds;
      }
      for (let n = 0; n < prevNodeIds.length; n++) {
        graph[prevNodeIds[n]].end = 0;
      }
      return { map: graph, table };
    }
    function buildSingleSegment(data, modesHint) {
      let mode;
      const bestMode = Mode.getBestModeForData(data);
      mode = Mode.from(modesHint, bestMode);
      if (mode !== Mode.BYTE && mode.bit < bestMode.bit) {
        throw new Error('"' + data + '" cannot be encoded with mode ' + Mode.toString(mode) + ".\n Suggested mode is: " + Mode.toString(bestMode));
      }
      if (mode === Mode.KANJI && !Utils.isKanjiModeEnabled()) {
        mode = Mode.BYTE;
      }
      switch (mode) {
        case Mode.NUMERIC:
          return new NumericData(data);
        case Mode.ALPHANUMERIC:
          return new AlphanumericData(data);
        case Mode.KANJI:
          return new KanjiData(data);
        case Mode.BYTE:
          return new ByteData(data);
      }
    }
    exports.fromArray = function fromArray(array) {
      return array.reduce(function(acc, seg) {
        if (typeof seg === "string") {
          acc.push(buildSingleSegment(seg, null));
        } else if (seg.data) {
          acc.push(buildSingleSegment(seg.data, seg.mode));
        }
        return acc;
      }, []);
    };
    exports.fromString = function fromString(data, version) {
      const segs = getSegmentsFromString(data, Utils.isKanjiModeEnabled());
      const nodes = buildNodes(segs);
      const graph = buildGraph(nodes, version);
      const path = dijkstra.find_path(graph.map, "start", "end");
      const optimizedSegs = [];
      for (let i = 1; i < path.length - 1; i++) {
        optimizedSegs.push(graph.table[path[i]].node);
      }
      return exports.fromArray(mergeSegments(optimizedSegs));
    };
    exports.rawSplit = function rawSplit(data) {
      return exports.fromArray(
        getSegmentsFromString(data, Utils.isKanjiModeEnabled())
      );
    };
  }
});

// node_modules/qrcode/lib/core/qrcode.js
var require_qrcode = __commonJS({
  "node_modules/qrcode/lib/core/qrcode.js"(exports) {
    var Utils = require_utils();
    var ECLevel = require_error_correction_level();
    var BitBuffer = require_bit_buffer();
    var BitMatrix = require_bit_matrix();
    var AlignmentPattern = require_alignment_pattern();
    var FinderPattern = require_finder_pattern();
    var MaskPattern = require_mask_pattern();
    var ECCode = require_error_correction_code();
    var ReedSolomonEncoder = require_reed_solomon_encoder();
    var Version = require_version();
    var FormatInfo = require_format_info();
    var Mode = require_mode();
    var Segments = require_segments();
    function setupFinderPattern(matrix, version) {
      const size = matrix.size;
      const pos = FinderPattern.getPositions(version);
      for (let i = 0; i < pos.length; i++) {
        const row = pos[i][0];
        const col = pos[i][1];
        for (let r = -1; r <= 7; r++) {
          if (row + r <= -1 || size <= row + r) continue;
          for (let c = -1; c <= 7; c++) {
            if (col + c <= -1 || size <= col + c) continue;
            if (r >= 0 && r <= 6 && (c === 0 || c === 6) || c >= 0 && c <= 6 && (r === 0 || r === 6) || r >= 2 && r <= 4 && c >= 2 && c <= 4) {
              matrix.set(row + r, col + c, true, true);
            } else {
              matrix.set(row + r, col + c, false, true);
            }
          }
        }
      }
    }
    function setupTimingPattern(matrix) {
      const size = matrix.size;
      for (let r = 8; r < size - 8; r++) {
        const value = r % 2 === 0;
        matrix.set(r, 6, value, true);
        matrix.set(6, r, value, true);
      }
    }
    function setupAlignmentPattern(matrix, version) {
      const pos = AlignmentPattern.getPositions(version);
      for (let i = 0; i < pos.length; i++) {
        const row = pos[i][0];
        const col = pos[i][1];
        for (let r = -2; r <= 2; r++) {
          for (let c = -2; c <= 2; c++) {
            if (r === -2 || r === 2 || c === -2 || c === 2 || r === 0 && c === 0) {
              matrix.set(row + r, col + c, true, true);
            } else {
              matrix.set(row + r, col + c, false, true);
            }
          }
        }
      }
    }
    function setupVersionInfo(matrix, version) {
      const size = matrix.size;
      const bits = Version.getEncodedBits(version);
      let row, col, mod;
      for (let i = 0; i < 18; i++) {
        row = Math.floor(i / 3);
        col = i % 3 + size - 8 - 3;
        mod = (bits >> i & 1) === 1;
        matrix.set(row, col, mod, true);
        matrix.set(col, row, mod, true);
      }
    }
    function setupFormatInfo(matrix, errorCorrectionLevel, maskPattern) {
      const size = matrix.size;
      const bits = FormatInfo.getEncodedBits(errorCorrectionLevel, maskPattern);
      let i, mod;
      for (i = 0; i < 15; i++) {
        mod = (bits >> i & 1) === 1;
        if (i < 6) {
          matrix.set(i, 8, mod, true);
        } else if (i < 8) {
          matrix.set(i + 1, 8, mod, true);
        } else {
          matrix.set(size - 15 + i, 8, mod, true);
        }
        if (i < 8) {
          matrix.set(8, size - i - 1, mod, true);
        } else if (i < 9) {
          matrix.set(8, 15 - i - 1 + 1, mod, true);
        } else {
          matrix.set(8, 15 - i - 1, mod, true);
        }
      }
      matrix.set(size - 8, 8, 1, true);
    }
    function setupData(matrix, data) {
      const size = matrix.size;
      let inc = -1;
      let row = size - 1;
      let bitIndex = 7;
      let byteIndex = 0;
      for (let col = size - 1; col > 0; col -= 2) {
        if (col === 6) col--;
        while (true) {
          for (let c = 0; c < 2; c++) {
            if (!matrix.isReserved(row, col - c)) {
              let dark = false;
              if (byteIndex < data.length) {
                dark = (data[byteIndex] >>> bitIndex & 1) === 1;
              }
              matrix.set(row, col - c, dark);
              bitIndex--;
              if (bitIndex === -1) {
                byteIndex++;
                bitIndex = 7;
              }
            }
          }
          row += inc;
          if (row < 0 || size <= row) {
            row -= inc;
            inc = -inc;
            break;
          }
        }
      }
    }
    function createData(version, errorCorrectionLevel, segments) {
      const buffer = new BitBuffer();
      segments.forEach(function(data) {
        buffer.put(data.mode.bit, 4);
        buffer.put(data.getLength(), Mode.getCharCountIndicator(data.mode, version));
        data.write(buffer);
      });
      const totalCodewords = Utils.getSymbolTotalCodewords(version);
      const ecTotalCodewords = ECCode.getTotalCodewordsCount(version, errorCorrectionLevel);
      const dataTotalCodewordsBits = (totalCodewords - ecTotalCodewords) * 8;
      if (buffer.getLengthInBits() + 4 <= dataTotalCodewordsBits) {
        buffer.put(0, 4);
      }
      while (buffer.getLengthInBits() % 8 !== 0) {
        buffer.putBit(0);
      }
      const remainingByte = (dataTotalCodewordsBits - buffer.getLengthInBits()) / 8;
      for (let i = 0; i < remainingByte; i++) {
        buffer.put(i % 2 ? 17 : 236, 8);
      }
      return createCodewords(buffer, version, errorCorrectionLevel);
    }
    function createCodewords(bitBuffer, version, errorCorrectionLevel) {
      const totalCodewords = Utils.getSymbolTotalCodewords(version);
      const ecTotalCodewords = ECCode.getTotalCodewordsCount(version, errorCorrectionLevel);
      const dataTotalCodewords = totalCodewords - ecTotalCodewords;
      const ecTotalBlocks = ECCode.getBlocksCount(version, errorCorrectionLevel);
      const blocksInGroup2 = totalCodewords % ecTotalBlocks;
      const blocksInGroup1 = ecTotalBlocks - blocksInGroup2;
      const totalCodewordsInGroup1 = Math.floor(totalCodewords / ecTotalBlocks);
      const dataCodewordsInGroup1 = Math.floor(dataTotalCodewords / ecTotalBlocks);
      const dataCodewordsInGroup2 = dataCodewordsInGroup1 + 1;
      const ecCount = totalCodewordsInGroup1 - dataCodewordsInGroup1;
      const rs = new ReedSolomonEncoder(ecCount);
      let offset = 0;
      const dcData = new Array(ecTotalBlocks);
      const ecData = new Array(ecTotalBlocks);
      let maxDataSize = 0;
      const buffer = new Uint8Array(bitBuffer.buffer);
      for (let b = 0; b < ecTotalBlocks; b++) {
        const dataSize = b < blocksInGroup1 ? dataCodewordsInGroup1 : dataCodewordsInGroup2;
        dcData[b] = buffer.slice(offset, offset + dataSize);
        ecData[b] = rs.encode(dcData[b]);
        offset += dataSize;
        maxDataSize = Math.max(maxDataSize, dataSize);
      }
      const data = new Uint8Array(totalCodewords);
      let index = 0;
      let i, r;
      for (i = 0; i < maxDataSize; i++) {
        for (r = 0; r < ecTotalBlocks; r++) {
          if (i < dcData[r].length) {
            data[index++] = dcData[r][i];
          }
        }
      }
      for (i = 0; i < ecCount; i++) {
        for (r = 0; r < ecTotalBlocks; r++) {
          data[index++] = ecData[r][i];
        }
      }
      return data;
    }
    function createSymbol(data, version, errorCorrectionLevel, maskPattern) {
      let segments;
      if (Array.isArray(data)) {
        segments = Segments.fromArray(data);
      } else if (typeof data === "string") {
        let estimatedVersion = version;
        if (!estimatedVersion) {
          const rawSegments = Segments.rawSplit(data);
          estimatedVersion = Version.getBestVersionForData(rawSegments, errorCorrectionLevel);
        }
        segments = Segments.fromString(data, estimatedVersion || 40);
      } else {
        throw new Error("Invalid data");
      }
      const bestVersion = Version.getBestVersionForData(segments, errorCorrectionLevel);
      if (!bestVersion) {
        throw new Error("The amount of data is too big to be stored in a QR Code");
      }
      if (!version) {
        version = bestVersion;
      } else if (version < bestVersion) {
        throw new Error(
          "\nThe chosen QR Code version cannot contain this amount of data.\nMinimum version required to store current data is: " + bestVersion + ".\n"
        );
      }
      const dataBits = createData(version, errorCorrectionLevel, segments);
      const moduleCount = Utils.getSymbolSize(version);
      const modules = new BitMatrix(moduleCount);
      setupFinderPattern(modules, version);
      setupTimingPattern(modules);
      setupAlignmentPattern(modules, version);
      setupFormatInfo(modules, errorCorrectionLevel, 0);
      if (version >= 7) {
        setupVersionInfo(modules, version);
      }
      setupData(modules, dataBits);
      if (isNaN(maskPattern)) {
        maskPattern = MaskPattern.getBestMask(
          modules,
          setupFormatInfo.bind(null, modules, errorCorrectionLevel)
        );
      }
      MaskPattern.applyMask(maskPattern, modules);
      setupFormatInfo(modules, errorCorrectionLevel, maskPattern);
      return {
        modules,
        version,
        errorCorrectionLevel,
        maskPattern,
        segments
      };
    }
    exports.create = function create(data, options) {
      if (typeof data === "undefined" || data === "") {
        throw new Error("No input text");
      }
      let errorCorrectionLevel = ECLevel.M;
      let version;
      let mask;
      if (typeof options !== "undefined") {
        errorCorrectionLevel = ECLevel.from(options.errorCorrectionLevel, ECLevel.M);
        version = Version.from(options.version);
        mask = MaskPattern.from(options.maskPattern);
        if (options.toSJISFunc) {
          Utils.setToSJISFunction(options.toSJISFunc);
        }
      }
      return createSymbol(data, version, errorCorrectionLevel, mask);
    };
  }
});

// node_modules/qrcode/lib/renderer/utils.js
var require_utils2 = __commonJS({
  "node_modules/qrcode/lib/renderer/utils.js"(exports) {
    function hex2rgba(hex) {
      if (typeof hex === "number") {
        hex = hex.toString();
      }
      if (typeof hex !== "string") {
        throw new Error("Color should be defined as hex string");
      }
      let hexCode = hex.slice().replace("#", "").split("");
      if (hexCode.length < 3 || hexCode.length === 5 || hexCode.length > 8) {
        throw new Error("Invalid hex color: " + hex);
      }
      if (hexCode.length === 3 || hexCode.length === 4) {
        hexCode = Array.prototype.concat.apply([], hexCode.map(function(c) {
          return [c, c];
        }));
      }
      if (hexCode.length === 6) hexCode.push("F", "F");
      const hexValue = parseInt(hexCode.join(""), 16);
      return {
        r: hexValue >> 24 & 255,
        g: hexValue >> 16 & 255,
        b: hexValue >> 8 & 255,
        a: hexValue & 255,
        hex: "#" + hexCode.slice(0, 6).join("")
      };
    }
    exports.getOptions = function getOptions(options) {
      if (!options) options = {};
      if (!options.color) options.color = {};
      const margin = typeof options.margin === "undefined" || options.margin === null || options.margin < 0 ? 4 : options.margin;
      const width = options.width && options.width >= 21 ? options.width : void 0;
      const scale = options.scale || 4;
      return {
        width,
        scale: width ? 4 : scale,
        margin,
        color: {
          dark: hex2rgba(options.color.dark || "#000000ff"),
          light: hex2rgba(options.color.light || "#ffffffff")
        },
        type: options.type,
        rendererOpts: options.rendererOpts || {}
      };
    };
    exports.getScale = function getScale(qrSize, opts) {
      return opts.width && opts.width >= qrSize + opts.margin * 2 ? opts.width / (qrSize + opts.margin * 2) : opts.scale;
    };
    exports.getImageWidth = function getImageWidth(qrSize, opts) {
      const scale = exports.getScale(qrSize, opts);
      return Math.floor((qrSize + opts.margin * 2) * scale);
    };
    exports.qrToImageData = function qrToImageData(imgData, qr, opts) {
      const size = qr.modules.size;
      const data = qr.modules.data;
      const scale = exports.getScale(size, opts);
      const symbolSize = Math.floor((size + opts.margin * 2) * scale);
      const scaledMargin = opts.margin * scale;
      const palette = [opts.color.light, opts.color.dark];
      for (let i = 0; i < symbolSize; i++) {
        for (let j = 0; j < symbolSize; j++) {
          let posDst = (i * symbolSize + j) * 4;
          let pxColor = opts.color.light;
          if (i >= scaledMargin && j >= scaledMargin && i < symbolSize - scaledMargin && j < symbolSize - scaledMargin) {
            const iSrc = Math.floor((i - scaledMargin) / scale);
            const jSrc = Math.floor((j - scaledMargin) / scale);
            pxColor = palette[data[iSrc * size + jSrc] ? 1 : 0];
          }
          imgData[posDst++] = pxColor.r;
          imgData[posDst++] = pxColor.g;
          imgData[posDst++] = pxColor.b;
          imgData[posDst] = pxColor.a;
        }
      }
    };
  }
});

// node_modules/qrcode/lib/renderer/canvas.js
var require_canvas = __commonJS({
  "node_modules/qrcode/lib/renderer/canvas.js"(exports) {
    var Utils = require_utils2();
    function clearCanvas(ctx, canvas, size) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (!canvas.style) canvas.style = {};
      canvas.height = size;
      canvas.width = size;
      canvas.style.height = size + "px";
      canvas.style.width = size + "px";
    }
    function getCanvasElement() {
      try {
        return document.createElement("canvas");
      } catch (e) {
        throw new Error("You need to specify a canvas element");
      }
    }
    exports.render = function render(qrData, canvas, options) {
      let opts = options;
      let canvasEl = canvas;
      if (typeof opts === "undefined" && (!canvas || !canvas.getContext)) {
        opts = canvas;
        canvas = void 0;
      }
      if (!canvas) {
        canvasEl = getCanvasElement();
      }
      opts = Utils.getOptions(opts);
      const size = Utils.getImageWidth(qrData.modules.size, opts);
      const ctx = canvasEl.getContext("2d");
      const image = ctx.createImageData(size, size);
      Utils.qrToImageData(image.data, qrData, opts);
      clearCanvas(ctx, canvasEl, size);
      ctx.putImageData(image, 0, 0);
      return canvasEl;
    };
    exports.renderToDataURL = function renderToDataURL(qrData, canvas, options) {
      let opts = options;
      if (typeof opts === "undefined" && (!canvas || !canvas.getContext)) {
        opts = canvas;
        canvas = void 0;
      }
      if (!opts) opts = {};
      const canvasEl = exports.render(qrData, canvas, opts);
      const type = opts.type || "image/png";
      const rendererOpts = opts.rendererOpts || {};
      return canvasEl.toDataURL(type, rendererOpts.quality);
    };
  }
});

// node_modules/qrcode/lib/renderer/svg-tag.js
var require_svg_tag = __commonJS({
  "node_modules/qrcode/lib/renderer/svg-tag.js"(exports) {
    var Utils = require_utils2();
    function getColorAttrib(color, attrib) {
      const alpha = color.a / 255;
      const str = attrib + '="' + color.hex + '"';
      return alpha < 1 ? str + " " + attrib + '-opacity="' + alpha.toFixed(2).slice(1) + '"' : str;
    }
    function svgCmd(cmd, x, y) {
      let str = cmd + x;
      if (typeof y !== "undefined") str += " " + y;
      return str;
    }
    function qrToPath(data, size, margin) {
      let path = "";
      let moveBy = 0;
      let newRow = false;
      let lineLength = 0;
      for (let i = 0; i < data.length; i++) {
        const col = Math.floor(i % size);
        const row = Math.floor(i / size);
        if (!col && !newRow) newRow = true;
        if (data[i]) {
          lineLength++;
          if (!(i > 0 && col > 0 && data[i - 1])) {
            path += newRow ? svgCmd("M", col + margin, 0.5 + row + margin) : svgCmd("m", moveBy, 0);
            moveBy = 0;
            newRow = false;
          }
          if (!(col + 1 < size && data[i + 1])) {
            path += svgCmd("h", lineLength);
            lineLength = 0;
          }
        } else {
          moveBy++;
        }
      }
      return path;
    }
    exports.render = function render(qrData, options, cb) {
      const opts = Utils.getOptions(options);
      const size = qrData.modules.size;
      const data = qrData.modules.data;
      const qrcodesize = size + opts.margin * 2;
      const bg = !opts.color.light.a ? "" : "<path " + getColorAttrib(opts.color.light, "fill") + ' d="M0 0h' + qrcodesize + "v" + qrcodesize + 'H0z"/>';
      const path = "<path " + getColorAttrib(opts.color.dark, "stroke") + ' d="' + qrToPath(data, size, opts.margin) + '"/>';
      const viewBox = 'viewBox="0 0 ' + qrcodesize + " " + qrcodesize + '"';
      const width = !opts.width ? "" : 'width="' + opts.width + '" height="' + opts.width + '" ';
      const svgTag = '<svg xmlns="http://www.w3.org/2000/svg" ' + width + viewBox + ' shape-rendering="crispEdges">' + bg + path + "</svg>\n";
      if (typeof cb === "function") {
        cb(null, svgTag);
      }
      return svgTag;
    };
  }
});

// node_modules/qrcode/lib/browser.js
var require_browser = __commonJS({
  "node_modules/qrcode/lib/browser.js"(exports) {
    var canPromise = require_can_promise();
    var QRCode2 = require_qrcode();
    var CanvasRenderer = require_canvas();
    var SvgRenderer = require_svg_tag();
    function renderCanvas(renderFunc, canvas, text, opts, cb) {
      const args = [].slice.call(arguments, 1);
      const argsNum = args.length;
      const isLastArgCb = typeof args[argsNum - 1] === "function";
      if (!isLastArgCb && !canPromise()) {
        throw new Error("Callback required as last argument");
      }
      if (isLastArgCb) {
        if (argsNum < 2) {
          throw new Error("Too few arguments provided");
        }
        if (argsNum === 2) {
          cb = text;
          text = canvas;
          canvas = opts = void 0;
        } else if (argsNum === 3) {
          if (canvas.getContext && typeof cb === "undefined") {
            cb = opts;
            opts = void 0;
          } else {
            cb = opts;
            opts = text;
            text = canvas;
            canvas = void 0;
          }
        }
      } else {
        if (argsNum < 1) {
          throw new Error("Too few arguments provided");
        }
        if (argsNum === 1) {
          text = canvas;
          canvas = opts = void 0;
        } else if (argsNum === 2 && !canvas.getContext) {
          opts = text;
          text = canvas;
          canvas = void 0;
        }
        return new Promise(function(resolve, reject) {
          try {
            const data = QRCode2.create(text, opts);
            resolve(renderFunc(data, canvas, opts));
          } catch (e) {
            reject(e);
          }
        });
      }
      try {
        const data = QRCode2.create(text, opts);
        cb(null, renderFunc(data, canvas, opts));
      } catch (e) {
        cb(e);
      }
    }
    exports.create = QRCode2.create;
    exports.toCanvas = renderCanvas.bind(null, CanvasRenderer.render);
    exports.toDataURL = renderCanvas.bind(null, CanvasRenderer.renderToDataURL);
    exports.toString = renderCanvas.bind(null, function(data, _, opts) {
      return SvgRenderer.render(data, opts);
    });
  }
});

// src/plugin.tsx
var import_qrcode = __toESM(require_browser(), 1);
import { useState as useState2 } from "react";
import { host as host2, Button as Button2, Input as Input2, Codicon, ListRow as ListRow2, usePluginI18n as usePluginI18n2, PALETTE_AREA, pluginSettingsHref } from "@hermes/plugin-sdk";

// src/url.ts
function normalizeAddress(input) {
  if (typeof input !== "string" || !input.trim() || input.length > 1024) throw new Error("urlRequired");
  let url;
  try {
    url = new URL(input.trim());
  } catch {
    throw new Error("urlInvalid");
  }
  if (url.protocol !== "https:") throw new Error("urlHttps");
  if (url.username || url.password || url.search || url.hash) throw new Error("urlCredentials");
  const h = url.hostname.toLowerCase().replace(/\.$/, "");
  if (h === "localhost" || h.endsWith(".localhost") || h.startsWith("127.") || h === "0.0.0.0" || h === "[::1]" || h === "[::]" || /^\[::ffff:(?:7f[0-9a-f]{2}:|0:0\])/.test(h)) throw new Error("urlLocal");
  return url.href;
}

// src/wizard.tsx
import { useState } from "react";
import { host, Button, Input, Checkbox, SegmentedControl, ListRow, Badge, useQuery, useValue, usePluginI18n } from "@hermes/plugin-sdk";

// src/locales/ja.json
var ja_default = {
  name: "Web Access QR",
  open: "Web\u30A2\u30AF\u30BB\u30B9QR\u3092\u8868\u793A",
  title: "\u30B9\u30DE\u30FC\u30C8\u30D5\u30A9\u30F3\u3067Hermes\u3092\u958B\u304F",
  intro: "QR\u3092\u8AAD\u307F\u53D6\u308A\u3001Hermes\u306B\u30ED\u30B0\u30A4\u30F3\u3057\u3066\u304F\u3060\u3055\u3044\u3002",
  setup: "Web\u30A2\u30AF\u30BB\u30B9\u3092\u8A2D\u5B9A",
  back: "QR\u306B\u623B\u308B",
  flow: "\u63A5\u7D9A\u65B9\u6CD5\u3092\u9078\u3073\u3001\u63A5\u7D9A\u3092\u6E96\u5099\u3057\u3066QR\u3092\u4F5C\u6210\u3057\u307E\u3059\u3002",
  provider: "\u63A5\u7D9A\u65B9\u6CD5",
  tailscale: "Tailscale",
  cloudflare: "Cloudflare Tunnel",
  existing: "\u65E2\u5B58\u306EHTTPS URL",
  tailHelp: "\u81EA\u5206\u306E\u7AEF\u672B\u9593\u3060\u3051\u3067\u63A5\u7D9A\u3057\u307E\u3059\u3002\u30B9\u30DE\u30FC\u30C8\u30D5\u30A9\u30F3\u306B\u3082Tailscale\u3092\u30A4\u30F3\u30B9\u30C8\u30FC\u30EB\u3057\u3066\u304F\u3060\u3055\u3044\u3002",
  cloudHelp: "\u72EC\u81EA\u30C9\u30E1\u30A4\u30F3\u3067\u63A5\u7D9A\u3057\u307E\u3059\u3002Cloudflare\u30A2\u30AB\u30A6\u30F3\u30C8\u3068\u30C9\u30E1\u30A4\u30F3\u304C\u5FC5\u8981\u3067\u3059\u3002",
  existingHelp: "\u8A2D\u5B9A\u6E08\u307F\u306E\u30C8\u30F3\u30CD\u30EB\u3084\u30D7\u30ED\u30AD\u30B7\u306EHTTPS\u30A2\u30C9\u30EC\u30B9\u3092\u4F7F\u3044\u307E\u3059\u3002",
  next: "\u6B21\u3078",
  change: "\u63A5\u7D9A\u65B9\u6CD5\u3092\u5909\u66F4",
  check: "\u518D\u78BA\u8A8D",
  checking: "\u63A5\u7D9A\u3092\u78BA\u8A8D\u4E2D\u2026",
  unavailable: "\u3053\u306E\u30B3\u30F3\u30D4\u30E5\u30FC\u30BF\u30FC\u306EHermes\u3067\u30E1\u30A4\u30F3\u30D7\u30ED\u30D5\u30A1\u30A4\u30EB\u306B\u5207\u308A\u66FF\u3048\u3001\u30D7\u30E9\u30B0\u30A4\u30F3\u306E\u30A8\u30FC\u30B8\u30A7\u30F3\u30C8\u6A5F\u80FD\u3092\u6709\u52B9\u306B\u3057\u3066\u304F\u3060\u3055\u3044\u3002QR\u3068URL\u5165\u529B\u306F\u5F15\u304D\u7D9A\u304D\u4F7F\u3048\u307E\u3059\u3002",
  mainProfile: "\u30E1\u30A4\u30F3\u30D7\u30ED\u30D5\u30A1\u30A4\u30EB\u3092\u958B\u304F",
  installTitle: "1. \u30A4\u30F3\u30B9\u30C8\u30FC\u30EB\u3068\u30ED\u30B0\u30A4\u30F3",
  installed: "\u30A4\u30F3\u30B9\u30C8\u30FC\u30EB\u6E08\u307F",
  missing: "\u672A\u30A4\u30F3\u30B9\u30C8\u30FC\u30EB",
  connected: "\u63A5\u7D9A\u6E08\u307F",
  disconnected: "\u672A\u63A5\u7D9A",
  install: "Homebrew\u3067\u30A4\u30F3\u30B9\u30C8\u30FC\u30EB",
  download: "\u516C\u5F0F\u30C0\u30A6\u30F3\u30ED\u30FC\u30C9",
  login: "Tailscale\u3092\u958B\u304F",
  installHelp: "\u7BA1\u7406\u8005\u306E\u627F\u8A8D\u304C\u5FC5\u8981\u306A\u5834\u5408\u306F\u516C\u5F0F\u30A4\u30F3\u30B9\u30C8\u30FC\u30E9\u30FC\u3092\u4F7F\u3063\u3066\u304F\u3060\u3055\u3044\u3002Tailscale\u3067\u30ED\u30B0\u30A4\u30F3\u3057\u3001VPN\u63A5\u7D9A\u3092\u627F\u8A8D\u3057\u307E\u3059\u3002",
  webTitle: "2. Hermes\u30ED\u30B0\u30A4\u30F3\u3092\u6E96\u5099",
  webHelp: "Hermes Web access\u3067My own URL\u3092\u9078\u3073\u3001\u4E0B\u306E\u30A2\u30C9\u30EC\u30B9\u3067\u958B\u59CB\u3057\u3066\u304F\u3060\u3055\u3044\u3002\u521D\u3081\u3066\u4F7F\u3046\u5834\u5408\u306FProviders\u3067\u30ED\u30B0\u30A4\u30F3\u3057\u307E\u3059\u3002\u65E2\u5B58\u306E\u30D1\u30B9\u30EF\u30FC\u30C9\u30ED\u30B0\u30A4\u30F3\u306F\u7DAD\u6301\u3055\u308C\u307E\u3059\u3002",
  webReady: "Web\u30ED\u30B0\u30A4\u30F3\u4FDD\u8B77\u3092\u78BA\u8A8D\u3057\u307E\u3057\u305F\u3002",
  webSettings: "Hermes Web access\u3092\u958B\u304F",
  returnHelp: "\u30B9\u30C6\u30FC\u30BF\u30B9\u30D0\u30FC\u306EQR\u30DC\u30BF\u30F3\u3067\u623B\u308A\u3001\u518D\u78BA\u8A8D\u3057\u3066\u304F\u3060\u3055\u3044\u3002",
  shareTitle: "3. \u975E\u516C\u958B\u5171\u6709\u3092\u63A5\u7D9A",
  shareHelp: "\u3053\u306EWeb\u30B5\u30FC\u30D3\u30B9\u3092Tailscale\u30CD\u30C3\u30C8\u30EF\u30FC\u30AF\u5185\u3060\u3051\u3067\u5171\u6709\u3057\u307E\u3059\u3002",
  reuse: "\u65E2\u5B58\u306E\u63A5\u7D9A\u3092\u78BA\u8A8D",
  share: "\u5171\u6709\u3092\u8A2D\u5B9A",
  conflict: "\u30DD\u30FC\u30C8443\u306B\u5225\u306E\u8A2D\u5B9A\u304C\u3042\u308B\u305F\u3081\u3001\u81EA\u52D5\u5909\u66F4\u3057\u307E\u305B\u3093\u3002",
  https: "HTTPS\u8A2D\u5B9A",
  running: "\u8A2D\u5B9A\u4E2D\u3067\u3059\u3002\u30A4\u30F3\u30B9\u30C8\u30FC\u30EB\u306B\u306F\u6700\u59274\u5206\u307B\u3069\u304B\u304B\u308A\u307E\u3059\u3002",
  done: "\u5B8C\u4E86\u3057\u307E\u3057\u305F\u3002\u4E0A\u306E\u63A5\u7D9A\u72B6\u614B\u3092\u78BA\u8A8D\u3057\u3066\u304F\u3060\u3055\u3044\u3002",
  failed: "\u5B8C\u4E86\u3067\u304D\u307E\u305B\u3093\u3067\u3057\u305F\u3002Tailscale\u306E\u6A29\u9650\u3068HTTPS\u8A2D\u5B9A\u3092\u78BA\u8A8D\u3057\u3066\u304F\u3060\u3055\u3044\u3002\u30A4\u30F3\u30B9\u30C8\u30FC\u30EB\u306B\u306F\u516C\u5F0F\u30A4\u30F3\u30B9\u30C8\u30FC\u30E9\u30FC\u3092\u4F7F\u3063\u3066\u518D\u8A66\u884C\u3057\u3066\u304F\u3060\u3055\u3044\u3002",
  finishLogin: "Tailscale\u3067\u30ED\u30B0\u30A4\u30F3\u3068VPN\u627F\u8A8D\u3092\u5B8C\u4E86\u3057\u3001\u518D\u78BA\u8A8D\u3057\u3066\u304F\u3060\u3055\u3044\u3002",
  create: "\u3053\u306EURL\u3067QR\u3092\u4F5C\u6210",
  cf1: "1. \u30A2\u30AB\u30A6\u30F3\u30C8\u3068\u30C9\u30E1\u30A4\u30F3\u3092\u6E96\u5099",
  cfHelp1: "Cloudflare\u306B\u30C9\u30E1\u30A4\u30F3\u3092\u8FFD\u52A0\u3057\u3001Networking \u2192 Tunnels\u3067\u30C8\u30F3\u30CD\u30EB\u3092\u4F5C\u6210\u3057\u3066\u304F\u3060\u3055\u3044\u3002",
  console: "Cloudflare\u3092\u958B\u304F",
  guide: "\u516C\u5F0F\u30AC\u30A4\u30C9",
  cf2: "2. \u30B3\u30CD\u30AF\u30BF\u30FC\u3092\u30A4\u30F3\u30B9\u30C8\u30FC\u30EB",
  cfHelp2: "\u30B3\u30F3\u30BD\u30FC\u30EB\u3067\u3053\u306E\u30B3\u30F3\u30D4\u30E5\u30FC\u30BF\u30FC\u306EOS\u3092\u9078\u3073\u3001Install and Run\u306E\u624B\u9806\u306B\u5F93\u3063\u3066Healthy\u306B\u306A\u308B\u307E\u3067\u9032\u3081\u307E\u3059\u3002\u30A4\u30F3\u30B9\u30C8\u30FC\u30EB\u30C8\u30FC\u30AF\u30F3\u306F\u516C\u5F0F\u306E\u8A2D\u5B9A\u753B\u9762\u3060\u3051\u3067\u6271\u3063\u3066\u304F\u3060\u3055\u3044\u3002",
  cf3: "3. \u516C\u958B\u30A2\u30C9\u30EC\u30B9\u3092\u63A5\u7D9A",
  cfHelp3: "\u307E\u305AHermes Web access\u3067\u30ED\u30B0\u30A4\u30F3\u3068HTTPS URL\u3092\u6E96\u5099\u3057\u307E\u3059\u3002\u6B21\u306B\u516C\u958B\u30A2\u30D7\u30EA\u30B1\u30FC\u30B7\u30E7\u30F3\u3092\u4E0B\u306E\u30ED\u30FC\u30AB\u30EB\u30A2\u30C9\u30EC\u30B9\u3078\u63A5\u7D9A\u3057\u307E\u3059\u3002\u30ED\u30B0\u30A4\u30F3\u753B\u9762\u3092\u78BA\u8A8D\u3057\u3001\u5FC5\u8981\u306A\u3089Cloudflare Access\u30DD\u30EA\u30B7\u30FC\u3092\u8FFD\u52A0\u3057\u3066\u304F\u3060\u3055\u3044\u3002",
  originFallback: "\u65E2\u5B9A\u306E\u30A2\u30C9\u30EC\u30B9\u3067\u3059\u3002Web access\u306E\u30DD\u30FC\u30C8\u3092\u78BA\u8A8D\u3057\u3066\u304F\u3060\u3055\u3044\u3002",
  address: "Web\u30A2\u30AF\u30BB\u30B9URL",
  addressHelp: "\u4FDD\u5B58\u3057\u305FURL\u3060\u3051\u304CQR\u306B\u542B\u307E\u308C\u307E\u3059\u3002\u8A8D\u8A3C\u60C5\u5831\u3084\u30ED\u30B0\u30A4\u30F3\u30EA\u30F3\u30AF\u306F\u542B\u307E\u308C\u307E\u305B\u3093\u3002",
  manualHelp: "\u30D6\u30E9\u30A6\u30B6\u30FC\u3067\u3053\u306EURL\u3092\u958B\u304D\u3001Hermes\u30ED\u30B0\u30A4\u30F3\u3092\u78BA\u8A8D\u3057\u3066\u304F\u3060\u3055\u3044\u3002\u3053\u3053\u3067\u306FURL\u5F62\u5F0F\u306E\u307F\u691C\u8A3C\u3057\u307E\u3059\u3002",
  confirmed: "\u3053\u306EURL\u3067Hermes\u3078\u306E\u30ED\u30B0\u30A4\u30F3\u3068\u63A5\u7D9A\u3092\u78BA\u8A8D\u3057\u307E\u3057\u305F\u3002",
  save: "\u4FDD\u5B58",
  saved: "URL\u3092\u4FDD\u5B58\u3057\u307E\u3057\u305F\u3002",
  copy: "URL\u3092\u30B3\u30D4\u30FC",
  copied: "\u30B3\u30D4\u30FC\u3057\u307E\u3057\u305F\u3002",
  copyFailed: "\u30B3\u30D4\u30FC\u3067\u304D\u307E\u305B\u3093\u3067\u3057\u305F\u3002\u8868\u793A\u3055\u308C\u305F\u30A2\u30C9\u30EC\u30B9\u3092\u9078\u629E\u3057\u3066\u30B3\u30D4\u30FC\u3057\u3066\u304F\u3060\u3055\u3044\u3002",
  openFailed: "\u30D6\u30E9\u30A6\u30B6\u30FC\u3092\u958B\u3051\u307E\u305B\u3093\u3067\u3057\u305F\u3002\u8868\u793A\u3055\u308C\u305F\u30EA\u30F3\u30AF\u3092\u76F4\u63A5\u958B\u3044\u3066\u304F\u3060\u3055\u3044\u3002",
  qrLabel: "Hermes Web\u30A2\u30AF\u30BB\u30B9QR\u30B3\u30FC\u30C9",
  empty: "URL\u3092\u4FDD\u5B58\u3059\u308B\u3068QR\u304C\u8868\u793A\u3055\u308C\u307E\u3059\u3002",
  qrFailed: "QR\u3092\u4F5C\u6210\u3067\u304D\u307E\u305B\u3093\u3067\u3057\u305F\u3002",
  phone: "\u30B9\u30DE\u30FC\u30C8\u30D5\u30A9\u30F3\u3067\u3082Tailscale\u3092\u63A5\u7D9A\u3057\u3066\u304F\u3060\u3055\u3044\u3002",
  error: "URL\u3092\u78BA\u8A8D\u3057\u3066\u518D\u8A66\u884C\u3057\u3066\u304F\u3060\u3055\u3044\u3002",
  urlRequired: "1,024\u6587\u5B57\u4EE5\u5185\u306EHTTPS URL\u3092\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044\u3002",
  urlInvalid: "\u6709\u52B9\u306AWeb\u30A2\u30C9\u30EC\u30B9\u3092\u5165\u529B\u3057\u3066\u304F\u3060\u3055\u3044\u3002",
  urlHttps: "https://\u306E\u30A2\u30C9\u30EC\u30B9\u3092\u4F7F\u3063\u3066\u304F\u3060\u3055\u3044\u3002",
  urlCredentials: "\u8A8D\u8A3C\u60C5\u5831\u3001\u30AF\u30A8\u30EA\u3001\u30D5\u30E9\u30B0\u30E1\u30F3\u30C8\u306E\u306A\u3044URL\u3092\u4F7F\u3063\u3066\u304F\u3060\u3055\u3044\u3002",
  urlLocal: "\u30EB\u30FC\u30D7\u30D0\u30C3\u30AF\u3067\u306F\u306A\u304F\u3001\u30B9\u30DE\u30FC\u30C8\u30D5\u30A9\u30F3\u304B\u3089\u30A2\u30AF\u30BB\u30B9\u3067\u304D\u308B\u30A2\u30C9\u30EC\u30B9\u3092\u4F7F\u3063\u3066\u304F\u3060\u3055\u3044\u3002"
};

// src/locales/zh.json
var zh_default = {
  name: "Web Access QR",
  open: "\u663E\u793A\u7F51\u9875\u8BBF\u95EE\u4E8C\u7EF4\u7801",
  title: "\u5728\u624B\u673A\u4E0A\u6253\u5F00Hermes",
  intro: "\u626B\u63CF\u4E8C\u7EF4\u7801\uFF0C\u7136\u540E\u767B\u5F55Hermes\u3002",
  setup: "\u8BBE\u7F6E\u7F51\u9875\u8BBF\u95EE",
  back: "\u8FD4\u56DE\u4E8C\u7EF4\u7801",
  flow: "\u9009\u62E9\u8FDE\u63A5\u65B9\u5F0F\uFF0C\u51C6\u5907\u8FDE\u63A5\uFF0C\u7136\u540E\u751F\u6210\u4E8C\u7EF4\u7801\u3002",
  provider: "\u8FDE\u63A5\u65B9\u5F0F",
  tailscale: "Tailscale",
  cloudflare: "Cloudflare Tunnel",
  existing: "\u73B0\u6709HTTPS\u7F51\u5740",
  tailHelp: "\u4EC5\u5728\u81EA\u5DF1\u7684\u8BBE\u5907\u4E4B\u95F4\u79C1\u5BC6\u8FDE\u63A5\u3002\u624B\u673A\u4E5F\u9700\u8981\u5B89\u88C5Tailscale\u3002",
  cloudHelp: "\u901A\u8FC7\u81EA\u5DF1\u7684\u57DF\u540D\u8BBF\u95EE\u3002\u9700\u8981Cloudflare\u8D26\u6237\u548C\u57DF\u540D\u3002",
  existingHelp: "\u4F7F\u7528\u5DF2\u914D\u7F6E\u7684\u96A7\u9053\u6216\u53CD\u5411\u4EE3\u7406\u7684HTTPS\u7F51\u5740\u3002",
  next: "\u7EE7\u7EED",
  change: "\u66F4\u6539\u8FDE\u63A5\u65B9\u5F0F",
  check: "\u91CD\u65B0\u68C0\u67E5",
  checking: "\u6B63\u5728\u68C0\u67E5\u8FDE\u63A5\u2026",
  unavailable: "\u8BF7\u5728\u672C\u673AHermes\u5E94\u7528\u4E2D\u5207\u6362\u5230\u4E3B\u914D\u7F6E\uFF0C\u5E76\u542F\u7528\u6B64\u63D2\u4EF6\u7684\u4EE3\u7406\u7EC4\u4EF6\u3002\u4E8C\u7EF4\u7801\u548C\u624B\u52A8\u8F93\u5165\u7F51\u5740\u4ECD\u7136\u53EF\u7528\u3002",
  mainProfile: "\u6253\u5F00\u4E3B\u914D\u7F6E",
  installTitle: "1. \u5B89\u88C5\u4E0E\u767B\u5F55",
  installed: "\u5DF2\u5B89\u88C5",
  missing: "\u672A\u5B89\u88C5",
  connected: "\u5DF2\u8FDE\u63A5",
  disconnected: "\u672A\u8FDE\u63A5",
  install: "\u901A\u8FC7Homebrew\u5B89\u88C5",
  download: "\u5B98\u65B9\u4E0B\u8F7D",
  login: "\u6253\u5F00Tailscale",
  installHelp: "\u5982\u9700\u7BA1\u7406\u5458\u6279\u51C6\uFF0C\u8BF7\u4F7F\u7528\u5B98\u65B9\u5B89\u88C5\u7A0B\u5E8F\u5B8C\u6210\u5B89\u88C5\u3002\u5728Tailscale\u4E2D\u767B\u5F55\u5E76\u6279\u51C6VPN\u8FDE\u63A5\u3002",
  webTitle: "2. \u51C6\u5907Hermes\u767B\u5F55",
  webHelp: "\u5728Hermes Web access\u4E2D\u9009\u62E9My own URL\uFF0C\u4F7F\u7528\u4E0B\u65B9\u5730\u5740\u542F\u52A8\u3002\u65B0\u7528\u6237\u5148\u5728Providers\u4E2D\u767B\u5F55\u3002\u5DF2\u6709\u7684\u5BC6\u7801\u767B\u5F55\u914D\u7F6E\u4F1A\u4FDD\u7559\u3002",
  webReady: "\u5DF2\u786E\u8BA4\u7F51\u9875\u767B\u5F55\u4FDD\u62A4\u3002",
  webSettings: "\u6253\u5F00Hermes Web access",
  returnHelp: "\u901A\u8FC7\u72B6\u6001\u680F\u7684\u4E8C\u7EF4\u7801\u6309\u94AE\u8FD4\u56DE\uFF0C\u7136\u540E\u91CD\u65B0\u68C0\u67E5\u3002",
  shareTitle: "3. \u8FDE\u63A5\u79C1\u5BC6\u5171\u4EAB",
  shareHelp: "\u4EC5\u5411Tailscale\u7F51\u7EDC\u5171\u4EAB\u6B64\u672C\u5730\u7F51\u9875\u670D\u52A1\u3002",
  reuse: "\u9A8C\u8BC1\u73B0\u6709\u8FDE\u63A5",
  share: "\u914D\u7F6E\u5171\u4EAB",
  conflict: "443\u7AEF\u53E3\u5DF2\u6709\u5176\u4ED6\u914D\u7F6E\uFF0C\u4E0D\u4F1A\u81EA\u52A8\u8986\u76D6\u3002",
  https: "HTTPS\u8BBE\u7F6E",
  running: "\u6B63\u5728\u8BBE\u7F6E\u3002\u5B89\u88C5\u6700\u591A\u53EF\u80FD\u9700\u8981\u56DB\u5206\u949F\u3002",
  done: "\u5DF2\u5B8C\u6210\u3002\u8BF7\u67E5\u770B\u4E0A\u65B9\u7684\u8FDE\u63A5\u72B6\u6001\u3002",
  failed: "\u8BBE\u7F6E\u672A\u5B8C\u6210\u3002\u8BF7\u68C0\u67E5Tailscale\u6743\u9650\u548CHTTPS\u8BBE\u7F6E\u3002\u5B89\u88C5\u65F6\u8BF7\u4F7F\u7528\u5B98\u65B9\u5B89\u88C5\u7A0B\u5E8F\uFF0C\u7136\u540E\u91CD\u8BD5\u3002",
  finishLogin: "\u5728Tailscale\u4E2D\u5B8C\u6210\u767B\u5F55\u548CVPN\u6279\u51C6\u540E\u91CD\u65B0\u68C0\u67E5\u3002",
  create: "\u4F7F\u7528\u6B64\u7F51\u5740\u751F\u6210\u4E8C\u7EF4\u7801",
  cf1: "1. \u51C6\u5907\u8D26\u6237\u4E0E\u57DF\u540D",
  cfHelp1: "\u5C06\u57DF\u540D\u6DFB\u52A0\u5230Cloudflare\uFF0C\u7136\u540E\u5728Networking \u2192 Tunnels\u4E2D\u521B\u5EFA\u96A7\u9053\u3002",
  console: "\u6253\u5F00Cloudflare",
  guide: "\u5B98\u65B9\u6307\u5357",
  cf2: "2. \u5B89\u88C5\u8FDE\u63A5\u5668",
  cfHelp2: "\u5728\u63A7\u5236\u53F0\u4E2D\u9009\u62E9\u672C\u673A\u64CD\u4F5C\u7CFB\u7EDF\uFF0C\u6309\u7167Install and Run\u6B65\u9AA4\u64CD\u4F5C\uFF0C\u76F4\u5230\u96A7\u9053\u663E\u793AHealthy\u3002\u5B89\u88C5\u4EE4\u724C\u53EA\u5728\u5B98\u65B9\u8BBE\u7F6E\u6D41\u7A0B\u4E2D\u5904\u7406\u3002",
  cf3: "3. \u8FDE\u63A5\u516C\u5F00\u5730\u5740",
  cfHelp3: "\u5148\u5728Hermes Web access\u4E2D\u51C6\u5907\u767B\u5F55\u5E76\u6CE8\u518CHTTPS\u7F51\u5740\uFF0C\u518D\u5C06\u516C\u5F00\u5E94\u7528\u8DEF\u7531\u6307\u5411\u4E0B\u65B9\u672C\u5730\u670D\u52A1\u3002\u786E\u8BA4\u663E\u793A\u767B\u5F55\u9875\u9762\uFF0C\u5FC5\u8981\u65F6\u6DFB\u52A0Cloudflare Access\u7B56\u7565\u3002",
  originFallback: "\u8FD9\u662F\u9ED8\u8BA4\u5730\u5740\uFF0C\u8BF7\u6838\u5BF9Web access\u7AEF\u53E3\u3002",
  address: "\u7F51\u9875\u8BBF\u95EE\u7F51\u5740",
  addressHelp: "\u4E8C\u7EF4\u7801\u4EC5\u5305\u542B\u5DF2\u4FDD\u5B58\u7684\u7F51\u5740\uFF0C\u4E0D\u5305\u542B\u51ED\u636E\u6216\u767B\u5F55\u94FE\u63A5\u3002",
  manualHelp: "\u5148\u5728\u6D4F\u89C8\u5668\u4E2D\u6253\u5F00\u6B64\u5730\u5740\u5E76\u786E\u8BA4Hermes\u767B\u5F55\u3002\u8FD9\u91CC\u53EA\u68C0\u67E5\u7F51\u5740\u683C\u5F0F\u3002",
  confirmed: "\u6211\u5DF2\u786E\u8BA4\u6B64\u5730\u5740\u53EF\u4EE5\u767B\u5F55\u5E76\u8BBF\u95EEHermes\u3002",
  save: "\u4FDD\u5B58",
  saved: "\u7F51\u5740\u5DF2\u4FDD\u5B58\u3002",
  copy: "\u590D\u5236\u7F51\u5740",
  copied: "\u5DF2\u590D\u5236\u3002",
  copyFailed: "\u65E0\u6CD5\u590D\u5236\uFF0C\u8BF7\u9009\u62E9\u663E\u793A\u7684\u5730\u5740\u5E76\u624B\u52A8\u590D\u5236\u3002",
  openFailed: "\u65E0\u6CD5\u6253\u5F00\u6D4F\u89C8\u5668\uFF0C\u8BF7\u624B\u52A8\u6253\u5F00\u663E\u793A\u7684\u94FE\u63A5\u3002",
  qrLabel: "Hermes\u7F51\u9875\u8BBF\u95EE\u4E8C\u7EF4\u7801",
  empty: "\u4FDD\u5B58\u7F51\u5740\u540E\u5373\u53EF\u751F\u6210\u4E8C\u7EF4\u7801\u3002",
  qrFailed: "\u65E0\u6CD5\u751F\u6210\u4E8C\u7EF4\u7801\u3002",
  phone: "\u624B\u673A\u4E0A\u4E5F\u9700\u8981\u4FDD\u6301Tailscale\u8FDE\u63A5\u3002",
  error: "\u8BF7\u68C0\u67E5\u7F51\u5740\u540E\u91CD\u8BD5\u3002",
  urlRequired: "\u8BF7\u8F93\u5165\u4E0D\u8D85\u8FC71,024\u4E2A\u5B57\u7B26\u7684HTTPS\u7F51\u5740\u3002",
  urlInvalid: "\u8BF7\u8F93\u5165\u6709\u6548\u7684\u7F51\u5740\u3002",
  urlHttps: "\u8BF7\u4F7F\u7528https://\u5730\u5740\u3002",
  urlCredentials: "\u8BF7\u4F7F\u7528\u4E0D\u542B\u51ED\u636E\u3001\u67E5\u8BE2\u53C2\u6570\u6216\u7247\u6BB5\u7684\u7F51\u5740\u3002",
  urlLocal: "\u8BF7\u4F7F\u7528\u624B\u673A\u53EF\u8BBF\u95EE\u7684\u5730\u5740\uFF0C\u800C\u4E0D\u662F\u56DE\u73AF\u5730\u5740\u3002"
};

// src/locales/de.json
var de_default = {
  name: "Web Access QR",
  open: "QR f\xFCr Webzugriff anzeigen",
  title: "Hermes auf dem Smartphone \xF6ffnen",
  intro: "QR scannen und bei Hermes anmelden.",
  setup: "Webzugriff einrichten",
  back: "Zur\xFCck zum QR",
  flow: "Verbindung w\xE4hlen, Zugriff vorbereiten und QR erstellen.",
  provider: "Verbindungsart",
  tailscale: "Tailscale",
  cloudflare: "Cloudflare Tunnel",
  existing: "Vorhandene HTTPS-URL",
  tailHelp: "Privater Zugriff zwischen Ihren Ger\xE4ten. Installieren Sie Tailscale auch auf dem Smartphone.",
  cloudHelp: "Zugriff \xFCber Ihre Domain. Cloudflare-Konto und Domain erforderlich.",
  existingHelp: "HTTPS-Adresse eines vorhandenen Tunnels oder Reverse-Proxys verwenden.",
  next: "Weiter",
  change: "Verbindungsart \xE4ndern",
  check: "Erneut pr\xFCfen",
  checking: "Verbindung wird gepr\xFCft\u2026",
  unavailable: "\xD6ffnen Sie die lokale Hermes-App, wechseln Sie zum Hauptprofil und aktivieren Sie die Agent-Komponente dieses Plugins. QR und manuelle URLs bleiben verf\xFCgbar.",
  mainProfile: "Hauptprofil \xF6ffnen",
  installTitle: "1. Installieren und anmelden",
  installed: "Installiert",
  missing: "Nicht installiert",
  connected: "Verbunden",
  disconnected: "Nicht verbunden",
  install: "Mit Homebrew installieren",
  download: "Offizieller Download",
  login: "Tailscale \xF6ffnen",
  installHelp: "Falls Administratorrechte n\xF6tig sind, verwenden Sie das offizielle Installationsprogramm. Melden Sie sich in Tailscale an und erlauben Sie die VPN-Verbindung.",
  webTitle: "2. Hermes-Anmeldung vorbereiten",
  webHelp: "W\xE4hlen Sie in Hermes Web access die Option My own URL und starten Sie mit der Adresse unten. Neue Nutzer melden sich zuerst unter Providers an. Eine vorhandene Passwortanmeldung bleibt erhalten.",
  webReady: "Der Anmeldeschutz ist bereit.",
  webSettings: "Hermes Web access \xF6ffnen",
  returnHelp: "Kehren Sie \xFCber die QR-Schaltfl\xE4che in der Statusleiste zur\xFCck und pr\xFCfen Sie erneut.",
  shareTitle: "3. Private Freigabe verbinden",
  shareHelp: "Diesen lokalen Webdienst nur im Tailscale-Netzwerk freigeben.",
  reuse: "Vorhandene Verbindung pr\xFCfen",
  share: "Freigabe einrichten",
  conflict: "Port 443 hat bereits eine andere Konfiguration. Sie wird nicht automatisch ersetzt.",
  https: "HTTPS-Einstellungen",
  running: "Einrichtung l\xE4uft. Die Installation kann bis zu vier Minuten dauern.",
  done: "Abgeschlossen. Pr\xFCfen Sie den Verbindungsstatus oben.",
  failed: "Einrichtung fehlgeschlagen. Pr\xFCfen Sie Tailscale-Berechtigungen und HTTPS. Verwenden Sie zur Installation das offizielle Installationsprogramm und versuchen Sie es erneut.",
  finishLogin: "Schlie\xDFen Sie Anmeldung und VPN-Freigabe in Tailscale ab und pr\xFCfen Sie erneut.",
  create: "QR mit dieser URL erstellen",
  cf1: "1. Konto und Domain vorbereiten",
  cfHelp1: "F\xFCgen Sie Ihre Domain zu Cloudflare hinzu und erstellen Sie unter Networking \u2192 Tunnels einen Tunnel.",
  console: "Cloudflare \xF6ffnen",
  guide: "Offizielle Anleitung",
  cf2: "2. Connector installieren",
  cfHelp2: "W\xE4hlen Sie im Dashboard das Betriebssystem dieses Computers. Folgen Sie Install and Run, bis der Tunnel Healthy meldet. Verwenden Sie das Installationstoken nur im offiziellen Einrichtungsablauf.",
  cf3: "3. \xD6ffentliche Adresse verbinden",
  cfHelp3: "Bereiten Sie zuerst die Hermes-Anmeldung und HTTPS-URL in Web access vor. Leiten Sie dann die ver\xF6ffentlichte Anwendung an den lokalen Dienst unten weiter. Pr\xFCfen Sie die Anmeldeseite und erg\xE4nzen Sie bei Bedarf Cloudflare Access.",
  originFallback: "Standardadresse \u2014 pr\xFCfen Sie den Port in Web access.",
  address: "Webzugriffs-URL",
  addressHelp: "Der QR enth\xE4lt nur die gespeicherte URL, keine Zugangsdaten oder Anmeldelinks.",
  manualHelp: "\xD6ffnen Sie die Adresse zuerst im Browser und pr\xFCfen Sie die Hermes-Anmeldung. Dieses Formular pr\xFCft nur das URL-Format.",
  confirmed: "Ich habe Anmeldung und Zugriff auf Hermes unter dieser URL gepr\xFCft.",
  save: "Speichern",
  saved: "URL gespeichert.",
  copy: "URL kopieren",
  copied: "Kopiert.",
  copyFailed: "Kopieren fehlgeschlagen. Markieren und kopieren Sie die angezeigte Adresse.",
  openFailed: "Browser konnte nicht ge\xF6ffnet werden. \xD6ffnen Sie den angezeigten Link manuell.",
  qrLabel: "Hermes-Webzugriffs-QR-Code",
  empty: "Speichern Sie eine URL, um einen QR zu erstellen.",
  qrFailed: "QR konnte nicht erstellt werden.",
  phone: "Tailscale auf dem Smartphone verbunden lassen.",
  error: "URL pr\xFCfen und erneut versuchen.",
  urlRequired: "HTTPS-URL mit h\xF6chstens 1.024 Zeichen eingeben.",
  urlInvalid: "G\xFCltige Webadresse eingeben.",
  urlHttps: "Eine https://-Adresse verwenden.",
  urlCredentials: "URL ohne Zugangsdaten, Abfrageparameter oder Fragment verwenden.",
  urlLocal: "Eine vom Smartphone erreichbare Adresse statt einer Loopback-Adresse verwenden."
};

// src/locales/fr.json
var fr_default = {
  name: "Web Access QR",
  open: "Afficher le QR d\u2019acc\xE8s web",
  title: "Ouvrir Hermes sur votre t\xE9l\xE9phone",
  intro: "Scannez le QR, puis connectez-vous \xE0 Hermes.",
  setup: "Configurer l\u2019acc\xE8s web",
  back: "Retour au QR",
  flow: "Choisissez une connexion, pr\xE9parez l\u2019acc\xE8s, puis cr\xE9ez votre QR.",
  provider: "Type de connexion",
  tailscale: "Tailscale",
  cloudflare: "Cloudflare Tunnel",
  existing: "URL HTTPS existante",
  tailHelp: "Acc\xE8s priv\xE9 entre vos appareils. Installez aussi Tailscale sur le t\xE9l\xE9phone.",
  cloudHelp: "Acc\xE8s via votre domaine. N\xE9cessite un compte Cloudflare et un domaine.",
  existingHelp: "Utilisez l\u2019adresse HTTPS d\u2019un tunnel ou proxy inverse d\xE9j\xE0 configur\xE9.",
  next: "Continuer",
  change: "Changer de connexion",
  check: "V\xE9rifier \xE0 nouveau",
  checking: "V\xE9rification de la connexion\u2026",
  unavailable: "Ouvrez l\u2019application Hermes locale, passez au profil principal et activez le composant agent de ce plugin. Le QR et la saisie manuelle restent disponibles.",
  mainProfile: "Ouvrir le profil principal",
  installTitle: "1. Installer et se connecter",
  installed: "Install\xE9",
  missing: "Non install\xE9",
  connected: "Connect\xE9",
  disconnected: "Non connect\xE9",
  install: "Installer avec Homebrew",
  download: "T\xE9l\xE9chargement officiel",
  login: "Ouvrir Tailscale",
  installHelp: "Si une autorisation administrateur est n\xE9cessaire, utilisez l\u2019installateur officiel. Connectez-vous \xE0 Tailscale et autorisez le VPN.",
  webTitle: "2. Pr\xE9parer la connexion \xE0 Hermes",
  webHelp: "Dans Hermes Web access, choisissez My own URL et d\xE9marrez avec l\u2019adresse ci-dessous. Les nouveaux utilisateurs se connectent d\u2019abord dans Providers. La connexion par mot de passe existante est conserv\xE9e.",
  webReady: "La protection par connexion est pr\xEAte.",
  webSettings: "Ouvrir Hermes Web access",
  returnHelp: "Revenez avec le bouton QR de la barre d\u2019\xE9tat, puis v\xE9rifiez \xE0 nouveau.",
  shareTitle: "3. Activer le partage priv\xE9",
  shareHelp: "Partager ce service web local uniquement avec votre r\xE9seau Tailscale.",
  reuse: "V\xE9rifier la connexion existante",
  share: "Configurer le partage",
  conflict: "Le port 443 poss\xE8de une autre configuration. Elle ne sera pas remplac\xE9e automatiquement.",
  https: "Param\xE8tres HTTPS",
  running: "Configuration en cours. L\u2019installation peut durer jusqu\u2019\xE0 quatre minutes.",
  done: "Termin\xE9. V\xE9rifiez l\u2019\xE9tat de connexion ci-dessus.",
  failed: "La configuration a \xE9chou\xE9. V\xE9rifiez les autorisations Tailscale et les param\xE8tres HTTPS. Pour l\u2019installation, utilisez l\u2019installateur officiel, puis r\xE9essayez.",
  finishLogin: "Terminez la connexion et l\u2019autorisation VPN dans Tailscale, puis v\xE9rifiez \xE0 nouveau.",
  create: "Cr\xE9er le QR avec cette URL",
  cf1: "1. Pr\xE9parer un compte et un domaine",
  cfHelp1: "Ajoutez votre domaine \xE0 Cloudflare, puis cr\xE9ez un tunnel dans Networking \u2192 Tunnels.",
  console: "Ouvrir Cloudflare",
  guide: "Guide officiel",
  cf2: "2. Installer le connecteur",
  cfHelp2: "Choisissez le syst\xE8me de cet ordinateur dans la console. Suivez Install and Run jusqu\u2019\xE0 l\u2019\xE9tat Healthy. Utilisez le jeton d\u2019installation uniquement dans le parcours officiel.",
  cf3: "3. Connecter l\u2019adresse publique",
  cfHelp3: "Pr\xE9parez d\u2019abord la connexion Hermes et l\u2019URL HTTPS dans Web access. Configurez ensuite l\u2019application publi\xE9e vers le service local ci-dessous. V\xE9rifiez la page de connexion et ajoutez Cloudflare Access si n\xE9cessaire.",
  originFallback: "Adresse par d\xE9faut \u2014 v\xE9rifiez le port Web access.",
  address: "URL d\u2019acc\xE8s web",
  addressHelp: "Le QR contient uniquement l\u2019URL enregistr\xE9e, sans identifiants ni liens de connexion.",
  manualHelp: "Ouvrez d\u2019abord cette adresse dans le navigateur et v\xE9rifiez la connexion \xE0 Hermes. Seul le format de l\u2019adresse est valid\xE9 ici.",
  confirmed: "J\u2019ai v\xE9rifi\xE9 la connexion et l\u2019acc\xE8s \xE0 Hermes \xE0 cette URL.",
  save: "Enregistrer",
  saved: "URL enregistr\xE9e.",
  copy: "Copier l\u2019URL",
  copied: "Copi\xE9.",
  copyFailed: "\xC9chec de la copie. S\xE9lectionnez et copiez l\u2019adresse affich\xE9e.",
  openFailed: "Impossible d\u2019ouvrir le navigateur. Ouvrez le lien affich\xE9 manuellement.",
  qrLabel: "QR d\u2019acc\xE8s web \xE0 Hermes",
  empty: "Enregistrez une URL pour cr\xE9er un QR.",
  qrFailed: "Impossible de g\xE9n\xE9rer le QR.",
  phone: "Gardez Tailscale connect\xE9 sur votre t\xE9l\xE9phone.",
  error: "V\xE9rifiez l\u2019URL et r\xE9essayez.",
  urlRequired: "Saisissez une URL HTTPS de 1 024 caract\xE8res maximum.",
  urlInvalid: "Saisissez une adresse web valide.",
  urlHttps: "Utilisez une adresse https://.",
  urlCredentials: "Utilisez une URL sans identifiants, param\xE8tres de requ\xEAte ni fragment.",
  urlLocal: "Utilisez une adresse accessible depuis votre t\xE9l\xE9phone, pas une adresse de bouclage."
};

// src/locales/es.json
var es_default = {
  name: "Web Access QR",
  open: "Mostrar QR de acceso web",
  title: "Abrir Hermes en el tel\xE9fono",
  intro: "Escanea el QR e inicia sesi\xF3n en Hermes.",
  setup: "Configurar acceso web",
  back: "Volver al QR",
  flow: "Elige una conexi\xF3n, prepara el acceso y crea el QR.",
  provider: "Tipo de conexi\xF3n",
  tailscale: "Tailscale",
  cloudflare: "Cloudflare Tunnel",
  existing: "URL HTTPS existente",
  tailHelp: "Acceso privado entre tus dispositivos. Instala Tailscale tambi\xE9n en el tel\xE9fono.",
  cloudHelp: "Acceso mediante tu dominio. Requiere cuenta de Cloudflare y dominio.",
  existingHelp: "Usa la direcci\xF3n HTTPS de un t\xFAnel o proxy inverso ya configurado.",
  next: "Continuar",
  change: "Cambiar conexi\xF3n",
  check: "Comprobar de nuevo",
  checking: "Comprobando conexi\xF3n\u2026",
  unavailable: "Abre la app local de Hermes, cambia al perfil principal y activa el componente de agente del plugin. El QR y las URL manuales siguen disponibles.",
  mainProfile: "Abrir perfil principal",
  installTitle: "1. Instalar e iniciar sesi\xF3n",
  installed: "Instalado",
  missing: "Sin instalar",
  connected: "Conectado",
  disconnected: "Sin conexi\xF3n",
  install: "Instalar con Homebrew",
  download: "Descarga oficial",
  login: "Abrir Tailscale",
  installHelp: "Si se necesita autorizaci\xF3n de administrador, usa el instalador oficial. Inicia sesi\xF3n en Tailscale y autoriza la VPN.",
  webTitle: "2. Preparar el inicio de sesi\xF3n",
  webHelp: "En Hermes Web access, elige My own URL e inicia con la direcci\xF3n de abajo. Los usuarios nuevos deben iniciar sesi\xF3n primero en Providers. Se conserva el acceso por contrase\xF1a existente.",
  webReady: "La protecci\xF3n de inicio de sesi\xF3n est\xE1 lista.",
  webSettings: "Abrir Hermes Web access",
  returnHelp: "Vuelve con el bot\xF3n QR de la barra de estado y comprueba de nuevo.",
  shareTitle: "3. Conectar el acceso privado",
  shareHelp: "Comparte este servicio web local solo en tu red Tailscale.",
  reuse: "Verificar conexi\xF3n existente",
  share: "Configurar acceso",
  conflict: "El puerto 443 tiene otra configuraci\xF3n. No se reemplazar\xE1 autom\xE1ticamente.",
  https: "Ajustes HTTPS",
  running: "Configuraci\xF3n en curso. La instalaci\xF3n puede tardar hasta cuatro minutos.",
  done: "Completado. Comprueba el estado de conexi\xF3n de arriba.",
  failed: "No se pudo completar. Revisa los permisos de Tailscale y HTTPS. Para instalar, usa el instalador oficial y vuelve a intentarlo.",
  finishLogin: "Completa el inicio de sesi\xF3n y la autorizaci\xF3n VPN en Tailscale y comprueba de nuevo.",
  create: "Crear QR con esta URL",
  cf1: "1. Preparar cuenta y dominio",
  cfHelp1: "A\xF1ade tu dominio a Cloudflare y crea un t\xFAnel en Networking \u2192 Tunnels.",
  console: "Abrir Cloudflare",
  guide: "Gu\xEDa oficial",
  cf2: "2. Instalar el conector",
  cfHelp2: "Elige el sistema de este equipo en la consola. Sigue Install and Run hasta que el t\xFAnel est\xE9 Healthy. Usa el token de instalaci\xF3n solo en el proceso oficial.",
  cf3: "3. Conectar la direcci\xF3n p\xFAblica",
  cfHelp3: "Primero configura el inicio de sesi\xF3n y la URL HTTPS en Hermes Web access. Despu\xE9s dirige la aplicaci\xF3n publicada al servicio local indicado abajo. Comprueba la p\xE1gina de acceso y a\xF1ade Cloudflare Access si lo necesitas.",
  originFallback: "Direcci\xF3n predeterminada: comprueba el puerto de Web access.",
  address: "URL de acceso web",
  addressHelp: "El QR solo incluye la URL guardada, sin credenciales ni enlaces de inicio de sesi\xF3n.",
  manualHelp: "Abre esta direcci\xF3n en el navegador y verifica el inicio de sesi\xF3n en Hermes. Aqu\xED solo se comprueba el formato de la URL.",
  confirmed: "He verificado el inicio de sesi\xF3n y acceso a Hermes en esta URL.",
  save: "Guardar",
  saved: "URL guardada.",
  copy: "Copiar URL",
  copied: "Copiado.",
  copyFailed: "No se pudo copiar. Selecciona y copia la direcci\xF3n mostrada.",
  openFailed: "No se pudo abrir el navegador. Abre el enlace mostrado manualmente.",
  qrLabel: "C\xF3digo QR de acceso web a Hermes",
  empty: "Guarda una URL para crear un QR.",
  qrFailed: "No se pudo generar el QR.",
  phone: "Mant\xE9n Tailscale conectado en el tel\xE9fono.",
  error: "Comprueba la URL e int\xE9ntalo de nuevo.",
  urlRequired: "Introduce una URL HTTPS de hasta 1.024 caracteres.",
  urlInvalid: "Introduce una direcci\xF3n web v\xE1lida.",
  urlHttps: "Usa una direcci\xF3n https://.",
  urlCredentials: "Usa una URL sin credenciales, par\xE1metros ni fragmentos.",
  urlLocal: "Usa una direcci\xF3n accesible desde el tel\xE9fono, no una direcci\xF3n de bucle local."
};

// src/locales/ru.json
var ru_default = {
  name: "Web Access QR",
  open: "\u041F\u043E\u043A\u0430\u0437\u0430\u0442\u044C QR \u0434\u043B\u044F \u0432\u0435\u0431-\u0434\u043E\u0441\u0442\u0443\u043F\u0430",
  title: "\u041E\u0442\u043A\u0440\u044B\u0442\u044C Hermes \u043D\u0430 \u0442\u0435\u043B\u0435\u0444\u043E\u043D\u0435",
  intro: "\u041E\u0442\u0441\u043A\u0430\u043D\u0438\u0440\u0443\u0439\u0442\u0435 QR \u0438 \u0432\u043E\u0439\u0434\u0438\u0442\u0435 \u0432 Hermes.",
  setup: "\u041D\u0430\u0441\u0442\u0440\u043E\u0438\u0442\u044C \u0432\u0435\u0431-\u0434\u043E\u0441\u0442\u0443\u043F",
  back: "\u041D\u0430\u0437\u0430\u0434 \u043A QR",
  flow: "\u0412\u044B\u0431\u0435\u0440\u0438\u0442\u0435 \u043F\u043E\u0434\u043A\u043B\u044E\u0447\u0435\u043D\u0438\u0435, \u043F\u043E\u0434\u0433\u043E\u0442\u043E\u0432\u044C\u0442\u0435 \u0434\u043E\u0441\u0442\u0443\u043F \u0438 \u0441\u043E\u0437\u0434\u0430\u0439\u0442\u0435 QR.",
  provider: "\u0421\u043F\u043E\u0441\u043E\u0431 \u043F\u043E\u0434\u043A\u043B\u044E\u0447\u0435\u043D\u0438\u044F",
  tailscale: "Tailscale",
  cloudflare: "Cloudflare Tunnel",
  existing: "\u0413\u043E\u0442\u043E\u0432\u044B\u0439 HTTPS-\u0430\u0434\u0440\u0435\u0441",
  tailHelp: "\u0427\u0430\u0441\u0442\u043D\u044B\u0439 \u0434\u043E\u0441\u0442\u0443\u043F \u043C\u0435\u0436\u0434\u0443 \u0432\u0430\u0448\u0438\u043C\u0438 \u0443\u0441\u0442\u0440\u043E\u0439\u0441\u0442\u0432\u0430\u043C\u0438. \u0423\u0441\u0442\u0430\u043D\u043E\u0432\u0438\u0442\u0435 Tailscale \u0438 \u043D\u0430 \u0442\u0435\u043B\u0435\u0444\u043E\u043D.",
  cloudHelp: "\u0414\u043E\u0441\u0442\u0443\u043F \u0447\u0435\u0440\u0435\u0437 \u0441\u0432\u043E\u0439 \u0434\u043E\u043C\u0435\u043D. \u041D\u0443\u0436\u043D\u044B \u0430\u043A\u043A\u0430\u0443\u043D\u0442 Cloudflare \u0438 \u0434\u043E\u043C\u0435\u043D.",
  existingHelp: "\u0418\u0441\u043F\u043E\u043B\u044C\u0437\u0443\u0439\u0442\u0435 HTTPS-\u0430\u0434\u0440\u0435\u0441 \u0433\u043E\u0442\u043E\u0432\u043E\u0433\u043E \u0442\u0443\u043D\u043D\u0435\u043B\u044F \u0438\u043B\u0438 \u043E\u0431\u0440\u0430\u0442\u043D\u043E\u0433\u043E \u043F\u0440\u043E\u043A\u0441\u0438.",
  next: "\u0414\u0430\u043B\u0435\u0435",
  change: "\u0418\u0437\u043C\u0435\u043D\u0438\u0442\u044C \u043F\u043E\u0434\u043A\u043B\u044E\u0447\u0435\u043D\u0438\u0435",
  check: "\u041F\u0440\u043E\u0432\u0435\u0440\u0438\u0442\u044C \u0441\u043D\u043E\u0432\u0430",
  checking: "\u041F\u0440\u043E\u0432\u0435\u0440\u043A\u0430 \u043F\u043E\u0434\u043A\u043B\u044E\u0447\u0435\u043D\u0438\u044F\u2026",
  unavailable: "\u041E\u0442\u043A\u0440\u043E\u0439\u0442\u0435 \u043B\u043E\u043A\u0430\u043B\u044C\u043D\u043E\u0435 \u043F\u0440\u0438\u043B\u043E\u0436\u0435\u043D\u0438\u0435 Hermes, \u0432\u044B\u0431\u0435\u0440\u0438\u0442\u0435 \u043E\u0441\u043D\u043E\u0432\u043D\u043E\u0439 \u043F\u0440\u043E\u0444\u0438\u043B\u044C \u0438 \u0432\u043A\u043B\u044E\u0447\u0438\u0442\u0435 \u0430\u0433\u0435\u043D\u0442\u0441\u043A\u0443\u044E \u0447\u0430\u0441\u0442\u044C \u043F\u043B\u0430\u0433\u0438\u043D\u0430. QR \u0438 \u0440\u0443\u0447\u043D\u043E\u0439 \u0432\u0432\u043E\u0434 \u0430\u0434\u0440\u0435\u0441\u0430 \u043E\u0441\u0442\u0430\u044E\u0442\u0441\u044F \u0434\u043E\u0441\u0442\u0443\u043F\u043D\u044B.",
  mainProfile: "\u041E\u0442\u043A\u0440\u044B\u0442\u044C \u043E\u0441\u043D\u043E\u0432\u043D\u043E\u0439 \u043F\u0440\u043E\u0444\u0438\u043B\u044C",
  installTitle: "1. \u0423\u0441\u0442\u0430\u043D\u043E\u0432\u043A\u0430 \u0438 \u0432\u0445\u043E\u0434",
  installed: "\u0423\u0441\u0442\u0430\u043D\u043E\u0432\u043B\u0435\u043D\u043E",
  missing: "\u041D\u0435 \u0443\u0441\u0442\u0430\u043D\u043E\u0432\u043B\u0435\u043D\u043E",
  connected: "\u041F\u043E\u0434\u043A\u043B\u044E\u0447\u0435\u043D\u043E",
  disconnected: "\u041D\u0435 \u043F\u043E\u0434\u043A\u043B\u044E\u0447\u0435\u043D\u043E",
  install: "\u0423\u0441\u0442\u0430\u043D\u043E\u0432\u0438\u0442\u044C \u0447\u0435\u0440\u0435\u0437 Homebrew",
  download: "\u041E\u0444\u0438\u0446\u0438\u0430\u043B\u044C\u043D\u0430\u044F \u0437\u0430\u0433\u0440\u0443\u0437\u043A\u0430",
  login: "\u041E\u0442\u043A\u0440\u044B\u0442\u044C Tailscale",
  installHelp: "\u0415\u0441\u043B\u0438 \u043D\u0443\u0436\u043D\u044B \u043F\u0440\u0430\u0432\u0430 \u0430\u0434\u043C\u0438\u043D\u0438\u0441\u0442\u0440\u0430\u0442\u043E\u0440\u0430, \u0438\u0441\u043F\u043E\u043B\u044C\u0437\u0443\u0439\u0442\u0435 \u043E\u0444\u0438\u0446\u0438\u0430\u043B\u044C\u043D\u044B\u0439 \u0443\u0441\u0442\u0430\u043D\u043E\u0432\u0449\u0438\u043A. \u0412\u043E\u0439\u0434\u0438\u0442\u0435 \u0432 Tailscale \u0438 \u0440\u0430\u0437\u0440\u0435\u0448\u0438\u0442\u0435 VPN-\u043F\u043E\u0434\u043A\u043B\u044E\u0447\u0435\u043D\u0438\u0435.",
  webTitle: "2. \u041F\u043E\u0434\u0433\u043E\u0442\u043E\u0432\u043A\u0430 \u0432\u0445\u043E\u0434\u0430 \u0432 Hermes",
  webHelp: "\u0412 Hermes Web access \u0432\u044B\u0431\u0435\u0440\u0438\u0442\u0435 My own URL \u0438 \u0437\u0430\u043F\u0443\u0441\u0442\u0438\u0442\u0435 \u0441 \u0430\u0434\u0440\u0435\u0441\u043E\u043C \u043D\u0438\u0436\u0435. \u041D\u043E\u0432\u044B\u043C \u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044F\u043C \u0441\u043D\u0430\u0447\u0430\u043B\u0430 \u043D\u0443\u0436\u043D\u043E \u0432\u043E\u0439\u0442\u0438 \u0432 Providers. \u0421\u0443\u0449\u0435\u0441\u0442\u0432\u0443\u044E\u0449\u0438\u0439 \u0432\u0445\u043E\u0434 \u043F\u043E \u043F\u0430\u0440\u043E\u043B\u044E \u0441\u043E\u0445\u0440\u0430\u043D\u044F\u0435\u0442\u0441\u044F.",
  webReady: "\u0417\u0430\u0449\u0438\u0442\u0430 \u0432\u0445\u043E\u0434\u0430 \u0433\u043E\u0442\u043E\u0432\u0430.",
  webSettings: "\u041E\u0442\u043A\u0440\u044B\u0442\u044C Hermes Web access",
  returnHelp: "\u0412\u0435\u0440\u043D\u0438\u0442\u0435\u0441\u044C \u0447\u0435\u0440\u0435\u0437 \u043A\u043D\u043E\u043F\u043A\u0443 QR \u0432 \u0441\u0442\u0440\u043E\u043A\u0435 \u0441\u043E\u0441\u0442\u043E\u044F\u043D\u0438\u044F \u0438 \u043F\u0440\u043E\u0432\u0435\u0440\u044C\u0442\u0435 \u0441\u043D\u043E\u0432\u0430.",
  shareTitle: "3. \u041F\u043E\u0434\u043A\u043B\u044E\u0447\u0435\u043D\u0438\u0435 \u0447\u0430\u0441\u0442\u043D\u043E\u0433\u043E \u0434\u043E\u0441\u0442\u0443\u043F\u0430",
  shareHelp: "\u041E\u0442\u043A\u0440\u043E\u0439\u0442\u0435 \u044D\u0442\u043E\u0442 \u043B\u043E\u043A\u0430\u043B\u044C\u043D\u044B\u0439 \u0432\u0435\u0431-\u0441\u0435\u0440\u0432\u0438\u0441 \u0442\u043E\u043B\u044C\u043A\u043E \u0434\u043B\u044F \u0441\u0435\u0442\u0438 Tailscale.",
  reuse: "\u041F\u0440\u043E\u0432\u0435\u0440\u0438\u0442\u044C \u0433\u043E\u0442\u043E\u0432\u043E\u0435 \u043F\u043E\u0434\u043A\u043B\u044E\u0447\u0435\u043D\u0438\u0435",
  share: "\u041D\u0430\u0441\u0442\u0440\u043E\u0438\u0442\u044C \u0434\u043E\u0441\u0442\u0443\u043F",
  conflict: "\u041F\u043E\u0440\u0442 443 \u0443\u0436\u0435 \u043D\u0430\u0441\u0442\u0440\u043E\u0435\u043D \u0438\u043D\u0430\u0447\u0435. \u0410\u0432\u0442\u043E\u043C\u0430\u0442\u0438\u0447\u0435\u0441\u043A\u043E\u0439 \u0437\u0430\u043C\u0435\u043D\u044B \u043D\u0435 \u0431\u0443\u0434\u0435\u0442.",
  https: "\u041D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0438 HTTPS",
  running: "\u0418\u0434\u0451\u0442 \u043D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0430. \u0423\u0441\u0442\u0430\u043D\u043E\u0432\u043A\u0430 \u043C\u043E\u0436\u0435\u0442 \u0437\u0430\u043D\u044F\u0442\u044C \u0434\u043E \u0447\u0435\u0442\u044B\u0440\u0451\u0445 \u043C\u0438\u043D\u0443\u0442.",
  done: "\u0413\u043E\u0442\u043E\u0432\u043E. \u041F\u0440\u043E\u0432\u0435\u0440\u044C\u0442\u0435 \u0441\u043E\u0441\u0442\u043E\u044F\u043D\u0438\u0435 \u043F\u043E\u0434\u043A\u043B\u044E\u0447\u0435\u043D\u0438\u044F \u0432\u044B\u0448\u0435.",
  failed: "\u041D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0430 \u043D\u0435 \u0437\u0430\u0432\u0435\u0440\u0448\u0435\u043D\u0430. \u041F\u0440\u043E\u0432\u0435\u0440\u044C\u0442\u0435 \u0440\u0430\u0437\u0440\u0435\u0448\u0435\u043D\u0438\u044F Tailscale \u0438 HTTPS. \u0414\u043B\u044F \u0443\u0441\u0442\u0430\u043D\u043E\u0432\u043A\u0438 \u0438\u0441\u043F\u043E\u043B\u044C\u0437\u0443\u0439\u0442\u0435 \u043E\u0444\u0438\u0446\u0438\u0430\u043B\u044C\u043D\u044B\u0439 \u0443\u0441\u0442\u0430\u043D\u043E\u0432\u0449\u0438\u043A \u0438 \u043F\u043E\u0432\u0442\u043E\u0440\u0438\u0442\u0435 \u043F\u043E\u043F\u044B\u0442\u043A\u0443.",
  finishLogin: "\u0417\u0430\u0432\u0435\u0440\u0448\u0438\u0442\u0435 \u0432\u0445\u043E\u0434 \u0438 \u0440\u0430\u0437\u0440\u0435\u0448\u0438\u0442\u0435 VPN \u0432 Tailscale, \u0437\u0430\u0442\u0435\u043C \u043F\u0440\u043E\u0432\u0435\u0440\u044C\u0442\u0435 \u0441\u043D\u043E\u0432\u0430.",
  create: "\u0421\u043E\u0437\u0434\u0430\u0442\u044C QR \u0441 \u044D\u0442\u0438\u043C \u0430\u0434\u0440\u0435\u0441\u043E\u043C",
  cf1: "1. \u0410\u043A\u043A\u0430\u0443\u043D\u0442 \u0438 \u0434\u043E\u043C\u0435\u043D",
  cfHelp1: "\u0414\u043E\u0431\u0430\u0432\u044C\u0442\u0435 \u0434\u043E\u043C\u0435\u043D \u0432 Cloudflare \u0438 \u0441\u043E\u0437\u0434\u0430\u0439\u0442\u0435 \u0442\u0443\u043D\u043D\u0435\u043B\u044C \u0432 Networking \u2192 Tunnels.",
  console: "\u041E\u0442\u043A\u0440\u044B\u0442\u044C Cloudflare",
  guide: "\u041E\u0444\u0438\u0446\u0438\u0430\u043B\u044C\u043D\u0430\u044F \u0438\u043D\u0441\u0442\u0440\u0443\u043A\u0446\u0438\u044F",
  cf2: "2. \u0423\u0441\u0442\u0430\u043D\u043E\u0432\u043A\u0430 \u043A\u043E\u043D\u043D\u0435\u043A\u0442\u043E\u0440\u0430",
  cfHelp2: "\u0412\u044B\u0431\u0435\u0440\u0438\u0442\u0435 \u041E\u0421 \u044D\u0442\u043E\u0433\u043E \u043A\u043E\u043C\u043F\u044C\u044E\u0442\u0435\u0440\u0430 \u0432 \u043A\u043E\u043D\u0441\u043E\u043B\u0438. \u0421\u043B\u0435\u0434\u0443\u0439\u0442\u0435 Install and Run \u0434\u043E \u0441\u0442\u0430\u0442\u0443\u0441\u0430 Healthy. \u0418\u0441\u043F\u043E\u043B\u044C\u0437\u0443\u0439\u0442\u0435 \u0442\u043E\u043A\u0435\u043D \u0443\u0441\u0442\u0430\u043D\u043E\u0432\u043A\u0438 \u0442\u043E\u043B\u044C\u043A\u043E \u0432 \u043E\u0444\u0438\u0446\u0438\u0430\u043B\u044C\u043D\u043E\u043C \u043F\u0440\u043E\u0446\u0435\u0441\u0441\u0435 \u043D\u0430\u0441\u0442\u0440\u043E\u0439\u043A\u0438.",
  cf3: "3. \u041F\u043E\u0434\u043A\u043B\u044E\u0447\u0435\u043D\u0438\u0435 \u043F\u0443\u0431\u043B\u0438\u0447\u043D\u043E\u0433\u043E \u0430\u0434\u0440\u0435\u0441\u0430",
  cfHelp3: "\u0421\u043D\u0430\u0447\u0430\u043B\u0430 \u043F\u043E\u0434\u0433\u043E\u0442\u043E\u0432\u044C\u0442\u0435 \u0432\u0445\u043E\u0434 \u0438 HTTPS-\u0430\u0434\u0440\u0435\u0441 \u0432 Hermes Web access. \u0417\u0430\u0442\u0435\u043C \u043D\u0430\u043F\u0440\u0430\u0432\u044C\u0442\u0435 \u043E\u043F\u0443\u0431\u043B\u0438\u043A\u043E\u0432\u0430\u043D\u043D\u043E\u0435 \u043F\u0440\u0438\u043B\u043E\u0436\u0435\u043D\u0438\u0435 \u043D\u0430 \u043B\u043E\u043A\u0430\u043B\u044C\u043D\u044B\u0439 \u0441\u0435\u0440\u0432\u0438\u0441 \u043D\u0438\u0436\u0435. \u041F\u0440\u043E\u0432\u0435\u0440\u044C\u0442\u0435 \u0441\u0442\u0440\u0430\u043D\u0438\u0446\u0443 \u0432\u0445\u043E\u0434\u0430 \u0438 \u043F\u0440\u0438 \u043D\u0435\u043E\u0431\u0445\u043E\u0434\u0438\u043C\u043E\u0441\u0442\u0438 \u0434\u043E\u0431\u0430\u0432\u044C\u0442\u0435 Cloudflare Access.",
  originFallback: "\u0410\u0434\u0440\u0435\u0441 \u043F\u043E \u0443\u043C\u043E\u043B\u0447\u0430\u043D\u0438\u044E \u2014 \u043F\u0440\u043E\u0432\u0435\u0440\u044C\u0442\u0435 \u043F\u043E\u0440\u0442 Web access.",
  address: "\u0410\u0434\u0440\u0435\u0441 \u0432\u0435\u0431-\u0434\u043E\u0441\u0442\u0443\u043F\u0430",
  addressHelp: "QR \u0441\u043E\u0434\u0435\u0440\u0436\u0438\u0442 \u0442\u043E\u043B\u044C\u043A\u043E \u0441\u043E\u0445\u0440\u0430\u043D\u0451\u043D\u043D\u044B\u0439 \u0430\u0434\u0440\u0435\u0441, \u0431\u0435\u0437 \u0443\u0447\u0451\u0442\u043D\u044B\u0445 \u0434\u0430\u043D\u043D\u044B\u0445 \u0438 \u0441\u0441\u044B\u043B\u043E\u043A \u0434\u043B\u044F \u0432\u0445\u043E\u0434\u0430.",
  manualHelp: "\u041E\u0442\u043A\u0440\u043E\u0439\u0442\u0435 \u0430\u0434\u0440\u0435\u0441 \u0432 \u0431\u0440\u0430\u0443\u0437\u0435\u0440\u0435 \u0438 \u043F\u0440\u043E\u0432\u0435\u0440\u044C\u0442\u0435 \u0432\u0445\u043E\u0434 \u0432 Hermes. \u0417\u0434\u0435\u0441\u044C \u043F\u0440\u043E\u0432\u0435\u0440\u044F\u0435\u0442\u0441\u044F \u0442\u043E\u043B\u044C\u043A\u043E \u0444\u043E\u0440\u043C\u0430\u0442 \u0430\u0434\u0440\u0435\u0441\u0430.",
  confirmed: "\u042F \u043F\u0440\u043E\u0432\u0435\u0440\u0438\u043B \u0432\u0445\u043E\u0434 \u0438 \u0434\u043E\u0441\u0442\u0443\u043F \u043A Hermes \u043F\u043E \u044D\u0442\u043E\u043C\u0443 \u0430\u0434\u0440\u0435\u0441\u0443.",
  save: "\u0421\u043E\u0445\u0440\u0430\u043D\u0438\u0442\u044C",
  saved: "\u0410\u0434\u0440\u0435\u0441 \u0441\u043E\u0445\u0440\u0430\u043D\u0451\u043D.",
  copy: "\u041A\u043E\u043F\u0438\u0440\u043E\u0432\u0430\u0442\u044C \u0430\u0434\u0440\u0435\u0441",
  copied: "\u0421\u043A\u043E\u043F\u0438\u0440\u043E\u0432\u0430\u043D\u043E.",
  copyFailed: "\u041D\u0435 \u0443\u0434\u0430\u043B\u043E\u0441\u044C \u0441\u043A\u043E\u043F\u0438\u0440\u043E\u0432\u0430\u0442\u044C. \u0412\u044B\u0434\u0435\u043B\u0438\u0442\u0435 \u0438 \u0441\u043A\u043E\u043F\u0438\u0440\u0443\u0439\u0442\u0435 \u043F\u043E\u043A\u0430\u0437\u0430\u043D\u043D\u044B\u0439 \u0430\u0434\u0440\u0435\u0441.",
  openFailed: "\u041D\u0435 \u0443\u0434\u0430\u043B\u043E\u0441\u044C \u043E\u0442\u043A\u0440\u044B\u0442\u044C \u0431\u0440\u0430\u0443\u0437\u0435\u0440. \u041E\u0442\u043A\u0440\u043E\u0439\u0442\u0435 \u043F\u043E\u043A\u0430\u0437\u0430\u043D\u043D\u0443\u044E \u0441\u0441\u044B\u043B\u043A\u0443 \u0432\u0440\u0443\u0447\u043D\u0443\u044E.",
  qrLabel: "QR-\u043A\u043E\u0434 \u0432\u0435\u0431-\u0434\u043E\u0441\u0442\u0443\u043F\u0430 \u043A Hermes",
  empty: "\u0421\u043E\u0445\u0440\u0430\u043D\u0438\u0442\u0435 \u0430\u0434\u0440\u0435\u0441 \u0434\u043B\u044F \u0441\u043E\u0437\u0434\u0430\u043D\u0438\u044F QR.",
  qrFailed: "\u041D\u0435 \u0443\u0434\u0430\u043B\u043E\u0441\u044C \u0441\u043E\u0437\u0434\u0430\u0442\u044C QR.",
  phone: "\u041E\u0441\u0442\u0430\u0432\u044C\u0442\u0435 Tailscale \u043F\u043E\u0434\u043A\u043B\u044E\u0447\u0451\u043D\u043D\u044B\u043C \u043D\u0430 \u0442\u0435\u043B\u0435\u0444\u043E\u043D\u0435.",
  error: "\u041F\u0440\u043E\u0432\u0435\u0440\u044C\u0442\u0435 \u0430\u0434\u0440\u0435\u0441 \u0438 \u043F\u043E\u0432\u0442\u043E\u0440\u0438\u0442\u0435 \u043F\u043E\u043F\u044B\u0442\u043A\u0443.",
  urlRequired: "\u0412\u0432\u0435\u0434\u0438\u0442\u0435 HTTPS-\u0430\u0434\u0440\u0435\u0441 \u0434\u043B\u0438\u043D\u043E\u0439 \u0434\u043E 1024 \u0441\u0438\u043C\u0432\u043E\u043B\u043E\u0432.",
  urlInvalid: "\u0412\u0432\u0435\u0434\u0438\u0442\u0435 \u043A\u043E\u0440\u0440\u0435\u043A\u0442\u043D\u044B\u0439 \u0432\u0435\u0431-\u0430\u0434\u0440\u0435\u0441.",
  urlHttps: "\u0418\u0441\u043F\u043E\u043B\u044C\u0437\u0443\u0439\u0442\u0435 \u0430\u0434\u0440\u0435\u0441 https://.",
  urlCredentials: "\u0418\u0441\u043F\u043E\u043B\u044C\u0437\u0443\u0439\u0442\u0435 \u0430\u0434\u0440\u0435\u0441 \u0431\u0435\u0437 \u0443\u0447\u0451\u0442\u043D\u044B\u0445 \u0434\u0430\u043D\u043D\u044B\u0445, \u043F\u0430\u0440\u0430\u043C\u0435\u0442\u0440\u043E\u0432 \u0437\u0430\u043F\u0440\u043E\u0441\u0430 \u0438 \u0444\u0440\u0430\u0433\u043C\u0435\u043D\u0442\u0430.",
  urlLocal: "\u0418\u0441\u043F\u043E\u043B\u044C\u0437\u0443\u0439\u0442\u0435 \u0430\u0434\u0440\u0435\u0441, \u0434\u043E\u0441\u0442\u0443\u043F\u043D\u044B\u0439 \u0441 \u0442\u0435\u043B\u0435\u0444\u043E\u043D\u0430, \u0430 \u043D\u0435 loopback-\u0430\u0434\u0440\u0435\u0441."
};

// src/locales/ar.json
var ar_default = {
  name: "Web Access QR",
  open: "\u0639\u0631\u0636 \u0631\u0645\u0632 \u0627\u0644\u0648\u0635\u0648\u0644 \u0625\u0644\u0649 \u0627\u0644\u0648\u064A\u0628",
  title: "\u0627\u0641\u062A\u062D Hermes \u0639\u0644\u0649 \u0647\u0627\u062A\u0641\u0643",
  intro: "\u0627\u0645\u0633\u062D \u0627\u0644\u0631\u0645\u0632 \u062B\u0645 \u0633\u062C\u0651\u0644 \u0627\u0644\u062F\u062E\u0648\u0644 \u0625\u0644\u0649 Hermes.",
  setup: "\u0625\u0639\u062F\u0627\u062F \u0627\u0644\u0648\u0635\u0648\u0644 \u0625\u0644\u0649 \u0627\u0644\u0648\u064A\u0628",
  back: "\u0627\u0644\u0639\u0648\u062F\u0629 \u0625\u0644\u0649 \u0627\u0644\u0631\u0645\u0632",
  flow: "\u0627\u062E\u062A\u0631 \u0627\u0644\u0627\u062A\u0635\u0627\u0644\u060C \u0648\u062C\u0647\u0651\u0632 \u0627\u0644\u0648\u0635\u0648\u0644\u060C \u062B\u0645 \u0623\u0646\u0634\u0626 \u0631\u0645\u0632 QR.",
  provider: "\u0637\u0631\u064A\u0642\u0629 \u0627\u0644\u0627\u062A\u0635\u0627\u0644",
  tailscale: "Tailscale",
  cloudflare: "Cloudflare Tunnel",
  existing: "\u0639\u0646\u0648\u0627\u0646 HTTPS \u0645\u0648\u062C\u0648\u062F",
  tailHelp: "\u0627\u062A\u0635\u0627\u0644 \u062E\u0627\u0635 \u0628\u064A\u0646 \u0623\u062C\u0647\u0632\u062A\u0643. \u062B\u0628\u0651\u062A Tailscale \u0639\u0644\u0649 \u0627\u0644\u0647\u0627\u062A\u0641 \u0623\u064A\u0636\u0627\u064B.",
  cloudHelp: "\u0627\u0644\u0648\u0635\u0648\u0644 \u0639\u0628\u0631 \u0646\u0637\u0627\u0642\u0643. \u064A\u062A\u0637\u0644\u0628 \u062D\u0633\u0627\u0628 Cloudflare \u0648\u0646\u0637\u0627\u0642\u0627\u064B.",
  existingHelp: "\u0627\u0633\u062A\u062E\u062F\u0645 \u0639\u0646\u0648\u0627\u0646 HTTPS \u0644\u0646\u0641\u0642 \u0623\u0648 \u0648\u0643\u064A\u0644 \u0639\u0643\u0633\u064A \u0623\u0639\u062F\u062F\u062A\u0647 \u0645\u0633\u0628\u0642\u0627\u064B.",
  next: "\u0645\u062A\u0627\u0628\u0639\u0629",
  change: "\u062A\u063A\u064A\u064A\u0631 \u0627\u0644\u0627\u062A\u0635\u0627\u0644",
  check: "\u062A\u062D\u0642\u0642 \u0645\u062C\u062F\u062F\u0627\u064B",
  checking: "\u062C\u0627\u0631\u064D \u0627\u0644\u062A\u062D\u0642\u0642 \u0645\u0646 \u0627\u0644\u0627\u062A\u0635\u0627\u0644\u2026",
  unavailable: "\u0627\u0641\u062A\u062D \u062A\u0637\u0628\u064A\u0642 Hermes \u0627\u0644\u0645\u062D\u0644\u064A\u060C \u0648\u0627\u0646\u062A\u0642\u0644 \u0625\u0644\u0649 \u0627\u0644\u0645\u0644\u0641 \u0627\u0644\u0631\u0626\u064A\u0633\u064A \u0648\u0641\u0639\u0651\u0644 \u0645\u0643\u0648\u0651\u0646 \u0627\u0644\u0648\u0643\u064A\u0644 \u0644\u0647\u0630\u0647 \u0627\u0644\u0625\u0636\u0627\u0641\u0629. \u064A\u0628\u0642\u0649 \u0627\u0644\u0631\u0645\u0632 \u0648\u0625\u062F\u062E\u0627\u0644 \u0627\u0644\u0639\u0646\u0648\u0627\u0646 \u064A\u062F\u0648\u064A\u0627\u064B \u0645\u062A\u0627\u062D\u064A\u0646.",
  mainProfile: "\u0641\u062A\u062D \u0627\u0644\u0645\u0644\u0641 \u0627\u0644\u0631\u0626\u064A\u0633\u064A",
  installTitle: "1. \u0627\u0644\u062A\u062B\u0628\u064A\u062A \u0648\u062A\u0633\u062C\u064A\u0644 \u0627\u0644\u062F\u062E\u0648\u0644",
  installed: "\u0645\u062B\u0628\u0651\u062A",
  missing: "\u063A\u064A\u0631 \u0645\u062B\u0628\u0651\u062A",
  connected: "\u0645\u062A\u0635\u0644",
  disconnected: "\u063A\u064A\u0631 \u0645\u062A\u0635\u0644",
  install: "\u0627\u0644\u062A\u062B\u0628\u064A\u062A \u0639\u0628\u0631 Homebrew",
  download: "\u0627\u0644\u062A\u0646\u0632\u064A\u0644 \u0627\u0644\u0631\u0633\u0645\u064A",
  login: "\u0641\u062A\u062D Tailscale",
  installHelp: "\u0625\u0630\u0627 \u0644\u0632\u0645\u062A \u0645\u0648\u0627\u0641\u0642\u0629 \u0627\u0644\u0645\u0633\u0624\u0648\u0644\u060C \u0623\u0643\u0645\u0644 \u0628\u0627\u0633\u062A\u062E\u062F\u0627\u0645 \u0627\u0644\u0645\u062B\u0628\u0651\u062A \u0627\u0644\u0631\u0633\u0645\u064A. \u0633\u062C\u0651\u0644 \u0627\u0644\u062F\u062E\u0648\u0644 \u0625\u0644\u0649 Tailscale \u0648\u0627\u0633\u0645\u062D \u0628\u0627\u062A\u0635\u0627\u0644 VPN.",
  webTitle: "2. \u062A\u062C\u0647\u064A\u0632 \u062A\u0633\u062C\u064A\u0644 \u0627\u0644\u062F\u062E\u0648\u0644 \u0625\u0644\u0649 Hermes",
  webHelp: "\u0641\u064A Hermes Web access \u0627\u062E\u062A\u0631 My own URL \u0648\u0627\u0628\u062F\u0623 \u0628\u0627\u0644\u0639\u0646\u0648\u0627\u0646 \u0623\u062F\u0646\u0627\u0647. \u0639\u0644\u0649 \u0627\u0644\u0645\u0633\u062A\u062E\u062F\u0645 \u0627\u0644\u062C\u062F\u064A\u062F \u062A\u0633\u062C\u064A\u0644 \u0627\u0644\u062F\u062E\u0648\u0644 \u0623\u0648\u0644\u0627\u064B \u0641\u064A Providers. \u064A\u064F\u062D\u0627\u0641\u0638 \u0639\u0644\u0649 \u062A\u0633\u062C\u064A\u0644 \u0627\u0644\u062F\u062E\u0648\u0644 \u0627\u0644\u062D\u0627\u0644\u064A \u0628\u0643\u0644\u0645\u0629 \u0627\u0644\u0645\u0631\u0648\u0631.",
  webReady: "\u062D\u0645\u0627\u064A\u0629 \u062A\u0633\u062C\u064A\u0644 \u0627\u0644\u062F\u062E\u0648\u0644 \u062C\u0627\u0647\u0632\u0629.",
  webSettings: "\u0641\u062A\u062D Hermes Web access",
  returnHelp: "\u0639\u064F\u062F \u0639\u0628\u0631 \u0632\u0631 QR \u0641\u064A \u0634\u0631\u064A\u0637 \u0627\u0644\u062D\u0627\u0644\u0629\u060C \u062B\u0645 \u062A\u062D\u0642\u0642 \u0645\u062C\u062F\u062F\u0627\u064B.",
  shareTitle: "3. \u062A\u0648\u0635\u064A\u0644 \u0627\u0644\u0645\u0634\u0627\u0631\u0643\u0629 \u0627\u0644\u062E\u0627\u0635\u0629",
  shareHelp: "\u0634\u0627\u0631\u0643 \u062E\u062F\u0645\u0629 \u0627\u0644\u0648\u064A\u0628 \u0627\u0644\u0645\u062D\u0644\u064A\u0629 \u0647\u0630\u0647 \u062F\u0627\u062E\u0644 \u0634\u0628\u0643\u0629 Tailscale \u0641\u0642\u0637.",
  reuse: "\u0627\u0644\u062A\u062D\u0642\u0642 \u0645\u0646 \u0627\u0644\u0627\u062A\u0635\u0627\u0644 \u0627\u0644\u062D\u0627\u0644\u064A",
  share: "\u0625\u0639\u062F\u0627\u062F \u0627\u0644\u0645\u0634\u0627\u0631\u0643\u0629",
  conflict: "\u0644\u0644\u0645\u0646\u0641\u0630 443 \u0625\u0639\u062F\u0627\u062F \u0622\u062E\u0631. \u0644\u0646 \u064A\u064F\u0633\u062A\u0628\u062F\u0644 \u062A\u0644\u0642\u0627\u0626\u064A\u0627\u064B.",
  https: "\u0625\u0639\u062F\u0627\u062F\u0627\u062A HTTPS",
  running: "\u0627\u0644\u0625\u0639\u062F\u0627\u062F \u062C\u0627\u0631\u064D. \u0642\u062F \u064A\u0633\u062A\u063A\u0631\u0642 \u0627\u0644\u062A\u062B\u0628\u064A\u062A \u062D\u062A\u0649 \u0623\u0631\u0628\u0639 \u062F\u0642\u0627\u0626\u0642.",
  done: "\u0627\u0643\u062A\u0645\u0644. \u062A\u062D\u0642\u0642 \u0645\u0646 \u062D\u0627\u0644\u0629 \u0627\u0644\u0627\u062A\u0635\u0627\u0644 \u0623\u0639\u0644\u0627\u0647.",
  failed: "\u0644\u0645 \u064A\u0643\u062A\u0645\u0644 \u0627\u0644\u0625\u0639\u062F\u0627\u062F. \u062A\u062D\u0642\u0642 \u0645\u0646 \u0623\u0630\u0648\u0646\u0627\u062A Tailscale \u0648\u0625\u0639\u062F\u0627\u062F\u0627\u062A HTTPS. \u0644\u0644\u062A\u062B\u0628\u064A\u062A \u0627\u0633\u062A\u062E\u062F\u0645 \u0627\u0644\u0645\u062B\u0628\u0651\u062A \u0627\u0644\u0631\u0633\u0645\u064A \u062B\u0645 \u0623\u0639\u062F \u0627\u0644\u0645\u062D\u0627\u0648\u0644\u0629.",
  finishLogin: "\u0623\u0643\u0645\u0644 \u062A\u0633\u062C\u064A\u0644 \u0627\u0644\u062F\u062E\u0648\u0644 \u0648\u0645\u0648\u0627\u0641\u0642\u0629 VPN \u0641\u064A Tailscale\u060C \u062B\u0645 \u062A\u062D\u0642\u0642 \u0645\u062C\u062F\u062F\u0627\u064B.",
  create: "\u0625\u0646\u0634\u0627\u0621 \u0631\u0645\u0632 \u0628\u0647\u0630\u0627 \u0627\u0644\u0639\u0646\u0648\u0627\u0646",
  cf1: "1. \u062A\u062C\u0647\u064A\u0632 \u0627\u0644\u062D\u0633\u0627\u0628 \u0648\u0627\u0644\u0646\u0637\u0627\u0642",
  cfHelp1: "\u0623\u0636\u0641 \u0646\u0637\u0627\u0642\u0643 \u0625\u0644\u0649 Cloudflare \u0648\u0623\u0646\u0634\u0626 \u0646\u0641\u0642\u0627\u064B \u0645\u0646 Networking \u2192 Tunnels.",
  console: "\u0641\u062A\u062D Cloudflare",
  guide: "\u0627\u0644\u062F\u0644\u064A\u0644 \u0627\u0644\u0631\u0633\u0645\u064A",
  cf2: "2. \u062A\u062B\u0628\u064A\u062A \u0627\u0644\u0645\u0648\u0635\u0644",
  cfHelp2: "\u0627\u062E\u062A\u0631 \u0646\u0638\u0627\u0645 \u0647\u0630\u0627 \u0627\u0644\u0643\u0645\u0628\u064A\u0648\u062A\u0631 \u0641\u064A \u0644\u0648\u062D\u0629 \u0627\u0644\u062A\u062D\u0643\u0645. \u0627\u062A\u0628\u0639 Install and Run \u062D\u062A\u0649 \u062A\u0635\u0628\u062D \u062D\u0627\u0644\u0629 \u0627\u0644\u0646\u0641\u0642 Healthy. \u0627\u0633\u062A\u062E\u062F\u0645 \u0631\u0645\u0632 \u0627\u0644\u062A\u062B\u0628\u064A\u062A \u0636\u0645\u0646 \u062E\u0637\u0648\u0627\u062A \u0627\u0644\u0625\u0639\u062F\u0627\u062F \u0627\u0644\u0631\u0633\u0645\u064A\u0629 \u0641\u0642\u0637.",
  cf3: "3. \u0631\u0628\u0637 \u0627\u0644\u0639\u0646\u0648\u0627\u0646 \u0627\u0644\u0639\u0627\u0645",
  cfHelp3: "\u062C\u0647\u0651\u0632 \u0623\u0648\u0644\u0627\u064B \u062A\u0633\u062C\u064A\u0644 \u0627\u0644\u062F\u062E\u0648\u0644 \u0648\u0639\u0646\u0648\u0627\u0646 HTTPS \u0641\u064A Hermes Web access. \u062B\u0645 \u0648\u062C\u0651\u0647 \u0627\u0644\u062A\u0637\u0628\u064A\u0642 \u0627\u0644\u0645\u0646\u0634\u0648\u0631 \u0625\u0644\u0649 \u0627\u0644\u062E\u062F\u0645\u0629 \u0627\u0644\u0645\u062D\u0644\u064A\u0629 \u0623\u062F\u0646\u0627\u0647. \u062A\u062D\u0642\u0642 \u0645\u0646 \u0635\u0641\u062D\u0629 \u0627\u0644\u062F\u062E\u0648\u0644 \u0648\u0623\u0636\u0641 \u0633\u064A\u0627\u0633\u0629 Cloudflare Access \u0639\u0646\u062F \u0627\u0644\u062D\u0627\u062C\u0629.",
  originFallback: "\u0627\u0644\u0639\u0646\u0648\u0627\u0646 \u0627\u0644\u0627\u0641\u062A\u0631\u0627\u0636\u064A \u2014 \u062A\u062D\u0642\u0642 \u0645\u0646 \u0645\u0646\u0641\u0630 Web access.",
  address: "\u0639\u0646\u0648\u0627\u0646 \u0627\u0644\u0648\u0635\u0648\u0644 \u0625\u0644\u0649 \u0627\u0644\u0648\u064A\u0628",
  addressHelp: "\u064A\u062D\u062A\u0648\u064A \u0627\u0644\u0631\u0645\u0632 \u0639\u0644\u0649 \u0627\u0644\u0639\u0646\u0648\u0627\u0646 \u0627\u0644\u0645\u062D\u0641\u0648\u0638 \u0641\u0642\u0637\u060C \u062F\u0648\u0646 \u0628\u064A\u0627\u0646\u0627\u062A \u0627\u0639\u062A\u0645\u0627\u062F \u0623\u0648 \u0631\u0648\u0627\u0628\u0637 \u062A\u0633\u062C\u064A\u0644 \u062F\u062E\u0648\u0644.",
  manualHelp: "\u0627\u0641\u062A\u062D \u0627\u0644\u0639\u0646\u0648\u0627\u0646 \u0641\u064A \u0627\u0644\u0645\u062A\u0635\u0641\u062D \u0648\u062A\u062D\u0642\u0642 \u0623\u0648\u0644\u0627\u064B \u0645\u0646 \u062A\u0633\u062C\u064A\u0644 \u0627\u0644\u062F\u062E\u0648\u0644 \u0625\u0644\u0649 Hermes. \u064A\u064F\u0641\u062D\u0635 \u062A\u0646\u0633\u064A\u0642 \u0627\u0644\u0639\u0646\u0648\u0627\u0646 \u0641\u0642\u0637 \u0647\u0646\u0627.",
  confirmed: "\u062A\u062D\u0642\u0642\u062A \u0645\u0646 \u062A\u0633\u062C\u064A\u0644 \u0627\u0644\u062F\u062E\u0648\u0644 \u0648\u0627\u0644\u0648\u0635\u0648\u0644 \u0625\u0644\u0649 Hermes \u0628\u0647\u0630\u0627 \u0627\u0644\u0639\u0646\u0648\u0627\u0646.",
  save: "\u062D\u0641\u0638",
  saved: "\u062D\u064F\u0641\u0638 \u0627\u0644\u0639\u0646\u0648\u0627\u0646.",
  copy: "\u0646\u0633\u062E \u0627\u0644\u0639\u0646\u0648\u0627\u0646",
  copied: "\u062A\u0645 \u0627\u0644\u0646\u0633\u062E.",
  copyFailed: "\u062A\u0639\u0630\u0631 \u0627\u0644\u0646\u0633\u062E. \u062D\u062F\u062F \u0627\u0644\u0639\u0646\u0648\u0627\u0646 \u0627\u0644\u0645\u0639\u0631\u0648\u0636 \u0648\u0627\u0646\u0633\u062E\u0647.",
  openFailed: "\u062A\u0639\u0630\u0631 \u0641\u062A\u062D \u0627\u0644\u0645\u062A\u0635\u0641\u062D. \u0627\u0641\u062A\u062D \u0627\u0644\u0631\u0627\u0628\u0637 \u0627\u0644\u0645\u0639\u0631\u0648\u0636 \u064A\u062F\u0648\u064A\u0627\u064B.",
  qrLabel: "\u0631\u0645\u0632 \u0627\u0644\u0648\u0635\u0648\u0644 \u0625\u0644\u0649 Hermes \u0639\u0628\u0631 \u0627\u0644\u0648\u064A\u0628",
  empty: "\u0627\u062D\u0641\u0638 \u0639\u0646\u0648\u0627\u0646\u0627\u064B \u0644\u0625\u0646\u0634\u0627\u0621 \u0631\u0645\u0632 QR.",
  qrFailed: "\u062A\u0639\u0630\u0631 \u0625\u0646\u0634\u0627\u0621 \u0627\u0644\u0631\u0645\u0632.",
  phone: "\u0623\u0628\u0642\u0650 Tailscale \u0645\u062A\u0635\u0644\u0627\u064B \u0639\u0644\u0649 \u0647\u0627\u062A\u0641\u0643.",
  error: "\u062A\u062D\u0642\u0642 \u0645\u0646 \u0627\u0644\u0639\u0646\u0648\u0627\u0646 \u0648\u0623\u0639\u062F \u0627\u0644\u0645\u062D\u0627\u0648\u0644\u0629.",
  urlRequired: "\u0623\u062F\u062E\u0644 \u0639\u0646\u0648\u0627\u0646 HTTPS \u0644\u0627 \u064A\u0632\u064A\u062F \u0639\u0644\u0649 1,024 \u062D\u0631\u0641\u0627\u064B.",
  urlInvalid: "\u0623\u062F\u062E\u0644 \u0639\u0646\u0648\u0627\u0646 \u0648\u064A\u0628 \u0635\u0627\u0644\u062D\u0627\u064B.",
  urlHttps: "\u0627\u0633\u062A\u062E\u062F\u0645 \u0639\u0646\u0648\u0627\u0646 https://.",
  urlCredentials: "\u0627\u0633\u062A\u062E\u062F\u0645 \u0639\u0646\u0648\u0627\u0646\u0627\u064B \u062F\u0648\u0646 \u0628\u064A\u0627\u0646\u0627\u062A \u0627\u0639\u062A\u0645\u0627\u062F \u0623\u0648 \u0645\u0639\u0627\u0645\u0644\u0627\u062A \u0627\u0633\u062A\u0639\u0644\u0627\u0645 \u0623\u0648 \u062C\u0632\u0621 \u0625\u0636\u0627\u0641\u064A.",
  urlLocal: "\u0627\u0633\u062A\u062E\u062F\u0645 \u0639\u0646\u0648\u0627\u0646\u0627\u064B \u064A\u0645\u0643\u0646 \u0627\u0644\u0648\u0635\u0648\u0644 \u0625\u0644\u064A\u0647 \u0645\u0646 \u0647\u0627\u062A\u0641\u0643\u060C \u0648\u0644\u064A\u0633 \u0639\u0646\u0648\u0627\u0646 \u0627\u0633\u062A\u0631\u062C\u0627\u0639 \u0645\u062D\u0644\u064A."
};

// src/locales/zh-hant.json
var zh_hant_default = {
  name: "Web Access QR",
  open: "\u986F\u793A\u7DB2\u9801\u5B58\u53D6 QR \u78BC",
  title: "\u5728\u624B\u6A5F\u4E0A\u958B\u555F Hermes",
  intro: "\u6383\u63CF QR \u78BC\u5F8C\u767B\u5165 Hermes\u3002",
  setup: "\u8A2D\u5B9A\u7DB2\u9801\u5B58\u53D6",
  back: "\u8FD4\u56DE QR \u78BC",
  flow: "\u9078\u64C7\u9023\u7DDA\u65B9\u5F0F\u3001\u6E96\u5099\u5B58\u53D6\uFF0C\u518D\u7522\u751F QR \u78BC\u3002",
  provider: "\u9023\u7DDA\u65B9\u5F0F",
  tailscale: "Tailscale",
  cloudflare: "Cloudflare Tunnel",
  existing: "\u73FE\u6709 HTTPS \u7DB2\u5740",
  tailHelp: "\u50C5\u5728\u81EA\u5DF1\u7684\u88DD\u7F6E\u9593\u79C1\u5BC6\u9023\u7DDA\u3002\u624B\u6A5F\u4E5F\u9700\u8981\u5B89\u88DD Tailscale\u3002",
  cloudHelp: "\u900F\u904E\u81EA\u5DF1\u7684\u7DB2\u57DF\u5B58\u53D6\u3002\u9700\u8981 Cloudflare \u5E33\u865F\u548C\u7DB2\u57DF\u3002",
  existingHelp: "\u4F7F\u7528\u5DF2\u8A2D\u5B9A\u7684\u901A\u9053\u6216\u53CD\u5411\u4EE3\u7406\u7684 HTTPS \u7DB2\u5740\u3002",
  next: "\u7E7C\u7E8C",
  change: "\u8B8A\u66F4\u9023\u7DDA\u65B9\u5F0F",
  check: "\u91CD\u65B0\u6AA2\u67E5",
  checking: "\u6B63\u5728\u6AA2\u67E5\u9023\u7DDA\u2026",
  unavailable: "\u8ACB\u5728\u672C\u6A5F Hermes \u61C9\u7528\u7A0B\u5F0F\u5207\u63DB\u81F3\u4E3B\u8981\u8A2D\u5B9A\u6A94\uFF0C\u4E26\u555F\u7528\u6B64\u5916\u639B\u7A0B\u5F0F\u7684\u4EE3\u7406\u5143\u4EF6\u3002QR \u78BC\u548C\u624B\u52D5\u8F38\u5165\u7DB2\u5740\u4ECD\u53EF\u4F7F\u7528\u3002",
  mainProfile: "\u958B\u555F\u4E3B\u8981\u8A2D\u5B9A\u6A94",
  installTitle: "1. \u5B89\u88DD\u8207\u767B\u5165",
  installed: "\u5DF2\u5B89\u88DD",
  missing: "\u672A\u5B89\u88DD",
  connected: "\u5DF2\u9023\u7DDA",
  disconnected: "\u672A\u9023\u7DDA",
  install: "\u900F\u904E Homebrew \u5B89\u88DD",
  download: "\u5B98\u65B9\u4E0B\u8F09",
  login: "\u958B\u555F Tailscale",
  installHelp: "\u5982\u9700\u7BA1\u7406\u54E1\u6838\u51C6\uFF0C\u8ACB\u4F7F\u7528\u5B98\u65B9\u5B89\u88DD\u7A0B\u5F0F\u3002\u767B\u5165 Tailscale \u4E26\u6838\u51C6 VPN \u9023\u7DDA\u3002",
  webTitle: "2. \u6E96\u5099 Hermes \u767B\u5165",
  webHelp: "\u5728 Hermes Web access \u9078\u64C7 My own URL\uFF0C\u4F7F\u7528\u4E0B\u65B9\u4F4D\u5740\u555F\u52D5\u3002\u65B0\u4F7F\u7528\u8005\u5148\u5728 Providers \u767B\u5165\u3002\u73FE\u6709\u7684\u5BC6\u78BC\u767B\u5165\u8A2D\u5B9A\u6703\u4FDD\u7559\u3002",
  webReady: "\u5DF2\u78BA\u8A8D\u7DB2\u9801\u767B\u5165\u4FDD\u8B77\u3002",
  webSettings: "\u958B\u555F Hermes Web access",
  returnHelp: "\u900F\u904E\u72C0\u614B\u5217\u7684 QR \u6309\u9215\u8FD4\u56DE\uFF0C\u518D\u91CD\u65B0\u6AA2\u67E5\u3002",
  shareTitle: "3. \u9023\u63A5\u79C1\u5BC6\u5171\u7528",
  shareHelp: "\u50C5\u5411 Tailscale \u7DB2\u8DEF\u5171\u7528\u6B64\u672C\u6A5F\u7DB2\u9801\u670D\u52D9\u3002",
  reuse: "\u9A57\u8B49\u73FE\u6709\u9023\u7DDA",
  share: "\u8A2D\u5B9A\u5171\u7528",
  conflict: "443 \u9023\u63A5\u57E0\u5DF2\u6709\u5176\u4ED6\u8A2D\u5B9A\uFF0C\u4E0D\u6703\u81EA\u52D5\u8986\u5BEB\u3002",
  https: "HTTPS \u8A2D\u5B9A",
  running: "\u6B63\u5728\u8A2D\u5B9A\u3002\u5B89\u88DD\u6700\u591A\u53EF\u80FD\u9700\u8981\u56DB\u5206\u9418\u3002",
  done: "\u5DF2\u5B8C\u6210\u3002\u8ACB\u6AA2\u67E5\u4E0A\u65B9\u9023\u7DDA\u72C0\u614B\u3002",
  failed: "\u8A2D\u5B9A\u672A\u5B8C\u6210\u3002\u8ACB\u6AA2\u67E5 Tailscale \u6B0A\u9650\u8207 HTTPS \u8A2D\u5B9A\u3002\u5B89\u88DD\u8ACB\u4F7F\u7528\u5B98\u65B9\u5B89\u88DD\u7A0B\u5F0F\u5F8C\u91CD\u8A66\u3002",
  finishLogin: "\u5728 Tailscale \u5B8C\u6210\u767B\u5165\u8207 VPN \u6838\u51C6\u5F8C\u91CD\u65B0\u6AA2\u67E5\u3002",
  create: "\u4F7F\u7528\u6B64\u7DB2\u5740\u7522\u751F QR \u78BC",
  cf1: "1. \u6E96\u5099\u5E33\u865F\u8207\u7DB2\u57DF",
  cfHelp1: "\u5C07\u7DB2\u57DF\u52A0\u5165 Cloudflare\uFF0C\u7136\u5F8C\u5728 Networking \u2192 Tunnels \u5EFA\u7ACB\u901A\u9053\u3002",
  console: "\u958B\u555F Cloudflare",
  guide: "\u5B98\u65B9\u6307\u5357",
  cf2: "2. \u5B89\u88DD\u9023\u63A5\u5668",
  cfHelp2: "\u5728\u4E3B\u63A7\u53F0\u9078\u64C7\u672C\u6A5F\u4F5C\u696D\u7CFB\u7D71\uFF0C\u4F9D\u7167 Install and Run \u6B65\u9A5F\u64CD\u4F5C\uFF0C\u76F4\u5230\u901A\u9053\u986F\u793A Healthy\u3002\u5B89\u88DD\u6B0A\u6756\u50C5\u5728\u5B98\u65B9\u8A2D\u5B9A\u6D41\u7A0B\u4E2D\u4F7F\u7528\u3002",
  cf3: "3. \u9023\u63A5\u516C\u958B\u4F4D\u5740",
  cfHelp3: "\u5148\u5728 Hermes Web access \u6E96\u5099\u767B\u5165\u4E26\u8A3B\u518A HTTPS \u7DB2\u5740\uFF0C\u518D\u5C07\u516C\u958B\u61C9\u7528\u7A0B\u5F0F\u8DEF\u7531\u6307\u5411\u4E0B\u65B9\u672C\u6A5F\u670D\u52D9\u3002\u78BA\u8A8D\u767B\u5165\u9801\u9762\uFF0C\u5FC5\u8981\u6642\u52A0\u5165 Cloudflare Access \u539F\u5247\u3002",
  originFallback: "\u9019\u662F\u9810\u8A2D\u4F4D\u5740\uFF0C\u8ACB\u78BA\u8A8D Web access \u9023\u63A5\u57E0\u3002",
  address: "\u7DB2\u9801\u5B58\u53D6\u7DB2\u5740",
  addressHelp: "QR \u78BC\u50C5\u5305\u542B\u5132\u5B58\u7684\u7DB2\u5740\uFF0C\u4E0D\u542B\u8A8D\u8B49\u8CC7\u8A0A\u6216\u767B\u5165\u9023\u7D50\u3002",
  manualHelp: "\u5148\u5728\u700F\u89BD\u5668\u958B\u555F\u6B64\u4F4D\u5740\u4E26\u78BA\u8A8D Hermes \u767B\u5165\u3002\u9019\u88E1\u50C5\u6AA2\u67E5\u7DB2\u5740\u683C\u5F0F\u3002",
  confirmed: "\u6211\u5DF2\u78BA\u8A8D\u53EF\u900F\u904E\u6B64\u7DB2\u5740\u767B\u5165\u4E26\u5B58\u53D6 Hermes\u3002",
  save: "\u5132\u5B58",
  saved: "\u5DF2\u5132\u5B58\u7DB2\u5740\u3002",
  copy: "\u8907\u88FD\u7DB2\u5740",
  copied: "\u5DF2\u8907\u88FD\u3002",
  copyFailed: "\u7121\u6CD5\u8907\u88FD\uFF0C\u8ACB\u9078\u53D6\u986F\u793A\u7684\u4F4D\u5740\u4E26\u624B\u52D5\u8907\u88FD\u3002",
  openFailed: "\u7121\u6CD5\u958B\u555F\u700F\u89BD\u5668\uFF0C\u8ACB\u624B\u52D5\u958B\u555F\u986F\u793A\u7684\u9023\u7D50\u3002",
  qrLabel: "Hermes \u7DB2\u9801\u5B58\u53D6 QR \u78BC",
  empty: "\u5132\u5B58\u7DB2\u5740\u5373\u53EF\u7522\u751F QR \u78BC\u3002",
  qrFailed: "\u7121\u6CD5\u7522\u751F QR \u78BC\u3002",
  phone: "\u8ACB\u8B93\u624B\u6A5F\u4E0A\u7684 Tailscale \u4FDD\u6301\u9023\u7DDA\u3002",
  error: "\u8ACB\u6AA2\u67E5\u7DB2\u5740\u5F8C\u91CD\u8A66\u3002",
  urlRequired: "\u8ACB\u8F38\u5165\u4E0D\u8D85\u904E 1,024 \u500B\u5B57\u5143\u7684 HTTPS \u7DB2\u5740\u3002",
  urlInvalid: "\u8ACB\u8F38\u5165\u6709\u6548\u7684\u7DB2\u9801\u4F4D\u5740\u3002",
  urlHttps: "\u8ACB\u4F7F\u7528 https:// \u4F4D\u5740\u3002",
  urlCredentials: "\u8ACB\u4F7F\u7528\u4E0D\u542B\u8A8D\u8B49\u8CC7\u8A0A\u3001\u67E5\u8A62\u53C3\u6578\u6216\u7247\u6BB5\u7684\u7DB2\u5740\u3002",
  urlLocal: "\u8ACB\u4F7F\u7528\u624B\u6A5F\u80FD\u5B58\u53D6\u7684\u4F4D\u5740\uFF0C\u800C\u975E\u56DE\u9001\u4F4D\u5740\u3002"
};

// src/locales.ts
var ID = "hermes-web-qr";
var en = {
  name: "Web Access QR",
  open: "Show web access QR",
  title: "Open Hermes on your phone",
  intro: "Scan the QR code, then sign in to Hermes.",
  setup: "Set up web access",
  back: "Back to QR",
  flow: "Choose a connection, prepare access, then create your QR code.",
  provider: "Connection method",
  tailscale: "Tailscale",
  cloudflare: "Cloudflare Tunnel",
  existing: "Existing HTTPS URL",
  tailHelp: "Private access between your devices. Install Tailscale on your phone too.",
  cloudHelp: "Access through your own domain. Requires a Cloudflare account and domain.",
  existingHelp: "Use an HTTPS address from any tunnel or reverse proxy you already run.",
  next: "Continue",
  change: "Change connection",
  check: "Check again",
  checking: "Checking connection\u2026",
  unavailable: "Open the local Hermes app, switch to the main profile and enable this plugin\u2019s agent component. QR and manual URLs remain available.",
  mainProfile: "Open main profile",
  installTitle: "1. Install and sign in",
  installed: "Installed",
  missing: "Not installed",
  connected: "Connected",
  disconnected: "Not connected",
  install: "Install with Homebrew",
  download: "Official download",
  login: "Open Tailscale",
  installHelp: "If administrator approval is needed, finish installation using the official installer. Sign in and approve the VPN connection in Tailscale.",
  webTitle: "2. Prepare Hermes sign-in",
  webHelp: "In Hermes Web access, choose My own URL and start with the address below. New users first sign in under Providers. An existing password login is preserved.",
  webReady: "The web sign-in gate is ready.",
  webSettings: "Open Hermes Web access",
  returnHelp: "Return using the QR button in the status bar, then check again.",
  shareTitle: "3. Connect private sharing",
  shareHelp: "Share this local web service only with your Tailscale network.",
  reuse: "Verify existing connection",
  share: "Configure sharing",
  conflict: "Port 443 already has another configuration. Automatic setup will not replace it.",
  https: "HTTPS settings",
  running: "Setup is running. Installation can take up to four minutes.",
  done: "Completed. Check the connection state above.",
  failed: "Setup did not finish. Check Tailscale permissions and HTTPS settings. For installation, use the official installer, then retry.",
  finishLogin: "Complete sign-in and VPN approval in Tailscale, then check again.",
  create: "Create QR with this URL",
  cf1: "1. Prepare an account and domain",
  cfHelp1: "Add your domain to Cloudflare. In Networking \u2192 Tunnels, create a tunnel.",
  console: "Open Cloudflare",
  guide: "Official guide",
  cf2: "2. Install the connector",
  cfHelp2: "Choose this computer\u2019s operating system in the console. Follow Install and Run until the tunnel is Healthy. Keep the installation token in the vendor\u2019s setup flow.",
  cf3: "3. Connect the public address",
  cfHelp3: "Prepare Hermes sign-in and register your HTTPS URL in Web access first. Then add a published application route pointing to the local service below. Check the login page; optionally add a Cloudflare Access policy.",
  originFallback: "Default origin \u2014 check your Web access port.",
  address: "Web access URL",
  addressHelp: "Only this saved URL goes into the QR code. Credentials and login links are not included.",
  manualHelp: "Open this address in your browser and verify Hermes sign-in first. This form validates the address format only.",
  confirmed: "I verified Hermes sign-in and access at this URL.",
  save: "Save",
  saved: "URL saved.",
  copy: "Copy URL",
  copied: "Copied.",
  copyFailed: "Could not copy. Select and copy the displayed address.",
  openFailed: "Could not open the browser. Open the displayed link manually.",
  qrLabel: "Hermes web access QR code",
  empty: "Save a web access URL to create a QR code.",
  qrFailed: "Could not generate the QR code.",
  phone: "Keep Tailscale connected on your phone.",
  error: "Check the URL and try again.",
  "urlRequired": "Enter an HTTPS URL of up to 1,024 characters.",
  "urlInvalid": "Enter a valid web address.",
  "urlHttps": "Use an https:// address.",
  "urlCredentials": "Use a URL without credentials, query parameters or a fragment.",
  "urlLocal": "Use an address reachable from your phone, not a loopback address."
};
var ko = {
  name: "Web Access QR",
  open: "\uC6F9 \uC811\uC18D QR \uD45C\uC2DC",
  title: "\uD734\uB300\uD3F0\uC73C\uB85C Hermes \uC5F4\uAE30",
  intro: "QR\uC744 \uC2A4\uCE94\uD55C \uB4A4 Hermes\uC5D0 \uB85C\uADF8\uC778\uD558\uC138\uC694.",
  setup: "\uC6F9 \uC811\uC18D \uC124\uC815",
  back: "QR\uB85C \uB3CC\uC544\uAC00\uAE30",
  flow: "\uC811\uC18D \uBC29\uC2DD\uC744 \uACE0\uB974\uACE0 \uC5F0\uACB0\uC744 \uC900\uBE44\uD55C \uB4A4 QR\uC744 \uB9CC\uB4ED\uB2C8\uB2E4.",
  provider: "\uC811\uC18D \uBC29\uC2DD",
  tailscale: "Tailscale",
  cloudflare: "Cloudflare Tunnel",
  existing: "\uAE30\uC874 HTTPS \uC8FC\uC18C",
  tailHelp: "\uB0B4 \uAE30\uAE30\uB07C\uB9AC \uBE44\uACF5\uAC1C\uB85C \uC5F0\uACB0\uD569\uB2C8\uB2E4. \uD734\uB300\uD3F0\uC5D0\uB3C4 Tailscale\uC744 \uC124\uCE58\uD558\uC138\uC694.",
  cloudHelp: "\uB0B4 \uB3C4\uBA54\uC778\uC73C\uB85C \uC811\uC18D\uD569\uB2C8\uB2E4. Cloudflare \uACC4\uC815\uACFC \uB3C4\uBA54\uC778\uC774 \uD544\uC694\uD569\uB2C8\uB2E4.",
  existingHelp: "\uC774\uBBF8 \uC900\uBE44\uD55C \uD130\uB110\uC774\uB098 \uD504\uB85D\uC2DC\uC758 HTTPS \uC8FC\uC18C\uB97C \uC0AC\uC6A9\uD569\uB2C8\uB2E4.",
  next: "\uB2E4\uC74C",
  change: "\uC811\uC18D \uBC29\uC2DD \uBCC0\uACBD",
  check: "\uB2E4\uC2DC \uD655\uC778",
  checking: "\uC5F0\uACB0 \uC0C1\uD0DC \uD655\uC778 \uC911\u2026",
  unavailable: "\uC774 \uCEF4\uD4E8\uD130\uC758 Hermes \uC571\uC5D0\uC11C \uAE30\uBCF8 \uD504\uB85C\uD544\uB85C \uC804\uD658\uD558\uACE0 \uD50C\uB7EC\uADF8\uC778\uC758 \uC5D0\uC774\uC804\uD2B8 \uAE30\uB2A5\uC744 \uD65C\uC131\uD654\uD558\uC138\uC694. QR\uACFC \uC9C1\uC811 \uC8FC\uC18C \uC785\uB825\uC740 \uACC4\uC18D \uC0AC\uC6A9\uD560 \uC218 \uC788\uC2B5\uB2C8\uB2E4.",
  mainProfile: "\uAE30\uBCF8 \uD504\uB85C\uD544 \uC5F4\uAE30",
  installTitle: "1. \uC124\uCE58\uC640 \uB85C\uADF8\uC778",
  installed: "\uC124\uCE58\uB428",
  missing: "\uC124\uCE58 \uD544\uC694",
  connected: "\uC5F0\uACB0\uB428",
  disconnected: "\uC5F0\uACB0 \uD544\uC694",
  install: "Homebrew\uB85C \uC124\uCE58",
  download: "\uACF5\uC2DD \uB2E4\uC6B4\uB85C\uB4DC",
  login: "Tailscale \uC5F4\uAE30",
  installHelp: "\uAD00\uB9AC\uC790 \uC2B9\uC778\uC774 \uD544\uC694\uD558\uBA74 \uACF5\uC2DD \uC124\uCE58 \uD654\uBA74\uC5D0\uC11C \uC124\uCE58\uD558\uC138\uC694. Tailscale\uC5D0\uC11C \uB85C\uADF8\uC778\uD558\uACE0 VPN \uC5F0\uACB0\uC744 \uC2B9\uC778\uD569\uB2C8\uB2E4.",
  webTitle: "2. Hermes \uB85C\uADF8\uC778 \uC900\uBE44",
  webHelp: "Hermes Web access\uC5D0\uC11C My own URL\uC744 \uC120\uD0DD\uD558\uACE0 \uC544\uB798 \uC8FC\uC18C\uB85C \uC2DC\uC791\uD558\uC138\uC694. \uCC98\uC74C \uC0AC\uC6A9\uD558\uBA74 Providers\uC5D0\uC11C \uB85C\uADF8\uC778\uBD80\uD130 \uC9C4\uD589\uD569\uB2C8\uB2E4. \uAE30\uC874 \uBE44\uBC00\uBC88\uD638 \uB85C\uADF8\uC778\uC740 \uADF8\uB300\uB85C \uC0AC\uC6A9\uD569\uB2C8\uB2E4.",
  webReady: "\uC6F9 \uB85C\uADF8\uC778 \uBCF4\uD638\uAC00 \uD655\uC778\uB418\uC5C8\uC2B5\uB2C8\uB2E4.",
  webSettings: "Hermes Web access \uC5F4\uAE30",
  returnHelp: "\uC0C1\uD0DC \uD45C\uC2DC\uC904\uC758 QR \uBC84\uD2BC\uC73C\uB85C \uB3CC\uC544\uC640 \uB2E4\uC2DC \uD655\uC778\uD558\uC138\uC694.",
  shareTitle: "3. \uBE44\uACF5\uAC1C \uACF5\uC720 \uC5F0\uACB0",
  shareHelp: "Tailscale \uB124\uD2B8\uC6CC\uD06C \uC548\uC5D0\uC11C\uB9CC \uC774 \uCEF4\uD4E8\uD130\uC758 \uC6F9\uC5D0 \uC5F0\uACB0\uD569\uB2C8\uB2E4.",
  reuse: "\uAE30\uC874 \uC5F0\uACB0 \uD655\uC778",
  share: "\uACF5\uC720 \uC124\uC815",
  conflict: "443 \uD3EC\uD2B8\uC5D0 \uB2E4\uB978 \uC124\uC815\uC774 \uC788\uC5B4 \uC790\uB3D9 \uBCC0\uACBD\uD558\uC9C0 \uC54A\uC2B5\uB2C8\uB2E4.",
  https: "HTTPS \uC124\uC815",
  running: "\uC124\uC815 \uC911\uC785\uB2C8\uB2E4. \uC124\uCE58\uB294 \uCD5C\uB300 4\uBD84 \uC815\uB3C4 \uAC78\uB9B4 \uC218 \uC788\uC2B5\uB2C8\uB2E4.",
  done: "\uC644\uB8CC\uD588\uC2B5\uB2C8\uB2E4. \uC704\uC758 \uC5F0\uACB0 \uC0C1\uD0DC\uB97C \uD655\uC778\uD558\uC138\uC694.",
  failed: "\uC644\uB8CC\uD558\uC9C0 \uBABB\uD588\uC2B5\uB2C8\uB2E4. Tailscale \uAD8C\uD55C\uACFC HTTPS \uC124\uC815\uC744 \uD655\uC778\uD558\uC138\uC694. \uC124\uCE58\uB294 \uACF5\uC2DD \uC124\uCE58 \uD654\uBA74\uC5D0\uC11C \uC9C4\uD589\uD55C \uB4A4 \uB2E4\uC2DC \uC2DC\uB3C4\uD558\uC138\uC694.",
  finishLogin: "Tailscale\uC5D0\uC11C \uB85C\uADF8\uC778\uACFC VPN \uC2B9\uC778\uC744 \uB9C8\uCE5C \uB4A4 \uB2E4\uC2DC \uD655\uC778\uD558\uC138\uC694.",
  create: "\uC774 \uC8FC\uC18C\uB85C QR \uB9CC\uB4E4\uAE30",
  cf1: "1. \uACC4\uC815\uACFC \uB3C4\uBA54\uC778 \uC900\uBE44",
  cfHelp1: "Cloudflare\uC5D0 \uB3C4\uBA54\uC778\uC744 \uCD94\uAC00\uD558\uACE0 Networking \u2192 Tunnels\uC5D0\uC11C \uD130\uB110\uC744 \uB9CC\uB4DC\uC138\uC694.",
  console: "Cloudflare \uC5F4\uAE30",
  guide: "\uACF5\uC2DD \uC548\uB0B4",
  cf2: "2. \uC5F0\uACB0 \uD504\uB85C\uADF8\uB7A8 \uC124\uCE58",
  cfHelp2: "\uCF58\uC194\uC5D0\uC11C \uC774 \uCEF4\uD4E8\uD130\uC758 \uC6B4\uC601\uCCB4\uC81C\uB97C \uC120\uD0DD\uD558\uACE0 Install and Run \uC548\uB0B4\uC5D0 \uB530\uB77C \uC124\uCE58\uD558\uC138\uC694. \uD130\uB110\uC774 Healthy\uAC00 \uB418\uB294\uC9C0 \uD655\uC778\uD569\uB2C8\uB2E4. \uC124\uCE58 \uD1A0\uD070\uC740 \uACF5\uC2DD \uC124\uC815 \uD654\uBA74\uC5D0\uC11C\uB9CC \uB2E4\uB8E8\uC138\uC694.",
  cf3: "3. \uACF5\uAC1C \uC8FC\uC18C \uC5F0\uACB0",
  cfHelp3: "\uBA3C\uC800 Hermes Web access\uC5D0\uC11C \uB85C\uADF8\uC778\uACFC HTTPS \uC8FC\uC18C\uB97C \uC900\uBE44\uD558\uC138\uC694. \uADF8 \uB2E4\uC74C \uD130\uB110\uC758 Published application\uC744 \uC544\uB798 \uB85C\uCEEC \uC8FC\uC18C\uB85C \uC5F0\uACB0\uD569\uB2C8\uB2E4. \uB85C\uADF8\uC778 \uD654\uBA74\uC744 \uD655\uC778\uD558\uACE0 \uD544\uC694\uD558\uBA74 Cloudflare Access \uC815\uCC45\uC744 \uCD94\uAC00\uD558\uC138\uC694.",
  originFallback: "\uAE30\uBCF8 \uC8FC\uC18C\uC785\uB2C8\uB2E4. Web access\uC758 \uD3EC\uD2B8\uB97C \uD655\uC778\uD558\uC138\uC694.",
  address: "\uC6F9 \uC811\uC18D \uC8FC\uC18C",
  addressHelp: "\uC800\uC7A5\uD55C \uC8FC\uC18C\uB9CC QR\uC5D0 \uB2F4\uC2B5\uB2C8\uB2E4. \uBE44\uBC00\uBC88\uD638\uB098 \uB85C\uADF8\uC778 \uB9C1\uD06C\uB294 \uD3EC\uD568\uD558\uC9C0 \uC54A\uC2B5\uB2C8\uB2E4.",
  manualHelp: "\uBE0C\uB77C\uC6B0\uC800\uC5D0\uC11C \uC774 \uC8FC\uC18C\uB97C \uC5F4\uC5B4 Hermes \uB85C\uADF8\uC778\uC744 \uBA3C\uC800 \uD655\uC778\uD558\uC138\uC694. \uC5EC\uAE30\uC11C\uB294 \uC8FC\uC18C \uD615\uC2DD\uB9CC \uAC80\uC0AC\uD569\uB2C8\uB2E4.",
  confirmed: "\uC774 \uC8FC\uC18C\uC5D0\uC11C Hermes \uB85C\uADF8\uC778\uACFC \uC811\uC18D\uC744 \uD655\uC778\uD588\uC2B5\uB2C8\uB2E4.",
  save: "\uC800\uC7A5",
  saved: "\uC8FC\uC18C\uB97C \uC800\uC7A5\uD588\uC2B5\uB2C8\uB2E4.",
  copy: "\uC8FC\uC18C \uBCF5\uC0AC",
  copied: "\uBCF5\uC0AC\uD588\uC2B5\uB2C8\uB2E4.",
  copyFailed: "\uBCF5\uC0AC\uD558\uC9C0 \uBABB\uD588\uC2B5\uB2C8\uB2E4. \uD45C\uC2DC\uB41C \uC8FC\uC18C\uB97C \uC9C1\uC811 \uC120\uD0DD\uD574 \uBCF5\uC0AC\uD558\uC138\uC694.",
  openFailed: "\uBE0C\uB77C\uC6B0\uC800\uB97C \uC5F4\uC9C0 \uBABB\uD588\uC2B5\uB2C8\uB2E4. \uD45C\uC2DC\uB41C \uB9C1\uD06C\uB97C \uC9C1\uC811 \uC5F4\uC5B4\uC8FC\uC138\uC694.",
  qrLabel: "Hermes \uC6F9 \uC811\uC18D QR \uCF54\uB4DC",
  empty: "\uC811\uC18D \uC8FC\uC18C\uB97C \uC800\uC7A5\uD558\uBA74 QR\uC774 \uB098\uD0C0\uB0A9\uB2C8\uB2E4.",
  qrFailed: "QR\uC744 \uB9CC\uB4E4\uC9C0 \uBABB\uD588\uC2B5\uB2C8\uB2E4.",
  phone: "\uD734\uB300\uD3F0\uC5D0\uC11C\uB3C4 Tailscale\uC744 \uCF1C\uC8FC\uC138\uC694.",
  error: "\uC8FC\uC18C\uB97C \uD655\uC778\uD55C \uB4A4 \uB2E4\uC2DC \uC2DC\uB3C4\uD558\uC138\uC694.",
  "urlRequired": "HTTPS \uC8FC\uC18C\uB97C \uC785\uB825\uD558\uC138\uC694. \uCD5C\uB300 1,024\uC790\uC785\uB2C8\uB2E4.",
  "urlInvalid": "\uC62C\uBC14\uB978 \uC6F9 \uC8FC\uC18C\uB97C \uC785\uB825\uD558\uC138\uC694.",
  "urlHttps": "https:// \uC8FC\uC18C\uB97C \uC0AC\uC6A9\uD558\uC138\uC694.",
  "urlCredentials": "\uACC4\uC815\uC815\uBCF4\xB7\uCFFC\uB9AC\xB7# \uAC12\uC774 \uC5C6\uB294 \uC8FC\uC18C\uB97C \uC0AC\uC6A9\uD558\uC138\uC694.",
  "urlLocal": "\uD734\uB300\uD3F0\uC5D0\uC11C \uC811\uADFC\uD560 \uC218 \uC788\uB294 \uC8FC\uC18C\uB97C \uC0AC\uC6A9\uD558\uC138\uC694. \uB85C\uCEEC \uB8E8\uD504\uBC31 \uC8FC\uC18C\uB294 \uC0AC\uC6A9\uD560 \uC218 \uC5C6\uC2B5\uB2C8\uB2E4."
};
var locales = { en, ko, ja: ja_default, zh: zh_default, de: de_default, fr: fr_default, es: es_default, ru: ru_default, ar: ar_default, "zh-hant": zh_hant_default };

// src/wizard.tsx
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
var actions = { display: "flex", flexWrap: "wrap", gap: 8, marginTop: 12 };
var details = { color: "var(--ui-text-tertiary)", margin: "12px 0", lineHeight: 1.6 };
function Wizard({ ctx, onSave, onClose }) {
  const t = usePluginI18n(ID);
  const profile = useValue(host.state.profile);
  const [provider, setProvider] = useState(() => {
    const value = ctx.storage.get("setup-provider", "tailscale");
    return ["tailscale", "cloudflare", "existing"].includes(value) ? value : "tailscale";
  });
  const [step, setStep] = useState(0);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [address, setAddress] = useState("");
  const [checked, setChecked] = useState(false);
  const [notice, setNotice] = useState("");
  const [failedLink, setFailedLink] = useState("");
  const query = useQuery({ queryKey: [ID, "setup", profile], queryFn: () => ctx.rest("/setup/status", { timeoutMs: 35e3 }), refetchInterval: 5e3, retry: false });
  const state = query.data;
  const unavailable = Boolean(query.error);
  const running = busy || state?.job.state === "running";
  const invoke = async (action) => {
    setBusy(true);
    setError("");
    setNotice("");
    try {
      await ctx.rest("/setup/action", { method: "POST", body: { action }, timeoutMs: 35e3 });
      await query.refetch();
    } catch {
      setError("failed");
    } finally {
      setBusy(false);
    }
  };
  const external = async (url) => {
    try {
      if (await ctx.os.openExternal(url) === false) throw new Error();
    } catch {
      setError("openFailed");
      setFailedLink(url);
    }
  };
  const copy = async (url) => {
    try {
      if (!await ctx.os.writeClipboard(url)) throw new Error();
      setNotice("copied");
    } catch {
      setError("copyFailed");
    }
  };
  const save = () => {
    try {
      const url = normalizeAddress(provider === "tailscale" ? state?.url || "" : address);
      ctx.storage.set("setup-provider", provider);
      onSave(url);
    } catch (e) {
      setError(e instanceof Error ? e.message : "error");
    }
  };
  const same = Boolean(state?.url && state.web_url.replace(/\/$/, "") === state.url);
  const ready = Boolean(state?.connected && state.web_ready && same);
  const canShare = ready && ["ready", "available"].includes(state?.serve || "");
  const jobMessage = state?.job.message === "finish_login_in_app" ? "finishLogin" : state?.job.state === "error" ? "failed" : "done";
  const change = (p) => {
    setProvider(p);
    setChecked(false);
    setError("");
    setNotice("");
  };
  return /* @__PURE__ */ jsxs("div", { children: [
    /* @__PURE__ */ jsx(ListRow, { wide: true, title: t("setup"), description: t("flow"), action: /* @__PURE__ */ jsx(Button, { variant: "ghost", onClick: onClose, children: t("back") }) }),
    step === 0 ? /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx(ListRow, { wide: true, title: t("provider"), below: /* @__PURE__ */ jsxs("div", { style: { marginTop: 12 }, children: [
        /* @__PURE__ */ jsx(SegmentedControl, { value: provider, onChange: change, options: ["tailscale", "cloudflare", "existing"].map((id) => ({ id, label: t(id) })) }),
        /* @__PURE__ */ jsx("p", { style: details, children: t(provider === "tailscale" ? "tailHelp" : provider === "cloudflare" ? "cloudHelp" : "existingHelp") })
      ] }) }),
      /* @__PURE__ */ jsx(Button, { onClick: () => setStep(1), children: t("next") })
    ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx(Button, { variant: "text", onClick: () => setStep(0), children: t("change") }),
      provider === "tailscale" && /* @__PURE__ */ jsxs(Fragment, { children: [
        unavailable && /* @__PURE__ */ jsx(ListRow, { wide: true, title: t("unavailable"), below: /* @__PURE__ */ jsxs("div", { style: actions, children: [
          /* @__PURE__ */ jsx(Button, { variant: "secondary", onClick: () => {
            host.newChat("default");
          }, children: t("mainProfile") }),
          /* @__PURE__ */ jsx(Button, { variant: "secondary", onClick: () => void query.refetch(), children: t("check") })
        ] }) }),
        query.isPending && /* @__PURE__ */ jsx("p", { role: "status", children: t("checking") }),
        state && !unavailable && /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsx(ListRow, { wide: true, title: t("installTitle"), action: /* @__PURE__ */ jsxs(Badge, { variant: state.connected ? "success" : "muted", children: [
            t(state.installed ? "installed" : "missing"),
            " \xB7 ",
            t(state.connected ? "connected" : "disconnected")
          ] }), description: t("installHelp"), below: /* @__PURE__ */ jsxs("div", { style: actions, children: [
            !state.installed && state.can_install && /* @__PURE__ */ jsx(Button, { disabled: running, onClick: () => void invoke("install"), children: t("install") }),
            !state.installed && /* @__PURE__ */ jsx(Button, { variant: "secondary", onClick: () => void external("https://tailscale.com/download"), children: t("download") }),
            state.installed && !state.connected && /* @__PURE__ */ jsx(Button, { disabled: running, onClick: () => state.platform === "Darwin" ? void invoke("login") : void external("https://tailscale.com/docs/quickstart"), children: t("login") }),
            /* @__PURE__ */ jsx(Button, { variant: "secondary", disabled: running, onClick: () => void query.refetch(), children: t("check") })
          ] }) }),
          /* @__PURE__ */ jsx(ListRow, { wide: true, title: t("webTitle"), description: t(ready ? "webReady" : "webHelp"), below: /* @__PURE__ */ jsxs(Fragment, { children: [
            state.url && /* @__PURE__ */ jsx("p", { style: { ...details, overflowWrap: "anywhere", userSelect: "text" }, children: state.url }),
            /* @__PURE__ */ jsxs("div", { style: actions, children: [
              state.url && /* @__PURE__ */ jsx(Button, { variant: "secondary", onClick: () => void copy(state.url), children: t("copy") }),
              /* @__PURE__ */ jsx(Button, { variant: "secondary", onClick: () => host.navigate("/settings?tab=web-access"), children: t("webSettings") })
            ] }),
            /* @__PURE__ */ jsx("p", { style: details, children: t("returnHelp") })
          ] }) }),
          /* @__PURE__ */ jsx(ListRow, { wide: true, title: t("shareTitle"), description: t(state.serve === "conflict" ? "conflict" : "shareHelp"), below: /* @__PURE__ */ jsxs(Fragment, { children: [
            /* @__PURE__ */ jsxs("div", { style: actions, children: [
              /* @__PURE__ */ jsx(Button, { disabled: running || !canShare, onClick: () => void invoke("serve"), children: t(state.serve === "ready" ? "reuse" : "share") }),
              /* @__PURE__ */ jsx(Button, { variant: "secondary", onClick: () => void external("https://login.tailscale.com/admin/dns"), children: t("https") })
            ] }),
            running && /* @__PURE__ */ jsx("p", { role: "status", style: details, children: t("running") }),
            !running && state.job.message && /* @__PURE__ */ jsx("p", { role: state.job.state === "error" ? "alert" : "status", style: details, children: t(jobMessage) }),
            state.issue && /* @__PURE__ */ jsx("p", { role: "alert", style: details, children: t("failed") }),
            /* @__PURE__ */ jsx("p", { style: details, children: t("phone") }),
            /* @__PURE__ */ jsx(Button, { disabled: running || !ready || state.serve !== "ready", onClick: save, children: t("create") })
          ] }) })
        ] })
      ] }),
      provider === "cloudflare" && /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx(ListRow, { wide: true, title: t("cf1"), description: t("cfHelp1"), below: /* @__PURE__ */ jsxs("div", { style: actions, children: [
          /* @__PURE__ */ jsx(Button, { variant: "secondary", onClick: () => void external("https://dash.cloudflare.com/"), children: t("console") }),
          /* @__PURE__ */ jsx(Button, { variant: "secondary", onClick: () => void external("https://developers.cloudflare.com/tunnel/get-started/"), children: t("guide") })
        ] }) }),
        /* @__PURE__ */ jsx(ListRow, { wide: true, title: t("cf2"), description: t("cfHelp2") }),
        /* @__PURE__ */ jsx(ListRow, { wide: true, title: t("cf3"), description: t("cfHelp3"), below: /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsx("p", { style: { ...details, userSelect: "text" }, children: state?.origin || "http://127.0.0.1:9120" }),
          !state && /* @__PURE__ */ jsx("p", { style: details, children: t("originFallback") }),
          /* @__PURE__ */ jsx(Button, { variant: "secondary", onClick: () => host.navigate("/settings?tab=web-access"), children: t("webSettings") })
        ] }) })
      ] }),
      provider !== "tailscale" && /* @__PURE__ */ jsx(ListRow, { wide: true, title: /* @__PURE__ */ jsx("label", { htmlFor: "qr-wizard-address", children: t("address") }), description: t("manualHelp"), below: /* @__PURE__ */ jsxs("div", { style: { marginTop: 12 }, children: [
        /* @__PURE__ */ jsx(Input, { id: "qr-wizard-address", value: address, onChange: (e) => {
          setAddress(e.target.value);
          setChecked(false);
        }, placeholder: "https://hermes.example.com", inputMode: "url", autoComplete: "off", spellCheck: false }),
        /* @__PURE__ */ jsxs("label", { style: { ...actions, alignItems: "center", marginBottom: 16 }, children: [
          /* @__PURE__ */ jsx(Checkbox, { checked, onCheckedChange: (value) => setChecked(value === true) }),
          t("confirmed")
        ] }),
        /* @__PURE__ */ jsx(Button, { disabled: !checked, onClick: save, children: t("create") })
      ] }) })
    ] }),
    error && /* @__PURE__ */ jsxs("p", { role: "alert", style: { color: "var(--destructive)", marginTop: 16 }, children: [
      t(error),
      " ",
      failedLink
    ] }),
    /* @__PURE__ */ jsx("p", { role: "status", children: notice ? t(notice) : "" })
  ] });
}

// src/plugin.tsx
import { Fragment as Fragment2, jsx as jsx2, jsxs as jsxs2 } from "react/jsx-runtime";
var pageStyle = { maxWidth: 760, margin: "0 auto", padding: "8px 24px 32px", color: "var(--ui-text-primary)", fontSize: "var(--conversation-text-font-size)" };
var plugin_default = {
  id: ID,
  name: "Web Access QR",
  description: "Remote access setup and mobile QR.",
  defaultEnabled: true,
  register(ctx) {
    ctx.i18n.register(locales);
    const open = () => host2.navigate(pluginSettingsHref(ID));
    function StatusButton() {
      const t = usePluginI18n2(ID);
      return /* @__PURE__ */ jsx2(Button2, { variant: "ghost", size: "icon-xs", title: t("open"), "aria-label": t("open"), onClick: open, children: /* @__PURE__ */ jsx2(Codicon, { name: "device-mobile" }) });
    }
    function Page() {
      const t = usePluginI18n2(ID);
      const [saved, setSaved] = useState2(() => {
        try {
          return normalizeAddress(ctx.storage.get("url", ""));
        } catch {
          return "";
        }
      });
      const [draft, setDraft] = useState2(saved);
      const [wizard, setWizard] = useState2(!saved);
      const [message, setMessage] = useState2("");
      const [error, setError] = useState2("");
      const save = (value) => {
        const url = normalizeAddress(value);
        ctx.storage.set("url", url);
        setSaved(url);
        setDraft(url);
        setWizard(false);
        setError("");
        setMessage("saved");
      };
      const copy = async () => {
        try {
          if (!await ctx.os.writeClipboard(saved)) throw new Error();
          setMessage("copied");
          setError("");
        } catch {
          setError("copyFailed");
        }
      };
      let qr;
      try {
        if (saved) qr = import_qrcode.default.create(saved, { errorCorrectionLevel: "M" });
      } catch {
      }
      const path = qr ? Array.from(qr.modules.data, (v, i) => v ? `M${i % qr.modules.size + 4} ${Math.floor(i / qr.modules.size) + 4}h1v1h-1z` : "").join("") : "";
      return /* @__PURE__ */ jsx2("section", { style: pageStyle, children: wizard ? /* @__PURE__ */ jsx2(Wizard, { ctx, onSave: save, onClose: () => setWizard(false) }) : /* @__PURE__ */ jsxs2(Fragment2, { children: [
        /* @__PURE__ */ jsx2(ListRow2, { wide: true, title: t("title"), description: t("intro"), action: /* @__PURE__ */ jsx2(Button2, { variant: "secondary", onClick: () => setWizard(true), children: t("setup") }) }),
        qr ? /* @__PURE__ */ jsxs2("div", { style: { textAlign: "center", padding: "16px 0" }, children: [
          /* @__PURE__ */ jsxs2("svg", { role: "img", "aria-label": t("qrLabel"), viewBox: `0 0 ${qr.modules.size + 8} ${qr.modules.size + 8}`, shapeRendering: "crispEdges", style: { display: "block", width: "100%", maxWidth: 280, height: "auto", margin: "0 auto", background: "#fff" }, children: [
            /* @__PURE__ */ jsx2("rect", { width: "100%", height: "100%", fill: "#fff" }),
            /* @__PURE__ */ jsx2("path", { d: path, fill: "#000" })
          ] }),
          /* @__PURE__ */ jsx2("p", { style: { overflowWrap: "anywhere", userSelect: "text", margin: "16px 0" }, children: saved }),
          /* @__PURE__ */ jsx2(Button2, { variant: "secondary", onClick: copy, children: t("copy") }),
          new URL(saved).hostname.endsWith(".ts.net") && /* @__PURE__ */ jsx2("p", { style: { color: "var(--ui-text-tertiary)", marginTop: 12 }, children: t("phone") })
        ] }) : /* @__PURE__ */ jsx2("p", { children: t(saved ? "qrFailed" : "empty") }),
        /* @__PURE__ */ jsx2("form", { onSubmit: (e) => {
          e.preventDefault();
          try {
            save(draft);
          } catch (e2) {
            setError(e2 instanceof Error ? e2.message : "error");
          }
        }, children: /* @__PURE__ */ jsx2(ListRow2, { wide: true, title: /* @__PURE__ */ jsx2("label", { htmlFor: "hermes-web-qr-url", children: t("address") }), description: t("addressHelp"), action: /* @__PURE__ */ jsx2(Button2, { type: "submit", children: t("save") }), below: /* @__PURE__ */ jsx2(Input2, { id: "hermes-web-qr-url", inputMode: "url", autoComplete: "off", spellCheck: false, value: draft, placeholder: "https://hermes.example.com", onChange: (e) => {
          setDraft(e.target.value);
          setMessage("");
          setError("");
        }, style: { marginTop: 12 } }) }) }),
        error && /* @__PURE__ */ jsx2("p", { role: "alert", style: { color: "var(--destructive)" }, children: t(error) }),
        /* @__PURE__ */ jsx2("p", { role: "status", children: message ? t(message) : "" })
      ] }) });
    }
    ctx.registerSettingsPage({ id: "settings", title: "Web Access QR", icon: "device-mobile", render: () => /* @__PURE__ */ jsx2(Page, {}) });
    let disposeCommand;
    const labels = () => {
      disposeCommand?.();
      disposeCommand = ctx.register({ id: "open", area: PALETTE_AREA, data: { id: ID + ".open", label: ctx.i18n.t("open"), keywords: ["qr", "phone", "mobile", "web"], run: open } });
    };
    labels();
    ctx.i18n.onLocaleChange(labels);
    ctx.register({ id: "status", area: "statusBar.right", order: 130, render: () => /* @__PURE__ */ jsx2(StatusButton, {}) });
  }
};
export {
  plugin_default as default,
  pageStyle
};
