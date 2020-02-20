function getNowUnixTime() {
    return new Date().getTime();
}

function copyToClipboard(text) {
    $clipboard.copy({
        "text": text,
        "ttl": 30,
        "locally": true
    });
}
module.exports = {
    getNowUnixTime: getNowUnixTime,
    copyToClipboard: copyToClipboard,
}