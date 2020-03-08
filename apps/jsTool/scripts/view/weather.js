let weatherApi = require("../api/weather.js");
let init = () => {
    weatherApi.initToken();
    $ui.push({
        props: {
            title: "天气"
        },
        views: [{
            type: "list",
            props: {
                data: [{
                    title: "查看天气",
                    rows: ["ip所在地天气", "搜索天气", "搜索地区id"]
                }, {
                    title: "更多",
                    rows: ["设置认证key/密钥"]
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
                                    weatherApi.checkToken() ?
                                        weatherApi.getNow("auto_ip") :
                                        $ui.error("请输入认证key/密钥");
                                    break;
                                case 1:
                                    if (weatherApi.checkToken()) {
                                        $input.text({
                                            placeholder: "地区id",
                                            text: weatherApi.getLastLocationId(),
                                            handler: function (text) {
                                                text.length > 0 ?
                                                    weatherApi.getNow(text) :
                                                    $ui.error("请输入id");
                                            }
                                        });
                                    } else {
                                        $ui.error("请输入认证key/密钥");
                                    }
                                    break;
                                case 2:
                                    $safari.open({
                                        url: "https://where.heweather.com/index.html"
                                    });
                                    break;
                                default:
                                    $ui.error("不支持这个功能");
                            }
                            break;
                        case 1:
                            switch (row) {
                                case 0:
                                    $input.text({
                                        placeholder: "认证key/密钥",
                                        handler: function (key) {
                                            if (key) {
                                                weatherApi.setToken(key) ?
                                                    $ui.toast("设置成功") :
                                                    $ui.error("设置失败");
                                            } else {
                                                $ui.alert({
                                                    title: "错误",
                                                    message: "空白key",
                                                });
                                            }
                                        }
                                    });
                                    break;
                                default:
                                    $ui.error("不支持这个功能");
                            }
                            break;
                        default:
                            $ui.error("不支持这个功能");
                    }
                }
            }
        }]
    });
}
module.exports = {
    init
};