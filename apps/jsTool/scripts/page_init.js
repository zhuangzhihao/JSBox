$include("./codePrototype.js");

// 模块
let mofish = require("./view/mofish.js");
let cdn = require("./view/cdn.js");
let kuaidi = require("./view/kuaidi.js");
let smmsv2 = require("./view/sm_ms_v2.js");
let image = require("./view/image.js");
let bilibili = require("./view/bilibili.js");
let musicSearch = require("./view/music_search.js");
let zhihuDaily = require("./view/zhihu_daily.js");
let acfun = require("./view/acfun.js");
let instagram = require("./view/instagram.js");
let freeSms = require("./view/free_sms_getter.js");
let urlCheck = require("./api/urlCheck.js");
let gotoUrl = url => {
    const newUrl = $text.URLDecode(url);
    if (newUrl.checkIfUrl()) {
        checkMod(newUrl);
    } else {
        $ui.alert({
            title: "内容错误",
            message: "不是完整链接",
        });
    }
};
let checkMod = url => {
    if (urlCheck.isBilibiliUrl(url)) {
        modOpen("bilibili", url);
    } else if (urlCheck.isAcfunUrl(url)) {
        modOpen("acfun", url);
    } else {
        $ui.error("不支持该网址的分享");
    }
};
let modOpen = (mod, url) => {
    switch (mod) {
        case "bilibili":
            bilibili.init(url);
            break;
        case "acfun":
            acfun.init(url);
            break;
        case "instagram":
            instagram.init(url);
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
let scanQrcodeToGo = () => {
    $qrcode.scan({
        handler(str) {
            if (str.checkIfUrl()) {
                gotoUrl(str);
            } else {
                $ui.error("不是链接");
            }
        },
        cancelled() {
            $ui.error("Cancelled");
        }
    });
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
    scanQrcodeToGo,
};