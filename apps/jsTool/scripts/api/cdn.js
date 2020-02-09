const cdnUrl = {
    weserv: "https://images.weserv.nl/?url=",
    github: {
        releases: {
            i_codeku_me: "http://i.codeku.me/",
            v2_github_codeku_me: "http://v2.github.codeku.me/"
        },
        zip: {
            ws_codeku_me: "http://ws.codeku.me/"
        }
    }
};

function getWeserv(imageUrl) {
    return cdnUrl.weserv + imageUrl;
}

function getGithubRealRaw(sourceGithubUrl) {
    if (sourceGithubUrl.indexOf("https://raw.githubusercontent.com/") > -1) {
        return sourceGithubUrl;
    } else {
        if (sourceGithubUrl.replace("https://github.com/").split("/")[2] == "blob") {
            return sourceGithubUrl.replace("https://github.com/", "https://raw.githubusercontent.com/").replace("/blob/", "/");
        } else {
            return sourceGithubUrl.replace("https://github.com/", "https://raw.githubusercontent.com/").replace("/raw/", "/");
        }

    }
}

function getGithubRaw(sourceGithubUrl) {
    //https://github.com/zhuangzhihao/JSBox/raw/master/apps/jsTool/scripts/api/cdn.js
    //https://raw.githubusercontent.com/zhuangzhihao/JSBox/master/README.md
    //https://cdn.jsdelivr.net/gh/zhuangzhihao/jsbox@master/README.md
    var newUrl = getGithubRealRaw(sourceGithubUrl);
    const list = newUrl.replace("https://raw.githubusercontent.com/", "").split("/");
    newUrl = "https://cdn.jsdelivr.net/gh";
    for (x in list) {
        switch (x.toString()) {
            case "2":
                newUrl = newUrl + "@" + list[x];
                break;
            default:
                newUrl = newUrl + "/" + list[x]
        }
    }
    return newUrl;
}

module.exports = {
    weserv: getWeserv,
    githubRaw: getGithubRaw
};