const express = require('express');
const app = express();

// bibliotecas para formulários. logins e afins
const bodyparser = require('body-parser');
const session = require('express-session');
const flash = require('express-flash');
const cookieParser = require('cookie-parser');

// router das páginas e model para lidar com as requisições do Socket
const router = require('./routes/routes');
const routerAPI = require('./routes/routesAPI');
const Socket = require('./models/Socket');

// criar um servidor nativo do node para o express usar de base para funfar o socket.io
const http = require('http').createServer(app);
const io = require('socket.io')(http, {
    cors: {
        origin: ['http://localhost:8080', 'http://ipv4:8080']
    }
});

Socket.connection(io);

// view engine
app.set('view engine', 'ejs');

// aceitar dados de formulários
app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());

// pasta onde vão ficar css, imgs, fontes e afins
app.use(express.static('public'));

// cookieParser
app.use(cookieParser('very secreto 864'));

// express-session para relizar login dos usuários
app.use(session({
    secret: 'very secreto 667',
    resave: false,
    saveUninitialized: true,
    cookie: {
        // secure: true, // só habilitar caso o server esteja em uma conexão https://
        maxAge: 86400000 * 3 // 3 dias
    }
}));

// express-flash para mensagens de erro
app.use(flash());

// rotas do site
app.use('/api', routerAPI);

app.use('/', router);

// redirecionar para a página principal caso tentem acessar uma página que não existe
app.use((req, res, next) => {
    res.redirect('/')
});

// iniando servidor
const port = 6847 // CHAT
// USAR HTTP.LISTEN INVÉS DE APP.LISTEM PQ ESTAMOS UTILIZANDO O SERVIDOR NATIVO DO NODE.
http.listen(port, () => {
    console.log(`Servidor iniciado com sucesso em http://localhost:${port}`)
});