const database = require('../database/database');

class Messages {

    async findMessages(room, first_message = undefined) {
        return new Promise(async (resolve, reject) => {
            try {
                // SELECT `messages`.`id` AS `id`, `messages`.`data` AS `data`, `messages`.`sender_id` AS `sender_id`, `users`.`username` AS `sender_name` FROM messages INNER JOIN users ON messages.sender_id = users.id WHERE `messages`.`room_id` = 1 AND messages.id > 0 ORDER BY messages.id DESC LIMIT 50
                if (!first_message) {
                    const [messages] = await database.max({ max: 'id' }).table('messages').where({ room_id: room });
                    first_message = messages.max + 1;
                }

                const messages = await database
                    .select({
                        id: 'messages.id',
                        data: 'messages.data',
                        sender_id: 'messages.sender_id',
                        date: 'messages.date',
                        sender_name: 'users.username'
                    })
                    .table('messages')
                    .innerJoin('users', 'messages.sender_id', 'users.id')
                    .where({ room_id: room })
                    .andWhere('messages.id', '<', first_message)
                    .orderBy('messages.id', 'DESC')
                    .limit(100);
                    
                resolve(messages.reverse());
            } catch (error) {
                console.log(error);
                reject();
            }
        })
    }

    async register(data, sender, room) {
        return new Promise(async (resolve, reject) => {
            try {
                const now = new Date();
                const date = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()} ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;

                const message_id = await database.insert({ data, sender_id: sender, room_id: room, date }).into('messages');

                resolve(message_id);
            } catch (error) {
                console.log(error);
                reject();
            }
        })
    }

    async update(id, newData) {
        // atualizações futuras...
    }

    async delete(id) {
        // atualizações futuras...
    }

    async report(id) {
        // atualizações futuras...
    }
}

module.exports = new Messages();