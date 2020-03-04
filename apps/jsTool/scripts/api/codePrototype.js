String.prototype.remove = function (keyword) {
    return this.replace(keyword, "");
};
String.prototype.startsWithList = function (keyList) {
    $console.info(`startsWith.sourceString:${this}`);
    var hasTrue = false;
    keyList.map(key => {
        if (this.startsWith(key)) {
            hasTrue = true;
        }
        $console.info(`hasTrue:${hasTrue}\nkey:${key}`);
    });
    $console.info(`hasTrue.return:${hasTrue}`);
    return hasTrue;
};
String.prototype.checkIfUrl = function () {
    if (this.length > 0) {
        const linkList = $detector.link(this);
        return linkList.length == 1 && linkList[0] == this;
    } else {
        return false;
    }
};