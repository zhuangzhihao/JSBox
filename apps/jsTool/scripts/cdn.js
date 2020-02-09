function init() {
    const cdn = require("./api/cdn.js");
    const a = cdn.weserv("test");
    console.info(a);
}
module.exports = {
    init: init
};
