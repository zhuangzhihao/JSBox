const httpUA = "Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1";
const cacheId = "last_id";
var _kuaidiId = "";
var _comId = "";
var _comName = "";

function getLastId() {
    const _id = $cache.get(cacheId);
    if (_id == undefined) {
        return "";
    }
    return _id;
}

function getNavButton() {
    return [{
        title: "打开网页版",
        icon: "068", // Or you can use icon name
        symbol: "checkmark.seal", // SF symbols are supported
        handler: () => {
            $console.info("https://m.kuaidi100.com/result.jsp?nu=" + _kuaidiId);
            $ui.preview({
                title: _comName,
                url: "https://m.kuaidi100.com/result.jsp?nu=" + _kuaidiId
            });
        }
    }];
}


function getComCode(kuaidiId) {
    //根据快递单号识别快递公司
    $cache.set(cacheId, kuaidiId);
    const url = "https://m.kuaidi100.com/apicenter/kdquerytools.do?method=autoComNum&text=" + kuaidiId;
    $http.post({
        url: url,
        header: {
            "Referer": url,
            "User-Agent": httpUA
        },
        handler: function (resp) {
            _comId = resp.data["auto"][0]["comCode"];
            _comName = resp.data["auto"][0]["name"];
            getResult(_comId, _kuaidiId);
        }
    });
}

function getResult(comId, kuaidiId) {
    //根据快递单号与快递公司代码查询快递
    const url = "https://www.kuaidi100.com/query?type=" + comId + "&temp=" + Math.random() + "&postid=" + kuaidiId;
    $http.get({
        url: url,
        showsProgress: true,
        header: {
            "Referer": url,
            "User-Agent": httpUA
        },
        body: {

        },
        handler: function (resp) {
            var data = resp.data;
            $console.info(data);
            showList(data.data);
        }
    });
}

function showList(itemList) {
    var itemTitleList = [];
    for (a in itemList) {
        itemTitleList.push(itemList[a].context);
    }
    $ui.push({
        props: {
            title: _comName,
            navButtons: getNavButton()
        },
        views: [{
            type: "list",
            props: {
                data: itemTitleList
            },
            layout: $layout.fill,
            events: {
                didSelect: function (_sender, indexPath, _data) {
                    const _idx = indexPath.row;
                    $ui.alert({
                        title: _comName,
                        message: JSON.stringify(itemList[_idx])
                    });
                }
            }
        }]
    });
}

function init() {
    $input.text({
        autoFontSize: true,
        text: getLastId(),
        placeholder: "输入快递单号",
        handler: function (text) {
            if (text.length > 0) {
                _kuaidiId = text;
                getComCode(_kuaidiId);
            } else {
                $ui.error("请输入快递单号");
            }
        }
    });
}
module.exports = {
    init: init
};