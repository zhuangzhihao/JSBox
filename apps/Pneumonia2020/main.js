const update = require("./scripts/update.js");
const page = require("./scripts/page.js");
const siteListL10n = ["DINGXIANGYUAN", "TOUTIAO"];
const moreListL10n = ["TEST_PAGE"];
var siteList = [];
for (x in siteListL10n) {
    siteList.push($l10n(siteListL10n[x]));
}
var moreList = [];
for (x in moreListL10n) {
    moreList.push($l10n(moreListL10n[x]));
}

function getNavButton() {
    return [{
        title: $l10n("CHECK_UPDATE"),
        icon: "162", // Or you can use icon name
        symbol: "checkmark.seal", // SF symbols are supported
        handler: () => {
            checkUpdate();
        }
    }];
}

function checkUpdate() {
    const time = Math.round(new Date() / 1000);
    const serverJsonUrl = "https://cdn.jsdelivr.net/gh/zhuangzhihao/jsbox@master/app.json?t=" + time;
    const appId = "io.zhihao.jsbox.pneumonia2020";
    update.checkUpdate(serverJsonUrl, appId);
}

$console.log("main:init");
$ui.render({
    props: {
        id: "main",
        homeIndicatorHidden: false,
        modalPresentationStyle: 0,
        navButtons: getNavButton()
    },
    views: [{
        type: "list",
        props: {
            data: [{
                    title: "站点",
                    rows: siteList
                },
                {
                    title: "更多",
                    rows: moreList
                }
            ]
        },
        layout: $layout.fill,
        events: {
            didSelect: function (_sender, indexPath, _data) {
                switch (indexPath.section) {
                    case 0:
                        switch (indexPath.row) {
                            case 0:
                                page.dxy();
                                break;
                            case 1:
                                page.toutiao();
                                break;
                            default:
                                $ui.error("错误选项");
                        }
                        break;
                    case 1:
                        switch (indexPath.row) {
                            case 0:
                                page.test();
                                break;
                            default:
                                $ui.error("错误选项");
                        }
                        break;
                    default:
                        $ui.error("错误选项");
                }
            }
        }
    }],
    events: {
        appeared: function () {
            $app.tips("右上角的按钮是更新按钮，摇一摇设备也可以触发检测更新");
        },
        shakeDetected: function () {
            checkUpdate();
        }
    }
});