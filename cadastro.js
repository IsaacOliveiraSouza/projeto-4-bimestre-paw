const express = require("express")
const app = express()
const bodyparser = require("body-parser")

app.use(bodyparser.urlencoded({extended:false}))
app.use(bodyparser.json())
const conn = require("./banco")

app.use(express.static("public"))
const path = require("path")
app.use("/static", express.static(path.join(__dirname,"public")))

//sessoes de login
const session = require('express-session')
app.use(session({
    secret: 'aaaaaaaa',
    resave : true,
    saveUninitialized : true
}))

// app.use(express.static("public"))
// const path = require("path")
// app.use("/static", express.static(path.join(__dirname,"public")))


//Cadastro
app.get("/cadastro", function(req,res){
    res.sendFile(__dirname+"/cadastro.html")
})

app.get("/cadastrarUsuario", function(req,res){
    let nome = req.query.nome
    let email = req.query.email
    let senha = req.query.senha
    let x = {"nome": nome, "email": email, "senha":senha}
    let sql = `insert into tbl_usuario(nome, email, senha) values ('${nome}', '${email}', '${senha}');` 
    conn.query(sql, function(error, result){})
    res.send(x)
})

//Login 
app.get("/", function(req,res){
    res.sendFile(__dirname+"/login.html")
})
//variavel q pega o id
let idusu=""
app.get('/loginUsuario', function(req,res){
    let email = req.query.email
    let senha = req.query.senha
    let sql = `select id_usuario from tbl_usuario where email = '${email}' and senha = '${senha}'`
    conn.query(sql, function(error, result){
        console.log(result)
        console.log(email)
        console.log(senha)
        //let id = result[ { id_usuario } ]
       // logado(id)
       console.log( req.session.tbl_usuario = `${result[0].id_usuario}`)
        res.redirect('/inicio/'+req.session.tbl_usuario)     
    })
})

app.get("/inicio/:id", function(req,res){
    res.sendFile(__dirname+"/paginaInicial.html")
        idusu = req.params.id
})

app.get("/criar", function(req,res){
    let id = idusu
    let nomeSala = req.query.nomesala
    console.log(id)
    console.log(nomeSala)
    let x = {"id":id, "nome": nomeSala}
    let sql = `insert into tbl_salas(nome_sala, id_criador) values ('${nomeSala}', '${id}')`
    conn.query(sql, function(error, result){})
    res.send(x)
})

app.listen(8080,function(){
    console.log("servidor rodando:)")
})