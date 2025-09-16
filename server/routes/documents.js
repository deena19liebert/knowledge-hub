const express = require('express');
const { auth } = require('../middleware/auth');
const {
  getDocuments,
  createDocument,
  getDocument,
  updateDocument,
  deleteDocument
} = require('../controllers/documentController');

const router = express.Router();

router.get('/', auth, getDocuments);
router.post('/', auth, createDocument);
router.get('/:id', auth, getDocument);
router.put('/:id', auth, updateDocument);
router.delete('/:id', auth, deleteDocument);

module.exports = router;
