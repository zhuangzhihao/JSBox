const dxy = require("./dxy.js");
const toutiao = require("./toutiao.js");
const test = require("./test.js");

module.exports = {
    dxy: dxy.init,
    toutiao: toutiao.init,
    test: test.init
};