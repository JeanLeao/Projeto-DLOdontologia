const express = require('express');
const app = express();
const mongo = require('mongoose');
const consultaService = require('./services/consultaService.js') // CARREGANDO O MODULO DA CONSULTA
const cors = require('cors');

//DOTENV
const dotenv = require('dotenv');
dotenv.config();
const MONGO_CNSTRING = process.env.MONGO_CNSTRING;


//SOCKET
var http = require('http').createServer(app);
var io = require('socket.io')(http);

    //WHATSAPP MENSSAGE
const { Client } = require('whatsapp-web.js');
const client = new Client();
const qrcode = require('qrcode-terminal');
var logado = false;

io.on('connection',(socket) => { // RECEBE UM EVENTO DE CONECXÃO DO OUTRO CORPO
    socket.on("fechando", (dataClose) => {
        console.log('Fechado');  
    })

    socket.on("iniciar", (dataOpen) => {
    if(logado == false){
        client.initialize();
        console.log('Projeto Aberto' + dataOpen)
        client.on('qr',(qr) => {
            socket.emit("qrload", qr);
            console.log(qr)
            qrcode.generate(qr, {small: true})
        });
        }else{
            socket.emit("pronto", 'Estou pronto');
        }
    }); 
    //socket.on("campo", (data) => {})


    client.on('ready', () => {
        logado = true;
        socket.emit("pronto", 'Estou pronto'); // ENVIANDO UM EVENTO DE CONEXÃO COM O QR CODE PARA O FRONT
    });

});


app.use(cors());
//EXPRESS PARSER
app.use(express.urlencoded({extended: true}))
app.use(express.json());

// CONEXÃO DO BANCO DE DADOS

    mongo.connect(MONGO_CNSTRING).then(()=> {console.log('Conectado!');})


// ROTAS DE CADASTRO
app.post('/create', async (req,res) => {
    var consulta = await consultaService.Create(
        req.body.name,
        req.body.email,
        req.body.description,
        req.body.number,
        req.body.date,
        req.body.time,
        req.body.cpf
        )

        if(consulta){
            res.sendStatus(200)
        }else{
            res.send('Erro')
        }
})


    //ROTAS DE INFORMAÇÃO RECEBIDA
// ROTAS FULL CALENDAR
app.get('/getcalendar', async (req,res) => {
    var consultas = await consultaService.GetAll(false);
    res.json(consultas) // O FULLCALENDAR SÓ ACEITA JSON
})

app.get('/event/:id', async(req,res) => { // ROTA PARA FULL CALENDAR
    var id = req.params.id
    var paciente = await consultaService.GetById(id);
    res.json(paciente) // PEGANDO UM PARAMETRO POR CLICK DO FULLCALENDAR
})

app.get('/consult/:cpf', async (req,res) => { // REQUISIÇÃO POR CPF E PASSANDO NO CADASTRO DE CONSULTAS NOVAS
    var cpf = req.params.cpf
    var paciente = await consultaService.GetByCpf(cpf);
    res.json(paciente)
})


app.get('/finish/:id', async(req,res) => { // ROTA PARA FINALIZAR CONSULTAS
    var id = req.params.id;
    try{
        var result = await consultaService.Finish(id)
        if (result){
            res.sendStatus(200)
        }
    }catch(err){
        console.log(err)
        return false;
    }
})

app.get('/consult/person/:cpf', async (req,res) => { // REQUISIÇÃO POR CPF E BUSCANDO CONSULTAS DELA
    var cpf = req.params.cpf
    var paciente = await consultaService.GetPerson(cpf);
    res.json(paciente)
})


// ROTA WHATSAPP
app.get('/messagewpp/:number/:nome/:hora', async(req,res) => {
    var number = req.params.number;
    var nome = req.params.nome;
    var hora = req.params.hora;

    client.sendMessage('55' + number + '@c.us', 'Olá, boa tarde '+ nome +'. Tudo bem? Meu nome é Kátia, falo da DL Odontologia. Posso confirmar seu atendimento amanhã às ' + hora + 'Hrs?');
    res.sendStatus(200);
})





setInterval(() => { //POLLING 
    consultaService.SendNotification();
},5000)

http.listen(8080, ()=> {})