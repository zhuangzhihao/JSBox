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
    if (sourceGithubUrl.indexOf("https://raw.githubusercontent.com/") > -1) {
        return sourceGithubUrl;
    } else {
        if (sourceGithubUrl.replace("https://github.com/").split("/")[2] == "blob") {
            return sourceGithubUrl.replace("https://github.com/", "https://raw.githubusercontent.com/").replace("/blob/", "/");
        } else {
            return sourceGithubUrl.replace("https://github.com/", "https://raw.githubusercontent.com/").replace("/raw/", "/");
        }

    }
};

let getGithubRaw = sourceGithubUrl => {
    var newUrl = getGithubRealRaw(sourceGithubUrl);
    const list = newUrl.replace("https://raw.githubusercontent.com/", "").split("/");
    newUrl = "https://cdn.jsdelivr.net/gh";
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
    weserv: getWeserv,
    githubRaw: getGithubRaw
};