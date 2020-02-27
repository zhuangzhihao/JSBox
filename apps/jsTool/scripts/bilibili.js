const biliApi = require("./api/bilibili.js");
const debugVid = "90035938";

function init() {
    if (biliApi.init()) {
        $ui.toast("已登录");
    }
    $ui.push({
        props: {
            title: $l10n("BILIBILI")
        },
        views: [{
            type: "list",
            props: {
                data: ["获取视频信息", "登录账号", "获取用户信息"]
            },
            layout: $layout.fill,
            events: {
                didSelect: function (_sender, indexPath, _data) {
                    switch (indexPath.row) {
                        case 0:
                            $ui.menu({
                                items: ["打开网址", "通过vid"],
                                handler: function (title, idx) {
                                    switch (idx) {
                                        case 0:
                                            $input.text({
                                                type: $kbType.url,
                                                autoFontSize: true,
                                                text: `https://b23.tv/av${debugVid}`,
                                                placeholder: "输入视频网址",
                                                handler: function (url) {
                                                    if (url.length > 0) {
                                                        const vid = biliApi.getVidFromUrl(url);
                                                        if (vid.length > 0) {
                                                            $console.info(`url:${url}\nvid:${vid}`);
                                                            biliApi.getVideoInfo(vid);
                                                        } else if (vid == url) {
                                                            $console.error(`url:${url}\nvid:${vid}`);
                                                            $ui.error("解析网址失败");
                                                        } else {
                                                            $console.error(`url:${url}\nvid:${vid}`);
                                                            $ui.error("空白id");
                                                        }
                                                    } else {
                                                        $ui.error("空白网址");
                                                    }
                                                }
                                            });
                                            break;
                                        case 1:
                                            $input.text({
                                                type: $kbType.number,
                                                autoFontSize: true,
                                                text: debugVid,
                                                placeholder: "输入视频id(不包含av)",
                                                handler: function (vid) {
                                                    if (vid.length > 0) {
                                                        biliApi.getVideoInfo(vid);
                                                    } else {
                                                        $ui.error("空白id");
                                                    }
                                                }
                                            });
                                            break;
                                    }
                                }
                            });
                            break;
                        case 1:
                            if (biliApi.checkAccessKey()) {
                                $ui.alert({
                                    title: "已登录",
                                    message: "本地发现登录缓存，还要登录吗",
                                    actions: [{
                                        title: "获取用户信息",
                                        disabled: false, // Optional
                                        handler: function () {
                                            biliApi.getUserInfo();
                                        }
                                    }, {
                                        title: "清空登录缓存重新登录",
                                        disabled: false, // Optional
                                        handler: function () {
                                            biliApi.removeAccessKey();
                                            login();
                                        }
                                    }, {
                                        title: "关闭",
                                        disabled: false, // Optional
                                        handler: function () {}
                                    }]
                                });
                            } else {
                                login();
                            }
                            break;
                        case 2:
                            biliApi.getUserInfo();
                            break;
                        default:
                            $ui.error("暂未支持");
                    }
                }
            }
        }]
    });
}

function login() {
    $ui.menu({
        items: ["输入Access key(推荐)", "账号密码(明文)"],
        handler: function (_title, idx) {
            switch (idx) {
                case 0:
                    $input.text({
                        autoFontSize: true,
                        placeholder: "输入账号",
                        handler: function (inputKey) {
                            if (inputKey.length > 0) {
                                biliApi.saveAccessKey(inputKey);
                            } else {
                                $ui.error("空白key");
                            }
                        }
                    });
                    break;
                case 1:
                    $input.text({
                        autoFontSize: true,
                        placeholder: "输入账号",
                        handler: function (user) {
                            if (user.length > 0) {
                                $input.text({
                                    autoFontSize: true,
                                    placeholder: "输入密码",
                                    handler: function (pwd) {
                                        if (pwd.length > 0) {
                                            biliApi.getAccessKey(user, pwd);
                                        } else {
                                            $ui.error("空白密码");
                                        }
                                    }
                                });
                            } else {
                                $ui.error("空白账号");
                            }
                        }
                    });
                    break;
            }
        }
    });
}
module.exports = {
    init: init,
};