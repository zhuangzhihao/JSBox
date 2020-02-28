let mofish = require("./view/mofish.js");
let cdn = require("./view/cdn.js");
let kuaidi = require("./view/kuaidi.js");
let smmsv2 = require("./view/sm_ms_v2.js");
let image = require("./view/image.js");
let bilibili = require("./view/bilibili.js");
let musicSearch = require("./view/music_search.js");
let zhihuDaily = require("./view/zhihu_daily.js");
let acfun = require("./view/acfun.js");

let gotoUrl = url => {

};
module.exports = {
    mofish: mofish.init,
    cdn: cdn.init,
    kuaidi: kuaidi.init,
    smms: smmsv2.init,
    image: image.init,
    bilibili: bilibili.init,
    musicSearch: musicSearch.init,
    zhihuDaily: zhihuDaily.init,
    acfun: acfun.init,
    gotoUrl
};