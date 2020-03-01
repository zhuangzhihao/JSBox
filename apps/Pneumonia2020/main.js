const update = require("./scripts/update.js");
const page = require("./scripts/page.js");
const lib = require("./scripts/lib.js");
const siteList = ["DINGXIANGYUAN", "TOUTIAO", "GZDAILY"];
const moreList = ["口罩购买", "TEST_PAGE"];

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

$console.info("main:init");
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
            style: 2,
            data: [{
                    title: "站点",
                    rows: lib.getListFromL10n(siteList)
                },
                {
                    title: "更多",
                    rows: lib.getListFromL10n(moreList)
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
                            case 2:
                                page.gzdaily();
                                break;
                            default:
                                $ui.error("错误选项");
                        }
                        break;
                    case 1:
                        switch (indexPath.row) {
                            case 0:
                                page.maskLookup();
                                break;
                            case 1:
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