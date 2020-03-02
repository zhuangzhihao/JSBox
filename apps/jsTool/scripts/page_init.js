let sys = require("./api/system.js");
let str = require("./api/string.js");

// 模块
let mofish = require("./view/mofish.js");
let cdn = require("./view/cdn.js");
let kuaidi = require("./view/kuaidi.js");
let smmsv2 = require("./view/sm_ms_v2.js");
let image = require("./view/image.js");
let bilibili = require("./view/bilibili.js");
let biliApi = require("./api/bilibili.js");
let musicSearch = require("./view/music_search.js");
let zhihuDaily = require("./view/zhihu_daily.js");
let acfun = require("./view/acfun.js");
let instagram = require("./view/instagram.js");
let freeSms = require("./view/free_sms_getter.js");

let gotoUrl = url => {
    const newUrl = $text.URLDecode(url);
    if (str.checkIfUrl(newUrl)) {
        checkMod(newUrl);
    } else {
        $ui.alert({
            title: "内容错误",
            message: "不是完整链接",
        });
    }
};
let checkMod = url => {
    if (biliApi.isBiliUrl(url)) {
        modOpen("bilibili", url);
    } else {
        $ui.error("不支持该网址的分享");
    }
};
let modOpen = (mod, url) => {
    switch (mod) {
        case "bilibili":
            bilibili.init(url);
            break;
        default:
            $ui.error("不支持该功能");
    }
};
let contextOpen = query => {
    switch (query.mod) {
        case "url":
            if (query.url) {
                gotoUrl(query.url);
            } else {
                $ui.alert({
                    title: "外部调用错误",
                    message: "空白url",
                });
            }
            break;
        case "mofish":
            mofish.init(true);
            break;
        default:
            $ui.alert({
                title: "外部调用错误",
                message: "发现未支持的外部调用",
            });
    }
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
    instagram: instagram.init,
    freeSms: freeSms.init,
    contextOpen,
    gotoUrl,
};