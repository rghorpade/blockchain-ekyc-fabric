// Importing libraries / files
const common_utility = require('../lib/common_utility');
var request = require('request');
var http = require('http');


// Declaring Storage class
class Storage {
    //  Querying data form the blockchain by passing stream name and key as parameters.
    getMostRecentStreamDatumForKey(callback) {

        request('http://localhost:3000/api/primechain.Category/kyc_code_categories', function (err, result, body) {
            if (result && (result.statusCode === 200 || result.statusCode === 201 || result.statusCode === 401 || result.statusCode === 402 || result.statusCode === 404)) {
                var mydata = JSON.parse(result.body)

                delete mydata["$class"];
                delete mydata["categoryId"];

                callback(null, mydata);

            }

        });
    }



    getKycSubCategories(key, callback) {
        console.log(key);
        request(`http://localhost:3000/api/primechain.${key}/${key}`, function (err, result, body) {
            if (result && (result.statusCode === 200 || result.statusCode === 201 || result.statusCode === 401 || result.statusCode === 402 || result.statusCode === 404)) {
                var mydata = JSON.parse(result.body);

                delete mydata["$class"];
                delete mydata["subCategoryId"];
                console.log(mydata);
                callback(null, mydata);
               
            }

        });
    }

    getAllDocumentDetails(callback) {
        request(`http://localhost:3000/api/primechain.kyc`, function (err, result, body) {
            if (result && (result.statusCode === 200 || result.statusCode === 201 || result.statusCode === 401 || result.statusCode === 402 || result.statusCode === 404)) {
                var mydata = JSON.parse(result.body)

                callback(null, mydata);

            }

        });

    }

    getLatestDocumentById(id, callback) {
        request(`http://localhost:3000/api/primechain.KycDocument/${id}`, function (err, result, body) {
            if (result && (result.statusCode === 200 || result.statusCode === 201 || result.statusCode === 401 || result.statusCode === 402 || result.statusCode === 404)) {
                var mydata = JSON.parse(result.body)

                callback(null, mydata);

            }

        });

    }


    getDocumentById(id, callback){
        request(`http://localhost:3000/api/primechain.Kyc/${id}`, function (err, result, body) {
            if (result && (result.statusCode === 200 || result.statusCode === 201 || result.statusCode === 401 || result.statusCode === 402 || result.statusCode === 404)) {
                var mydata = JSON.parse(result.body)

                callback(null, mydata);

            }

        });

    }

   
    // This function is called from web application to push fromData and files to the blockchain. the file will encrypted using aes-256-gcm algorithm.
    encryptAndUploadFormDataToBlockchain(password, iv, formData, documents = null , callback) {
        let that = this;

        let form_data = {};

        // iterate through all formData object keys and add to form_data
        Object.keys(formData).forEach(function (_key) {
            form_data[_key] = formData[_key];
        });
        // check if documents data object is not empty and has keys/values
        if (documents && Object.keys(documents).length) {
            let documents_hash = {};

            // upload the documents to blockchain by iterating through documents data object keys.
            // As the blockchain api is an async call, create promise objects with success(resolve) / failure(reject) details and assign its references to variable (promises array)
            var promises = Object.keys(documents).map(function (_key) {

                // create new promise which returns success/failure of blockchain api call for uploading the document
                return new Promise(function (resolve, reject) {
                    // console.log(documents)
                    // create document object which needs to be saved in blockchain
                    let document_info = {
                        name: documents[_key].name,
                        mimetype: documents[_key].mimetype,
                        data: common_utility.bin2hex(documents[_key].data)
                    };

                    let document_id = common_utility.generateRandomString(8);

                    // convert the json object to hexadecimal
                    let document_data = common_utility.json2str(document_info);
                    // encrypt the document data
                    let encrypted_document_data = common_utility.encryptiv(document_data, password, iv);

                    let encrypted_document_data_hex = common_utility.json2hex(encrypted_document_data);

                    // publish document data to blockchain
                    // publishDataToBlockchain(document_id, encrypted_document_data_hex, (err, callback) => {

                    // let member_api_url = publisher_data["member_api_url"];
                    let parsed_url = common_utility.parseUrl('http://localhost:3000');

                    let options = {
                        hostname: parsed_url.hostname,
                        port: parsed_url.port,
                        path: '/api/primechain.KycDocument',
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    };

                    let authenticate_req = http.request(options, (authenticate_res) => {
                        let responseString = "";

                        authenticate_res.on('data', (data) => {
                            responseString += data;
                        });

                        authenticate_res.on('end', () => {
                            let result = JSON.parse(responseString);

                            if (result && result["kycDocId"]) {
                                console.log("Hello I am IN")

                                resolve({ documents_hash: result["kycDocId"] })
                            }
                            else {
                                reject(null);
                            }

                        });
                    });

                    let authenticate_req_data = {
                        kycDocId: document_id,
                        data: encrypted_document_data_hex
                    };

                    authenticate_req.write(JSON.stringify(authenticate_req_data));
                    authenticate_req.end();
                });
            });
            // wait till all api calls (promises) for uploading documents in blockchain are proccessed
            Promise.all(promises).then(function (documents_result) {
                // console.log(documents_result)
                // assign the uploaded documents hashes to form data object
                // if (documents_hash && Object.keys(documents_hash).length)
                form_data['document'] = documents_result[0].documents_hash;

                // convert the json object to hexadecimal
                let data = common_utility.json2hex(form_data);

                let parsed_url = common_utility.parseUrl('http://localhost:3000');

                let options = {
                    hostname: parsed_url.hostname,
                    port: parsed_url.port,
                    path: '/api/primechain.Kyc',
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                };

                let authenticate_req = http.request(options, (authenticate_res) => {
                    let responseString = "";

                    authenticate_res.on('data', (data) => {
                        responseString += data;
                    });

                    authenticate_res.on('end', () => {
                        let result = JSON.parse(responseString);

                        if (result) {
                            let data = {
                                document_id: form_data.document
                            }
                            callback(null, data);
                        }
                        else {
                            callback(null, false);
                        }

                    });
                });

                let authenticate_req_data = {
                    "kycId": form_data.cin,
                    "cin": form_data.cin,
                    "category": form_data.kyc_code_categories,
                    "subCategory": form_data.kyc_sub_categories,
                    "description": form_data.metadata,
                    "document": form_data.document

                };
                authenticate_req.write(JSON.stringify(authenticate_req_data));
                authenticate_req.end();

            }).catch((err) => {
                // return error in callback if any of the api call fails
                callback(err, null);
            });
        }
        else {

            callback(null, false);
        }
    }

   
}

module.exports = new Storage();