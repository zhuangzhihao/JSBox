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
        (newUrl.split("/")[2] == "blob" ?
            newUrl.replace("/blob/", "/") :
            newUrl.replace("/raw/", "/"));

};

let getGithubRaw = sourceGithubUrl => {
    const list = getGithubRealRaw(sourceGithubUrl).replace("https://raw.githubusercontent.com/", "").split("/");
    const newUrl = "https://cdn.jsdelivr.net/gh";
    for (x in list) {
        switch (x.toString()) {
            case "2":
                newUrl = `${newUrl}@${list[x]}`;
                break;
            default:
                newUrl = `${newUrl}/${list[x]}`;
        }
    }
    return newUrl;
};

module.exports = {
    getWeserv,
    getGithubRaw
};