const apiUrl = "http://localhost:3000/projetos";

const inputId = document.getElementById("inputId");
const inputTitulo = document.getElementById("inputTitulo");
const inputCategoria = document.getElementById("inputCategoria");
const inputVoluntarios = document.getElementById("inputVoluntarios");
const inputImagem = document.getElementById("inputImagem");

const btnInserir = document.getElementById("btnInserir");
const btnAlterar = document.getElementById("btnAlterar");
const btnExcluir = document.getElementById("btnExcluir");
const btnLimpar = document.getElementById("btnLimpar");
const tabelaItens = document.getElementById("tabelaItens");

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
                <td class="py-3">${projeto.voluntarios || 0}</td>
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
    inputImagem.value = projeto.imagem || "";
}

function limparFormulario() {
    inputId.value = "";
    inputTitulo.value = "";
    inputCategoria.value = "";
    inputVoluntarios.value = "";
    inputImagem.value = "";
}

btnLimpar.addEventListener("click", limparFormulario);

btnInserir.addEventListener("click", async () => {
    if (!inputTitulo.value || !inputCategoria.value) {
        alert("Preencha os campos obrigatórios!");
        return;
    }

    const novoProjeto = {
        id: Date.now().toString(),
        titulo: inputTitulo.value,
        categoria: inputCategoria.value,
        voluntarios: parseInt(inputVoluntarios.value) || 0,
        imagem: inputImagem.value
    };

    try {
        await fetch(apiUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(novoProjeto)
        });
        limparFormulario();
        carregarProjetos();
    } catch (error) {
        console.error(error);
    }
});

btnAlterar.addEventListener("click", async () => {
    const id = inputId.value;
    if (!id) {
        alert("Selecione um projeto na tabela para alterar!");
        return;
    }

    if (!inputTitulo.value || !inputCategoria.value) {
        alert("Preencha os campos obrigatórios!");
        return;
    }

    const projetoAtualizado = {
        titulo: inputTitulo.value,
        categoria: inputCategoria.value,
        voluntarios: parseInt(inputVoluntarios.value) || 0,
        imagem: inputImagem.value
    };

    try {
        await fetch(`${apiUrl}/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(projetoAtualizado)
        });
        limparFormulario();
        carregarProjetos();
    } catch (error) {
        console.error(error);
    }
});

btnExcluir.addEventListener("click", async () => {
    const id = inputId.value;
    if (!id) {
        alert("Selecione um projeto na tabela para excluir!");
        return;
    }

    try {
        await fetch(`${apiUrl}/${id}`, {
            method: "DELETE"
        });
        limparFormulario();
        carregarProjetos();
    } catch (error) {
        console.error(error);
    }
});

document.addEventListener("DOMContentLoaded", carregarProjetos);