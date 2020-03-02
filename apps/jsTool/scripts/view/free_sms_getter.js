let smsApi = require("../api/free_sms_getter.js");
let init = () => {
    $ui.menu({
        items: ["becmd.com"/* , "cnwml.com" */],
        handler: function (title, idx) {
            switch (idx) {
                case 0:
                    smsApi.getBecmdList();
                    break;
                case 1:
                    smsApi.getCnwmlList();
                    break;
            }

        }
    });
};
module.exports = {
    init
};