function init() {
    console.info("test.init");
    const template = {
        props: {
            bgcolor: $color("clear")
        },
        views: [{
            type: "list",
            props: {
                id: "list"
            },
            layout: $layout.fill,
            events: {
                didSelect: function (_sender, indexPath, _data) {
                    const _idx = indexPath.row;
                    //showProvincesInfo(_provincesList[_idx]);
                }
            }
        }]
    };
    $ui.push({
        props: {
            title: $l10n("TOUTIAO")
        },
        views: [{
            type: "list",
            props: {
                data: [{
                        title: "Section 0",
                        rows: ["0-0", "0-1", "0-2"]
                    },
                    {
                        title: "Section 1",
                        rows: ["1-0", "1-1", "1-2"]
                    }
                ]
            },
            layout: $layout.fill,
            events: {
                didSelect: function (_sender, indexPath, _data) {
                    const _idx = indexPath.row;
                    indexPath.title;
                    console.info("indexPath.section:" + indexPath.section);
                    console.info("indexPath.row:" + indexPath.row);
                }
            }
        }]
    });
}
module.exports = {
    init: init
};