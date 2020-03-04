$include("./codePrototype.js");
let cheerio = require("cheerio");
let apiUri = {
    becmd: {
        getList: "https://www.becmd.com/",
        showSms: "https://www.becmd.com/receive-freesms-%s.html"
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
    const url = apiUri.becmd.showSms.replace("%s", number.remove("+"));
    $console.info(url);
    $http.get({
        url: url,
        headers: headers,
        handler: function (resp) {
            const $ = cheerio.load(resp.data);
            var smsList = [];
            $("body #no-more-tables tbody tr").map(function (index, element) {
                const smsIndex = $(element).find('td[data-title="序号:"]').text();
                if (smsIndex > 0) {
                    const smsNumber = $(element).find('td[data-title="电话号码:"]').text().remove(/\n/g).remove(/ /g);
                    var smsTime = $(element).find('td[data-title="发送时间:"] script').html();
                    var smsContent = $(element).find('td[data-title="短信内容:"]').text();
                    const timeLeft = smsTime.indexOf(`gettime = diff_time("`);
                    smsTime = smsTime.substring(timeLeft + 21, smsTime.indexOf(`");`, timeLeft + 21));
                    if (smsContent.indexOf("******(该号码短信被屏蔽)") < 0) {
                        smsContent = smsContent.substring(smsContent.indexOf("【"));
                        smsContent = smsContent.remove(/\n/g).remove(/ /g);
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
};

module.exports = {
    getBecmdList,
};