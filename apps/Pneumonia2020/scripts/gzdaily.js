const lib = require("./lib.js");
const siteInfo = {
    title: $l10n("GZDAILY")
};
const _url = {
    web: "https://cdn.gzdaily.com/wapp/fyMap/index.html",
    api: {
        news: "https://cdn.gzdaily.com/wapp/fyMap/data/news.json", //每日疫情
        guiji: "https://cdn.gzdaily.com/wapp/fyMap/data/guiji.json", //病例轨迹
    }
};

function getNavButton() {
    return [{
        title: "打开网页版",
        icon: "068", // Or you can use icon name
        symbol: "checkmark.seal", // SF symbols are supported
        handler: () => {
            lib.previewWeb(siteInfo.title, _url.web);
        }
    }];
}

function initMainMenu() {
    $ui.push({
        props: {
            title: siteInfo.title,
            navButtons: getNavButton()
        },
        views: [{
            type: "list",
            props: {
                data: [{
                        title: "站点",
                        rows: ["每日疫情"]
                    },
                    {
                        title: "更多",
                        rows: []
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
                                    getNews();
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
        }]
    });
}

function getNews() {
    // 每日疫情
    lib.httpGet(_url.api.news, function (resp) {
        var data = resp.data;
        const newsList = data.list;
        var newsTitleList = [];
        for (a in newsList) {
            const thisTitle = newsList[a].data.title;
            newsTitleList.push(thisTitle);
        }
        $ui.push({
            props: {
                title: "每日疫情"
            },
            views: [{
                type: "list",
                props: {
                    data: newsTitleList
                },
                layout: $layout.fill,
                events: {
                    didSelect: function (_sender, indexPath, _data) {
                        lib.previewWeb(_data, newsList[indexPath.row].data.url);
                    },
                    didLongPress: function (_sender, indexPath, data) {
                        $ui.alert({
                            title: newsList[indexPath.row].data.lastpublishTime,
                            message: data,
                        });
                    }
                }
            }]
        });
    });
}
// 暴露接口
module.exports = {
    init: initMainMenu
};