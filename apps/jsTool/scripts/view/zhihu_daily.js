let appScheme = require("../api/app_scheme.js");
let _url = "https://news-at.zhihu.com/api/4/news/latest";

let init = () => {
    $ui.loading(true);
    $http.get({
        url: _url,
        handler: function (resp) {
            var zhihu = resp.data;
            if (zhihu) {
                const topList = zhihu.top_stories;
                const storyList = zhihu.stories;
                const topTitle = topList.map(t => t.title);
                const storyTitle = storyList.map(s => s.title);
                $ui.loading(false);
                $ui.push({
                    props: {
                        title: zhihu.date
                    },
                    views: [{
                        type: "list",
                        props: {
                            menu: {
                                title: "菜单",
                                items: [{
                                    title: "添加到Safari阅读列表",
                                    symbol: "book",
                                    handler: (sender, indexPath) => {
                                        const url = indexPath.section == 0 ?
                                            topList[indexPath.row].url :
                                            storyList[indexPath.row].url;
                                        const title = indexPath.section == 0 ?
                                            topList[indexPath.row].title :
                                            storyList[indexPath.row].title;
                                        const hint = indexPath.section == 0 ?
                                            topList[indexPath.row].hint :
                                            storyList[indexPath.row].hint;
                                        appScheme.safariReadMode(url);
                                    }
                                }, {
                                    title: "尝试使用阅读模式打开",
                                    symbol: "book.fill",
                                    handler: (sender, indexPath) => {
                                        const url = indexPath.section == 0 ?
                                            topList[indexPath.row].url :
                                            storyList[indexPath.row].url;
                                        appScheme.safariReadMode(url);
                                    }
                                }, {
                                    title: "使用[简悦 · 阅读器]打开",
                                    symbol: "book.circle",
                                    handler: (sender, indexPath) => {
                                        const url = indexPath.section == 0 ?
                                            topList[indexPath.row].url :
                                            storyList[indexPath.row].url;
                                        $clipboard.copy({
                                            "text": url,
                                            "ttl": 30,
                                            "locally": true
                                        });
                                        $addin.run("简悦 · 阅读器");
                                    }
                                }, ]
                            },
                            data: [{
                                    title: "置顶",
                                    rows: topTitle
                                },
                                {
                                    title: "故事",
                                    rows: storyTitle
                                }
                            ]
                        },
                        layout: $layout.fill,
                        events: {
                            didSelect: function (_sender, indexPath, _data) {
                                switch (indexPath.section) {
                                    case 0:
                                        $ui.preview({
                                            title: _data,
                                            url: topList[indexPath.row].url
                                        });
                                        break;
                                    case 1:
                                        $ui.preview({
                                            title: _data,
                                            url: storyList[indexPath.row].url
                                        });
                                        break;
                                }
                            }
                        }
                    }]
                });
            } else {
                $ui.loading(false);
                $ui.error("加载失败，未知错误");
            }
        }
    });
};

module.exports = {
    init: init
};