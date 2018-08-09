const dataStorage = require("../BlockchainLib/storage");
const common_utility = require("../lib/common_utility");
const formModel = require("../model/form");
const config = require("../configs/blockchain_config");

module.exports = {
    get_kyc_corporate_upload_page: (req, res, next) => {
        try {
            dataStorage.getMostRecentStreamDatumForKey((err, cases) => {
                if (err) { return next(err); }
                console.log(cases);
                if (cases) {
                    // Render the view page with parameters
                    res.render("kyc_corporate_upload_record", { cases: cases });
                }
                else {
                    // Render the view page
                    res.render("kyc_corporate_upload_record");
                }
            });
        }
        catch (err) {
            req.flash("error_msg", "Internal server error occured.");
            res.redirect("/");
        }
    },

    get_document_categories_list: (req, res, next) => {
        try {
            let key = Object.keys(req.body);
            // Querying the most recent record which is pushed to the blockchain by passing stream name and key
            dataStorage.getKycSubCategories(key[0], (err, items) => {
                if (err) { return next(err); }
                console.log(items)
                // The response will send back to the ajax with the records which is retreived from blockchain.
                res.json(items);
                res.end();
            });
        }
        catch (error) {
            // If any eror occured the catch block will handle the request.
            res.json(null, { message: error });
            res.end();
        }
    },

    post_kyc_corporate_upload_record: (req, res, next) => {
        try {
            var recorded_data = {};
            var cin = req.body.kyc_cin;
            var kyc_code_categories = req.body.kyc_code_categories;
            var kyc_sub_categories = req.body.kyc_sub_categories;
            var metadata = req.body.kyc_document_metadata;

            if (req.files) {
                // formData which will goes into to the blochain as unecrypted.
                let formData = {
                    "cin": cin,
                    "kyc_code_categories": kyc_code_categories,
                    "kyc_sub_categories": kyc_sub_categories,
                    "metadata": metadata
                };
                // Storing file info in the documents variable.
                let documents = req.files;
                // Generating password by calling a function from common utility file to encrypt the file data
                let password = common_utility.generateRandomString(32);
                // Generating the iv(initialization vector) by calling a function from common utility, is used to passed along with the password. 
                let iv = common_utility.generateRandomString(12);

                // This function will be push the formData and file to the blockchain in their respective streams abd returns txids.
                dataStorage.encryptAndUploadFormDataToBlockchain(password, iv, formData, documents, (err, success) => {
                    if (err) { return next(err); }
                    console.log("success", success);

                    if (success && success["document_id"]) {
                        // checks wheather any file uploaded by user
                        // if (documents && Object.keys(documents).length) {
                        // Creating a model to store following parameters into the database.
                        let newForm = new formModel({
                            cin: cin,
                            document_id: success["document_id"],
                            password: password,
                            iv: iv
                        });
                        // Calling the database to save the record in the database.
                        formModel.createForm(newForm, (err, is_saved) => {
                            if (err) { return next(err); }

                            if (is_saved) {
                                // flash is used to display the flash message in the view page.
                                req.flash("success_msg", "Document has been successfully uploaded.");
                                res.redirect("/user/kyc_corporate_upload_record");
                            }
                            else {
                                // flash is used to display the flash message in the view page.
                                req.flash("error_msg", "Unbale to store form transaction details in database.");
                                res.redirect("/user/kyc_corporate_upload_record");
                            }
                        });

                    } else {
                        // flash is used to display the flash message in the view page.
                        req.flash("error_msg", "Unable to fetch document details.");
                        res.redirect("/user/kyc_corporate_upload_record");
                    }
                   
                });
            } else {
                req.flash("error_msg", "Please upload a file");
                res.redirect("/user/kyc_corporate_upload_record");
            }

        } catch (error) {
            // flash is used to display the flash message in the view page.
            req.flash("error_msg", "Internal server error occured, please try after sometime.");
            res.redirect("/user/kyc_corporate_upload_record");
        }
    }
}