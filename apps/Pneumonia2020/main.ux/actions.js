const dxy = require("./scripts/dxy");
const update = require("./scripts/update");
exports.dxy = () => {
    dxy.init();
};


exports.update = () => {
    const serverJsonUrl = "https://cdn.jsdelivr.net/gh/zhuangzhihao/jsbox@master/app.json";
    const appId = "io.zhihao.jsbox.pneumonia2020";
    update.checkUpdate(serverJsonUrl, appId);
}