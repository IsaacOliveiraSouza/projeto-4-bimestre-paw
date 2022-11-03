/*
- mensagens com mais like
*/
const express = require("express")
const app = express()
const bodyparser = require("body-parser")

app.use(bodyparser.urlencoded({extended:false}))
app.use(bodyparser.json())
const conn = require("./banco")
//bagui pra usar a pasta public, acho q é onde coloca os ajax
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

//rota da pagina cadastro
app.get("/cadastro", function(req,res){
    res.sendFile(__dirname+"/cadastro.html")
})
//faz o cadastro do usuario na tbl
app.get("/cadastrarUsuario", function(req,res){
    let nome = req.query.nome
    let email = req.query.email
    let senha = req.query.senha
    //let x = {"nome": nome, "email": email, "senha":senha}
    let sql = `insert into tbl_usuario(nome, email, senha) values ('${nome}', '${email}', '${senha}');` 
    conn.query(sql, function(error, result){})
    redirect("/")
})

//rota da pagina login
app.get("/", function(req,res){
    res.sendFile(__dirname+"/login.html")
})
//variavel q pega o id
let id_usu=""
let id_sala=""
let nome_usu=""
//loga o usuario e manda ele pra pagina principal
app.get('/loginUsuario', function(req,res){
    let email = req.query.email
    let senha = req.query.senha
    let sql = `select * from tbl_usuario where email = '${email}' and senha = '${senha}'`
    conn.query(sql, function(error, result){
        console.log(result)
        console.log(email)
        console.log(senha)
        //let id = result[ { id_usuario } ]
       // logado(id)
       console.log( req.session.tbl_usuario = `${result[0].id_usuario}`)
       nome_usu = result[0].nome
       console.log(nome_usu)
        res.redirect('/inicio/'+req.session.tbl_usuario)     
    })
})
//rota da pagina inicial
app.get("/inicio/:id", function(req,res){
    res.sendFile(__dirname+"/paginaInicial.html")
        id_usu = req.params.id
        console.log("id_usu:" + id_usu)
})
//cria sala no banco
app.get("/criar", function(req,res){
    let id = id_usu
    let nomeSala = req.query.nomesala
    console.log(id)
    console.log(nomeSala)
    let x = {"id":id_usu, "nome": nomeSala}
    let sql = `insert into tbl_salas(nome_sala, id_criador) values ('${nomeSala}', '${id_usu}')`
    conn.query(sql, function(error, result){})

    //res.send(x)
})
//Faz o bagui do json pra printar as salas
app.get("/mostrarSalas", function(req,res){
    let sql = `select * from tbl_salas`
    let json = { sucess: '', info: [], erro: '' }
    conn.query(sql, function(error, result){
        json.sucess = true
        for(x in result){
            json.info.push({
                nome: result[x].nome_sala,
                id: result[x].id_sala
            })
        }
        res.json(json)
    })
})
//rota da pagina que representa as salas com o id de uma determinada sala
app.get("/Sala/:id_sala", function(req, res){
    res.sendFile(__dirname+"/salas.html")
    id_sala = req.params.id_sala
})

app.get("/top10", function(req, res){
    res.sendFile(__dirname+"/maisCurtidas.html")
})


app.get("/enviarMsg", function(req,res){
    let  data = new Date()
    let dia =  data.getDate().toString().padStart(2, '0')
    let mes = (data.getMonth()+1).toString().padStart(2,'0');  
    let ano = data.getFullYear()
    let dia_atual = `${dia}/${mes}/${ano}`
    console.log(dia_atual)
    let msg = req.query.msg
    msg = msg.replace(/merda/g, "*").replace(/porra/g, "*").replace(/bosta/g, "*").replace(/filha da puta/g, " *").replace(/arrombado/g, "*").replace(/Filha da puta/g, "*").replace(/buceta/g, "*")
    let x = {"idUsu": id_usu, "id_sala":id_sala, "msg":msg}
    console.log(id_sala, msg, dia_atual, nome_usu)
    let sql = `insert into tbl_mensagem(fk_idsala, mensagem, id_usuario, data, likes, nome_usuario) 
    values('${id_sala}', '${msg}', '${id_usu}','${dia_atual}' , 0, '${nome_usu}')`
    conn.query(sql, function(error, result){})
    //res.send(x)
})

app.get("/mostrarMsg", function(req,res){
    let sql = `select * from tbl_mensagem where fk_idsala =${id_sala}`
    let json = { sucess: '', info: [], erro: '' }
    conn.query(sql, function(error, result){
        json.sucess = true
        for(x in result){
            console.log(result[x].mensagem)
            console.log(result[x].nome_usuario)
            json.info.push({
                nome: result[x].nome_usuario,
                msg: result[x].mensagem,
                data: result[x].data,
                curtida: result[x].id_mensagem
            })
        }
        res.json(json)
    })
})

app.get("/maisCurtidas", function(req, res){
    let sql = `select * from tbl_mensagem order by likes desc`
    let json = { sucess: '', info: [], erro: '' }
    conn.query(sql, function(error, result){
        json.sucess = true
        for(x in result){
            json.info.push({
                msg: result[x].mensagem,
                likes: result[x].likes
            })
        }
        res.json(json)
    })
})

app.get("/pesquisa", function(req,res){
    let nome_salaa = req.query.nomee
    //console.log(nome_salaa)
    let sql = `select * from tbl_salas where nome_sala = '${nome_salaa}'`
    let json = { sucess: '', info: [], erro: '' }
        conn.query(sql, function(error, result){
            /*json.sucess = true
            for(x in result){
                //console.log(result[x].id_sala)
                json.info.push({
                    id:result[x].id_sala
                })
            }
            res.json(json)*/
            res.redirect("/Sala/"+result[0].id_sala)
        })
        
})

app.get("/curtir/:idMsg", function(req,res){
    console.log("----------------")
    let idMsg = req.params.idMsg
    let sql = `update tbl_mensagem set likes = likes+1 where id_mensagem = ${idMsg}`
    conn.query(sql, function(error, result){
        console.log("entrou update")
    })
})



app.listen(8080,function(){
    console.log("servidor rodando:)")
})