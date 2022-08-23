const database = require('../database/database');
const User = require('../models/Users');

class Rooms {
    async findRoom(id) {
        return new Promise(async (resolve, reject) => {
            try {
                const [room] = await database.select().table('rooms').where({ id });
                resolve(room);
            } catch (error) {
                reject(error);
            }
        })
    }

    async findParticipants(room) {
        return new Promise(async (resolve, reject) => {
            try {
                const participants = await database
                    .select({
                        id: 'users.id',
                        email: 'users.email',
                        name: 'users.username'
                    })
                    .table('participants')
                    .innerJoin('users', 'participants.user_id', 'users.id')
                    .where({ room_id: room });

                resolve(participants);

            } catch (error) {
                reject(error);
            }
        });
    }

    async addUser(email, room) {
        return new Promise(async (resolve, reject) => {
            try {
                const user = await User.findByMail(email);

                if (!user) {
                    // não irei criar um erro, irei apenas não adicinar o contato pois é muito empenho criar o erro :)
                    resolve();
                }

                await database.insert({ user_id: user.id, room_id: room }).into('participants');

                resolve();

            } catch (error) {
                reject(error);
            }
        })
    }

    async removeUser(id, room) {
        return new Promise(async (resolve, reject) => {
            try {
                await database.del().table('participants').where({ user_id: id, room_id: room });
                resolve();
            } catch (error) {
                reject(error);
            }
        })
    }

    async update(id, newName, newDesc) {
        return new Promise(async (resolve, reject) => {
            try {
                await database.update({ name: newName, description: newDesc }).table('rooms').where({ id });
                resolve();
            } catch (error) {
                reject(error);
            }
        })
    }

    async register(name, desc, participants) {
        return new Promise(async (resolve, reject) => {
            try {
                // retorna id da sala criada
                const room = await database.insert({ name, description: desc }).into('rooms');
                console.log(room);

                console.log(participants);

                participants.forEach(async participant => {
                    console.log(participant);
                    await this.addUser(participant, room);
                });

                resolve();

            } catch (error) {
                reject(error);
            }
        })
    }

    async verifyUser(user, room) {
        return new Promise(async (resolve, reject) => {
            try {
                const [result] = await database.select().table('participants').where({ user_id: user, room_id: room });

                if (!result) {
                    resolve(false);
                }

                resolve(true);

            } catch (error) {
                console.log(error)
                resolve(false);
            }
        });
    }
}

module.exports = new Rooms();