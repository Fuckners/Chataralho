let rooms;

const socket = io('localhost:6847'); // usar o ip do seu computador com a porta do seridor

const allRooms = document.querySelectorAll('div.rooms a.room');

window.onload = () => {
    getRooms();
    document.body.dataset.theme = localStorage.getItem('theme') || 'light-pink';
}

// pesquisar salas
document.querySelector('#search button').addEventListener('click', findRoom);

document.getElementById('query').addEventListener('input', findRoom);

// adicionando as salas quando a pessoa parar de pesquisar
document.getElementById('query').addEventListener('blur', function () {
    if (this.value.trim() === '') {
        const rooms = document.querySelector('.rooms');

        allRooms.forEach(room => {
            rooms.appendChild(room);
        });
    }
});

// abrir modal de adicionar salas
document.querySelector('.add-btn-room').addEventListener('click', openModal);

// adicionar email no modal de adicionar salas
document.getElementById('addMail').addEventListener('click', addMail);

// fechar modal de adicionar sala
document.querySelector('.modal-add-room').addEventListener('click', e => {
    document.querySelector('.modal-add-room').classList.add('hidden');
});

// função para parar a propagação das bolhas do evento
document.getElementById('addRoom').addEventListener('click', e => {
    e.stopPropagation();
});

// mostrar o modal de temas
document.querySelector('.choose-theme-btn').addEventListener('click', () => {
    const modal = document.querySelector('.modal-choose-theme');
    if (modal.classList.contains('hidden')) {
        modal.classList.remove('hidden');
    } else {
        modal.classList.add('hidden');
    }
});

// mudar o tema
const themeButtons = Array.from(document.querySelectorAll('.modal-choose-theme button'));
themeButtons.forEach(button => {
    button.addEventListener('click', () => {
        localStorage.setItem('theme', button.dataset.theme);

        document.body.dataset.theme = button.dataset.theme;

        document.querySelector('.modal-choose-theme').classList.add('hidden');
    });
});

// pesquisa de salas
function findRoom() {
    const rooms = document.querySelector('.rooms');

    rooms.innerHTML = '';

    const query = document.getElementById('query').value;

    const queryRegex = new RegExp(query, 'i');

    allRooms.forEach(room => {
        if (queryRegex.test(room.dataset.name)) {
            rooms.appendChild(room);
        }
    });
}

function openModal() {
    const modal = document.querySelector('.modal-add-room');
    modal.classList.remove('hidden');
}

function addMail() {
    const emails = document.getElementById('emails');

    const input = document.createElement('input');
    input.setAttribute('type', 'email');
    input.classList.add('mail');
    input.setAttribute('name', `participants`);
    input.setAttribute('pattern', '^[\\w+.]+@\\w+\\.\\w{2,}(?:\\.\\w{2})?$');
    input.setAttribute('placeholder', 'Email do usuário');

    emails.appendChild(input);

    emails.lastChild.focus();
}

function getRooms() {
    const rooms_links = document.querySelector('.rooms').querySelectorAll('.room');
    rooms = Array.from(rooms_links);
}

function searchRooms(param) {
    const result = rooms.filter(element => element.classList.contains(param) );
    console.log(result);
    // limpar o elemento com a classe "rooms" e adicionar as rooms correspondentes a pesquisa
    // caso a pesquisa seja igual a nada, adicionar todas os elemento do rooms no elemento com classe rooms
}