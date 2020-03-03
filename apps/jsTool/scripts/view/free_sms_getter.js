let smsApi = require("../api/free_sms_getter.js");
let init = () => {
    $ui.menu({
        items: ["becmd.com"],
        handler: function (title, idx) {
            switch (idx) {
                case 0:
                    smsApi.getBecmdList();
                    break;
            }

        }
    });
};
module.exports = {
    init
};