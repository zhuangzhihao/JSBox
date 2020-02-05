const dxy = require("./scripts/dxy");
const update = require("./scripts/update");
exports.dxy = () => {
    dxy.init();
};


exports.update = () => {
    const time = Math.round(new Date() / 1000);
    const serverJsonUrl = "https://cdn.jsdelivr.net/gh/zhuangzhihao/jsbox@master/app.json?t=" + time;
    const appId = "io.zhihao.jsbox.pneumonia2020";
    update.checkUpdate(serverJsonUrl, appId);
}