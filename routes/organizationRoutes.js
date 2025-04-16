const express = require('express');
const router = express.Router();
const organizationController = require('../controllers/organizationController');

router.get('/', organizationController.allOrgs)
router.get('/:id', organizationController.specificOrg)
router.delete('/:id', organizationController.deleteOrg)
router.post('/', organizationController.addOrg)

module.exports = router;