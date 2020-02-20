function getNowUnixTime() {
    return new Date().getTime();
}

module.exports = {
    getNowUnixTime: getNowUnixTime
}