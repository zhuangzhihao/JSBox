function toastIfNotEmpty(toastMessage) {
    if (toastMessage !== "") {
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

module.exports = {
    getConfig: getConfig,
    getVersion: getVersion,
    toastIfNotEmpty: toastIfNotEmpty,
    json2string: json2string,
    getRealUrl: getRealUrl,
    getUpdateTime: getUpdateTime,
    previewWeb: previewWeb
};