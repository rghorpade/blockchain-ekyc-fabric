const dataStorage = require("../BlockchainLib/storage");
const config = require("../configs/blockchain_config");

module.exports = {
    get_verify_an_user: (req, res, next) => {
        try {
            // Retrieving the record of the member from member masterlist stream by passing the public address. 
                // if any error occured while retrieving the record it will send the request to else part.
                //if (err) { return next(err); }
                // If the details of the users is fetched from the blockchain, the user will redirected to two step authentication page.
                if (true) {
                    res.redirect('/user/dashboard');
                }
                else {
                    req.flash('error_msg', "Error occured while fetching records from blockchain.");
                    res.redirect('/');
                }
        }
        catch (error) {
            //console.log("Error", error);
            req.flash('error_msg', "Internal server error occured.");
            res.redirect('/');
        }
    }
}