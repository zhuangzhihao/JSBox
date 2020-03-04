let strUtil = require("./string.js");
let cdnUrl = {
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

let getWeserv = imageUrl => {
    return cdnUrl.weserv + imageUrl;
};

let getGithubRealRaw = sourceGithubUrl => {
    const newUrl = sourceGithubUrl.replace("https://github.com/", "https://raw.githubusercontent.com/");
    return sourceGithubUrl.indexOf("https://raw.githubusercontent.com/") > -1 ?
        sourceGithubUrl :
        newUrl.split("/")[2] == "blob" ?
        strUtil.remove(newUrl, "/blob/") :
        strUtil.remove(newUrl, "/raw/");

};

let getGithubRaw = sourceGithubUrl => {
    const list = strUtil.remove(getGithubRealRaw(sourceGithubUrl), "https://raw.githubusercontent.com/").split("/");
    var newUrl = "https://cdn.jsdelivr.net/gh";
    list.forEach(function (item, index, array) {
        newUrl = (index == 2) ? `${newUrl}@${item}` : `${newUrl}/${item}`;
    })

    return newUrl;
};

module.exports = {
    getWeserv,
    getGithubRaw
};