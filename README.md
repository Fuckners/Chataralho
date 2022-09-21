![Chataralho](public/img/chataralho.png)	
Chataralho! Um chat do caralho!	

#### Brincadeiras a parte!	
Chataralho é um projeto de chat criado usando socket.io e NodeJs.	
O objetivo principal era criar um chat "global" a fim de entender o básico de socket.io. Porém, decidi me aprofundar um pouco mais e tentar fazer algo um pouquinho mais elaborado! Espero que gostem.	

## ⭐ Projeto Concluído (Por enquanto) ⭐

## Tencologias usadas 👾
<div align='center'>
	<img alt="socket.io" src="https://img.shields.io/badge/socket.io-v^4.5.1-%23ff4e89?style=flat-square">
	<img alt="express" src="https://img.shields.io/badge/express-v^4.18.1-%23ff4e89?style=flat-square">
	<img alt="knex" src="https://img.shields.io/badge/knex-v^2.2.0-%23ff4e89?style=flat-square">
	<img alt="mysql2" src="https://img.shields.io/badge/mysql2-v^2.3.3-%23ff4e89?style=flat-square">
	<img alt="cors" src="https://img.shields.io/badge/cors-v^2.8.5-%23ff4e89?style=flat-square">
	<img alt="express-session" src="https://img.shields.io/badge/express--session-v^1.17.3-%23ff4e89?style=flat-square">
	<img alt="express-flash" src="https://img.shields.io/badge/express--flash-v^0.0.2-%23ff4e89?style=flat-square">
	<img alt="cookie-parser" src="https://img.shields.io/badge/cookie--parser-v^1.4.6-%23ff4e89?style=flat-square">
	<img alt="ejs" src="https://img.shields.io/badge/ejs-v^3.1.8-%23ff4e89?style=flat-square">
	<img alt="bcrypt" src="https://img.shields.io/badge/bcrypt-v^5.0.1-%23ff4e89?style=flat-square">
	<img alt="bodyparser" src="https://img.shields.io/badge/body--parser-v^1.20.0-%23ff4e89?style=flat-square">
</div>
	
	
- Node.js
- Javascript
- MySQL
- WebSocket

## Sumário:    
- [Funcionalidades](#funcionalidades)
- [Páginas](#paginas)
- [Desenvolvimento](#desenvolvimento)
	- [Criando o servidor](#createserve)
	- [Criando salas privadas](#createrooms)
	- [Conexão pelo celular](#celconect)
	- [Temas](#themes)
	- [Conclusão](#conclusao)
- [Instalação](#instalacao)
    - [Criando banco de dados](#criandodb)
    - [Configurando conexão com banco de dados](#configdb)
    - [Rodando o projeto](#runprojeto)
- [Entre em contato!](#contact)

<span id="funcionalidades"></span>
## Funcionalidades 📌

Como o objetivo era fazer um projeto mais simples/rápido somente para entender melhor o socket.io, adicionei apenas as coisas que considerei essenciais. Mas não me impede de ir atualizando o projeto conforme eu tenha disponibilidade.

### Principais funcionalidades
- [x] Adicionar sinalização de erro caso a mensagem não consiga ser enviada;
- [x] Conexão pelo celular;
- [x] Usuário poder criar salas;
- [x] Opção para o usuário poder mudar o tema;
- [x] Usuário poder personalizar nome da sala e descrição;
- [ ] Adicionar opção de enviar anexos além de somente mensagens;
- [x] Barra de pesquisa de salas;
- [x] Listar mensagens por partes, ex: listar 100 primeiras mensagens e ir listando conforme o usuário for rolando as mensagens antigas;
- [x] Fazer a ultima mensagem enviada pelo usuário ficar em foco *importante*.

### Possiveis adições futuras
- [ ] Implementação de chats privados/diretos com direito a status de online e ver se a pessoa está digitando;
- [ ] Adicionar diferenciação de usuários;
- [ ] Fazer sistemas de pesquisar mensagems;
- [ ] Opção de deletar mensagens;
- [ ] Opção de editar mensagens;
- [ ] Recuperação de conta;
- [ ] Foto de perfil;
- [ ] Personalização da bolha de mensagem;
- [ ] Adicionar aba de mensagens favoritas.

<span id="paginas"> </span>
## Páginas 🚢
<div align="center">
	<h3>Páginas de Login e registro</h3>
	<img src="/public/img/login.png" alt="Página de login" width="40%">
	<img src="/public/img/register.png" alt="Página de registro" width="40%">
	<h3>Menu</h3>
	<img src="/public/img/menu.png" alt="Menu" width="30%">
	<h3>Outros temas do menu</h3>
	<img src="/public/img/menu-dark-purple.png" alt="Menu tema roxo escuro" width="30%">
	<img src="/public/img/menu-dark-gray.png" alt="Menu tema cinza escuro" width="30%">
	<h3>Modal para criar salas</h3>
	<img src="/public/img/modal-create-room.png" alt="Modal para criar salas" width="30%">
	<h3>Sala/Modal de configurações da sala</h3>
	<img src="/public/img/room.png" alt="Sala" width="30%">
	<img src="/public/img/modal-config-room.png" alt="Modal para configurar sala" width="30%">
</div>

<span id="desenvolvimento"> </span>
## Desenvolvimento! 🐱‍🏍
Agora vamos falar um pouquinho sobre a trajetória que percorri enquanto criava esse projeto.	
<span id="createserve"> </span>
### Criando servidor 🐱‍💻
Inicialmente, a conexão com o socket.io estava sendo feita diretamente no meu `server.js`
```js
// server.js

const express = require('express');
const app = express();

const http = require('http').createServer(app);
const io = require('socket.io')(http);

io.on('connection', socket => {
	// anunciando que usuário se conectou
	console.log(`${socket.id} se conectou!`);
	// recebendo mensagem
	socket.on('msg' data => {
		// enviando mensagem pra todos os usuários
		io.emit('msg', data)
	});
});

// iniando servidor
const port = 6847 // CHAT
http.listen(port, () => {
    console.log(`Servidor iniciado com sucesso em http://localhost:${port}`)
});
```
Porém, isso era um problema considerando que eu teria que fazer toda a estrutura do meu socket.io, dentro do meu arquivo principal `server.js`, o que acabaria deixando meu arquivo desorganizado e poluido. Então eu pensei em duas soluções:	
	
#### 1º - Criar a conexão em outro arquivo, e exportar o server http, o app, e a conexão com o socket.
Arquivo onde criaria os servidores e a conexão com o socket. 
```js
// http.js

const express = require('express');
const app = express();

const http = require('http').createServer(app);
const io = require('socket.io')(http);

module.exports = { http, app, io }
```
Arquivo onde os eventos do socket serão emitidos/recebidos. 
```js
// socket.js

const { io } = require('./http.js');

io.on('connection', socket => {
	// anunciando que usuário se conectou
	console.log(`${socket.id} se conectou!`);
	// recebendo mensagem
	socket.on('msg' data => {
		// enviando mensagem pra todos os usuários
		io.emit('msg', data)
	});
});
```
Arquivo principal onde eu importo o http e o app e o arquivo do socket.
```js
// server.js

const { http } = require('./http.js');
const { app } = require('./http.js');

// importando o arquivo socket.js para que ele seja executado quando o servidor for iniciado
require('./socket');

// iniando servidor
const port = 6847 // CHAT
http.listen(port, () => {
    console.log(`Servidor iniciado com sucesso em http://localhost:${port}`)
});
```
#### 2º - Criar um model `Socket.js` para o socket e chamar ele no `server.js`.
Arquivo do principal onde crio os servidores e a conexão com o socket.
```js
// server.js

const express = require('express');
const app = express();

const http = require('http').createServer(app);
const io = require('socket.io')(http);

const Socket = require('./models/Socket.io');

Socket.connection(io);

// iniando servidor
const port = 6847 // CHAT
http.listen(port, () => {
    console.log(`Servidor iniciado com sucesso em http://localhost:${port}`)
});
```
```js
Arquivo do model onde eu emito/recebo os eventos do socket.
// Socket.js

class Socket {
	connection (io) {
		io.on('connection', socket => {
			// anunciando que usuário se conectou
			console.log(`${socket.id} se conectou!`);
			// recebendo mensagem
			socket.on('msg' data => {
				// enviando mensagem pra todos os usuários
				io.emit('msg', data)
			});
		});
	}
}

module.exports = new Socket();
```
Eu acabei optando pela primeira opção (Confesso que só pensei na segunda quando estava acabando o projeto e não queria refazer tudo 😬). Acabei por fazer desse jeito, pois eu já estava útilizando bastante de models nos ultimos projetos e acabou que essa foi a primeira ideia que veio na minha mente.

<span id="createrooms"> </span>
### Criando salas privadas 🔒
<p align="justify">O segundo problema veio na hora de criar os bate papos privados.	
Inicialmente o plano era fazer com que existissem tanto chats privados, quanto grupos/salas. Porém eu tive uma certa dificuldade em pensar como seria a lógica de salas privadas, em relação ao database, e acabei optando por fazer com que todos os chats fossem "grupos". Eu ainda pretendo voltar nesse projeto (ou começar outro com o mesmo objetivo) futuramente e tentar implementar todas as coisas as quais eu tive dificuldade.</p>

Meu foco era que esse fosse um projeto curto, apenas para aprender o "suficiente" sobre WebSocket, então não queria bater na mesma tecla por muito tempo.

<span id="celconect"> </span>
### Problemas em se conectar pelo celular 📱
<p align="justify">Após criar o sistema de salas, eu tentei me conectar pelo celular, para ver se eu conseguiria conversar com outras pessoas aqui de casa. Porém, segundo a lei de Murphy, é óbvio que não deu certo. Confesso que me bati bastante para entender o motivo de não estar enviando as mensagens pelo celular, ainda mais considerando que não consigo ver o console do navegador pelo celular. Mas depois de algum tempo eu me toquei que o problema era o servidor onde eu estava tentando fazer a conexão.</p>

Inicialmente o meu código HTML estava assim:
```js
const socket = io('localhost:6847');

socket.emmit('msg'...);
```
E ai? Consegue ver o problema?	
	
Sim! Isso mesmo! (Você descobriu o problema né!?);
<p align="justify">Eu estava tentando fazer a conexão com o meu localhost. O problema é que o localhost do meu computador, é a onde o servidor está rodando, e até ai, tudo certo.	
Mas quando vamos tentar a conexão pelo celular, o localhost que era o localhost do meu computador, passa a ser o localhost do celular. O que resultava em uma tentativa infinita de conexão com um servidor que não existe.</p>

Para arrumar isso, é simples, bastou mudar o `localhost` para ip do meu computador.
```js
const socket = io('123.456.78.910:6847');

socket.emit('msg'...)
```
<span id="themes"> </span>
### Temas 🎨
Temas! Atire a primeira pedra o usuário que não goste de poder personalizar algo no site, nem que seja algo pequeno.    
	
Essa parte não foi realmente um problema, porém eu acabei não fazendo do jeito que tinha pensado inicialmente.	
O plano inicial era o seguinte:	
	
Criar variaveis no css para guardar as cores do tema
```css
:root {
	--cor0: #ff4e89; /* titulo rooms */
	--cor1: #ff83ac; /* principal */
	--cor2: #fff7fa; /* fundo main */
	--cor3: #ffffff; /* fontes */
	--cor4: #ff4e89; /* cor username */
	--cor5: #ffffff; /* cor cada sala */
	--cor6: #000000;
}
```
E guardar o nome do tema no localhost. Quando a página iniciasse eu usaria javascript para alterar as variáveis css de acordo com o tema.
```js
window.onload = () => {
	const theme = localStorage.getItem('theme');
	const style = document.body.style;
	
	switch (theme) {
		case 'dark-purple':
		// Tema roxo - Escuro
			style.setProperty('--cor0', '#F7F3FF');
			style.setProperty('--cor1', '#391b5a');
			style.setProperty('--cor2', '#241437');
			style.setProperty('--cor3', '#F7F3FF');
			style.setProperty('--cor4', '#F7F3FF');
			style.setProperty('--cor5', '#391b5a');
			break;
			
		case 'dark-gray':
		// Tema cinza com roxo - Escuro
			style.setProperty('--cor0', '#F7F3FF');
			style.setProperty('--cor1', '#2C1842');
			style.setProperty('--cor2', '#4B514F');
			style.setProperty('--cor3', '#F7F3FF');
			style.setProperty('--cor4', '#F7F3FF');
			style.setProperty('--cor5', '#2C1842');
			break;
			
		default:
		// Tema rosa - Claro
			style.setProperty('--cor0', '#ff4e89');
			style.setProperty('--cor1', '#ff83ac');
			style.setProperty('--cor2', '#fff7fa');
			style.setProperty('--cor3', '#ffffff');
			style.setProperty('--cor4', '#ff4e89');
			style.setProperty('--cor5', '#ffffff');	
			break;
	}
}
```
Mas considerando que sempre tem alguém que pensou em um jeito mais inteligente de fazer algo, eu resolvi dar uma pesquisada e vi que dava pra fazer somente com css.	
Então a única coisa que precisei fazer foi pegar a o nome do tema no `localStorage`, e adicionar em um `data-` no `body` da página.
```js
// o || serve para que caso não exista um tema salvo no localStorage, o data-theme do body receba "light-pink"
window.onload = () => document.body.dataset.theme = localStorage.getItem('theme') || 'light-pink';
```
E adicionar as condições pelo css.
```css
/* temas */
body[data-theme="light-pink"] {
    --cor0: #ff4e89; /* titulo rooms */
    --cor1: #ff83ac; /* principal */
    --cor2: #fff7fa; /* fundo main */
    --cor3: #ffffff; /* fontes */
    --cor4: #ff4e89; /* cor username */
    --cor5: #ffffff; /* cor cada sala */
    --cor6: #000000;
}

body[data-theme="dark-purple"] {
    --cor0: #F7F3FF; /* titulo rooms */
    --cor1: #391b5a; /* principal */
    --cor2: #241437; /* fundo main */
    --cor3: #F7F3FF; /* fontes */
    --cor4: #F7F3FF; /* cor username */
    --cor5: #391b5a; /* cor cada sala */
    --cor6: #ffffff;
}

body[data-theme="gray-purple"] {
    --cor0: #F7F3FF; /* titulo rooms */
    --cor1: #2C1842; /* principal */
    --cor2: #4B514F; /* fundo main */
    --cor3: #F7F3FF; /* fontes */
    --cor4: #F7F3FF; /* cor username */
    --cor5: #2C1842; /* cor cada sala */
    --cor6: #ffffff;
}
```

<span id="conclusao"> </span>
### Conclusão
<p align="justify">No fim, por mais que eu não tenha corrido muito atrás para entender e conseguir fazer 100% do que eu queria, eu descobri muitas coisas, inclusive algumas totalmente fora de contexto, mas que no fim também contam. Eu realmente planejo refatorar/refazer o projeto porque olhando ele agora, depois de concluido, eu percebo que talvez não tenha usado tudo que o WebSocket tem a oferecer, justamente por ter ficado muito preso ao express, padrão MVC, etc. Creio que com o tempo eu consiga ser mais "flexivel" em relação a diferentes estrututas de diferentes projeto, mas por enquanto é isso 🙃.</p>
	
Se você chegou até aqui, parabéns, você é um guerreiro e espero que tenha gostado do projeto!
<span id="instalacao"> </span>
## Instalação	

### Pré-requisitos

Antes de começar, você vai precisar ter instalado em sua máquina as seguintes ferramentas: [Node.js](https://nodejs.org/en/) e [MySQL](https://dev.mysql.com/downloads/mysql/). 
Além disto é bom ter um editor para trabalhar com o código como [VSCode](https://code.visualstudio.com/)

### 🎲 Rodando o Back End (servidor)

<span id="criandodb"> </span>
#### Criando banco de dados
```sql
# Instale o MySQL pelo site oficial
  https://dev.mysql.com/downloads/mysql/

# Caso tenha dúvidas de como deve ser feita a instalação, siga este tutorial
  https://www.youtube.com/watch?v=HmmYkLyVy-c

# Vá na barra de pesquisa do seu OS e pesquise por `MySQL Command Line Client`

# Digite sua senha do banco de dados

# Criando o banco de dados
$ CREATE DATABASE `chataralho`

# tabela de usuários
$ CREATE TABLE `users` (
	`id` INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
	`username` VARCHAR(50) NOT NULL,
	`email` VARCHAR(100) NOT NULL,
	`password` VARCHAR(200) NOT NULL,
	PRIMARY KEY (`id`),
	UNIQUE INDEX `email` (`email`)
)    
          
# Tabela de salas
$ CREATE TABLE `rooms` (
	`id` INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
	`name` VARCHAR(50) NOT NULL,
	`description` VARCHAR(200) NOT NULL,
	PRIMARY KEY (`id`)
)

# Tabela de participantes
$ CREATE TABLE `participants` (
	`user_id` INT(10) UNSIGNED NOT NULL,
	`room_id` INT(10) UNSIGNED NOT NULL,
	CONSTRAINT `FK_participants_room_id_rooms` FOREIGN KEY (`room_id`) REFERENCES `rooms` (`id`) ON UPDATE CASCADE ON DELETE CASCADE,
	CONSTRAINT `FK_participants_user_id_users` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON UPDATE CASCADE ON DELETE CASCADE
)

# Tabela de mensagens
$ CREATE TABLE `messages` (
	`id` INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
	`data` VARCHAR(255) NOT NULL,
	`sender_id` INT(10) UNSIGNED NOT NULL,
	`room_id` INT(10) UNSIGNED NOT NULL,
	`date` DATETIME NOT NULL,
	PRIMARY KEY (`id`),
	CONSTRAINT `FK_message_room_id_rooms` FOREIGN KEY (`room_id`) REFERENCES `rooms` (`id`) ON UPDATE CASCADE ON DELETE CASCADE,
	CONSTRAINT `FK_message_sender_id_users` FOREIGN KEY (`sender_id`) REFERENCES `users` (`id`) ON UPDATE CASCADE ON DELETE CASCADE
)
```
<span id="configdb"> </span>
#### Configurando conexão com o banco de dados
```bash
# Clone este repositório
$ git clone <https://github.com/Fuckners/Chataralho>

# Acesse a pasta do projeto

# Acesse a pasta `database`

# Abra o arquivo `database.js`

# Edite a senha `@Banco_Dados` para a sua senha do mysql

# Salve as alterações
```
<span id="runprojeto"> </span>
#### Rodando o projeto
```bash
# Abra o cmd.

# Navegue até a pasta do projeto.
$ cd [diretório]/chataralho

# Instale as dependências do projeto.
$ npm install

# Execute a aplicação
$ node server.js

# O servidor inciará na porta:6847

# Acesse <http://localhost:6847>

# Converse com seus amigos até enjoar!
```
***Observação:** Caso você queira que outras pessoas **na mesma rede** também consigam acessar o site e trocar mensagens, será necessário alterar todos os códigos js (chataralho > public > js). Mude todas as ocorrencias de `localhost:6847` ou `http://localhost:6847` para o ip do computador que está rodando o servidor. Exemplo: `123.456.78.910:6847` ou `http://123.456.78.910:6847`*

<span id="contact"> </span>
### Autor
<a href="https://github.com/Fuckners/Fuckners">
 <img src="https://avatars.githubusercontent.com/u/100722316?s=400&u=a71fc45baf666450aafd21e99aa729e48b1f1552&v=4" width="100px;"/>
 <br>
 <sub><b>Felipe Fuckner Clariano</b></sub>
</a>
 
 Entre em contato! 💌
 
[![Linkedin Badge](https://img.shields.io/badge/-Felipe%20Fuckner-blue?style=flat-square&logo=Linkedin&logoColor=white&)](https://www.linkedin.com/in/felipe-fuckner-b65a49237) 
[![Gmail Badge](https://img.shields.io/badge/-felipefclariano04@gmail.com-c14438?style=flat-square&logo=Gmail&logoColor=white)](mailto:felipefclariano04@gmail.com)
