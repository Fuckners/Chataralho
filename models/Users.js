const database = require('../database/database');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const secret = require('../jwt/secret');

class User {

    async findByMail(email) {
        return new Promise(async (resolve, reject) => {
            try {
                const [users] = await database.select().table('users').where({ email });
                resolve(users);
            } catch (error) {
                reject(error);
            }
        })
    }

    async findRooms(id) {
        return new Promise(async (resolve, reject) => {
            try {
                //                           SELECT    rooms.id as id    rooms.name as name    rooms.description as desc       FROM participants    INNER JOIN rooms ON participants.room_id  = rooms.id  WHERE    participants.user_id = 1
                const rooms = await database.select({ 'id': 'rooms.id', 'name': 'rooms.name', 'desc': 'rooms.description' }).table('participants').innerJoin('rooms', 'participants.room_id', 'rooms.id').where({ 'participants.user_id': id });

                resolve(rooms);
            } catch (error) {
                reject(error);
            }
        });
    }

    async register(email, username, password) {
        return new Promise(async (resolve, reject) => {
            try {

                {
                    // verificar se o email já foi cadastrado
                    const user = await this.findByMail(email);
                    if (user) {
                       reject({ type: 'email_error', msg: 'Email já cadastrado' });
                    }
                }

                // gerar hash para a senha
                const salt = await bcrypt.genSalt(10);
                const hash = await bcrypt.hash(password, salt);

                // cadastrando dados no database
                await database.insert({ email, username, password: hash }).table('users');

                // pegando dados do usuário no database.
                const user = await this.findByMail(email);

                if (!user) {
                    reject({ type: 'internal_error', msg: 'Usuário não foi encontrado após o cadastro.' });
                }

                resolve(user);

            } catch(error) {
                reject(error);
            }
        });
    }

    async login(email, password) {
        return new Promise(async (resolve, reject) => {
            try {
                const user = await this.findByMail(email);

                if (!user) {
                    reject({ type: 'email_error', msg: 'Este email não está cadastrado no nosso banco de dados.' });
                }

                const valid = await bcrypt.compare(password, user.password);
    
                if (!valid) {
                    reject({ type: 'password_error', msg: 'Senha incorreta.' });
                } else {
                    resolve(user);
                }
            } catch (error) {
                reject(error);
            }
        })
    }

    async genToken(id, email, username, userpass, pass) {
        return new Promise(async (resolve, reject) => {
            try {

                const valid = await bcrypt.compare(pass, userpass);

                if (!valid) {
                    throw { code: 'Senha inválida.', no: 401 };
                }

                const token = jwt.sign({ id, email, username }, secret, { expiresIn: '3d' });
                
                if (!token) {
                    throw { code: 'Ocorreu um erro durante a geração do token', no: 500 };
                }

                resolve(token);
            } catch (error) {
                reject(error);
            }
        });
    }
}

module.exports = new User();