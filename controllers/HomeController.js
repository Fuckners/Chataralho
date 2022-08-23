const User = require('../models/Users');

class HomeController {
    async home (req, res) {
        const rooms = await User.findRooms(req.session.user.id);

        res.render('index', { user: req.session.user, rooms });
    }
}

module.exports = new HomeController();
