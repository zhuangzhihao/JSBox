var isLoading = true;
const _version = 2;
const _menuList = [
    "简单数据",
    "详细数据",
    "时间线",
    "谣言",
    "地区排序",
    "国外数据",
    "疾病知识",
    "推荐文章"
];
var _headerDataJson = {};
var _mainTitleDataJson = [];
var _mainDataJson = [];
var _timeLineData = [];
var _timeLineTitleData = [];
var _rumorData = [];
var _rumorTitleData = [];
var _areaStatData = [];
var _areaStatProData = [];
var _foreignTitleDataJson = [];
var _foreignDataJson = [];
var _wikiData = [];
var _recommendData = [];
var _imgList = {
    dailyPic: "",
    imgUrl: ""
};

function checkUpdate() {
    const serverJsonUrl = "https://cdn.jsdelivr.net/gh/zhuangzhihao/jsbox@master/app.json";
    const appId = "io.zhihao.jsbox.dxy";
    $ui.alert({
        title: "你要检测更新吗?",
        message: "你点了检测更新的按钮",
        actions: [{
            title: "好的",
            disabled: false, // Optional
            handler: function () {
                $http.get({
                    url: serverJsonUrl,
                    handler: function (_resp) {
                        const updateData = _resp.data;
                        console.log("更新：获取服务器数据成功");
                        const app = updateData[appId];
                        console.log(app);
                        if (app.version > _version) {
                            console.log("更新：发现更新");
                            const updateUrl = "jsbox://import?url=" + $text.URLEncode(app.update_url) +
                                "&name=" + $text.URLEncode(app.name) + "&icon=" + $text.URLEncode(app.update_icon);
                            $ui.alert({
                                title: "发现新版本",
                                message: "版本号：" + app.name + "\n你要更新吗?",
                                actions: [{
                                    title: "好的",
                                    disabled: false, // Optional
                                    handler: function () {
                                        $app.openURL(updateUrl);
                                    }
                                }, {
                                    title: "不了不了",
                                    disabled: false
                                }]
                            });
                        } else {
                            console.log("更新：已经是最新版");
                            $ui.toast("已经是最新版");
                        }
                    }
                });
            }
        }, {
            title: "不了不了",
            disabled: false
        }]
    });
}

function json2string(_sourceJson) {
    return JSON.stringify(_sourceJson);
}

function toastIfNotEmpty(toastMessage) {
    if (toastMessage != "") {
        $ui.toast(toastMessage);
    }
}

function getRealUrl(_sourceUrl) {
    return _sourceUrl.split(" ​ ")[0];
}

function getUpdateTime(modifyTime) {
    return Math.round((new Date() - modifyTime) / 1000);
}

function initMainMenu() {
    isLoading = true;
    $ui.loading("正在加载在线数据");
    getData();
    $ui.render({
        props: {
            id: "listView_index",
            title: "全国新型肺炎疫情实时动态",
            navButtons: [{
                title: "检测更新",
                icon: "162", // Or you can use icon name
                symbol: "checkmark.seal", // SF symbols are supported
                handler: function () {
                    checkUpdate();
                }
            }]
        },
        views: [{
            type: "list",
            props: {
                data: _menuList
            },
            layout: $layout.fill,
            events: {
                didSelect: function (_sender, indexPath, _data) {
                    if (isLoading) {
                        $ui.error("请等待加载数据");
                    } else {
                        const _idx = indexPath.row;
                        switch (_idx) {
                            case 0:
                                showHeaderData();
                                break;
                            case 1:
                                showMainData();
                                break;
                            case 2:
                                showTimeLineData();
                                break;
                            case 3:
                                showRumorData();
                                break;
                            case 4:
                                showAreaStatData();
                                break;
                            case 5:
                                showForeignData();
                                break;
                            case 6:
                                showWikiData();
                                break;
                            case 7:
                                showRecommendedData();
                                break;
                            default:
                                $ui.error("错误选项");
                        }
                    }
                }
            }
        }]
    });
}

function getData() {
    const urlAllType = "https://3g.dxy.cn/newh5/view/pneumonia";
    $http.get({
        url: urlAllType,
        handler: function (_resp) {
            const mData = _resp.data;
            console.log("获取数据成功");
            processAllData(mData);
        }
    });
}

function processAllData(_sourceData) {
    const doc = $xml.parse({
        string: _sourceData,
        mode: "html"
    });
    const _element = doc.rootElement;
    getMainData(_element);
    getHeaderData(_element);
    getTimeLine(_element);
    getRumor(_element);
    getAreaStat(_element);
    getForeignData(_element);
    getWikiData(_element);
    getRecommendedData(_element);
    $ui.loading(false);
    isLoading = false;
}

// 简单数据
function getHeaderData(_element) {
    const _dataId = "script#getStatisticsService";
    _element.enumerate({
        selector: _dataId,
        handler: (element, _idx) => {
            var _html = element.string;
            const jsonLeft = "try { window.getStatisticsService = ";
            const jsonRight = "}catch(e){}";
            _html = _html.replace(jsonLeft, "");
            _html = _html.replace(jsonRight, "");
            _headerDataJson = JSON.parse(_html);
            _imgList.imgUrl = _headerDataJson.imgUrl;
            _imgList.dailyPic = _headerDataJson.dailyPic;
        }
    });
}

function showHeaderData() {
    var messageText =
        "确诊 " +
        _headerDataJson.confirmedCount +
        " 例(+" +
        _headerDataJson.confirmedIncr +
        ")" +
        "\n疑似 " +
        _headerDataJson.suspectedCount +
        " 例(+" +
        _headerDataJson.suspectedIncr +
        ")" +
        "\n死亡 " +
        _headerDataJson.deadCount +
        " 例(+" +
        _headerDataJson.deadIncr +
        ")" +
        "\n治愈 " +
        _headerDataJson.curedCount +
        " 例(+" +
        _headerDataJson.curedIncr +
        ")" +
        "\n重症 " +
        _headerDataJson.seriousCount +
        " 例(+" +
        _headerDataJson.seriousIncr +
        ")\n" +
        _headerDataJson.note2 +
        "\n" +
        _headerDataJson.note3 +
        "\n" +
        _headerDataJson.remark1 +
        "\n" +
        _headerDataJson.remark2 +
        "\n(" +
        _headerDataJson.generalRemark +
        ")";
    $ui.alert({
        title: _headerDataJson.note1,
        message: messageText,
        actions: [{
                title: "分享内容",
                disabled: false, // Optional
                handler: function () {
                    $share.sheet([messageText]);
                }
            },
            {
                title: "疫情地图",
                disabled: false, // Optional
                handler: function () {
                    $ui.preview({
                        title: "疫情地图",
                        url: _imgList.imgUrl
                    });
                }
            },
            {
                title: "全国疫情形势图",
                disabled: false, // Optional
                handler: function () {
                    $ui.preview({
                        title: "全国疫情形势图",
                        url: _imgList.dailyPic
                    });
                }
            },
            {
                title: "查看重要公告",
                disabled: false, // Optional
                handler: function () {
                    showHeaderMarqueeData(_headerDataJson.marquee)
                }
            },
            {
                title: getUpdateTime(_headerDataJson.modifyTime) + "秒前更新数据",
                disabled: true,
            },
            {
                title: "关闭",
                disabled: false, // Optional
                handler: function () {}
            }
        ]
    });
}

function showHeaderMarqueeData(marqueeDataList) {
    var marqueeTitleList = [];
    for (x in marqueeDataList) {
        marqueeTitleList.push(marqueeDataList[x].marqueeContent);
    }
    $ui.push({
        props: {
            title: "重要公告"
        },
        views: [{
            type: "list",
            props: {
                data: marqueeTitleList
            },
            layout: $layout.fill,
            events: {
                didSelect: function (_sender, indexPath, _data) {
                    const _idx = indexPath.row;
                    const thisMarquee = marqueeDataList[_idx];
                    $ui.alert({
                        title: thisMarquee.marqueeLabel,
                        message: thisMarquee.marqueeContent,
                        actions: [{
                            title: "打开链接",
                            disabled: false, // Optional
                            handler: function () {
                                $ui.preview({
                                    title: thisMarquee.marqueeLabel,
                                    url: thisMarquee.marqueeLink
                                });
                            }
                        }, {
                            title: "关闭"
                        }]
                    });
                }
            }
        }]
    });
}
// 详细数据
function getMainData(_element) {
    const _dataId = "script#getListByCountryTypeService1";
    _element.enumerate({
        selector: _dataId,
        handler: (element, _idx) => {
            var _html = element.string;
            const jsonLeft = "try { window.getListByCountryTypeService1 = ";
            const jsonRight = "}catch(e){}";
            _html = _html.replace(jsonLeft, "");
            _html = _html.replace(jsonRight, "");
            _mainTitleDataJson = processMainData(_html);
        }
    });
}

function processMainData(_html) {
    var proList = [];
    const _json = JSON.parse(_html);
    _mainDataJson = _json;
    for (x in _json) {
        const _item = _json[x];
        proList.push(
            _item.provinceShortName + " (" + _item.confirmedCount + "人)"
        );
    }
    return proList;
}

function showMainData() {
    $ui.push({
        props: {
            title: "各省数据"
        },
        views: [{
            type: "list",
            props: {
                data: _mainTitleDataJson
            },
            layout: $layout.fill,
            events: {
                didSelect: function (_sender, indexPath, _data) {
                    const _idx = indexPath.row;
                    showMainDetailedData(_idx);
                }
            }
        }]
    });
}

function showMainDetailedData(_idx) {
    const _jsonData = _mainDataJson[_idx];
    const updateTime = getUpdateTime(_jsonData.modifyTime);
    var messageText =
        "确诊 " +
        _jsonData.confirmedCount.toString() +
        " 例\n疑似 " +
        _jsonData.suspectedCount +
        " 例\n死亡 " +
        _jsonData.deadCount +
        " 例\n治愈 " +
        _jsonData.curedCount +
        " 例\n最后更新时间：" +
        updateTime +
        " 秒前";
    $ui.alert({
        title: _jsonData.provinceShortName,
        message: messageText
    });
    toastIfNotEmpty(_jsonData.comment);
    /*
      $ui.push({
          props: {
            title: title
          },
          views: [
            {
              type: "list",
              props: {
                data: siteItemTitleList,
                id: listViewId
              },
              layout: $layout.fill,
              events: {
                didSelect: function (sender, indexPath, data) {
                  const mIndex = indexPath.row;
                  const selectItem = siteItemList[mIndex];
                  const itemUrl = selectItem.Url;
                  //$app.openURL(itemUrl);
                  // 改用内置网页浏览器
                  openWebView(itemUrl);
                }
              }
            }
          ]
        });*/
}
// 时间线
function getTimeLine(_element) {
    const _dataId = "script#getTimelineService";
    _element.enumerate({
        selector: _dataId,
        handler: (element, _idx) => {
            var _html = element.string;
            const jsonLeft = "try { window.getTimelineService = ";
            const jsonRight = "}catch(e){}";
            _html = _html.replace(jsonLeft, "");
            _html = _html.replace(jsonRight, "");
            _timeLineTitleData = processTimeLineData(_html);
        }
    });
}

function processTimeLineData(_html) {
    var timeLineList = [];
    const _json = JSON.parse(_html);
    _timeLineData = _json;
    for (x in _json) {
        const _item = _json[x];
        timeLineList.push(_item.title);
    }
    return timeLineList;
}

function showTimeLineData() {
    $ui.push({
        props: {
            title: "时间线"
        },
        views: [{
            type: "list",
            props: {
                data: _timeLineTitleData
            },
            layout: $layout.fill,
            events: {
                didSelect: function (_sender, indexPath, _data) {
                    const _idx = indexPath.row;
                    showTimeLineDetailedData(_idx);
                }
            }
        }]
    });
}

function showTimeLineDetailedData(_idx) {
    const thisItem = _timeLineData[_idx];
    const _title = thisItem.title;
    const _message = thisItem.summary;
    const _updateDate = thisItem.pubDateStr;
    const _url = getRealUrl(thisItem.sourceUrl);
    $ui.alert({
        title: _updateDate,
        message: _message,
        actions: [{
                title: "打开链接",
                disabled: false, // Optional
                handler: function () {
                    $ui.preview({
                        title: _title,
                        url: _url
                    });
                }
            },
            {
                title: "更新时间:" + _updateDate
            },
            {
                title: "信息来源:" + thisItem.infoSource
            },
            {
                title: "发生地点:" + thisItem.provinceName
            },
            {
                title: "分享链接",
                handler: function () {
                    $share.sheet({
                        items: _url,
                        handler: function (success) {
                            if (success) {
                                $ui.toast("分享成功");
                            } else {
                                $ui.error("分享失败");
                            }
                        }
                    });
                }
            },
            {
                title: "关闭",
                handler: function () {}
            }
        ]
    });
}

// 谣言
function getRumor(_element) {
    const _dataId = "script#getIndexRumorList";
    _element.enumerate({
        selector: _dataId,
        handler: (element, _idx) => {
            var _html = element.string;
            const jsonLeft = "try { window.getIndexRumorList = ";
            const jsonRight = "}catch(e){}";
            _html = _html.replace(jsonLeft, "");
            _html = _html.replace(jsonRight, "");
            _rumorTitleData = processRumorData(_html);
        }
    });
}

function processRumorData(_html) {
    var rumorList = [];
    _rumorData = JSON.parse(_html);
    for (x in _rumorData) {
        rumorList.push(_rumorData[x].title);
    }
    return rumorList;
}

function showRumorData() {
    $ui.push({
        props: {
            title: "谣言"
        },
        views: [{
            type: "list",
            props: {
                data: _rumorTitleData
            },
            layout: $layout.fill,
            events: {
                didSelect: function (_sender, indexPath, _data) {
                    const _idx = indexPath.row;
                    showRumorDetailedData(_idx);
                }
            }
        }]
    });
}

function showRumorDetailedData(_idx) {
    const thisItem = _rumorData[_idx];
    const _title = thisItem.title;
    const _url = getRealUrl(thisItem.sourceUrl);
    var isNotUrl = false;
    if (_url == "") {
        isNotUrl = true;
    }
    $ui.alert({
        title: _title,
        message: thisItem.mainSummary + "\n\n" + thisItem.body,
        actions: [{
                title: "打开链接",
                disabled: isNotUrl, // Optional
                handler: function () {
                    $ui.preview({
                        title: _title,
                        url: _url
                    });
                }
            },
            {
                title: "分享链接",
                disabled: isNotUrl, // Optional
                handler: function () {
                    $share.sheet({
                        items: _url,
                        handler: function (success) {
                            if (success) {
                                $ui.toast("分享成功");
                            } else {
                                $ui.error("分享失败");
                            }
                        }
                    });
                }
            },
            {
                title: "关闭",
                handler: function () {}
            }
        ]
    });
}
// 地区排序
function getAreaStat(_element) {
    const _dataId = "script#getAreaStat";
    _element.enumerate({
        selector: _dataId,
        handler: (element, _idx) => {
            var _html = element.string;
            const jsonLeft = "try { window.getAreaStat = ";
            const jsonRight = "}catch(e){}";
            _html = _html.replace(jsonLeft, "");
            _html = _html.replace(jsonRight, "");
            _areaStatProData = processAreaStatData(_html);
        }
    });
}

function processAreaStatData(_html) {
    // 省级
    var _list = [];
    _areaStatData = JSON.parse(_html);
    for (x in _areaStatData) {
        const thisPro = _areaStatData[x];
        _list.push(
            thisPro.provinceName + " (" + thisPro.confirmedCount + "人)"
        );
    }
    return _list;
}

function showAreaStatData() {
    // 省级
    $ui.push({
        props: {
            title: "地区排序"
        },
        views: [{
            type: "list",
            props: {
                data: _areaStatProData
            },
            layout: $layout.fill,
            events: {
                didSelect: function (_sender, indexPath, _data) {
                    const _idx = indexPath.row;
                    showAreaStatCityData(_areaStatData[_idx]);
                }
            }
        }]
    });
}

function processAreaStatCityData(_json) {
    // 城市
    var _list = [];
    for (x in _json) {
        const thisCity = _json[x];
        _list.push(thisCity.cityName + " (" + thisCity.confirmedCount + "人)");
    }
    return _list;
}

function showAreaStatCityData(_thisPro) {
    // 城市
    console.log(_thisPro);
    const _cityList = _thisPro.cities;
    const _cityTitleList = processAreaStatCityData(_cityList);
    $ui.push({
        props: {
            title: _thisPro.provinceName
        },
        views: [{
            type: "list",
            props: {
                data: _cityTitleList
            },
            layout: $layout.fill,
            events: {
                didSelect: function (_sender, indexPath, _data) {
                    const _idx = indexPath.row;
                    const thisItem = _cityList[_idx];
                    console.log(thisItem);
                    $ui.alert({
                        title: thisItem.cityName,
                        message: "确诊人数：" +
                            thisItem.confirmedCount +
                            "\n疑似人数：" +
                            thisItem.suspectedCount +
                            "\n治愈人数：" +
                            thisItem.curedCount +
                            "\n死亡人数：" +
                            thisItem.deadCount
                    });
                }
            }
        }]
    });
    toastIfNotEmpty(_thisPro.comment);
}

// 国外数据
function getForeignData(_element) {
    const _dataId = "script#getListByCountryTypeService2";
    _element.enumerate({
        selector: _dataId,
        handler: (element, _idx) => {
            var _html = element.string;
            const jsonLeft = "try { window.getListByCountryTypeService2 = ";
            const jsonRight = "}catch(e){}";
            _html = _html.replace(jsonLeft, "");
            _html = _html.replace(jsonRight, "");
            _foreignTitleDataJson = processForeignData(_html);
        }
    });
}

function processForeignData(_html) {
    var list = [];
    const _json = JSON.parse(_html);
    _foreignDataJson = _json;
    for (x in _json) {
        const _item = _json[x];
        list.push(_item.provinceName + " (" + _item.confirmedCount + "人)");
    }
    return list;
}

function showForeignData() {
    $ui.push({
        props: {
            title: "国外数据"
        },
        views: [{
            type: "list",
            props: {
                data: _foreignTitleDataJson
            },
            layout: $layout.fill,
            events: {
                didSelect: function (_sender, indexPath, _data) {
                    showForeignDetailedData(indexPath.row);
                }
            }
        }]
    });
}

function showForeignDetailedData(_idx) {
    const _jsonData = _foreignDataJson[_idx];
    const updateTime = getUpdateTime(_jsonData.modifyTime);
    var messageText =
        "确诊 " +
        _jsonData.confirmedCount.toString() +
        " 例\n疑似 " +
        _jsonData.suspectedCount +
        " 例\n死亡 " +
        _jsonData.deadCount +
        " 例\n治愈 " +
        _jsonData.curedCount +
        " 例\n最后更新时间：" +
        updateTime +
        " 秒前";
    $ui.alert({
        title: _jsonData.provinceName,
        message: messageText
    });
    toastIfNotEmpty(_jsonData.comment);
}

// 疾病知识
function getWikiData(_element) {
    const elementId = "getWikiList";
    _element.enumerate({
        selector: "script#" + elementId,
        handler: (element, _idx) => {
            var _html = element.string;
            const jsonLeft = "try { window." + elementId + " = ";
            const jsonRight = "}catch(e){}";
            _html = _html.replace(jsonLeft, "");
            _html = _html.replace(jsonRight, "");
            _wikiData = JSON.parse(_html);
        }
    });
}

function showWikiData() {
    const wikiResult = _wikiData.result;
    var wikiTitleList = [];
    for (x in wikiResult) {
        wikiTitleList.push(wikiResult[x].title);
    }
    $ui.push({
        props: {
            title: "疾病知识"
        },
        views: [{
            type: "list",
            props: {
                data: wikiTitleList
            },
            layout: $layout.fill,
            events: {
                didSelect: function (_sender, indexPath, _data) {
                    const item = wikiResult[indexPath.row];
                    $ui.alert({
                        title: item.title,
                        message: item.description,
                        actions: [{
                                title: "打开链接",
                                disabled: false, // Optional
                                handler: function () {
                                    $ui.preview({
                                        title: item.title,
                                        url: item.linkUrl
                                    });
                                }
                            },
                            {
                                title: "关闭",
                                disabled: false, // Optional
                                handler: function () {}
                            }
                        ]
                    });
                }
            }
        }]
    });
}
// 推荐文章
function getRecommendedData(_element) {
    const elementId = "getIndexRecommendList";
    _element.enumerate({
        selector: "script#" + elementId,
        handler: (element, _idx) => {
            var _html = element.string;
            const jsonLeft = "try { window." + elementId + " = ";
            const jsonRight = "}catch(e){}";
            _html = _html.replace(jsonLeft, "");
            _html = _html.replace(jsonRight, "");
            _recommendData = JSON.parse(_html);
        }
    });
}

function showRecommendedData() {
    var recommendTitleList = [];
    for (x in _recommendData) {
        recommendTitleList.push(_recommendData[x].title);
    }
    $ui.push({
        props: {
            title: "推荐文章"
        },
        views: [{
            type: "list",
            props: {
                data: recommendTitleList
            },
            layout: $layout.fill,
            events: {
                didSelect: function (_sender, indexPath, _data) {
                    const item = _recommendData[indexPath.row];
                    $ui.alert({
                        title: item.title,
                        message: item.description,
                        actions: [{
                                title: "打开链接",
                                disabled: false, // Optional
                                handler: function () {
                                    $ui.preview({
                                        title: item.title,
                                        url: item.linkUrl
                                    });
                                }
                            }, {
                                title: "打开封面图",
                                disabled: false, // Optional
                                handler: function () {
                                    $ui.preview({
                                        title: item.title,
                                        url: item.imgUrl
                                    });
                                }
                            },
                            {
                                title: "关闭"
                            }
                        ]
                    });
                }
            }
        }]
    });
}
// 开始运行
initMainMenu();