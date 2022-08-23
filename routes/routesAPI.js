const express = require('express');
const router = express.Router();
const cors = require('cors');
const RoomController = require('../controllers/RoomController');
const UserController = require('../controllers/UserController');

// cors
router.use(cors({
    origin: ['http://localhost:8080', 'http://ipv4:8080'],
    methods: 'POST'
}));

router.post('/token', UserController.token);
// email - password

router.post('/messages', RoomController.loadMessages);
// user.id - room.id - first_message

module.exports = router;