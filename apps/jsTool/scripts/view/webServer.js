let port = 9999,
    dir = "./.output/webServer/";
let init = () => {
    const server = $server.start({
        port: port, // port number
        path: dir, // script root path
        handler: () => {}
    });
    server.listen({
        didStart: server => {
            $delay(1, () => {
                $app.openURL(`http://localhost:${port}`);
            });
        },
        didConnect: server => {},
        didDisconnect: server => {},
        didStop: server => {},
        didCompleteBonjourRegistration: server => {},
        didUpdateNATPortMapping: server => {}
    });
    var handler = {};
    handler.response = request => {
        var method = request.method;
        var url = request.url;
        return {
            type: "data", // default, data, file, error
            props: {
                html: "<html><body style='font-size: 300px'>Hello!</body></html>"
                // json: {
                //   "status": 1,
                //   "values": ["a", "b", "c"]
                // }
            }
        };
    };
    server.addHandler(handler);
    $ui.push({
        props: {
            title: ""
        },
        views: [{
            type: "list",
            props: {
                data: [{
                    title: "信息",
                    rows: [
                        `根目录：${dir}`,
                        `端口：${port}`
                    ]
                }, {
                    title: "菜单",
                    rows: ["关闭服务器"]
                }]
            },
            layout: $layout.fill,
            events: {
                didSelect: function (_sender, indexPath, _data) {
                    const section = indexPath.section;
                    const row = indexPath.row;
                    if (section == 1 && row == 0) {
                        server.stop();
                        $ui.toast("已经停止服务器");
                    }
                }
            }
        }]
    });
};

module.exports = {
    init
};