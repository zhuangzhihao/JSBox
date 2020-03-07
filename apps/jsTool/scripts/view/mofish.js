let appScheme = require("../api/app_scheme.js");
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
var isFirstInit = false;

function init(firstInit = false) {
  isFirstInit = firstInit;
  $ui.menu({
    items: ["最新", "分类"],
    handler: function (title, idx) {
      switch (idx) {
        case 0:
          getNewest();
          break;
        case 1:
          getAllType();
          break;
      }
    }
  });
}
let getNewest = () => {
  $ui.loading(true);
  const urlAllType = "https://www.tophub.fun:8888/GetRandomInfo?time=0&is_follow=0";
  $http.get({
    url: urlAllType,
  }).then(function (resp) {
    const data = resp.data;
    if (data) {
      if (data.Code == 0) {
        const postList = data.Data;
        if (postList.length > 0) {
          $ui.loading(false);
          const listView = {
            props: {
              title: "最新"
            },
            views: [{
              type: "list",
              props: {
                data: postList.map(c => `[${c.type}]${c.Title}`),
                menu: {
                  title: "菜单",
                  items: [{
                    title: "使用[简悦 · 阅读器]打开",
                    symbol: "book.circle",
                    handler: (sender, indexPath) => {
                      $clipboard.copy({
                        "text": postList[indexPath.row].Url,
                        "ttl": 30,
                        "locally": true
                      });
                      $addin.run("简悦 · 阅读器");
                    }
                  }]
                }
              },
              layout: $layout.fill,
              events: {
                didSelect: function (sender, indexPath, data) {
                  const webUrl = postList[indexPath.row].Url;
                  appScheme.safariReadMode(webUrl.startsWith("//") ? `https:${webUrl}` : webUrl);
                }
              }
            }]
          };
          isFirstInit ?
            $ui.render(listView) :
            $ui.push(listView);
        } else {
          $ui.loading(false);
          $ui.alert({
            title: "错误",
            message: "空白内容",
          });
        }
      } else {
        $ui.loading(false);
        $ui.alert({
          title: "错误",
          message: data.Message,
        });
      }
    } else {
      $ui.loading(false);
      $ui.alert({
        title: "错误",
        message: "空白数据",
      });
    }
  });
};
// 按分类获取站点列表
function getAllType() {
  $ui.loading(true);
  $http.get({
    url: "https://www.tophub.fun:8888/GetAllType",
  }).then(function (resp) {
    const siteCatListData = resp.data;
    if (siteCatListData.Code == 0) {
      const catDataList = siteCatListData.Data;
      $ui.loading(false);
      if (catDataList) {
        $ui.toast("分类列表");
        $console.info(Object.keys(catDataList));
        const listView = {
          props: {
            title: "站点分类"
          },
          views: [{
            type: "list",
            props: {
              data: Object.keys(catDataList)
            },
            layout: $layout.fill,
            events: {
              didSelect: function (sender, indexPath, data) {
                const newSiteList = catDataList[data];
                if (newSiteList.length > 0) {
                  // 显示分类内容
                  $ui.push({
                    props: {
                      title: newSiteList[0].type
                    },
                    views: [{
                      type: "list",
                      props: {
                        data: newSiteList.map(s => s.name)
                      },
                      layout: $layout.fill,
                      events: {
                        didSelect: function (sender, indexPath, data) {
                          showNewSiteData(newSiteList[indexPath.row]);
                        }
                      }
                    }]
                  });
                } else {
                  $ui.error("这个分类没有站点");
                }
              }
            }
          }]
        };
        isFirstInit ?
          $ui.render(listView) :
          $ui.push(listView);
      } else {
        $ui.loading(false);
        $ui.error("空白分类列表");
      }
    } else {
      $ui.loading(false);
      $ui.error(siteCatListData.Message);
    }
  });
}
// 新版站点内容
let showNewSiteData = (newSiteInfo) => {
  $http.get({
    url: `https://www.tophub.fun:8888/v2/GetAllInfoGzip?page=0&id=${newSiteInfo.id}`
  }).then(function (resp) {
    const newSiteData = resp.data;
    if (newSiteData.Code == 0) {
      const contentList = newSiteData.Data.data;
      if (contentList.length > 0) {
        $ui.push({
          props: {
            title: newSiteInfo.name
          },
          views: [{
            type: "list",
            props: {
              data: contentList.map(c => c.Title),
              menu: {
                title: "菜单",
                items: [{
                  title: "使用[简悦 · 阅读器]打开",
                  symbol: "book.circle",
                  handler: (sender, indexPath) => {
                    $clipboard.copy({
                      "text": contentList[indexPath.row].Url,
                      "ttl": 30,
                      "locally": true
                    });
                    $addin.run("简悦 · 阅读器");
                  }
                }]
              }
            },
            layout: $layout.fill,
            events: {
              didSelect: function (sender, indexPath, data) {
                const webUrl = contentList[indexPath.row].Url;
                appScheme.safariReadMode(webUrl.startsWith("//") ? `https:${webUrl}` : webUrl);
              }
            }
          }]
        });
      } else {
        $ui.error("空白内容");
      }
    } else {
      $ui.error(newSiteData.Message);
    }
  });
};

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
    $console.info(mCache);
    if (mCache != undefined) {
      if (
        lastCacheTime != undefined &&
        getNowUnixTime() - lastCacheTime < 3600
      ) {
        return mCache;
      }
    }
  }
  return undefined;
}

function getNowUnixTime() {
  return Math.floor(Date.now() / 1000);
}

// 开始初始化
module.exports = {
  init
};