const Message = require('../models/Messages.js');

class Socket {

    async connection (io) {
        // requisição pro socket para quando alguém se conecta
        io.on('connection', async socket => {

            // conexão com o usuário iniciada.
            // console.log(`${socket.id} se conectou!`);

            this.message(socket, io);

            this.joinRoom(socket);

            // conexão com o usuário encerrada.
            socket.on('disconnect', () => {
                // console.log(`${socket.id} se desconectou!`);
            });
        });
    }

    async message(socket, io) {
        // recebendo emnsagem.
        socket.on('mensagem', async data => {
            try {
                // console.log(`${data.username}: ${data.msg}`);

                // cadastrar no banco de dados
                const message_id = await Message.register(data.msg, data.user_id, data.room);

                // emite para todos no servidor, incluindo o cliente que enviou.
                io.to(data.room).emit('showmsg', { ...data, message_id });

            } catch (error) {
                console.log(error);
                io.to(data.room).emit('message_error', { message_id });
            }
        });
    }

    joinRoom(socket) {
        socket.on('joinRoom', room => {
            // console.log(`O usuário ${socket.id} entrou na sala ${room}`);
            socket.join(room);
        })
    }
}

module.exports = new Socket();