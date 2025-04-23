const express = require('express');
const router = express.Router();
const organizerController = require('../controllers/organizerController');

router.post('/retrieve', organizerController.retrieve);
router.post('/register', organizerController.register);
router.put('/:id/update', organizerController.update);

module.exports = router;