$include("./codePrototype.js");
$include("./codePrototype.js");
let sys = require("./system.js");
let _api = {
    getVideoInfo: "https://api.kaaass.net/biliapi/video/info?jsonerr=true&id=",
    getVideoData: "https://api.kaaass.net/biliapi/video/resolve?jsonerr=true",
    getAccessKey: "https://api.kaaass.net/biliapi/user/login?jsonerr=true&direct=true",
    getUserInfo: "https://api.kaaass.net/biliapi/user/info?jsonerr=true",
    getVideoData: "https://api.kaaass.net/biliapi/video/resolve?jsonerr=true&direct=true",
    getLiveGiftList: "https://api.live.bilibili.com/xlive/app-room/v1/gift/bag_list?access_key="
};
let _cacheKey = {
    access_key: "bilibili_access_key"
};
var _userData = {
    access_key: "",
    loginData: {},
};
let _cacheDir = ".cache/bilibili/";
let isShareMode = true;

// function
let getLiveGiftList = () => {
    $ui.loading(true);
    const accessKey = checkAccessKey() ? _userData.access_key : undefined;
    if (accessKey) {
        $http.get({
            url: _api.getLiveGiftList + accessKey,
            handler: function (resp) {
                const giftResult = resp.data;
                if (giftResult.code == 0) {
                    const giftList = giftResult.data.list;
                    const giftTitleList = giftList.map(gift =>
                        `${gift.gift_name}（${gift.corner_mark}）${gift.gift_num}个`
                    );
                    $ui.loading(false);
                    if (giftList.length) {
                        saveCache("getLiveGiftList", resp.rawData);
                        $ui.push({
                            props: {
                                title: $l10n("BILIBILI")
                            },
                            views: [{
                                type: "list",
                                props: {
                                    data: giftTitleList
                                },
                                layout: $layout.fill,
                                events: {
                                    didSelect: function (_sender, indexPath, _data) {
                                        const thisGift = giftList[indexPath.row];
                                        $ui.alert({
                                            title: thisGift.gift_name,
                                            message: `拥有数量:${thisGift.gift_num}个\n到期时间:${thisGift.corner_mark}`,
                                        });
                                    }
                                }
                            }]
                        });
                    } else {
                        $ui.error("你没有任何礼物");
                    }
                } else {
                    $ui.loading(false);
                    $ui.error(giftResult.message);
                }
            }
        })
    } else {
        $ui.loading(false);
        $ui.error("未登录");
    }
}
let getVidFromUrl = url => {
    const siteList = ['https://', 'http://', "b23.tv/", "www.bilibili.com/video/", "www.bilibili.com/", "av"];
    var newUrl = url;
    siteList.map(x => {
        if (newUrl.startsWith(x)) {
            newUrl = newUrl.remove(x);
        }
    });
    if (newUrl.indexOf("?")) {
        newUrl = newUrl.split("?")[0].remove("/");
    }
    return newUrl;
};

let saveCache = (mode, str) => {
    $file.mkdir(_cacheDir + mode);
    return $file.write({
        path: `${_cacheDir}${mode}/${sys.getNowUnixTime()}.json`,
        data: $data({
            string: str
        })
    });
};

let saveAccessKey = access_key => {
    _userData.access_key = access_key;
    $cache.set(_cacheKey.access_key, access_key);
    $ui.toast("已保存access key");
};

let loadAccessKey = () => {
    const cacheKey = $cache.get(_cacheKey.access_key);
    if (cacheKey) {
        _userData.access_key = cacheKey;
    }
};

let removeAccessKey = () => {
    $cache.remove(_cacheKey.access_key);
    $ui.toast("已清除access key");
};

let checkAccessKey = () => {
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
};

let getVideoInfo = vid => {
    $http.get({
        url: _api.getVideoInfo + vid,
        handler: function (resp) {
            const data = resp.data;
            if (resp.response.statusCode == 200) {
                if (data.status == "OK") {
                    const _biliData = data.data;
                    const allow_download = _biliData.allow_download ? "是" : "否";
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
                    const listView = {
                        props: {
                            title: "加载成功",
                            navButtons: [{
                                title: "打开网页版",
                                icon: "068", // Or you can use icon name
                                symbol: "checkmark.seal", // SF symbols are supported
                                handler: () => {
                                    $ui.preview({
                                        title: "av" + vid,
                                        url: `https://www.bilibili.com/av${vid}`
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
                                                case 2:
                                                    getVideo(vid, _biliData);
                                                    break;
                                                default:
                                                    $ui.error("不支持");
                                            }
                                            break;
                                        case 1:
                                            const _list = _data.split("：");
                                            $ui.alert({
                                                title: _list[0],
                                                message: _list[1]
                                            });
                                            break;
                                    }
                                }
                            }
                        }]
                    };
                    switch ($app.env) {
                        case $env.app:
                            $ui.push(listView);
                            break;
                        default:
                            $ui.render(listView);
                    }
                } else {
                    $ui.alert({
                        title: `Error ${resp.response.statusCode}`,
                        message: data,
                    });
                }
            } else {
                $ui.alert({
                    title: `Error ${resp.response.statusCode}`,
                    message: data.code,
                });
            }
        }
    });
};

let getVideo = (vid, _biliData) => {
    const partList = _biliData.list;
    const partTitleList = partList.map(x => x.part);
    $ui.menu({
        items: partTitleList,
        handler: function (title, idx) {
            checkAccessKey() ?
                getVideoData(vid, idx + 1, 116, _userData.access_key) : //1080p以上需要带header
                getVideoData(vid, idx + 1, 80, "");

        }
    });
};

let getVideoData = (vid, page, quality, access_key) => {
    $ui.loading(true);
    $http.get({
        url: `${_api.getVideoData}&id=${vid}&page=${page}&quality${quality}&access_key=${access_key}`,
        handler: function (videoResp) {
            var videoData = videoResp.data;
            if (videoData.status == "OK") {
                if (videoData.url.length > 0) {
                    const copyStr = JSON.stringify(videoData.headers);
                    $http.get({
                        url: videoData.url,
                        handler: function (biliResp) {
                            var biliData = biliResp.data;
                            if (biliData.code == 0) {
                                const downloadList = biliData.data.durl;
                                if (downloadList.length > 1) {
                                    var dList = [];
                                    for (i in downloadList) {
                                        dList.push(`第${(i + 1).toString()}个文件`);
                                    }
                                    $ui.loading(false);
                                    $ui.push({
                                        props: {
                                            title: "可下载文件列表"
                                        },
                                        views: [{
                                            type: "list",
                                            props: {
                                                data: dList
                                            },
                                            layout: $layout.fill,
                                            events: {
                                                didSelect: function (_sender, indexPath, data) {
                                                    showDownList(downloadList[indexPath.row], copyStr);
                                                }
                                            }
                                        }]
                                    });
                                } else {
                                    showDownList(downloadList[0], copyStr);
                                }

                            } else {
                                $ui.loading(false);
                                $ui.alert({
                                    title: `Error ${biliData.code}`,
                                    message: biliData.message,
                                });
                            }
                        }
                    });
                } else {
                    $ui.loading(false);
                    $ui.error("url.length==0");
                }
            } else {
                $ui.loading(false);
                $ui.alert({
                    title: `Error Code ${videoResp.code}`,
                    message: videoResp.message,
                });
            }

        }
    });
};
let showDownList = (thisFile, copyStr) => {
    var urlList = [thisFile.url];
    urlList = urlList.concat(thisFile.backup_url);
    $ui.push({
        props: {
            title: "可下载文件列表"
        },
        views: [{
            type: "list",
            props: {
                data: urlList
            },
            layout: $layout.fill,
            events: {
                didSelect: function (_sender, idxp, _data) {
                    if (copyStr.length > 0) {
                        $ui.toast("请复制headers");
                        $input.text({
                            placeholder: "",
                            text: copyStr,
                            handler: function (text) {
                                copyStr.copy();
                                $share.sheet([_data]);
                            }
                        });
                    } else {
                        $share.sheet([_data]);
                    }
                }
            }
        }]
    });
};
let getAccessKey = (userName, password) => {
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
            if (kaaassData.status == "OK") {
                var success = saveCache("getAccessKey", kaaassResult.rawData);
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
};

let loginBilibili = (loginUrl, bodyStr, headers) => {
    var passportBody = {};
    const bodyList = bodyStr.split("&");
    for (b in bodyList) {
        const thisBody = bodyList[b];
        const bb = thisBody.split("=");
        passportBody[bb[0]] = bb[1];
    }
    $http.post({
        url: loginUrl,
        header: headers,
        body: bodyStr,
        handler: function (loginResp) {
            var loginData = loginResp.data;
            $console.info(loginData);
            if (loginData.code == 0) {
                var success = saveCache("bilibiliPassport", loginResp.rawData);
                $console.info(`cache:${success}`);
                saveAccessKey(loginData.data.token_info.access_token);
                $console.info(`loginData.access_token:${_userData.access_key}`);
                $ui.loading(false);
                $input.text({
                    placeholder: "",
                    text: _userData.access_key,
                    handler: function (text) {
                        text.copy();
                        $ui.toast("已复制！");
                    }
                });
            } else {
                $ui.loading(false);
                $console.error(`bilibiliLogin: ${loginData.message}`);
                $ui.error(`bilibiliLogin: ${loginData.message}`);
            }
        }
    });
};

let getUserInfo = () => {
    // furtherInfo: 是否获取详细用户信息
    if (checkAccessKey()) {
        const url = `${_api.getUserInfo}&access_key=${_userData.access_key}&furtherInfo=true`;
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
                        `用户昵称：${user.userName}`,
                        `用户uid：${ user.uid}`,
                        `登录用id：${user.loginId}`,
                        `注册时间戳：${user.registerTime}`,
                        `此次登录到期时间戳：${user.loginExpireTime}`,
                        `登录用access key：${ user.accessKey}`,
                        `投稿视频：${user.uploadVideo.count} 个`,
                        `点赞视频：${ user.likeVideo.count} 个`,
                        `投硬币：${user.giveCoin.count} 个`,
                        `玩过游戏：${user.playGame.count} 个`,
                        `追番：${ user.anime.count} 部`,
                        `收藏夹：${user.favourite.count} 个`,
                        `追更漫画：${user.subscribeComic.count} 部`,
                    ];
                    $ui.loading(false);
                    const view = {
                        props: {
                            title: "加载成功",
                            navButtons: [{
                                title: "打开网页版",
                                icon: "068", // Or you can use icon name
                                symbol: "checkmark.seal", // SF symbols are supported
                                handler: () => {
                                    $ui.preview({
                                        title: user.userName,
                                        url: `https://space.bilibili.com/${user.uid}`
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
                                                        _g[1].copy();
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
                    };
                    $ui.push(view);

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
};

let init = () => {
    //初始化，加载缓存
    isShareMode = false;
    loadAccessKey();
    return checkAccessKey();
};
module.exports = {
    getVideoInfo,
    getAccessKey,
    checkAccessKey,
    getUserInfo,
    saveAccessKey,
    init,
    removeAccessKey,
    getVideoData,
    getVideo,
    getVidFromUrl,
    getLiveGiftList,
};