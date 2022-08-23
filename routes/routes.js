const express = require('express');
const router = express.Router();

const UserAuth = require('../middlewares/UserAuth');
const UserController = require('../controllers/UserController');
const RoomController = require('../controllers/RoomController');
const HomeController = require('../controllers/HomeController');

router.get('/', UserAuth, HomeController.home);

router.get('/room/:id', UserAuth, RoomController.room);

router.get('/register', UserController.register);

router.post('/save/user', UserController.save);

router.get('/login', UserController.login);

router.post('/authenticate', UserController.auth);

router.get('/logout', UserAuth, UserController.logout);

router.post('/save/room', UserAuth, RoomController.create);

router.post('/edit/room', RoomController.update);


module.exports = router;