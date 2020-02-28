let getNowUnixTime = () => {
    return new Date().getTime();
};

let copyToClipboard = text => {
    $clipboard.copy({
        "text": text,
        "ttl": 30,
        "locally": true
    });
};
module.exports = {
    getNowUnixTime,
    copyToClipboard,
}