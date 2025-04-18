const express = require('express');
const router = express.Router();
const attributeController = require('../controllers/attributeController');

router.put('/:orgId/attributes/:attrId/update-rule', attributeController.updateRule);
router.put('/:orgId/attributes/:attrId/update-priority', attributeController.updatePriority);

module.exports = router;