const express = require('express');
const { auth } = require('../middleware/auth');
const { manualSummarize, manualGenerateTags } = require('../controllers/documentController');
const { answerQuestion } = require('../controllers/documentController');

const router = express.Router();

router.post('/summarize', auth, manualSummarize);
router.post('/generate-tags', auth, manualGenerateTags);
router.post('/question', auth, (req, res) => {
  res.json({ answer: 'Q&A feature coming soon!' });
});


module.exports = router;

