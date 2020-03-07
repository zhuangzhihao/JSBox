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
    });
};
let qqBrowserOpen = url => {
    $app.openBrowser({
        type: 10003,
        url: url
    });
};
let firefoxBrowserOpen = url => {
    $app.openBrowser({
        type: 10002,
        url: url
    });
};
let acfunVideo = vid => {
    $app.openURL(`acfun://detail/video/${vid}`);
};
let safariPreview = (url) => {
    $safari.open({
        url: url
    });
};
let safariReadMode = (url, handler) => {
    $safari.open({
        url: url,
        entersReader: true,
        handler: handler
    });
};
let safariAddReadingItem = (url, title, previewText) => {
    $safari.addReadingItem({
        url: url,
        title: title, // Optional
        preview: previewText // Optional
    });
};
let avplayerVideo = url => {
    $app.openURL(`AVPlayer://${$text.URLEncode(url)}`);
};
let nplayerVideo = url => {
    $app.openURL(`nplayer-${url}`);
};
let documentsOpen = url => {
    $app.openURL(`r${url}`);
};
module.exports = {
    alookBrowserOpen,
    chromeBrowserOpen,
    qqBrowserOpen,
    alookBrowserDownload,
    firefoxBrowserOpen,
    acfunVideo,
    safariReadMode,
    safariAddReadingItem,
    avplayerVideo,
    nplayerVideo,
    documentsOpen,
    safariPreview
};