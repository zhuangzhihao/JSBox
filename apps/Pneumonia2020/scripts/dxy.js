const lib = require("./lib.js");
let cheerio = require("cheerio");
var isLoading = true;
const webUrl = "https://ncov.dxy.cn/ncovh5/view/pneumonia";
const _menuList = [
    "简单数据",
    "详细数据",
    "时间线",
    "谣言",
    "地区排序",
    "国外数据",
    "疾病知识"
];
var _mainTitleDataJson = [],
    _mainDataJson = [],
    _timeLineData = [],
    _timeLineTitleData = [],
    _rumorData = [],
    _rumorTitleData = [],
    _areaStatData = [],
    _areaStatProData = [],
    _foreignTitleDataJson = [],
    _foreignDataJson = [],
    _wikiData = [];

var $ = undefined;

function getNavButton() {
    return [{
        title: "打开网页版",
        icon: "068", // Or you can use icon name
        symbol: "checkmark.seal", // SF symbols are supported
        handler: () => {
            lib.previewWeb($l10n("DINGXIANGYUAN"), webUrl);
        }
    }];
}

function initMainMenu() {
    isLoading = true;
    getData();
    $ui.push({
        props: {
            id: "listView_index",
            title: $l10n("DINGXIANGYUAN"),
            navButtons: getNavButton()
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
                        switch (indexPath.row) {
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
    const urlAllType = webUrl;
    $http.get({
        url: urlAllType,
        handler: function (_resp) {
            const mData = _resp.data;
            $console.info("获取数据成功");
            processAllData2(mData);
        }
    });
}


function processAllData2(_sourceData) {
    $ = cheerio.load(_sourceData);
    //getHeaderData($("script#getStatisticsService").html());
    getMainData($("script#getListByCountryTypeService1").html());
    getTimeLine($("script#getTimelineService").html());
    getRumor($("script#getIndexRumorList").html());
    getAreaStat($("script#getAreaStat").html());
    getForeignData($("script#getListByCountryTypeService2").html());
    getWikiData($("script#getWikiList").html());
    isLoading = false;
}

// 简单数据
function showHeaderData() {
    const _headerDataJson = JSON.parse($("script#getStatisticsService").html()
        .replace("try { window.getStatisticsService = ", "").replace("}catch(e){}", ""));
    $console.info(_headerDataJson);

    const addNowStr = (_headerDataJson.currentConfirmedIncr > 0 ? "+" : "") + _headerDataJson.currentConfirmedIncr;
    const addTotalStr = (_headerDataJson.confirmedIncr > 0 ? "+" : "") + _headerDataJson.confirmedIncr;
    const addInputStr = (_headerDataJson.suspectedIncr > 0 ? "+" : "") + _headerDataJson.suspectedIncr;
    const addDeadStr = (_headerDataJson.deadIncr > 0 ? "+" : "") + _headerDataJson.deadIncr;
    const addCuredStr = (_headerDataJson.curedIncr > 0 ? "+" : "") + _headerDataJson.curedIncr;
    const addSeriousStr = (_headerDataJson.seriousIncr > 0 ? "+" : "") + _headerDataJson.seriousIncr;
    const messageText =
        `现存确诊${_headerDataJson.currentConfirmedCount}(${addNowStr})\n` +
        `累计确诊${_headerDataJson.confirmedCount}(${addTotalStr})\n` +
        `境外输入${_headerDataJson.suspectedCount}(${addInputStr})\n` +
        `死亡${_headerDataJson.deadCount}(${addDeadStr})\n` +
        `治愈${_headerDataJson.curedCount}(${addCuredStr})\n` +
        `重症${_headerDataJson.seriousCount}(${addSeriousStr})\n` +
        `${_headerDataJson.note2}\n${_headerDataJson.note3}\n${_headerDataJson.remark1}\n` +
        `${_headerDataJson.remark2}\n${_headerDataJson.remark3}\n(${_headerDataJson.generalRemark})`;
    const ChinaPicList = _headerDataJson.quanguoTrendChart.map(i => i.imgUrl);
    const HBandFHBPicList = _headerDataJson.hbFeiHbTrendChart.map(i => i.imgUrl);
    const foreignTrendChartList = _headerDataJson.foreignTrendChart.map(i => i.imgUrl);
    $ui.alert({
        title: _headerDataJson.note1,
        message: messageText,
        actions: [{
                title: "分享内容",
                disabled: false, // Optional
                handler: function () {
                    $share.sheet([_headerDataJson.note1, messageText]);
                }
            },
            {
                title: "疫情地图",
                disabled: false, // Optional
                handler: function () {
                    $quicklook.open({
                        image: _headerDataJson.imgUrl
                    });
                }
            },
            {
                title: "全国疫情形势图",
                disabled: false, // Optional
                handler: function () {
                    $quicklook.open({
                        list: _headerDataJson.dailyPics
                    });
                }
            },
            {
                title: "国内疫情趋势表",
                disabled: false, // Optional
                handler: function () {
                    $quicklook.open({
                        list: ChinaPicList
                    });
                }
            },
            {
                title: "湖北/非湖北疫情趋势对比表",
                disabled: false, // Optional
                handler: function () {
                    $quicklook.open({
                        list: HBandFHBPicList
                    });
                }
            },
            {
                title: "国外疫情趋势表",
                disabled: false, // Optional
                handler: function () {
                    $quicklook.open({
                        list: foreignTrendChartList
                    });
                }
            },
            {
                title: "查看重要公告",
                disabled: false, // Optional
                handler: function () {
                    showHeaderMarqueeData(_headerDataJson.marquee);
                }
            },
            {
                title: lib.getUpdateTime(_headerDataJson.modifyTime) + "秒前更新数据",
                disabled: true
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
    marqueeTitleList = [];
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
                                    lib.previewWeb(thisMarquee.marqueeLabel, thisMarquee.marqueeLink);
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
// 详细数据
function getMainData(str) {
    const jsonLeft = "try { window.getListByCountryTypeService1 = ";
    const jsonRight = "}catch(e){}";
    _mainTitleDataJson = processMainData(str.replace(jsonLeft, "").replace(jsonRight, ""));
}

function processMainData(_html) {
    proList = [];
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
    const updateTime = lib.getUpdateTime(_jsonData.modifyTime);
    messageText =
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
    lib.toastIfNotEmpty(_jsonData.comment);
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
function getTimeLine(str) {
    const jsonLeft = "try { window.getTimelineService = ";
    const jsonRight = "}catch(e){}";
    _timeLineTitleData = processTimeLineData(str.replace(jsonLeft, "").replace(jsonRight, ""));
}

function processTimeLineData(_html) {
    timeLineList = [];
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
    const _url = lib.getRealUrl(thisItem.sourceUrl);
    $ui.alert({
        title: _updateDate,
        message: _message,
        actions: [{
                title: "打开链接",
                disabled: false, // Optional
                handler: function () {
                    lib.previewWeb(_title, _url);
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
function getRumor(str) {
    const jsonLeft = "try { window.getIndexRumorList = ";
    const jsonRight = "}catch(e){}";
    _rumorTitleData = processRumorData(str.replace(jsonLeft, "").replace(jsonRight, ""));
}

function processRumorData(_html) {
    rumorList = [];
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
    const _url = lib.getRealUrl(thisItem.sourceUrl);
    isNotUrl = false;
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
                    lib.previewWeb(_title, _url);
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
function getAreaStat(str) {
    const jsonLeft = "try { window.getAreaStat = ";
    const jsonRight = "}catch(e){}";
    _areaStatProData = processAreaStatData(str.replace(jsonLeft, "").replace(jsonRight, ""));
}

function processAreaStatData(_html) {
    // 省级
    _list = [];
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
    _list = [];
    for (x in _json) {
        const thisCity = _json[x];
        _list.push(thisCity.cityName + " (" + thisCity.confirmedCount + "人)");
    }
    return _list;
}

function showAreaStatCityData(_thisPro) {
    // 城市
    $console.info(_thisPro);
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
                    $console.info(thisItem);
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
    lib.toastIfNotEmpty(_thisPro.comment);
}

// 国外数据
function getForeignData(str) {
    const jsonLeft = "try { window.getListByCountryTypeService2 = ";
    const jsonRight = "}catch(e){}";
    _foreignTitleDataJson = processForeignData(str.replace(jsonLeft, "").replace(jsonRight, ""));
}

function processForeignData(_html) {
    list = [];
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
    const updateTime = lib.getUpdateTime(_jsonData.modifyTime);
    messageText =
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
    lib.toastIfNotEmpty(_jsonData.comment);
}

// 疾病知识
function getWikiData(str) {
    const jsonLeft = "try { window.getWikiList = ";
    const jsonRight = "}catch(e){}";
    _wikiData = JSON.parse(str.replace(jsonLeft, "").replace(jsonRight, ""));
}

function showWikiData() {
    const wikiResult = _wikiData.result;
    wikiTitleList = [];
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
                                    lib.previewWeb(item.title, item.linkUrl);
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
// 暴露接口
module.exports = {
    init: initMainMenu
};