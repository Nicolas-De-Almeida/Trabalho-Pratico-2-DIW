const params = new URLSearchParams(window.location.search);
const id = params.get("id");
const detalhes = document.getElementById("detalhes");
const containerMetas = document.getElementById("container-metas");

async function carregarDetalhes() {
    if (!id || !detalhes) return;

    try {
        const [respostaProjeto, respostaComentarios] = await Promise.all([
            fetch(`http://localhost:3000/projetos/${id}`),
            fetch(`http://localhost:3000/comentarios?projetoId=${id}`)
        ]);

        if (!respostaProjeto.ok) {
            detalhes.innerHTML = "<h2 class='py-5 text-center'>Projeto não encontrado</h2>";
            return;
        }

        const item = await respostaProjeto.json();
        const comentarios = await respostaComentarios.json();

        const tagsHTML = item.tags.map(tag => `<span class="badge bg-info text-dark me-1">${tag}</span>`).join('');

        detalhes.innerHTML = `
            <div class="px-2">
                <h1 class="display-4 fw-bold mb-4" style="color: rgb(46, 139, 87); font-size: 45px;">${item.titulo}</h1>
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

    } catch (erro) {
        detalhes.innerHTML = "<h2 class='py-5 text-center'>Erro ao carregar os dados</h2>";
    }
}

carregarDetalhes();