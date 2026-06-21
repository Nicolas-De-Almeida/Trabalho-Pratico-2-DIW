const params = new URLSearchParams(window.location.search);
const id = params.get("id");
const voltar = params.get("voltar") || "index.html";
const detalhes = document.getElementById("detalhes");
const containerMetas = document.getElementById("container-metas");

let usuarioAtual = null;
let favoritoId = null;

const usuarioStorage = sessionStorage.getItem("usuarioLogado");
if (usuarioStorage) {
    usuarioAtual = JSON.parse(usuarioStorage);
}

async function verificarFavorito() {
    if (!usuarioAtual) return false;
    try {
        const res = await fetch("http://localhost:3000/favoritos");
        const todos = await res.json();
        const fav = todos.find(f => String(f.usuarioId) === String(usuarioAtual.id) && String(f.projetoId) === String(id));
        if (fav) {
            favoritoId = fav.id;
            return true;
        }
        return false;
    } catch {
        return false;
    }
}

function atualizarBotaoFavorito() {
    const btn = document.getElementById("btn-fav-detalhe");
    if (!btn) return;
    const icone = btn.querySelector("i");
    if (favoritoId) {
        icone.className = "fa-solid fa-heart text-danger fs-3";
    } else {
        icone.className = "fa-regular fa-heart fs-3";
    }
}

async function alternarFavoritoDetalhes() {
    if (!usuarioAtual) return;
    try {
        if (favoritoId) {
            await fetch(`http://localhost:3000/favoritos/${favoritoId}`, { method: "DELETE" });
            favoritoId = null;
        } else {
            const res = await fetch("http://localhost:3000/favoritos", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    id: Date.now().toString(),
                    usuarioId: usuarioAtual.id,
                    projetoId: id
                })
            });
            const novo = await res.json();
            favoritoId = novo.id;
        }
        atualizarBotaoFavorito();
    } catch (error) {
        console.error(error);
    }
}

async function carregarDetalhes() {
    if (!id || !detalhes) return;

    try {
        const [respostaProjeto, respostaComentarios] = await Promise.all([
            fetch(`http://localhost:3000/projetos/${id}`),
            fetch(`http://localhost:3000/comentarios`)
        ]);

        if (!respostaProjeto.ok) {
            detalhes.innerHTML = "<h2 class='py-5 text-center'>Projeto não encontrado</h2>";
            return;
        }

        const item = await respostaProjeto.json();
        const todosComentarios = await respostaComentarios.json();
        const comentarios = todosComentarios.filter(c => String(c.projetoId) === String(id));
        const isFavorito = await verificarFavorito();

        const iconeCoracao = isFavorito ? "fa-solid fa-heart text-danger fs-3" : "fa-regular fa-heart fs-3";
        const btnFavHTML = usuarioAtual ? `
            <button id="btn-fav-detalhe" style="background: rgba(255,255,255,0.95); border: none; border-radius: 50%; width: 55px; height: 55px; display: flex; align-items: center; justify-content: center; cursor: pointer; box-shadow: 0 4px 12px rgba(0,0,0,0.15); transition: all 0.3s ease; flex-shrink: 0;">
                <i class="${iconeCoracao}"></i>
            </button>
        ` : "";

        const tagsHTML = item.tags ? item.tags.map(tag => `<span class="badge bg-info text-dark me-1">${tag}</span>`).join('') : '';

        detalhes.innerHTML = `
            <div class="px-2">
                <div class="d-flex align-items-start justify-content-between gap-3 mb-4">
                    <h1 class="display-4 fw-bold" style="color: rgb(46, 139, 87); font-size: 45px; margin: 0;">${item.titulo}</h1>
                    ${btnFavHTML}
                </div>
                <img src="${item.imagem}" class="img-fluid rounded-4 shadow mb-4 w-100" style="max-height: 800px; object-fit: cover;">
                <div class="mb-3">
                    <span class="badge bg-success fs-6">${item.categoria}</span>
                </div>
                <div class="row g-3 justify-content-center mb-4 fs-5 fw-medium text-secondary bg-light p-3 rounded-3 mx-1 text-center">
                    <div class="col-12 col-sm-6 col-md-3">Impacto: <br><span class="text-success fw-bold">${item.impactoCO2}</span></div>
                    <div class="col-12 col-sm-6 col-md-3">Equipe: <br><span class="text-success fw-bold">${item.voluntarios}</span></div>
                    <div class="col-12 col-sm-6 col-md-3">Região: <br><span class="text-success fw-bold">${item.regiao}</span></div>
                    <div class="col-12 col-sm-6 col-md-3">Início: <br><span class="text-success fw-bold">${item.anoInicio}</span></div>
                </div>
                <div class="mb-4">
                    <h4 class="fw-bold">Tags</h4>
                    <div>${tagsHTML}</div>
                </div>
                <p class="fs-4 text-dark fw-semibold mb-3">Objetivo Geral: ${item.descricaoCurta}</p>
                <p class="fs-5 text-secondary text-start mb-4" style="text-align: justify !important;">${item.conteudo}</p>
            </div>
        `;

        if (containerMetas && item.metas && item.metas.length > 0) {
            containerMetas.innerHTML = "";
            item.metas.forEach(meta => {
                containerMetas.innerHTML += `
                    <div class="col-6 col-lg-3">
                        <div class="card h-100 shadow-sm border-0 rounded-3 overflow-hidden">
                            <img src="${meta.imagem}" class="card-img-top" style="height:160px; object-fit:cover;">
                            <div class="card-body p-3 text-center bg-white">
                                <h6 class="fw-bold text-dark m-0 fs-5">${meta.titulo}</h6>
                            </div>
                        </div>
                    </div>
                `;
            });
        }

        let comentariosHTML = `
            <div class="mt-5 px-2">
                <h3 class="fw-bold mb-4" style="color: rgb(46, 139, 87);">Comentários da Comunidade</h3>
                <div class="row g-4 align-items-start">
        `;

        if (comentarios.length > 0) {
            comentarios.forEach(comentario => {
                let dataFormatada = comentario.data.split('-').reverse().join('/');
                comentariosHTML += `
                    <div class="col-12 col-md-6">
                        <div class="card border-0 shadow-sm rounded-4 p-3 bg-light" style="height: auto !important; min-height: 0 !important;">
                            <div class="d-flex justify-content-between align-items-center mb-3">
                                <h5 class="fw-bold m-0 text-dark">${comentario.autor}</h5>
                                <small class="text-muted fw-semibold">${dataFormatada}</small>
                            </div>
                            <p class="text-secondary m-0 fs-5" style="font-style: italic;">"${comentario.texto}"</p>
                        </div>
                    </div>
                `;
            });
        } else {
            comentariosHTML += `<div class="col-12"><p class="text-muted fs-5">Nenhum comentário encontrado.</p></div>`;
        }

        comentariosHTML += `</div></div>`;
        detalhes.innerHTML += comentariosHTML;

        if (usuarioAtual) {
            document.getElementById("btn-fav-detalhe").addEventListener("click", alternarFavoritoDetalhes);
        }

    } catch (erro) {
        detalhes.innerHTML = "<h2 class='py-5 text-center'>Erro ao carregar os dados</h2>";
    }
}

carregarDetalhes();
document.querySelector(".btn-voltar").setAttribute("href", voltar);