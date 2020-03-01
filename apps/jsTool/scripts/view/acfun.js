let acApi = require("../api/acfun.js");

let init = () => {
    acApi.init();
    $ui.push({
        props: {
            title: $l10n("ACFUN")
        },
        views: [{
            type: "list",
            props: {
                data: ["登录账号", "注销账号", "获取用户信息", "视频解析", "每日签到", "查看用户投稿"]
            },
            layout: $layout.fill,
            events: {
                didSelect: function (_sender, indexPath, _data) {
                    $console.info(`acApi.isLogin:${acApi.isLogin()}`);
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
                            acApi.getVideoInfo()
                            break;
                        case 4:
                            acApi.signIn()
                            break;
                        case 5:
                            getUploaderVideo();
                            break;
                        default:
                            $ui.error("暂未支持");
                    }
                }
            }
        }],
        events: {
            appeared: function () {
                if (acApi.isLogin()) {
                    $ui.toast("已登录");
                }
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
module.exports = {
    init,
};