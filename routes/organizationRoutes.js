const express = require('express');
const router = express.Router();
const organizationController = require('../controllers/organizationController');

router.get('/:id/retrieve-all', organizationController.retrieveAll)
router.get('/:id/retrieve', organizationController.retrieve)
router.delete('/:id/remove', organizationController.remove)
router.post('/create', organizationController.create)
router.get('/:id/get-groups', organizationController.getGroups)
router.get('/:id/get-groups-availability', organizationController.groupsAvailability)
router.get('/:id/export-to-csv', organizationController.exportToCsv)

module.exports = router;