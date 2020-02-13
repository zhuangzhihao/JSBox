const lib = require("./lib.js");
const siteInfo = {
    title: $l10n("GZDAILY")
};
const _url = {
    web: "https://cdn.gzdaily.com/wapp/fyMap/index.html",
    api: {
        news: "https://cdn.gzdaily.com/wapp/fyMap/data/news.json", //每日疫情
        map: "https://cdn.gzdaily.com/wapp/fyMap/data/map.json", //广东省每日数据
        guiji: "https://cdn.gzdaily.com/wapp/fyMap/data/guiji.json", //病例轨迹
    }
};
var _data = {
    global: {

    }
}

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
                        rows: ["总体数据", "每日疫情"]
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
                                    getGdEverydayData();
                                    break;
                                case 1:
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

function getGdEverydayData() {
    lib.httpGet(_url.api.map, function (_resp) {
        var data = _resp.data;
        if (data.code == 200 && data.success) {
            const mapData = data.data;
            _data.global = mapData.global;
            const mGlobal = _data.global;
            const gdDataList = [
                "确诊：" + mGlobal.confirm,
                "疑似：" + mGlobal.suspected,
                "治愈：" + mGlobal.cure,
                "死亡：" + mGlobal.die,
                "昨日新增确诊：" + mGlobal.addConfirm,
                "昨日新增疑似：" + mGlobal.addSuspected,
                "昨日新增治愈：" + mGlobal.addCure,
                "昨日新增死亡：" + mGlobal.addDie
            ]
            $ui.push({
                props: {
                    title: "总体数据",
                    navButtons: getNavButton()
                },
                views: [{
                    type: "list",
                    props: {
                        data: [{
                                title: "功能",
                                rows: []
                            },
                            {
                                title: "广东省数据",
                                rows: gdDataList
                            }
                        ],
                        footer: {
                            type: "label",
                            props: {
                                height: 20,
                                text: "更新时间：" + mGlobal.time,
                                textColor: $color("#AAAAAA"),
                                align: $align.center,
                                font: $font(12)
                            }
                        }
                    },
                    layout: $layout.fill,
                    events: {
                        didSelect: function (_sender, indexPath, _data) {
                            switch (indexPath.section) {
                                case 0:
                                    switch (indexPath.row) {
                                        default:
                                            $ui.error("错误选项");
                                    }
                                    break;
                            }
                        }
                    }
                }]
            });
        } else {
            $ui.error(data.msg);
        }
    });
}
// 暴露接口
module.exports = {
    init: initMainMenu
};