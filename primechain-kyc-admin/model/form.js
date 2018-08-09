// Importing mongoose library.
const mongoose = require('mongoose');
// Storing mongoose connections to a variable called db.
var db = mongoose.connection;
// Intialising a schema.
var Schema = mongoose.Schema;

// Initializing properties to schema, it stores the details when the form is uploaded by an user.
const formSchema = Schema({
    cin: {
        type: String,
        required: true,
    },
    document_id: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
    },
    iv: {
        type: String,
        required: true,
    }
});

// Exporting the model so that we can access in different files.
module.exports = mongoose.model('form', formSchema);

// Saving the from model properties values in private database.
module.exports.createForm = (newForm, callback) => {
    newForm.save((err, is_saved) => {
        if (err) { return callback(err, null); }
        else { callback(null, true); }
    });
};

module.exports.getEncryptionKeyByDocumentTxid = (document_txid, callback) => {
    let query = { document_id: document_txid };
    db.collection('forms').findOne(query, (err, query_details) => {
        if (err) { return callback(err, null); }
console.log(query_details);
        if (query_details) { return callback(null, query_details); }
        else { return callback(null, false); }
    })
}
