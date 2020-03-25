// 感谢：https://www.zhihu.com/question/381784377/answer/1099438784
// 感谢：https://www.v2ex.com/t/655569
let table = "fZodR9XQDSUm21yCkr6zBqiveYah8bt4xsWpHnJE7jL5VG3guMTKNPAwcF",
    tr = new Object();
for (var i = 0; i < 58; i++) {
    tr[table[i]] = i;
}
let s = [11, 10, 3, 8, 4, 6],
    xor = 177451812,
    add = 8728348608;

// 函数
let getAv = bv => {
    var r = 0;
    for (var i = 0; i < 6; i++) {
        r += tr[bv[s[i]]] * 58 ** i;
    }
    return (r - add) ^ xor;
};
let getBv = av => {
    av = (av ^ xor) + add;
    var r = "BV1  4 1 7  ".split("");
    for (var i = 0; i < 6; i++) {
        r[s[i]] = table[Math.floor(av / 58 ** i) % 58];
    }
    return r.join("");
};
let getOnline = (type, id) => {
    // bvid: resp.data.data.bvid,
    // aid: resp.data.data.aid
    return $http.get({
        url: `http://api.bilibili.com/x/web-interface/archive/stat?${type}id=${id}`
    });
};
let getAvOnline = bv => {
    return getOnline("a", bv);
};
let getBvOnline = av => {
    return getOnline("bv", av);
};
module.exports = {
    getAv,
    getBv,
    getOnline,
    getAvOnline,
    getBvOnline
};