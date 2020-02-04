const appVersion = 1;

function checkUpdate(jsonUrl, appId) {
    //const serverJsonUrl = "https://cdn.jsdelivr.net/gh/zhuangzhihao/jsbox@master/app.json";
    //const appId = "io.zhihao.jsbox.dxy";
    $ui.alert({
        title: "你要检测更新吗?",
        message: "你点了检测更新的按钮",
        actions: [{
                title: "好的",
                disabled: false, // Optional
                handler: function () {
                    $http.get({
                        url: jsonUrl,
                        handler: function (_resp) {
                            const updateData = _resp.data;
                            $console.log("更新：获取服务器数据成功");
                            const app = updateData[appId];
                            $console.log(app);
                            if (app.version > appVersion) {
                                $console.log("更新：发现更新");
                                $ui.alert({
                                    title: "发现新版本",
                                    message: "版本号：" + app.name + "\n你要更新吗?",
                                    actions: [{
                                            title: "好的",
                                            disabled: false, // Optional
                                            handler: function () {
                                                installJs(
                                                    app.update_url,
                                                    app.name,
                                                    app.update_icon
                                                );
                                            }
                                        },
                                        {
                                            title: "不了不了",
                                            disabled: false
                                        }
                                    ]
                                });
                            } else {
                                $console.log("更新：已经是最新版");
                                $ui.toast("已经是最新版");
                            }
                        }
                    });
                }
            },
            {
                title: "不了不了",
                disabled: false
            }
        ]
    });
}

function installJs(updateUrl, updateName, updateIcon) {
    const url =
        "jsbox://import?url=" +
        $text.URLEncode(updateUrl) +
        "&name=" +
        $text.URLEncode(updateName) +
        "&icon=" +
        $text.URLEncode(updateIcon);
    $app.openURL(url);
}
module.exports = {
    checkUpdate: checkUpdate
};