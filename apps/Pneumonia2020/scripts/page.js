const dxy = require("./dxy.js");
const toutiao = require("./toutiao.js");
const test = require("./test.js");
const gzdaily = require("./gzdaily.js");

module.exports = {
    dxy: dxy.init,
    toutiao: toutiao.init,
    gzdaily: gzdaily.init,
    test: test.init
};