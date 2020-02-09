const cdnUrl = {
    weserv: "https://images.weserv.nl/?url=",
    github: {
        releases: {
            i_codeku_me: "http://i.codeku.me/",
            v2_github_codeku_me: "http://v2.github.codeku.me/"
        },
        zip: {
            ws_codeku_me: "http://we.codeku.me"
        }
    }
};

function getWeserv(imageUrl) {
    return cdnUrl.weserv + imageUrl;
}

function getGithubReleases(site, sourceGithubUrl) {
    return sourceGithubUrl.replace(
        "https://github.com/",
        cdnUrl.github.releases[site]
    );
}

function getGithubZip(site, sourceGithubUrl) {
    //http://ws.codeku.me/zhuangzhihao/JSBox/zip/master
    //https://github.com/zhuangzhihao/JSBox/archive/master.zip
    return sourceGithubUrl.replace(
        "https://github.com/",
        cdnUrl.github.releases[site]
    );
}
module.exports = {
    weserv: getWeserv
};
