let acApi = require("../api/acfun.js");
let str = require("../api/string.js");
let isInit = false;
let init = () => {
    acApi.init();
    $ui.push({
        props: {
            title: $l10n("ACFUN")
        },
        views: [{
            type: "list",
            props: {
                data: [{
                    title: "账号",
                    rows: ["登录账号", "注销账号", "获取用户信息", "每日签到"]
                }, {
                    title: "投稿",
                    rows: ["视频解析", "查看用户投稿"]
                }, {
                    title: "其他",
                    rows: ["扫二维码"]
                }]
            },
            layout: $layout.fill,
            events: {
                didSelect: function (_sender, indexPath, _data) {
                    $console.info(`acApi.isLogin:${acApi.isLogin()}`);
                    switch (indexPath.section) {
                        case 0:
                            switch (indexPath.row) {
                                case 0:
                                    acApi.isLogin() ?
                                        $ui.error("已登录") :
                                        $input.text({
                                            autoFontSize: true,
                                            placeholder: "输入账号",
                                            handler: function (userName) {
                                                if (userName.length > 0) {
                                                    $input.text({
                                                        autoFontSize: true,
                                                        placeholder: "输入密码",
                                                        handler: function (pwd) {
                                                            if (pwd.length > 0) {
                                                                acApi.login(userName, pwd);
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
                                case 1:
                                    acApi.isLogin() ?
                                        acApi.logout() :
                                        $ui.error("未登录");
                                    break;
                                case 2:
                                    acApi.isLogin() ?
                                        acApi.getUserInfo() :
                                        $ui.error("未登录");
                                    break;
                                case 3:
                                    acApi.signIn()
                                    break;
                                default:
                                    $ui.error("暂未支持");
                            }
                            break;
                        case 1:
                            switch (indexPath.row) {
                                case 0:
                                    acApi.getVideoInfo()
                                    break;
                                case 1:
                                    getUploaderVideo();
                                    break;
                                default:
                                    $ui.error("暂未支持");
                            }
                            break;
                        case 2:
                            switch (indexPath.row) {
                                case 0:
                                    qrcodeScan();
                                    break;
                                default:
                                    $ui.error("暂未支持");
                            }
                            break;
                        default:
                            $ui.error("暂未支持");
                    }
                }
            }
        }],
        events: {
            appeared: function () {
                if (acApi.isLogin() && !isInit) {
                    $ui.toast("已登录");
                }
                isInit = true;
            }
        }
    });
};
let getUploaderVideo = () => {
    $input.text({
        type: $kbType.number,
        placeholder: "请输入uid",
        text: $cache.get(acApi._cacheKey.uploaderVideo_lastUid) || "",
        handler: function (uid) {
            if (uid.length > 0) {
                $input.text({
                    type: $kbType.number,
                    placeholder: "请输入页数,从1开始",
                    text: $cache.get(acApi._cacheKey.uploaderVideo_lastPage + uid) || "",
                    handler: function (page) {
                        if (uid.length > 0) {
                            acApi.getUploaderVideo(uid, page);
                        } else {
                            $ui.error("请输入页数,从1开始");
                        }
                    }
                });
            } else {
                $ui.error("请输入uid");
            }
        }
    });
};
let qrcodeScan = () => {
    $qrcode.scan({
        handler(string) {
            if (str.checkIfUrl(string)) {
                if (acApi.isVideoUrl(string)) {
                    const vid = acApi.getVidFromUrl(string);
                    if (vid) {
                        $ui.alert({
                            title: "视频链接",
                            message: "是否开始解析视频",
                            actions: [{
                                title: "解析视频",
                                disabled: false,
                                handler: function () {
                                    acApi.getVideoPid(vid);
                                }
                            }, {
                                title: "关闭",
                                disabled: false,
                                handler: function () {}
                            }]
                        });
                    } else {
                        $ui.alert({
                            title: "不支持该二维码",
                            message: "链接不包含视频id",
                        });
                    }
                } else {
                    $ui.alert({
                        title: "不支持该二维码",
                        message: "二维码内容只支持视频链接",
                    });
                }
            } else {
                $ui.alert({
                    title: "不支持该二维码",
                    message: "二维码内容只支持链接",
                });
            }
        },
        cancelled() {
            $ui.toast("Cancelled")
        }
    });
};
module.exports = {
    init,
};