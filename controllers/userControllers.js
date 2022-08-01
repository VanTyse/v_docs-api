const User = require('../models/User');

const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({});
        res.status(200).json(users)   
    } catch (error) {
        res.status(400).json({error});
    }
}

const getSingleUser = async (req, res) => {
    const {id} = req.params;
    try {
        const user = await User.findOne({_id : id});
        res.status(200).json(user)   
    } catch (error) {
        res.status(400).json({msg : "Couldn't get user"});
    }
}



const deleteUser = async (req, res) => {
    const {userID} = req.user;
    const {id} = req.params

    if (userID !== id){
        return res.status(400).json({msg : "user id doesn't match"})
    }

    try {
       const deletedUser = await User.findOneAndDelete({_id : userID})
        res.status(200).json({msg : "deleted"}) 
    } catch (error) {
        res.status(400).json({msg : "Couldn't update"});
    }
}

module.exports = {getAllUsers, getSingleUser, deleteUser}