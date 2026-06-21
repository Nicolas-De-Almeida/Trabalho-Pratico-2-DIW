const apiUrl = "http://localhost:3000/projetos";

const inputId = document.getElementById("inputId");
const inputTitulo = document.getElementById("inputTitulo");
const inputCategoria = document.getElementById("inputCategoria");
const inputVoluntarios = document.getElementById("inputVoluntarios");
const inputAnoInicio = document.getElementById("inputAnoInicio");
const inputRegiao = document.getElementById("inputRegiao");
const inputImpacto = document.getElementById("inputImpacto");
const inputDescricao = document.getElementById("inputDescricao");
const inputConteudo = document.getElementById("inputConteudo");
const inputImagem = document.getElementById("inputImagem");
const inputImagemCarrossel = document.getElementById("inputImagemCarrossel");
const inputTags = document.getElementById("inputTags");
const inputDestaque = document.getElementById("inputDestaque");
const inputMeta1Titulo = document.getElementById("inputMeta1Titulo");
const inputMeta1Imagem = document.getElementById("inputMeta1Imagem");
const inputMeta2Titulo = document.getElementById("inputMeta2Titulo");
const inputMeta2Imagem = document.getElementById("inputMeta2Imagem");
const inputMeta3Titulo = document.getElementById("inputMeta3Titulo");
const inputMeta3Imagem = document.getElementById("inputMeta3Imagem");
const inputMeta4Titulo = document.getElementById("inputMeta4Titulo");
const inputMeta4Imagem = document.getElementById("inputMeta4Imagem");
const tabelaItens = document.getElementById("tabelaItens");

function getTags() {
    return inputTags.value.split(',').map(t => t.trim()).filter(t => t !== '');
}

function getMetas() {
    const metas = [
        { titulo: inputMeta1Titulo.value, imagem: inputMeta1Imagem.value },
        { titulo: inputMeta2Titulo.value, imagem: inputMeta2Imagem.value },
        { titulo: inputMeta3Titulo.value, imagem: inputMeta3Imagem.value },
        { titulo: inputMeta4Titulo.value, imagem: inputMeta4Imagem.value }
    ];
    return metas.filter(m => m.titulo || m.imagem);
}

function montarProjeto(id) {
    const descricao = inputDescricao.value;
    const conteudo = inputConteudo.value;
    return {
        id: id,
        titulo: inputTitulo.value,
        descricaoCurta: descricao,
        descricao: descricao,
        descricaoCompleta: conteudo,
        conteudo: conteudo,
        imagem: inputImagem.value,
        imagemCarrossel: inputImagemCarrossel.value || inputImagem.value,
        categoria: inputCategoria.value,
        tags: getTags(),
        destaque: inputDestaque.checked,
        impactoCO2: inputImpacto.value,
        voluntarios: inputVoluntarios.value,
        regiao: inputRegiao.value,
        anoInicio: inputAnoInicio.value,
        metas: getMetas()
    };
}

async function carregarProjetos() {
    try {
        const response = await fetch(apiUrl);
        const projetos = await response.json();
        tabelaItens.innerHTML = "";
        projetos.forEach(projeto => {
            const tr = document.createElement("tr");
            tr.style.cursor = "pointer";
            tr.innerHTML = `
                <td class="py-3 fw-bold">${projeto.id}</td>
                <td class="py-3 text-start">${projeto.titulo}</td>
                <td class="py-3">${projeto.categoria}</td>
                <td class="py-3">${projeto.regiao || ''}</td>
            `;
            tr.addEventListener("click", () => preencherFormulario(projeto));
            tabelaItens.appendChild(tr);
        });
    } catch (error) {
        console.error(error);
    }
}

function preencherFormulario(projeto) {
    inputId.value = projeto.id;
    inputTitulo.value = projeto.titulo;
    inputCategoria.value = projeto.categoria;
    inputVoluntarios.value = projeto.voluntarios || "";
    inputAnoInicio.value = projeto.anoInicio || "";
    inputRegiao.value = projeto.regiao || "";
    inputImpacto.value = projeto.impactoCO2 || "";
    inputDescricao.value = projeto.descricaoCurta || projeto.descricao || "";
    inputConteudo.value = projeto.conteudo || projeto.descricaoCompleta || "";
    inputImagem.value = projeto.imagem || "";
    inputImagemCarrossel.value = projeto.imagemCarrossel || "";
    inputTags.value = Array.isArray(projeto.tags) ? projeto.tags.join(', ') : "";
    inputDestaque.checked = projeto.destaque === true;

    const metas = projeto.metas || [];
    inputMeta1Titulo.value = metas[0]?.titulo || "";
    inputMeta1Imagem.value = metas[0]?.imagem || "";
    inputMeta2Titulo.value = metas[1]?.titulo || "";
    inputMeta2Imagem.value = metas[1]?.imagem || "";
    inputMeta3Titulo.value = metas[2]?.titulo || "";
    inputMeta3Imagem.value = metas[2]?.imagem || "";
    inputMeta4Titulo.value = metas[3]?.titulo || "";
    inputMeta4Imagem.value = metas[3]?.imagem || "";
}

function limparFormulario() {
    inputId.value = "";
    inputTitulo.value = "";
    inputCategoria.value = "";
    inputVoluntarios.value = "";
    inputAnoInicio.value = "";
    inputRegiao.value = "";
    inputImpacto.value = "";
    inputDescricao.value = "";
    inputConteudo.value = "";
    inputImagem.value = "";
    inputImagemCarrossel.value = "";
    inputTags.value = "";
    inputDestaque.checked = false;
    inputMeta1Titulo.value = "";
    inputMeta1Imagem.value = "";
    inputMeta2Titulo.value = "";
    inputMeta2Imagem.value = "";
    inputMeta3Titulo.value = "";
    inputMeta3Imagem.value = "";
    inputMeta4Titulo.value = "";
    inputMeta4Imagem.value = "";
}

document.getElementById("btnLimpar").addEventListener("click", limparFormulario);

document.getElementById("btnInserir").addEventListener("click", async () => {
    if (!inputTitulo.value || !inputCategoria.value || !inputDescricao.value) {
        alert("Preencha os campos obrigatórios!");
        return;
    }
    try {
        await fetch(apiUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(montarProjeto(Date.now().toString()))
        });
        limparFormulario();
        carregarProjetos();
    } catch (error) {
        console.error(error);
    }
});

document.getElementById("btnAlterar").addEventListener("click", async () => {
    const id = inputId.value;
    if (!id) {
        alert("Selecione um projeto na tabela para alterar!");
        return;
    }
    if (!inputTitulo.value || !inputCategoria.value || !inputDescricao.value) {
        alert("Preencha os campos obrigatórios!");
        return;
    }
    try {
        await fetch(`${apiUrl}/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(montarProjeto(id))
        });
        limparFormulario();
        carregarProjetos();
    } catch (error) {
        console.error(error);
    }
});

document.getElementById("btnExcluir").addEventListener("click", async () => {
    const id = inputId.value;
    if (!id) {
        alert("Selecione um projeto na tabela para excluir!");
        return;
    }
    if (!confirm("Tem certeza que deseja excluir este projeto?")) return;
    try {
        await fetch(`${apiUrl}/${id}`, { method: "DELETE" });
        limparFormulario();
        carregarProjetos();
    } catch (error) {
        console.error(error);
    }
});

document.addEventListener("DOMContentLoaded", carregarProjetos);