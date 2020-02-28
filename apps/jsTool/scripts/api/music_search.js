let _api = {
    search: "https://api.wispx.cn/music/search",
    download: "https://api.wispx.cn/music/url",
    pic: "https://api.wispx.cn/music/pic",
};
let siteList = ["netease", "tencent", "xiami", "kugou", "baidu"];
var siteId = 0;

let getSiteIdList = () => {
    return siteList;
};

let getSiteListWithChoose = () => {
    var _list = ["netease", "tencent", "xiami", "kugou", "baidu"];
    _list[siteId] = _list[siteId] + " √";
    return _list;
};

let setSiteId = siteIndex => {
    siteId = siteIndex;
};

let getDownloadUrl = (siteId, songId) => {
    $ui.loading(true);
    $http.get({
        url: _api.download + "?type=" + siteId + "&id=" + songId,
        handler: function (resp) {
            var _data = resp.data;
            $console.info(_data);
            if (_data.code == 200) {
                const downloadData = _data.data;
                const songInfo = ["文件大小：" + downloadData.size, "质量：" + downloadData.br];
                $ui.loading(false);
                $ui.push({
                    props: {
                        title: "歌曲下载地址"
                    },
                    views: [{
                        type: "list",
                        props: {
                            data: [{
                                    title: "下载地址",
                                    rows: [downloadData.url]
                                },
                                {
                                    title: "歌曲数据",
                                    rows: songInfo
                                }
                            ]
                        },
                        layout: $layout.fill,
                        events: {
                            didSelect: function (_sender, indexPath, _data) {
                                //section
                                switch (indexPath.section) {
                                    case 0:
                                        $ui.alert({
                                            title: "要干嘛",
                                            message: _data,
                                            actions: [{
                                                title: "分享",
                                                disabled: false, // Optional
                                                handler: function () {
                                                    $share.sheet([_data]);
                                                }
                                            }, {
                                                title: "关闭",
                                                disabled: false, // Optional
                                                handler: function () {}
                                            }]
                                        });
                                        break;
                                    case 1:
                                        $ui.alert({
                                            title: "",
                                            message: _data,
                                        });
                                        break;
                                }

                            }
                        }
                    }]
                });
            } else {
                $ui.loading(false);
                $ui.alert({
                    title: "Error " + _data.code,
                    message: _data.message,
                });
            }
        }
    });
};

let getSongPic = (siteId, songId) => {
    $ui.loading(true);
    $http.get({
        url: _api.pic + "?type=" + siteId + "&id=" + songId,
        handler: function (resp) {
            var _data = resp.data;
            $console.info(_data);
            if (_data.code == 200) {
                const resultData = _data.data;
                $ui.loading(false);
                $ui.preview({
                    title: siteId + "/" + songId,
                    url: resultData.url
                });
                $console.info(resultData.url);
            } else {
                $ui.loading(false);
                $ui.alert({
                    title: "Error " + _data.code,
                    message: _data.message,
                });
            }
        }
    });
};

let search = (siteId, keyword) => {
    $ui.loading(true);
    $http.get({
        url: _api.search + "?type=" + siteId + "&keywords=" + encodeURI(keyword),
        handler: function (resp) {
            var _data = resp.data;
            $console.info(_data);
            if (_data.code == 200) {
                const searchResult = _data.data;
                if (searchResult.length == 0) {
                    $ui.error("空白结果，尝试换个关键词");
                } else {
                    var resultTitleList = [];
                    for (i in searchResult) {
                        const thisResult = searchResult[i];
                        resultTitleList.push(thisResult.name + " - " + thisResult.artist.toString());
                    }
                    $ui.loading(false);
                    $ui.push({
                        props: {
                            title: "搜索结果"
                        },
                        views: [{
                            type: "list",
                            props: {
                                data: resultTitleList
                            },
                            layout: $layout.fill,
                            events: {
                                didSelect: function (_sender, indexPath, _data) {
                                    const thisResult = searchResult[indexPath.row];
                                    $ui.push({
                                        props: {
                                            title: _data
                                        },
                                        views: [{
                                            type: "list",
                                            props: {
                                                data: [{
                                                        title: "歌曲",
                                                        rows: [
                                                            "歌曲：" + thisResult.name,
                                                            "歌手：" + thisResult.artist,
                                                            "专辑：" + thisResult.album,
                                                            "来源：" + thisResult.source
                                                        ]
                                                    },
                                                    {
                                                        title: "更多",
                                                        rows: ["下载", "歌曲封面"]
                                                    }
                                                ]
                                            },
                                            layout: $layout.fill,
                                            events: {
                                                didSelect: function (_sender1, chooseIdx, _data1) {
                                                    switch (chooseIdx.section) {
                                                        case 0:
                                                            $ui.alert({
                                                                title: "",
                                                                message: _data1,
                                                            });
                                                            break;
                                                        case 1:
                                                            switch (chooseIdx.row) {
                                                                case 0:
                                                                    getDownloadUrl(thisResult.source, thisResult.id);
                                                                    break;
                                                                case 1:
                                                                    getSongPic(thisResult.source, thisResult.pic_id);
                                                                    break;
                                                            }
                                                            break;
                                                    }
                                                }
                                            }
                                        }]
                                    });
                                }
                            }
                        }]
                    });
                }
            } else {
                $ui.loading(false);
                $ui.alert({
                    title: "Error " + _data.code,
                    message: _data.message,
                });
            }
        }
    });
};

let searchByDefaultSite = keyword => {
    search(siteList[siteId], keyword);
};
module.exports = {
    search: search,
    getSiteIdList: getSiteIdList,
    setSiteId: setSiteId,
    getSiteListWithChoose: getSiteListWithChoose,
    searchByDefaultSite: searchByDefaultSite
};