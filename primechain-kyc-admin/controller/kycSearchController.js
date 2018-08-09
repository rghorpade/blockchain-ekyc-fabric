const dataStorage = require('../BlockchainLib/storage');
const formModel = require('../model/form');
const config = require('../configs/blockchain_config');
const whiteListModel = require('../model/whitelist');

module.exports = {
    get_search_record_page: (req, res, next) => {
        res.render('kyc_corporate_search_record');
    },

    post_search_record: (req, res, next) => {
        try {
            var kycId = req.body.cin;
            
            let search_records = [];
            dataStorage.getDocumentById(kycId,(err, result) => {
                if(err){
                    return next(err);
                }
                if(result){
                    
                    res.render("view_record_details", { data: result })
                }
                else{
                    res.render("view_record_details")                    
                }
            });
            

           
        } catch (error) {
            // If any error occured in the try block the catch block will handle the request.
            res.render('view_record_details', { error_msg: error });
        }
    }
}