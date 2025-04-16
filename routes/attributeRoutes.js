const express = require('express');
const router = express.Router();
const attributeController = require('../controllers/attributeController');

router.put('/:attributeId/rule', attributeController.updateRule);
router.put('/:attributeId/priority', attributeController.updatePriority)

module.exports = router;