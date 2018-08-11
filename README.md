# Blockchain-eKYC (Hyperledger Fabric)

Blockchain-eKYC (Hyperledger Fabric) is a permissioned Hyperledger Sawtooth blockchain for sharing corporate KYC records. The records are stored in the blockchain in an encrypted form and can only be viewed by entities that have been "whitelisted" by the issuer entity. This ensures data privacy and confidentiality while at the same time ensuring that records are shared only between entities that trust each other. 

**Blockchain-eKYC (Hyperledger Fabric) is maintained by Sahil Malik, Blockchain Developer, Primechain Technologies Pvt. Ltd.**


## A. Installation and setup

To setup please refer to instructions here:

https://github.com/Primechain/blockchain-ekyc-fabric/blob/master/setup_Linux.txt

## B. Third party software and components

Third party software and components: bcryptjs, body-parser, connect-flash, cookie-parser, express, express-fileupload, express-handlebars, express-session, express-validator, mongodb, mongoose, multichain, passport, passport-local, sendgrid/mail.

## C. License
Blockchain-eKYC (Hyperledger Sawtooth) is available under Apache License 2.0. This license does not extend to third party software and components.

## D. List of features

1. Upload records: Records can be uploaded in any format (doc, pdf, jpg etc.) upto a maximum of 10 MB per record. These records are automatically encrypted using AES symmetric encryption algorithm and the decryption keys are automatically stored in the exclusive web application of the of the uploading entity. While uploading, the following information needs to be entered - the Corporate Identity Number (CIN) of the entity to which this document relates, the document category and sub-category, a brief description and the price of the document. 

2. Searching for records based on CIN of the relevant companies and viewing relevant metadata. 

3. Search for records uploaded by your entity.

## E. How it works?

![Dashboard](http://www.primechaintech.com/images/open_source/1_user_dashboard.png)

### E1. Uploading a record 
When a new record is uploaded to the blockchain, the following information must be provided:

1. Corporate Identity Number (CIN) of the entity to which this document relates. This information is stored in the blockchain in plain text / un-encrypted form and cannot be changed.
2. Document category. This information is stored in the blockchain in plain text / un-encrypted form and cannot be changed.
Document type. This information is stored in the blockchain in plain text / un-encrypted form and cannot be changed.
3. A brief description of the document - This information is stored in the blockchain in plain text / un-encrypted form and cannot be changed.
4. The document - This document can be in pdf, word, excel, image or other formats and is stored in the blockchain in AES encrypted form and cannot be changed. The decryption key is stored in the relevant bank's dedicated database and does NOT go into the blockchain. 

When the above information is provided, this is what happens:

1. Hash of the uploaded file is calculated.
2. The file is digitally signed using the private key of the uploader bank.
3. File Data is encrypted using AES symmetric encryption.
4. The encrypted file is converted into hexadecimal.
5. The non-encrypted data is converted into hexadecimal.
6. Hexadecimal content is uploaded to the blockchain.

Sample output:

    {
      file_hash: 84a9ceb1ee3a8b0dc509dded516483d1c4d976c13260ffcedf508cfc32b52fbe
      file_txid: 2e770002051216052b3fdb94bf78d43a8420878063f9c3411b223b38a60da81d
      data_txid: 85fc7ff1320dd43d28d459520fe5b06ebe7ad89346a819b31a5a61b01e7aac74
      signature: IBJNCjmclS2d3jd/jfepfJHFeevLdfYiN22V0T2VuetiBDMH05vziUWhUUH/tgn5HXdpSXjMFISOqFl7JPU8Tt8=
      secrect_key: ZOwWyWHiOvLGgEr4sTssiir6qUX0g3u0
      initialisation_vector: FAaZB6MuHIuX
    }

![Uploading a record](http://www.primechaintech.com/images/open_source/2_upload_record.png)

### E2. Searching for and downloading records

![Searching for a record](http://www.primechaintech.com/images/open_source/3_search_record.png)

![Searching for a record](http://www.primechaintech.com/images/open_source/4_search_record.png)

