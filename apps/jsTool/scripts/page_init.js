const mofish = require("./mofish.js");
const cdn = require("./cdn.js");
const kuaidi = require("./kuaidi.js");
module.exports = {
    mofish: mofish.init,
    cdn: cdn.init,
    kuaidi: kuaidi.init
};