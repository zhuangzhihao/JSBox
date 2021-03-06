function toastIfNotEmpty(toastMessage) {
    if (toastMessage != "") {
        $ui.toast(toastMessage);
    }
}

function getConfig() {
    const file = $file.read("config.json");
    return JSON.parse(file);
}

function getVersion() {
    return getConfig().info.version;
}

function json2string(_sourceJson) {
    return JSON.stringify(_sourceJson);
}

function getRealUrl(_sourceUrl) {
    return _sourceUrl.split(" ​ ")[0];
}

function getUpdateTime(modifyTime) {
    return Math.round((new Date() - modifyTime) / 1000);
}

function previewWeb(title, url) {
    $ui.preview({
        title: title,
        url: url
    });
}

function previewHtml(title, html) {
    $ui.preview({
        title: title,
        html: html
    });
}

function getListFromL10n(sourceList) {
    var l10nList = [];
    for (i in sourceList) {
        l10nList.push($l10n(sourceList[i]));
    }
    return l10nList;
}

function httpGet(url, handler) {
    $http.get({
        url: url,
        handler: handler
    });
}

module.exports = {
    getConfig: getConfig,
    getVersion: getVersion,
    toastIfNotEmpty: toastIfNotEmpty,
    json2string: json2string,
    getRealUrl: getRealUrl,
    getUpdateTime: getUpdateTime,
    previewWeb: previewWeb,
    httpGet: httpGet,
    previewHtml: previewHtml,
    getListFromL10n:getListFromL10n
};