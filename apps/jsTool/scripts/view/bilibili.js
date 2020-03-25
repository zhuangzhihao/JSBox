let biliApi = require("../api/bilibili.js");
let biliAvbv = require("../api/bilibili-avbv.js");
let urlCheck = require("../api/urlCheck.js");
let debugVid = "90035938";

let init = (url) => {
    if (url) {
        if (urlCheck.isBilibiliVideoUrl(url)) {
            biliApi.getVideoInfo(biliApi.getVidFromUrl(url));
        } else {
            $ui.error("不支持该链接");
        }
    } else {
        $ui.push({
            props: {
                title: $l10n("BILIBILI")
            },
            views: [{
                type: "list",
                props: {
                    data: [{
                            title: "账号",
                            rows: ["登录账号", "获取用户信息"]
                        },
                        {
                            title: "视频",
                            rows: ["获取视频信息", "AV&BV互转"]
                        },
                        {
                            title: "直播",
                            rows: ["获取直播间拥有礼物", "查看vTuber状态", "查看拥有的粉丝勋章"]
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
                                        biliApi.checkAccessKey() ?
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
                                            }) :
                                            login();
                                        break;
                                    case 1:
                                        biliApi.checkAccessKey() ?
                                            biliApi.getUserInfo() :
                                            $ui.error("未登录");
                                        break;
                                    default:
                                        $ui.error("未知错误");
                                }
                                break;
                            case 1:
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
                                                                        biliApi.getVideoInfo(vid);
                                                                    } else if (vid == url) {
                                                                        $ui.error("解析网址失败");
                                                                    } else {
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
                                                    default:
                                                        $ui.error("暂未支持");
                                                }
                                            }
                                        });
                                        break;
                                    case 1:
                                        $ui.menu({
                                            items: ["AV->BV", "BV->AV"],
                                            handler: function (_title, menuIdx) {
                                                switch (menuIdx) {
                                                    case 0:
                                                        $input.text({
                                                            placeholder: "输入AV,不包含开头的av",
                                                            text: "170001",
                                                            handler: function (AV) {
                                                                if (AV) {
                                                                    const bv = biliAvbv.getBv(AV);
                                                                    if (bv) {
                                                                        $input.text({
                                                                            placeholder: "点击复制，修改文本并不会改变复制的内容",
                                                                            text: bv,
                                                                            handler: function (result) {
                                                                                $clipboard.copy({
                                                                                    "text": bv,
                                                                                    "ttl": 30,
                                                                                    "locally": true
                                                                                });
                                                                                $ui.toast("复制完毕");
                                                                            }
                                                                        });
                                                                    } else {
                                                                        $ui.alert({
                                                                            title: "错误",
                                                                            message: "空白结果",
                                                                        });
                                                                    }
                                                                } else {
                                                                    $ui.alert({
                                                                        title: "错误",
                                                                        message: "请输入内容",
                                                                    });
                                                                }
                                                            }
                                                        });
                                                        break;
                                                    case 1:
                                                        $input.text({
                                                            placeholder: "输入BV",
                                                            text: "BV17x411w7KC",
                                                            handler: function (BV) {
                                                                if (BV) {
                                                                    const av = biliAvbv.getAv(BV);
                                                                    if (av) {
                                                                        $input.text({
                                                                            placeholder: "点击复制，修改文本并不会改变复制的内容",
                                                                            text: av,
                                                                            handler: function (result) {
                                                                                $clipboard.copy({
                                                                                    "text": av,
                                                                                    "ttl": 30,
                                                                                    "locally": true
                                                                                });
                                                                                $ui.toast("复制完毕");
                                                                            }
                                                                        });
                                                                    } else {
                                                                        $ui.alert({
                                                                            title: "错误",
                                                                            message: "空白结果",
                                                                        });
                                                                    }
                                                                } else {
                                                                    $ui.alert({
                                                                        title: "错误",
                                                                        message: "请输入内容",
                                                                    });
                                                                }
                                                            }
                                                        });
                                                        break;
                                                }
                                            }
                                        });
                                        break;
                                    default:
                                        $ui.error("暂未支持");
                                }
                                break;
                            case 2:
                                switch (indexPath.row) {
                                    case 0:
                                        biliApi.checkAccessKey() ?
                                            biliApi.getLiveGiftList() :
                                            $ui.error("未登录");
                                        break;
                                    case 1:
                                        $input.text({
                                            type: $kbType.number,
                                            placeholder: "用户个人空间数字id,不是直播间id",
                                            text: "",
                                            handler: function (mid) {
                                                if (mid) {
                                                    biliApi.getLiveroomInfo(mid);
                                                } else {
                                                    $ui.alert({
                                                        title: "错误",
                                                        message: "请输入id",
                                                    });
                                                }
                                            }
                                        });
                                        break;
                                    case 2:
                                        biliApi.checkAccessKey() ?
                                            biliApi.getFansMedalList() :
                                            $ui.error("未登录");
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
                    if (biliApi.init()) {
                        $ui.toast("已登录");
                    }
                }
            }
        });
    }
};
let login = () => {
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
};
module.exports = {
    init: init,
};