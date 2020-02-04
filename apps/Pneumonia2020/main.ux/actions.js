const dxy = require("./scripts/dxy");
const update = require("./scripts/update");
const appVersion = $app.info
exports.dxy = () => {
    dxy.init();
};


exports.update = () => {
    const serverJsonUrl = "https://cdn.jsdelivr.net/gh/zhuangzhihao/jsbox@master/app.json";
    const appId = "io.zhihao.jsbox.dxy";
    update.checkUpdate(serverJsonUrl, appId);
}