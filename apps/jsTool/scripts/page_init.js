let mofish = require("./mofish.js");
let cdn = require("./cdn.js");
let kuaidi = require("./kuaidi.js");
let smmsv2 = require("./sm_ms_v2.js");
let image = require("./image.js");
let bilibili = require("./bilibili.js");
let musicSearch = require("./music_search.js");
let zhihuDaily = require("./zhihu_daily.js");
let acfun = require("./acfun.js");
module.exports = {
    mofish: mofish.init,
    cdn: cdn.init,
    kuaidi: kuaidi.init,
    smms: smmsv2.init,
    image: image.init,
    bilibili: bilibili.init,
    musicSearch: musicSearch.init,
    zhihuDaily: zhihuDaily.init,
    acfun: acfun.init
};