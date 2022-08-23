const User = require('../models/Users');

class UserController {
    // REGISTRO
    async register (req, res) {
        const erros = {
            email: req.flash('email_error'),
            username: req.flash('username_error'),
            password: req.flash('password_error'),
            internal: req.flash('internal_error')
        }

        const dados = {
            email: req.flash('email'),
            username: req.flash('username'),
            password: req.flash('password')
        }
        res.render('register', { dados, erros });
    }

    async save (req, res) {
        try {
            const { email, username, password } = req.body

            req.flash('email', email);
            req.flash('username', username);
            req.flash('password', password);

            const regName = /^\w{3,16}$/;
            const regMail = /^[\w+.]+@\w+\.\w{2,}(?:\.\w{2})?$/;
            const regPass = /^[\W\w]{8,}$/;

            if (!email || !regMail.test(email)) {
                req.flash('email_error', 'Email inválido ou ausente.');
                res.redirect('/register');
                return
            }
            if (!username || !regName.test(username)) {
                req.flash('username_error', 'Username inválido ou ausente.');
                res.redirect('/register');
                return
            }
            if (!password || !regPass.test(password)) {
                req.flash('password_error', 'Senha inválida ou ausente.');
                res.redirect('/register');
                return
            }
            
            // eu não precisaria retornar o usuário aqui, mas né, só pra garantir.
            const user = await User.register(email, username, password);

            req.session.user = {
                id: user.id,
                username: user.username,
                email: user.email
            }

            res.redirect('/');
        } catch (error) {
            if (error.type && error.msg) {
                req.flash(error.type, error.msg);
                res.redirect('/register');
            } else {
                console.log(error);
                req.flash('internal_error', 'Erro interno, por favor tente novamente mais tarde.');
                res.redirect('/register');
            }
        };
    }
    // LOGIN
    async login (req, res) {
        const erros = {
            email: req.flash('email_error') || undefined,
            password: req.flash('password_error') || undefined,
            internal: req.flash('internal_error') || undefined
        }

        const dados = {
            email: req.flash('email'),
            password: req.flash('password')
        }
        res.render('login', { dados, erros });
    }

    async auth (req, res) {
        try {
            const { email, password } = req.body;

            req.flash('email', email);
            req.flash('password', password);

            if (!email) {
                req.flash('email_error', 'Email inválido.');
                res.redirect('/login');
                return
            }

            if (!password) {
                req.flash('password_error', 'Senha inválida.');
                res.redirect('/login');
                return
            }

            const user = await User.login(email, password);

            req.session.user = {
                id: user.id,
                username: user.username,
                email: user.email
            }

            res.redirect('/');
        } catch (error) {
            if (error.type && error.msg) {
                req.flash(error.type, error.msg);
                res.redirect('/login');
            } else {
                console.log(error);
                req.flash('internal_error', 'Erro interno, por favor tente novamente mais tarde.');
                res.redirect('/login');
            }
        }
    }

    async logout (req, res) {
        req.session.destroy();
        res.redirect('/login');
    }

    async token (req, res) {
        try {
            const { email, password } = req.body;
        
            const user = await User.findByMail(email);

            if (!user) {
                throw { code: 'Usuário não encontrado.', no: 404 };
            }

            const token = await User.genToken(user.id, email, user.username, user.password, password);

            res.status(200);
            res.json({ token });

        } catch (error) {
            if (error.no) {
                res.status(error.no);
                res.json({ err: error.code });
            } else {
                res.status(500);
                res.json({ err: 'Internal Error.' });
                console.log(error)
            }
        }
    }
}

module.exports = new UserController();