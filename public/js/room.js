// VARIÁVEIS
    
// conectando o socket com o servidor
const socket = io('localhost:6847'); // usar o ip do seu computador com a porta do seridor

const mensagens = document.getElementById('mensagens');
const sendBtn = document.getElementById('enviar');    

const infos = {
    room: document.getElementById('room_id').value,
    username: document.getElementById('username').value,
    user_id: document.getElementById('user_id').value
}

const msgBar = document.getElementById('msg');

// Altura da viewport multiplicada por 1% para obter um valor para vh
const vh = window.innerHeight * 0.01;

let shift = false;

window.onload = () => document.body.dataset.theme = localStorage.getItem('theme') || 'light-pink';

// remover os dados do usuário e da sala do front end
document.getElementById('infos').remove();

// Configura o valor em --vh na raiz do documento
document.documentElement.style.setProperty('--vh', `${vh}px`);

// EVENTOS

// não é bem um evento, mas seve pra focar na ultima mensagem recebida :+1:
if (mensagens.childElementCount > 0) {
    mensagens.lastElementChild.scrollIntoView(true);
}

// botão de kickar usuário da sala
document.querySelectorAll('#emails .participant').forEach(element => {

    const btn = element.querySelector('button');

    btn.addEventListener('click', e => {
        e.stopPropagation();
        const emails = document.getElementById('emails');
        const delMail = document.createElement('input');
        delMail.classList.add('mail');
        delMail.setAttribute('type', 'hidden');
        delMail.setAttribute('value', element.dataset.id);
        delMail.setAttribute('name', 'kick');

        emails.appendChild(delMail);
    });

    element.addEventListener('click', () => {

        // alternar visibilidade d obotão
        btn.style.visibility = btn.style.visibility === 'visible' ? 'hidden' : 'visible' 
    });
});

// função para parar a propagação das bolhas do evento
document.getElementById('configRoom').addEventListener('click', e => {
    e.stopPropagation();
});

// abrir modal de adicionar salas
document.querySelector('.room-config-btn').addEventListener('click', openModal);

// adicionar email no modal de adicionar salas
document.getElementById('addMail').addEventListener('click', addMail);

// fechar modal de adicionar sala
document.querySelector('.modal-add-room').addEventListener('click', e => {
    document.querySelector('.modal-add-room').classList.add('hidden');
});

// entrando na room
socket.emit('joinRoom', infos.room);

// receber mensagem do servidor
socket.on('showmsg', data => newMessage(data.message_id, data.msg, data.user_id, data.username));
/*
msg_id, msg, user_id, username

message_id: [423]
msg: "asdf."
room: "1"
user_id: "1"
username: "Fuckner"
*/

socket.on('message_error', id => sendError(id));

// rolar as mensagens até o topo
mensagens.addEventListener('scroll', () => {
    if (mensagens.scrollTop === 0 && mensagens.childElementCount > 0) {
        loadMessages();
    }
});

// enviar mensagem através do botão
sendBtn.addEventListener('click', sendMsg);

// atribuindo evento para enviar o conteúdo do input "msgBar" para o servidor caso a tecla pressionada seja "Enter"
msgBar.addEventListener('keydown', event => {     
    switch (event.key) {
        case 'Enter':
            if (!shift) {
                event.preventDefault();
                sendMsg();
            } else {
                shift = false;
            }
            break;
        case 'Shift':
            shift = true;
            break
        default:
            shift = false;
            break;
    }
});    

// FUNCTIONS 

// enviando mensagem
function sendMsg() {
    if (msgBar.value.trim() != '') {
        socket.emit('mensagem', { msg: msgBar.value, username: infos.username, user_id: infos.user_id, room: infos.room });
    }
    msgBar.value = '';
}

// recebendo mensagem e mostrando na tela
async function newMessage(msg_id, msg, user_id, username, position = 'after') {
    // verificando se a mensagem é válida
    if (msg.trim() === '') {
        return
    }
    
    // criando elementos da mensagem
    const content = document.createElement('div');
    const message = document.createElement('p');
    const author = document.createElement('p');
    
    // adicionando as classes
    content.classList.add('msgShow');
    author.classList.add('author');

    // verificando quem enviou a mensagem
    if (user_id == infos.user_id) {
        content.classList.add('myMsg');
    }

    // adicionando dados da mensagem
    message.innerText = msg;
    author.innerText = username;

    content.setAttribute('id', `${msg_id}`)

    const now = new Date();
    content.dataset.date = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()} ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;

    // adicionando mensagem no front-end
    content.append(author);
    content.append(message);

    if (position === 'before') {
        mensagens.insertAdjacentElement('afterbegin', content);

    } else {

        // mensagens.scrollTop + mensagens.offsetHeight // altura atual
        // mensagens.scrollHeight                       // altura máxima
        if (mensagens.scrollTop + mensagens.offsetHeight == mensagens.scrollHeight) {
            mensagens.append(content);
            // dando foco na mensagem
            mensagens.lastElementChild.scrollIntoView(true);
        } else {
            mensagens.append(content);

            // caso eu quisesse fazer um sistema pra alertar sobre as mensagens não lidas
            // ai eu teria que criar um elemento absolute, e fazer um sistema pra ele sumir e aparecer e bla bla bla
            // alert('nova mensagem não lida');
        }

        
    }
}

// carregando mensagens mais antigas
const loadMessages = (function () {
    let first_message = 0;

    return async function () {
        try {
            console.log('Chegou ao topo!');
            first_message = mensagens.querySelector('.msgShow').id;
            // pegar mensagens da api da mais recente até a mais antiga, e fazer algo tipo:

            const scroll = document.createElement('span');
            scroll.style.display = 'hidden';

            const config = {
                headers: {
                    Authorization: 'Bearer ' + localStorage.getItem('token')
                }
            }

            const response = await axios.post('http://localhost:6847/api/messages', { user: infos.user_id, room: infos.room, first_message }, config);

            mensagens.insertAdjacentElement('afterbegin', scroll);

            response.data.messages.reverse().forEach(message => newMessage(message.id, message.data, message.sender_id, message.sender_name, 'before'));

            scroll.scrollIntoView(true);
            first_message = mensagens.querySelector('.msgShow').id;

        } catch (error) {
            console.warn('Não foi possivel carregar as mensagens.');
            // console.log(error)
        }
    }

})();

function openModal() {
    const modal = document.querySelector('.modal-add-room');
    modal.classList.remove('hidden');
}

function addMail() {
    const emails = document.getElementById('emails');

    const input = document.createElement('input');
    input.setAttribute('type', 'email');
    input.classList.add('mail');
    input.setAttribute('name', `add`);
    input.setAttribute('pattern', '^[\\w+.]+@\\w+\\.\\w{2,}(?:\\.\\w{2})?$');
    input.setAttribute('placeholder', 'Email do usuário');

    emails.appendChild(input);

    emails.lastChild.focus();
}

function sendError(id) {
    document.getElementById(id).classList.add('error');
}