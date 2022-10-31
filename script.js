function pesquisa(x){
    x.preventDefault()
    let sala = document.getElementById("pesquisar").value
    const conn = require("./banco")
    let nome, id
    sql = `select id_sala from tbl_salas where nome = '${sala}'`
    conn.query(sql, function(error, result){
        req.session.nome_sala = `${result[0].nome_sala}`
        req.session.id_sala = `${result[0].id_sala}`
        tabela = "<table border='1'>"
        tabela + "<tr>"
        tabela + `<td>'${req.session.nome_sala = `${result[0].nome_sala}`}'</td>`
        tabela + `<td>'${req.session.id_sala = `${result[0].id_sala}`}'</td>`
        tabela + "</tr>";
        tabela + "</table>"
    })

    let data = fazGet(tabela)
    let z = JSON.parse(data) //converte o valor em json
    let p = document.createElement("p") //aqui ele cria um elemento da tag <p>


    p.innerHTML = z.nome + " - " + z.id  //configuro o paragrafo
    let div = document.getElementById("msg") //vinculo o paragrafo a uma div do html
    div.appendChild(p)//inclui um elemento filho pra div (insiro nela)
}

function fazGet(id, nome){ // esse é o ajax
    let request = new XMLHttpRequest()
    let dados = id + nome
    request.open("get", "http://localhost:8080/inicio/"+dados)
    request.send()
    return request.responseText
}
