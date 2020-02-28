let lib = require("./lib.js");
let cacheKey = "mask_lookup_region_data";
let _api = {
    getPosition: "https://ncov.html5.qq.com/mouthmask/admindivisions.json",
    getData: "https://ncov.html5.qq.com/mouthmask/lookup"
}
let regionData = {
    rawData: [],
    province: "",
    city: "",
    area: ""
}

function getData(province, city, area) {
    // https://ncov.html5.qq.com/mouthmask/lookup?province=[省]&city=[市]&district=[区]
    $ui.loading(true);
    $http.get({
        url: _api.getData + "?province=" + $text.URLEncode(province) + "&city=" + $text.URLEncode(city) +
            "&district=" + $text.URLEncode(area),
        handler: function (resp) {
            var data = resp.data;
            var todayList = [];
            var futureList = [];
            const todayData = data.todayavail;
            const futureData = data.futurelist[0].avail;
            for (t in todayData) {
                const thisT = todayData[t];
                todayList.push(thisT.briefwhen + "|" +
                    thisT.masktype + "|" + thisT.seller);
            }
            for (f in futureData) {
                const thisF = futureData[f];
                futureList.push(thisF.briefwhen + "|" +
                    thisF.masktype + "|" + thisF.seller);
            }
            $ui.loading(false);
            $ui.push({
                props: {
                    title: $l10n("搜索结果")
                },
                views: [{
                    type: "list",
                    props: {
                        data: [{
                                title: "地区",
                                rows: [province, city, area]
                            }, {
                                title: "今天开放",
                                rows: todayList
                            },
                            {
                                title: "即将开放[" + data.futurelist[0].date + "]",
                                rows: futureList
                            }
                        ]
                    },
                    layout: $layout.fill,
                    events: {
                        didSelect: function (_sender, indexPath, _data) {
                            switch (indexPath.section) {
                                case 1:
                                    showItemInfo(todayData[indexPath.row]);
                                    break;
                                case 2:
                                    showItemInfo(futureData[indexPath.row]);
                                    break;
                            }
                        }
                    }
                }]
            });
        }
    });
}

function showItemInfo(itemData) {
    $ui.alert({
        title: itemData.seller,
        message: itemData.title + "\n" +
            itemData.masktype + "\n" + itemData.price + "\n" +
            itemData.briefwhen,
        actions: [{
            title: "购买链接",
            disabled: false, // Optional
            handler: function () {
                $ui.preview({
                    title: itemData.seller,
                    url: itemData.buyurl
                });
            }
        }, {
            title: "消息来源",
            disabled: itemData.introurl.length == 0, // Optional
            handler: function () {
                $ui.preview({
                    title: "消息来源",
                    url: itemData.introurl
                });
            }
        }, {
            title: "关闭",
            disabled: false
        }]
    });
}

function getRegionData() {
    $ui.loading(true);
    if (regionData.rawData.length > 0) {
        $ui.loading(false);
        showRegionPicker(regionData.rawData);
    } else {
        $http.get({
            url: _api.getPosition,
            handler: function (resp) {
                var data = resp.data;
                const positionData = data.position;
                var regionList = [];
                for (p in positionData) {
                    const thisProvince = positionData[p];
                    var provinceList = {
                        title: p,
                        items: []
                    };
                    for (c in thisProvince) {
                        const thisCity = thisProvince[c];
                        var cityList = {
                            title: c,
                            items: []
                        };
                        for (a in thisCity) {
                            cityList.items.push({
                                title: a
                            });
                        }
                        provinceList.items.push(cityList);
                    }
                    regionList.push(provinceList);
                }
                regionData.rawData = regionList;
                $ui.loading(false);
                showRegionPicker(regionList);
            }
        });
    }
}

function showRegionPicker(regionList) {
    $picker.data({
        type: "picker",
        props: {
            items: regionList
        },
        layout: function (make) {
            make.left.top.right.equalTo(0)
        },
        events: {
            changed: function (sender) {
                const selectedRows = sender.selectedRows;
                const selectedPro = regionList[selectedRows[0]];
                const selectedCity = selectedPro.items[selectedRows[1]];
                const selectedArea = selectedCity.items[selectedRows[2]];
                regionData.province = selectedPro.title;
                regionData.city = selectedCity.title;
                regionData.area = selectedArea.title;
                $cache.set(cacheKey, regionData);
            }
        }
    });
}

function initView() {
    const cacheData = $cache.get(cacheKey);
    regionData = cacheData ? cacheData : regionData;
    $ui.push({
        props: {
            title: $l10n("口罩购买")
        },
        views: [{
            type: "list",
            props: {
                data: lib.getListFromL10n(["设置地区", "搜索口罩"])
            },
            layout: $layout.fill,
            events: {
                didSelect: function (_sender, indexPath, _data) {
                    const _idx = indexPath.row;
                    switch (_idx) {
                        case 0:
                            getRegionData();
                            break;
                        case 1:
                            if (regionData.province.length > 0) {
                                getData(regionData.province, regionData.city, regionData.area);
                            } else {
                                $ui.error("未设置地区，请手动输入");
                                $input.text({
                                    placeholder: "省份",
                                    text: "",
                                    handler: function (province) {
                                        if (province.length > 0) {
                                            $input.text({
                                                placeholder: "城市",
                                                text: "",
                                                handler: function (city) {
                                                    if (city.length > 0) {
                                                        getData(province, city, "全部")
                                                    } else {
                                                        $ui.error("城市空白");
                                                    }
                                                }
                                            });
                                        } else {
                                            $ui.error("省份空白");
                                        }
                                    }
                                });
                            }
                            break;
                    }
                }
            }
        }]
    });
}
module.exports = {
    init: initView
};