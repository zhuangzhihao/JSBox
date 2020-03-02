let cheerio = require("cheerio");
let app = require("./app.js");
let apiUri = {
    becmd: {
        getList: "https://www.becmd.com/",
        showSms: "https://www.becmd.com/receive-freesms-%s.html"
    },
    cnwml: {
        getList: "https://www.cnwml.com/",
        showSms: "https://www.cnwml.com/free-sms-online/%s.html"
    }
};
let headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (Ktext, like Gecko) Chrome/80.0.3987.87 Safari/537.36 Edg/80.0.361.50"
};
let getBecmdList = () => {
    $http.get({
        url: apiUri.becmd.getList,
        handler: function (resp) {
            const $ = cheerio.load(resp.data);
            var numberList = [];
            $(".row .col-md-5 a h2").each(function (i, elem) {
                numberList.push($(elem).text());
            });
            $console.info(numberList);
            $ui.push({
                props: {
                    title: "手机号码"
                },
                views: [{
                    type: "list",
                    props: {
                        data: numberList,
                    },
                    layout: $layout.fill,
                    events: {
                        didSelect: function (sender, indexPath, data) {
                            indexPath.section;
                            indexPath.row;
                            getBecmdSmsList(data);
                        }
                    }
                }]
            });
        }
    });
};
let getBecmdSmsList = number => {
    const url = apiUri.becmd.showSms.replace("%s", number.replace("+", ""));
    $console.info(url);
    $http.get({
        url: apiUri.becmd.showSms.replace("%s", number.replace("+", "")),
        headers: headers,
        handler: function (resp) {
            const $ = cheerio.load(resp.data);
            var smsList = [];
            $("body #no-more-tables tbody tr").map(function (index, element) {
                const smsIndex = $(element).find('td[data-title="序号:"]').text();
                if (smsIndex > 0) {
                    const smsNumber = $(element).find('td[data-title="电话号码:"]').text().replace(/\n/g, "").replace(/ /g, "");
                    var smsTime = $(element).find('td[data-title="发送时间:"] script').html();
                    var smsContent = $(element).find('td[data-title="短信内容:"]').text();
                    const timeLeft = smsTime.indexOf(`gettime = diff_time("`);
                    smsTime = smsTime.substring(timeLeft + 21, smsTime.indexOf(`");`, timeLeft + 21));
                    if (smsContent.indexOf("******(该号码短信被屏蔽)") < 0) {
                        smsContent = smsContent.substring(smsContent.indexOf("【"));
                        smsContent = smsContent.replace(/\n/g, "").replace(/ /g, "");
                        smsList.push({
                            index: smsIndex,
                            number: smsNumber,
                            time: smsTime,
                            content: smsContent
                        });
                        $console.info(`smsIndex:${smsIndex}\nsmsTime:${smsTime}\nsmsContent:${smsContent}\n`);
                    }
                }
            });
            $console.info(smsList);
            $ui.push({
                props: {
                    title: `已收到${smsList.length}条短信`
                },
                views: [{
                    type: "list",
                    props: {
                        data: smsList.map(sms => {
                            return {
                                title: sms.number,
                                rows: [
                                    sms.content, sms.time
                                ]
                            };
                        }),
                    },
                    layout: $layout.fill,
                    events: {
                        didSelect: function (sender, indexPath, data) {
                            const thisSms = smsList[indexPath.section];
                            $ui.alert({
                                title: thisSms.number,
                                message: data,
                            });
                        }
                    }
                }]
            });
        }
    });
}
let getCnwmlList = () => {
    $ui.loading(true);
    $http.get({
        url: apiUri.cnwml.getList,
        handler: function (resp) {
            const $ = cheerio.load(resp.data);
            var numberList = [];
            $(".number-boxes > .number-boxes-item .number-boxes-item-number").each(function (i, elem) {
                numberList.push($(elem).text());
            });
            $console.info(numberList);
            $ui.loading(false);
            $ui.push({
                props: {
                    title: "手机号码"
                },
                views: [{
                    type: "list",
                    props: {
                        data: numberList,
                    },
                    layout: $layout.fill,
                    events: {
                        didSelect: function (sender, indexPath, data) {
                            indexPath.section;
                            indexPath.row;
                            getCnwmlSmsList(data);
                        }
                    }
                }]
            });
        }
    });
};
let getCnwmlSmsList = number => {
    $ui.loading(true);
    const url = apiUri.cnwml.showSms.replace("%s", number.replace("+", ""));
    $console.info(url);
    $http.get({
        url: url,
        headers: headers,
        handler: function (resp) {
            const $ = cheerio.load(resp.data);
            var smsList = [];
            const webTitle = $("h1.page-title").text().replace(/ /g, "");
            $("body div.list-item").each(function (index, element) {
                if ($(element).has('div.list-item-header.o')) {
                    $console.warn($(element).html());
                    var smsContent = $(element).find('.list-item-content.break-word.o').text();
                    smsContent = smsContent.substring(smsContent.indexOf("【"));
                    smsContent = smsContent.replace(/\n/g, "").replace(/ /g, "");
                    if (smsContent.indexOf("******(该号码短信被屏蔽)") < 0) {
                        const smsNumber = $(element).find('div.list-item-header.o h3.list-item-title').text().replace(/ /g, "");
                        var smsTime = $(element).find('.list-item-header.o .list-item-meta.o script').html();
                        $console.info(`smsNumber:${smsNumber}\nsmsTime:${smsTime}\nsmsContent:${smsContent}\n`);
                        const timeLeft = smsTime.indexOf(`gettime = diff_time("`);
                        smsTime = smsTime.substring(timeLeft + 21, smsTime.indexOf(`");`, timeLeft + 21));
                        smsList.push({
                            number: smsNumber,
                            time: smsTime,
                            content: smsContent
                        });
                    }
                }
            });
            $console.info(smsList);
            $ui.loading(false);
            $ui.push({
                props: {
                    title: webTitle
                },
                views: [{
                    type: "list",
                    props: {
                        data: smsList.map(sms => {
                            return {
                                title: sms.number,
                                rows: [
                                    sms.content, sms.time
                                ]
                            };
                        }),
                    },
                    layout: $layout.fill,
                    events: {
                        didSelect: function (sender, indexPath, data) {
                            const thisSms = smsList[indexPath.section];
                            $ui.alert({
                                title: thisSms.number,
                                message: data,
                            });
                        }
                    }
                }]
            });
        }
    });
}

module.exports = {
    getBecmdList,
    getCnwmlList
};