let cheerio = require("cheerio");
let sys = require("../api/system.js");
let apiUrl = {
    instaoffline_net: "https://instaoffline.net/process/",
};
let instaoffline = instLink => {
    $ui.loading(true);
    if (instLink) {
        $http.post({
            url: apiUrl.instaoffline_net,
            header: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: {
                q: instLink
            },
        }).then(function (httpResp) {
            const httpData = httpResp.data;
            const strData = httpResp.rawData.toString();
            if (strData.startsWith("{") && strData.endsWith("}")) {
                if (httpData.error) {
                    $ui.loading(false);
                    $ui.error("发生错误，请检查链接是否正确");
                } else {
                    if (httpData.html) {
                        $ui.loading(false);
                        const $ = cheerio.load(httpData.html);
                        var resultList = [];
                        $("div.items-list").find("a.button").each(function (i, elem) {
                            resultList[i] = {
                                type: $(this).text().replace("Download ", "").toLowerCase(),
                                url: $(this).attr("href")
                            };
                        });
                        if (resultList.length > 0) {
                            $ui.loading(false);
                            showResultListView(resultList);
                        } else {
                            $ui.loading(false);
                            $ui.alert({
                                title: "解析结果为空",
                                message: "服务器返回0个媒体",
                            });
                        }
                    } else {
                        $ui.loading(false);
                        $ui.alert({
                            title: "服务器返回空白数据",
                            message: "HTML为空",
                        });
                    }
                }
            } else {
                $ui.loading(false);
                $ui.alert({
                    title: "服务器返回错误数据格式",
                    message: "不是JSON",
                });
            }
        });
    } else {
        $ui.loading(false);
        $ui.alert({
            title: "链接错误",
            message: "请输入正确的链接",
        });
    }
};
let showResultListView = resultList => {
    $ui.push({
        props: {
            title: "Instagram"
        },
        views: [{
            type: "list",
            props: {
                data: resultList.map(x => x.url)
            },
            layout: $layout.fill,
            events: {
                didSelect: function (_sender, indexPath, _data) {
                    const thisItem = resultList[indexPath.row];
                    $ui.menu({
                        items: ["打开", "预览", "分享", "复制", "下载"],
                        handler: function (title, idx) {
                            switch (idx) {
                                case 0:
                                    $app.openURL(thisItem.url);
                                    break;
                                case 1:
                                    $ui.preview({
                                        title: title,
                                        url: thisItem.url
                                    });
                                    break;
                                case 2:
                                    $share.sheet([thisItem.url]);
                                    break;
                                case 3:
                                    sys.copyToClipboard(thisItem.url);
                                    break;
                                case 4:
                                    $ui.alert({
                                        title: "注意事项",
                                        message: "下载是调用系统的预览功能，需要等待媒体完整加载后才能预览下载",
                                        actions: [{
                                            title: "确定下载",
                                            disabled: false, // Optional
                                            handler: function () {
                                                $quicklook.open({
                                                    url: thisItem.url
                                                })
                                            }
                                        }, {
                                            title: "关闭",
                                            disabled: false, // Optional
                                            handler: function () {}
                                        }]
                                    });
                                    break;
                                default:
                            }
                        }
                    });
                }
            }
        }]
    });
}
let init = () => {
    $input.text({
        type: $kbType.url,
        placeholder: "输入instagram链接",
        handler: function (url) {
            if (url) {
                instaoffline(url);
            } else {
                $ui.error("请输入网址");
            }
        }
    });
};
module.exports = {
    init
};