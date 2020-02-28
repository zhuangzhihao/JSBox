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
                data: ["登录账号", "注销账号", "获取用户信息", "视频解析", "每日签到"]
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
                        default:
                            $ui.error("暂未支持");
                    }
                }
            }
        }]
    });
};
module.exports = {
    init,
};