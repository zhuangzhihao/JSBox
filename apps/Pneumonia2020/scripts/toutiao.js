const lib = require("./lib.js");
const apiUrl = "https://i.snssdk.com/forum/home/v1/info/?forum_id=1656784762444839";
var updateTime = 0;
// 全国疫情状况
function getCountrywideData() {
    $http.get({
        url: apiUrl,
        handler: function (resp) {
            var data = resp.data;
            $console.info(data);
            if (data.err_no == 0) {
                const jsonData = JSON.parse(data.forum.extra.ncov_string_list);
                $console.info(jsonData);
                updateTime = jsonData.updateTime;
                const provincesList = jsonData.provinces;
                showProvincesList(provincesList);
            } else {
                $ui.alert({
                    title: "加载失败",
                    message: data.message,
                });
            }
        }
    });
}

function showProvincesList(_provincesList) {
    var provincesTitleList = [];
    for (x in _provincesList) {
        const thisProvince = _provincesList[x];
        provincesTitleList.push(thisProvince.name + "(" + thisProvince.confirmedNum + ")");
    }
    $ui.push({
        props: {
            title: $l10n("TOUTIAO")
        },
        views: [{
            type: "list",
            props: {
                data: provincesTitleList
            },
            layout: $layout.fill,
            events: {
                didSelect: function (_sender, indexPath, _data) {
                    const _idx = indexPath.row;
                    showProvincesInfo(_provincesList[_idx]);
                }
            }
        }]
    });
}

function showProvincesInfo(provincesData) {
    var cityList = [];
    var cityListJson = provincesData.cities;
    for (x in cityListJson) {
        const thisCity = cityListJson[x];
        cityList.push(thisCity.name + "(" + thisCity.confirmedNum + ")");
    }
    $ui.push({
        props: {
            title: provincesData.name
        },
        views: [{
            type: "list",
            props: {
                data: cityList
            },
            layout: $layout.fill,
            events: {
                didSelect: function (_sender, indexPath, _data) {
                    const _idx = indexPath.row;
                    const thisCity = cityListJson[_idx];
                    $ui.alert({
                        title: thisCity.name,
                        message: "确诊：" + thisCity.confirmedNum + "(+" + thisCity.confirmedIncr + ")" +
                            "\n疑似：" + thisCity.curesNum +
                            "\n死亡：" + thisCity.deathsNum
                    });
                }
            }
        }]
    });
    $ui.alert({
        title: provincesData.name,
        message: "确诊：" + provincesData.confirmedNum + "(+" + provincesData.confirmedIncr + ")" +
            "\n疑似：" + provincesData.curesNum +
            "\n死亡：" + provincesData.deathsNum +
            "\n更新日期：" + provincesData.updateDate
    });

}

function init() {
    getCountrywideData();
}

module.exports = {
    init: init
}