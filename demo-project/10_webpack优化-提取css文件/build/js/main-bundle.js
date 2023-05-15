(self["webpackChunkbabel_core_demo"] = self["webpackChunkbabel_core_demo"] || []).push([[179],{

/***/ "./src/abc.js":
/*!********************!*\
  !*** ./src/abc.js ***!
  \********************/
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

/* provided dependency */ var axios = __webpack_require__(/*! axios */ "./node_modules/.pnpm/axios@1.2.0/node_modules/axios/index.js")["default"];
/* provided dependency */ var dayjs = __webpack_require__(/*! dayjs */ "./node_modules/.pnpm/dayjs@1.11.6/node_modules/dayjs/dayjs.min.js");
// import axios from 'axios'
// import dayjs from 'dayjs'

axios.get('http://123.207.32.32:8000/home/multidata').then(function (res) {
  console.log(res);
});

// console.log(axios)

console.log(dayjs(new Date()).format('YYYY-MM-DD HH:mm:ss'));

/***/ }),

/***/ "./src/main.js":
/*!*********************!*\
  !*** ./src/main.js ***!
  \*********************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _utils_foo__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils/foo */ "./src/utils/foo.js");
/* harmony import */ var _abc__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./abc */ "./src/abc.js");
/* harmony import */ var _abc__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_abc__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _css_style_css__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./css/style.css */ "./src/css/style.css");
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! axios */ "./node_modules/.pnpm/axios@1.2.0/node_modules/axios/lib/axios.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react */ "./node_modules/.pnpm/react@18.2.0/node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_3__);






// import { bar } from './utils/bar'

// index.js作为入口
var message = "Hello Main";
console.log(message);
function bar() {
  console.log('bar function exec~');
}
bar();

// 使用axios
axios__WEBPACK_IMPORTED_MODULE_4__["default"].get('http://123.207.32.32:8000/home/multidata').then(function (res) {
  console.log(res);
});
var btn1 = document.createElement('button');
var btn2 = document.createElement('button');
btn1.textContent = '关于';
btn2.textContent = '分类';
document.body.append(btn1);
document.body.append(btn2);
btn1.onclick = function () {
  __webpack_require__.e(/*! import() | about */ 443).then(__webpack_require__.bind(__webpack_require__, /*! ./router/about */ "./src/router/about.js")).then(function (res) {
    res.about();
    res.default();
  });
};
btn2.onclick = function () {
  __webpack_require__.e(/*! import() | category */ 34).then(__webpack_require__.t.bind(__webpack_require__, /*! ./router/category */ "./src/router/category.js", 23));
};
(0,_utils_foo__WEBPACK_IMPORTED_MODULE_0__.foo)();

/***/ }),

/***/ "./src/css/style.css":
/*!***************************!*\
  !*** ./src/css/style.css ***!
  \***************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ })

},
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ /* webpack/runtime/startup prefetch */
/******/ !function() {
/******/ 	__webpack_require__.O(0, [179], function() {
/******/ 		__webpack_require__.E(443);
/******/ 		__webpack_require__.E(34);
/******/ 	}, 5);
/******/ }();
/******/ 
/******/ var __webpack_exec__ = function(moduleId) { return __webpack_require__(__webpack_require__.s = moduleId); }
/******/ __webpack_require__.O(0, [19,526], function() { return __webpack_exec__("./src/main.js"); });
/******/ var __webpack_exports__ = __webpack_require__.O();
/******/ }
]);