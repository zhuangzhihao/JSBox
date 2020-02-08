const update = require("./scripts/update.js");
const page = require("./scripts/page.js");
const menuListL10n = ["DINGXIANGYUAN", "TOUTIAO", "TEST_PAGE"];
var menuList = [];
for (x in menuListL10n) {
    menuList.push($l10n(menuListL10n[x]));
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
            data: menuList
        },
        layout: $layout.fill,
        events: {
            didSelect: function (_sender, indexPath, _data) {
                const _idx = indexPath.row;
                switch (_idx) {
                    case 0:
                        page.dxy();
                        break;
                    case 1:
                        page.toutiao();
                        break;
                    case 2:
                        page.test();
                        break;
                    default:
                        $ui.error("错误选项");
                }
            }
        }
    }]
});