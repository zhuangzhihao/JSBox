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
                var topTitle = [];
                var storyTitle = [];
                for (t in topList) {
                    topTitle.push(topList[t].title);
                }
                for (s in storyList) {
                    storyTitle.push(storyList[s].title);
                }
                $ui.loading(false);
                $ui.push({
                    props: {
                        title: zhihu.date
                    },
                    views: [{
                        type: "list",
                        props: {
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