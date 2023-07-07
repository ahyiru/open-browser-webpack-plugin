import { createRequire as __WEBPACK_EXTERNAL_createRequire } from "module";
var __webpack_modules__ = {
  /***/
  282: (
    /***/
    (module, exports, __webpack_require__2) => {
      module = __webpack_require__2.nmd(module);
      var __WEBPACK_AMD_DEFINE_RESULT__;
      var bigInt = function(undefined2) {
        "use strict";
        var BASE = 1e7, LOG_BASE = 7, MAX_INT = 9007199254740992, MAX_INT_ARR = smallToArray(MAX_INT), DEFAULT_ALPHABET = "0123456789abcdefghijklmnopqrstuvwxyz";
        var supportsNativeBigInt = typeof BigInt === "function";
        function Integer(v, radix, alphabet, caseSensitive) {
          if (typeof v === "undefined")
            return Integer[0];
          if (typeof radix !== "undefined")
            return +radix === 10 && !alphabet ? parseValue(v) : parseBase(v, radix, alphabet, caseSensitive);
          return parseValue(v);
        }
        function BigInteger(value, sign) {
          this.value = value;
          this.sign = sign;
          this.isSmall = false;
        }
        BigInteger.prototype = Object.create(Integer.prototype);
        function SmallInteger(value) {
          this.value = value;
          this.sign = value < 0;
          this.isSmall = true;
        }
        SmallInteger.prototype = Object.create(Integer.prototype);
        function NativeBigInt(value) {
          this.value = value;
        }
        NativeBigInt.prototype = Object.create(Integer.prototype);
        function isPrecise(n) {
          return -MAX_INT < n && n < MAX_INT;
        }
        function smallToArray(n) {
          if (n < 1e7)
            return [n];
          if (n < 1e14)
            return [n % 1e7, Math.floor(n / 1e7)];
          return [n % 1e7, Math.floor(n / 1e7) % 1e7, Math.floor(n / 1e14)];
        }
        function arrayToSmall(arr) {
          trim(arr);
          var length = arr.length;
          if (length < 4 && compareAbs(arr, MAX_INT_ARR) < 0) {
            switch (length) {
              case 0:
                return 0;
              case 1:
                return arr[0];
              case 2:
                return arr[0] + arr[1] * BASE;
              default:
                return arr[0] + (arr[1] + arr[2] * BASE) * BASE;
            }
          }
          return arr;
        }
        function trim(v) {
          var i2 = v.length;
          while (v[--i2] === 0)
            ;
          v.length = i2 + 1;
        }
        function createArray(length) {
          var x = new Array(length);
          var i2 = -1;
          while (++i2 < length) {
            x[i2] = 0;
          }
          return x;
        }
        function truncate(n) {
          if (n > 0)
            return Math.floor(n);
          return Math.ceil(n);
        }
        function add(a, b) {
          var l_a = a.length, l_b = b.length, r = new Array(l_a), carry = 0, base = BASE, sum, i2;
          for (i2 = 0; i2 < l_b; i2++) {
            sum = a[i2] + b[i2] + carry;
            carry = sum >= base ? 1 : 0;
            r[i2] = sum - carry * base;
          }
          while (i2 < l_a) {
            sum = a[i2] + carry;
            carry = sum === base ? 1 : 0;
            r[i2++] = sum - carry * base;
          }
          if (carry > 0)
            r.push(carry);
          return r;
        }
        function addAny(a, b) {
          if (a.length >= b.length)
            return add(a, b);
          return add(b, a);
        }
        function addSmall(a, carry) {
          var l = a.length, r = new Array(l), base = BASE, sum, i2;
          for (i2 = 0; i2 < l; i2++) {
            sum = a[i2] - base + carry;
            carry = Math.floor(sum / base);
            r[i2] = sum - carry * base;
            carry += 1;
          }
          while (carry > 0) {
            r[i2++] = carry % base;
            carry = Math.floor(carry / base);
          }
          return r;
        }
        BigInteger.prototype.add = function(v) {
          var n = parseValue(v);
          if (this.sign !== n.sign) {
            return this.subtract(n.negate());
          }
          var a = this.value, b = n.value;
          if (n.isSmall) {
            return new BigInteger(addSmall(a, Math.abs(b)), this.sign);
          }
          return new BigInteger(addAny(a, b), this.sign);
        };
        BigInteger.prototype.plus = BigInteger.prototype.add;
        SmallInteger.prototype.add = function(v) {
          var n = parseValue(v);
          var a = this.value;
          if (a < 0 !== n.sign) {
            return this.subtract(n.negate());
          }
          var b = n.value;
          if (n.isSmall) {
            if (isPrecise(a + b))
              return new SmallInteger(a + b);
            b = smallToArray(Math.abs(b));
          }
          return new BigInteger(addSmall(b, Math.abs(a)), a < 0);
        };
        SmallInteger.prototype.plus = SmallInteger.prototype.add;
        NativeBigInt.prototype.add = function(v) {
          return new NativeBigInt(this.value + parseValue(v).value);
        };
        NativeBigInt.prototype.plus = NativeBigInt.prototype.add;
        function subtract(a, b) {
          var a_l = a.length, b_l = b.length, r = new Array(a_l), borrow = 0, base = BASE, i2, difference;
          for (i2 = 0; i2 < b_l; i2++) {
            difference = a[i2] - borrow - b[i2];
            if (difference < 0) {
              difference += base;
              borrow = 1;
            } else
              borrow = 0;
            r[i2] = difference;
          }
          for (i2 = b_l; i2 < a_l; i2++) {
            difference = a[i2] - borrow;
            if (difference < 0)
              difference += base;
            else {
              r[i2++] = difference;
              break;
            }
            r[i2] = difference;
          }
          for (; i2 < a_l; i2++) {
            r[i2] = a[i2];
          }
          trim(r);
          return r;
        }
        function subtractAny(a, b, sign) {
          var value;
          if (compareAbs(a, b) >= 0) {
            value = subtract(a, b);
          } else {
            value = subtract(b, a);
            sign = !sign;
          }
          value = arrayToSmall(value);
          if (typeof value === "number") {
            if (sign)
              value = -value;
            return new SmallInteger(value);
          }
          return new BigInteger(value, sign);
        }
        function subtractSmall(a, b, sign) {
          var l = a.length, r = new Array(l), carry = -b, base = BASE, i2, difference;
          for (i2 = 0; i2 < l; i2++) {
            difference = a[i2] + carry;
            carry = Math.floor(difference / base);
            difference %= base;
            r[i2] = difference < 0 ? difference + base : difference;
          }
          r = arrayToSmall(r);
          if (typeof r === "number") {
            if (sign)
              r = -r;
            return new SmallInteger(r);
          }
          return new BigInteger(r, sign);
        }
        BigInteger.prototype.subtract = function(v) {
          var n = parseValue(v);
          if (this.sign !== n.sign) {
            return this.add(n.negate());
          }
          var a = this.value, b = n.value;
          if (n.isSmall)
            return subtractSmall(a, Math.abs(b), this.sign);
          return subtractAny(a, b, this.sign);
        };
        BigInteger.prototype.minus = BigInteger.prototype.subtract;
        SmallInteger.prototype.subtract = function(v) {
          var n = parseValue(v);
          var a = this.value;
          if (a < 0 !== n.sign) {
            return this.add(n.negate());
          }
          var b = n.value;
          if (n.isSmall) {
            return new SmallInteger(a - b);
          }
          return subtractSmall(b, Math.abs(a), a >= 0);
        };
        SmallInteger.prototype.minus = SmallInteger.prototype.subtract;
        NativeBigInt.prototype.subtract = function(v) {
          return new NativeBigInt(this.value - parseValue(v).value);
        };
        NativeBigInt.prototype.minus = NativeBigInt.prototype.subtract;
        BigInteger.prototype.negate = function() {
          return new BigInteger(this.value, !this.sign);
        };
        SmallInteger.prototype.negate = function() {
          var sign = this.sign;
          var small = new SmallInteger(-this.value);
          small.sign = !sign;
          return small;
        };
        NativeBigInt.prototype.negate = function() {
          return new NativeBigInt(-this.value);
        };
        BigInteger.prototype.abs = function() {
          return new BigInteger(this.value, false);
        };
        SmallInteger.prototype.abs = function() {
          return new SmallInteger(Math.abs(this.value));
        };
        NativeBigInt.prototype.abs = function() {
          return new NativeBigInt(this.value >= 0 ? this.value : -this.value);
        };
        function multiplyLong(a, b) {
          var a_l = a.length, b_l = b.length, l = a_l + b_l, r = createArray(l), base = BASE, product, carry, i2, a_i, b_j;
          for (i2 = 0; i2 < a_l; ++i2) {
            a_i = a[i2];
            for (var j = 0; j < b_l; ++j) {
              b_j = b[j];
              product = a_i * b_j + r[i2 + j];
              carry = Math.floor(product / base);
              r[i2 + j] = product - carry * base;
              r[i2 + j + 1] += carry;
            }
          }
          trim(r);
          return r;
        }
        function multiplySmall(a, b) {
          var l = a.length, r = new Array(l), base = BASE, carry = 0, product, i2;
          for (i2 = 0; i2 < l; i2++) {
            product = a[i2] * b + carry;
            carry = Math.floor(product / base);
            r[i2] = product - carry * base;
          }
          while (carry > 0) {
            r[i2++] = carry % base;
            carry = Math.floor(carry / base);
          }
          return r;
        }
        function shiftLeft(x, n) {
          var r = [];
          while (n-- > 0)
            r.push(0);
          return r.concat(x);
        }
        function multiplyKaratsuba(x, y) {
          var n = Math.max(x.length, y.length);
          if (n <= 30)
            return multiplyLong(x, y);
          n = Math.ceil(n / 2);
          var b = x.slice(n), a = x.slice(0, n), d = y.slice(n), c = y.slice(0, n);
          var ac = multiplyKaratsuba(a, c), bd = multiplyKaratsuba(b, d), abcd = multiplyKaratsuba(addAny(a, b), addAny(c, d));
          var product = addAny(addAny(ac, shiftLeft(subtract(subtract(abcd, ac), bd), n)), shiftLeft(bd, 2 * n));
          trim(product);
          return product;
        }
        function useKaratsuba(l1, l2) {
          return -0.012 * l1 - 0.012 * l2 + 15e-6 * l1 * l2 > 0;
        }
        BigInteger.prototype.multiply = function(v) {
          var n = parseValue(v), a = this.value, b = n.value, sign = this.sign !== n.sign, abs;
          if (n.isSmall) {
            if (b === 0)
              return Integer[0];
            if (b === 1)
              return this;
            if (b === -1)
              return this.negate();
            abs = Math.abs(b);
            if (abs < BASE) {
              return new BigInteger(multiplySmall(a, abs), sign);
            }
            b = smallToArray(abs);
          }
          if (useKaratsuba(a.length, b.length))
            return new BigInteger(multiplyKaratsuba(a, b), sign);
          return new BigInteger(multiplyLong(a, b), sign);
        };
        BigInteger.prototype.times = BigInteger.prototype.multiply;
        function multiplySmallAndArray(a, b, sign) {
          if (a < BASE) {
            return new BigInteger(multiplySmall(b, a), sign);
          }
          return new BigInteger(multiplyLong(b, smallToArray(a)), sign);
        }
        SmallInteger.prototype._multiplyBySmall = function(a) {
          if (isPrecise(a.value * this.value)) {
            return new SmallInteger(a.value * this.value);
          }
          return multiplySmallAndArray(Math.abs(a.value), smallToArray(Math.abs(this.value)), this.sign !== a.sign);
        };
        BigInteger.prototype._multiplyBySmall = function(a) {
          if (a.value === 0)
            return Integer[0];
          if (a.value === 1)
            return this;
          if (a.value === -1)
            return this.negate();
          return multiplySmallAndArray(Math.abs(a.value), this.value, this.sign !== a.sign);
        };
        SmallInteger.prototype.multiply = function(v) {
          return parseValue(v)._multiplyBySmall(this);
        };
        SmallInteger.prototype.times = SmallInteger.prototype.multiply;
        NativeBigInt.prototype.multiply = function(v) {
          return new NativeBigInt(this.value * parseValue(v).value);
        };
        NativeBigInt.prototype.times = NativeBigInt.prototype.multiply;
        function square(a) {
          var l = a.length, r = createArray(l + l), base = BASE, product, carry, i2, a_i, a_j;
          for (i2 = 0; i2 < l; i2++) {
            a_i = a[i2];
            carry = 0 - a_i * a_i;
            for (var j = i2; j < l; j++) {
              a_j = a[j];
              product = 2 * (a_i * a_j) + r[i2 + j] + carry;
              carry = Math.floor(product / base);
              r[i2 + j] = product - carry * base;
            }
            r[i2 + l] = carry;
          }
          trim(r);
          return r;
        }
        BigInteger.prototype.square = function() {
          return new BigInteger(square(this.value), false);
        };
        SmallInteger.prototype.square = function() {
          var value = this.value * this.value;
          if (isPrecise(value))
            return new SmallInteger(value);
          return new BigInteger(square(smallToArray(Math.abs(this.value))), false);
        };
        NativeBigInt.prototype.square = function(v) {
          return new NativeBigInt(this.value * this.value);
        };
        function divMod1(a, b) {
          var a_l = a.length, b_l = b.length, base = BASE, result = createArray(b.length), divisorMostSignificantDigit = b[b_l - 1], lambda = Math.ceil(base / (2 * divisorMostSignificantDigit)), remainder = multiplySmall(a, lambda), divisor = multiplySmall(b, lambda), quotientDigit, shift, carry, borrow, i2, l, q;
          if (remainder.length <= a_l)
            remainder.push(0);
          divisor.push(0);
          divisorMostSignificantDigit = divisor[b_l - 1];
          for (shift = a_l - b_l; shift >= 0; shift--) {
            quotientDigit = base - 1;
            if (remainder[shift + b_l] !== divisorMostSignificantDigit) {
              quotientDigit = Math.floor((remainder[shift + b_l] * base + remainder[shift + b_l - 1]) / divisorMostSignificantDigit);
            }
            carry = 0;
            borrow = 0;
            l = divisor.length;
            for (i2 = 0; i2 < l; i2++) {
              carry += quotientDigit * divisor[i2];
              q = Math.floor(carry / base);
              borrow += remainder[shift + i2] - (carry - q * base);
              carry = q;
              if (borrow < 0) {
                remainder[shift + i2] = borrow + base;
                borrow = -1;
              } else {
                remainder[shift + i2] = borrow;
                borrow = 0;
              }
            }
            while (borrow !== 0) {
              quotientDigit -= 1;
              carry = 0;
              for (i2 = 0; i2 < l; i2++) {
                carry += remainder[shift + i2] - base + divisor[i2];
                if (carry < 0) {
                  remainder[shift + i2] = carry + base;
                  carry = 0;
                } else {
                  remainder[shift + i2] = carry;
                  carry = 1;
                }
              }
              borrow += carry;
            }
            result[shift] = quotientDigit;
          }
          remainder = divModSmall(remainder, lambda)[0];
          return [arrayToSmall(result), arrayToSmall(remainder)];
        }
        function divMod2(a, b) {
          var a_l = a.length, b_l = b.length, result = [], part = [], base = BASE, guess, xlen, highx, highy, check;
          while (a_l) {
            part.unshift(a[--a_l]);
            trim(part);
            if (compareAbs(part, b) < 0) {
              result.push(0);
              continue;
            }
            xlen = part.length;
            highx = part[xlen - 1] * base + part[xlen - 2];
            highy = b[b_l - 1] * base + b[b_l - 2];
            if (xlen > b_l) {
              highx = (highx + 1) * base;
            }
            guess = Math.ceil(highx / highy);
            do {
              check = multiplySmall(b, guess);
              if (compareAbs(check, part) <= 0)
                break;
              guess--;
            } while (guess);
            result.push(guess);
            part = subtract(part, check);
          }
          result.reverse();
          return [arrayToSmall(result), arrayToSmall(part)];
        }
        function divModSmall(value, lambda) {
          var length = value.length, quotient = createArray(length), base = BASE, i2, q, remainder, divisor;
          remainder = 0;
          for (i2 = length - 1; i2 >= 0; --i2) {
            divisor = remainder * base + value[i2];
            q = truncate(divisor / lambda);
            remainder = divisor - q * lambda;
            quotient[i2] = q | 0;
          }
          return [quotient, remainder | 0];
        }
        function divModAny(self, v) {
          var value, n = parseValue(v);
          if (supportsNativeBigInt) {
            return [new NativeBigInt(self.value / n.value), new NativeBigInt(self.value % n.value)];
          }
          var a = self.value, b = n.value;
          var quotient;
          if (b === 0)
            throw new Error("Cannot divide by zero");
          if (self.isSmall) {
            if (n.isSmall) {
              return [new SmallInteger(truncate(a / b)), new SmallInteger(a % b)];
            }
            return [Integer[0], self];
          }
          if (n.isSmall) {
            if (b === 1)
              return [self, Integer[0]];
            if (b == -1)
              return [self.negate(), Integer[0]];
            var abs = Math.abs(b);
            if (abs < BASE) {
              value = divModSmall(a, abs);
              quotient = arrayToSmall(value[0]);
              var remainder = value[1];
              if (self.sign)
                remainder = -remainder;
              if (typeof quotient === "number") {
                if (self.sign !== n.sign)
                  quotient = -quotient;
                return [new SmallInteger(quotient), new SmallInteger(remainder)];
              }
              return [new BigInteger(quotient, self.sign !== n.sign), new SmallInteger(remainder)];
            }
            b = smallToArray(abs);
          }
          var comparison = compareAbs(a, b);
          if (comparison === -1)
            return [Integer[0], self];
          if (comparison === 0)
            return [Integer[self.sign === n.sign ? 1 : -1], Integer[0]];
          if (a.length + b.length <= 200)
            value = divMod1(a, b);
          else
            value = divMod2(a, b);
          quotient = value[0];
          var qSign = self.sign !== n.sign, mod = value[1], mSign = self.sign;
          if (typeof quotient === "number") {
            if (qSign)
              quotient = -quotient;
            quotient = new SmallInteger(quotient);
          } else
            quotient = new BigInteger(quotient, qSign);
          if (typeof mod === "number") {
            if (mSign)
              mod = -mod;
            mod = new SmallInteger(mod);
          } else
            mod = new BigInteger(mod, mSign);
          return [quotient, mod];
        }
        BigInteger.prototype.divmod = function(v) {
          var result = divModAny(this, v);
          return {
            quotient: result[0],
            remainder: result[1]
          };
        };
        NativeBigInt.prototype.divmod = SmallInteger.prototype.divmod = BigInteger.prototype.divmod;
        BigInteger.prototype.divide = function(v) {
          return divModAny(this, v)[0];
        };
        NativeBigInt.prototype.over = NativeBigInt.prototype.divide = function(v) {
          return new NativeBigInt(this.value / parseValue(v).value);
        };
        SmallInteger.prototype.over = SmallInteger.prototype.divide = BigInteger.prototype.over = BigInteger.prototype.divide;
        BigInteger.prototype.mod = function(v) {
          return divModAny(this, v)[1];
        };
        NativeBigInt.prototype.mod = NativeBigInt.prototype.remainder = function(v) {
          return new NativeBigInt(this.value % parseValue(v).value);
        };
        SmallInteger.prototype.remainder = SmallInteger.prototype.mod = BigInteger.prototype.remainder = BigInteger.prototype.mod;
        BigInteger.prototype.pow = function(v) {
          var n = parseValue(v), a = this.value, b = n.value, value, x, y;
          if (b === 0)
            return Integer[1];
          if (a === 0)
            return Integer[0];
          if (a === 1)
            return Integer[1];
          if (a === -1)
            return n.isEven() ? Integer[1] : Integer[-1];
          if (n.sign) {
            return Integer[0];
          }
          if (!n.isSmall)
            throw new Error("The exponent " + n.toString() + " is too large.");
          if (this.isSmall) {
            if (isPrecise(value = Math.pow(a, b)))
              return new SmallInteger(truncate(value));
          }
          x = this;
          y = Integer[1];
          while (true) {
            if (b & true) {
              y = y.times(x);
              --b;
            }
            if (b === 0)
              break;
            b /= 2;
            x = x.square();
          }
          return y;
        };
        SmallInteger.prototype.pow = BigInteger.prototype.pow;
        NativeBigInt.prototype.pow = function(v) {
          var n = parseValue(v);
          var a = this.value, b = n.value;
          var _0 = BigInt(0), _1 = BigInt(1), _2 = BigInt(2);
          if (b === _0)
            return Integer[1];
          if (a === _0)
            return Integer[0];
          if (a === _1)
            return Integer[1];
          if (a === BigInt(-1))
            return n.isEven() ? Integer[1] : Integer[-1];
          if (n.isNegative())
            return new NativeBigInt(_0);
          var x = this;
          var y = Integer[1];
          while (true) {
            if ((b & _1) === _1) {
              y = y.times(x);
              --b;
            }
            if (b === _0)
              break;
            b /= _2;
            x = x.square();
          }
          return y;
        };
        BigInteger.prototype.modPow = function(exp, mod) {
          exp = parseValue(exp);
          mod = parseValue(mod);
          if (mod.isZero())
            throw new Error("Cannot take modPow with modulus 0");
          var r = Integer[1], base = this.mod(mod);
          if (exp.isNegative()) {
            exp = exp.multiply(Integer[-1]);
            base = base.modInv(mod);
          }
          while (exp.isPositive()) {
            if (base.isZero())
              return Integer[0];
            if (exp.isOdd())
              r = r.multiply(base).mod(mod);
            exp = exp.divide(2);
            base = base.square().mod(mod);
          }
          return r;
        };
        NativeBigInt.prototype.modPow = SmallInteger.prototype.modPow = BigInteger.prototype.modPow;
        function compareAbs(a, b) {
          if (a.length !== b.length) {
            return a.length > b.length ? 1 : -1;
          }
          for (var i2 = a.length - 1; i2 >= 0; i2--) {
            if (a[i2] !== b[i2])
              return a[i2] > b[i2] ? 1 : -1;
          }
          return 0;
        }
        BigInteger.prototype.compareAbs = function(v) {
          var n = parseValue(v), a = this.value, b = n.value;
          if (n.isSmall)
            return 1;
          return compareAbs(a, b);
        };
        SmallInteger.prototype.compareAbs = function(v) {
          var n = parseValue(v), a = Math.abs(this.value), b = n.value;
          if (n.isSmall) {
            b = Math.abs(b);
            return a === b ? 0 : a > b ? 1 : -1;
          }
          return -1;
        };
        NativeBigInt.prototype.compareAbs = function(v) {
          var a = this.value;
          var b = parseValue(v).value;
          a = a >= 0 ? a : -a;
          b = b >= 0 ? b : -b;
          return a === b ? 0 : a > b ? 1 : -1;
        };
        BigInteger.prototype.compare = function(v) {
          if (v === Infinity) {
            return -1;
          }
          if (v === -Infinity) {
            return 1;
          }
          var n = parseValue(v), a = this.value, b = n.value;
          if (this.sign !== n.sign) {
            return n.sign ? 1 : -1;
          }
          if (n.isSmall) {
            return this.sign ? -1 : 1;
          }
          return compareAbs(a, b) * (this.sign ? -1 : 1);
        };
        BigInteger.prototype.compareTo = BigInteger.prototype.compare;
        SmallInteger.prototype.compare = function(v) {
          if (v === Infinity) {
            return -1;
          }
          if (v === -Infinity) {
            return 1;
          }
          var n = parseValue(v), a = this.value, b = n.value;
          if (n.isSmall) {
            return a == b ? 0 : a > b ? 1 : -1;
          }
          if (a < 0 !== n.sign) {
            return a < 0 ? -1 : 1;
          }
          return a < 0 ? 1 : -1;
        };
        SmallInteger.prototype.compareTo = SmallInteger.prototype.compare;
        NativeBigInt.prototype.compare = function(v) {
          if (v === Infinity) {
            return -1;
          }
          if (v === -Infinity) {
            return 1;
          }
          var a = this.value;
          var b = parseValue(v).value;
          return a === b ? 0 : a > b ? 1 : -1;
        };
        NativeBigInt.prototype.compareTo = NativeBigInt.prototype.compare;
        BigInteger.prototype.equals = function(v) {
          return this.compare(v) === 0;
        };
        NativeBigInt.prototype.eq = NativeBigInt.prototype.equals = SmallInteger.prototype.eq = SmallInteger.prototype.equals = BigInteger.prototype.eq = BigInteger.prototype.equals;
        BigInteger.prototype.notEquals = function(v) {
          return this.compare(v) !== 0;
        };
        NativeBigInt.prototype.neq = NativeBigInt.prototype.notEquals = SmallInteger.prototype.neq = SmallInteger.prototype.notEquals = BigInteger.prototype.neq = BigInteger.prototype.notEquals;
        BigInteger.prototype.greater = function(v) {
          return this.compare(v) > 0;
        };
        NativeBigInt.prototype.gt = NativeBigInt.prototype.greater = SmallInteger.prototype.gt = SmallInteger.prototype.greater = BigInteger.prototype.gt = BigInteger.prototype.greater;
        BigInteger.prototype.lesser = function(v) {
          return this.compare(v) < 0;
        };
        NativeBigInt.prototype.lt = NativeBigInt.prototype.lesser = SmallInteger.prototype.lt = SmallInteger.prototype.lesser = BigInteger.prototype.lt = BigInteger.prototype.lesser;
        BigInteger.prototype.greaterOrEquals = function(v) {
          return this.compare(v) >= 0;
        };
        NativeBigInt.prototype.geq = NativeBigInt.prototype.greaterOrEquals = SmallInteger.prototype.geq = SmallInteger.prototype.greaterOrEquals = BigInteger.prototype.geq = BigInteger.prototype.greaterOrEquals;
        BigInteger.prototype.lesserOrEquals = function(v) {
          return this.compare(v) <= 0;
        };
        NativeBigInt.prototype.leq = NativeBigInt.prototype.lesserOrEquals = SmallInteger.prototype.leq = SmallInteger.prototype.lesserOrEquals = BigInteger.prototype.leq = BigInteger.prototype.lesserOrEquals;
        BigInteger.prototype.isEven = function() {
          return (this.value[0] & 1) === 0;
        };
        SmallInteger.prototype.isEven = function() {
          return (this.value & 1) === 0;
        };
        NativeBigInt.prototype.isEven = function() {
          return (this.value & BigInt(1)) === BigInt(0);
        };
        BigInteger.prototype.isOdd = function() {
          return (this.value[0] & 1) === 1;
        };
        SmallInteger.prototype.isOdd = function() {
          return (this.value & 1) === 1;
        };
        NativeBigInt.prototype.isOdd = function() {
          return (this.value & BigInt(1)) === BigInt(1);
        };
        BigInteger.prototype.isPositive = function() {
          return !this.sign;
        };
        SmallInteger.prototype.isPositive = function() {
          return this.value > 0;
        };
        NativeBigInt.prototype.isPositive = SmallInteger.prototype.isPositive;
        BigInteger.prototype.isNegative = function() {
          return this.sign;
        };
        SmallInteger.prototype.isNegative = function() {
          return this.value < 0;
        };
        NativeBigInt.prototype.isNegative = SmallInteger.prototype.isNegative;
        BigInteger.prototype.isUnit = function() {
          return false;
        };
        SmallInteger.prototype.isUnit = function() {
          return Math.abs(this.value) === 1;
        };
        NativeBigInt.prototype.isUnit = function() {
          return this.abs().value === BigInt(1);
        };
        BigInteger.prototype.isZero = function() {
          return false;
        };
        SmallInteger.prototype.isZero = function() {
          return this.value === 0;
        };
        NativeBigInt.prototype.isZero = function() {
          return this.value === BigInt(0);
        };
        BigInteger.prototype.isDivisibleBy = function(v) {
          var n = parseValue(v);
          if (n.isZero())
            return false;
          if (n.isUnit())
            return true;
          if (n.compareAbs(2) === 0)
            return this.isEven();
          return this.mod(n).isZero();
        };
        NativeBigInt.prototype.isDivisibleBy = SmallInteger.prototype.isDivisibleBy = BigInteger.prototype.isDivisibleBy;
        function isBasicPrime(v) {
          var n = v.abs();
          if (n.isUnit())
            return false;
          if (n.equals(2) || n.equals(3) || n.equals(5))
            return true;
          if (n.isEven() || n.isDivisibleBy(3) || n.isDivisibleBy(5))
            return false;
          if (n.lesser(49))
            return true;
        }
        function millerRabinTest(n, a) {
          var nPrev = n.prev(), b = nPrev, r = 0, d, t, i2, x;
          while (b.isEven())
            b = b.divide(2), r++;
          next:
            for (i2 = 0; i2 < a.length; i2++) {
              if (n.lesser(a[i2]))
                continue;
              x = bigInt(a[i2]).modPow(b, n);
              if (x.isUnit() || x.equals(nPrev))
                continue;
              for (d = r - 1; d != 0; d--) {
                x = x.square().mod(n);
                if (x.isUnit())
                  return false;
                if (x.equals(nPrev))
                  continue next;
              }
              return false;
            }
          return true;
        }
        BigInteger.prototype.isPrime = function(strict) {
          var isPrime = isBasicPrime(this);
          if (isPrime !== undefined2)
            return isPrime;
          var n = this.abs();
          var bits = n.bitLength();
          if (bits <= 64)
            return millerRabinTest(n, [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37]);
          var logN = Math.log(2) * bits.toJSNumber();
          var t = Math.ceil(strict === true ? 2 * Math.pow(logN, 2) : logN);
          for (var a = [], i2 = 0; i2 < t; i2++) {
            a.push(bigInt(i2 + 2));
          }
          return millerRabinTest(n, a);
        };
        NativeBigInt.prototype.isPrime = SmallInteger.prototype.isPrime = BigInteger.prototype.isPrime;
        BigInteger.prototype.isProbablePrime = function(iterations, rng) {
          var isPrime = isBasicPrime(this);
          if (isPrime !== undefined2)
            return isPrime;
          var n = this.abs();
          var t = iterations === undefined2 ? 5 : iterations;
          for (var a = [], i2 = 0; i2 < t; i2++) {
            a.push(bigInt.randBetween(2, n.minus(2), rng));
          }
          return millerRabinTest(n, a);
        };
        NativeBigInt.prototype.isProbablePrime = SmallInteger.prototype.isProbablePrime = BigInteger.prototype.isProbablePrime;
        BigInteger.prototype.modInv = function(n) {
          var t = bigInt.zero, newT = bigInt.one, r = parseValue(n), newR = this.abs(), q, lastT, lastR;
          while (!newR.isZero()) {
            q = r.divide(newR);
            lastT = t;
            lastR = r;
            t = newT;
            r = newR;
            newT = lastT.subtract(q.multiply(newT));
            newR = lastR.subtract(q.multiply(newR));
          }
          if (!r.isUnit())
            throw new Error(this.toString() + " and " + n.toString() + " are not co-prime");
          if (t.compare(0) === -1) {
            t = t.add(n);
          }
          if (this.isNegative()) {
            return t.negate();
          }
          return t;
        };
        NativeBigInt.prototype.modInv = SmallInteger.prototype.modInv = BigInteger.prototype.modInv;
        BigInteger.prototype.next = function() {
          var value = this.value;
          if (this.sign) {
            return subtractSmall(value, 1, this.sign);
          }
          return new BigInteger(addSmall(value, 1), this.sign);
        };
        SmallInteger.prototype.next = function() {
          var value = this.value;
          if (value + 1 < MAX_INT)
            return new SmallInteger(value + 1);
          return new BigInteger(MAX_INT_ARR, false);
        };
        NativeBigInt.prototype.next = function() {
          return new NativeBigInt(this.value + BigInt(1));
        };
        BigInteger.prototype.prev = function() {
          var value = this.value;
          if (this.sign) {
            return new BigInteger(addSmall(value, 1), true);
          }
          return subtractSmall(value, 1, this.sign);
        };
        SmallInteger.prototype.prev = function() {
          var value = this.value;
          if (value - 1 > -MAX_INT)
            return new SmallInteger(value - 1);
          return new BigInteger(MAX_INT_ARR, true);
        };
        NativeBigInt.prototype.prev = function() {
          return new NativeBigInt(this.value - BigInt(1));
        };
        var powersOfTwo = [1];
        while (2 * powersOfTwo[powersOfTwo.length - 1] <= BASE)
          powersOfTwo.push(2 * powersOfTwo[powersOfTwo.length - 1]);
        var powers2Length = powersOfTwo.length, highestPower2 = powersOfTwo[powers2Length - 1];
        function shift_isSmall(n) {
          return Math.abs(n) <= BASE;
        }
        BigInteger.prototype.shiftLeft = function(v) {
          var n = parseValue(v).toJSNumber();
          if (!shift_isSmall(n)) {
            throw new Error(String(n) + " is too large for shifting.");
          }
          if (n < 0)
            return this.shiftRight(-n);
          var result = this;
          if (result.isZero())
            return result;
          while (n >= powers2Length) {
            result = result.multiply(highestPower2);
            n -= powers2Length - 1;
          }
          return result.multiply(powersOfTwo[n]);
        };
        NativeBigInt.prototype.shiftLeft = SmallInteger.prototype.shiftLeft = BigInteger.prototype.shiftLeft;
        BigInteger.prototype.shiftRight = function(v) {
          var remQuo;
          var n = parseValue(v).toJSNumber();
          if (!shift_isSmall(n)) {
            throw new Error(String(n) + " is too large for shifting.");
          }
          if (n < 0)
            return this.shiftLeft(-n);
          var result = this;
          while (n >= powers2Length) {
            if (result.isZero() || result.isNegative() && result.isUnit())
              return result;
            remQuo = divModAny(result, highestPower2);
            result = remQuo[1].isNegative() ? remQuo[0].prev() : remQuo[0];
            n -= powers2Length - 1;
          }
          remQuo = divModAny(result, powersOfTwo[n]);
          return remQuo[1].isNegative() ? remQuo[0].prev() : remQuo[0];
        };
        NativeBigInt.prototype.shiftRight = SmallInteger.prototype.shiftRight = BigInteger.prototype.shiftRight;
        function bitwise(x, y, fn) {
          y = parseValue(y);
          var xSign = x.isNegative(), ySign = y.isNegative();
          var xRem = xSign ? x.not() : x, yRem = ySign ? y.not() : y;
          var xDigit = 0, yDigit = 0;
          var xDivMod = null, yDivMod = null;
          var result = [];
          while (!xRem.isZero() || !yRem.isZero()) {
            xDivMod = divModAny(xRem, highestPower2);
            xDigit = xDivMod[1].toJSNumber();
            if (xSign) {
              xDigit = highestPower2 - 1 - xDigit;
            }
            yDivMod = divModAny(yRem, highestPower2);
            yDigit = yDivMod[1].toJSNumber();
            if (ySign) {
              yDigit = highestPower2 - 1 - yDigit;
            }
            xRem = xDivMod[0];
            yRem = yDivMod[0];
            result.push(fn(xDigit, yDigit));
          }
          var sum = fn(xSign ? 1 : 0, ySign ? 1 : 0) !== 0 ? bigInt(-1) : bigInt(0);
          for (var i2 = result.length - 1; i2 >= 0; i2 -= 1) {
            sum = sum.multiply(highestPower2).add(bigInt(result[i2]));
          }
          return sum;
        }
        BigInteger.prototype.not = function() {
          return this.negate().prev();
        };
        NativeBigInt.prototype.not = SmallInteger.prototype.not = BigInteger.prototype.not;
        BigInteger.prototype.and = function(n) {
          return bitwise(this, n, function(a, b) {
            return a & b;
          });
        };
        NativeBigInt.prototype.and = SmallInteger.prototype.and = BigInteger.prototype.and;
        BigInteger.prototype.or = function(n) {
          return bitwise(this, n, function(a, b) {
            return a | b;
          });
        };
        NativeBigInt.prototype.or = SmallInteger.prototype.or = BigInteger.prototype.or;
        BigInteger.prototype.xor = function(n) {
          return bitwise(this, n, function(a, b) {
            return a ^ b;
          });
        };
        NativeBigInt.prototype.xor = SmallInteger.prototype.xor = BigInteger.prototype.xor;
        var LOBMASK_I = 1 << 30, LOBMASK_BI = (BASE & -BASE) * (BASE & -BASE) | LOBMASK_I;
        function roughLOB(n) {
          var v = n.value, x = typeof v === "number" ? v | LOBMASK_I : typeof v === "bigint" ? v | BigInt(LOBMASK_I) : v[0] + v[1] * BASE | LOBMASK_BI;
          return x & -x;
        }
        function integerLogarithm(value, base) {
          if (base.compareTo(value) <= 0) {
            var tmp = integerLogarithm(value, base.square(base));
            var p = tmp.p;
            var e = tmp.e;
            var t = p.multiply(base);
            return t.compareTo(value) <= 0 ? { p: t, e: e * 2 + 1 } : { p, e: e * 2 };
          }
          return { p: bigInt(1), e: 0 };
        }
        BigInteger.prototype.bitLength = function() {
          var n = this;
          if (n.compareTo(bigInt(0)) < 0) {
            n = n.negate().subtract(bigInt(1));
          }
          if (n.compareTo(bigInt(0)) === 0) {
            return bigInt(0);
          }
          return bigInt(integerLogarithm(n, bigInt(2)).e).add(bigInt(1));
        };
        NativeBigInt.prototype.bitLength = SmallInteger.prototype.bitLength = BigInteger.prototype.bitLength;
        function max(a, b) {
          a = parseValue(a);
          b = parseValue(b);
          return a.greater(b) ? a : b;
        }
        function min(a, b) {
          a = parseValue(a);
          b = parseValue(b);
          return a.lesser(b) ? a : b;
        }
        function gcd(a, b) {
          a = parseValue(a).abs();
          b = parseValue(b).abs();
          if (a.equals(b))
            return a;
          if (a.isZero())
            return b;
          if (b.isZero())
            return a;
          var c = Integer[1], d, t;
          while (a.isEven() && b.isEven()) {
            d = min(roughLOB(a), roughLOB(b));
            a = a.divide(d);
            b = b.divide(d);
            c = c.multiply(d);
          }
          while (a.isEven()) {
            a = a.divide(roughLOB(a));
          }
          do {
            while (b.isEven()) {
              b = b.divide(roughLOB(b));
            }
            if (a.greater(b)) {
              t = b;
              b = a;
              a = t;
            }
            b = b.subtract(a);
          } while (!b.isZero());
          return c.isUnit() ? a : a.multiply(c);
        }
        function lcm(a, b) {
          a = parseValue(a).abs();
          b = parseValue(b).abs();
          return a.divide(gcd(a, b)).multiply(b);
        }
        function randBetween(a, b, rng) {
          a = parseValue(a);
          b = parseValue(b);
          var usedRNG = rng || Math.random;
          var low = min(a, b), high = max(a, b);
          var range = high.subtract(low).add(1);
          if (range.isSmall)
            return low.add(Math.floor(usedRNG() * range));
          var digits = toBase(range, BASE).value;
          var result = [], restricted = true;
          for (var i2 = 0; i2 < digits.length; i2++) {
            var top = restricted ? digits[i2] + (i2 + 1 < digits.length ? digits[i2 + 1] / BASE : 0) : BASE;
            var digit = truncate(usedRNG() * top);
            result.push(digit);
            if (digit < digits[i2])
              restricted = false;
          }
          return low.add(Integer.fromArray(result, BASE, false));
        }
        var parseBase = function(text, base, alphabet, caseSensitive) {
          alphabet = alphabet || DEFAULT_ALPHABET;
          text = String(text);
          if (!caseSensitive) {
            text = text.toLowerCase();
            alphabet = alphabet.toLowerCase();
          }
          var length = text.length;
          var i2;
          var absBase = Math.abs(base);
          var alphabetValues = {};
          for (i2 = 0; i2 < alphabet.length; i2++) {
            alphabetValues[alphabet[i2]] = i2;
          }
          for (i2 = 0; i2 < length; i2++) {
            var c = text[i2];
            if (c === "-")
              continue;
            if (c in alphabetValues) {
              if (alphabetValues[c] >= absBase) {
                if (c === "1" && absBase === 1)
                  continue;
                throw new Error(c + " is not a valid digit in base " + base + ".");
              }
            }
          }
          base = parseValue(base);
          var digits = [];
          var isNegative = text[0] === "-";
          for (i2 = isNegative ? 1 : 0; i2 < text.length; i2++) {
            var c = text[i2];
            if (c in alphabetValues)
              digits.push(parseValue(alphabetValues[c]));
            else if (c === "<") {
              var start = i2;
              do {
                i2++;
              } while (text[i2] !== ">" && i2 < text.length);
              digits.push(parseValue(text.slice(start + 1, i2)));
            } else
              throw new Error(c + " is not a valid character");
          }
          return parseBaseFromArray(digits, base, isNegative);
        };
        function parseBaseFromArray(digits, base, isNegative) {
          var val = Integer[0], pow = Integer[1], i2;
          for (i2 = digits.length - 1; i2 >= 0; i2--) {
            val = val.add(digits[i2].times(pow));
            pow = pow.times(base);
          }
          return isNegative ? val.negate() : val;
        }
        function stringify(digit, alphabet) {
          alphabet = alphabet || DEFAULT_ALPHABET;
          if (digit < alphabet.length) {
            return alphabet[digit];
          }
          return "<" + digit + ">";
        }
        function toBase(n, base) {
          base = bigInt(base);
          if (base.isZero()) {
            if (n.isZero())
              return { value: [0], isNegative: false };
            throw new Error("Cannot convert nonzero numbers to base 0.");
          }
          if (base.equals(-1)) {
            if (n.isZero())
              return { value: [0], isNegative: false };
            if (n.isNegative())
              return {
                value: [].concat.apply(
                  [],
                  Array.apply(null, Array(-n.toJSNumber())).map(Array.prototype.valueOf, [1, 0])
                ),
                isNegative: false
              };
            var arr = Array.apply(null, Array(n.toJSNumber() - 1)).map(Array.prototype.valueOf, [0, 1]);
            arr.unshift([1]);
            return {
              value: [].concat.apply([], arr),
              isNegative: false
            };
          }
          var neg = false;
          if (n.isNegative() && base.isPositive()) {
            neg = true;
            n = n.abs();
          }
          if (base.isUnit()) {
            if (n.isZero())
              return { value: [0], isNegative: false };
            return {
              value: Array.apply(null, Array(n.toJSNumber())).map(Number.prototype.valueOf, 1),
              isNegative: neg
            };
          }
          var out = [];
          var left = n, divmod;
          while (left.isNegative() || left.compareAbs(base) >= 0) {
            divmod = left.divmod(base);
            left = divmod.quotient;
            var digit = divmod.remainder;
            if (digit.isNegative()) {
              digit = base.minus(digit).abs();
              left = left.next();
            }
            out.push(digit.toJSNumber());
          }
          out.push(left.toJSNumber());
          return { value: out.reverse(), isNegative: neg };
        }
        function toBaseString(n, base, alphabet) {
          var arr = toBase(n, base);
          return (arr.isNegative ? "-" : "") + arr.value.map(function(x) {
            return stringify(x, alphabet);
          }).join("");
        }
        BigInteger.prototype.toArray = function(radix) {
          return toBase(this, radix);
        };
        SmallInteger.prototype.toArray = function(radix) {
          return toBase(this, radix);
        };
        NativeBigInt.prototype.toArray = function(radix) {
          return toBase(this, radix);
        };
        BigInteger.prototype.toString = function(radix, alphabet) {
          if (radix === undefined2)
            radix = 10;
          if (radix !== 10)
            return toBaseString(this, radix, alphabet);
          var v = this.value, l = v.length, str = String(v[--l]), zeros = "0000000", digit;
          while (--l >= 0) {
            digit = String(v[l]);
            str += zeros.slice(digit.length) + digit;
          }
          var sign = this.sign ? "-" : "";
          return sign + str;
        };
        SmallInteger.prototype.toString = function(radix, alphabet) {
          if (radix === undefined2)
            radix = 10;
          if (radix != 10)
            return toBaseString(this, radix, alphabet);
          return String(this.value);
        };
        NativeBigInt.prototype.toString = SmallInteger.prototype.toString;
        NativeBigInt.prototype.toJSON = BigInteger.prototype.toJSON = SmallInteger.prototype.toJSON = function() {
          return this.toString();
        };
        BigInteger.prototype.valueOf = function() {
          return parseInt(this.toString(), 10);
        };
        BigInteger.prototype.toJSNumber = BigInteger.prototype.valueOf;
        SmallInteger.prototype.valueOf = function() {
          return this.value;
        };
        SmallInteger.prototype.toJSNumber = SmallInteger.prototype.valueOf;
        NativeBigInt.prototype.valueOf = NativeBigInt.prototype.toJSNumber = function() {
          return parseInt(this.toString(), 10);
        };
        function parseStringValue(v) {
          if (isPrecise(+v)) {
            var x = +v;
            if (x === truncate(x))
              return supportsNativeBigInt ? new NativeBigInt(BigInt(x)) : new SmallInteger(x);
            throw new Error("Invalid integer: " + v);
          }
          var sign = v[0] === "-";
          if (sign)
            v = v.slice(1);
          var split = v.split(/e/i);
          if (split.length > 2)
            throw new Error("Invalid integer: " + split.join("e"));
          if (split.length === 2) {
            var exp = split[1];
            if (exp[0] === "+")
              exp = exp.slice(1);
            exp = +exp;
            if (exp !== truncate(exp) || !isPrecise(exp))
              throw new Error("Invalid integer: " + exp + " is not a valid exponent.");
            var text = split[0];
            var decimalPlace = text.indexOf(".");
            if (decimalPlace >= 0) {
              exp -= text.length - decimalPlace - 1;
              text = text.slice(0, decimalPlace) + text.slice(decimalPlace + 1);
            }
            if (exp < 0)
              throw new Error("Cannot include negative exponent part for integers");
            text += new Array(exp + 1).join("0");
            v = text;
          }
          var isValid = /^([0-9][0-9]*)$/.test(v);
          if (!isValid)
            throw new Error("Invalid integer: " + v);
          if (supportsNativeBigInt) {
            return new NativeBigInt(BigInt(sign ? "-" + v : v));
          }
          var r = [], max2 = v.length, l = LOG_BASE, min2 = max2 - l;
          while (max2 > 0) {
            r.push(+v.slice(min2, max2));
            min2 -= l;
            if (min2 < 0)
              min2 = 0;
            max2 -= l;
          }
          trim(r);
          return new BigInteger(r, sign);
        }
        function parseNumberValue(v) {
          if (supportsNativeBigInt) {
            return new NativeBigInt(BigInt(v));
          }
          if (isPrecise(v)) {
            if (v !== truncate(v))
              throw new Error(v + " is not an integer.");
            return new SmallInteger(v);
          }
          return parseStringValue(v.toString());
        }
        function parseValue(v) {
          if (typeof v === "number") {
            return parseNumberValue(v);
          }
          if (typeof v === "string") {
            return parseStringValue(v);
          }
          if (typeof v === "bigint") {
            return new NativeBigInt(v);
          }
          return v;
        }
        for (var i = 0; i < 1e3; i++) {
          Integer[i] = parseValue(i);
          if (i > 0)
            Integer[-i] = parseValue(-i);
        }
        Integer.one = Integer[1];
        Integer.zero = Integer[0];
        Integer.minusOne = Integer[-1];
        Integer.max = max;
        Integer.min = min;
        Integer.gcd = gcd;
        Integer.lcm = lcm;
        Integer.isInstance = function(x) {
          return x instanceof BigInteger || x instanceof SmallInteger || x instanceof NativeBigInt;
        };
        Integer.randBetween = randBetween;
        Integer.fromArray = function(digits, base, isNegative) {
          return parseBaseFromArray(digits.map(parseValue), parseValue(base || 10), isNegative);
        };
        return Integer;
      }();
      if (module.hasOwnProperty("exports")) {
        module.exports = bigInt;
      }
      if (true) {
        !(__WEBPACK_AMD_DEFINE_RESULT__ = function() {
          return bigInt;
        }.call(exports, __webpack_require__2, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== void 0 && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
      }
    }
  ),
  /***/
  401: (
    /***/
    (__unused_webpack_module, exports, __webpack_require__2) => {
      const fs = __webpack_require__2(147);
      const bigInt = __webpack_require__2(282);
      const debug = false;
      exports.maxObjectSize = 100 * 1e3 * 1e3;
      exports.maxObjectCount = 32768;
      const EPOCH = 9783072e5;
      const UID = exports.UID = function(id) {
        this.UID = id;
      };
      const parseFile = exports.parseFile = function(fileNameOrBuffer, callback) {
        return new Promise(function(resolve, reject) {
          function tryParseBuffer(buffer) {
            let err = null;
            let result;
            try {
              result = parseBuffer(buffer);
              resolve(result);
            } catch (ex) {
              err = ex;
              reject(err);
            } finally {
              if (callback)
                callback(err, result);
            }
          }
          if (Buffer.isBuffer(fileNameOrBuffer)) {
            return tryParseBuffer(fileNameOrBuffer);
          }
          fs.readFile(fileNameOrBuffer, function(err, data) {
            if (err) {
              reject(err);
              return callback(err);
            }
            tryParseBuffer(data);
          });
        });
      };
      const parseBuffer = exports.parseBuffer = function(buffer) {
        const header = buffer.slice(0, "bplist".length).toString("utf8");
        if (header !== "bplist") {
          throw new Error("Invalid binary plist. Expected 'bplist' at offset 0.");
        }
        const trailer = buffer.slice(buffer.length - 32, buffer.length);
        const offsetSize = trailer.readUInt8(6);
        if (debug) {
          console.log("offsetSize: " + offsetSize);
        }
        const objectRefSize = trailer.readUInt8(7);
        if (debug) {
          console.log("objectRefSize: " + objectRefSize);
        }
        const numObjects = readUInt64BE(trailer, 8);
        if (debug) {
          console.log("numObjects: " + numObjects);
        }
        const topObject = readUInt64BE(trailer, 16);
        if (debug) {
          console.log("topObject: " + topObject);
        }
        const offsetTableOffset = readUInt64BE(trailer, 24);
        if (debug) {
          console.log("offsetTableOffset: " + offsetTableOffset);
        }
        if (numObjects > exports.maxObjectCount) {
          throw new Error("maxObjectCount exceeded");
        }
        const offsetTable = [];
        for (let i = 0; i < numObjects; i++) {
          const offsetBytes = buffer.slice(offsetTableOffset + i * offsetSize, offsetTableOffset + (i + 1) * offsetSize);
          offsetTable[i] = readUInt(offsetBytes, 0);
          if (debug) {
            console.log("Offset for Object #" + i + " is " + offsetTable[i] + " [" + offsetTable[i].toString(16) + "]");
          }
        }
        function parseObject(tableOffset) {
          const offset = offsetTable[tableOffset];
          const type = buffer[offset];
          const objType = (type & 240) >> 4;
          const objInfo = type & 15;
          switch (objType) {
            case 0:
              return parseSimple();
            case 1:
              return parseInteger();
            case 8:
              return parseUID();
            case 2:
              return parseReal();
            case 3:
              return parseDate();
            case 4:
              return parseData();
            case 5:
              return parsePlistString();
            case 6:
              return parsePlistString(true);
            case 10:
              return parseArray();
            case 13:
              return parseDictionary();
            default:
              throw new Error("Unhandled type 0x" + objType.toString(16));
          }
          function parseSimple() {
            switch (objInfo) {
              case 0:
                return null;
              case 8:
                return false;
              case 9:
                return true;
              case 15:
                return null;
              default:
                throw new Error("Unhandled simple type 0x" + objType.toString(16));
            }
          }
          function bufferToHexString(buffer2) {
            let str = "";
            let i;
            for (i = 0; i < buffer2.length; i++) {
              if (buffer2[i] != 0) {
                break;
              }
            }
            for (; i < buffer2.length; i++) {
              const part = "00" + buffer2[i].toString(16);
              str += part.substr(part.length - 2);
            }
            return str;
          }
          function parseInteger() {
            const length = Math.pow(2, objInfo);
            if (objInfo == 4) {
              const data = buffer.slice(offset + 1, offset + 1 + length);
              const str = bufferToHexString(data);
              return bigInt(str, 16);
            }
            if (objInfo == 3) {
              return buffer.readInt32BE(offset + 1);
            }
            if (length < exports.maxObjectSize) {
              return readUInt(buffer.slice(offset + 1, offset + 1 + length));
            }
            throw new Error("To little heap space available! Wanted to read " + length + " bytes, but only " + exports.maxObjectSize + " are available.");
          }
          function parseUID() {
            const length = objInfo + 1;
            if (length < exports.maxObjectSize) {
              return new UID(readUInt(buffer.slice(offset + 1, offset + 1 + length)));
            }
            throw new Error("To little heap space available! Wanted to read " + length + " bytes, but only " + exports.maxObjectSize + " are available.");
          }
          function parseReal() {
            const length = Math.pow(2, objInfo);
            if (length < exports.maxObjectSize) {
              const realBuffer = buffer.slice(offset + 1, offset + 1 + length);
              if (length === 4) {
                return realBuffer.readFloatBE(0);
              }
              if (length === 8) {
                return realBuffer.readDoubleBE(0);
              }
            } else {
              throw new Error("To little heap space available! Wanted to read " + length + " bytes, but only " + exports.maxObjectSize + " are available.");
            }
          }
          function parseDate() {
            if (objInfo != 3) {
              console.error("Unknown date type :" + objInfo + ". Parsing anyway...");
            }
            const dateBuffer = buffer.slice(offset + 1, offset + 9);
            return new Date(EPOCH + 1e3 * dateBuffer.readDoubleBE(0));
          }
          function parseData() {
            let dataoffset = 1;
            let length = objInfo;
            if (objInfo == 15) {
              const int_type = buffer[offset + 1];
              const intType = (int_type & 240) / 16;
              if (intType != 1) {
                console.error("0x4: UNEXPECTED LENGTH-INT TYPE! " + intType);
              }
              const intInfo = int_type & 15;
              const intLength = Math.pow(2, intInfo);
              dataoffset = 2 + intLength;
              if (intLength < 3) {
                length = readUInt(buffer.slice(offset + 2, offset + 2 + intLength));
              } else {
                length = readUInt(buffer.slice(offset + 2, offset + 2 + intLength));
              }
            }
            if (length < exports.maxObjectSize) {
              return buffer.slice(offset + dataoffset, offset + dataoffset + length);
            }
            throw new Error("To little heap space available! Wanted to read " + length + " bytes, but only " + exports.maxObjectSize + " are available.");
          }
          function parsePlistString(isUtf16) {
            isUtf16 = isUtf16 || 0;
            let enc = "utf8";
            let length = objInfo;
            let stroffset = 1;
            if (objInfo == 15) {
              const int_type = buffer[offset + 1];
              const intType = (int_type & 240) / 16;
              if (intType != 1) {
                console.err("UNEXPECTED LENGTH-INT TYPE! " + intType);
              }
              const intInfo = int_type & 15;
              const intLength = Math.pow(2, intInfo);
              stroffset = 2 + intLength;
              if (intLength < 3) {
                length = readUInt(buffer.slice(offset + 2, offset + 2 + intLength));
              } else {
                length = readUInt(buffer.slice(offset + 2, offset + 2 + intLength));
              }
            }
            length *= isUtf16 + 1;
            if (length < exports.maxObjectSize) {
              let plistString = Buffer.from(buffer.slice(offset + stroffset, offset + stroffset + length));
              if (isUtf16) {
                plistString = swapBytes(plistString);
                enc = "ucs2";
              }
              return plistString.toString(enc);
            }
            throw new Error("To little heap space available! Wanted to read " + length + " bytes, but only " + exports.maxObjectSize + " are available.");
          }
          function parseArray() {
            let length = objInfo;
            let arrayoffset = 1;
            if (objInfo == 15) {
              const int_type = buffer[offset + 1];
              const intType = (int_type & 240) / 16;
              if (intType != 1) {
                console.error("0xa: UNEXPECTED LENGTH-INT TYPE! " + intType);
              }
              const intInfo = int_type & 15;
              const intLength = Math.pow(2, intInfo);
              arrayoffset = 2 + intLength;
              if (intLength < 3) {
                length = readUInt(buffer.slice(offset + 2, offset + 2 + intLength));
              } else {
                length = readUInt(buffer.slice(offset + 2, offset + 2 + intLength));
              }
            }
            if (length * objectRefSize > exports.maxObjectSize) {
              throw new Error("To little heap space available!");
            }
            const array = [];
            for (let i = 0; i < length; i++) {
              const objRef = readUInt(buffer.slice(offset + arrayoffset + i * objectRefSize, offset + arrayoffset + (i + 1) * objectRefSize));
              array[i] = parseObject(objRef);
            }
            return array;
          }
          function parseDictionary() {
            let length = objInfo;
            let dictoffset = 1;
            if (objInfo == 15) {
              const int_type = buffer[offset + 1];
              const intType = (int_type & 240) / 16;
              if (intType != 1) {
                console.error("0xD: UNEXPECTED LENGTH-INT TYPE! " + intType);
              }
              const intInfo = int_type & 15;
              const intLength = Math.pow(2, intInfo);
              dictoffset = 2 + intLength;
              if (intLength < 3) {
                length = readUInt(buffer.slice(offset + 2, offset + 2 + intLength));
              } else {
                length = readUInt(buffer.slice(offset + 2, offset + 2 + intLength));
              }
            }
            if (length * 2 * objectRefSize > exports.maxObjectSize) {
              throw new Error("To little heap space available!");
            }
            if (debug) {
              console.log("Parsing dictionary #" + tableOffset);
            }
            const dict = {};
            for (let i = 0; i < length; i++) {
              const keyRef = readUInt(buffer.slice(offset + dictoffset + i * objectRefSize, offset + dictoffset + (i + 1) * objectRefSize));
              const valRef = readUInt(buffer.slice(offset + dictoffset + length * objectRefSize + i * objectRefSize, offset + dictoffset + length * objectRefSize + (i + 1) * objectRefSize));
              const key = parseObject(keyRef);
              const val = parseObject(valRef);
              if (debug) {
                console.log("  DICT #" + tableOffset + ": Mapped " + key + " to " + val);
              }
              dict[key] = val;
            }
            return dict;
          }
        }
        return [parseObject(topObject)];
      };
      function readUInt(buffer, start) {
        start = start || 0;
        let l = 0;
        for (let i = start; i < buffer.length; i++) {
          l <<= 8;
          l |= buffer[i] & 255;
        }
        return l;
      }
      function readUInt64BE(buffer, start) {
        const data = buffer.slice(start, start + 8);
        return data.readUInt32BE(4, 8);
      }
      function swapBytes(buffer) {
        const len = buffer.length;
        for (let i = 0; i < len; i += 2) {
          const a = buffer[i];
          buffer[i] = buffer[i + 1];
          buffer[i + 1] = a;
        }
        return buffer;
      }
    }
  ),
  /***/
  219: (
    /***/
    (module, __unused_webpack_exports, __webpack_require__2) => {
      const cp = __webpack_require__2(81);
      const parse = __webpack_require__2(177);
      const enoent = __webpack_require__2(95);
      function spawn(command, args, options) {
        const parsed = parse(command, args, options);
        const spawned = cp.spawn(parsed.command, parsed.args, parsed.options);
        enoent.hookChildProcess(spawned, parsed);
        return spawned;
      }
      function spawnSync(command, args, options) {
        const parsed = parse(command, args, options);
        const result = cp.spawnSync(parsed.command, parsed.args, parsed.options);
        result.error = result.error || enoent.verifyENOENTSync(result.status, parsed);
        return result;
      }
      module.exports = spawn;
      module.exports.spawn = spawn;
      module.exports.sync = spawnSync;
      module.exports._parse = parse;
      module.exports._enoent = enoent;
    }
  ),
  /***/
  95: (
    /***/
    (module) => {
      const isWin = process.platform === "win32";
      function notFoundError(original, syscall) {
        return Object.assign(new Error(`${syscall} ${original.command} ENOENT`), {
          code: "ENOENT",
          errno: "ENOENT",
          syscall: `${syscall} ${original.command}`,
          path: original.command,
          spawnargs: original.args
        });
      }
      function hookChildProcess(cp, parsed) {
        if (!isWin) {
          return;
        }
        const originalEmit = cp.emit;
        cp.emit = function(name, arg1) {
          if (name === "exit") {
            const err = verifyENOENT(arg1, parsed, "spawn");
            if (err) {
              return originalEmit.call(cp, "error", err);
            }
          }
          return originalEmit.apply(cp, arguments);
        };
      }
      function verifyENOENT(status, parsed) {
        if (isWin && status === 1 && !parsed.file) {
          return notFoundError(parsed.original, "spawn");
        }
        return null;
      }
      function verifyENOENTSync(status, parsed) {
        if (isWin && status === 1 && !parsed.file) {
          return notFoundError(parsed.original, "spawnSync");
        }
        return null;
      }
      module.exports = {
        hookChildProcess,
        verifyENOENT,
        verifyENOENTSync,
        notFoundError
      };
    }
  ),
  /***/
  177: (
    /***/
    (module, __unused_webpack_exports, __webpack_require__2) => {
      const path = __webpack_require__2(17);
      const resolveCommand = __webpack_require__2(650);
      const escape = __webpack_require__2(695);
      const readShebang = __webpack_require__2(210);
      const isWin = process.platform === "win32";
      const isExecutableRegExp = /\.(?:com|exe)$/i;
      const isCmdShimRegExp = /node_modules[\\/].bin[\\/][^\\/]+\.cmd$/i;
      function detectShebang(parsed) {
        parsed.file = resolveCommand(parsed);
        const shebang = parsed.file && readShebang(parsed.file);
        if (shebang) {
          parsed.args.unshift(parsed.file);
          parsed.command = shebang;
          return resolveCommand(parsed);
        }
        return parsed.file;
      }
      function parseNonShell(parsed) {
        if (!isWin) {
          return parsed;
        }
        const commandFile = detectShebang(parsed);
        const needsShell = !isExecutableRegExp.test(commandFile);
        if (parsed.options.forceShell || needsShell) {
          const needsDoubleEscapeMetaChars = isCmdShimRegExp.test(commandFile);
          parsed.command = path.normalize(parsed.command);
          parsed.command = escape.command(parsed.command);
          parsed.args = parsed.args.map((arg) => escape.argument(arg, needsDoubleEscapeMetaChars));
          const shellCommand = [parsed.command].concat(parsed.args).join(" ");
          parsed.args = ["/d", "/s", "/c", `"${shellCommand}"`];
          parsed.command = process.env.comspec || "cmd.exe";
          parsed.options.windowsVerbatimArguments = true;
        }
        return parsed;
      }
      function parse(command, args, options) {
        if (args && !Array.isArray(args)) {
          options = args;
          args = null;
        }
        args = args ? args.slice(0) : [];
        options = Object.assign({}, options);
        const parsed = {
          command,
          args,
          options,
          file: void 0,
          original: {
            command,
            args
          }
        };
        return options.shell ? parsed : parseNonShell(parsed);
      }
      module.exports = parse;
    }
  ),
  /***/
  695: (
    /***/
    (module) => {
      const metaCharsRegExp = /([()\][%!^"`<>&|;, *?])/g;
      function escapeCommand(arg) {
        arg = arg.replace(metaCharsRegExp, "^$1");
        return arg;
      }
      function escapeArgument(arg, doubleEscapeMetaChars) {
        arg = `${arg}`;
        arg = arg.replace(/(\\*)"/g, '$1$1\\"');
        arg = arg.replace(/(\\*)$/, "$1$1");
        arg = `"${arg}"`;
        arg = arg.replace(metaCharsRegExp, "^$1");
        if (doubleEscapeMetaChars) {
          arg = arg.replace(metaCharsRegExp, "^$1");
        }
        return arg;
      }
      module.exports.command = escapeCommand;
      module.exports.argument = escapeArgument;
    }
  ),
  /***/
  210: (
    /***/
    (module, __unused_webpack_exports, __webpack_require__2) => {
      const fs = __webpack_require__2(147);
      const shebangCommand = __webpack_require__2(953);
      function readShebang(command) {
        const size = 150;
        const buffer = Buffer.alloc(size);
        let fd;
        try {
          fd = fs.openSync(command, "r");
          fs.readSync(fd, buffer, 0, size, 0);
          fs.closeSync(fd);
        } catch (e) {
        }
        return shebangCommand(buffer.toString());
      }
      module.exports = readShebang;
    }
  ),
  /***/
  650: (
    /***/
    (module, __unused_webpack_exports, __webpack_require__2) => {
      const path = __webpack_require__2(17);
      const which = __webpack_require__2(45);
      const getPathKey = __webpack_require__2(408);
      function resolveCommandAttempt(parsed, withoutPathExt) {
        const env = parsed.options.env || process.env;
        const cwd = process.cwd();
        const hasCustomCwd = parsed.options.cwd != null;
        const shouldSwitchCwd = hasCustomCwd && process.chdir !== void 0 && !process.chdir.disabled;
        if (shouldSwitchCwd) {
          try {
            process.chdir(parsed.options.cwd);
          } catch (err) {
          }
        }
        let resolved;
        try {
          resolved = which.sync(parsed.command, {
            path: env[getPathKey({ env })],
            pathExt: withoutPathExt ? path.delimiter : void 0
          });
        } catch (e) {
        } finally {
          if (shouldSwitchCwd) {
            process.chdir(cwd);
          }
        }
        if (resolved) {
          resolved = path.resolve(hasCustomCwd ? parsed.options.cwd : "", resolved);
        }
        return resolved;
      }
      function resolveCommand(parsed) {
        return resolveCommandAttempt(parsed) || resolveCommandAttempt(parsed, true);
      }
      module.exports = resolveCommand;
    }
  ),
  /***/
  569: (
    /***/
    (module, __unused_webpack_exports, __webpack_require__2) => {
      const { PassThrough: PassThroughStream } = __webpack_require__2(781);
      module.exports = (options) => {
        options = { ...options };
        const { array } = options;
        let { encoding } = options;
        const isBuffer = encoding === "buffer";
        let objectMode = false;
        if (array) {
          objectMode = !(encoding || isBuffer);
        } else {
          encoding = encoding || "utf8";
        }
        if (isBuffer) {
          encoding = null;
        }
        const stream = new PassThroughStream({ objectMode });
        if (encoding) {
          stream.setEncoding(encoding);
        }
        let length = 0;
        const chunks = [];
        stream.on("data", (chunk) => {
          chunks.push(chunk);
          if (objectMode) {
            length = chunks.length;
          } else {
            length += chunk.length;
          }
        });
        stream.getBufferedValue = () => {
          if (array) {
            return chunks;
          }
          return isBuffer ? Buffer.concat(chunks, length) : chunks.join("");
        };
        stream.getBufferedLength = () => length;
        return stream;
      };
    }
  ),
  /***/
  505: (
    /***/
    (module, __unused_webpack_exports, __webpack_require__2) => {
      const { constants: BufferConstants } = __webpack_require__2(300);
      const stream = __webpack_require__2(781);
      const { promisify } = __webpack_require__2(837);
      const bufferStream = __webpack_require__2(569);
      const streamPipelinePromisified = promisify(stream.pipeline);
      class MaxBufferError extends Error {
        constructor() {
          super("maxBuffer exceeded");
          this.name = "MaxBufferError";
        }
      }
      async function getStream(inputStream, options) {
        if (!inputStream) {
          throw new Error("Expected a stream");
        }
        options = {
          maxBuffer: Infinity,
          ...options
        };
        const { maxBuffer } = options;
        const stream2 = bufferStream(options);
        await new Promise((resolve, reject) => {
          const rejectPromise = (error) => {
            if (error && stream2.getBufferedLength() <= BufferConstants.MAX_LENGTH) {
              error.bufferedData = stream2.getBufferedValue();
            }
            reject(error);
          };
          (async () => {
            try {
              await streamPipelinePromisified(inputStream, stream2);
              resolve();
            } catch (error) {
              rejectPromise(error);
            }
          })();
          stream2.on("data", () => {
            if (stream2.getBufferedLength() > maxBuffer) {
              rejectPromise(new MaxBufferError());
            }
          });
        });
        return stream2.getBufferedValue();
      }
      module.exports = getStream;
      module.exports.buffer = (stream2, options) => getStream(stream2, { ...options, encoding: "buffer" });
      module.exports.array = (stream2, options) => getStream(stream2, { ...options, array: true });
      module.exports.MaxBufferError = MaxBufferError;
    }
  ),
  /***/
  525: (
    /***/
    (module, __unused_webpack_exports, __webpack_require__2) => {
      const os = __webpack_require__2(37);
      const fs = __webpack_require__2(147);
      const isDocker = __webpack_require__2(5);
      const isWsl = () => {
        if (process.platform !== "linux") {
          return false;
        }
        if (os.release().toLowerCase().includes("microsoft")) {
          if (isDocker()) {
            return false;
          }
          return true;
        }
        try {
          return fs.readFileSync("/proc/version", "utf8").toLowerCase().includes("microsoft") ? !isDocker() : false;
        } catch (_) {
          return false;
        }
      };
      if (process.env.__IS_WSL_TEST__) {
        module.exports = isWsl;
      } else {
        module.exports = isWsl();
      }
    }
  ),
  /***/
  5: (
    /***/
    (module, __unused_webpack_exports, __webpack_require__2) => {
      const fs = __webpack_require__2(147);
      let isDocker;
      function hasDockerEnv() {
        try {
          fs.statSync("/.dockerenv");
          return true;
        } catch (_) {
          return false;
        }
      }
      function hasDockerCGroup() {
        try {
          return fs.readFileSync("/proc/self/cgroup", "utf8").includes("docker");
        } catch (_) {
          return false;
        }
      }
      module.exports = () => {
        if (isDocker === void 0) {
          isDocker = hasDockerEnv() || hasDockerCGroup();
        }
        return isDocker;
      };
    }
  ),
  /***/
  885: (
    /***/
    (module, __unused_webpack_exports, __webpack_require__2) => {
      var fs = __webpack_require__2(147);
      var core;
      if (process.platform === "win32" || global.TESTING_WINDOWS) {
        core = __webpack_require__2(723);
      } else {
        core = __webpack_require__2(509);
      }
      module.exports = isexe;
      isexe.sync = sync;
      function isexe(path, options, cb) {
        if (typeof options === "function") {
          cb = options;
          options = {};
        }
        if (!cb) {
          if (typeof Promise !== "function") {
            throw new TypeError("callback not provided");
          }
          return new Promise(function(resolve, reject) {
            isexe(path, options || {}, function(er, is) {
              if (er) {
                reject(er);
              } else {
                resolve(is);
              }
            });
          });
        }
        core(path, options || {}, function(er, is) {
          if (er) {
            if (er.code === "EACCES" || options && options.ignoreErrors) {
              er = null;
              is = false;
            }
          }
          cb(er, is);
        });
      }
      function sync(path, options) {
        try {
          return core.sync(path, options || {});
        } catch (er) {
          if (options && options.ignoreErrors || er.code === "EACCES") {
            return false;
          } else {
            throw er;
          }
        }
      }
    }
  ),
  /***/
  509: (
    /***/
    (module, __unused_webpack_exports, __webpack_require__2) => {
      module.exports = isexe;
      isexe.sync = sync;
      var fs = __webpack_require__2(147);
      function isexe(path, options, cb) {
        fs.stat(path, function(er, stat) {
          cb(er, er ? false : checkStat(stat, options));
        });
      }
      function sync(path, options) {
        return checkStat(fs.statSync(path), options);
      }
      function checkStat(stat, options) {
        return stat.isFile() && checkMode(stat, options);
      }
      function checkMode(stat, options) {
        var mod = stat.mode;
        var uid = stat.uid;
        var gid = stat.gid;
        var myUid = options.uid !== void 0 ? options.uid : process.getuid && process.getuid();
        var myGid = options.gid !== void 0 ? options.gid : process.getgid && process.getgid();
        var u = parseInt("100", 8);
        var g = parseInt("010", 8);
        var o = parseInt("001", 8);
        var ug = u | g;
        var ret = mod & o || mod & g && gid === myGid || mod & u && uid === myUid || mod & ug && myUid === 0;
        return ret;
      }
    }
  ),
  /***/
  723: (
    /***/
    (module, __unused_webpack_exports, __webpack_require__2) => {
      module.exports = isexe;
      isexe.sync = sync;
      var fs = __webpack_require__2(147);
      function checkPathExt(path, options) {
        var pathext = options.pathExt !== void 0 ? options.pathExt : process.env.PATHEXT;
        if (!pathext) {
          return true;
        }
        pathext = pathext.split(";");
        if (pathext.indexOf("") !== -1) {
          return true;
        }
        for (var i = 0; i < pathext.length; i++) {
          var p = pathext[i].toLowerCase();
          if (p && path.substr(-p.length).toLowerCase() === p) {
            return true;
          }
        }
        return false;
      }
      function checkStat(stat, path, options) {
        if (!stat.isSymbolicLink() && !stat.isFile()) {
          return false;
        }
        return checkPathExt(path, options);
      }
      function isexe(path, options, cb) {
        fs.stat(path, function(er, stat) {
          cb(er, er ? false : checkStat(stat, path, options));
        });
      }
      function sync(path, options) {
        return checkStat(fs.statSync(path), path, options);
      }
    }
  ),
  /***/
  770: (
    /***/
    (module, __unused_webpack_exports, __webpack_require__2) => {
      const { PassThrough } = __webpack_require__2(781);
      module.exports = function() {
        var sources = [];
        var output = new PassThrough({ objectMode: true });
        output.setMaxListeners(0);
        output.add = add;
        output.isEmpty = isEmpty;
        output.on("unpipe", remove);
        Array.prototype.slice.call(arguments).forEach(add);
        return output;
        function add(source) {
          if (Array.isArray(source)) {
            source.forEach(add);
            return this;
          }
          sources.push(source);
          source.once("end", remove.bind(null, source));
          source.once("error", output.emit.bind(output, "error"));
          source.pipe(output, { end: false });
          return this;
        }
        function isEmpty() {
          return sources.length == 0;
        }
        function remove(source) {
          sources = sources.filter(function(it) {
            return it !== source;
          });
          if (!sources.length && output.readable) {
            output.end();
          }
        }
      };
    }
  ),
  /***/
  408: (
    /***/
    (module) => {
      const pathKey = (options = {}) => {
        const environment = options.env || process.env;
        const platform = options.platform || process.platform;
        if (platform !== "win32") {
          return "PATH";
        }
        return Object.keys(environment).reverse().find((key) => key.toUpperCase() === "PATH") || "Path";
      };
      module.exports = pathKey;
      module.exports["default"] = pathKey;
    }
  ),
  /***/
  601: (
    /***/
    (module, __unused_webpack_exports, __webpack_require__2) => {
      const path = __webpack_require__2(17);
      const childProcess = __webpack_require__2(81);
      const crossSpawn = __webpack_require__2(219);
      const stripFinalNewline = __webpack_require__2(422);
      const npmRunPath = __webpack_require__2(616);
      const onetime = __webpack_require__2(860);
      const makeError = __webpack_require__2(750);
      const normalizeStdio = __webpack_require__2(334);
      const { spawnedKill, spawnedCancel, setupTimeout, validateTimeout, setExitHandler } = __webpack_require__2(232);
      const { handleInput, getSpawnedResult, makeAllStream, validateInputSync } = __webpack_require__2(611);
      const { mergePromise, getSpawnedPromise } = __webpack_require__2(36);
      const { joinCommand, parseCommand: parseCommand2, getEscapedCommand } = __webpack_require__2(75);
      const DEFAULT_MAX_BUFFER = 1e3 * 1e3 * 100;
      const getEnv = ({ env: envOption, extendEnv, preferLocal, localDir, execPath }) => {
        const env = extendEnv ? { ...process.env, ...envOption } : envOption;
        if (preferLocal) {
          return npmRunPath.env({ env, cwd: localDir, execPath });
        }
        return env;
      };
      const handleArguments = (file, args, options = {}) => {
        const parsed = crossSpawn._parse(file, args, options);
        file = parsed.command;
        args = parsed.args;
        options = parsed.options;
        options = {
          maxBuffer: DEFAULT_MAX_BUFFER,
          buffer: true,
          stripFinalNewline: true,
          extendEnv: true,
          preferLocal: false,
          localDir: options.cwd || process.cwd(),
          execPath: process.execPath,
          encoding: "utf8",
          reject: true,
          cleanup: true,
          all: false,
          windowsHide: true,
          ...options
        };
        options.env = getEnv(options);
        options.stdio = normalizeStdio(options);
        if (process.platform === "win32" && path.basename(file, ".exe") === "cmd") {
          args.unshift("/q");
        }
        return { file, args, options, parsed };
      };
      const handleOutput = (options, value, error) => {
        if (typeof value !== "string" && !Buffer.isBuffer(value)) {
          return error === void 0 ? void 0 : "";
        }
        if (options.stripFinalNewline) {
          return stripFinalNewline(value);
        }
        return value;
      };
      const execa2 = (file, args, options) => {
        const parsed = handleArguments(file, args, options);
        const command = joinCommand(file, args);
        const escapedCommand = getEscapedCommand(file, args);
        validateTimeout(parsed.options);
        let spawned;
        try {
          spawned = childProcess.spawn(parsed.file, parsed.args, parsed.options);
        } catch (error) {
          const dummySpawned = new childProcess.ChildProcess();
          const errorPromise = Promise.reject(makeError({
            error,
            stdout: "",
            stderr: "",
            all: "",
            command,
            escapedCommand,
            parsed,
            timedOut: false,
            isCanceled: false,
            killed: false
          }));
          return mergePromise(dummySpawned, errorPromise);
        }
        const spawnedPromise = getSpawnedPromise(spawned);
        const timedPromise = setupTimeout(spawned, parsed.options, spawnedPromise);
        const processDone = setExitHandler(spawned, parsed.options, timedPromise);
        const context = { isCanceled: false };
        spawned.kill = spawnedKill.bind(null, spawned.kill.bind(spawned));
        spawned.cancel = spawnedCancel.bind(null, spawned, context);
        const handlePromise = async () => {
          const [{ error, exitCode, signal, timedOut }, stdoutResult, stderrResult, allResult] = await getSpawnedResult(spawned, parsed.options, processDone);
          const stdout = handleOutput(parsed.options, stdoutResult);
          const stderr = handleOutput(parsed.options, stderrResult);
          const all = handleOutput(parsed.options, allResult);
          if (error || exitCode !== 0 || signal !== null) {
            const returnedError = makeError({
              error,
              exitCode,
              signal,
              stdout,
              stderr,
              all,
              command,
              escapedCommand,
              parsed,
              timedOut,
              isCanceled: context.isCanceled,
              killed: spawned.killed
            });
            if (!parsed.options.reject) {
              return returnedError;
            }
            throw returnedError;
          }
          return {
            command,
            escapedCommand,
            exitCode: 0,
            stdout,
            stderr,
            all,
            failed: false,
            timedOut: false,
            isCanceled: false,
            killed: false
          };
        };
        const handlePromiseOnce = onetime(handlePromise);
        handleInput(spawned, parsed.options.input);
        spawned.all = makeAllStream(spawned, parsed.options);
        return mergePromise(spawned, handlePromiseOnce);
      };
      module.exports = execa2;
      module.exports.sync = (file, args, options) => {
        const parsed = handleArguments(file, args, options);
        const command = joinCommand(file, args);
        const escapedCommand = getEscapedCommand(file, args);
        validateInputSync(parsed.options);
        let result;
        try {
          result = childProcess.spawnSync(parsed.file, parsed.args, parsed.options);
        } catch (error) {
          throw makeError({
            error,
            stdout: "",
            stderr: "",
            all: "",
            command,
            escapedCommand,
            parsed,
            timedOut: false,
            isCanceled: false,
            killed: false
          });
        }
        const stdout = handleOutput(parsed.options, result.stdout, result.error);
        const stderr = handleOutput(parsed.options, result.stderr, result.error);
        if (result.error || result.status !== 0 || result.signal !== null) {
          const error = makeError({
            stdout,
            stderr,
            error: result.error,
            signal: result.signal,
            exitCode: result.status,
            command,
            escapedCommand,
            parsed,
            timedOut: result.error && result.error.code === "ETIMEDOUT",
            isCanceled: false,
            killed: result.signal !== null
          });
          if (!parsed.options.reject) {
            return error;
          }
          throw error;
        }
        return {
          command,
          escapedCommand,
          exitCode: 0,
          stdout,
          stderr,
          failed: false,
          timedOut: false,
          isCanceled: false,
          killed: false
        };
      };
      module.exports.command = (command, options) => {
        const [file, ...args] = parseCommand2(command);
        return execa2(file, args, options);
      };
      module.exports.commandSync = (command, options) => {
        const [file, ...args] = parseCommand2(command);
        return execa2.sync(file, args, options);
      };
      module.exports.node = (scriptPath, args, options = {}) => {
        if (args && !Array.isArray(args) && typeof args === "object") {
          options = args;
          args = [];
        }
        const stdio = normalizeStdio.node(options);
        const defaultExecArgv = process.execArgv.filter((arg) => !arg.startsWith("--inspect"));
        const {
          nodePath = process.execPath,
          nodeOptions = defaultExecArgv
        } = options;
        return execa2(
          nodePath,
          [
            ...nodeOptions,
            scriptPath,
            ...Array.isArray(args) ? args : []
          ],
          {
            ...options,
            stdin: void 0,
            stdout: void 0,
            stderr: void 0,
            stdio,
            shell: false
          }
        );
      };
    }
  ),
  /***/
  75: (
    /***/
    (module) => {
      const normalizeArgs = (file, args = []) => {
        if (!Array.isArray(args)) {
          return [file];
        }
        return [file, ...args];
      };
      const NO_ESCAPE_REGEXP = /^[\w.-]+$/;
      const DOUBLE_QUOTES_REGEXP = /"/g;
      const escapeArg = (arg) => {
        if (typeof arg !== "string" || NO_ESCAPE_REGEXP.test(arg)) {
          return arg;
        }
        return `"${arg.replace(DOUBLE_QUOTES_REGEXP, '\\"')}"`;
      };
      const joinCommand = (file, args) => {
        return normalizeArgs(file, args).join(" ");
      };
      const getEscapedCommand = (file, args) => {
        return normalizeArgs(file, args).map((arg) => escapeArg(arg)).join(" ");
      };
      const SPACES_REGEXP = / +/g;
      const parseCommand2 = (command) => {
        const tokens = [];
        for (const token of command.trim().split(SPACES_REGEXP)) {
          const previousToken = tokens[tokens.length - 1];
          if (previousToken && previousToken.endsWith("\\")) {
            tokens[tokens.length - 1] = `${previousToken.slice(0, -1)} ${token}`;
          } else {
            tokens.push(token);
          }
        }
        return tokens;
      };
      module.exports = {
        joinCommand,
        getEscapedCommand,
        parseCommand: parseCommand2
      };
    }
  ),
  /***/
  750: (
    /***/
    (module, __unused_webpack_exports, __webpack_require__2) => {
      const { signalsByName } = __webpack_require__2(922);
      const getErrorPrefix = ({ timedOut, timeout, errorCode, signal, signalDescription, exitCode, isCanceled }) => {
        if (timedOut) {
          return `timed out after ${timeout} milliseconds`;
        }
        if (isCanceled) {
          return "was canceled";
        }
        if (errorCode !== void 0) {
          return `failed with ${errorCode}`;
        }
        if (signal !== void 0) {
          return `was killed with ${signal} (${signalDescription})`;
        }
        if (exitCode !== void 0) {
          return `failed with exit code ${exitCode}`;
        }
        return "failed";
      };
      const makeError = ({
        stdout,
        stderr,
        all,
        error,
        signal,
        exitCode,
        command,
        escapedCommand,
        timedOut,
        isCanceled,
        killed,
        parsed: { options: { timeout } }
      }) => {
        exitCode = exitCode === null ? void 0 : exitCode;
        signal = signal === null ? void 0 : signal;
        const signalDescription = signal === void 0 ? void 0 : signalsByName[signal].description;
        const errorCode = error && error.code;
        const prefix = getErrorPrefix({ timedOut, timeout, errorCode, signal, signalDescription, exitCode, isCanceled });
        const execaMessage = `Command ${prefix}: ${command}`;
        const isError = Object.prototype.toString.call(error) === "[object Error]";
        const shortMessage = isError ? `${execaMessage}
${error.message}` : execaMessage;
        const message = [shortMessage, stderr, stdout].filter(Boolean).join("\n");
        if (isError) {
          error.originalMessage = error.message;
          error.message = message;
        } else {
          error = new Error(message);
        }
        error.shortMessage = shortMessage;
        error.command = command;
        error.escapedCommand = escapedCommand;
        error.exitCode = exitCode;
        error.signal = signal;
        error.signalDescription = signalDescription;
        error.stdout = stdout;
        error.stderr = stderr;
        if (all !== void 0) {
          error.all = all;
        }
        if ("bufferedData" in error) {
          delete error.bufferedData;
        }
        error.failed = true;
        error.timedOut = Boolean(timedOut);
        error.isCanceled = isCanceled;
        error.killed = killed && !timedOut;
        return error;
      };
      module.exports = makeError;
    }
  ),
  /***/
  232: (
    /***/
    (module, __unused_webpack_exports, __webpack_require__2) => {
      const os = __webpack_require__2(37);
      const onExit = __webpack_require__2(281);
      const DEFAULT_FORCE_KILL_TIMEOUT = 1e3 * 5;
      const spawnedKill = (kill, signal = "SIGTERM", options = {}) => {
        const killResult = kill(signal);
        setKillTimeout(kill, signal, options, killResult);
        return killResult;
      };
      const setKillTimeout = (kill, signal, options, killResult) => {
        if (!shouldForceKill(signal, options, killResult)) {
          return;
        }
        const timeout = getForceKillAfterTimeout(options);
        const t = setTimeout(() => {
          kill("SIGKILL");
        }, timeout);
        if (t.unref) {
          t.unref();
        }
      };
      const shouldForceKill = (signal, { forceKillAfterTimeout }, killResult) => {
        return isSigterm(signal) && forceKillAfterTimeout !== false && killResult;
      };
      const isSigterm = (signal) => {
        return signal === os.constants.signals.SIGTERM || typeof signal === "string" && signal.toUpperCase() === "SIGTERM";
      };
      const getForceKillAfterTimeout = ({ forceKillAfterTimeout = true }) => {
        if (forceKillAfterTimeout === true) {
          return DEFAULT_FORCE_KILL_TIMEOUT;
        }
        if (!Number.isFinite(forceKillAfterTimeout) || forceKillAfterTimeout < 0) {
          throw new TypeError(`Expected the \`forceKillAfterTimeout\` option to be a non-negative integer, got \`${forceKillAfterTimeout}\` (${typeof forceKillAfterTimeout})`);
        }
        return forceKillAfterTimeout;
      };
      const spawnedCancel = (spawned, context) => {
        const killResult = spawned.kill();
        if (killResult) {
          context.isCanceled = true;
        }
      };
      const timeoutKill = (spawned, signal, reject) => {
        spawned.kill(signal);
        reject(Object.assign(new Error("Timed out"), { timedOut: true, signal }));
      };
      const setupTimeout = (spawned, { timeout, killSignal = "SIGTERM" }, spawnedPromise) => {
        if (timeout === 0 || timeout === void 0) {
          return spawnedPromise;
        }
        let timeoutId;
        const timeoutPromise = new Promise((resolve, reject) => {
          timeoutId = setTimeout(() => {
            timeoutKill(spawned, killSignal, reject);
          }, timeout);
        });
        const safeSpawnedPromise = spawnedPromise.finally(() => {
          clearTimeout(timeoutId);
        });
        return Promise.race([timeoutPromise, safeSpawnedPromise]);
      };
      const validateTimeout = ({ timeout }) => {
        if (timeout !== void 0 && (!Number.isFinite(timeout) || timeout < 0)) {
          throw new TypeError(`Expected the \`timeout\` option to be a non-negative integer, got \`${timeout}\` (${typeof timeout})`);
        }
      };
      const setExitHandler = async (spawned, { cleanup, detached }, timedPromise) => {
        if (!cleanup || detached) {
          return timedPromise;
        }
        const removeExitHandler = onExit(() => {
          spawned.kill();
        });
        return timedPromise.finally(() => {
          removeExitHandler();
        });
      };
      module.exports = {
        spawnedKill,
        spawnedCancel,
        setupTimeout,
        validateTimeout,
        setExitHandler
      };
    }
  ),
  /***/
  36: (
    /***/
    (module) => {
      const nativePromisePrototype = (async () => {
      })().constructor.prototype;
      const descriptors = ["then", "catch", "finally"].map((property) => [
        property,
        Reflect.getOwnPropertyDescriptor(nativePromisePrototype, property)
      ]);
      const mergePromise = (spawned, promise) => {
        for (const [property, descriptor] of descriptors) {
          const value = typeof promise === "function" ? (...args) => Reflect.apply(descriptor.value, promise(), args) : descriptor.value.bind(promise);
          Reflect.defineProperty(spawned, property, { ...descriptor, value });
        }
        return spawned;
      };
      const getSpawnedPromise = (spawned) => {
        return new Promise((resolve, reject) => {
          spawned.on("exit", (exitCode, signal) => {
            resolve({ exitCode, signal });
          });
          spawned.on("error", (error) => {
            reject(error);
          });
          if (spawned.stdin) {
            spawned.stdin.on("error", (error) => {
              reject(error);
            });
          }
        });
      };
      module.exports = {
        mergePromise,
        getSpawnedPromise
      };
    }
  ),
  /***/
  334: (
    /***/
    (module) => {
      const aliases = ["stdin", "stdout", "stderr"];
      const hasAlias = (options) => aliases.some((alias) => options[alias] !== void 0);
      const normalizeStdio = (options) => {
        if (!options) {
          return;
        }
        const { stdio } = options;
        if (stdio === void 0) {
          return aliases.map((alias) => options[alias]);
        }
        if (hasAlias(options)) {
          throw new Error(`It's not possible to provide \`stdio\` in combination with one of ${aliases.map((alias) => `\`${alias}\``).join(", ")}`);
        }
        if (typeof stdio === "string") {
          return stdio;
        }
        if (!Array.isArray(stdio)) {
          throw new TypeError(`Expected \`stdio\` to be of type \`string\` or \`Array\`, got \`${typeof stdio}\``);
        }
        const length = Math.max(stdio.length, aliases.length);
        return Array.from({ length }, (value, index) => stdio[index]);
      };
      module.exports = normalizeStdio;
      module.exports.node = (options) => {
        const stdio = normalizeStdio(options);
        if (stdio === "ipc") {
          return "ipc";
        }
        if (stdio === void 0 || typeof stdio === "string") {
          return [stdio, stdio, stdio, "ipc"];
        }
        if (stdio.includes("ipc")) {
          return stdio;
        }
        return [...stdio, "ipc"];
      };
    }
  ),
  /***/
  611: (
    /***/
    (module, __unused_webpack_exports, __webpack_require__2) => {
      const isStream = __webpack_require__2(753);
      const getStream = __webpack_require__2(505);
      const mergeStream = __webpack_require__2(770);
      const handleInput = (spawned, input) => {
        if (input === void 0 || spawned.stdin === void 0) {
          return;
        }
        if (isStream(input)) {
          input.pipe(spawned.stdin);
        } else {
          spawned.stdin.end(input);
        }
      };
      const makeAllStream = (spawned, { all }) => {
        if (!all || !spawned.stdout && !spawned.stderr) {
          return;
        }
        const mixed = mergeStream();
        if (spawned.stdout) {
          mixed.add(spawned.stdout);
        }
        if (spawned.stderr) {
          mixed.add(spawned.stderr);
        }
        return mixed;
      };
      const getBufferedData = async (stream, streamPromise) => {
        if (!stream) {
          return;
        }
        stream.destroy();
        try {
          return await streamPromise;
        } catch (error) {
          return error.bufferedData;
        }
      };
      const getStreamPromise = (stream, { encoding, buffer, maxBuffer }) => {
        if (!stream || !buffer) {
          return;
        }
        if (encoding) {
          return getStream(stream, { encoding, maxBuffer });
        }
        return getStream.buffer(stream, { maxBuffer });
      };
      const getSpawnedResult = async ({ stdout, stderr, all }, { encoding, buffer, maxBuffer }, processDone) => {
        const stdoutPromise = getStreamPromise(stdout, { encoding, buffer, maxBuffer });
        const stderrPromise = getStreamPromise(stderr, { encoding, buffer, maxBuffer });
        const allPromise = getStreamPromise(all, { encoding, buffer, maxBuffer: maxBuffer * 2 });
        try {
          return await Promise.all([processDone, stdoutPromise, stderrPromise, allPromise]);
        } catch (error) {
          return Promise.all([
            { error, signal: error.signal, timedOut: error.timedOut },
            getBufferedData(stdout, stdoutPromise),
            getBufferedData(stderr, stderrPromise),
            getBufferedData(all, allPromise)
          ]);
        }
      };
      const validateInputSync = ({ input }) => {
        if (isStream(input)) {
          throw new TypeError("The `input` option cannot be a stream in sync mode");
        }
      };
      module.exports = {
        handleInput,
        makeAllStream,
        getSpawnedResult,
        validateInputSync
      };
    }
  ),
  /***/
  80: (
    /***/
    (__unused_webpack_module, exports) => {
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.SIGNALS = void 0;
      const SIGNALS = [
        {
          name: "SIGHUP",
          number: 1,
          action: "terminate",
          description: "Terminal closed",
          standard: "posix"
        },
        {
          name: "SIGINT",
          number: 2,
          action: "terminate",
          description: "User interruption with CTRL-C",
          standard: "ansi"
        },
        {
          name: "SIGQUIT",
          number: 3,
          action: "core",
          description: "User interruption with CTRL-\\",
          standard: "posix"
        },
        {
          name: "SIGILL",
          number: 4,
          action: "core",
          description: "Invalid machine instruction",
          standard: "ansi"
        },
        {
          name: "SIGTRAP",
          number: 5,
          action: "core",
          description: "Debugger breakpoint",
          standard: "posix"
        },
        {
          name: "SIGABRT",
          number: 6,
          action: "core",
          description: "Aborted",
          standard: "ansi"
        },
        {
          name: "SIGIOT",
          number: 6,
          action: "core",
          description: "Aborted",
          standard: "bsd"
        },
        {
          name: "SIGBUS",
          number: 7,
          action: "core",
          description: "Bus error due to misaligned, non-existing address or paging error",
          standard: "bsd"
        },
        {
          name: "SIGEMT",
          number: 7,
          action: "terminate",
          description: "Command should be emulated but is not implemented",
          standard: "other"
        },
        {
          name: "SIGFPE",
          number: 8,
          action: "core",
          description: "Floating point arithmetic error",
          standard: "ansi"
        },
        {
          name: "SIGKILL",
          number: 9,
          action: "terminate",
          description: "Forced termination",
          standard: "posix",
          forced: true
        },
        {
          name: "SIGUSR1",
          number: 10,
          action: "terminate",
          description: "Application-specific signal",
          standard: "posix"
        },
        {
          name: "SIGSEGV",
          number: 11,
          action: "core",
          description: "Segmentation fault",
          standard: "ansi"
        },
        {
          name: "SIGUSR2",
          number: 12,
          action: "terminate",
          description: "Application-specific signal",
          standard: "posix"
        },
        {
          name: "SIGPIPE",
          number: 13,
          action: "terminate",
          description: "Broken pipe or socket",
          standard: "posix"
        },
        {
          name: "SIGALRM",
          number: 14,
          action: "terminate",
          description: "Timeout or timer",
          standard: "posix"
        },
        {
          name: "SIGTERM",
          number: 15,
          action: "terminate",
          description: "Termination",
          standard: "ansi"
        },
        {
          name: "SIGSTKFLT",
          number: 16,
          action: "terminate",
          description: "Stack is empty or overflowed",
          standard: "other"
        },
        {
          name: "SIGCHLD",
          number: 17,
          action: "ignore",
          description: "Child process terminated, paused or unpaused",
          standard: "posix"
        },
        {
          name: "SIGCLD",
          number: 17,
          action: "ignore",
          description: "Child process terminated, paused or unpaused",
          standard: "other"
        },
        {
          name: "SIGCONT",
          number: 18,
          action: "unpause",
          description: "Unpaused",
          standard: "posix",
          forced: true
        },
        {
          name: "SIGSTOP",
          number: 19,
          action: "pause",
          description: "Paused",
          standard: "posix",
          forced: true
        },
        {
          name: "SIGTSTP",
          number: 20,
          action: "pause",
          description: 'Paused using CTRL-Z or "suspend"',
          standard: "posix"
        },
        {
          name: "SIGTTIN",
          number: 21,
          action: "pause",
          description: "Background process cannot read terminal input",
          standard: "posix"
        },
        {
          name: "SIGBREAK",
          number: 21,
          action: "terminate",
          description: "User interruption with CTRL-BREAK",
          standard: "other"
        },
        {
          name: "SIGTTOU",
          number: 22,
          action: "pause",
          description: "Background process cannot write to terminal output",
          standard: "posix"
        },
        {
          name: "SIGURG",
          number: 23,
          action: "ignore",
          description: "Socket received out-of-band data",
          standard: "bsd"
        },
        {
          name: "SIGXCPU",
          number: 24,
          action: "core",
          description: "Process timed out",
          standard: "bsd"
        },
        {
          name: "SIGXFSZ",
          number: 25,
          action: "core",
          description: "File too big",
          standard: "bsd"
        },
        {
          name: "SIGVTALRM",
          number: 26,
          action: "terminate",
          description: "Timeout or timer",
          standard: "bsd"
        },
        {
          name: "SIGPROF",
          number: 27,
          action: "terminate",
          description: "Timeout or timer",
          standard: "bsd"
        },
        {
          name: "SIGWINCH",
          number: 28,
          action: "ignore",
          description: "Terminal window size changed",
          standard: "bsd"
        },
        {
          name: "SIGIO",
          number: 29,
          action: "terminate",
          description: "I/O is available",
          standard: "other"
        },
        {
          name: "SIGPOLL",
          number: 29,
          action: "terminate",
          description: "Watched event",
          standard: "other"
        },
        {
          name: "SIGINFO",
          number: 29,
          action: "ignore",
          description: "Request for process information",
          standard: "other"
        },
        {
          name: "SIGPWR",
          number: 30,
          action: "terminate",
          description: "Device running out of power",
          standard: "systemv"
        },
        {
          name: "SIGSYS",
          number: 31,
          action: "core",
          description: "Invalid system call",
          standard: "other"
        },
        {
          name: "SIGUNUSED",
          number: 31,
          action: "terminate",
          description: "Invalid system call",
          standard: "other"
        }
      ];
      exports.SIGNALS = SIGNALS;
    }
  ),
  /***/
  922: (
    /***/
    (__unused_webpack_module, exports, __webpack_require__2) => {
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.signalsByNumber = exports.signalsByName = void 0;
      var _os = __webpack_require__2(37);
      var _signals = __webpack_require__2(113);
      var _realtime = __webpack_require__2(107);
      const getSignalsByName = function() {
        const signals = (0, _signals.getSignals)();
        return signals.reduce(getSignalByName, {});
      };
      const getSignalByName = function(signalByNameMemo, { name, number, description, supported, action, forced, standard }) {
        return {
          ...signalByNameMemo,
          [name]: { name, number, description, supported, action, forced, standard }
        };
      };
      const signalsByName = getSignalsByName();
      exports.signalsByName = signalsByName;
      const getSignalsByNumber = function() {
        const signals = (0, _signals.getSignals)();
        const length = _realtime.SIGRTMAX + 1;
        const signalsA = Array.from({ length }, (value, number) => getSignalByNumber(number, signals));
        return Object.assign({}, ...signalsA);
      };
      const getSignalByNumber = function(number, signals) {
        const signal = findSignalByNumber(number, signals);
        if (signal === void 0) {
          return {};
        }
        const { name, description, supported, action, forced, standard } = signal;
        return {
          [number]: {
            name,
            number,
            description,
            supported,
            action,
            forced,
            standard
          }
        };
      };
      const findSignalByNumber = function(number, signals) {
        const signal = signals.find(({ name }) => _os.constants.signals[name] === number);
        if (signal !== void 0) {
          return signal;
        }
        return signals.find((signalA) => signalA.number === number);
      };
      const signalsByNumber = getSignalsByNumber();
      exports.signalsByNumber = signalsByNumber;
    }
  ),
  /***/
  107: (
    /***/
    (__unused_webpack_module, exports) => {
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.SIGRTMAX = exports.getRealtimeSignals = void 0;
      const getRealtimeSignals = function() {
        const length = SIGRTMAX - SIGRTMIN + 1;
        return Array.from({ length }, getRealtimeSignal);
      };
      exports.getRealtimeSignals = getRealtimeSignals;
      const getRealtimeSignal = function(value, index) {
        return {
          name: `SIGRT${index + 1}`,
          number: SIGRTMIN + index,
          action: "terminate",
          description: "Application-specific signal (realtime)",
          standard: "posix"
        };
      };
      const SIGRTMIN = 34;
      const SIGRTMAX = 64;
      exports.SIGRTMAX = SIGRTMAX;
    }
  ),
  /***/
  113: (
    /***/
    (__unused_webpack_module, exports, __webpack_require__2) => {
      Object.defineProperty(exports, "__esModule", { value: true });
      exports.getSignals = void 0;
      var _os = __webpack_require__2(37);
      var _core = __webpack_require__2(80);
      var _realtime = __webpack_require__2(107);
      const getSignals = function() {
        const realtimeSignals = (0, _realtime.getRealtimeSignals)();
        const signals = [..._core.SIGNALS, ...realtimeSignals].map(normalizeSignal);
        return signals;
      };
      exports.getSignals = getSignals;
      const normalizeSignal = function({
        name,
        number: defaultNumber,
        description,
        action,
        forced = false,
        standard
      }) {
        const {
          signals: { [name]: constantSignal }
        } = _os.constants;
        const supported = constantSignal !== void 0;
        const number = supported ? constantSignal : defaultNumber;
        return { name, number, description, supported, action, forced, standard };
      };
    }
  ),
  /***/
  753: (
    /***/
    (module) => {
      const isStream = (stream) => stream !== null && typeof stream === "object" && typeof stream.pipe === "function";
      isStream.writable = (stream) => isStream(stream) && stream.writable !== false && typeof stream._write === "function" && typeof stream._writableState === "object";
      isStream.readable = (stream) => isStream(stream) && stream.readable !== false && typeof stream._read === "function" && typeof stream._readableState === "object";
      isStream.duplex = (stream) => isStream.writable(stream) && isStream.readable(stream);
      isStream.transform = (stream) => isStream.duplex(stream) && typeof stream._transform === "function";
      module.exports = isStream;
    }
  ),
  /***/
  912: (
    /***/
    (module) => {
      const mimicFn = (to, from) => {
        for (const prop of Reflect.ownKeys(from)) {
          Object.defineProperty(to, prop, Object.getOwnPropertyDescriptor(from, prop));
        }
        return to;
      };
      module.exports = mimicFn;
      module.exports["default"] = mimicFn;
    }
  ),
  /***/
  616: (
    /***/
    (module, __unused_webpack_exports, __webpack_require__2) => {
      const path = __webpack_require__2(17);
      const pathKey = __webpack_require__2(408);
      const npmRunPath = (options) => {
        options = {
          cwd: process.cwd(),
          path: process.env[pathKey()],
          execPath: process.execPath,
          ...options
        };
        let previous;
        let cwdPath = path.resolve(options.cwd);
        const result = [];
        while (previous !== cwdPath) {
          result.push(path.join(cwdPath, "node_modules/.bin"));
          previous = cwdPath;
          cwdPath = path.resolve(cwdPath, "..");
        }
        const execPathDir = path.resolve(options.cwd, options.execPath, "..");
        result.push(execPathDir);
        return result.concat(options.path).join(path.delimiter);
      };
      module.exports = npmRunPath;
      module.exports["default"] = npmRunPath;
      module.exports.env = (options) => {
        options = {
          env: process.env,
          ...options
        };
        const env = { ...options.env };
        const path2 = pathKey({ env });
        options.path = env[path2];
        env[path2] = module.exports(options);
        return env;
      };
    }
  ),
  /***/
  860: (
    /***/
    (module, __unused_webpack_exports, __webpack_require__2) => {
      const mimicFn = __webpack_require__2(912);
      const calledFunctions = /* @__PURE__ */ new WeakMap();
      const onetime = (function_, options = {}) => {
        if (typeof function_ !== "function") {
          throw new TypeError("Expected a function");
        }
        let returnValue;
        let callCount = 0;
        const functionName = function_.displayName || function_.name || "<anonymous>";
        const onetime2 = function(...arguments_) {
          calledFunctions.set(onetime2, ++callCount);
          if (callCount === 1) {
            returnValue = function_.apply(this, arguments_);
            function_ = null;
          } else if (options.throw === true) {
            throw new Error(`Function \`${functionName}\` can only be called once`);
          }
          return returnValue;
        };
        mimicFn(onetime2, function_);
        calledFunctions.set(onetime2, callCount);
        return onetime2;
      };
      module.exports = onetime;
      module.exports["default"] = onetime;
      module.exports.callCount = (function_) => {
        if (!calledFunctions.has(function_)) {
          throw new Error(`The given function \`${function_.name}\` is not wrapped by the \`onetime\` package`);
        }
        return calledFunctions.get(function_);
      };
    }
  ),
  /***/
  422: (
    /***/
    (module) => {
      module.exports = (input) => {
        const LF = typeof input === "string" ? "\n" : "\n".charCodeAt();
        const CR = typeof input === "string" ? "\r" : "\r".charCodeAt();
        if (input[input.length - 1] === LF) {
          input = input.slice(0, input.length - 1);
        }
        if (input[input.length - 1] === CR) {
          input = input.slice(0, input.length - 1);
        }
        return input;
      };
    }
  ),
  /***/
  953: (
    /***/
    (module, __unused_webpack_exports, __webpack_require__2) => {
      const shebangRegex = __webpack_require__2(648);
      module.exports = (string = "") => {
        const match = string.match(shebangRegex);
        if (!match) {
          return null;
        }
        const [path, argument] = match[0].replace(/#! ?/, "").split(" ");
        const binary = path.split("/").pop();
        if (binary === "env") {
          return argument;
        }
        return argument ? `${binary} ${argument}` : binary;
      };
    }
  ),
  /***/
  648: (
    /***/
    (module) => {
      module.exports = /^#!(.*)/;
    }
  ),
  /***/
  281: (
    /***/
    (module, __unused_webpack_exports, __webpack_require__2) => {
      var process2 = global.process;
      const processOk = function(process3) {
        return process3 && typeof process3 === "object" && typeof process3.removeListener === "function" && typeof process3.emit === "function" && typeof process3.reallyExit === "function" && typeof process3.listeners === "function" && typeof process3.kill === "function" && typeof process3.pid === "number" && typeof process3.on === "function";
      };
      if (!processOk(process2)) {
        module.exports = function() {
          return function() {
          };
        };
      } else {
        var assert = __webpack_require__2(491);
        var signals = __webpack_require__2(371);
        var isWin = /^win/i.test(process2.platform);
        var EE = __webpack_require__2(361);
        if (typeof EE !== "function") {
          EE = EE.EventEmitter;
        }
        var emitter;
        if (process2.__signal_exit_emitter__) {
          emitter = process2.__signal_exit_emitter__;
        } else {
          emitter = process2.__signal_exit_emitter__ = new EE();
          emitter.count = 0;
          emitter.emitted = {};
        }
        if (!emitter.infinite) {
          emitter.setMaxListeners(Infinity);
          emitter.infinite = true;
        }
        module.exports = function(cb, opts) {
          if (!processOk(global.process)) {
            return function() {
            };
          }
          assert.equal(typeof cb, "function", "a callback must be provided for exit handler");
          if (loaded === false) {
            load();
          }
          var ev = "exit";
          if (opts && opts.alwaysLast) {
            ev = "afterexit";
          }
          var remove = function() {
            emitter.removeListener(ev, cb);
            if (emitter.listeners("exit").length === 0 && emitter.listeners("afterexit").length === 0) {
              unload();
            }
          };
          emitter.on(ev, cb);
          return remove;
        };
        var unload = function unload2() {
          if (!loaded || !processOk(global.process)) {
            return;
          }
          loaded = false;
          signals.forEach(function(sig) {
            try {
              process2.removeListener(sig, sigListeners[sig]);
            } catch (er) {
            }
          });
          process2.emit = originalProcessEmit;
          process2.reallyExit = originalProcessReallyExit;
          emitter.count -= 1;
        };
        module.exports.unload = unload;
        var emit = function emit2(event, code, signal) {
          if (emitter.emitted[event]) {
            return;
          }
          emitter.emitted[event] = true;
          emitter.emit(event, code, signal);
        };
        var sigListeners = {};
        signals.forEach(function(sig) {
          sigListeners[sig] = function listener() {
            if (!processOk(global.process)) {
              return;
            }
            var listeners = process2.listeners(sig);
            if (listeners.length === emitter.count) {
              unload();
              emit("exit", null, sig);
              emit("afterexit", null, sig);
              if (isWin && sig === "SIGHUP") {
                sig = "SIGINT";
              }
              process2.kill(process2.pid, sig);
            }
          };
        });
        module.exports.signals = function() {
          return signals;
        };
        var loaded = false;
        var load = function load2() {
          if (loaded || !processOk(global.process)) {
            return;
          }
          loaded = true;
          emitter.count += 1;
          signals = signals.filter(function(sig) {
            try {
              process2.on(sig, sigListeners[sig]);
              return true;
            } catch (er) {
              return false;
            }
          });
          process2.emit = processEmit;
          process2.reallyExit = processReallyExit;
        };
        module.exports.load = load;
        var originalProcessReallyExit = process2.reallyExit;
        var processReallyExit = function processReallyExit2(code) {
          if (!processOk(global.process)) {
            return;
          }
          process2.exitCode = code || /* istanbul ignore next */
          0;
          emit("exit", process2.exitCode, null);
          emit("afterexit", process2.exitCode, null);
          originalProcessReallyExit.call(process2, process2.exitCode);
        };
        var originalProcessEmit = process2.emit;
        var processEmit = function processEmit2(ev, arg) {
          if (ev === "exit" && processOk(global.process)) {
            if (arg !== void 0) {
              process2.exitCode = arg;
            }
            var ret = originalProcessEmit.apply(this, arguments);
            emit("exit", process2.exitCode, null);
            emit("afterexit", process2.exitCode, null);
            return ret;
          } else {
            return originalProcessEmit.apply(this, arguments);
          }
        };
      }
    }
  ),
  /***/
  371: (
    /***/
    (module) => {
      module.exports = [
        "SIGABRT",
        "SIGALRM",
        "SIGHUP",
        "SIGINT",
        "SIGTERM"
      ];
      if (process.platform !== "win32") {
        module.exports.push(
          "SIGVTALRM",
          "SIGXCPU",
          "SIGXFSZ",
          "SIGUSR2",
          "SIGTRAP",
          "SIGSYS",
          "SIGQUIT",
          "SIGIOT"
          // should detect profiler and enable/disable accordingly.
          // see #21
          // 'SIGPROF'
        );
      }
      if (process.platform === "linux") {
        module.exports.push(
          "SIGIO",
          "SIGPOLL",
          "SIGPWR",
          "SIGSTKFLT",
          "SIGUNUSED"
        );
      }
    }
  ),
  /***/
  663: (
    /***/
    (module, __unused_webpack_exports, __webpack_require__2) => {
      const os = __webpack_require__2(37);
      const homeDirectory = os.homedir();
      module.exports = (pathWithTilde) => {
        if (typeof pathWithTilde !== "string") {
          throw new TypeError(`Expected a string, got ${typeof pathWithTilde}`);
        }
        return homeDirectory ? pathWithTilde.replace(/^~(?=$|\/|\\)/, homeDirectory) : pathWithTilde;
      };
    }
  ),
  /***/
  45: (
    /***/
    (module, __unused_webpack_exports, __webpack_require__2) => {
      const isWindows = process.platform === "win32" || process.env.OSTYPE === "cygwin" || process.env.OSTYPE === "msys";
      const path = __webpack_require__2(17);
      const COLON = isWindows ? ";" : ":";
      const isexe = __webpack_require__2(885);
      const getNotFoundError = (cmd) => Object.assign(new Error(`not found: ${cmd}`), { code: "ENOENT" });
      const getPathInfo = (cmd, opt) => {
        const colon = opt.colon || COLON;
        const pathEnv = cmd.match(/\//) || isWindows && cmd.match(/\\/) ? [""] : [
          // windows always checks the cwd first
          ...isWindows ? [process.cwd()] : [],
          ...(opt.path || process.env.PATH || /* istanbul ignore next: very unusual */
          "").split(colon)
        ];
        const pathExtExe = isWindows ? opt.pathExt || process.env.PATHEXT || ".EXE;.CMD;.BAT;.COM" : "";
        const pathExt = isWindows ? pathExtExe.split(colon) : [""];
        if (isWindows) {
          if (cmd.indexOf(".") !== -1 && pathExt[0] !== "")
            pathExt.unshift("");
        }
        return {
          pathEnv,
          pathExt,
          pathExtExe
        };
      };
      const which = (cmd, opt, cb) => {
        if (typeof opt === "function") {
          cb = opt;
          opt = {};
        }
        if (!opt)
          opt = {};
        const { pathEnv, pathExt, pathExtExe } = getPathInfo(cmd, opt);
        const found = [];
        const step = (i) => new Promise((resolve, reject) => {
          if (i === pathEnv.length)
            return opt.all && found.length ? resolve(found) : reject(getNotFoundError(cmd));
          const ppRaw = pathEnv[i];
          const pathPart = /^".*"$/.test(ppRaw) ? ppRaw.slice(1, -1) : ppRaw;
          const pCmd = path.join(pathPart, cmd);
          const p = !pathPart && /^\.[\\\/]/.test(cmd) ? cmd.slice(0, 2) + pCmd : pCmd;
          resolve(subStep(p, i, 0));
        });
        const subStep = (p, i, ii) => new Promise((resolve, reject) => {
          if (ii === pathExt.length)
            return resolve(step(i + 1));
          const ext = pathExt[ii];
          isexe(p + ext, { pathExt: pathExtExe }, (er, is) => {
            if (!er && is) {
              if (opt.all)
                found.push(p + ext);
              else
                return resolve(p + ext);
            }
            return resolve(subStep(p, i, ii + 1));
          });
        });
        return cb ? step(0).then((res) => cb(null, res), cb) : step(0);
      };
      const whichSync = (cmd, opt) => {
        opt = opt || {};
        const { pathEnv, pathExt, pathExtExe } = getPathInfo(cmd, opt);
        const found = [];
        for (let i = 0; i < pathEnv.length; i++) {
          const ppRaw = pathEnv[i];
          const pathPart = /^".*"$/.test(ppRaw) ? ppRaw.slice(1, -1) : ppRaw;
          const pCmd = path.join(pathPart, cmd);
          const p = !pathPart && /^\.[\\\/]/.test(cmd) ? cmd.slice(0, 2) + pCmd : pCmd;
          for (let j = 0; j < pathExt.length; j++) {
            const cur = p + pathExt[j];
            try {
              const is = isexe.sync(cur, { pathExt: pathExtExe });
              if (is) {
                if (opt.all)
                  found.push(cur);
                else
                  return cur;
              }
            } catch (ex) {
            }
          }
        }
        if (opt.all && found.length)
          return found;
        if (opt.nothrow)
          return null;
        throw getNotFoundError(cmd);
      };
      module.exports = which;
      which.sync = whichSync;
    }
  ),
  /***/
  491: (
    /***/
    (module) => {
      module.exports = __WEBPACK_EXTERNAL_createRequire(import.meta.url)("assert");
    }
  ),
  /***/
  300: (
    /***/
    (module) => {
      module.exports = __WEBPACK_EXTERNAL_createRequire(import.meta.url)("buffer");
    }
  ),
  /***/
  81: (
    /***/
    (module) => {
      module.exports = __WEBPACK_EXTERNAL_createRequire(import.meta.url)("child_process");
    }
  ),
  /***/
  361: (
    /***/
    (module) => {
      module.exports = __WEBPACK_EXTERNAL_createRequire(import.meta.url)("events");
    }
  ),
  /***/
  147: (
    /***/
    (module) => {
      module.exports = __WEBPACK_EXTERNAL_createRequire(import.meta.url)("fs");
    }
  ),
  /***/
  37: (
    /***/
    (module) => {
      module.exports = __WEBPACK_EXTERNAL_createRequire(import.meta.url)("os");
    }
  ),
  /***/
  17: (
    /***/
    (module) => {
      module.exports = __WEBPACK_EXTERNAL_createRequire(import.meta.url)("path");
    }
  ),
  /***/
  781: (
    /***/
    (module) => {
      module.exports = __WEBPACK_EXTERNAL_createRequire(import.meta.url)("stream");
    }
  ),
  /***/
  837: (
    /***/
    (module) => {
      module.exports = __WEBPACK_EXTERNAL_createRequire(import.meta.url)("util");
    }
  )
  /******/
};
var __webpack_module_cache__ = {};
function __webpack_require__(moduleId) {
  var cachedModule = __webpack_module_cache__[moduleId];
  if (cachedModule !== void 0) {
    return cachedModule.exports;
  }
  var module = __webpack_module_cache__[moduleId] = {
    /******/
    id: moduleId,
    /******/
    loaded: false,
    /******/
    exports: {}
    /******/
  };
  __webpack_modules__[moduleId](module, module.exports, __webpack_require__);
  module.loaded = true;
  return module.exports;
}
(() => {
  __webpack_require__.d = (exports, definition) => {
    for (var key in definition) {
      if (__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
        Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
      }
    }
  };
})();
(() => {
  __webpack_require__.o = (obj, prop) => Object.prototype.hasOwnProperty.call(obj, prop);
})();
(() => {
  __webpack_require__.nmd = (module) => {
    module.paths = [];
    if (!module.children)
      module.children = [];
    return module;
  };
})();
var __webpack_exports__ = {};
(() => {
  __webpack_require__.d(__webpack_exports__, {
    Z: () => (
      /* binding */
      open_browser_webpack_plugin
    )
  });
  ;
  const external_node_process_namespaceObject = __WEBPACK_EXTERNAL_createRequire(import.meta.url)("node:process");
  ;
  const external_node_buffer_namespaceObject = __WEBPACK_EXTERNAL_createRequire(import.meta.url)("node:buffer");
  ;
  const external_node_path_namespaceObject = __WEBPACK_EXTERNAL_createRequire(import.meta.url)("node:path");
  ;
  const external_node_url_namespaceObject = __WEBPACK_EXTERNAL_createRequire(import.meta.url)("node:url");
  ;
  const external_node_child_process_namespaceObject = __WEBPACK_EXTERNAL_createRequire(import.meta.url)("node:child_process");
  ;
  const promises_namespaceObject = __WEBPACK_EXTERNAL_createRequire(import.meta.url)("node:fs/promises");
  ;
  const external_node_fs_namespaceObject = __WEBPACK_EXTERNAL_createRequire(import.meta.url)("node:fs");
  var is_wsl = __webpack_require__(525);
  ;
  function defineLazyProperty(object, propertyName, valueGetter) {
    const define = (value) => Object.defineProperty(object, propertyName, { value, enumerable: true, writable: true });
    Object.defineProperty(object, propertyName, {
      configurable: true,
      enumerable: true,
      get() {
        const result = valueGetter();
        define(result);
        return result;
      },
      set(value) {
        define(value);
      }
    });
    return object;
  }
  var external_os_ = __webpack_require__(37);
  var external_fs_ = __webpack_require__(147);
  var bplistParser = __webpack_require__(401);
  var untildify = __webpack_require__(663);
  ;
  const macOsVersion = Number(external_os_.release().split(".")[0]);
  const filePath = untildify(macOsVersion >= 14 ? "~/Library/Preferences/com.apple.LaunchServices/com.apple.launchservices.secure.plist" : "~/Library/Preferences/com.apple.LaunchServices.plist");
  async function defaultBrowserId() {
    if (process.platform !== "darwin") {
      throw new Error("macOS only");
    }
    let bundleId = "com.apple.Safari";
    let buffer;
    try {
      buffer = await external_fs_.promises.readFile(filePath);
    } catch (error) {
      if (error.code === "ENOENT") {
        return bundleId;
      }
      throw error;
    }
    const data = bplistParser.parseBuffer(buffer);
    const handlers = data && data[0].LSHandlers;
    if (!handlers || handlers.length === 0) {
      return bundleId;
    }
    for (const handler of handlers) {
      if (handler.LSHandlerURLScheme === "http" && handler.LSHandlerRoleAll) {
        bundleId = handler.LSHandlerRoleAll;
        break;
      }
    }
    return bundleId;
  }
  var node_modules_execa = __webpack_require__(601);
  ;
  async function runAppleScriptAsync(script) {
    if (process.platform !== "darwin") {
      throw new Error("macOS only");
    }
    const { stdout } = await node_modules_execa("osascript", ["-e", script]);
    return stdout;
  }
  function runAppleScriptSync(script) {
    if (process.platform !== "darwin") {
      throw new Error("macOS only");
    }
    const { stdout } = execa.sync("osascript", ["-e", script]);
    return stdout;
  }
  ;
  async function bundleName(bundleId) {
    return runAppleScriptAsync(`tell application "Finder" to set app_path to application file id "${bundleId}" as string
tell application "System Events" to get value of property list item "CFBundleName" of property list file (app_path & ":Contents:Info.plist")`);
  }
  ;
  function titleize(string) {
    if (typeof string !== "string") {
      throw new TypeError("Expected a string");
    }
    return string.toLowerCase().replace(/(?:^|\s|-)\S/g, (x) => x.toUpperCase());
  }
  var cross_spawn = __webpack_require__(219);
  ;
  function stripFinalNewline(input) {
    const LF = typeof input === "string" ? "\n" : "\n".charCodeAt();
    const CR = typeof input === "string" ? "\r" : "\r".charCodeAt();
    if (input[input.length - 1] === LF) {
      input = input.slice(0, -1);
    }
    if (input[input.length - 1] === CR) {
      input = input.slice(0, -1);
    }
    return input;
  }
  ;
  function pathKey(options = {}) {
    const {
      env = process.env,
      platform: platform2 = process.platform
    } = options;
    if (platform2 !== "win32") {
      return "PATH";
    }
    return Object.keys(env).reverse().find((key) => key.toUpperCase() === "PATH") || "Path";
  }
  ;
  function npmRunPath(options = {}) {
    const {
      cwd = external_node_process_namespaceObject.cwd(),
      path: path_ = external_node_process_namespaceObject.env[pathKey()],
      execPath = external_node_process_namespaceObject.execPath
    } = options;
    let previous;
    const cwdString = cwd instanceof URL ? external_node_url_namespaceObject.fileURLToPath(cwd) : cwd;
    let cwdPath = external_node_path_namespaceObject.resolve(cwdString);
    const result = [];
    while (previous !== cwdPath) {
      result.push(external_node_path_namespaceObject.join(cwdPath, "node_modules/.bin"));
      previous = cwdPath;
      cwdPath = external_node_path_namespaceObject.resolve(cwdPath, "..");
    }
    result.push(external_node_path_namespaceObject.resolve(cwdString, execPath, ".."));
    return [...result, path_].join(external_node_path_namespaceObject.delimiter);
  }
  function npmRunPathEnv({ env = external_node_process_namespaceObject.env, ...options } = {}) {
    env = { ...env };
    const path = pathKey({ env });
    options.path = env[path];
    env[path] = npmRunPath(options);
    return env;
  }
  ;
  const copyProperty = (to, from, property, ignoreNonConfigurable) => {
    if (property === "length" || property === "prototype") {
      return;
    }
    if (property === "arguments" || property === "caller") {
      return;
    }
    const toDescriptor = Object.getOwnPropertyDescriptor(to, property);
    const fromDescriptor = Object.getOwnPropertyDescriptor(from, property);
    if (!canCopyProperty(toDescriptor, fromDescriptor) && ignoreNonConfigurable) {
      return;
    }
    Object.defineProperty(to, property, fromDescriptor);
  };
  const canCopyProperty = function(toDescriptor, fromDescriptor) {
    return toDescriptor === void 0 || toDescriptor.configurable || toDescriptor.writable === fromDescriptor.writable && toDescriptor.enumerable === fromDescriptor.enumerable && toDescriptor.configurable === fromDescriptor.configurable && (toDescriptor.writable || toDescriptor.value === fromDescriptor.value);
  };
  const changePrototype = (to, from) => {
    const fromPrototype = Object.getPrototypeOf(from);
    if (fromPrototype === Object.getPrototypeOf(to)) {
      return;
    }
    Object.setPrototypeOf(to, fromPrototype);
  };
  const wrappedToString = (withName, fromBody) => `/* Wrapped ${withName}*/
${fromBody}`;
  const toStringDescriptor = Object.getOwnPropertyDescriptor(Function.prototype, "toString");
  const toStringName = Object.getOwnPropertyDescriptor(Function.prototype.toString, "name");
  const changeToString = (to, from, name) => {
    const withName = name === "" ? "" : `with ${name.trim()}() `;
    const newToString = wrappedToString.bind(null, withName, from.toString());
    Object.defineProperty(newToString, "name", toStringName);
    Object.defineProperty(to, "toString", { ...toStringDescriptor, value: newToString });
  };
  function mimicFunction(to, from, { ignoreNonConfigurable = false } = {}) {
    const { name } = to;
    for (const property of Reflect.ownKeys(from)) {
      copyProperty(to, from, property, ignoreNonConfigurable);
    }
    changePrototype(to, from);
    changeToString(to, from, name);
    return to;
  }
  ;
  const calledFunctions = /* @__PURE__ */ new WeakMap();
  const onetime = (function_, options = {}) => {
    if (typeof function_ !== "function") {
      throw new TypeError("Expected a function");
    }
    let returnValue;
    let callCount = 0;
    const functionName = function_.displayName || function_.name || "<anonymous>";
    const onetime2 = function(...arguments_) {
      calledFunctions.set(onetime2, ++callCount);
      if (callCount === 1) {
        returnValue = function_.apply(this, arguments_);
        function_ = null;
      } else if (options.throw === true) {
        throw new Error(`Function \`${functionName}\` can only be called once`);
      }
      return returnValue;
    };
    mimicFunction(onetime2, function_);
    calledFunctions.set(onetime2, callCount);
    return onetime2;
  };
  onetime.callCount = (function_) => {
    if (!calledFunctions.has(function_)) {
      throw new Error(`The given function \`${function_.name}\` is not wrapped by the \`onetime\` package`);
    }
    return calledFunctions.get(function_);
  };
  const node_modules_onetime = onetime;
  ;
  const external_node_os_namespaceObject = __WEBPACK_EXTERNAL_createRequire(import.meta.url)("node:os");
  ;
  const getRealtimeSignals = () => {
    const length = SIGRTMAX - SIGRTMIN + 1;
    return Array.from({ length }, getRealtimeSignal);
  };
  const getRealtimeSignal = (value, index) => ({
    name: `SIGRT${index + 1}`,
    number: SIGRTMIN + index,
    action: "terminate",
    description: "Application-specific signal (realtime)",
    standard: "posix"
  });
  const SIGRTMIN = 34;
  const SIGRTMAX = 64;
  ;
  const SIGNALS = [
    {
      name: "SIGHUP",
      number: 1,
      action: "terminate",
      description: "Terminal closed",
      standard: "posix"
    },
    {
      name: "SIGINT",
      number: 2,
      action: "terminate",
      description: "User interruption with CTRL-C",
      standard: "ansi"
    },
    {
      name: "SIGQUIT",
      number: 3,
      action: "core",
      description: "User interruption with CTRL-\\",
      standard: "posix"
    },
    {
      name: "SIGILL",
      number: 4,
      action: "core",
      description: "Invalid machine instruction",
      standard: "ansi"
    },
    {
      name: "SIGTRAP",
      number: 5,
      action: "core",
      description: "Debugger breakpoint",
      standard: "posix"
    },
    {
      name: "SIGABRT",
      number: 6,
      action: "core",
      description: "Aborted",
      standard: "ansi"
    },
    {
      name: "SIGIOT",
      number: 6,
      action: "core",
      description: "Aborted",
      standard: "bsd"
    },
    {
      name: "SIGBUS",
      number: 7,
      action: "core",
      description: "Bus error due to misaligned, non-existing address or paging error",
      standard: "bsd"
    },
    {
      name: "SIGEMT",
      number: 7,
      action: "terminate",
      description: "Command should be emulated but is not implemented",
      standard: "other"
    },
    {
      name: "SIGFPE",
      number: 8,
      action: "core",
      description: "Floating point arithmetic error",
      standard: "ansi"
    },
    {
      name: "SIGKILL",
      number: 9,
      action: "terminate",
      description: "Forced termination",
      standard: "posix",
      forced: true
    },
    {
      name: "SIGUSR1",
      number: 10,
      action: "terminate",
      description: "Application-specific signal",
      standard: "posix"
    },
    {
      name: "SIGSEGV",
      number: 11,
      action: "core",
      description: "Segmentation fault",
      standard: "ansi"
    },
    {
      name: "SIGUSR2",
      number: 12,
      action: "terminate",
      description: "Application-specific signal",
      standard: "posix"
    },
    {
      name: "SIGPIPE",
      number: 13,
      action: "terminate",
      description: "Broken pipe or socket",
      standard: "posix"
    },
    {
      name: "SIGALRM",
      number: 14,
      action: "terminate",
      description: "Timeout or timer",
      standard: "posix"
    },
    {
      name: "SIGTERM",
      number: 15,
      action: "terminate",
      description: "Termination",
      standard: "ansi"
    },
    {
      name: "SIGSTKFLT",
      number: 16,
      action: "terminate",
      description: "Stack is empty or overflowed",
      standard: "other"
    },
    {
      name: "SIGCHLD",
      number: 17,
      action: "ignore",
      description: "Child process terminated, paused or unpaused",
      standard: "posix"
    },
    {
      name: "SIGCLD",
      number: 17,
      action: "ignore",
      description: "Child process terminated, paused or unpaused",
      standard: "other"
    },
    {
      name: "SIGCONT",
      number: 18,
      action: "unpause",
      description: "Unpaused",
      standard: "posix",
      forced: true
    },
    {
      name: "SIGSTOP",
      number: 19,
      action: "pause",
      description: "Paused",
      standard: "posix",
      forced: true
    },
    {
      name: "SIGTSTP",
      number: 20,
      action: "pause",
      description: 'Paused using CTRL-Z or "suspend"',
      standard: "posix"
    },
    {
      name: "SIGTTIN",
      number: 21,
      action: "pause",
      description: "Background process cannot read terminal input",
      standard: "posix"
    },
    {
      name: "SIGBREAK",
      number: 21,
      action: "terminate",
      description: "User interruption with CTRL-BREAK",
      standard: "other"
    },
    {
      name: "SIGTTOU",
      number: 22,
      action: "pause",
      description: "Background process cannot write to terminal output",
      standard: "posix"
    },
    {
      name: "SIGURG",
      number: 23,
      action: "ignore",
      description: "Socket received out-of-band data",
      standard: "bsd"
    },
    {
      name: "SIGXCPU",
      number: 24,
      action: "core",
      description: "Process timed out",
      standard: "bsd"
    },
    {
      name: "SIGXFSZ",
      number: 25,
      action: "core",
      description: "File too big",
      standard: "bsd"
    },
    {
      name: "SIGVTALRM",
      number: 26,
      action: "terminate",
      description: "Timeout or timer",
      standard: "bsd"
    },
    {
      name: "SIGPROF",
      number: 27,
      action: "terminate",
      description: "Timeout or timer",
      standard: "bsd"
    },
    {
      name: "SIGWINCH",
      number: 28,
      action: "ignore",
      description: "Terminal window size changed",
      standard: "bsd"
    },
    {
      name: "SIGIO",
      number: 29,
      action: "terminate",
      description: "I/O is available",
      standard: "other"
    },
    {
      name: "SIGPOLL",
      number: 29,
      action: "terminate",
      description: "Watched event",
      standard: "other"
    },
    {
      name: "SIGINFO",
      number: 29,
      action: "ignore",
      description: "Request for process information",
      standard: "other"
    },
    {
      name: "SIGPWR",
      number: 30,
      action: "terminate",
      description: "Device running out of power",
      standard: "systemv"
    },
    {
      name: "SIGSYS",
      number: 31,
      action: "core",
      description: "Invalid system call",
      standard: "other"
    },
    {
      name: "SIGUNUSED",
      number: 31,
      action: "terminate",
      description: "Invalid system call",
      standard: "other"
    }
  ];
  ;
  const getSignals = () => {
    const realtimeSignals = getRealtimeSignals();
    const signals = [...SIGNALS, ...realtimeSignals].map(normalizeSignal);
    return signals;
  };
  const normalizeSignal = ({
    name,
    number: defaultNumber,
    description,
    action,
    forced = false,
    standard
  }) => {
    const {
      signals: { [name]: constantSignal }
    } = external_node_os_namespaceObject.constants;
    const supported = constantSignal !== void 0;
    const number = supported ? constantSignal : defaultNumber;
    return { name, number, description, supported, action, forced, standard };
  };
  ;
  const getSignalsByName = () => {
    const signals = getSignals();
    return Object.fromEntries(signals.map(getSignalByName));
  };
  const getSignalByName = ({
    name,
    number,
    description,
    supported,
    action,
    forced,
    standard
  }) => [name, { name, number, description, supported, action, forced, standard }];
  const signalsByName = getSignalsByName();
  const getSignalsByNumber = () => {
    const signals = getSignals();
    const length = SIGRTMAX + 1;
    const signalsA = Array.from({ length }, (value, number) => getSignalByNumber(number, signals));
    return Object.assign({}, ...signalsA);
  };
  const getSignalByNumber = (number, signals) => {
    const signal = findSignalByNumber(number, signals);
    if (signal === void 0) {
      return {};
    }
    const { name, description, supported, action, forced, standard } = signal;
    return {
      [number]: {
        name,
        number,
        description,
        supported,
        action,
        forced,
        standard
      }
    };
  };
  const findSignalByNumber = (number, signals) => {
    const signal = signals.find(({ name }) => external_node_os_namespaceObject.constants.signals[name] === number);
    if (signal !== void 0) {
      return signal;
    }
    return signals.find((signalA) => signalA.number === number);
  };
  const signalsByNumber = getSignalsByNumber();
  ;
  const getErrorPrefix = ({ timedOut, timeout, errorCode, signal, signalDescription, exitCode, isCanceled }) => {
    if (timedOut) {
      return `timed out after ${timeout} milliseconds`;
    }
    if (isCanceled) {
      return "was canceled";
    }
    if (errorCode !== void 0) {
      return `failed with ${errorCode}`;
    }
    if (signal !== void 0) {
      return `was killed with ${signal} (${signalDescription})`;
    }
    if (exitCode !== void 0) {
      return `failed with exit code ${exitCode}`;
    }
    return "failed";
  };
  const makeError = ({
    stdout,
    stderr,
    all,
    error,
    signal,
    exitCode,
    command,
    escapedCommand,
    timedOut,
    isCanceled,
    killed,
    parsed: { options: { timeout } }
  }) => {
    exitCode = exitCode === null ? void 0 : exitCode;
    signal = signal === null ? void 0 : signal;
    const signalDescription = signal === void 0 ? void 0 : signalsByName[signal].description;
    const errorCode = error && error.code;
    const prefix = getErrorPrefix({ timedOut, timeout, errorCode, signal, signalDescription, exitCode, isCanceled });
    const execaMessage = `Command ${prefix}: ${command}`;
    const isError = Object.prototype.toString.call(error) === "[object Error]";
    const shortMessage = isError ? `${execaMessage}
${error.message}` : execaMessage;
    const message = [shortMessage, stderr, stdout].filter(Boolean).join("\n");
    if (isError) {
      error.originalMessage = error.message;
      error.message = message;
    } else {
      error = new Error(message);
    }
    error.shortMessage = shortMessage;
    error.command = command;
    error.escapedCommand = escapedCommand;
    error.exitCode = exitCode;
    error.signal = signal;
    error.signalDescription = signalDescription;
    error.stdout = stdout;
    error.stderr = stderr;
    if (all !== void 0) {
      error.all = all;
    }
    if ("bufferedData" in error) {
      delete error.bufferedData;
    }
    error.failed = true;
    error.timedOut = Boolean(timedOut);
    error.isCanceled = isCanceled;
    error.killed = killed && !timedOut;
    return error;
  };
  ;
  const aliases = ["stdin", "stdout", "stderr"];
  const hasAlias = (options) => aliases.some((alias) => options[alias] !== void 0);
  const normalizeStdio = (options) => {
    if (!options) {
      return;
    }
    const { stdio } = options;
    if (stdio === void 0) {
      return aliases.map((alias) => options[alias]);
    }
    if (hasAlias(options)) {
      throw new Error(`It's not possible to provide \`stdio\` in combination with one of ${aliases.map((alias) => `\`${alias}\``).join(", ")}`);
    }
    if (typeof stdio === "string") {
      return stdio;
    }
    if (!Array.isArray(stdio)) {
      throw new TypeError(`Expected \`stdio\` to be of type \`string\` or \`Array\`, got \`${typeof stdio}\``);
    }
    const length = Math.max(stdio.length, aliases.length);
    return Array.from({ length }, (value, index) => stdio[index]);
  };
  const stdio_normalizeStdioNode = (options) => {
    const stdio = normalizeStdio(options);
    if (stdio === "ipc") {
      return "ipc";
    }
    if (stdio === void 0 || typeof stdio === "string") {
      return [stdio, stdio, stdio, "ipc"];
    }
    if (stdio.includes("ipc")) {
      return stdio;
    }
    return [...stdio, "ipc"];
  };
  var signal_exit = __webpack_require__(281);
  ;
  const DEFAULT_FORCE_KILL_TIMEOUT = 1e3 * 5;
  const spawnedKill = (kill, signal = "SIGTERM", options = {}) => {
    const killResult = kill(signal);
    setKillTimeout(kill, signal, options, killResult);
    return killResult;
  };
  const setKillTimeout = (kill, signal, options, killResult) => {
    if (!shouldForceKill(signal, options, killResult)) {
      return;
    }
    const timeout = getForceKillAfterTimeout(options);
    const t = setTimeout(() => {
      kill("SIGKILL");
    }, timeout);
    if (t.unref) {
      t.unref();
    }
  };
  const shouldForceKill = (signal, { forceKillAfterTimeout }, killResult) => isSigterm(signal) && forceKillAfterTimeout !== false && killResult;
  const isSigterm = (signal) => signal === external_node_os_namespaceObject.constants.signals.SIGTERM || typeof signal === "string" && signal.toUpperCase() === "SIGTERM";
  const getForceKillAfterTimeout = ({ forceKillAfterTimeout = true }) => {
    if (forceKillAfterTimeout === true) {
      return DEFAULT_FORCE_KILL_TIMEOUT;
    }
    if (!Number.isFinite(forceKillAfterTimeout) || forceKillAfterTimeout < 0) {
      throw new TypeError(`Expected the \`forceKillAfterTimeout\` option to be a non-negative integer, got \`${forceKillAfterTimeout}\` (${typeof forceKillAfterTimeout})`);
    }
    return forceKillAfterTimeout;
  };
  const spawnedCancel = (spawned, context) => {
    const killResult = spawned.kill();
    if (killResult) {
      context.isCanceled = true;
    }
  };
  const timeoutKill = (spawned, signal, reject) => {
    spawned.kill(signal);
    reject(Object.assign(new Error("Timed out"), { timedOut: true, signal }));
  };
  const setupTimeout = (spawned, { timeout, killSignal = "SIGTERM" }, spawnedPromise) => {
    if (timeout === 0 || timeout === void 0) {
      return spawnedPromise;
    }
    let timeoutId;
    const timeoutPromise = new Promise((resolve, reject) => {
      timeoutId = setTimeout(() => {
        timeoutKill(spawned, killSignal, reject);
      }, timeout);
    });
    const safeSpawnedPromise = spawnedPromise.finally(() => {
      clearTimeout(timeoutId);
    });
    return Promise.race([timeoutPromise, safeSpawnedPromise]);
  };
  const validateTimeout = ({ timeout }) => {
    if (timeout !== void 0 && (!Number.isFinite(timeout) || timeout < 0)) {
      throw new TypeError(`Expected the \`timeout\` option to be a non-negative integer, got \`${timeout}\` (${typeof timeout})`);
    }
  };
  const setExitHandler = async (spawned, { cleanup, detached }, timedPromise) => {
    if (!cleanup || detached) {
      return timedPromise;
    }
    const removeExitHandler = signal_exit(() => {
      spawned.kill();
    });
    return timedPromise.finally(() => {
      removeExitHandler();
    });
  };
  ;
  function isStream(stream) {
    return stream !== null && typeof stream === "object" && typeof stream.pipe === "function";
  }
  function isWritableStream(stream) {
    return isStream(stream) && stream.writable !== false && typeof stream._write === "function" && typeof stream._writableState === "object";
  }
  function isReadableStream(stream) {
    return isStream(stream) && stream.readable !== false && typeof stream._read === "function" && typeof stream._readableState === "object";
  }
  function isDuplexStream(stream) {
    return isWritableStream(stream) && isReadableStream(stream);
  }
  function isTransformStream(stream) {
    return isDuplexStream(stream) && typeof stream._transform === "function";
  }
  ;
  const isExecaChildProcess = (target) => target instanceof external_node_child_process_namespaceObject.ChildProcess && typeof target.then === "function";
  const pipeToTarget = (spawned, streamName, target) => {
    if (typeof target === "string") {
      spawned[streamName].pipe((0, external_node_fs_namespaceObject.createWriteStream)(target));
      return spawned;
    }
    if (isWritableStream(target)) {
      spawned[streamName].pipe(target);
      return spawned;
    }
    if (!isExecaChildProcess(target)) {
      throw new TypeError("The second argument must be a string, a stream or an Execa child process.");
    }
    if (!isWritableStream(target.stdin)) {
      throw new TypeError("The target child process's stdin must be available.");
    }
    spawned[streamName].pipe(target.stdin);
    return target;
  };
  const addPipeMethods = (spawned) => {
    if (spawned.stdout !== null) {
      spawned.pipeStdout = pipeToTarget.bind(void 0, spawned, "stdout");
    }
    if (spawned.stderr !== null) {
      spawned.pipeStderr = pipeToTarget.bind(void 0, spawned, "stderr");
    }
    if (spawned.all !== void 0) {
      spawned.pipeAll = pipeToTarget.bind(void 0, spawned, "all");
    }
  };
  var get_stream = __webpack_require__(505);
  var merge_stream = __webpack_require__(770);
  ;
  const validateInputOptions = (input) => {
    if (input !== void 0) {
      throw new TypeError("The `input` and `inputFile` options cannot be both set.");
    }
  };
  const getInputSync = ({ input, inputFile }) => {
    if (typeof inputFile !== "string") {
      return input;
    }
    validateInputOptions(input);
    return (0, external_node_fs_namespaceObject.readFileSync)(inputFile);
  };
  const handleInputSync = (options) => {
    const input = getInputSync(options);
    if (isStream(input)) {
      throw new TypeError("The `input` option cannot be a stream in sync mode");
    }
    return input;
  };
  const getInput = ({ input, inputFile }) => {
    if (typeof inputFile !== "string") {
      return input;
    }
    validateInputOptions(input);
    return (0, external_node_fs_namespaceObject.createReadStream)(inputFile);
  };
  const handleInput = (spawned, options) => {
    const input = getInput(options);
    if (input === void 0) {
      return;
    }
    if (isStream(input)) {
      input.pipe(spawned.stdin);
    } else {
      spawned.stdin.end(input);
    }
  };
  const makeAllStream = (spawned, { all }) => {
    if (!all || !spawned.stdout && !spawned.stderr) {
      return;
    }
    const mixed = merge_stream();
    if (spawned.stdout) {
      mixed.add(spawned.stdout);
    }
    if (spawned.stderr) {
      mixed.add(spawned.stderr);
    }
    return mixed;
  };
  const getBufferedData = async (stream, streamPromise) => {
    if (!stream || streamPromise === void 0) {
      return;
    }
    stream.destroy();
    try {
      return await streamPromise;
    } catch (error) {
      return error.bufferedData;
    }
  };
  const getStreamPromise = (stream, { encoding, buffer, maxBuffer }) => {
    if (!stream || !buffer) {
      return;
    }
    if (encoding) {
      return get_stream(stream, { encoding, maxBuffer });
    }
    return get_stream.buffer(stream, { maxBuffer });
  };
  const getSpawnedResult = async ({ stdout, stderr, all }, { encoding, buffer, maxBuffer }, processDone) => {
    const stdoutPromise = getStreamPromise(stdout, { encoding, buffer, maxBuffer });
    const stderrPromise = getStreamPromise(stderr, { encoding, buffer, maxBuffer });
    const allPromise = getStreamPromise(all, { encoding, buffer, maxBuffer: maxBuffer * 2 });
    try {
      return await Promise.all([processDone, stdoutPromise, stderrPromise, allPromise]);
    } catch (error) {
      return Promise.all([
        { error, signal: error.signal, timedOut: error.timedOut },
        getBufferedData(stdout, stdoutPromise),
        getBufferedData(stderr, stderrPromise),
        getBufferedData(all, allPromise)
      ]);
    }
  };
  ;
  const nativePromisePrototype = (async () => {
  })().constructor.prototype;
  const descriptors = ["then", "catch", "finally"].map((property) => [
    property,
    Reflect.getOwnPropertyDescriptor(nativePromisePrototype, property)
  ]);
  const mergePromise = (spawned, promise) => {
    for (const [property, descriptor] of descriptors) {
      const value = typeof promise === "function" ? (...args) => Reflect.apply(descriptor.value, promise(), args) : descriptor.value.bind(promise);
      Reflect.defineProperty(spawned, property, { ...descriptor, value });
    }
  };
  const getSpawnedPromise = (spawned) => new Promise((resolve, reject) => {
    spawned.on("exit", (exitCode, signal) => {
      resolve({ exitCode, signal });
    });
    spawned.on("error", (error) => {
      reject(error);
    });
    if (spawned.stdin) {
      spawned.stdin.on("error", (error) => {
        reject(error);
      });
    }
  });
  ;
  const normalizeArgs = (file, args = []) => {
    if (!Array.isArray(args)) {
      return [file];
    }
    return [file, ...args];
  };
  const NO_ESCAPE_REGEXP = /^[\w.-]+$/;
  const DOUBLE_QUOTES_REGEXP = /"/g;
  const escapeArg = (arg) => {
    if (typeof arg !== "string" || NO_ESCAPE_REGEXP.test(arg)) {
      return arg;
    }
    return `"${arg.replace(DOUBLE_QUOTES_REGEXP, '\\"')}"`;
  };
  const joinCommand = (file, args) => normalizeArgs(file, args).join(" ");
  const getEscapedCommand = (file, args) => normalizeArgs(file, args).map((arg) => escapeArg(arg)).join(" ");
  const SPACES_REGEXP = / +/g;
  const command_parseCommand = (command) => {
    const tokens = [];
    for (const token of command.trim().split(SPACES_REGEXP)) {
      const previousToken = tokens[tokens.length - 1];
      if (previousToken && previousToken.endsWith("\\")) {
        tokens[tokens.length - 1] = `${previousToken.slice(0, -1)} ${token}`;
      } else {
        tokens.push(token);
      }
    }
    return tokens;
  };
  const parseExpression = (expression) => {
    const typeOfExpression = typeof expression;
    if (typeOfExpression === "string") {
      return expression;
    }
    if (typeOfExpression === "number") {
      return String(expression);
    }
    if (typeOfExpression === "object" && expression !== null && !(expression instanceof external_node_child_process_namespaceObject.ChildProcess) && "stdout" in expression) {
      const typeOfStdout = typeof expression.stdout;
      if (typeOfStdout === "string") {
        return expression.stdout;
      }
      if (external_node_buffer_namespaceObject.Buffer.isBuffer(expression.stdout)) {
        return expression.stdout.toString();
      }
      throw new TypeError(`Unexpected "${typeOfStdout}" stdout in template expression`);
    }
    throw new TypeError(`Unexpected "${typeOfExpression}" in template expression`);
  };
  const concatTokens = (tokens, nextTokens, isNew) => isNew || tokens.length === 0 || nextTokens.length === 0 ? [...tokens, ...nextTokens] : [
    ...tokens.slice(0, -1),
    `${tokens[tokens.length - 1]}${nextTokens[0]}`,
    ...nextTokens.slice(1)
  ];
  const parseTemplate = ({ templates, expressions, tokens, index, template }) => {
    const templateString = template ?? templates.raw[index];
    const templateTokens = templateString.split(SPACES_REGEXP).filter(Boolean);
    const newTokens = concatTokens(
      tokens,
      templateTokens,
      templateString.startsWith(" ")
    );
    if (index === expressions.length) {
      return newTokens;
    }
    const expression = expressions[index];
    const expressionTokens = Array.isArray(expression) ? expression.map((expression2) => parseExpression(expression2)) : [parseExpression(expression)];
    return concatTokens(
      newTokens,
      expressionTokens,
      templateString.endsWith(" ")
    );
  };
  const parseTemplates = (templates, expressions) => {
    let tokens = [];
    for (const [index, template] of templates.entries()) {
      tokens = parseTemplate({ templates, expressions, tokens, index, template });
    }
    return tokens;
  };
  ;
  const external_node_util_namespaceObject = __WEBPACK_EXTERNAL_createRequire(import.meta.url)("node:util");
  ;
  const verboseDefault = (0, external_node_util_namespaceObject.debuglog)("execa").enabled;
  const padField = (field, padding) => String(field).padStart(padding, "0");
  const getTimestamp = () => {
    const date = /* @__PURE__ */ new Date();
    return `${padField(date.getHours(), 2)}:${padField(date.getMinutes(), 2)}:${padField(date.getSeconds(), 2)}.${padField(date.getMilliseconds(), 3)}`;
  };
  const logCommand = (escapedCommand, { verbose }) => {
    if (!verbose) {
      return;
    }
    external_node_process_namespaceObject.stderr.write(`[${getTimestamp()}] ${escapedCommand}
`);
  };
  ;
  const DEFAULT_MAX_BUFFER = 1e3 * 1e3 * 100;
  const getEnv = ({ env: envOption, extendEnv, preferLocal, localDir, execPath }) => {
    const env = extendEnv ? { ...external_node_process_namespaceObject.env, ...envOption } : envOption;
    if (preferLocal) {
      return npmRunPathEnv({ env, cwd: localDir, execPath });
    }
    return env;
  };
  const handleArguments = (file, args, options = {}) => {
    const parsed = cross_spawn._parse(file, args, options);
    file = parsed.command;
    args = parsed.args;
    options = parsed.options;
    options = {
      maxBuffer: DEFAULT_MAX_BUFFER,
      buffer: true,
      stripFinalNewline: true,
      extendEnv: true,
      preferLocal: false,
      localDir: options.cwd || external_node_process_namespaceObject.cwd(),
      execPath: external_node_process_namespaceObject.execPath,
      encoding: "utf8",
      reject: true,
      cleanup: true,
      all: false,
      windowsHide: true,
      verbose: verboseDefault,
      ...options
    };
    options.env = getEnv(options);
    options.stdio = normalizeStdio(options);
    if (external_node_process_namespaceObject.platform === "win32" && external_node_path_namespaceObject.basename(file, ".exe") === "cmd") {
      args.unshift("/q");
    }
    return { file, args, options, parsed };
  };
  const handleOutput = (options, value, error) => {
    if (typeof value !== "string" && !external_node_buffer_namespaceObject.Buffer.isBuffer(value)) {
      return error === void 0 ? void 0 : "";
    }
    if (options.stripFinalNewline) {
      return stripFinalNewline(value);
    }
    return value;
  };
  function execa_execa(file, args, options) {
    const parsed = handleArguments(file, args, options);
    const command = joinCommand(file, args);
    const escapedCommand = getEscapedCommand(file, args);
    logCommand(escapedCommand, parsed.options);
    validateTimeout(parsed.options);
    let spawned;
    try {
      spawned = external_node_child_process_namespaceObject.spawn(parsed.file, parsed.args, parsed.options);
    } catch (error) {
      const dummySpawned = new external_node_child_process_namespaceObject.ChildProcess();
      const errorPromise = Promise.reject(makeError({
        error,
        stdout: "",
        stderr: "",
        all: "",
        command,
        escapedCommand,
        parsed,
        timedOut: false,
        isCanceled: false,
        killed: false
      }));
      mergePromise(dummySpawned, errorPromise);
      return dummySpawned;
    }
    const spawnedPromise = getSpawnedPromise(spawned);
    const timedPromise = setupTimeout(spawned, parsed.options, spawnedPromise);
    const processDone = setExitHandler(spawned, parsed.options, timedPromise);
    const context = { isCanceled: false };
    spawned.kill = spawnedKill.bind(null, spawned.kill.bind(spawned));
    spawned.cancel = spawnedCancel.bind(null, spawned, context);
    const handlePromise = async () => {
      const [{ error, exitCode, signal, timedOut }, stdoutResult, stderrResult, allResult] = await getSpawnedResult(spawned, parsed.options, processDone);
      const stdout = handleOutput(parsed.options, stdoutResult);
      const stderr = handleOutput(parsed.options, stderrResult);
      const all = handleOutput(parsed.options, allResult);
      if (error || exitCode !== 0 || signal !== null) {
        const returnedError = makeError({
          error,
          exitCode,
          signal,
          stdout,
          stderr,
          all,
          command,
          escapedCommand,
          parsed,
          timedOut,
          isCanceled: context.isCanceled || (parsed.options.signal ? parsed.options.signal.aborted : false),
          killed: spawned.killed
        });
        if (!parsed.options.reject) {
          return returnedError;
        }
        throw returnedError;
      }
      return {
        command,
        escapedCommand,
        exitCode: 0,
        stdout,
        stderr,
        all,
        failed: false,
        timedOut: false,
        isCanceled: false,
        killed: false
      };
    };
    const handlePromiseOnce = node_modules_onetime(handlePromise);
    handleInput(spawned, parsed.options);
    spawned.all = makeAllStream(spawned, parsed.options);
    addPipeMethods(spawned);
    mergePromise(spawned, handlePromiseOnce);
    return spawned;
  }
  function execaSync(file, args, options) {
    const parsed = handleArguments(file, args, options);
    const command = joinCommand(file, args);
    const escapedCommand = getEscapedCommand(file, args);
    logCommand(escapedCommand, parsed.options);
    const input = handleInputSync(parsed.options);
    let result;
    try {
      result = external_node_child_process_namespaceObject.spawnSync(parsed.file, parsed.args, { ...parsed.options, input });
    } catch (error) {
      throw makeError({
        error,
        stdout: "",
        stderr: "",
        all: "",
        command,
        escapedCommand,
        parsed,
        timedOut: false,
        isCanceled: false,
        killed: false
      });
    }
    const stdout = handleOutput(parsed.options, result.stdout, result.error);
    const stderr = handleOutput(parsed.options, result.stderr, result.error);
    if (result.error || result.status !== 0 || result.signal !== null) {
      const error = makeError({
        stdout,
        stderr,
        error: result.error,
        signal: result.signal,
        exitCode: result.status,
        command,
        escapedCommand,
        parsed,
        timedOut: result.error && result.error.code === "ETIMEDOUT",
        isCanceled: false,
        killed: result.signal !== null
      });
      if (!parsed.options.reject) {
        return error;
      }
      throw error;
    }
    return {
      command,
      escapedCommand,
      exitCode: 0,
      stdout,
      stderr,
      failed: false,
      timedOut: false,
      isCanceled: false,
      killed: false
    };
  }
  const normalizeScriptStdin = ({ input, inputFile, stdio }) => input === void 0 && inputFile === void 0 && stdio === void 0 ? { stdin: "inherit" } : {};
  const normalizeScriptOptions = (options = {}) => ({
    preferLocal: true,
    ...normalizeScriptStdin(options),
    ...options
  });
  function create$(options) {
    function $2(templatesOrOptions, ...expressions) {
      if (!Array.isArray(templatesOrOptions)) {
        return create$({ ...options, ...templatesOrOptions });
      }
      const [file, ...args] = parseTemplates(templatesOrOptions, expressions);
      return execa_execa(file, args, normalizeScriptOptions(options));
    }
    $2.sync = (templates, ...expressions) => {
      if (!Array.isArray(templates)) {
        throw new TypeError("Please use $(options).sync`command` instead of $.sync(options)`command`.");
      }
      const [file, ...args] = parseTemplates(templates, expressions);
      return execaSync(file, args, normalizeScriptOptions(options));
    };
    return $2;
  }
  const $ = create$();
  function execaCommand(command, options) {
    const [file, ...args] = parseCommand(command);
    return execa_execa(file, args, options);
  }
  function execaCommandSync(command, options) {
    const [file, ...args] = parseCommand(command);
    return execaSync(file, args, options);
  }
  function execaNode(scriptPath, args, options = {}) {
    if (args && !Array.isArray(args) && typeof args === "object") {
      options = args;
      args = [];
    }
    const stdio = normalizeStdioNode(options);
    const defaultExecArgv = process.execArgv.filter((arg) => !arg.startsWith("--inspect"));
    const {
      nodePath = process.execPath,
      nodeOptions = defaultExecArgv
    } = options;
    return execa_execa(
      nodePath,
      [
        ...nodeOptions,
        scriptPath,
        ...Array.isArray(args) ? args : []
      ],
      {
        ...options,
        stdin: void 0,
        stdout: void 0,
        stderr: void 0,
        stdio,
        shell: false
      }
    );
  }
  ;
  const windowsBrowserProgIds = {
    AppXq0fevzme2pys62n3e0fbqa7peapykr8v: { name: "Edge", id: "com.microsoft.edge.old" },
    MSEdgeDHTML: { name: "Edge", id: "com.microsoft.edge" },
    // On macOS, it's "com.microsoft.edgemac"
    MSEdgeHTM: { name: "Edge", id: "com.microsoft.edge" },
    // Newer Edge/Win10 releases
    "IE.HTTP": { name: "Internet Explorer", id: "com.microsoft.ie" },
    FirefoxURL: { name: "Firefox", id: "org.mozilla.firefox" },
    ChromeHTML: { name: "Chrome", id: "com.google.chrome" }
  };
  class UnknownBrowserError extends Error {
  }
  async function defaultBrowser(_execa = execa_execa) {
    const result = await _execa("reg", [
      "QUERY",
      " HKEY_CURRENT_USER\\Software\\Microsoft\\Windows\\Shell\\Associations\\UrlAssociations\\http\\UserChoice",
      "/v",
      "ProgId"
    ]);
    const match = /ProgId\s*REG_SZ\s*(?<id>\S+)/.exec(result.stdout);
    if (!match) {
      throw new UnknownBrowserError(`Cannot find Windows browser in stdout: ${JSON.stringify(result.stdout)}`);
    }
    const { id } = match.groups;
    const browser = windowsBrowserProgIds[id];
    if (!browser) {
      throw new UnknownBrowserError(`Unknown browser ID: ${id}`);
    }
    return browser;
  }
  ;
  async function default_browser_defaultBrowser() {
    if (external_node_process_namespaceObject.platform === "linux") {
      const { stdout } = await execa_execa("xdg-mime", ["query", "default", "x-scheme-handler/http"]);
      const name = titleize(stdout.trim().replace(/.desktop$/, "").replace("-", " "));
      return {
        name,
        id: stdout
      };
    }
    if (external_node_process_namespaceObject.platform === "darwin") {
      const id = await defaultBrowserId();
      const name = await bundleName(id);
      return { name, id };
    }
    if (external_node_process_namespaceObject.platform === "win32") {
      return defaultBrowser();
    }
    throw new Error("Only macOS, Linux, and Windows are supported");
  }
  ;
  let isDockerCached;
  function hasDockerEnv() {
    try {
      external_node_fs_namespaceObject.statSync("/.dockerenv");
      return true;
    } catch {
      return false;
    }
  }
  function hasDockerCGroup() {
    try {
      return external_node_fs_namespaceObject.readFileSync("/proc/self/cgroup", "utf8").includes("docker");
    } catch {
      return false;
    }
  }
  function isDocker() {
    if (isDockerCached === void 0) {
      isDockerCached = hasDockerEnv() || hasDockerCGroup();
    }
    return isDockerCached;
  }
  ;
  let cachedResult;
  const hasContainerEnv = () => {
    try {
      external_node_fs_namespaceObject.statSync("/run/.containerenv");
      return true;
    } catch {
      return false;
    }
  };
  function isInsideContainer() {
    if (cachedResult === void 0) {
      cachedResult = hasContainerEnv() || isDocker();
    }
    return cachedResult;
  }
  ;
  const open_dirname = external_node_path_namespaceObject.dirname((0, external_node_url_namespaceObject.fileURLToPath)("file:///Users/huyong/Desktop/ihuxy/playground/huxy/open-browser-webpack-plugin/node_modules/open/index.js"));
  const localXdgOpenPath = external_node_path_namespaceObject.join(open_dirname, "xdg-open");
  const { platform, arch } = external_node_process_namespaceObject;
  const getWslDrivesMountPoint = (() => {
    const defaultMountPoint = "/mnt/";
    let mountPoint;
    return async function() {
      if (mountPoint) {
        return mountPoint;
      }
      const configFilePath = "/etc/wsl.conf";
      let isConfigFileExists = false;
      try {
        await promises_namespaceObject.access(configFilePath, external_node_fs_namespaceObject.constants.F_OK);
        isConfigFileExists = true;
      } catch {
      }
      if (!isConfigFileExists) {
        return defaultMountPoint;
      }
      const configContent = await promises_namespaceObject.readFile(configFilePath, { encoding: "utf8" });
      const configMountPoint = /(?<!#.*)root\s*=\s*(?<mountPoint>.*)/g.exec(configContent);
      if (!configMountPoint) {
        return defaultMountPoint;
      }
      mountPoint = configMountPoint.groups.mountPoint.trim();
      mountPoint = mountPoint.endsWith("/") ? mountPoint : `${mountPoint}/`;
      return mountPoint;
    };
  })();
  const pTryEach = async (array, mapper) => {
    let latestError;
    for (const item of array) {
      try {
        return await mapper(item);
      } catch (error) {
        latestError = error;
      }
    }
    throw latestError;
  };
  const baseOpen = async (options) => {
    options = {
      wait: false,
      background: false,
      newInstance: false,
      allowNonzeroExitCode: false,
      ...options
    };
    if (Array.isArray(options.app)) {
      return pTryEach(options.app, (singleApp) => baseOpen({
        ...options,
        app: singleApp
      }));
    }
    let { name: app, arguments: appArguments = [] } = options.app ?? {};
    appArguments = [...appArguments];
    if (Array.isArray(app)) {
      return pTryEach(app, (appName) => baseOpen({
        ...options,
        app: {
          name: appName,
          arguments: appArguments
        }
      }));
    }
    if (app === "browser" || app === "browserPrivate") {
      const ids = {
        "com.google.chrome": "chrome",
        "google-chrome.desktop": "chrome",
        "org.mozilla.firefox": "firefox",
        "firefox.desktop": "firefox",
        "com.microsoft.msedge": "edge",
        "com.microsoft.edge": "edge",
        "microsoft-edge.desktop": "edge"
      };
      const flags = {
        chrome: "--incognito",
        firefox: "--private-window",
        edge: "--inPrivate"
      };
      const browser = await default_browser_defaultBrowser();
      if (browser.id in ids) {
        const browserName = ids[browser.id];
        if (app === "browserPrivate") {
          appArguments.push(flags[browserName]);
        }
        return baseOpen({
          ...options,
          app: {
            name: apps[browserName],
            arguments: appArguments
          }
        });
      }
      throw new Error(`${browser.name} is not supported as a default browser`);
    }
    let command;
    const cliArguments = [];
    const childProcessOptions = {};
    if (platform === "darwin") {
      command = "open";
      if (options.wait) {
        cliArguments.push("--wait-apps");
      }
      if (options.background) {
        cliArguments.push("--background");
      }
      if (options.newInstance) {
        cliArguments.push("--new");
      }
      if (app) {
        cliArguments.push("-a", app);
      }
    } else if (platform === "win32" || is_wsl && !isInsideContainer() && !app) {
      const mountPoint = await getWslDrivesMountPoint();
      command = is_wsl ? `${mountPoint}c/Windows/System32/WindowsPowerShell/v1.0/powershell.exe` : `${external_node_process_namespaceObject.env.SYSTEMROOT}\\System32\\WindowsPowerShell\\v1.0\\powershell`;
      cliArguments.push(
        "-NoProfile",
        "-NonInteractive",
        "-ExecutionPolicy",
        "Bypass",
        "-EncodedCommand"
      );
      if (!is_wsl) {
        childProcessOptions.windowsVerbatimArguments = true;
      }
      const encodedArguments = ["Start"];
      if (options.wait) {
        encodedArguments.push("-Wait");
      }
      if (app) {
        encodedArguments.push(`"\`"${app}\`""`);
        if (options.target) {
          appArguments.push(options.target);
        }
      } else if (options.target) {
        encodedArguments.push(`"${options.target}"`);
      }
      if (appArguments.length > 0) {
        appArguments = appArguments.map((arg) => `"\`"${arg}\`""`);
        encodedArguments.push("-ArgumentList", appArguments.join(","));
      }
      options.target = external_node_buffer_namespaceObject.Buffer.from(encodedArguments.join(" "), "utf16le").toString("base64");
    } else {
      if (app) {
        command = app;
      } else {
        const isBundled = !open_dirname || open_dirname === "/";
        let exeLocalXdgOpen = false;
        try {
          await promises_namespaceObject.access(localXdgOpenPath, external_node_fs_namespaceObject.constants.X_OK);
          exeLocalXdgOpen = true;
        } catch {
        }
        const useSystemXdgOpen = external_node_process_namespaceObject.versions.electron ?? (platform === "android" || isBundled || !exeLocalXdgOpen);
        command = useSystemXdgOpen ? "xdg-open" : localXdgOpenPath;
      }
      if (appArguments.length > 0) {
        cliArguments.push(...appArguments);
      }
      if (!options.wait) {
        childProcessOptions.stdio = "ignore";
        childProcessOptions.detached = true;
      }
    }
    if (options.target) {
      cliArguments.push(options.target);
    }
    if (platform === "darwin" && appArguments.length > 0) {
      cliArguments.push("--args", ...appArguments);
    }
    const subprocess = external_node_child_process_namespaceObject.spawn(command, cliArguments, childProcessOptions);
    if (options.wait) {
      return new Promise((resolve, reject) => {
        subprocess.once("error", reject);
        subprocess.once("close", (exitCode) => {
          if (!options.allowNonzeroExitCode && exitCode > 0) {
            reject(new Error(`Exited with code ${exitCode}`));
            return;
          }
          resolve(subprocess);
        });
      });
    }
    subprocess.unref();
    return subprocess;
  };
  const open_open = (target, options) => {
    if (typeof target !== "string") {
      throw new TypeError("Expected a `target`");
    }
    return baseOpen({
      ...options,
      target
    });
  };
  const openApp = (name, options) => {
    if (typeof name !== "string") {
      throw new TypeError("Expected a `name`");
    }
    const { arguments: appArguments = [] } = options ?? {};
    if (appArguments !== void 0 && appArguments !== null && !Array.isArray(appArguments)) {
      throw new TypeError("Expected `appArguments` as Array type");
    }
    return baseOpen({
      ...options,
      app: {
        name,
        arguments: appArguments
      }
    });
  };
  function detectArchBinary(binary) {
    if (typeof binary === "string" || Array.isArray(binary)) {
      return binary;
    }
    const { [arch]: archBinary } = binary;
    if (!archBinary) {
      throw new Error(`${arch} is not supported`);
    }
    return archBinary;
  }
  function detectPlatformBinary({ [platform]: platformBinary }, { wsl }) {
    if (wsl && is_wsl) {
      return detectArchBinary(wsl);
    }
    if (!platformBinary) {
      throw new Error(`${platform} is not supported`);
    }
    return detectArchBinary(platformBinary);
  }
  const apps = {};
  defineLazyProperty(apps, "chrome", () => detectPlatformBinary({
    darwin: "google chrome",
    win32: "chrome",
    linux: ["google-chrome", "google-chrome-stable", "chromium"]
  }, {
    wsl: {
      ia32: "/mnt/c/Program Files (x86)/Google/Chrome/Application/chrome.exe",
      x64: ["/mnt/c/Program Files/Google/Chrome/Application/chrome.exe", "/mnt/c/Program Files (x86)/Google/Chrome/Application/chrome.exe"]
    }
  }));
  defineLazyProperty(apps, "firefox", () => detectPlatformBinary({
    darwin: "firefox",
    win32: "C:\\Program Files\\Mozilla Firefox\\firefox.exe",
    linux: "firefox"
  }, {
    wsl: "/mnt/c/Program Files/Mozilla Firefox/firefox.exe"
  }));
  defineLazyProperty(apps, "edge", () => detectPlatformBinary({
    darwin: "microsoft edge",
    win32: "msedge",
    linux: ["microsoft-edge", "microsoft-edge-dev"]
  }, {
    wsl: "/mnt/c/Program Files (x86)/Microsoft/Edge/Application/msedge.exe"
  }));
  defineLazyProperty(apps, "browser", () => "browser");
  defineLazyProperty(apps, "browserPrivate", () => "browserPrivate");
  const node_modules_open = open_open;
  ;
  const once = (fn) => {
    let called = false;
    return (...args) => {
      if (!called) {
        called = true;
        return fn(...args);
      }
    };
  };
  const OpenBrowserWebpackPlugin = function({ target = "http://localhost:8080", options = {} }) {
    this.target = target;
    this.options = options;
  };
  OpenBrowserWebpackPlugin.prototype.apply = function(compiler) {
    const openBrowser = once(() => node_modules_open(this.target, this.options));
    compiler.hooks.done.tap("OpenBrowserPlugin", ({ compilation }) => {
      if (!compilation.errors.length) {
        openBrowser();
      }
    });
  };
  const open_browser_webpack_plugin = OpenBrowserWebpackPlugin;
})();
var __webpack_exports__default = __webpack_exports__.Z;
export {
  __webpack_exports__default as default
};
