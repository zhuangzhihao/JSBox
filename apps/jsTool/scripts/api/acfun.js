$include("./codePrototype.js");
let sys = require("./system.js");
let appScheme = require("./app_scheme.js");
let _url = {
    login: "https://id.app.acfun.cn/rest/app/login/signin",
    getUserInfo: "https://api-new.app.acfun.cn/rest/app/user/personalInfo",
    downloadVideo: "https://api-new.app.acfun.cn/rest/app/play/playInfo/mp4",
    getVideoInfo: "https://api-new.app.acfun.cn/rest/app/douga/info?dougaId=",
    signIn: "https://api-new.app.acfun.cn/rest/app/user/signIn",
    getUploaderVideo: "https://api-new.app.acfun.cn/rest/app/user/resource/query"
};
let acVideoSiteList = [
    "acfun://detail/upPage/",
    "https://www.acfun.cn/v/ac",
    "https://m.acfun.cn/v/?"
];
let acUploaderSiteList = [
    "https://www.acfun.cn/u/",
    "https://m.acfun.cn/upPage/"
];
let _cacheDir = ".cache/acfun/";
let acHeaders = {
    "Content-Type": "application/x-www-form-urlencoded",
    "User-Agent": "AcFun/6.17.0 (iPhone; iOS 13.4; Scale/2.00)",
    "deviceType": 0,
    "market": "appstore",
    "appVersion": "6.17.0.349",
};
let _cacheKey = {
    acPassToken: "acfun_acPassToken",
    token: "acfun_token",
    acSecurity: "acfun_acSecurity",
    auth_key: "acfun_auth_key",
    userid: "acfun_userid",
    uploaderVideo_lastUid: "acfun_uploaderVideo_lastUid",
    uploaderVideo_lastPage: "acfun_uploaderVideo_lastPage_",
    lastClickedVid: "acfun_lastClickedVid",
};
var acUserData = {
    acPassToken: "",
    token: "",
    acSecurity: "",
    isLogin: false,
    auth_key: "",
    userid: "",

};
let login = (id, pwd) => {
    $ui.loading(true);
    $http.post({
        url: _url.login,
        header: acHeaders,
        body: {
            username: id,
            password: pwd
        },
        handler: function (resp) {
            const acResult = resp.data;
            $console.info(acResult);
            if (acResult.result == 0) {
                saveCache("loginAcfun", $data({
                    string: JSON.stringify(resp.data, null, 2)
                }));
                saveUserToken(acResult);
                loadUserToken();
                $ui.loading(false);
                $ui.alert({
                    title: "登录结果",
                    message: JSON.stringify(acResult),
                });
            } else {
                $ui.loading(false);
                $ui.alert({
                    title: "登录失败",
                    message: acResult.error_msg,
                });
            }
        }
    });
};

let saveCache = (mode, str) => {
    $file.mkdir(_cacheDir + mode);
    return $file.write({
        data: str,
        path: _cacheDir + mode + "/" + sys.getNowUnixTime() + ".json"
    });
};

let saveUserToken = acResult => {
    $cache.set(_cacheKey.acPassToken, acResult.acPassToken);
    $cache.set(_cacheKey.token, acResult.token);
    $cache.set(_cacheKey.acSecurity, acResult.acSecurity);
    $cache.set(_cacheKey.auth_key, acResult.auth_key.toString());
    $cache.set(_cacheKey.userid, acResult.userid.toString());
    $ui.toast("已保存登录信息");
};

let loadUserToken = () => {
    acUserData.acPassToken = $cache.get(_cacheKey.acPassToken) || "";
    acUserData.token = $cache.get(_cacheKey.token) || "";
    acUserData.acSecurity = $cache.get(_cacheKey.acSecurity) || "";
    acUserData.auth_key = $cache.get(_cacheKey.auth_key) || "";
    acUserData.userid = $cache.get(_cacheKey.userid) || "";
    acUserData.isLogin = (acUserData.acPassToken.length > 0 &&
        acUserData.token.length > 0 &&
        acUserData.acSecurity.length > 0 &&
        acUserData.auth_key.length > 0 &&
        acUserData.userid.length > 0) ? true : false;
    $console.info(acUserData);
};

let logout = () => {
    $cache.remove(_cacheKey.acPassToken);
    $cache.remove(_cacheKey.token);
    $cache.remove(_cacheKey.acSecurity);
    $cache.remove(_cacheKey.auth_key);
    $cache.remove(_cacheKey.userid);
    personalInfo = {};
    $ui.alert({
        title: "已退出",
        message: "退出成功",
    });
    loadUserToken();
};

let isLogin = () => {
    return acUserData.isLogin;
};

let getUserInfo = () => {
    $ui.loading(true);
    if (isLogin()) {
        const postCookies = getCookies();
        if (postCookies.length > 0) {
            var thisHeaders = acHeaders;
            thisHeaders.Cookie = postCookies;
            // $console.info(thisHeaders);
            $http.get({
                url: _url.getUserInfo,
                header: thisHeaders,
            }).then(function (resp) {
                var userResult = resp.data;
                $console.info(userResult);
                if (userResult.result == 0) {
                    personalInfo = userResult;
                    const userInfo = userResult.info;
                    saveCache("getUserInfo", $data({
                        string: JSON.stringify(resp.data, null, 2)
                    }));
                    var userInfoList = [
                        `昵称：${userInfo.userName}`,
                        `uid：${userInfo.userId}`,
                        `个性签名：${userInfo.signature}`,
                        `注册时间：${userInfo.registerTime}`,
                        `关注：${userInfo.following}`,
                        `粉丝：${userInfo.followed}`,
                        `话题：${userInfo.tagStowCount}`,
                        `投稿：${userInfo.contentCount}`,
                        `手机号码：${userInfo.mobile}`,
                        `邮箱：${userInfo.email}`,
                        `香蕉/金香蕉：${userInfo.banana}/${userInfo.goldBanana}`,
                        `等级：${userInfo.level}`,
                        `红名：${userInfo.nameRed?"是":"否"}`,
                        `头像：${userInfo.headUrl}`,
                        `博客：${userInfo.blog}`,
                        `改名卡：${userInfo.renameCard}`,
                        `QQ：${userInfo.qq?userInfo.qq:"[空白]"}`,
                    ];
                    $ui.loading(false);
                    $ui.push({
                        props: {
                            title: $l10n("个人信息"),
                            navButtons: [{
                                title: "打开网页版",
                                icon: "068", // Or you can use icon name
                                symbol: "checkmark.seal", // SF symbols are supported
                                handler: () => {
                                    $ui.preview({
                                        title: userInfo.userName,
                                        url: userInfo.shareUrl
                                    });
                                }
                            }]
                        },
                        views: [{
                            type: "list",
                            props: {
                                data: userInfoList
                            },
                            layout: $layout.fill,
                            events: {
                                didSelect: function (_sender, indexPath, _data) {
                                    const _g = _data.split("：");
                                    $ui.alert({
                                        title: _g[0],
                                        message: _g[1],
                                        actions: [{
                                            title: "分享",
                                            disabled: false, // Optional
                                            handler: function () {
                                                $share.sheet([_g[1]]);
                                            }
                                        }, {
                                            title: "关闭",
                                            disabled: false, // Optional
                                            handler: function () {}
                                        }]
                                    });
                                }
                            }
                        }]
                    });
                } else {
                    $ui.loading(false);
                    $ui.error(`result ${userResult.result}:${userResult.error_msg}`);
                }
            });
        } else {
            $ui.loading(false);
            $ui.error("未登录(Cookies)");
        }
    } else {
        $ui.loading(false);
        $ui.error("未登录");
    }
};
let getCookies = () => {
    return isLogin() ? `acPasstoken=${acUserData.acPassToken};auth_key=${acUserData.auth_key}` : "";
}

let getVideoInfo = () => {
    $ui.loading(true);
    $input.text({
        type: $kbType.number,
        autoFontSize: true,
        placeholder: "输入vid(不带ac)",
        /* text: "12702163", */
        handler: function (vid) {
            if (vid.length > 0) {
                getVideoPid(vid)
            } else {
                $ui.loading(false);
                $ui.error("空白vid");
            }
        }
    });
};
let getVideoPid = vid => {
    $ui.loading(true);
    $http.get({
        url: _url.getVideoInfo + vid,
        handler: function (resp) {
            var videoResult = resp.data;
            $console.info(videoResult);
            if (videoResult.result == 0) {
                const partList = videoResult.videoList;
                var pid = -1;
                if (partList.length == 1) {
                    pid = videoResult.videoList[0].id;
                } else {
                    const pidList = partList.map(function (x) {
                        return x
                    });
                    $ui.menu({
                        items: pidList,
                        handler: function (title, idx) {
                            pid = title;
                        }
                    });
                }
                downloadVideo(vid, pid);
            } else {
                $ui.loading(false);
                $ui.alert({
                    title: `错误代码${videoResult.result}`,
                    message: videoResult.error_msg,
                });
            }
        }
    });
}
let downloadVideo = (vid, pid) => {
    $console.info(`vid:${vid}\npid:${pid}`);
    $http.post({
        url: _url.downloadVideo + `?resourceId=${vid}&videoId=${pid}`,
        header: {
            /* Cookie: getCookies() */
        },
        handler: function (resp) {
            var videoResult = resp.data;
            $console.info(videoResult);
            if (videoResult.result == 0) {
                const playInfo = videoResult.playInfo;
                const videoData = playInfo.streams;
                const thisVideoFile = videoData[videoData.length - 1];
                const cdnUrl = thisVideoFile.cdnUrls;
                const cdnTitleList = cdnUrl.map(function (x) {
                    const thisUrl = x.url;
                    if (thisUrl.startsWith("http://tx-video.acfun.cn/")) {
                        return "腾讯源";
                    } else if (thisUrl.startsWith("http://ali-video.acfun.cn/")) {
                        return "阿里源";
                    } else {
                        return "未知源";
                    }
                });
                $ui.loading(false);
                $ui.push({
                    props: {
                        title: "下载地址"
                    },
                    views: [{
                        type: "list",
                        props: {
                            data: cdnTitleList
                        },
                        layout: $layout.fill,
                        events: {
                            didSelect: function (_sender, indexPath, _data) {
                                const idx = indexPath.row;
                                const videoUrl = cdnUrl[idx].url;
                                $ui.alert({
                                    title: cdnTitleList[idx],
                                    message: videoUrl,
                                    actions: [{
                                        title: "使用Alook浏览器打开",
                                        disabled: false,
                                        handler: function () {
                                            $ui.menu({
                                                items: ["网页浏览", "下载"],
                                                handler: function (title, idx) {
                                                    switch (idx) {
                                                        case 0:
                                                            appScheme.alookBrowserOpen(videoUrl);
                                                            break;
                                                        case 1:
                                                            appScheme.alookBrowserDownload(videoUrl);
                                                            break;
                                                    }
                                                }
                                            });
                                        }
                                    }, {
                                        title: "分享",
                                        disabled: false,
                                        handler: function () {
                                            $share.sheet([videoUrl]);
                                        }
                                    }, {
                                        title: "关闭",
                                        disabled: false,
                                        handler: function () {}
                                    }, ]
                                });
                            }
                        }
                    }]
                });
            } else {
                $ui.loading(false);
                $ui.alert({
                    title: `错误代码${videoResult.result}`,
                    message: videoResult.error_msg,
                });
            }
        }
    });
};
let signIn = () => {
    isLogin() ?
        $http.post({
            url: _url.signIn,
            header: {
                Cookie: getCookies(),
                acPlatform: "IPHONE"
            },
            handler: function (resp) {
                var signinResult = resp.data;
                $console.info(signinResult);
                signinResult.result == 0 ?
                    $ui.alert({
                        title: "签到成功",
                        message: signinResult.msg,
                        actions: [{
                            title: "查看今日运势",
                            disabled: false, // Optional
                            handler: function () {
                                const todayAlmanac = signinResult.almanac;
                                $ui.alert({
                                    title: todayAlmanac.fortune,
                                    message: `宜(${todayAlmanac.avoids.toString()})\n` +
                                        `忌(${todayAlmanac.suits.toString()})`,
                                });
                            }
                        }, {
                            title: "关闭",
                            disabled: false, // Optional
                            handler: function () {}
                        }]
                    }) :
                    $ui.alert({
                        title: `错误代码${signinResult.result}`,
                        message: signinResult.msg ? signinResult.msg : signinResult.error_msg,
                    });
            }
        }) :
        $ui.error("未登录");
};
let getUploaderVideo = (uid, page = 1, count = 20) => {
    $http.post({
        url: _url.getUploaderVideo,
        header: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: {
            authorId: uid,
            count: count,
            pcursor: page - 1,
            resourceType: 2,
            sortType: 3,
            status: 1
        }
    }).then(function (resp) {
        var acData = resp.data;
        if (acData.result == 0) {
            const feedList = acData.feed;
            if (feedList.length > 0) {
                saveCache("getUploaderVideo", resp.rawData);
                $cache.set(_cacheKey.uploaderVideo_lastUid, uid);
                $cache.set(_cacheKey.uploaderVideo_lastPage + uid, page);
                showUploaderVideoList(acData);
            } else {
                $ui.error(`第${page}页空白`);
            }
        } else {
            $ui.alert({
                title: `错误代码 ${acData.result}`,
                message: acData.error_msg,
            });
        }
    });
};
let showUploaderVideoList = acData => {
    const videoList = acData.feed;
    const listClickedVid = $cache.get(_cacheKey.lastClickedVid);
    $ui.push({
        props: {
            title: videoList[0].user.name
        },
        views: [{
            type: "list",
            props: {
                data: [{
                        title: "结果",
                        rows: [
                            `全部${acData.totalNum}共个视频`,
                            `当前第${acData.pcursor}页，有${videoList.length}个视频`
                        ]
                    },
                    {
                        title: "视频列表",
                        rows: videoList.map(v => {
                            if (listClickedVid) {
                                if (listClickedVid == v.dougaId) {
                                    return `[上次]${v.title}`
                                }
                            }
                            return v.title
                        })
                    }
                ],
                menu: {
                    title: "菜单",
                    items: [{
                        title: "打开客户端",
                        symbol: "arrowshape.turn.up.right",
                        handler: (sender, indexPath) => {
                            const vid = videoList[indexPath.row].dougaId;
                            if (indexPath.section == 1) {
                                $cache.set(_cacheKey.lastClickedVid, vid);
                                appScheme.acfunVideo(vid);
                            } else {
                                $ui.error("这里长按无效，请在视频列表长按");
                            }
                        }
                    }, {
                        title: "分享网址",
                        symbol: "square.and.arrow.up",
                        handler: (sender, indexPath) => {
                            const vid = videoList[indexPath.row].dougaId;
                            if (indexPath.section == 1) {
                                $cache.set(_cacheKey.lastClickedVid, vid);
                                $share.sheet([`https://www.acfun.cn/v/ac${vid}`]);
                            } else {
                                $ui.error("这里长按无效，请在视频列表长按");
                            }
                        }
                    }, {
                        title: "分享打开客户端的链接",
                        symbol: "square.and.arrow.up",
                        handler: (sender, indexPath) => {
                            const vid = videoList[indexPath.row].dougaId;
                            if (indexPath.section == 1) {
                                $cache.set(_cacheKey.lastClickedVid, vid);
                                $share.sheet([`acfun://detail/video/${vid}`]);
                            } else {
                                $ui.error("这里长按无效，请在视频列表长按");
                            }
                        }
                    }, {
                        title: "分享网址(二维码)",
                        symbol: "qrcode",
                        handler: (sender, indexPath) => {
                            const vid = videoList[indexPath.row].dougaId;
                            if (indexPath.section == 1) {
                                $cache.set(_cacheKey.lastClickedVid, vid);
                                $quicklook.open({
                                    image: `https://www.acfun.cn/v/ac${vid}`.getQrcode()
                                });
                            } else {
                                $ui.error("这里长按无效，请在视频列表长按");
                            }
                        }
                    }, {
                        title: "分享打开客户端的链接(二维码)",
                        symbol: "qrcode",
                        handler: (sender, indexPath) => {
                            const vid = videoList[indexPath.row].dougaId;
                            if (indexPath.section == 1) {
                                $cache.set(_cacheKey.lastClickedVid, vid);
                                $quicklook.open({
                                    image: `acfun://detail/video/${vid}`.getQrcode()
                                });
                            } else {
                                $ui.error("这里长按无效，请在视频列表长按");
                            }
                        }
                    }, {
                        title: "视频解析",
                        symbol: "square.and.arrow.down",
                        handler: (sender, indexPath) => {
                            if (indexPath.section == 1) {
                                const vid = videoList[indexPath.row].dougaId;
                                $cache.set(_cacheKey.lastClickedVid, vid);
                                getVideoPid(videoList[indexPath.row].dougaId);
                            } else {
                                $ui.error("这里长按无效，请在视频列表长按");
                            }
                        }
                    }]
                }
            },
            layout: $layout.fill,
            events: {
                didSelect: function (_sender, indexPath, _data) {
                    switch (indexPath.section) {
                        case 1:
                            const vid = videoList[indexPath.row].dougaId;
                            $cache.set(_cacheKey.lastClickedVid, vid);
                            appScheme.acfunVideo(vid);
                            break;
                    }
                }
            }
        }]
    });
}
let isVideoUrl = url => {
    return url.startsWithList(acVideoSiteList);
};
let isUploaderUrl = url => {
    return url.startsWithList(acUploaderSiteList);
};
let isAcfunUrl = url => {
    return isVideoUrl(url) || isUploaderUrl(url);
};
let getVidFromUrl = url => {
    var vid = undefined;
    if (isVideoUrl(url)) {
        acVideoSiteList.map(s => {
            if (s == "https://m.acfun.cn/v/?") {
                var newUrl = url.remove(s);
                const paramsList = newUrl.split("&");
                paramsList.map(p => {
                    if (p.startsWith("ac=")) {
                        vid = p.split("=")[1];
                    }
                });
            } else if (url.startsWith(s)) {
                vid = url.remove(s);
            }
        });
    }
    $console.info(`getVidFromUrl:${vid}`);
    return vid;
};
let getuidFromUrl = url => {
    var uid = undefined;
    if (isUploaderUrl(url)) {
        acUploaderSiteList.map(s => {
            if (url.startsWith(s)) {
                // uid = strUril.remove(url, s).remove(url, ".aspx");
                uid = url.remove(s).remove(".aspx");
            }
        });
    }
    $console.info(`getuidFromUrl:${uid}`);
    return uid;
};
// init
let init = () => {
    loadUserToken();
};
module.exports = {
    login,
    logout,
    isLogin,
    init,
    getUserInfo,
    getVideoInfo,
    signIn,
    getUploaderVideo,
    _cacheKey,
    isVideoUrl,
    getVidFromUrl,
    getVideoPid,
    isUploaderUrl,
    getuidFromUrl,
    isAcfunUrl
};