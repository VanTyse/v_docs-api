const router = require('express').Router()
const authMiddleWare = require('../middleware/auth')
const {getAllUsers, getSingleUser, deleteUser} = require('../controllers/userControllers')

// router.route('/').get(authMiddleWare, getAllUsers)   ****This might be used in the future****
router.route('/:id').get(getSingleUser).patch(authMiddleWare).delete(authMiddleWare, deleteUser)

module.exports = router