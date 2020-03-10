let apiToken = "";
let cacheKey = "WEATHER_HEWEATHER_APITOKEN";
let cacheKeyList = {
    apitoken: "WEATHER_HEWEATHER_APITOKEN",
    location_id: "WEATHER_HEWEATHER_LOCATION_ID"
}
// https://free-api.heweather.net/s6/weather/now?location=auto_ip&key=b3a9d4affb2645f78e01d294d6b92ff5
let initToken = (token = $cache.get(cacheKey)) => {
    if (token) {
        apiToken = token;
        return apiToken == token;
    } else {
        return false;
    }
};
let getNow = (location = $cache.get(cacheKeyList.location_id) ? $cache.get(cacheKeyList.location_id) : "auto_ip", token = apiToken) => {
    if (token) {
        $http.get({
            url: `https://free-api.heweather.net/s6/weather/now?location=${location?location:"auto_ip"}&key=${token?token:apiToken}`
        }).then(function (resp) {
            var data = resp.data;
            const weatherData = data.HeWeather6[0];
            if (weatherData.status == "ok") {
                if (location && location !== "auto_ip") {
                    $cache.set(cacheKeyList.location_id, location);
                }
                const nowData = new NowData(weatherData.now);
                const basicData = new BasicData(weatherData.basic);
                const updateTime = weatherData.update.loc;
                const rowList = [{
                    title: "更新时间",
                    rows: [updateTime]
                }, {
                    title: "城市信息",
                    rows: [
                        `当前位置：${basicData.location}`,
                        `位置编号：${basicData.cid}`,
                        `上级城市：${basicData.parent_city}`,
                        `行政区域：${basicData.admin_area}`,
                        `国家名称：${basicData.cnty}`,
                        `当前经度：${basicData.lon}`,
                        `当前纬度：${basicData.lat}`,
                        `所在时区：${basicData.tz}`,
                    ]
                }, {
                    title: "天气信息",
                    rows: [
                        `云量：${nowData.cloud}`,
                        `温度：${nowData.tmp}`,
                        `体感温度：${nowData.fl}`,
                        `实况天气：${nowData.cond_txt}`,
                        `风向：${nowData.wind_dir}`,
                        `风力：${nowData.wind_sc}级`,
                        `风速：${nowData.wind_spd}km/h`,
                        `相对湿度：${nowData.hum}`,
                        `降水量：${nowData.pcpn}`,
                        `能见度：${nowData.vis}km`,
                    ]
                }];
                $ui.push({
                    props: {
                        title: "天气",
                        navButtons: [{
                            title: "网页版",
                            icon: "068", // Or you can use icon name
                            handler: () => {
                                $safari.open({
                                    url: "https://www.heweather.com/"
                                });
                            }
                        }]
                    },
                    views: [{
                        type: "list",
                        props: {
                            data: rowList
                        },
                        layout: $layout.fill,
                        events: {
                            didSelect: function (_sender, indexPath, _data) {
                                const section = indexPath.section;
                                const row = indexPath.row;
                                $ui.alert({
                                    title: "",
                                    message: _data,
                                });
                            }
                        }
                    }]
                });
            } else {
                $ui.alert({
                    title: "错误",
                    message: weatherData.status,
                });
            }
        });
    } else {
        $ui.alert({
            title: "查询错误",
            message: "请设置密钥(token)",
        });
    }
};

function NowData(_nowData) {
    this.cloud = _nowData.cloud;
    this.cond_code = _nowData.cond_code;
    this.cond_txt = _nowData.cond_txt;
    this.fl = _nowData.fl;
    this.hum = _nowData.hum;
    this.pcpn = _nowData.pcpn;
    this.pres = _nowData.pres;
    this.tmp = _nowData.tmp;
    this.vis = _nowData.vis;
    this.wind_deg = _nowData.wind_deg;
    this.wind_dir = _nowData.wind_dir;
    this.wind_sc = _nowData.wind_sc;
    this.wind_spd = _nowData.wind_spd;
};

function BasicData(_basicData) {
    this.cid = _basicData.cid;
    this.location = _basicData.location;
    this.parent_city = _basicData.parent_city;
    this.admin_area = _basicData.admin_area;
    this.cnty = _basicData.cnty;
    this.lat = _basicData.lat;
    this.lon = _basicData.lon;
    this.tz = _basicData.tz;
};
let checkToken = () => {
    return apiToken.length > 0;
};
let setToken = token => {
    apiToken = token;
    $cache.set(cacheKey, token);
    return token.length > 0 ? apiToken == token : false;
};
let getLastLocationId = () => {
    return $cache.get(cacheKeyList.location_id);
}
let apiSign = (paramList, token) => {
    if (paramList == undefined || token == undefined || paramList.length == 0 || token.length == 0) {
        return undefined;
    }
    const sortList = paramList.keys().sort(function (a, b) {
        return a - b;
    });
    $console.info(paramList);
    $console.info(sortList);
    var sourceStr = "";
    for (p in sortList) {
        sortList += `${p}=${sortList[p]}`;
        if (p <= sortList.length - 1) {
            sortList += "&";
        }
    }
    if (sourceStr.endsWith("&")) {
        sourceStr = sourceStr.substr(0, sourceStr.length - 2);
    }
    const result = $text.MD5(sourceStr + token);
    $console.info(`apiSign:${result}`);
    return result;
};
module.exports = {
    initToken,
    getNow,
    checkToken,
    setToken,
    getLastLocationId
};