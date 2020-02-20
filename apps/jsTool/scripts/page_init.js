const mofish = require("./mofish.js");
const cdn = require("./cdn.js");
const kuaidi = require("./kuaidi.js");
const smmsv2 = require("./sm_ms_v2.js");
const image = require("./image.js");
const bilibili = require("./bilibili.js");
const musicSearch = require("./music_search.js");
module.exports = {
    mofish: mofish.init,
    cdn: cdn.init,
    kuaidi: kuaidi.init,
    smms: smmsv2.init,
    image: image.init,
    bilibili: bilibili.init,
    musicSearch:musicSearch.init,

};