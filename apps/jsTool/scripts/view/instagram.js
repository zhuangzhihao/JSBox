$include("./codePrototype.js");
let cheerio = require("cheerio");
let appScheme = require("../api/app_scheme.js");
let apiUrl = {
    instaoffline_net: "https://instaoffline.net/process/",
};

let checkInsLink = () => {
    const url = $clipboard.link;
    return url.startsWith("https://www.instagram.com/p/") ? url : "";
};

function MediaItem(type, url) {
    this.type = type;
    this.url = url;
}
let init = () => {
    $input.text({
        type: $kbType.url,
        placeholder: "输入instagram链接",
        text: checkInsLink(),
        handler: function (url) {
            if (url) {
                instagramOfficial(url);
            } else {
                $ui.error("请输入网址");
            }
        }
    });
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
                    const itemUrl = resultList[indexPath.row].url;
                    $ui.menu({
                        items: ["打开", "预览", "分享", "复制", "下载"],
                        handler: function (title, idx) {
                            switch (idx) {
                                case 0:
                                    $ui.menu({
                                        items: ["Safari", "Chrome", "Alook browser", "QQ browser", "Firefox"],
                                        handler: function (browserTitle, browserIndex) {
                                            switch (browserIndex) {
                                                case 0:
                                                    $app.openURL(itemUrl);
                                                    break;
                                                case 1:
                                                    appScheme.chromeBrowserOpen(itemUrl);
                                                    break;
                                                case 2:
                                                    appScheme.alookBrowserOpen(itemUrl);
                                                    break;
                                                case 3:
                                                    appScheme.qqBrowserOpen(itemUrl);
                                                    break;
                                                case 4:
                                                    appScheme.firefoxBrowserOpen(itemUrl);
                                                    break;
                                            }

                                        }
                                    });
                                    break;
                                case 1:
                                    $ui.preview({
                                        title: title,
                                        url: itemUrl
                                    });
                                    break;
                                case 2:
                                    $share.sheet([itemUrl]);
                                    break;
                                case 3:
                                    itemUrl.copy();
                                    break;
                                case 4:
                                    $ui.menu({
                                        items: ["系统预览"],
                                        handler: function (downtitle, downIndex) {
                                            switch (downIndex) {
                                                case 0:
                                                    $ui.alert({
                                                        title: "注意事项",
                                                        message: "下载是调用系统的预览功能，需要等待媒体完整加载后才能预览下载",
                                                        actions: [{
                                                            title: "确定下载",
                                                            disabled: false, // Optional
                                                            handler: function () {
                                                                $quicklook.open({
                                                                    url: itemUrl
                                                                })
                                                            }
                                                        }, {
                                                            title: "关闭",
                                                            disabled: false, // Optional
                                                            handler: function () {}
                                                        }]
                                                    });
                                                    break;
                                            }
                                        }
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
                            const media_item = new MediaItem(
                                $(this).text().remove("Download ").toLowerCase(),
                                $(this).attr("href")
                            );
                            resultList[i] = media_item;
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
let instagramOfficial = link => {
    if (link.startsWith("https://www.instagram.com/p/")) {
        var insUrl = link.split("?")[0];
        $http.get({
            url: `${insUrl}?__a=1`,
            handler: function (resp) {
                var data = resp.data;
                if (data) {
                    const mediaList = data.graphql.shortcode_media.edge_sidecar_to_children.edges;
                    if (mediaList) {
                        if (mediaList.length > 0) {
                            const insMediaList = mediaList.map(media => {
                                const thisData = media.node;
                                return thisData.is_video ?
                                    new MediaItem("video", thisData.video_url) :
                                    new MediaItem("image", thisData.display_url);
                            });
                            showResultListView(insMediaList);
                        } else {
                            $ui.alert({
                                title: "解析数据失败",
                                message: "媒体列表空白",
                            });
                        }
                    } else {
                        $ui.alert({
                            title: "解析数据失败",
                            message: "数据空白",
                        });
                    }
                } else {
                    $ui.alert({
                        title: "解析数据失败",
                        message: "数据格式错误",
                    });
                }
            }
        });
    }
};
module.exports = {
    init
};