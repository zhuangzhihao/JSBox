var siteList = [];
var siteItemList = [];
function init() {
  const urlSiteList = "https://www.tophub.fun:8080/GetType";
  $http.get({
    url: urlSiteList,
    handler: function(resp) {
      const mData = resp.data;
      //$ui.alert(m_data);
      if (mData.Code == 0) {
        siteList = mData.Data;
        console.log(siteList.length);
        if (siteList.length == 0) {
          $ui.error("空白列表");
        } else {
          var itemTitleList = [];
          for (var a = 0; a < siteList.length; a++) {
            const thisItem = siteList[a];
            itemTitleList.push(thisItem.title);
          }
          showSiteList(itemTitleList);
          console.log(itemTitleList.toString());
        }
      } else {
        $ui.error(mData.Message);
      }
    }
  });
}

// 渲染站点列表
function showSiteList(itemList) {
  $ui.render({
    views: [
      {
        type: "list",
        props: {
          data: itemList
        },
        layout: $layout.fill,
        events: {
          didSelect: function(sender, indexPath, data) {
            const mIndex = indexPath.row;
            const selectSite = siteList[mIndex];
            console.log(selectSite);
            getSiteInfo(selectSite.id);
          }
        }
      }
    ]
  });
  $ui.toast("加载列表成功");
}

// 获取站点内容
function getSiteInfo(siteId) {
  siteItemList = [];
  const urlSiteInfo =
    "https://www.tophub.fun:8080/GetAllInfoGzip?id=" + siteId.toString();
  console.log(urlSiteInfo);
  $http.get({
    url: urlSiteInfo,
    handler: function(resp) {
      const itemListData = resp.data;
      //      $ui.alert(itemListData);
      if (itemListData.Code == 0) {
        siteItemList = itemListData.Data;
        console.log(siteItemList.length);
        if (siteItemList.length == 0) {
          $ui.error("空白列表");
        } else {
          $ui.toast("加载列表成功");
          var itemTitleList = [];
          for (var a = 0; a < siteItemList.length; a++) {
            const thisItem = siteItemList[a];
            itemTitleList.push(thisItem.Title);
          }
          showSiteItemList(itemTitleList);
          console.log(itemTitleList.toString());
        }
      } else {
        $ui.error(itemListData.Message);
      }
    }
  });
}
// 渲染站点内容列表
function showSiteItemList(siteItemTitleList) {
  $ui.render({
    views: [
      {
        type: "list",
        props: {
          data: siteItemTitleList
        },
        layout: $layout.fill,
        events: {
          didSelect: function(sender, indexPath, data) {
            const mIndex = indexPath.row;
            const selectItem = siteItemList[mIndex];
            console.log(selectItem);
            const itemUrl = selectItem.Url;
            console.log(itemUrl);
            $app.openURL(itemUrl);
          }
        }
      }
    ]
  });
  $ui.toast("加载列表成功");
}
// 开始初始化
init();
