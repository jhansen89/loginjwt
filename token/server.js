const express = require('express');
const bodyParser = require('body-parser');
const cors = require("cors");

const Users = require('./Model/Usuario');
const app =  express();
const jwt = require('jsonwebtoken');
const secret = 'senhasupersecreta'
const mongoose = require('mongoose');
const MongoClient = require('mongodb').MongoClient;

app.use(cors());
app.use(bodyParser.json());
var conectado = 0;

var url = "mongodb://localhost:27017/bdprodutos";
var conectado = 0;

const db = mongoose.createConnection('mongodb://localhost:27017/bdprodutos');

if(conectado == 0){
    console.log('entrou');

        db.createCollection("usuarios", function(err, res) {
          if (err) throw err;
          console.log("Colecao criada");
          conectado = 1;
          db.close();
        })
mongoose.connection.once("open",()=>
console.log('Abriu ...')
);


}

  app.get("/usuarios",(req,res)=>{
    Users.find().then(dados => {
    res.json(dados);
    })
    });


app.post('/register', function(req, res) {


  mongoose.connect(url,function(err, db) {
    if (err) throw err;
    var myobj = { nome: req.body.nome , login: req.body.login, password: req.body.password, perfil: "admin" };
    db.collection("usuarios").insertOne(myobj, function(err) {
      if (err) return res.status(500).send("Ocorreu um erro durante o registro");

    res.status(200).send({ status: 'ok' });
    });
  });

 });


app.post("/auth",(req,res)=>{

     let msg ="";
     let resp = {"ok": msg};
   let resultado;

   let logado = Users.findOne({ login:  req.body.login , password: req.body.password }).then(result=>{
    resultado = result;
       console.log('aqui:' ,resultado);
    if (result.login == req.body.login && result.password == req.body.password){
        res.json(result);
     }else{
        return null;
     }
    });


     if(logado){
         let token = jwt.sign({
             'login': logado.login
         }, secret);
         resp.token = token;
         console.log('usuario logado',resp.token);
     }else{
         res.status(401).json({msg: 'Usuario ou senha invalidos'});
         return
     }
     
});



function fnValidacao(req, res, next) {
	let erro = { success: false, msg: 'Erro de autenticacao' };
	let authorization = req.headers['authorization'];
	console.log('Autorizacao: ',authorization);

	if (authorization) {
		let token = authorization.split(' ')[1];
		console.log(JSON.stringify(authorization));
		console.log(token);
		jwt.verify(token, secret, function (err, decoded) {
			if (err) {
				console.log('Erro: ', err);
				res.status(403).json(erro);
				return;
			} else {
				console.log("show");
				next();
			}
		});
		return;
	}
	res.status(401).json(erro);
}


app.listen(3010, function(){
    console.log('Servidor iniciado na porta 3010');
})

module.exports = mongoose;