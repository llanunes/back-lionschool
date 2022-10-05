const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const {  
    getAlunos, 
    getDisciplinas,
    getAlunoPorCurso,
    getAluno,
    getAlunoPorStatus,
    getAlunoPorAnoDeConclusao,
    getFiltrarAlunosPorStatus,
    filtrarAlunosPorAnoDeConclusao } = require('../modulos/alunos.js');

const { getCursos } = require('../modulos/cursos');

const app = express()

app.use((request, response, next) => {
    response.header('Access-Control-Allow-Origin', '*');
    response.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    app.use(cors());

    next();
});


// Endpoint para listar os cursos - certinho
app.get('/.netlify/functions/api/cursos', cors(), async (request, response, next) => {
    let cursos = getCursos()

    if (cursos) {
        response.status(200);
        response.json({ cursos });
    } else {
        response.status(404);
    }
});

// Endpoint para listar todos os alunos - certinho
app.get('/.netlify/functions/api/alunos', cors(), async (request, response, next) => {
    let listaAlunos = getAlunos();

    if (listaAlunos) {
        response.status(200);
        response.json({ listaAlunos });
    } else {
        response.status(404);
    }
});

// Endpoint para listar todos os alunos de um curso - certinho
 app.get('/.netlify/functions/api/alunos/curso/?', cors(), async (request, response, next) => {
    let nomeDoCurso = request.query.curso;
    let statusAluno = request.query.status;
    let dataDeConclusao = request.query.conclusao;
    
    let listaAlunos = getAlunoPorCurso(nomeDoCurso);
    if (statusAluno != undefined) {
        listaAlunos = getFiltrarAlunosPorStatus(listaAlunos, statusAluno);
    }
    if (dataDeConclusao != undefined) {
        listaAlunos = filtrarAlunosPorAnoDeConclusao(listaAlunos, dataDeConclusao);
    }

    if (listaAlunos) {
        response.status(200);
        response.json({ listaAlunos });
    } else {
        response.status(404);
    }
});


// Endpoint para listar as informacoes de um aluno pelo numero de matricula - certinho
app.get('/.netlify/functions/api/aluno/matricula/:matricula', cors(), async (request, response, next) => {
    let matriculaAluno = request.params.matricula;
    let informacaoAluno = getAluno(matriculaAluno);

    if (informacaoAluno) {
        response.status(200);
        response.json({ informacaoAluno });
    } else {
        response.status(404);
    }
});

// Endpoint para listar alunos a partir de um status 
app.get('/.netlify/functions/api/:status/alunos', cors(), async (request, response, next) => {
    let status = request.params.status;
    let listaAlunos = getAlunoPorStatus(status);

    if (listaAlunos) {
        response.status(200);
        response.json({ listaAlunos });
    } else {
        response.status(404);
    }
});

// Endpoint para listar alunos a partir de um ano de conclusao
app.get('/.netlify/functions/api/alunos/conclusao/:data', cors(), async (request, response, next) => {
    let date = request.params.data;
    let listaAlunos = getAlunoPorAnoDeConclusao(date);

    if (listaAlunos) {
        response.status(200);
        response.json({ listaAlunos });
    } else {
        response.status(404);
    }
});

// endpoint para listar as disciplinas de um aluno atraves da matricula
app.get('/.netlify/functions/api/:matricula/disciplinas', cors(), async (request, response, next) => {
    let matricula = request.params.matricula;
    let disciplinas = getDisciplinas(matricula);

    if (disciplinas) {
        response.status(200);
        response.json({ disciplinas });
    } else {
        response.status(404);
    }
});


// app.listen(8080, function() {
//     console.log('Servidor aguardando requisições...');
// });

module.exports = app;