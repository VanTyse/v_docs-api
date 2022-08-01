const Document = require('../models/document')
const User = require('../models/User')

const getDocuments = async (req, res) => {
    const {userID} = req.user;
    try{
        const documents = await Document.find({$or: [{creator: userID}, {collaborators: userID}]});
        res.status(200).json(documents)
    }catch(error){
        res.status(500).json({error})
    }
}

const updateDocument = async (req, res) => {
    const {userID} = req.user;
    const {id: documentID} = req.params
    const {collaboratorEmail, others} = req.body
    let collaboratorID;
    if (collaboratorEmail){
        const user = await User.findOne({email: collaboratorEmail})
        if (!user)return res.status(500).json({error: {msg : "user for collabo doesn't exist"}})
        const {_id} = user
        collaboratorID = _id
    }
    const updateObject = (collaboratorID) ? {...others, $addToSet: {collaborators: collaboratorID}} : {...others}
    
    try {
        const document = await Document.findOneAndUpdate(
            {documentID, creator: userID}, 
            updateObject, 
            {new: true, runValidators: true}
        )

        res.status(200).json(document)
    } catch (error) {
        res.status(500).json({error})
    }
}
module.exports = {getDocuments, updateDocument}