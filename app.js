'use strict';

import { getContatos, postContato, putContato, deleteContato } from './contatos.js';

const corpoTabela = document.getElementById('corpo-tabela');
const botaoSalvar = document.getElementById('salvar');
const botaoAtualizar = document.getElementById('atualizar');
const botaoExcluir = document.getElementById('excluir');
const botaoLimpar = document.getElementById('limpar');
const campoId = document.getElementById('id-contato');

let contatoSelecionado = null;

function criarLinha(contato) {
    const linha = document.createElement('tr');
    linha.style.cursor = 'pointer';
    linha.onclick = () => selecionarContato(contato, linha);

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

    const colunaUrlFoto = document.createElement('td');
    colunaUrlFoto.textContent = contato['url-foto'] ?? '';

    linha.append(colunaId, colunaNome, colunaEmail, colunaTelefone, colunaEndereco, colunaUrlFoto);
    linha.dataset.id = contato.id;

    return linha;
}

function limparCampos() {
    document.getElementById('nome').value = '';
    document.getElementById('email').value = '';
    document.getElementById('telefone').value = '';
    document.getElementById('endereco').value = '';
    document.getElementById('url-foto').value = '';
    campoId.value = '';
    contatoSelecionado = null;
    
    document.querySelectorAll('tbody tr').forEach(row => row.classList.remove('selecionada'));
}

function pegarContatoDoFormulario() {
    return {
        nome: document.getElementById('nome').value,
        email: document.getElementById('email').value,
        celular: document.getElementById('telefone').value,
        endereco: document.getElementById('endereco').value,
        'url-foto': document.getElementById('url-foto').value
    };
}

function selecionarContato(contato, linha) {
    document.querySelectorAll('tbody tr').forEach(row => row.classList.remove('selecionada'));
    linha.classList.add('selecionada');
    
    contatoSelecionado = contato;
    campoId.value = contato.id;
    document.getElementById('nome').value = contato.nome ?? '';
    document.getElementById('email').value = contato.email ?? '';
    document.getElementById('telefone').value = contato.telefone ?? contato.celular ?? '';
    document.getElementById('endereco').value = contato.endereco ?? '';
    document.getElementById('url-foto').value = contato['url-foto'] ?? '';
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
    if (!contato.nome || !contato.email) {
        alert('Por favor, preencha Nome e Email');
        return;
    }
    
    try {
        const resposta = await postContato(contato);
        const contatoCadastrado = {
            ...contato,
            ...resposta.contato,
            id: resposta.id ?? resposta.contato?.id ?? ''
        };
        
        corpoTabela.appendChild(criarLinha(contatoCadastrado));
        limparCampos();
        alert('Contato salvo com sucesso!');
    } catch (erro) {
        alert('Erro ao salvar contato: ' + erro.message);
    }
}

async function atualizarContato() {
    if (!contatoSelecionado) {
        alert('Selecione um contato para atualizar');
        return;
    }

    const contato = pegarContatoDoFormulario();
    if (!contato.nome || !contato.email) {
        alert('Por favor, preencha Nome e Email');
        return;
    }

    try {
        await putContato(contatoSelecionado.id, contato);
        
        const linha = document.querySelector(`tr[data-id="${contatoSelecionado.id}"]`);
        if (linha) {
            linha.remove();
        }
        
        const contatoAtualizado = {
            ...contato,
            id: contatoSelecionado.id
        };
        corpoTabela.appendChild(criarLinha(contatoAtualizado));
        limparCampos();
        alert('Contato atualizado com sucesso!');
    } catch (erro) {
        alert('Erro ao atualizar contato: ' + erro.message);
    }
}

async function excluirContato() {
    if (!contatoSelecionado) {
        alert('Selecione um contato para excluir');
        return;
    }

    if (confirm(`Tem certeza que deseja excluir o contato "${contatoSelecionado.nome}"?`)) {
        try {
            await deleteContato(contatoSelecionado.id);
            
            const linha = document.querySelector(`tr[data-id="${contatoSelecionado.id}"]`);
            if (linha) {
                linha.remove();
            }
            
            limparCampos();
            alert('Contato excluído com sucesso!');
        } catch (erro) {
            alert('Erro ao excluir contato: ' + erro.message);
        }
    }
}

botaoSalvar.addEventListener('click', salvarContato);
botaoAtualizar.addEventListener('click', atualizarContato);
botaoExcluir.addEventListener('click', excluirContato);
botaoLimpar.addEventListener('click', limparCampos);

preencherTabela();
