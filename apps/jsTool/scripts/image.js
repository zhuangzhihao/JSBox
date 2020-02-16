function docScan() {
    $photo.scan({
        handler: data => {
            $console.info(data);
            if (data.status) {
                const resultList = data.results;
                if (resultList.length > 0) {
                    var imageTitleList = [];
                    for (i in resultList) {
                        imageTitleList.push($l10n("IMAGE"));
                    }
                    $ui.push({
                        props: {
                            title: $l10n("SCAN_SUCCESS")
                        },
                        views: [{
                            type: "list",
                            props: {
                                data: imageTitleList
                            },
                            layout: $layout.fill,
                            events: {
                                didSelect: function (_sender, indexPath, _data) {
                                    const thisImage = resultList[indexPath.row];
                                    $quicklook.open(thisImage.png);
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