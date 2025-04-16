const express = require('express');
const router = express.Router();
const respondentController = require('../controllers/respondentController');

router.get('/:id/retrieve-all', respondentController.retrieveAll);
router.get('/:id/retrieve', respondentController.retrieve);
router.post('/submit', respondentController.submit);
router.put('/:id/set-group-leader', respondentController.setGroupLeader);
router.put('/:id/set-group-number', respondentController.setGroupNumber);
router.delete('/:id/remove', respondentController.remove);

module.exports = router;