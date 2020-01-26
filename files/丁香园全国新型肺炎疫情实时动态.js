var jsonData = "";
var isLoading = true;
const _menuList = ["简单数据", "详细数据"];
var _headerDataJson = {};
var _mainTitleDataJson = [];
var _mainDataJson = [];
function initMainMenu() {
  isLoading = true;
  $ui.loading("正在加载在线数据");
  getData();
  $ui.render({
    props: {
      id: "listView_index",
      title: "全国新型肺炎疫情实时动态"
    },
    views: [
      {
        type: "list",
        props: {
          data: _menuList
        },
        layout: $layout.fill,
        events: {
          didSelect: function(_sender, indexPath, _data) {
            if (isLoading) {
              $ui.error("请等待加载数据");
            } else {
              const _idx = indexPath.row;
              if (_idx == 0) {
                showHeaderData(_headerDataJson);
              } else if (_idx == 1) {
                push2List(_mainTitleDataJson);
              } else {
                $ui.error("错误选项");
              }
            }
          }
        }
      }
    ]
  });
}
function getData() {
  const urlAllType = "https://3g.dxy.cn/newh5/view/pneumonia";
  $http.get({
    url: urlAllType,
    handler: function(_resp) {
      const mData = _resp.data;
      $console.log("获取数据成功");
      processData(mData);
    }
  });
}
function processData(_sourceData) {
  const doc = $xml.parse({
    string: _sourceData,
    mode: "html"
  });
  const _element = doc.rootElement;
  getMainData(_element);
  getHeaderData(_element);
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
      console.log(_html);
      const jsonLeft = "try { window.getStatisticsService = ";
      const jsonRight = "}catch(e){}";
      _html = _html.replace(jsonLeft, "");
      _html = _html.replace(jsonRight, "");
      const _jsonData = processHeaderData(_html);
      _headerDataJson = _jsonData;
    }
  });
}
function processHeaderData(_jsonData) {
  const _json = JSON.parse(_jsonData);
  $console.log(_json);
  return _json;
}
function showHeaderData(_dataJson) {
  var messageText =
    _dataJson.countRemark +
    "\n传染源:" +
    _dataJson.infectSource +
    "\n传播途径:" +
    _dataJson.passWay +
    "\n" +
    _dataJson.remark1 +
    "\n" +
    _dataJson.remark2 +
    "\n(" +
    _dataJson.generalRemark +
    ")";
  $ui.alert({
    title: _dataJson.virus,
    message: messageText
  });
}
// 详细数据
function getMainData(_element) {
  const _dataId = "script#getListByCountryTypeService1";
  _element.enumerate({
    selector: _dataId,
    handler: (element, _idx) => {
      var _html = element.string;
      console.log(_html);
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
  $console.log(_html);
  const _json = JSON.parse(_html);
  jsonData = _json;
  _mainDataJson = _json;
  for (x in _json) {
    const _item = _json[x];
    proList.push(_item.provinceShortName);
  }
  $console.log(proList);
  return proList;
}

function push2List(_listData) {
  $ui.push({
    props: {
      title: "各省数据"
    },
    views: [
      {
        type: "list",
        props: {
          data: _listData
        },
        layout: $layout.fill,
        events: {
          didSelect: function(_sender, indexPath, _data) {
            const _idx = indexPath.row;
            showProInfo(_idx);
          }
        }
      }
    ]
  });
}

function showProInfo(_idx) {
  const _jsonData = _mainDataJson[_idx];
  $console.log(_jsonData);
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
    Date(_jsonData.modifyTime);
  $ui.alert({
    title: _jsonData.provinceShortName,
    message: messageText
  });
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
initMainMenu();
