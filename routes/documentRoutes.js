const router = require('express').Router()
const {getDocuments, updateDocument} = require('../controllers/documentControllers');
const authMiddleware = require('../middleware/auth')
router.get('/', authMiddleware, getDocuments)
router.patch('/:id', authMiddleware, updateDocument)

module.exports = router