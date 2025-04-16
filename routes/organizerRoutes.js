const express = require('express');
const router = express.Router();
const organizerController = require('../controllers/organizerController');

router.get('/retrieve', organizerController.retrieve);
router.post('/register', organizerController.register);
router.put('/:id/update', organizerController.update);

module.exports = router;