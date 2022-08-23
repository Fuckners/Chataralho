const Room = require('../models/Rooms');
const Messages = require('../models/Messages');
const User = require('../models/Users');
const secret = require('../jwt/secret');
const jwt = require('jsonwebtoken');

class RoomController {
    async room (req, res) {
        try {
            const { id } = req.params;
        
            const room = { ...await Room.findRoom(id), participants: await Room.findParticipants(id) };

            const messages = await Messages.findMessages(id);

            res.render('room', { user: req.session.user, room, messages });
        } catch (error) {
            console.log(error);
            res.redirect('/login');
        }
    }

    async create (req, res) {
        try {
            const { name, desc, participants } = req.body;

            if (!name || !desc || !participants || name.length > 50 || desc.length > 200) {
                throw 'Requisição inválida.';
            }

            const participantsArr = typeof(participants) == 'object' ? Array.from(new Set(participants)) : [participants];

            participantsArr.push(req.session.user.email);

            await Room.register(name, desc, participantsArr);

            res.redirect('/');
        } catch (error) {
            console.log(error);
            res.redirect('/');
        }
    }

    async loadMessages (req, res) {
        try {
            const { user, room, first_message } = req.body;
            const user_infos = {};

            try {
                const [type, token] = req.headers.authorization.split(' ');

                const payLoad = jwt.verify(token, secret);     

                user_infos.id = payLoad.id;    
                user_infos.username = payLoad.username;
                user_infos.email = payLoad.email;
                
            } catch (error) {
                if (error.name === 'TypeError') {
                    throw { code: 'Requisição inválida.', no: 400 };
                } else {
                    throw { code: `Token inválido. (${error.message})`, no: 401 };
                }
            }

            console.log(user_infos);

            if (user_infos.id != user) {
                throw { code: 'Credenciais inválidas.', no: 401 };
            }

            const verify = await Room.verifyUser(user, room);
            
            if (!verify) {
                throw { code: 'O usuário não é um participante desta sala.', no: 401 };
            }

            const messages = await Messages.findMessages(room, first_message);
            
            res.status(200);
            res.json({ messages });

        } catch (error) {
            res.status(error.no);
            res.json({ err: error.code });
            console.log(error);
        }
    }

    async update (req, res) {
        const { room, name, description, add, kick } = req.body;

        const addList = typeof(add) == 'object' ? Array.from(new Set(add)) : add ? [add] : [];
        const kickList = typeof(kick) == 'object' ? Array.from(new Set(kick)) : kick ? [kick] : [];
        
        console.log(addList);
        console.log(kickList);
        
        try {

            // verificar que a pessoa que quer editar é um participante da sala
            const verify = await Room.verifyUser(req.session.user.id, room);
            
            if ((name && name.length > 50) || (!description && description.length > 200)) {
                throw 'Requisição inválida.';
            }

            if (!verify) {
                throw 'O usuário não tem permissão para editar esta sala';
            }

            if (name || description) {
                await Room.update(room, name, description);
            }

            if (kickList.length > 0) {
                kickList.forEach(async id => {
                    await Room.removeUser(id, room);
                });
            }
            

            // verificar se os usuários que serão adicionados já estão na sala
  
            if (addList.length > 0) {
                addList.forEach(async participant => {
                    const user = await User.findByMail(participant);
                    if (user) {
                        // não faz mal repetir o nome da variavel, pois esta variavel está dentro de um bloco, logo, ela pertence a este escopo
                        const verify = await Room.verifyUser(user.id, room);
                        if (!verify) {
                            Room.addUser(participant, room);
                        }
                    }
                });
            }

            res.redirect('/room/' + room);

        } catch (error) {
            console.log(error);
            res.redirect('/room/' + room);
        }
    }
}

module.exports = new RoomController();