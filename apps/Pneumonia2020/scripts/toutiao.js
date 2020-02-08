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
                showAllList(jsonData);
            } else {
                $ui.alert({
                    title: "加载失败",
                    message: data.message,
                });
            }
        }
    });
}

function showAllList(jsonData) {
    const provincesList = jsonData.provinces;
    const worldList = jsonData.world;
    var provincesTitleList = [];
    var worldTitleList = [];
    for (x in provincesList) {
        const thisProvince = provincesList[x];
        provincesTitleList.push(thisProvince.name + "(" + thisProvince.confirmedNum + ")");
    }
    for (x in worldList) {
        const thisCountry = worldList[x];
        worldTitleList.push(thisCountry.country + "(" + thisCountry.confirmedNum + ")");
    }
    $ui.push({
        props: {
            title: $l10n("TOUTIAO")
        },
        views: [{
            type: "list",
            props: {
                footer: {
                    type: "label",
                    props: {
                        height: 20,
                        text: "updateTime:" + updateTime,
                        textColor: $color("#AAAAAA"),
                        align: $align.center,
                        font: $font(12)
                    }
                },
                data: [{
                        title: $l10n("CHINA"),
                        rows: provincesTitleList
                    },
                    {
                        title: $l10n("OTHER"),
                        rows: worldTitleList
                    }
                ]
            },
            layout: $layout.fill,
            events: {
                didSelect: function (_sender, indexPath, _data) {
                    const row = indexPath.row;
                    const section = indexPath.section;
                    $console.info(indexPath.section + "-" + indexPath.row);
                    switch (section) {
                        case 0:
                            showProvincesInfo(provincesList[row]);
                            break;
                        case 1:
                            const thisCountry = worldList[row];
                            $ui.alert({
                                title: thisCountry.country,
                                message: "确诊：" + thisCountry.confirmedNum +
                                    "(+" + thisCountry.confirmedIncr + ")" +
                                    "\n疑似：" + thisCountry.suspectedNum +
                                    "\n死亡：" + thisCountry.deathsNum,
                            });
                            break;
                        default:
                            $ui.error("错误列表");
                    }
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
                            "\n治愈：" + thisCity.curesNum +
                            "\n死亡：" + thisCity.deathsNum
                    });
                }
            }
        }]
    });
    $ui.alert({
        title: provincesData.name,
        message: "确诊：" + provincesData.confirmedNum + "(+" + provincesData.confirmedIncr + ")" +
            "\n治愈：" + provincesData.curesNum +
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