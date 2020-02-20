const sys = require("./system.js");
const _api = {
    getVideoInfo: "https://api.kaaass.net/biliapi/video/info?jsonerr=true&id=",
    getVideoData: "https://api.kaaass.net/biliapi/video/resolve?jsonerr=true",
    getAccessKey: "https://api.kaaass.net/biliapi/user/login?jsonerr=true&direct=true",
    getUserInfo: "https://api.kaaass.net/biliapi/user/info?jsonerr=true",
    getVideoData: "https://api.kaaass.net/biliapi/video/resolve?jsonerr=true&direct=true",
};
const _cacheKey = {
    access_key: "bilibili_access_key"
};
var _userData = {
    access_key: "",
    loginData: {},
};
const _cacheDir = ".cache/bilibili/";

function saveCache(mode, str) {
    $file.mkdir(_cacheDir + mode);
    return $file.write({
        data: str,
        path: _cacheDir + mode + "/" + sys.getNowUnixTime() + ".json"
    });
}

function saveAccessKey(access_key) {
    _userData.access_key = access_key;
    $cache.set(_cacheKey.access_key, access_key);
    $ui.toast("已保存access key");
}

function loadAccessKey() {
    const cacheKey = $cache.get(_cacheKey.access_key);
    if (cacheKey) {
        _userData.access_key = cacheKey;
    }
}

function removeAccessKey() {
    $cache.remove(_cacheKey.access_key);
    $ui.toast("已清除access key");
}

function checkAccessKey() {
    if (_userData.access_key) {
        return true;
    } else {
        const accessKeyFromCache = loadAccessKey();
        if (accessKeyFromCache) {
            _userData.access_key = accessKeyFromCache;
            return true;
        }
        return false;
    }
}

function getVideoInfo(vid) {
    // https://api.kaaass.net/biliapi/video/info?jsonerr=true&id=90035938
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

function getVideoData(vid, page, quality, access_key) {
    $http.get({
        url: _api.getVideoData + "&id=" + vid + "&page=" + page + "&quality=" + quality + "&access_key=" + access_key,
        handler: function (videoResp) {
            var videoData = videoResp.data;
            if (videoData.code == 0) {

            } else {
                $ui.alert({
                    title: "Error Code " + videoResp.code,
                    message: videoResp.message,
                });
            }

        }
    });
}

function getAccessKey(userName, password) {
    $ui.loading(true);
    $http.post({
        url: _api.getAccessKey,
        header: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: {
            user: userName,
            passwd: password
        },
        handler: function (kaaassResult) {
            var kaaassData = kaaassResult.data;
            $console.info(kaaassData);
            if (kaaassData.status == "OK") {
                var success = saveCache("getAccessKey", kaaassResult.rawData);
                $console.info("cache:" + success);
                loginBilibili(kaaassData.url, kaaassData.body, kaaassData.headers);
            } else {
                $ui.loading(false);
                $ui.alert({
                    title: kaaassData.code,
                    message: kaaassData.info,
                });
            }
        }
    });
}

function loginBilibili(loginUrl, bodyStr, headers) {
    var passportBody = {};
    const bodyList = bodyStr.split("&");
    for (b in bodyList) {
        const thisBody = bodyList[b];
        const bb = thisBody.split("=");
        passportBody[bb[0]] = bb[1];
    }
    $console.info(passportBody);
    $http.post({
        url: loginUrl,
        header: headers,
        body: bodyStr,
        handler: function (loginResp) {
            var loginData = loginResp.data;
            $console.info(loginData);
            if (loginData.code == 0) {
                var success = saveCache("bilibiliPassport", loginResp.rawData);
                $console.info("cache:" + success);
                saveAccessKey(loginData.data.token_info.access_token);
                $console.info("loginData.access_token: " + _userData.access_key);
                $ui.loading(false);
                $input.text({
                    placeholder: "",
                    text: _userData.access_key,
                    handler: function (text) {
                        sys.copyToClipboard(text);
                        $ui.toast("已复制！");
                    }
                });
            } else {
                $ui.loading(false);
                $console.error("bilibiliLogin: " + loginData.message);
                $ui.error("bilibiliLogin: " + loginData.message);
            }
        }
    });
}

function getUserInfo() {
    // furtherInfo: 是否获取详细用户信息
    if (checkAccessKey()) {
        const url = _api.getUserInfo + "&access_key=" + _userData.access_key + "&furtherInfo=true";
        $ui.loading(true);
        $http.get({
            url: url,
            handler: function (userResp) {
                var userData = userResp.data;
                if (userData.status == "OK") {
                    saveCache("getUserInfo", userResp.rawData);
                    const user_info = userData.info;
                    const user_further = userData.further;
                    // 用户数据
                    const user = {
                        uid: user_info.mid,
                        userName: user_info.uname,
                        loginId: user_info.userid,
                        registerTime: user_info.create_at,
                        loginExpireTime: user_info.expires,
                        accessKey: user_info.access_key,
                        uploadVideo: user_further.archive,
                        liveStream: user_further.live,
                        playGame: user_further.play_game,
                        anime: user_further.season,
                        giveCoin: user_further.coin_archive,
                        likeVideo: user_further.like_archive,
                        favourite: user_further.favourite2,
                        subscribeComic: user_further.sub_comic
                    };
                    const userDataList = [
                        "用户昵称：" + user.userName,
                        "用户uid：" + user.uid,
                        "登录用id：" + user.loginId,
                        "注册时间戳：" + user.registerTime,
                        "此次登录到期时间戳：" + user.loginExpireTime,
                        "登录用access key：" + user.accessKey,
                        "投稿视频：" + user.uploadVideo.count + " 个",
                        "点赞视频：" + user.likeVideo.count + " 个",
                        "投硬币：" + user.giveCoin.count + " 个",
                        "玩过游戏：" + user.playGame.count + " 个",
                        "追番：" + user.anime.count + " 部",
                        "收藏夹：" + user.favourite.count + " 个",
                        "追更漫画：" + user.subscribeComic.count + " 部",
                    ];
                    $ui.loading(false);
                    $ui.push({
                        props: {
                            title: "加载成功",
                            navButtons: [{
                                title: "打开网页版",
                                icon: "068", // Or you can use icon name
                                symbol: "checkmark.seal", // SF symbols are supported
                                handler: () => {
                                    $ui.preview({
                                        title: user.userName,
                                        url: "https://space.bilibili.com/" + user.uid
                                    });
                                }
                            }]
                        },
                        views: [{
                            type: "list",
                            props: {
                                data: [{
                                        title: "功能",
                                        rows: ["编辑access key"]
                                    },
                                    {
                                        title: "数据",
                                        rows: userDataList
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
                                                    $input.text({
                                                        placeholder: "access key",
                                                        text: _userData.access_key,
                                                        handler: function (inputKey) {
                                                            saveAccessKey(inputKey)
                                                        }
                                                    });
                                                    break;
                                                default:
                                                    $ui.error("不支持");
                                            }
                                            break;
                                        case 1:
                                            const _g = _data.split("：");
                                            $ui.alert({
                                                title: _g[0],
                                                message: _g[1],
                                                actions: [{
                                                    title: "复制",
                                                    disabled: false, // Optional
                                                    handler: function () {
                                                        sys.copyToClipboard(_g[1]);
                                                        $ui.toast("已复制");
                                                    }
                                                }, {
                                                    title: "关闭",
                                                    disabled: false, // Optional
                                                    handler: function () {}
                                                }]
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
                        title: userData.code,
                        message: userData.info,
                    });
                }
            }
        });
    } else {
        $ui.loading(false);
        $ui.error("未登录！");
    }
}

function init() {
    //初始化，加载缓存
    loadAccessKey();
    return checkAccessKey();
}
module.exports = {
    getVideoInfo: getVideoInfo,
    getAccessKey: getAccessKey,
    checkAccessKey: checkAccessKey,
    getUserInfo: getUserInfo,
    saveAccessKey: saveAccessKey,
    init: init,
    removeAccessKey:removeAccessKey,

};