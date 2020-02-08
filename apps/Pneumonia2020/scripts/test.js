function init() {
    $console.info("test.init");
    const template = {
        props: {
            bgcolor: $color("clear")
        },
        views: [{
            type: "label",
            props: {
                id: "label",
                bgcolor: $color("#474b51"),
                textColor: $color("#abb2bf"),
                align: $align.center,
                font: $font(32)
            },
            layout: $layout.fill
        }]
    };
    $ui.push({
        props: {
            title: $l10n("TOUTIAO")
        },
        views: [{
            type: "list",
            props: {
                template: template,
                data: [{
                        label: {
                            text: "Hello"
                        }
                    },
                    {
                        label: {
                            text: "World"
                        }
                    }
                ]
            },
            layout: $layout.fill,
            events: {
                didSelect: function (_sender, indexPath, _data) {
                    const _idx = indexPath.row;
                    $console.info("indexPath.row:" + indexPath.row);
                }
            }
        }]
    });
}
module.exports = {
    init: init
};