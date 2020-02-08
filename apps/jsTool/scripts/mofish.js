var catList = [];
var siteList = [];
var siteItemList = [];
var siteTitle = "";
const isCache = false;
const listViewId = "listView_main";
const cacheId = {
  siteList: "SITE_LIST",
  siteInfo: "SITE_INFO_",
  lastCacheTime: "LAST_CACHE_TIME"
};

function init() {
  $ui.loading("加载中...");
  getType();
}
// 旧版获取站点列表
function getType() {
  const siteListCache = getCache(cacheId.siteList);
  if (!isCache || siteListCache == undefined) {
    const urlSiteList = "https://www.tophub.fun:8080/GetType";
    $http.get({
      url: urlSiteList,
      handler: function (resp) {
        const mData = resp.data;
        $console.log(
          "siteList: " + mData.Code.toString() + " | " + mData.Message
        );
        setCache(cacheId.siteList, mData);
        $ui.loading(false);
        checkSiteList(mData);
      }
    });
  } else {
    $ui.loading(false);
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
      $console.log(itemTitleList);
      pushSiteList(itemTitleList);
    }
  } else {
    $ui.error(siteListData.Message);
    $cache.remove(cacheId.siteList);
  }
}
// 渲染站点列表
function pushSiteList(itemList) {
  $ui.push({
    props: {
      id: "listView_index",
      title: "加载完毕"
    },
    views: [{
      type: "list",
      props: {
        data: itemList,
        id: listViewId
      },
      layout: $layout.fill,
      events: {
        didSelect: function (sender, indexPath, data) {
          const mIndex = indexPath.row;
          const selectSite = siteList[mIndex];
          getSiteInfo(selectSite.id, selectSite.title);
        }
      }
    }]
  });
  //console.log($ui.get("listView_index"));
}
// 按分类获取站点列表
function getAllType() {
  const urlAllType = "https://www.tophub.fun:8888/GetAllType";
  $http.get({
    url: urlAllType,
    handler: function (resp) {
      const mData = resp.data;
      $console.log("newSiteList使用在线数据");
      $ui.loading(false);
      showNewSiteList(mData);
    }
  });
}
// 处理站点列表数据
function showNewSiteList(siteCatListData) {
  if (siteCatListData.Code == 0) {
    catList = siteCatListData.Data;
    if (catList.length == 0) {
      $ui.error("空白列表");
    } else {
      var itemTitleList = [];
      for (x in catList) {
        $console.log(x);
        itemTitleList.push();
      }
      $console.log(siteCatListData);
      pushSiteList(itemTitleList);
    }
  } else {
    $ui.error(siteCatListData.Message);
  }
}
// 渲染站点分类列表
function pushSiteCatList(itemList) {
  $ui.push({
    props: {
      id: "listView_cat",
      title: "站点分类"
    },
    views: [{
      type: "list",
      props: {
        data: itemList,
        id: listViewId
      },
      layout: $layout.fill,
      events: {
        didSelect: function (sender, indexPath, data) {
          const mIndex = indexPath.row;
          const selectSite = catList[mIndex];
          getSiteInfo(selectSite.id, selectSite.title);
        }
      }
    }]
  });
  //$console.log($ui.get("listView_cat"));
}
// 获取站点内容
function getSiteInfo(siteId, title) {
  $ui.loading("加载中...");
  siteItemList = [];
  const cacheSiteId = cacheId.siteInfo + siteId;
  const siteInfoCache = getCache(cacheSiteId);
  if (siteInfoCache == undefined || !isCache) {
    const urlSiteInfo =
      "https://www.tophub.fun:8888/GetAllInfoGzip?id=" + siteId.toString();
    $http.get({
      url: urlSiteInfo,
      handler: function (resp) {
        const itemListData = resp.data;
        setCache(cacheSiteId, itemListData);
        $console.log("siteInfo使用在线数据");
        $ui.loading(false);
        checkSiteInfo(itemListData, siteId, title);
      }
    });
  } else {
    $console.log(cacheSiteId + ":" + JSON.stringify(siteInfoCache));
    $console.log("siteInfo使用缓存数据");
    $ui.loading(false);
    checkSiteInfo(siteInfoCache, siteId, title);
  }
}
// 处理站点内容数据
function checkSiteInfo(siteInfoData, siteId, title) {
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
      //$ui.title=sit
      showSiteItemList(itemTitleList, title);
    }
  } else {
    $ui.error(siteInfoData.Message);
    $cache.remove(cacheSiteId);
  }
}
// 渲染站点内容列表
function showSiteItemList(siteItemTitleList, title) {
  const mPage = {
    props: {
      title: title
    },
    views: [{
      type: "list",
      props: {
        data: siteItemTitleList,
        id: listViewId
      },
      layout: $layout.fill,
      events: {
        didSelect: function (sender, indexPath, data) {
          $ui.preview({
            title: title,
            url: siteItemList[indexPath.row].Url
          });
        }
      }
    }]
  };
  $ui.push(mPage);
}
// 读取缓存
function setCache(thisCacheId, cacheContent) {
  if (isCache) {
    $cache.set(thisCacheId, cacheContent);
    $cache.set(cacheId.lastCacheTime, getNowUnixTime());
  }
}
// 保存缓存
function getCache(thisCacheId) {
  if (isCache) {
    const lastCacheTime = $cache.get(cacheId.lastCacheTime);
    const mCache = $cache.get(thisCacheId);
    console.log(mCache);
    if (mCache !== undefined) {
      if (
        lastCacheTime !== undefined &&
        getNowUnixTime() - lastCacheTime < 3600
      ) {
        return mCache;
      }
    }
  }
  return undefined;
}

function getNowUnixTime() {
  const dateTime = Date.now();
  const timestamp = Math.floor(dateTime / 1000);
  return timestamp;
}

// 开始初始化
module.exports = {
  init: init
};