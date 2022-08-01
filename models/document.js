const mongoose = require('mongoose')

const documentSchema = new mongoose.Schema({
    documentID : {
        type : String,
        unique : true,
        required : true
    },
    data : Object,
    documentName: {
        type: String,
        required: [true, 'please give the document a name'],
        default: "Untitle Document"
    },
    creator: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: [true, 'please tells us who is creating this document'],
    },
    collaborators: [{
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: [true, 'please tells us who is creating this document']
    }]
}, {timestamps: true})

module.exports = mongoose.model('document', documentSchema)