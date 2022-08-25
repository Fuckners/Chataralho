![Chataralho](public/img/chataralho.png)    
Chataralho! Um chat do caralho!    

#### Brincadeiras a parte!    
Chataralho é um projeto de chat criado usando socket.io e NodeJs.    
O objetivo principal era criar um chat "global" a fim de entender o básico de socket.io. Porém, decidi me aprofundar um pouco mais e tentar fazer algo um pouquinho mais elaborado! Espero que gostem.    

## ⭐ Projeto Concluído (Por enquanto) ⭐

## Tencologias usadas 👾
![socket.io](https://img.shields.io/badge/socket.io-v^4.5.1-%23ff4e89?style=flat-square)
![express](https://img.shields.io/badge/express-v^4.18.1-%23ff4e89?style=flat-square)
![knex](https://img.shields.io/badge/knex-v^2.2.0-%23ff4e89?style=flat-square)    
![mysql2](https://img.shields.io/badge/mysql2-v^2.3.3-%23ff4e89?style=flat-square)
![cors](https://img.shields.io/badge/cors-v^2.8.5-%23ff4e89?style=flat-square)
![express-session](https://img.shields.io/badge/express--session-v^1.17.3-%23ff4e89?style=flat-square)    
![express-flash](https://img.shields.io/badge/express--flash-v^0.0.2-%23ff4e89?style=flat-square)
![cookie-parser](https://img.shields.io/badge/cookie--parser-v^1.4.6-%23ff4e89?style=flat-square)
![ejs](https://img.shields.io/badge/ejs-v^3.1.8-%23ff4e89?style=flat-square)    
![bcrypt](https://img.shields.io/badge/bcrypt-v^-%23ff4e89?style=flat-square)
![bodyparser](https://img.shields.io/badge/body--parser-v^1.20.0-%23ff4e89?style=flat-square)

- Node.js
- Javascript
- MySQL
- WebSocket

## Sumário:    
- [Desenvolvimento](#desenvolvimento)
- [Instalação](#instalacao)
 - [Criando banco de dados](#criandodb)
 - [Configurando conexão com banco de dados](#configdb)
 - [Rodando o projeto](#runprojeto)
- [Funcionalidades](#funcionalidades)
- [Páginas](#paginas)

## Funcionalidades 📌
<span id="funcionalidades"></span>

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
- [ ] Adicionar diferenciação de usuários
- [ ] Fazer sistemas de pesquisar mensagems;
- [ ] Opção de deletar mensagens;
- [ ] Opção de editar mensagens;
- [ ] Recuperação de conta;
- [ ] Foto de perfil;
- [ ] Personalização da bolha de mensagem;
- [ ] Adicionar aba de mensagens favoritas.

## Páginas 🚢
<span id="paginas"> </span>
![Login]()    
![Registro]()    
![Principal]()
![Adicionar sala]()
![Configurar sala]()


<span id="desenvolvimento"> </span>

# Instalação        
<span id="instalacao"> </span>

### Pré-requisitos

Antes de começar, você vai precisar ter instalado em sua máquina as seguintes ferramentas: [Node.js](https://nodejs.org/en/) e [MySQL](https://dev.mysql.com/downloads/mysql/). 
Além disto é bom ter um editor para trabalhar com o código como [VSCode](https://code.visualstudio.com/)

### 🎲 Rodando o Back End (servidor)

#### Criando banco de dados
<span id="criandodb"> </span>
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
#### Configurando conexão com o banco de dados
<span id="configdb"> </span>
```bash
# Clone este repositório
$ git clone <https://github.com/Fuckners/Chataralho>

# Acesse a pasta do projeto

# Acesse a pasta `database`

# Abra o arquivo `database.js`

# Edite a senha `@Banco_Dados` para a sua senha do mysql

# Salve as alterações
```
#### Rodando o projeto
<span id="runprojeto"> </span>
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
***Observação:** Caso você queira que outras pessoas também consigam acessar o site e trocar mensagens, será necessário alterar todos os códigos js (chataralho > public > js). Mude todas as ocorrencias de `localhost:6847` ou `http://localhost:6847` para o ip do computador que está rodando o servidor. Exemplo: `123.456.78.910:6847` ou `http://123.456.78.910:6847`*

### Autor
<a href="https://blog.rocketseat.com.br/author/thiago/">
 <img style="border-radius: 50%;" src="https://avatars.githubusercontent.com/u/100722316?s=400&u=a71fc45baf666450aafd21e99aa729e48b1f1552&v=4" width="100px;"/>
 <br>
 <sub><b>Felipe Fuckner Clariano</b></sub></a>
 
 Entre em contato! 💌
 
[![Linkedin Badge](https://img.shields.io/badge/-Felipe%20Fuckner-blue?style=flat-square&logo=Linkedin&logoColor=white&)](https://www.linkedin.com/in/felipe-fuckner-b65a49237) 
[![Gmail Badge](https://img.shields.io/badge/-felipefclariano04@gmail.com-c14438?style=flat-square&logo=Gmail&logoColor=white)](mailto:felipefclariano04@gmail.com)
