let _api = require("../api/music_search.js");


let initView = () => {
    $ui.push({
        props: {
            title: $l10n("MUSIC_SEARCH")
        },
        views: [{
            type: "list",
            props: {
                data: ["修改站点", "搜索歌曲"]
            },
            layout: $layout.fill,
            events: {
                didSelect: function (_sender, indexPath, _data) {
                    switch (indexPath.row) {
                        case 0:
                            $ui.menu({
                                items: _api.getSiteIdList(),
                                handler: function (title, idx) {
                                    _api.setSiteId(idx);
                                    $ui.alert({
                                        title: "已设置站点",
                                        message: title,
                                    });
                                },
                                finished: function (cancelled) {
                                    if (cancelled) {
                                        $ui.error("取消修改站点");
                                    }
                                }
                            });
                            break;
                        case 1:
                            $input.text({
                                placeholder: "输入搜索的关键词",
                                handler: function (keyword) {
                                    if (keyword.length > 0) {
                                        _api.searchByDefaultSite(keyword);
                                    } else {
                                        $ui.error("关键词空白");
                                    }
                                }
                            });
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
    init: initView
};