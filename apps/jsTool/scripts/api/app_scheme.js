let alookBrowserOpen = url => {
    $app.openURL(`Alook://${$text.URLEncode(url)}`);
};
let alookBrowserDownload = url => {
    $app.openURL(`Alook://download/${$text.URLEncode(url)}`);
};
let chromeBrowserOpen = url => {
    $app.openBrowser({
        type: 10000,
        url: url
    })
};
let qqBrowserOpen = url => {
    $app.openBrowser({
        type: 10003,
        url: url
    })
};
let firefoxBrowserOpen = url => {
    $app.openBrowser({
        type: 10002,
        url: url
    })
};

module.exports = {
    alookBrowserOpen,
    chromeBrowserOpen,
    qqBrowserOpen,
    alookBrowserDownload,
    firefoxBrowserOpen
};