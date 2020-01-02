var siteList = [];
var siteItemList = [];
const cacheId = {
  siteList: "SITE_LIST",
  siteInfo: "SITE_INFO_"
};
function init() {
  const siteListCache = getCache(cacheId.siteList);
  if (siteListCache == undefined) {
    const urlSiteList = "https://www.tophub.fun:8080/GetType";
    $console.log("siteList使用在线数据");
    $http.get({
      url: urlSiteList,
      handler: function(resp) {
        const mData = resp.data;
        setCache(cacheId.siteList, mData);
      }
    });
  } else {
    $console.log("siteList使用缓存数据");
    checkSiteList(siteListCache);
  }
}
// 处理站点列表数据
function checkSiteList(siteListData) {
  if (siteListData.Code == 0) {
    siteList = siteListData.Data;
    if (siteList.length == 0) {
      $ui.error("空白列表");
      $cache.remove(cacheId.siteList);
    } else {
      var itemTitleList = [];
      for (var a = 0; a < siteList.length; a++) {
        const thisItem = siteList[a];
        itemTitleList.push(thisItem.title);
      }
      showSiteList(itemTitleList);
    }
  } else {
    $ui.error(siteListData.Message);
    $cache.remove(cacheId.siteList);
  }
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
            getSiteInfo(selectSite.id);
          }
        }
      }
    ]
  });
}

// 获取站点内容
function getSiteInfo(siteId) {
  siteItemList = [];
  const cacheSiteId = cacheId.siteInfo + siteId;
  const siteInfoCache = getCache(cacheSiteId);
  if (siteInfoCache == undefined) {
    const urlSiteInfo =
      "https://www.tophub.fun:8080/GetAllInfoGzip?id=" + siteId.toString();
    $http.get({
      url: urlSiteInfo,
      handler: function(resp) {
        const itemListData = resp.data;
        setCache(cacheSiteId, itemListData);
        $console.log("siteInfo使用在线数据");
        checkSiteInfo(itemListData, siteId);
      }
    });
  } else {
    $console.log(cacheSiteId + ":" + JSON.stringify(siteInfoCache));
    $console.log("siteInfo使用缓存数据");
    checkSiteInfo(siteInfoCache, siteId);
  }
}
// 处理站点内容数据
function checkSiteInfo(siteInfoData, siteId) {
  $console.log(siteInfoData);
  const cacheSiteId = cacheId.siteInfo + siteId;
  if (siteInfoData.Code == 0) {
    siteItemList = siteInfoData.Data;
    if (siteItemList.length == 0) {
      $ui.error("空白列表");
      $cache.remove(cacheSiteId);
    } else {
      var itemTitleList = [];
      for (var a = 0; a < siteItemList.length; a++) {
        const thisItem = siteItemList[a];
        itemTitleList.push(thisItem.Title);
      }
      showSiteItemList(itemTitleList);
    }
  } else {
    $ui.error(siteInfoData.Message);
    $cache.remove(cacheSiteId);
  }
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
            const itemUrl = selectItem.Url;
            $app.openURL(itemUrl);
          }
        }
      }
    ]
  });
}
// 读取缓存
function setCache(cacheId, cacheContent) {
  $cache.set(cacheId, cacheContent);
}
// 保存缓存
function getCache(cacheId) {
  const mCache = $cache.get(cacheId);
  console.log(mCache);
  return mCache;
}
// 开始初始化
init();
