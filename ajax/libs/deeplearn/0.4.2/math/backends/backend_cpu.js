"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var seedrandom = require("seedrandom");
var environment_1 = require("../../environment");
var util = require("../../util");
var broadcast_util = require("../broadcast_util");
var concat_util = require("../concat_util");
var math_1 = require("../math");
var ndarray_1 = require("../ndarray");
var types = require("../types");
var types_1 = require("../types");
var axis_util = require("./../axis_util");
var matmul_1 = require("./types/matmul");
var MathBackendCPU = (function () {
    function MathBackendCPU() {
        this.data = {};
        if (typeof document !== 'undefined') {
            this.canvas = document.createElement('canvas');
        }
    }
    MathBackendCPU.prototype.register = function (dataId, shape, dtype) {
        this.data[dataId] = null;
    };
    MathBackendCPU.prototype.write = function (dataId, values) {
        if (values == null) {
            throw new Error('MathBackendCPU.write(): values can not be null');
        }
        this.throwIfNoData(dataId);
        this.data[dataId] = values;
    };
    MathBackendCPU.prototype.writePixels = function (dataId, pixels, numChannels) {
        if (pixels == null) {
            throw new Error('MathBackendCPU.writePixels(): pixels can not be null');
        }
        this.throwIfNoData(dataId);
        var vals;
        if (pixels instanceof ImageData) {
            vals = pixels.data;
        }
        else if (pixels instanceof HTMLCanvasElement) {
            vals = pixels.getContext('2d')
                .getImageData(0, 0, pixels.width, pixels.height)
                .data;
        }
        else if (pixels instanceof HTMLImageElement ||
            pixels instanceof HTMLVideoElement) {
            if (this.canvas == null) {
                throw new Error('Can\'t read pixels from HTMLImageElement outside ' +
                    'the browser.');
            }
            this.canvas.width = pixels.width;
            this.canvas.height = pixels.height;
            this.canvas.getContext('2d').drawImage(pixels, 0, 0, pixels.width, pixels.height);
            vals = this.canvas.getContext('2d')
                .getImageData(0, 0, pixels.width, pixels.height)
                .data;
        }
        else {
            throw new Error("pixels is of unknown type: " + pixels.constructor.name);
        }
        var values;
        if (numChannels === 4) {
            values = new Int32Array(vals);
        }
        else {
            var numPixels = pixels.width * pixels.height;
            values = new Int32Array(numPixels * numChannels);
            for (var i = 0; i < numPixels; i++) {
                for (var channel = 0; channel < numChannels; ++channel) {
                    values[i * numChannels + channel] = vals[i * 4 + channel];
                }
            }
        }
        this.data[dataId] = values;
    };
    MathBackendCPU.prototype.read = function (dataId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                this.throwIfNoData(dataId);
                return [2, this.data[dataId]];
            });
        });
    };
    MathBackendCPU.prototype.readSync = function (dataId) {
        this.throwIfNoData(dataId);
        return this.data[dataId];
    };
    MathBackendCPU.prototype.disposeData = function (dataId) {
        delete this.data[dataId];
    };
    MathBackendCPU.prototype.time = function (query) {
        return __awaiter(this, void 0, void 0, function () {
            var start;
            return __generator(this, function (_a) {
                start = performance.now();
                query();
                return [2, performance.now() - start];
            });
        });
    };
    MathBackendCPU.prototype.throwIfNoData = function (dataId) {
        if (!(dataId in this.data)) {
            throw new Error("No data found for NDArray with data id " + dataId + ". " +
                "Use dl.ENV.math instead of constructing your own NDArrayMath. " +
                "If you need to construct your own math, make sure this array is " +
                "allocated after the math construction");
        }
    };
    MathBackendCPU.prototype.clone = function (x) {
        return ndarray_1.NDArray.make(x.shape, { values: new Float32Array(x.dataSync()) });
    };
    MathBackendCPU.prototype.slice1D = function (x, begin, size) {
        var newVals = x.dataSync().slice(begin, begin + size);
        return ndarray_1.Array1D.new(newVals);
    };
    MathBackendCPU.prototype.slice2D = function (x, begin, size) {
        var result = ndarray_1.Array2D.zeros(size);
        var startI = begin[0], startJ = begin[1];
        for (var i = 0; i < size[0]; ++i) {
            for (var j = 0; j < size[1]; ++j) {
                var val = x.get(i + startI, j + startJ);
                result.set(val, i, j);
            }
        }
        return result;
    };
    MathBackendCPU.prototype.slice3D = function (x, begin, size) {
        var result = ndarray_1.Array3D.zeros(size);
        var startI = begin[0], startJ = begin[1], startK = begin[2];
        for (var i = 0; i < size[0]; ++i) {
            for (var j = 0; j < size[1]; ++j) {
                for (var k = 0; k < size[2]; ++k) {
                    var val = x.get(i + startI, j + startJ, k + startK);
                    result.set(val, i, j, k);
                }
            }
        }
        return result;
    };
    MathBackendCPU.prototype.slice4D = function (x, begin, size) {
        var result = ndarray_1.Array4D.zeros(size);
        var startI = begin[0], startJ = begin[1], startK = begin[2], startL = begin[3];
        for (var i = 0; i < size[0]; ++i) {
            for (var j = 0; j < size[1]; ++j) {
                for (var k = 0; k < size[2]; ++k) {
                    for (var l = 0; l < size[3]; ++l) {
                        var val = x.get(i + startI, j + startJ, k + startK, l + startL);
                        result.set(val, i, j, k, l);
                    }
                }
            }
        }
        return result;
    };
    MathBackendCPU.prototype.reverse4D = function (x, axis) {
        var result = ndarray_1.NDArray.like(x);
        var revAxis = function (i) { return axis.indexOf(i) !== -1 && x.shape[i] !== 1; };
        for (var b = 0; b < x.shape[0]; ++b) {
            for (var r = 0; r < x.shape[1]; ++r) {
                for (var c = 0; c < x.shape[2]; ++c) {
                    for (var d = 0; d < x.shape[3]; ++d) {
                        var b0 = revAxis(0) ? x.shape[0] - b - 1 : b;
                        var r0 = revAxis(1) ? x.shape[1] - r - 1 : r;
                        var c0 = revAxis(2) ? x.shape[2] - c - 1 : c;
                        var d0 = revAxis(3) ? x.shape[3] - d - 1 : d;
                        var val = x.get(b0, r0, c0, d0);
                        result.set(val, b, r, c, d);
                    }
                }
            }
        }
        return result;
    };
    MathBackendCPU.prototype.concat1D = function (a, b) {
        var outShape = concat_util.computeOutShape(a.shape, b.shape, 0);
        var result = ndarray_1.Array1D.zeros(outShape);
        var aVals = a.dataSync();
        var bVals = b.dataSync();
        var vals = result.dataSync();
        vals.set(aVals, 0);
        vals.set(bVals, a.size);
        return result;
    };
    MathBackendCPU.prototype.concat2D = function (a, b, axis) {
        var outShape = concat_util.computeOutShape(a.shape, b.shape, axis);
        var result = ndarray_1.Array2D.zeros(outShape);
        if (axis === 0) {
            var aVals = a.dataSync();
            var bVals = b.dataSync();
            var vals = result.dataSync();
            vals.set(aVals, 0);
            vals.set(bVals, a.size);
            return result;
        }
        for (var i = 0; i < outShape[0]; ++i) {
            for (var j = 0; j < outShape[1]; ++j) {
                var index = [i, j];
                var value = void 0;
                if (index[axis] < a.shape[axis]) {
                    value = a.get(i, j);
                }
                else {
                    index[axis] -= a.shape[axis];
                    var i2 = index[0], j2 = index[1];
                    value = b.get(i2, j2);
                }
                result.set(value, i, j);
            }
        }
        return result;
    };
    MathBackendCPU.prototype.concat3D = function (a, b, axis) {
        var outShape = concat_util.computeOutShape(a.shape, b.shape, axis);
        var result = ndarray_1.Array3D.zeros(outShape);
        if (axis === 0) {
            var aVals = a.dataSync();
            var bVals = b.dataSync();
            var vals = result.dataSync();
            vals.set(aVals, 0);
            vals.set(bVals, a.size);
            return result;
        }
        for (var i = 0; i < outShape[0]; ++i) {
            for (var j = 0; j < outShape[1]; ++j) {
                for (var k = 0; k < outShape[2]; ++k) {
                    var index = [i, j, k];
                    var value = void 0;
                    if (index[axis] < a.shape[axis]) {
                        value = a.get(i, j, k);
                    }
                    else {
                        index[axis] -= a.shape[axis];
                        var i2 = index[0], j2 = index[1], k2 = index[2];
                        value = b.get(i2, j2, k2);
                    }
                    result.set(value, i, j, k);
                }
            }
        }
        return result;
    };
    MathBackendCPU.prototype.concat4D = function (a, b, axis) {
        var outShape = concat_util.computeOutShape(a.shape, b.shape, axis);
        var result = ndarray_1.Array4D.zeros(outShape);
        if (axis === 0) {
            var aVals = a.dataSync();
            var bVals = b.dataSync();
            var vals = result.dataSync();
            vals.set(aVals, 0);
            vals.set(bVals, a.size);
            return result;
        }
        for (var i = 0; i < outShape[0]; ++i) {
            for (var j = 0; j < outShape[1]; ++j) {
                for (var k = 0; k < outShape[2]; ++k) {
                    for (var l = 0; l < outShape[3]; ++l) {
                        var index = [i, j, k, l];
                        var value = void 0;
                        if (index[axis] < a.shape[axis]) {
                            value = a.get(i, j, k, l);
                        }
                        else {
                            index[axis] -= a.shape[axis];
                            var i2 = index[0], j2 = index[1], k2 = index[2], l2 = index[3];
                            value = b.get(i2, j2, k2, l2);
                        }
                        result.set(value, i, j, k, l);
                    }
                }
            }
        }
        return result;
    };
    MathBackendCPU.prototype.neg = function (x) {
        return this.multiply(ndarray_1.Scalar.new(-1), x);
    };
    MathBackendCPU.prototype.add = function (a, b) {
        return this.broadcastedBinaryOp(a, b, types.upcastType(a.dtype, b.dtype), function (aValue, bValue) { return aValue + bValue; });
    };
    MathBackendCPU.prototype.subtract = function (a, b) {
        return this.broadcastedBinaryOp(a, b, types.upcastType(a.dtype, b.dtype), function (aValue, bValue) { return aValue - bValue; });
    };
    MathBackendCPU.prototype.pow = function (a, b) {
        return this.broadcastedBinaryOp(a, b, a.dtype, function (aValue, bValue) { return Math.pow(aValue, bValue); });
    };
    MathBackendCPU.prototype.matMul = function (a, b, aOrientation, bOrientation) {
        if (aOrientation === void 0) { aOrientation = matmul_1.MatrixOrientation.REGULAR; }
        if (bOrientation === void 0) { bOrientation = matmul_1.MatrixOrientation.REGULAR; }
        var sharedDim = (aOrientation === matmul_1.MatrixOrientation.REGULAR) ? a.shape[1] : a.shape[0];
        var leftDim = (aOrientation === matmul_1.MatrixOrientation.REGULAR) ? a.shape[0] : a.shape[1];
        var rightDim = (bOrientation === matmul_1.MatrixOrientation.REGULAR) ? b.shape[1] : b.shape[0];
        var normalGetter = function (matrix, i, j) {
            return matrix.get(i, j);
        };
        var transposedGetter = function (matrix, i, j) {
            return matrix.get(j, i);
        };
        var aGetter = (aOrientation === matmul_1.MatrixOrientation.REGULAR) ?
            normalGetter :
            transposedGetter;
        var bGetter = (bOrientation === matmul_1.MatrixOrientation.REGULAR) ?
            normalGetter :
            transposedGetter;
        var values = new Float32Array(leftDim * rightDim);
        var index = 0;
        for (var i = 0; i < leftDim; ++i) {
            for (var j = 0; j < rightDim; ++j) {
                var sum = 0;
                for (var k = 0; k < sharedDim; ++k) {
                    sum += aGetter(a, i, k) * bGetter(b, k, j);
                }
                values[index++] = sum;
            }
        }
        return ndarray_1.Array2D.new([leftDim, rightDim], values);
    };
    MathBackendCPU.prototype.multiply = function (a, b) {
        return this.broadcastedBinaryOp(a, b, types.upcastType(a.dtype, b.dtype), function (aValue, bValue) { return aValue * bValue; });
    };
    MathBackendCPU.prototype.divide = function (a, b) {
        return this.broadcastedBinaryOp(a, b, 'float32', function (aValue, bValue) { return aValue / bValue; });
    };
    MathBackendCPU.prototype.sum = function (x, axes) {
        axis_util.assertAxesAreInnerMostDims('sum', axes, x.rank);
        var _a = axis_util.computeOutAndReduceShapes(x.shape, axes), outShape = _a[0], reduceShape = _a[1];
        var resultDtype = types_1.SumTypesMap[x.dtype];
        var result = ndarray_1.NDArray.zeros(outShape, resultDtype);
        var reduceSize = util.sizeFromShape(reduceShape);
        var vals = result.dataSync();
        var aVals = x.dataSync();
        for (var i = 0; i < vals.length; ++i) {
            var offset = i * reduceSize;
            var sum = 0;
            for (var j = 0; j < reduceSize; ++j) {
                sum += aVals[offset + j];
            }
            vals[i] = sum;
        }
        return result;
    };
    MathBackendCPU.prototype.argMin = function (x, axes) {
        axis_util.assertAxesAreInnerMostDims('argMin', axes, x.rank);
        var _a = axis_util.computeOutAndReduceShapes(x.shape, axes), outShape = _a[0], reduceShape = _a[1];
        var result = ndarray_1.NDArray.zeros(outShape, 'int32');
        var reduceSize = util.sizeFromShape(reduceShape);
        var vals = result.dataSync();
        var aVals = x.dataSync();
        for (var i = 0; i < vals.length; ++i) {
            var offset = i * reduceSize;
            var min = aVals[offset];
            var minIndex = 0;
            for (var j = 0; j < reduceSize; ++j) {
                var value = aVals[offset + j];
                if (isNaN(value)) {
                    minIndex = util.NAN_INT32;
                    break;
                }
                if (value < min) {
                    min = value;
                    minIndex = j;
                }
            }
            vals[i] = minIndex;
        }
        return result;
    };
    MathBackendCPU.prototype.argMax = function (x, axes) {
        axis_util.assertAxesAreInnerMostDims('argMax', axes, x.rank);
        var _a = axis_util.computeOutAndReduceShapes(x.shape, axes), outShape = _a[0], reduceShape = _a[1];
        var result = ndarray_1.NDArray.zeros(outShape, 'int32');
        var reduceSize = util.sizeFromShape(reduceShape);
        var vals = result.dataSync();
        var aVals = x.dataSync();
        for (var i = 0; i < vals.length; ++i) {
            var offset = i * reduceSize;
            var max = aVals[offset];
            var maxIndex = 0;
            for (var j = 0; j < reduceSize; ++j) {
                var value = aVals[offset + j];
                if (isNaN(value)) {
                    maxIndex = util.NAN_INT32;
                    break;
                }
                if (value > max) {
                    max = value;
                    maxIndex = j;
                }
            }
            vals[i] = maxIndex;
        }
        return result;
    };
    MathBackendCPU.prototype.equal = function (a, b) {
        return this.broadcastedBinaryOp(a, b, 'bool', function (aVal, bVal) {
            if (util.isValNaN(aVal, a.dtype) || util.isValNaN(bVal, b.dtype)) {
                return util.getNaN('bool');
            }
            else {
                return (aVal === bVal) ? 1 : 0;
            }
        });
    };
    MathBackendCPU.prototype.notEqual = function (a, b) {
        return this.broadcastedBinaryOp(a, b, 'bool', function (aVal, bVal) {
            if (util.isValNaN(aVal, a.dtype) || util.isValNaN(bVal, b.dtype)) {
                return util.getNaN('bool');
            }
            else {
                return (aVal !== bVal) ? 1 : 0;
            }
        });
    };
    MathBackendCPU.prototype.lessEqual = function (a, b) {
        return this.broadcastedBinaryOp(a, b, 'bool', function (aVal, bVal) {
            if (util.isValNaN(aVal, a.dtype) || util.isValNaN(bVal, b.dtype)) {
                return util.getNaN('bool');
            }
            else {
                return (aVal <= bVal) ? 1 : 0;
            }
        });
    };
    MathBackendCPU.prototype.greater = function (a, b) {
        return this.broadcastedBinaryOp(a, b, 'bool', function (aVal, bVal) {
            if (util.isValNaN(aVal, a.dtype) || util.isValNaN(bVal, b.dtype)) {
                return util.getNaN('bool');
            }
            else {
                return (aVal > bVal) ? 1 : 0;
            }
        });
    };
    MathBackendCPU.prototype.greaterEqual = function (a, b) {
        return this.broadcastedBinaryOp(a, b, 'bool', function (aVal, bVal) {
            if (util.isValNaN(aVal, a.dtype) || util.isValNaN(bVal, b.dtype)) {
                return util.getNaN('bool');
            }
            else {
                return (aVal >= bVal) ? 1 : 0;
            }
        });
    };
    MathBackendCPU.prototype.logicalOr = function (a, b) {
        return this.broadcastedBinaryOp(a, b, 'bool', function (aVal, bVal) {
            if (util.isValNaN(aVal, a.dtype) || util.isValNaN(bVal, b.dtype)) {
                return util.getNaN('bool');
            }
            else {
                return aVal || bVal;
            }
        });
    };
    MathBackendCPU.prototype.topKValues = function (x, k) {
        return this.topK(x, k).values;
    };
    MathBackendCPU.prototype.topKIndices = function (x, k) {
        return this.topK(x, k).indices;
    };
    MathBackendCPU.prototype.topK = function (x, k) {
        var values = x.dataSync();
        var valuesAndIndices = [];
        for (var i = 0; i < values.length; i++) {
            valuesAndIndices.push({ value: values[i], index: i });
        }
        valuesAndIndices.sort(function (a, b) {
            return b.value - a.value;
        });
        var topkValues = util.getTypedArrayFromDType(x.dtype, k);
        var topkIndices = new Int32Array(k);
        for (var i = 0; i < k; i++) {
            topkValues[i] = valuesAndIndices[i].value;
            topkIndices[i] = valuesAndIndices[i].index;
        }
        return {
            values: ndarray_1.Array1D.new(topkValues),
            indices: ndarray_1.Array1D.new(topkIndices)
        };
    };
    MathBackendCPU.prototype.min = function (x, axes) {
        axis_util.assertAxesAreInnerMostDims('min', axes, x.rank);
        var _a = axis_util.computeOutAndReduceShapes(x.shape, axes), outShape = _a[0], reduceShape = _a[1];
        var result = ndarray_1.NDArray.zeros(outShape, x.dtype);
        var reduceSize = util.sizeFromShape(reduceShape);
        var vals = result.dataSync();
        var aVals = x.dataSync();
        for (var i = 0; i < vals.length; ++i) {
            var offset = i * reduceSize;
            var min = aVals[0];
            for (var j = 0; j < reduceSize; ++j) {
                var value = aVals[offset + j];
                if (isNaN(value)) {
                    min = Number.NaN;
                    break;
                }
                if (value < min) {
                    min = value;
                }
            }
            vals[i] = min;
        }
        return result;
    };
    MathBackendCPU.prototype.minimum = function (a, b) {
        return this.broadcastedBinaryOp(a, b, a.dtype, function (aVal, bVal) { return Math.min(aVal, bVal); });
    };
    MathBackendCPU.prototype.max = function (x, axes) {
        axis_util.assertAxesAreInnerMostDims('max', axes, x.rank);
        var _a = axis_util.computeOutAndReduceShapes(x.shape, axes), outShape = _a[0], reduceShape = _a[1];
        var result = ndarray_1.NDArray.zeros(outShape, x.dtype);
        var reduceSize = util.sizeFromShape(reduceShape);
        var vals = result.dataSync();
        var aVals = x.dataSync();
        for (var i = 0; i < vals.length; ++i) {
            var offset = i * reduceSize;
            var max = aVals[offset];
            for (var j = 0; j < reduceSize; ++j) {
                var value = aVals[offset + j];
                if (isNaN(value)) {
                    max = Number.NaN;
                    break;
                }
                if (value > max) {
                    max = value;
                }
            }
            vals[i] = max;
        }
        return result;
    };
    MathBackendCPU.prototype.maximum = function (a, b) {
        return this.broadcastedBinaryOp(a, b, a.dtype, function (aVal, bVal) { return Math.max(aVal, bVal); });
    };
    MathBackendCPU.prototype.ceil = function (x) {
        var values = x.dataSync();
        var newValues = new Float32Array(values.length);
        for (var i = 0; i < values.length; ++i) {
            newValues[i] = Math.ceil(values[i]);
        }
        return ndarray_1.NDArray.make(x.shape, { values: newValues });
    };
    MathBackendCPU.prototype.floor = function (x) {
        var values = x.dataSync();
        var newValues = new Float32Array(values.length);
        for (var i = 0; i < values.length; ++i) {
            newValues[i] = Math.floor(values[i]);
        }
        return ndarray_1.NDArray.make(x.shape, { values: newValues });
    };
    MathBackendCPU.prototype.exp = function (x) {
        var values = x.dataSync();
        var newValues = new Float32Array(values.length);
        for (var i = 0; i < values.length; ++i) {
            newValues[i] = Math.exp(values[i]);
        }
        return ndarray_1.NDArray.make(x.shape, { values: newValues });
    };
    MathBackendCPU.prototype.log = function (x) {
        var values = x.dataSync();
        var newValues = new Float32Array(values.length);
        for (var i = 0; i < values.length; ++i) {
            var value = values[i];
            newValues[i] = Math.log(value);
        }
        return ndarray_1.NDArray.make(x.shape, { values: newValues });
    };
    MathBackendCPU.prototype.sqrt = function (x) {
        var values = x.dataSync();
        var newValues = new Float32Array(values.length);
        for (var i = 0; i < values.length; ++i) {
            var value = values[i];
            newValues[i] = Math.sqrt(value);
        }
        return ndarray_1.NDArray.make(x.shape, { values: newValues });
    };
    MathBackendCPU.prototype.square = function (x) {
        var values = x.dataSync();
        var newValues = new Float32Array(values.length);
        for (var i = 0; i < values.length; ++i) {
            var value = values[i];
            newValues[i] = value * value;
        }
        return ndarray_1.NDArray.make(x.shape, { values: newValues });
    };
    MathBackendCPU.prototype.relu = function (x) {
        var res = ndarray_1.NDArray.zeros(x.shape, x.dtype);
        var resVals = res.dataSync();
        var inVals = x.dataSync();
        for (var i = 0; i < inVals.length; ++i) {
            var val = inVals[i];
            if (util.isValNaN(val, x.dtype)) {
                resVals[i] = util.getNaN(res.dtype);
            }
            else {
                resVals[i] = Math.max(0, inVals[i]);
            }
        }
        return res;
    };
    MathBackendCPU.prototype.elu = function (x) {
        var resultValues = new Float32Array(x.size);
        var values = x.dataSync();
        for (var i = 0; i < values.length; ++i) {
            var v = values[i];
            if (v >= 0) {
                resultValues[i] = v;
            }
            else {
                resultValues[i] = (Math.exp(v) - 1);
            }
        }
        return ndarray_1.NDArray.make(x.shape, { values: resultValues });
    };
    MathBackendCPU.prototype.eluDer = function (x) {
        var resultValues = new Float32Array(x.size);
        var values = x.dataSync();
        for (var i = 0; i < values.length; ++i) {
            var v = values[i];
            if (v >= 0) {
                resultValues[i] = 1;
            }
            else {
                resultValues[i] = Math.exp(v);
            }
        }
        return ndarray_1.NDArray.make(x.shape, { values: resultValues });
    };
    MathBackendCPU.prototype.selu = function (x) {
        var scaleAlpha = 1.7580993408473768599402175208123;
        var scale = 1.0507009873554804934193349852946;
        var resultValues = new Float32Array(x.size);
        var values = x.dataSync();
        for (var i = 0; i < values.length; ++i) {
            var v = values[i];
            if (v >= 0) {
                resultValues[i] = scale * v;
            }
            else {
                resultValues[i] = scaleAlpha * (Math.exp(v) - 1);
            }
        }
        return ndarray_1.NDArray.make(x.shape, { values: resultValues });
    };
    MathBackendCPU.prototype.leakyRelu = function (x, alpha) {
        var resultValues = new Float32Array(x.size);
        var values = x.dataSync();
        for (var i = 0; i < values.length; i++) {
            var v = values[i];
            if (v >= 0) {
                resultValues[i] = v;
            }
            else {
                resultValues[i] = alpha * v;
            }
        }
        return ndarray_1.NDArray.make(x.shape, { values: resultValues });
    };
    MathBackendCPU.prototype.prelu = function (x, alpha) {
        var resultValues = new Float32Array(x.size);
        var values = x.dataSync();
        var alphas = alpha.dataSync();
        for (var i = 0; i < values.length; i++) {
            var v = values[i];
            if (v >= 0) {
                resultValues[i] = v;
            }
            else {
                resultValues[i] = alphas[i] * v;
            }
        }
        return ndarray_1.NDArray.make(x.shape, { values: resultValues });
    };
    MathBackendCPU.prototype.preluDer = function (x, alpha) {
        var resultValues = new Float32Array(x.size);
        var values = x.dataSync();
        var alphas = alpha.dataSync();
        for (var i = 0; i < values.length; i++) {
            var v = values[i];
            if (v > 0) {
                resultValues[i] = 1;
            }
            else if (v < 0) {
                resultValues[i] = alphas[i];
            }
            else {
                resultValues[i] = v;
            }
        }
        return ndarray_1.NDArray.make(x.shape, { values: resultValues });
    };
    MathBackendCPU.prototype.clip = function (x, min, max) {
        var resultValues = new Float32Array(x.size);
        var values = x.dataSync();
        for (var i = 0; i < values.length; ++i) {
            resultValues[i] = Math.min(max, Math.max(min, values[i]));
        }
        return ndarray_1.NDArray.make(x.shape, { values: resultValues });
    };
    MathBackendCPU.prototype.abs = function (x) {
        var resultValues = new Float32Array(x.size);
        var values = x.dataSync();
        for (var i = 0; i < values.length; ++i) {
            resultValues[i] = Math.abs(values[i]);
        }
        return ndarray_1.NDArray.make(x.shape, { values: resultValues });
    };
    MathBackendCPU.prototype.int = function (x) {
        var resultValues = new Int32Array(x.size);
        var values = x.dataSync();
        for (var i = 0; i < values.length; ++i) {
            resultValues[i] = values[i];
        }
        return ndarray_1.NDArray.make(x.shape, { values: resultValues }, 'int32');
    };
    MathBackendCPU.prototype.sigmoid = function (x) {
        var resultValues = new Float32Array(x.size);
        var values = x.dataSync();
        for (var i = 0; i < values.length; ++i) {
            resultValues[i] = 1 / (1 + Math.exp(-values[i]));
        }
        return ndarray_1.NDArray.make(x.shape, { values: resultValues });
    };
    MathBackendCPU.prototype.sin = function (x) {
        var resultValues = new Float32Array(x.size);
        var values = x.dataSync();
        for (var i = 0; i < values.length; ++i) {
            resultValues[i] = Math.sin(values[i]);
        }
        return ndarray_1.NDArray.make(x.shape, { values: resultValues });
    };
    MathBackendCPU.prototype.cos = function (x) {
        var resultValues = new Float32Array(x.size);
        var values = x.dataSync();
        for (var i = 0; i < values.length; ++i) {
            resultValues[i] = Math.cos(values[i]);
        }
        return ndarray_1.NDArray.make(x.shape, { values: resultValues });
    };
    MathBackendCPU.prototype.tan = function (x) {
        var resultValues = new Float32Array(x.size);
        var values = x.dataSync();
        for (var i = 0; i < values.length; ++i) {
            resultValues[i] = Math.tan(values[i]);
        }
        return ndarray_1.NDArray.make(x.shape, { values: resultValues });
    };
    MathBackendCPU.prototype.asin = function (x) {
        var resultValues = new Float32Array(x.size);
        var values = x.dataSync();
        for (var i = 0; i < values.length; ++i) {
            resultValues[i] = Math.asin(values[i]);
        }
        return ndarray_1.NDArray.make(x.shape, { values: resultValues });
    };
    MathBackendCPU.prototype.acos = function (x) {
        var resultValues = new Float32Array(x.size);
        var values = x.dataSync();
        for (var i = 0; i < values.length; ++i) {
            resultValues[i] = Math.acos(values[i]);
        }
        return ndarray_1.NDArray.make(x.shape, { values: resultValues });
    };
    MathBackendCPU.prototype.atan = function (x) {
        var resultValues = new Float32Array(x.size);
        var values = x.dataSync();
        for (var i = 0; i < values.length; ++i) {
            resultValues[i] = Math.atan(values[i]);
        }
        return ndarray_1.NDArray.make(x.shape, { values: resultValues });
    };
    MathBackendCPU.prototype.sinh = function (x) {
        var resultValues = new Float32Array(x.size);
        var values = x.dataSync();
        for (var i = 0; i < values.length; ++i) {
            resultValues[i] = Math.sinh(values[i]);
        }
        return ndarray_1.NDArray.make(x.shape, { values: resultValues });
    };
    MathBackendCPU.prototype.cosh = function (x) {
        var resultValues = new Float32Array(x.size);
        var values = x.dataSync();
        for (var i = 0; i < values.length; ++i) {
            resultValues[i] = Math.cosh(values[i]);
        }
        return ndarray_1.NDArray.make(x.shape, { values: resultValues });
    };
    MathBackendCPU.prototype.tanh = function (x) {
        var resultValues = new Float32Array(x.size);
        var values = x.dataSync();
        for (var i = 0; i < values.length; ++i) {
            resultValues[i] = util.tanh(values[i]);
        }
        return ndarray_1.NDArray.make(x.shape, { values: resultValues });
    };
    MathBackendCPU.prototype.step = function (x, alpha) {
        if (alpha === void 0) { alpha = 0; }
        var resultValues = new Float32Array(x.size);
        var values = x.dataSync();
        for (var i = 0; i < values.length; ++i) {
            var value = values[i];
            if (util.isValNaN(value, x.dtype)) {
                resultValues[i] = util.getNaN(x.dtype);
            }
            else {
                resultValues[i] = value > 0 ? 1 : alpha;
            }
        }
        return ndarray_1.NDArray.make(x.shape, { values: resultValues });
    };
    MathBackendCPU.prototype.conv2d = function (x, filter, bias, convInfo) {
        var filterHeight = convInfo.filterHeight;
        var filterWidth = convInfo.filterWidth;
        var padLeft = convInfo.padInfo.left;
        var padTop = convInfo.padInfo.top;
        var y = ndarray_1.Array4D.zeros(convInfo.outShape);
        for (var b = 0; b < convInfo.batchSize; ++b) {
            for (var d2 = 0; d2 < convInfo.outChannels; ++d2) {
                for (var yR = 0; yR < convInfo.outHeight; ++yR) {
                    var xRCorner = yR * convInfo.strideHeight - padLeft;
                    var xRMin = Math.max(0, xRCorner);
                    var xRMax = Math.min(convInfo.inHeight, filterHeight + xRCorner);
                    for (var yC = 0; yC < convInfo.outWidth; ++yC) {
                        var xCCorner = yC * convInfo.strideWidth - padTop;
                        var xCMin = Math.max(0, xCCorner);
                        var xCMax = Math.min(convInfo.inWidth, filterWidth + xCCorner);
                        var dotProd = 0;
                        for (var xR = xRMin; xR < xRMax; ++xR) {
                            var wR = xR - xRCorner;
                            for (var xC = xCMin; xC < xCMax; ++xC) {
                                var wC = xC - xCCorner;
                                for (var d1 = 0; d1 < convInfo.inChannels; ++d1) {
                                    var pixel = x.get(b, xR, xC, d1);
                                    var weight = filter.get(wR, wC, d1, d2);
                                    dotProd += pixel * weight;
                                }
                            }
                        }
                        var biasVal = (bias != null) ? bias.get(d2) : 0;
                        y.set(dotProd + biasVal, b, yR, yC, d2);
                    }
                }
            }
        }
        return y;
    };
    MathBackendCPU.prototype.conv2dDerInput = function (dy, filter, convInfo) {
        var filterHeight = convInfo.filterHeight;
        var filterWidth = convInfo.filterWidth;
        var topPad = filterHeight - 1 - convInfo.padInfo.top;
        var leftPad = filterWidth - 1 - convInfo.padInfo.left;
        var strideHeight = convInfo.strideHeight;
        var strideWidth = convInfo.strideWidth;
        var dx = ndarray_1.Array4D.zeros(convInfo.inShape);
        for (var b = 0; b < convInfo.batchSize; ++b) {
            for (var d1 = 0; d1 < convInfo.inChannels; ++d1) {
                for (var xR = 0; xR < convInfo.inHeight; ++xR) {
                    var xRCorner = xR - leftPad;
                    var xRMin = Math.max(0, Math.ceil(xRCorner / strideHeight));
                    var yRMax = Math.min(convInfo.outHeight, (filterHeight + xRCorner) / strideHeight);
                    for (var xC = 0; xC < convInfo.inWidth; ++xC) {
                        var xCCorner = xC - topPad;
                        var xCMin = Math.max(0, Math.ceil(xCCorner / strideWidth));
                        var yCMax = Math.min(convInfo.outWidth, (filterWidth + xCCorner) / strideWidth);
                        var dotProd = 0;
                        for (var yR = xRMin; yR < yRMax; ++yR) {
                            var wR = yR * strideHeight - xRCorner;
                            for (var yC = xCMin; yC < yCMax; ++yC) {
                                var wC = yC * strideWidth - xCCorner;
                                for (var d2 = 0; d2 < convInfo.outChannels; ++d2) {
                                    var pixel = dy.get(b, yR, yC, d2);
                                    var weight = filter.get(filterHeight - 1 - wR, filterWidth - 1 - wC, d1, d2);
                                    dotProd += pixel * weight;
                                }
                            }
                        }
                        dx.set(dotProd, b, xR, xC, d1);
                    }
                }
            }
        }
        return dx;
    };
    MathBackendCPU.prototype.conv2dDerFilter = function (x, dy, convInfo) {
        var strideHeight = convInfo.strideHeight;
        var strideWidth = convInfo.strideWidth;
        var filterHeight = convInfo.filterHeight;
        var filterWidth = convInfo.filterWidth;
        var dW = ndarray_1.Array4D.zeros(convInfo.filterShape);
        var leftPad = convInfo.padInfo.left;
        var topPad = convInfo.padInfo.top;
        for (var wR = 0; wR < filterHeight; ++wR) {
            var yRMin = Math.max(0, Math.ceil((topPad - wR) / strideHeight));
            var yRMax = Math.min(convInfo.outHeight, (convInfo.inHeight + topPad - wR) / strideHeight);
            for (var wC = 0; wC < filterWidth; ++wC) {
                var yCMin = Math.max(0, Math.ceil((leftPad - wC) / strideWidth));
                var yCMax = Math.min(convInfo.outWidth, (convInfo.inWidth + leftPad - wC) / strideWidth);
                for (var d1 = 0; d1 < convInfo.inChannels; ++d1) {
                    for (var d2 = 0; d2 < convInfo.outChannels; ++d2) {
                        var dotProd = 0;
                        for (var b = 0; b < convInfo.batchSize; ++b) {
                            for (var yR = yRMin; yR < yRMax; ++yR) {
                                var xR = wR + yR * strideHeight - topPad;
                                for (var yC = yCMin; yC < yCMax; ++yC) {
                                    var xC = wC + yC * strideWidth - leftPad;
                                    dotProd += x.get(b, xR, xC, d1) * dy.get(b, yR, yC, d2);
                                }
                            }
                        }
                        dW.set(dotProd, wR, wC, d1, d2);
                    }
                }
            }
        }
        return dW;
    };
    MathBackendCPU.prototype.conv2dDerBias = function (dy) {
        var _a = dy.shape, batchSize = _a[0], numRows = _a[1], numCols = _a[2], outDepth = _a[3];
        var values = new Float32Array(outDepth);
        for (var d2 = 0; d2 < outDepth; ++d2) {
            var sum = 0;
            for (var b = 0; b < batchSize; ++b) {
                for (var r = 0; r < numRows; ++r) {
                    for (var c = 0; c < numCols; ++c) {
                        sum += dy.get(b, r, c, d2);
                    }
                }
            }
            values[d2] = sum;
        }
        return ndarray_1.Array1D.new(values);
    };
    MathBackendCPU.prototype.depthwiseConv2D = function (x, filter, convInfo) {
        var filterHeight = convInfo.filterHeight;
        var filterWidth = convInfo.filterWidth;
        var padLeft = convInfo.padInfo.left;
        var padTop = convInfo.padInfo.top;
        var chMul = convInfo.outChannels / convInfo.inChannels;
        var y = ndarray_1.Array4D.zeros(convInfo.outShape);
        for (var b = 0; b < convInfo.batchSize; ++b) {
            for (var d1 = 0; d1 < convInfo.inChannels; ++d1) {
                for (var yR = 0; yR < convInfo.outHeight; ++yR) {
                    var xRCorner = yR * convInfo.strideHeight - padLeft;
                    var xRMin = Math.max(0, xRCorner);
                    var xRMax = Math.min(convInfo.inHeight, filterHeight + xRCorner);
                    for (var yC = 0; yC < convInfo.outWidth; ++yC) {
                        var xCCorner = yC * convInfo.strideWidth - padTop;
                        var xCMin = Math.max(0, xCCorner);
                        var xCMax = Math.min(convInfo.inWidth, filterWidth + xCCorner);
                        for (var q = 0; q < chMul; ++q) {
                            var dotProd = 0;
                            for (var xR = xRMin; xR < xRMax; ++xR) {
                                var wR = xR - xRCorner;
                                for (var xC = xCMin; xC < xCMax; ++xC) {
                                    var wC = xC - xCCorner;
                                    var pixel = x.get(b, xR, xC, d1);
                                    var weight = filter.get(wR, wC, d1, q);
                                    dotProd += pixel * weight;
                                }
                            }
                            y.set(dotProd, b, yR, yC, d1 * chMul + q);
                        }
                    }
                }
            }
        }
        return y;
    };
    MathBackendCPU.prototype.tile = function (x, reps) {
        var newShape = new Array(x.rank);
        for (var i = 0; i < newShape.length; i++) {
            newShape[i] = x.shape[i] * reps[i];
        }
        var dtype;
        if (x.dtype === 'float32') {
            dtype = Float32Array;
        }
        else if (x.dtype === 'int32') {
            dtype = Int32Array;
        }
        else if (x.dtype === 'bool') {
            dtype = Uint8Array;
        }
        else {
            throw new Error("Dtype " + x.dtype + " not supported for tile");
        }
        var resultValues = new dtype(util.sizeFromShape(newShape));
        var result = ndarray_1.NDArray.make(newShape, { values: resultValues }, x.dtype);
        var values = x.dataSync();
        for (var i = 0; i < result.size; ++i) {
            var newLoc = result.indexToLoc(i);
            var originalLoc = new Array(x.rank);
            for (var i_1 = 0; i_1 < originalLoc.length; i_1++) {
                originalLoc[i_1] = newLoc[i_1] % x.shape[i_1];
            }
            var originalIndex = x.locToIndex(originalLoc);
            resultValues[i] = values[originalIndex];
        }
        return result;
    };
    MathBackendCPU.prototype.pad1D = function (x, paddings, constantValue) {
        var leftPadding = paddings[0];
        var rightPadding = paddings[1];
        var dtype;
        if (x.dtype === 'float32') {
            dtype = Float32Array;
        }
        else if (x.dtype === 'int32') {
            dtype = Int32Array;
        }
        else if (x.dtype === 'bool') {
            dtype = Uint8Array;
        }
        else {
            throw new Error("Dtype " + x.dtype + " not supported for tile");
        }
        var values = x.dataSync();
        var newValues = new dtype(leftPadding + values.length + rightPadding);
        var z = 0;
        for (var i = 0; i < newValues.length; i++) {
            if (i >= leftPadding && i < leftPadding + values.length) {
                newValues[i] = values[z++];
            }
            else {
                newValues[i] = constantValue;
            }
        }
        return ndarray_1.Array1D.new(newValues);
    };
    MathBackendCPU.prototype.pad2D = function (x, paddings, constantValue) {
        var topPadding = paddings[0][0];
        var bottomPadding = paddings[0][1];
        var leftPadding = paddings[1][0];
        var rightPadding = paddings[1][1];
        var newShape = [
            topPadding + x.shape[0] + bottomPadding,
            leftPadding + x.shape[1] + rightPadding
        ];
        var dtype;
        if (x.dtype === 'float32') {
            dtype = Float32Array;
        }
        else if (x.dtype === 'int32') {
            dtype = Int32Array;
        }
        else if (x.dtype === 'bool') {
            dtype = Uint8Array;
        }
        else {
            throw new Error("Dtype " + x.dtype + " not supported for tile");
        }
        var values = x.dataSync();
        var newValues = new dtype(util.sizeFromShape(newShape));
        var z = 0;
        for (var i = 0; i < newShape[0]; i++) {
            var rangeStart = -1;
            var rangeEnd = -1;
            if (i >= topPadding && i < newShape[0] - bottomPadding) {
                rangeStart = i * newShape[1] + leftPadding;
                rangeEnd = rangeStart + x.shape[1] - 1;
            }
            for (var j = 0; j < newShape[1]; j++) {
                var v = i * newShape[1] + j;
                if (v >= rangeStart && v <= rangeEnd) {
                    newValues[v] = values[z++];
                }
                else {
                    newValues[v] = constantValue;
                }
            }
        }
        return ndarray_1.Array2D.new(newShape, newValues);
    };
    MathBackendCPU.prototype.transpose = function (x, perm) {
        var newShape = new Array(x.rank);
        for (var i = 0; i < newShape.length; i++) {
            newShape[i] = x.shape[perm[i]];
        }
        var resultValues = new Float32Array(x.size);
        var values = x.dataSync();
        var result = ndarray_1.NDArray.make(newShape, { values: resultValues });
        for (var i = 0; i < x.size; ++i) {
            var loc = x.indexToLoc(i);
            var newLoc = new Array(loc.length);
            for (var i_2 = 0; i_2 < newLoc.length; i_2++) {
                newLoc[i_2] = loc[perm[i_2]];
            }
            var newIndex = result.locToIndex(newLoc);
            resultValues[newIndex] = values[i];
        }
        return result;
    };
    MathBackendCPU.prototype.pool = function (x, convInfo, poolType) {
        var strideHeight = convInfo.strideHeight;
        var strideWidth = convInfo.strideWidth;
        var filterHeight = convInfo.filterHeight;
        var filterWidth = convInfo.filterWidth;
        var y = ndarray_1.Array4D.zeros(convInfo.outShape);
        var padTop = convInfo.padInfo.top;
        var padLeft = convInfo.padInfo.left;
        for (var b = 0; b < convInfo.batchSize; ++b) {
            for (var d = 0; d < convInfo.inChannels; ++d) {
                for (var yR = 0; yR < convInfo.outHeight; ++yR) {
                    var xRCorner = yR * strideHeight - padTop;
                    var xRMin = Math.max(0, xRCorner);
                    var xRMax = Math.min(convInfo.inHeight, filterHeight + xRCorner);
                    for (var yC = 0; yC < convInfo.outWidth; ++yC) {
                        var xCCorner = yC * strideWidth - padLeft;
                        var xCMin = Math.max(0, xCCorner);
                        var xCMax = Math.min(convInfo.inWidth, filterWidth + xCCorner);
                        var minMaxValue = (poolType === 'max' ? Number.NEGATIVE_INFINITY :
                            Number.POSITIVE_INFINITY);
                        var avgValue = 0;
                        for (var xR = xRMin; xR < xRMax; ++xR) {
                            for (var xC = xCMin; xC < xCMax; ++xC) {
                                var pixel = x.get(b, xR, xC, d);
                                if (isNaN(pixel)) {
                                    minMaxValue = NaN;
                                    avgValue = NaN;
                                    break;
                                }
                                if ((poolType === 'max' && pixel > minMaxValue) ||
                                    (poolType === 'min' && pixel < minMaxValue)) {
                                    minMaxValue = pixel;
                                }
                                else if (poolType === 'avg') {
                                    avgValue += pixel / (filterHeight * filterWidth);
                                }
                            }
                            if (isNaN(minMaxValue)) {
                                break;
                            }
                        }
                        y.set(poolType === 'avg' ? avgValue : minMaxValue, b, yR, yC, d);
                    }
                }
            }
        }
        return y;
    };
    MathBackendCPU.prototype.maxPool = function (x, convInfo) {
        return this.pool(x, convInfo, 'max');
    };
    MathBackendCPU.prototype.maxPoolPositions = function (x, convInfo) {
        var maxPositions = ndarray_1.Array4D.zeros(convInfo.outShape);
        var strideHeight = convInfo.strideHeight;
        var strideWidth = convInfo.strideWidth;
        var filterHeight = convInfo.filterHeight;
        var filterWidth = convInfo.filterWidth;
        var padTop = convInfo.padInfo.top;
        var padLeft = convInfo.padInfo.left;
        for (var b = 0; b < convInfo.batchSize; ++b) {
            for (var d = 0; d < convInfo.inChannels; ++d) {
                for (var yR = 0; yR < convInfo.outHeight; ++yR) {
                    var xRCorner = yR * strideHeight - padTop;
                    var xRMin = Math.max(0, xRCorner);
                    var xRMax = Math.min(convInfo.inHeight, filterHeight + xRCorner);
                    for (var yC = 0; yC < convInfo.outWidth; ++yC) {
                        var xCCorner = yC * strideWidth - padLeft;
                        var xCMin = Math.max(0, xCCorner);
                        var xCMax = Math.min(convInfo.inWidth, filterWidth + xCCorner);
                        var maxValue = Number.NEGATIVE_INFINITY;
                        var maxPosition = -1;
                        for (var xR = xRMin; xR < xRMax; ++xR) {
                            var wR = xR - xRCorner;
                            for (var xC = xCMin; xC < xCMax; ++xC) {
                                var wC = xC - xCCorner;
                                var pixel = x.get(b, xR, xC, d);
                                if (pixel > maxValue) {
                                    maxValue = pixel;
                                    maxPosition = wR * filterWidth + wC;
                                }
                            }
                        }
                        maxPositions.set(maxPosition, b, yR, yC, d);
                    }
                }
            }
        }
        return maxPositions;
    };
    MathBackendCPU.prototype.maxPoolBackprop = function (dy, x, convInfo) {
        var maxPositions = this.maxPoolPositions(x, convInfo);
        var strideHeight = convInfo.strideHeight;
        var strideWidth = convInfo.strideWidth;
        var filterHeight = convInfo.filterHeight;
        var filterWidth = convInfo.filterWidth;
        var padLeft = filterWidth - 1 - convInfo.padInfo.left;
        var padTop = filterHeight - 1 - convInfo.padInfo.top;
        var dx = ndarray_1.Array4D.zeros(x.shape);
        for (var b = 0; b < convInfo.batchSize; ++b) {
            for (var d = 0; d < convInfo.inChannels; ++d) {
                for (var dxR = 0; dxR < convInfo.inHeight; ++dxR) {
                    for (var dxC = 0; dxC < convInfo.inWidth; ++dxC) {
                        var dyRCorner = dxR - padTop;
                        var dyCCorner = dxC - padLeft;
                        var dotProd = 0;
                        for (var wR = 0; wR < filterHeight; ++wR) {
                            var dyR = (dyRCorner + wR) / strideHeight;
                            if (dyR < 0 || dyR >= convInfo.outHeight ||
                                Math.floor(dyR) !== dyR) {
                                continue;
                            }
                            for (var wC = 0; wC < filterWidth; ++wC) {
                                var dyC = (dyCCorner + wC) / strideWidth;
                                if (dyC < 0 || dyC >= convInfo.outWidth ||
                                    Math.floor(dyC) !== dyC) {
                                    continue;
                                }
                                var maxPos = filterHeight * filterWidth - 1 -
                                    maxPositions.get(b, dyR, dyC, d);
                                var curPos = wR * filterWidth + wC;
                                var mask = maxPos === curPos ? 1 : 0;
                                if (mask === 0) {
                                    continue;
                                }
                                var pixel = dy.get(b, dyR, dyC, d);
                                dotProd += pixel * mask;
                            }
                        }
                        dx.set(dotProd, b, dxR, dxC, d);
                    }
                }
            }
        }
        return dx.asType(x.dtype);
    };
    MathBackendCPU.prototype.avgPoolBackprop = function (dy, x, convInfo) {
        var strideHeight = convInfo.strideHeight;
        var strideWidth = convInfo.strideWidth;
        var filterHeight = convInfo.filterHeight;
        var filterWidth = convInfo.filterWidth;
        var padLeft = filterWidth - 1 - convInfo.padInfo.left;
        var padTop = filterHeight - 1 - convInfo.padInfo.top;
        var dx = ndarray_1.Array4D.zeros(x.shape);
        var avgMultiplier = 1 / (filterHeight * filterWidth);
        for (var b = 0; b < convInfo.batchSize; ++b) {
            for (var d = 0; d < convInfo.inChannels; ++d) {
                for (var dxR = 0; dxR < convInfo.inHeight; ++dxR) {
                    for (var dxC = 0; dxC < convInfo.inWidth; ++dxC) {
                        var dyRCorner = dxR - padTop;
                        var dyCCorner = dxC - padLeft;
                        var dotProd = 0;
                        for (var wR = 0; wR < filterHeight; ++wR) {
                            var dyR = (dyRCorner + wR) / strideHeight;
                            if (dyR < 0 || dyR >= convInfo.outHeight ||
                                Math.floor(dyR) !== dyR) {
                                continue;
                            }
                            for (var wC = 0; wC < filterWidth; ++wC) {
                                var dyC = (dyCCorner + wC) / strideWidth;
                                if (dyC < 0 || dyC >= convInfo.outWidth ||
                                    Math.floor(dyC) !== dyC) {
                                    continue;
                                }
                                var pixel = dy.get(b, dyR, dyC, d);
                                dotProd += pixel;
                            }
                        }
                        dx.set(dotProd * avgMultiplier, b, dxR, dxC, d);
                    }
                }
            }
        }
        return dx.asType(x.dtype);
    };
    MathBackendCPU.prototype.minPool = function (x, convInfo) {
        return this.pool(x, convInfo, 'min');
    };
    MathBackendCPU.prototype.avgPool = function (x, convInfo) {
        return this.pool(x, convInfo, 'avg').asType('float32');
    };
    MathBackendCPU.prototype.resizeBilinear3D = function (x, newShape2D, alignCorners) {
        var output = ndarray_1.Array3D.zeros([newShape2D[0], newShape2D[1], x.shape[2]]);
        var effectiveInputSize = alignCorners ? [x.shape[0] - 1, x.shape[1] - 1, x.shape[2]] : x.shape;
        var effectiveOutputSize = alignCorners ?
            [output.shape[0] - 1, output.shape[1] - 1, output.shape[2]] :
            output.shape;
        for (var r = 0; r < output.shape[0]; r++) {
            for (var c = 0; c < output.shape[1]; c++) {
                for (var d = 0; d < output.shape[2]; d++) {
                    var sourceFracRow = (effectiveInputSize[0]) * r / (effectiveOutputSize[0]);
                    var sourceFracCol = (effectiveInputSize[1]) * c / (effectiveOutputSize[1]);
                    var sourceRowFloor = Math.floor(sourceFracRow);
                    var sourceRowCeil = Math.min(x.shape[0] - 1, Math.ceil(sourceFracRow));
                    var sourceColFloor = Math.floor(sourceFracCol);
                    var sourceColCeil = Math.min(x.shape[1] - 1, Math.ceil(sourceFracCol));
                    var topLeft = x.get(sourceRowFloor, sourceColFloor, d);
                    var bottomLeft = x.get(sourceRowCeil, sourceColFloor, d);
                    var topRight = x.get(sourceRowFloor, sourceColCeil, d);
                    var bottomRight = x.get(sourceRowCeil, sourceColCeil, d);
                    var rowFrac = sourceFracRow - sourceRowFloor;
                    var colFrac = sourceFracCol - sourceColFloor;
                    var top_1 = topLeft + (topRight - topLeft) * colFrac;
                    var bottom = bottomLeft + (bottomRight - bottomLeft) * colFrac;
                    var newValue = top_1 + (bottom - top_1) * rowFrac;
                    output.set(newValue, r, c, d);
                }
            }
        }
        return output;
    };
    MathBackendCPU.prototype.batchNormalization2D = function (x, mean, variance, varianceEpsilon, scale, offset) {
        var xValues = x.dataSync();
        var meanValues = mean.dataSync();
        var varianceValues = variance.dataSync();
        var scaleValues = scale ? scale.dataSync() : [1];
        var offsetValues = offset ? offset.dataSync() : [0];
        var outValues = new Float32Array(xValues.length);
        for (var i = 0; i < xValues.length; i++) {
            outValues[i] = offsetValues[i % offsetValues.length] +
                (xValues[i] - meanValues[i % meanValues.length]) *
                    scaleValues[i % scaleValues.length] /
                    Math.sqrt(varianceValues[i % varianceValues.length] + varianceEpsilon);
        }
        return ndarray_1.Array2D.new(x.shape, outValues);
    };
    MathBackendCPU.prototype.batchNormalization3D = function (x, mean, variance, varianceEpsilon, scale, offset) {
        var xValues = x.dataSync();
        var meanValues = mean.dataSync();
        var varianceValues = variance.dataSync();
        var scaleValues = scale ? scale.dataSync() : [1];
        var offsetValues = offset ? offset.dataSync() : [0];
        var outValues = new Float32Array(xValues.length);
        for (var i = 0; i < xValues.length; i++) {
            outValues[i] = offsetValues[i % offsetValues.length] +
                (xValues[i] - meanValues[i % meanValues.length]) *
                    scaleValues[i % scaleValues.length] /
                    Math.sqrt(varianceValues[i % varianceValues.length] + varianceEpsilon);
        }
        return ndarray_1.Array3D.new(x.shape, outValues);
    };
    MathBackendCPU.prototype.batchNormalization4D = function (x, mean, variance, varianceEpsilon, scale, offset) {
        var xValues = x.dataSync();
        var meanValues = mean.dataSync();
        var varianceValues = variance.dataSync();
        var scaleValues = scale ? scale.dataSync() : new Float32Array([1]);
        var offsetValues = offset ? offset.dataSync() : new Float32Array([0]);
        var outValues = new Float32Array(xValues.length);
        for (var i = 0; i < xValues.length; i++) {
            outValues[i] = offsetValues[i % offsetValues.length] +
                (xValues[i] - meanValues[i % meanValues.length]) *
                    scaleValues[i % scaleValues.length] /
                    Math.sqrt(varianceValues[i % varianceValues.length] + varianceEpsilon);
        }
        return ndarray_1.Array4D.new(x.shape, outValues);
    };
    MathBackendCPU.prototype.localResponseNormalization4D = function (x, radius, bias, alpha, beta, normRegion) {
        var output = ndarray_1.Array4D.zeros(x.shape);
        var rad = radius;
        var maxW = output.shape[1] - 1;
        var maxH = output.shape[2] - 1;
        var maxD = output.shape[3] - 1;
        var sumAcrossChannels = function (b, r, c, d) {
            var sum = 0.0;
            for (var j = Math.max(0, d - rad); j <= Math.min(d + rad, maxD); j++) {
                var z = x.get(b, r, c, j);
                sum += z * z;
            }
            return sum;
        };
        var sumWithinChannel = function (b, r, c, d) {
            var sum = 0.0;
            for (var u = Math.max(0, r - rad); u <= Math.min(r + rad, maxW); u++) {
                for (var v = Math.max(0, c - rad); v <= Math.min(c + rad, maxH); v++) {
                    sum += Math.pow(x.get(b, u, v, d), 2);
                }
            }
            return sum;
        };
        for (var b = 0; b < output.shape[0]; b++) {
            for (var r = 0; r <= output.shape[1]; r++) {
                for (var c = 0; c < output.shape[2]; c++) {
                    for (var d = 0; d < output.shape[3]; d++) {
                        var sum = normRegion === 'withinChannel' ?
                            sumWithinChannel(b, r, c, d) :
                            sumAcrossChannels(b, r, c, d);
                        var val = x.get(b, r, c, d) * Math.pow(bias + alpha * sum, -beta);
                        output.set(val, b, r, c, d);
                    }
                }
            }
        }
        return output;
    };
    MathBackendCPU.prototype.multinomial = function (probabilities, numSamples, seed) {
        var batchSize = probabilities.shape[0];
        var numEvents = probabilities.shape[1];
        var res = ndarray_1.Array2D.zeros([batchSize, numSamples], 'int32');
        var resVals = res.dataSync();
        var probVals = probabilities.dataSync();
        for (var b = 0; b < batchSize; ++b) {
            var offset = b * numEvents;
            var cdf = new Float32Array(numEvents - 1);
            cdf[0] = probVals[offset];
            for (var event_1 = 1; event_1 < cdf.length; ++event_1) {
                cdf[event_1] = cdf[event_1 - 1] + probVals[offset + event_1];
            }
            var random = seedrandom.alea(seed.toString());
            var outOffset = b * numSamples;
            for (var sampleId = 0; sampleId < numSamples; ++sampleId) {
                var r = random();
                resVals[outOffset + sampleId] = cdf.length;
                for (var event_2 = 0; event_2 < cdf.length; event_2++) {
                    if (r < cdf[event_2]) {
                        resVals[outOffset + sampleId] = event_2;
                        break;
                    }
                }
            }
        }
        return res;
    };
    MathBackendCPU.prototype.oneHot = function (indices, depth, onValue, offValue) {
        var res = new Float32Array(indices.size * depth);
        res.fill(offValue);
        for (var event_3 = 0; event_3 < indices.size; ++event_3) {
            res[event_3 * depth + indices.get(event_3)] = onValue;
        }
        return ndarray_1.Array2D.new([indices.size, depth], res);
    };
    MathBackendCPU.prototype.broadcastedBinaryOp = function (a, b, dtype, op) {
        var newShape = broadcast_util.assertAndGetBroadcastShape(a.shape, b.shape);
        var result = ndarray_1.NDArray.zeros(newShape, dtype);
        var newValues = result.dataSync();
        var aValues = a.dataSync();
        var bValues = b.dataSync();
        var aBroadcastDims = broadcast_util.getBroadcastDims(a.shape, newShape);
        var bBroadcastDims = broadcast_util.getBroadcastDims(b.shape, newShape);
        var _loop_1 = function (i) {
            var loc = result.indexToLoc(i);
            var aLoc = loc.slice(-a.rank);
            aBroadcastDims.forEach(function (d) { return aLoc[d] = 0; });
            var aIndex = a.locToIndex(aLoc);
            var bLoc = loc.slice(-b.rank);
            bBroadcastDims.forEach(function (d) { return bLoc[d] = 0; });
            var bIndex = b.locToIndex(bLoc);
            newValues[i] = op(aValues[aIndex], bValues[bIndex]);
        };
        for (var i = 0; i < newValues.length; ++i) {
            _loop_1(i);
        }
        return result;
    };
    MathBackendCPU.prototype.dispose = function () { };
    return MathBackendCPU;
}());
exports.MathBackendCPU = MathBackendCPU;
environment_1.ENV.registerBackend('cpu', function () { return new MathBackendCPU(); });
var NDArrayMathCPU = (function (_super) {
    __extends(NDArrayMathCPU, _super);
    function NDArrayMathCPU(safeMode) {
        if (safeMode === void 0) { safeMode = false; }
        var _this = this;
        console.warn('new NDArrayMathCPU() is deprecated. Please use the global ' +
            'dl.ENV.math. In rare cases, to construct your own NDArrayMath ' +
            'that runs on CPU, use math = new NDArrayMath(\'cpu\', safeMode); ' +
            'and make sure to set it as global: dl.ENV.setMath(math);');
        _this = _super.call(this, 'cpu', safeMode) || this;
        environment_1.ENV.setMath(_this);
        return _this;
    }
    return NDArrayMathCPU;
}(math_1.NDArrayMath));
exports.NDArrayMathCPU = NDArrayMathCPU;
