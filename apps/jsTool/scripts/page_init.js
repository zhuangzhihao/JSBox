const mofish = require("./mofish.js");
const cdn = require("./cdn.js");
const kuaidi = require("./kuaidi.js");
const smmsv2 = require("./sm_ms_v2.js");
module.exports = {
    mofish: mofish.init,
    cdn: cdn.init,
    kuaidi: kuaidi.init,
    smms: smmsv2.init
};