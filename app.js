'use strict';

import { getContatos, postContato } from './contatos.js';

const corpoTabela = document.getElementById('corpo-tabela');
const botaoSalvar = document.getElementById('salvar');

function criarLinha(contato) {
    const linha = document.createElement('tr');

    const colunaId = document.createElement('td');
    colunaId.textContent = contato.id ?? '';

    const colunaNome = document.createElement('td');
    colunaNome.textContent = contato.nome ?? '';

    const colunaEmail = document.createElement('td');
    colunaEmail.textContent = contato.email ?? '';

    const colunaTelefone = document.createElement('td');
    colunaTelefone.textContent = contato.telefone ?? contato.celular ?? '';

    const colunaEndereco = document.createElement('td');
    colunaEndereco.textContent = contato.endereco ?? '';

    linha.append(colunaId, colunaNome, colunaEmail, colunaTelefone, colunaEndereco);

    return linha;
}

function limparCampos() {
    document.getElementById('nome').value = '';
    document.getElementById('email').value = '';
    document.getElementById('telefone').value = '';
    document.getElementById('endereco').value = '';
}

function pegarContatoDoFormulario() {
    return {
        nome: document.getElementById('nome').value,
        email: document.getElementById('email').value,
        celular: document.getElementById('telefone').value,
        endereco: document.getElementById('endereco').value
    };
}

async function preencherTabela() {
    const resposta = await getContatos();
    const contatos = Array.isArray(resposta) ? resposta : resposta.contatos ?? [];

    contatos.forEach((contato) => {
        corpoTabela.appendChild(criarLinha(contato));
    });
}

async function salvarContato() {
    const contato = pegarContatoDoFormulario();
    const resposta = await postContato(contato);
    const contatoCadastrado = {
        ...contato,
        ...resposta.contato,
        id: resposta.id ?? resposta.contato?.id ?? ''
    };

    corpoTabela.appendChild(criarLinha(contatoCadastrado));
    limparCampos();
}

botaoSalvar.addEventListener('click', salvarContato);

preencherTabela();
