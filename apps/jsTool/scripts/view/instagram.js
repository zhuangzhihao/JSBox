$include("./codePrototype.js");
let cheerio = require("cheerio");
let appScheme = require("../api/app_scheme.js");
let urlCheck = require("../api/urlCheck.js");
let apiUrl = {
    instaoffline_net: "https://instaoffline.net/process/",
};

let checkInsLink = (shareUrl) => {
    const url = shareUrl || $clipboard.link;
    return url ? (urlCheck.isInstagramUrl(url) ? url : "") : "";
};

function MediaItem(type, url) {
    this.type = type;
    this.url = url;
}
let init = (shareUrl) => {
    $input.text({
        type: $kbType.url,
        placeholder: "输入instagram链接",
        text: checkInsLink(shareUrl),
        handler: function (url) {
            url ? instagramOfficial(url) : $ui.error("请输入网址");
        }
    });
};
let showResultListView = (resultList, webLink) => {
    $ui.push({
        props: {
            title: "Instagram",
            navButtons: [{
                title: $l10n("WEB"),
                icon: "079", // Or you can use icon name
                handler: () => {
                    $app.openURL(webLink);
                }
            }]
        },
        views: [{
            type: "list",
            props: {
                data: [{
                    title: "菜单",
                    rows: ["下载全部", "预览全部"]
                }, {
                    title: "文件列表",
                    rows: resultList.map(x => x.url)
                }]
            },
            layout: $layout.fill,
            events: {
                didSelect: function (_sender, indexPath, _data) {
                    switch (indexPath.section) {
                        case 0:
                            switch (indexPath.row) {
                                case 0:
                                    $ui.alert({
                                        title: "确定下载全部？",
                                        message: `共有${resultList.length}个文件`,
                                        actions: [{
                                            title: "下载",
                                            disabled: false,
                                            handler: function () {
                                                saveFiles(resultList, 0);
                                            }
                                        }, {
                                            title: "取消",
                                            disabled: false,
                                            handler: function () {}
                                        }]
                                    });
                                    break;
                                case 1:
                                    $ui.alert({
                                        title: "确定预览全部？",
                                        message: `可能会因为媒体文件太大导致加载时间过长`,
                                        actions: [{
                                            title: "确定",
                                            disabled: false,
                                            handler: function () {
                                                $quicklook.open({
                                                    list: resultList.map(i => i.url)
                                                });
                                            }
                                        }, {
                                            title: "取消",
                                            disabled: false,
                                            handler: function () {}
                                        }]
                                    });
                                    break;
                            }
                            break;
                        case 1:
                            const itemUrl = resultList[indexPath.row].url;
                            $ui.menu({
                                items: ["打开", "预览", "分享", "复制", "下载"],
                                handler: function (title, idx) {
                                    switch (idx) {
                                        case 0:
                                            $ui.menu({
                                                items: ["Safari", "Chrome", "Alook browser", "QQ browser", "Firefox", "AVPlayer", "nPlayer", "Documents 5"],
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
                                                        case 5:
                                                            appScheme.avplayerVideo(itemUrl);
                                                            break;
                                                        case 6:
                                                            appScheme.nplayerVideo(itemUrl);
                                                            break;
                                                        case 7:
                                                            appScheme.documentsOpen(itemUrl);
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
                            break;
                    }
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
    if (urlCheck.isInstagramUrl(link)) {
        const insUrl = (link.indexOf("?") > -1) ? `${link}&__a=1` : `${link}?__a=1`;
        $http.get({
            url: insUrl,
            header: {
                "referer": link,
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.125 Safari/537.36"
            },
            handler: function (resp) {
                var data = resp.data;
                if (data) {
                    const gsm = data.graphql.shortcode_media;
                    if (gsm.is_ad) {
                        $ui.alert({
                            title: "拒绝解析",
                            message: "这是广告",
                        });
                    } else {
                        if (gsm.edge_sidecar_to_children) {
                            const mediaList = gsm.edge_sidecar_to_children.edges;
                            if (mediaList) {
                                if (mediaList.length > 0) {
                                    const insMediaList = mediaList.map(media => {
                                        const thisData = media.node;
                                        return thisData.is_video ?
                                            new MediaItem("video", thisData.video_url) :
                                            new MediaItem("image", thisData.display_url);
                                    });
                                    showResultListView(insMediaList, link);
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
                                message: "数据格式错误，未找到媒体列表，所以只显示封面",
                            });
                            const insMediaList = [
                                new MediaItem("image", gsm.display_url)
                            ];
                            showResultListView(insMediaList, link);
                        }
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
let saveFiles = (resultList, index) => {
    const thisMedia = resultList[index];
    $drive.save({
        data: $data({
            url: thisMedia.url
        }),
        name: thisMedia.type == "video" ? "视频.mp4" : "图片.jpg",
        handler: function () {
            if (index == resultList.length - 1) {
                $ui.alert({
                    title: "保存完毕",
                    message: "请检查",
                });
            } else {
                saveFiles(resultList, index + 1);
            }
        }
    });
};
module.exports = {
    init
};