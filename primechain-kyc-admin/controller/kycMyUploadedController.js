const async = require('async');
const formModel = require('../model/form');
const dataStorage = require('../BlockchainLib/storage');
const config = require('../configs/blockchain_config');


module.exports = {
    get_my_uploaded_records: (req, res, next) => {
        try {
            let form_data_details = [];

            dataStorage.getAllDocumentDetails((err, form_data) => {
                if (err) { return next(err); }
                async.forEach(form_data, (item, callback) => {
                    if (item) {
                        dataStorage.getMostRecentStreamDatumForKey((err, kycCategories) => {
                            if (err) {
                                return callback(err, null);
                            }
                            if (kycCategories) {
                                dataStorage.getKycSubCategories(item["category"], (err, subCategory) => {
                                    if (err) {
                                        return callback(err, null);
                                    } if (subCategory) {
                                        form_data_details.push({ "cin": item["cin"], "categories": kycCategories[item["category"]], "sub_categories": subCategory[item["subCategory"]], "metadata": item["description"], "document": item["document"] });
                                        callback();
                                    } else {
                                        callback();
                                    }

                                })

                            } else {
                                callback();
                            }

                        })

            }
                    else {
        callback();
    }
}, (err) => {
    if (err) { return next(err); }

    res.render("kyc_corporate_my_uploaded_records", { data: form_data_details })
})

            });
        }
        catch (error) {
    res.render('kyc_corporate_my_uploaded_records', { error_msg: error });
}
    }
}