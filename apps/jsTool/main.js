const page = require("./scripts/page_init.js");
const siteListL10n = ["MO_FISH"];
const moreListL10n = ["CDN", "KUAIDI", "SM_MS", "IMAGE", "BILIBILI", "MUSIC_SEARCH", "TEST_PAGE"];
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
        title: $l10n("MENU"),
        icon: "067", // Or you can use icon name
        symbol: "checkmark.seal", // SF symbols are supported
        handler: () => {
            $ui.menu({
                items: ["Hello", "World"],
                handler: function (title, idx) {

                }
            });
        }
    }];
}
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
                    title: $l10n("NEWS"),
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
                                page.mofish();
                                break;
                            default:
                                $ui.error("错误选项");
                        }
                        break;
                    case 1:
                        switch (indexPath.row) {
                            case 0:
                                page.cdn();
                                break;
                            case 1:
                                page.kuaidi();
                                break;
                            case 2:
                                page.smms();
                                break;
                            case 3:
                                page.image();
                                break;
                            case 4:
                                page.bilibili();
                                break;
                            case 5:
                                page.musicSearch();
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
            //摇一摇
        }
    }
});