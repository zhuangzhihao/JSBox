let port = 9999,
    dir = "./.output/webServer/";
let initServer = () => {
    $http.startServer({
        port: port, // port number
        path: dir, // script root path
        handler: function (result) {
            var url = result.url
            $console.info(url);
        }
    })
};
let initView = (dir, port) => {
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

                }
            }
        }]
    });
};
let init = () => {
    if ($file.exists(dir)) {
        if (!$file.isDirectory(path)) {

        }
    }
};