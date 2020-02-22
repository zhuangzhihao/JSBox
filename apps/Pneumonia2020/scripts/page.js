const dxy = require("./dxy.js");
const toutiao = require("./toutiao.js");
const test = require("./test.js");
const gzdaily = require("./gzdaily.js");
const maskLookup = require("./mask_lookup.js");

module.exports = {
    dxy: dxy.init,
    toutiao: toutiao.init,
    gzdaily: gzdaily.init,
    maskLookup: maskLookup.init,
    test: test.init

};