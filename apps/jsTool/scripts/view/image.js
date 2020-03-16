let app = require("../api/app.js");
let todayImageIoliu = () => {
    const screenInfo = $device.info.screen;
    const url = `https://bing.ioliu.cn/v1?w=${screenInfo.width}&h=${screenInfo.height}`;
    $console.info(url);
    $ui.preview({
        title: "bing.ioliu.cn",
        url: url
    });
};
let randomImageIoliu = () => {
    const screenInfo = $device.info.screen;
    const url = `https://bing.ioliu.cn/v1/rand?w=${screenInfo.width}&h=${screenInfo.height}`;
    $console.info(url);
    $ui.preview({
        title: "bing.ioliu.cn",
        url: url
    });
};
let girlImage = () => {
    const url = "https://api.isoyu.com/mm_images.jsp";
    $ui.preview({
        title: "Girl image",
        url: url
    });
};

let bingDailyImageIsoyu = () => {
    const url = "https://api.isoyu.com/bing_images.jsp";
    $console.info(url);
    $ui.preview({
        title: "Bing daily image",
        url: url
    });
};

let docScan = () => {
    $photo.scan({
        handler: data => {
            $console.info(data);
            if (data.status) {
                const resultList = data.results;
                if (resultList.length > 0) {
                    var imageDataList = [];
                    for (i in resultList) {
                        imageDataList.push(resultList[i].png)
                    }
                    $ui.push({
                        props: {
                            title: $l10n("SCAN_SUCCESS")
                        },
                        views: [{
                            type: "list",
                            props: {
                                data: app.getListFromL10n(["预览全部图片", "保存全部图片"])
                            },
                            layout: $layout.fill,
                            events: {
                                didSelect: function (_sender, indexPath, _data) {
                                    switch (indexPath.row) {
                                        case 0:
                                            $quicklook.open({
                                                list: imageDataList
                                            });
                                            break;
                                        default:
                                    }
                                }
                            }
                        }]
                    });
                } else {
                    $ui.alert({
                        title: $l10n("SCAN_FAILED"),
                        message: "系统返回0个结果",
                    });
                }
            } else {
                $ui.alert({
                    title: $l10n("SCAN_FAILED"),
                    message: data.error.description,
                });
            }
        }
    });

};

let init = () => {
    $ui.push({
        props: {
            title: $l10n("IMAGE")
        },
        views: [{
            type: "list",
            props: {
                data: [{
                    title: "ioliu必应图片",
                    rows: app.getListFromL10n(["今天图片", "随机图片"])
                }, {
                    title: "其他",
                    rows: app.getListFromL10n(["SCAN_DOCUMENTS"])
                }, ]
            },
            layout: $layout.fill,
            events: {
                didSelect: function (_sender, indexPath, _data) {
                    const section = indexPath.section;
                    const row = indexPath.row;
                    switch (section) {
                        case 0:
                            switch (row) {
                                case 0:
                                    todayImageIoliu();
                                    break;
                                case 1:
                                    randomImageIoliu();
                                    break;
                            }
                            break;
                        case 1:
                            docScan();
                            break;
                    }
                }
            }
        }]
    });
};

module.exports = {
    init: init
};