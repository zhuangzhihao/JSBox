let startsWithList = (sourceString, keyList) => {
    var hasTrue = false;
    keyList.map(key => {
        if (sourceString.startsWith(key)) {
            $console.info("startsWith:true");
            hasTrue = true;
        }
    })
    return hasTrue;
};
let checkIfUrl = str => {
    const linkList = $detector.link(str);
    return linkList.length == 1 && linkList[0] == str;
}
module.exports = {
    startsWithList,
    checkIfUrl
};