const biliApi = require("./api/api_bili.js");
const debugVid = "89881084";

function init() {
    $input.text({
        type: $kbType.number,
        autoFontSize: true,
        text: debugVid,
        placeholder: "输入视频id(不包含av)",
        handler: function (text) {
            if (text.length > 0) {
                biliApi.getVideoInfo(text);
            } else {
                $ui.error("空白id");
            }
        }
    });
}
module.exports = {
    init: init,
};