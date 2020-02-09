const mofish = require("./mofish.js");
const cdn = require("./cdn.js");
module.exports = {
    mofish: mofish.init,
    cdn: cdn.init
};
