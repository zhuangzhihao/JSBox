const _api = {
    getVideoInfo: "https://api.kaaass.net/biliapi/video/info?jsonerr=true&id=",
    getVideoData: "https://api.kaaass.net/biliapi/video/resolve"
}

function getVideoInfo(vid) {
    // https://api.kaaass.net/biliapi/video/info?jsonerr=true&id=89881084
    $http.get({
        url: _api.getVideoInfo + vid,
        handler: function (resp) {
            //$console.info(resp);
            var data = resp.data;
            if (resp.response.statusCode == 200) {
                if (data.status == "OK") {
                    $console.info(data);
                    const _biliData = data.data;
                    var allow_download = "";
                    if (_biliData.allow_download) {
                        allow_download = "是";
                    } else {
                        allow_download = "否";
                    }
                    var videoInfoList = [
                        "标题：" + _biliData.title,
                        "描述：" + _biliData.description,
                        "作者：" + _biliData.author,
                        "分类：" + _biliData.typename,
                        "投稿时间：" + _biliData.created_at,
                        "共有：" + _biliData.list.length + " 个分P",
                        "允许下载：" + allow_download,
                        "播放：" + _biliData.play,
                        "评论：" + _biliData.review,
                        "弹幕：" + _biliData.video_review,
                        "收藏：" + _biliData.favorites,
                        "投币：" + _biliData.coins,
                        "稿件类型：" + _biliData.arctype
                    ];
                    $ui.push({
                        props: {
                            title: "加载成功",
                            navButtons: [{
                                title: "打开网页版",
                                icon: "068", // Or you can use icon name
                                symbol: "checkmark.seal", // SF symbols are supported
                                handler: () => {
                                    $ui.preview({
                                        title: "av" + vid,
                                        url: "https://www.bilibili.com/av" + vid
                                    });
                                }
                            }]
                        },
                        views: [{
                            type: "list",
                            props: {
                                data: [{
                                        title: "功能",
                                        rows: ["下载封面", "下载up头像", "视频解析", "查看弹幕"]
                                    },
                                    {
                                        title: "数据",
                                        rows: videoInfoList
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
                                                    $ui.preview({
                                                        title: "av" + vid,
                                                        url: _biliData.pic
                                                    });
                                                    break;
                                                case 1:
                                                    $ui.preview({
                                                        title: _biliData.author,
                                                        url: _biliData.face
                                                    });
                                                    break;
                                                default:
                                                    $ui.error("不支持");
                                            }
                                            break;
                                        case 1:
                                            $ui.alert({
                                                title: "",
                                                message: JSON.stringify(_data)
                                            });
                                            break;
                                    }
                                }
                            }
                        }]
                    });
                } else {
                    $ui.alert({
                        title: "Error " + resp.response.statusCode,
                        message: data.code,
                    });
                }
            } else {
                $ui.alert({
                    title: "Error " + resp.response.statusCode,
                    message: data.code,
                });
            }
        }
    });
}

function getVideoData(vid) {

}
module.exports = {
    getVideoInfo: getVideoInfo,
};