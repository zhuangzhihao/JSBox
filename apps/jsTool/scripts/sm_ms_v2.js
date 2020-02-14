const _apiBase = "https://sm.ms/api/v2";
const _api = {
    getToken: _apiBase + "/token",
    getProfile: _apiBase + "/profile",
    upload: _apiBase + "/upload"
};
const _user = {
    token: "",
    userInfo: {}
};
const _cacheDir = ".cache/sm_ms_v2/";

function getToken(user, pw) {
    $http.post({
        url: _api.getToken + "?username=" + user + "&password=" + pw,
        body: {
            "username": user,
            "password": pw
        },
        handler: function (resp) {
            var data = resp.data;
            $console.info(data);
            if (data.success) {
                $ui.toast(data.message);
                $input.text({
                    autoFontSize: true,
                    text: data.data.token,
                    placeholder: "输入Token",
                    handler: function (token) {
                        $clipboard.text = token;
                        $ui.toast("Copied!");
                    }
                });
                var success = $file.write({
                    data: resp.rawData,
                    path: _cacheDir + "getToken_" + new Date().getTime() + ".json"
                });
                $console.info("cache:" + success);
            } else {
                $ui.alert({
                    title: data.code,
                    message: data.message,
                });
            }
        }
    });
}

function getProfile(token) {
    $http.post({
        url: _api.getProfile,
        header: getHeader(token),
        handler: function (resp) {
            var data = resp.data;
            if (data.success) {
                $ui.alert({
                    title: "Hello, " + data.data.username,
                    message: data.data,
                });
                _user.userInfo = data.data;
                var success = $file.write({
                    data: resp.rawData,
                    path: _cacheDir + "getProfile_" + new Date().getTime() + ".json"
                });
                $console.info("cache:" + success);
            } else {
                $ui.alert({
                    title: data.code,
                    message: data.message,
                });
            }
        }
    });
}

function uploadImage(token) {
    $photo.pick({
        format: "data",
        handler: function (resp) {
            const imageData = resp.data;
            if (resp.data) {
                $ui.loading(true);
                $http.upload({
                    url: _api.upload,
                    /* header: getHeader(token), */
                    files: [{
                        "data": resp.data,
                        "name": "smfile"
                    }],
                    progress: function (percentage) {
                        $console.info((percentage * 100) + "%");
                    },
                    handler: function (resp) {
                        $ui.loading(false);
                        $console.info(resp.data);
                        var success = $file.write({
                            data: resp.rawData,
                            path: _cacheDir + "updateImage_" + new Date().getTime() + ".json"
                        });
                        $console.info("cache:" + success);
                    }
                });
            } else {
                $ui.error("error");
            }
        }
    });

}

function getHeader(token) {
    if (token !== undefined) {
        _user.token = token;
    }
    $console.info(_user);
    return {
        "Content-Type": "multipart/form-data",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.87 Safari/537.36 Edg/80.0.361.50",
        "Authorization": _user.token
    };
}


function initView() {
    $file.mkdir(_cacheDir);
    $ui.menu({
        items: ["获取token", "获取账户信息", "匿名上传图片"],
        handler: function (title, idx) {
            switch (idx) {
                case 0:
                    $input.text({
                        autoFontSize: true,
                        placeholder: "输入账号/邮箱",
                        handler: function (username) {
                            if (username.length > 0) {
                                $input.text({
                                    autoFontSize: true,
                                    placeholder: "输入密码",
                                    secure: true,
                                    handler: function (password) {
                                        if (password.length > 0) {
                                            getToken(username, password);
                                        } else {
                                            $ui.error("请输入密码");
                                        }
                                    }
                                });
                            } else {
                                $ui.error("请输入账号/邮箱");
                            }
                        }
                    });
                    break;
                case 1:
                    $input.text({
                        autoFontSize: true,
                        placeholder: "输入Token",
                        handler: function (token) {
                            if (token.length > 0) {
                                getProfile(token);
                            } else {
                                $ui.error("请输入Token");
                            }
                        }
                    });
                    break;
                case 2:
                    uploadImage();
                    break;
            }
        }
    });
}
module.exports = {
    init: initView
}