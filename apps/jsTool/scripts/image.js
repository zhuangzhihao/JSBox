function docScan() {
    $photo.scan({
        handler: data => {
            $console.info(data);
            if (data.status) {
                const resultList = data.results;
                if (resultList.length > 0) {
                    var imageDataList = [];
                    for (i in resultList) {
                        imageDataList.push(resultList[i].png)
                    }
                    $ui.push({
                        props: {
                            title: $l10n("SCAN_SUCCESS")
                        },
                        views: [{
                            type: "list",
                            props: {
                                data: ["预览全部图片", "保存全部图片"]
                            },
                            layout: $layout.fill,
                            events: {
                                didSelect: function (_sender, indexPath, _data) {
                                    switch (indexPath.row) {
                                        case 0:
                                            $quicklook.open({
                                                list: imageDataList
                                            });
                                            break;
                                        case 1:
                                            break;
                                        default:
                                    }
                                }
                            }
                        }]
                    });
                } else {
                    $ui.alert({
                        title: $l10n("SCAN_FAILED"),
                        message: "系统返回0个结果",
                    });
                }
            } else {
                $ui.alert({
                    title: $l10n("SCAN_FAILED"),
                    message: data.error.description,
                });
            }
        }
    });

}

function init() {
    $ui.push({
        props: {
            title: $l10n("IMAGE")
        },
        views: [{
            type: "list",
            props: {
                data: [$l10n("SCAN_DOCUMENTS")]
            },
            layout: $layout.fill,
            events: {
                didSelect: function (_sender, indexPath, _data) {
                    switch (indexPath.row) {
                        case 0:
                            docScan();
                            break;
                    }
                }
            }
        }]
    });
}
module.exports = {
    init: init
};