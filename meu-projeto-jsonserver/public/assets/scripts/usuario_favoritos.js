const containerFavoritos = document.getElementById("container-favoritos");
const apiUrlProjetos = "http://localhost:3000/projetos";
const apiUrlFavoritos = "http://localhost:3000/favoritos";
let usuario = null;
const usuarioLogado = sessionStorage.getItem("usuarioLogado");
if (usuarioLogado) {
  usuario = JSON.parse(usuarioLogado);
}

async function carregarFavoritos() {
  if (!usuario) return;
  try {
    const resFavs = await fetch(apiUrlFavoritos);
    const todosFavs = await resFavs.json();
    const meusFavoritos = todosFavs.filter(f => String(f.usuarioId) === String(usuario.id));

    if (meusFavoritos.length === 0) {
      containerFavoritos.innerHTML = "<p class='text-center w-100 fs-5 text-muted'>Nenhum projeto favoritado ainda.</p>";
      return;
    }

    const resProjetos = await fetch(apiUrlProjetos);
    const todosProjetos = await resProjetos.json();
    const projetosFavoritados = todosProjetos.filter(projeto =>
      meusFavoritos.some(fav => String(fav.projetoId) === String(projeto.id))
    );

    renderizarFavoritos(projetosFavoritados, meusFavoritos);
  } catch (error) {
    console.error(error);
  }
}

function renderizarFavoritos(projetos, listaFavoritosId) {
  containerFavoritos.innerHTML = "";
  projetos.forEach(projeto => {
    const favData = listaFavoritosId.find(f => String(f.projetoId) === String(projeto.id));
    const card = `
      <div class="col">
        <div class="card h-100 border-0 shadow-sm rounded-4 overflow-hidden">
          <div class="card-img-wrapper">
            <img src="${projeto.imagem || 'assets/img/default.jpg'}" class="card-img-top" alt="${projeto.titulo}" style="height: 300px; object-fit: cover;">
            <button class="btn-favorito-floating btn-remover-fav" data-favid="${favData.id}">
              <i class="fa-solid fa-heart text-danger fs-4"></i>
            </button>
          </div>
          <div class="card-body text-center p-4 d-flex flex-column justify-content-between">
            <div>
              <h4 class="fw-bold mb-2" style="color: rgb(46, 139, 87);">${projeto.titulo}</h4>
              <p class="text-muted mb-1"><span class="badge bg-success">${projeto.categoria || ''}</span></p>
              <p class="text-secondary fs-6 mb-2">${projeto.descricao || ''}</p>
              <p class="text-muted small mb-1"><i class="fas fa-map-marker-alt me-1"></i>${projeto.regiao || ''}</p>
              <p class="text-muted small mb-3"><i class="fas fa-users me-1"></i>${projeto.voluntarios || ''}</p>
            </div>
            <a href="detalhes.html?id=${projeto.id}&voltar=usuario_favoritos.html" class="btn btn-success py-2 fs-5 fw-semibold border-0 w-100" style="background-color: rgb(46, 139, 87);">
              Ver Detalhes
            </a>
          </div>
        </div>
      </div>
    `;
    containerFavoritos.insertAdjacentHTML("beforeend", card);
  });

  document.querySelectorAll(".btn-remover-fav").forEach(btn => {
    btn.addEventListener("click", removerFavorito);
  });
}

async function removerFavorito(e) {
  const favId = e.currentTarget.getAttribute("data-favid");
  try {
    await fetch(`${apiUrlFavoritos}/${favId}`, { method: "DELETE" });
    carregarFavoritos();
  } catch (error) {
    console.error(error);
  }
}

document.addEventListener("DOMContentLoaded", carregarFavoritos);