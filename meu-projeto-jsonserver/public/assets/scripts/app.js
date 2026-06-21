let todosProjetos = [];
let meusFavoritos = [];
let usuario = null;

async function fetchDados() {
  try {
    const responseProjetos = await fetch("http://localhost:3000/projetos");
    todosProjetos = await responseProjetos.json();

    const usuarioStorage = sessionStorage.getItem("usuarioLogado");
    if (usuarioStorage) {
      usuario = JSON.parse(usuarioStorage);
      try {
        const responseFavs = await fetch(`http://localhost:3000/favoritos`);
        const todosFavs = await responseFavs.json();
        meusFavoritos = todosFavs.filter(f => String(f.usuarioId) === String(usuario.id));
      } catch (err) {
        console.error("Falha ao buscar favoritos", err);
      }
    }

    renderCarrossel(todosProjetos);
    renderCards(todosProjetos);

  } catch (error) {
    console.error("Erro geral: ", error);
  }
}

function createCard(item) {
  const col = document.createElement("div");
  col.className = "col-12 col-md-4 mb-4";

  let isFavorito = false;
  let favId = "";
  
  if (usuario) {
    const fav = meusFavoritos.find(f => String(f.projetoId) === String(item.id));
    if (fav) {
      isFavorito = true;
      favId = fav.id;
    }
  }

  const iconeCoracao = isFavorito ? "fa-solid fa-heart text-danger" : "fa-regular fa-heart";
  
  const btnFavoritoHTML = usuario ? `
    <button class="btn-favorito-floating btn-favorito" data-id="${item.id}" data-favid="${favId}">
      <i class="${iconeCoracao} fs-4"></i>
    </button>
  ` : "";

  col.innerHTML = `
    <div class="card h-100 border-0 shadow-sm rounded-4 overflow-hidden">
      <div class="card-img-wrapper">
        <img src="${item.imagem}" class="card-img-top">
        ${btnFavoritoHTML}
      </div>
      <div class="card-body text-center p-4 d-flex flex-column justify-content-between">
        <div>
          <h4 class="fw-bold mb-3" style="color: rgb(46, 139, 87);">${item.titulo}</h4>
          <p class="text-secondary fs-5 mb-4">${item.descricao}</p>
        </div>
        <a href="detalhes.html?id=${item.id}" class="btn btn-success py-2 fs-5 fw-semibold border-0 w-100" style="background-color: rgb(46, 139, 87);">
          Ver detalhes
        </a>
      </div>
    </div>
  `;

  if (usuario) {
    const btnFavorito = col.querySelector('.btn-favorito');
    btnFavorito.addEventListener('click', (e) => alternarFavorito(e, item.id, favId));
  }

  return col;
}

async function alternarFavorito(e, projetoId, favId) {
  e.preventDefault();
  
  try {
    if (favId) {
      await fetch(`http://localhost:3000/favoritos/${favId}`, { method: "DELETE" });
    } else {
      await fetch(`http://localhost:3000/favoritos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: Date.now().toString(),
          usuarioId: usuario.id,
          projetoId: projetoId
        })
      });
    }
    
    const responseFavs = await fetch(`http://localhost:3000/favoritos`);
    const todosFavs = await responseFavs.json();
    meusFavoritos = todosFavs.filter(f => String(f.usuarioId) === String(usuario.id));
    
    aplicarPesquisa();

  } catch (error) {
    console.error(error);
  }
}

function renderCards(items) {
  const container = document.getElementById("container-projetos");
  if (!container) return;
  
  container.innerHTML = "";
  items.forEach(item => {
    container.appendChild(createCard(item));
  });
}

function aplicarPesquisa() {
  const campoPesquisa = document.getElementById("campoPesquisa");
  if (!campoPesquisa) {
    renderCards(todosProjetos);
    return;
  }

  const termo = campoPesquisa.value.toLowerCase().trim();
  if (termo === "") {
    renderCards(todosProjetos);
  } else {
    const filtrados = todosProjetos.filter(item => {
      const matchTitulo = item.titulo && item.titulo.toLowerCase().includes(termo);
      const matchDescricao = item.descricao && item.descricao.toLowerCase().includes(termo);
      return matchTitulo || matchDescricao;
    });
    renderCards(filtrados);
  }
}

function renderCarrossel(items) {
  const containerCarrossel = document.getElementById("container-carrossel");
  if (!containerCarrossel) return;

  let primeiro = true;
  items.forEach(item => {
    if (item.destaque) {
      let classeActive = primeiro ? "active" : "";
      primeiro = false;
      containerCarrossel.innerHTML += `
        <div class="carousel-item ${classeActive}">
          <a href="detalhes.html?id=${item.id}" class="text-decoration-none">
            <div style="height: 780px; position: relative; width: 100%;">
              <img src="${item.imagemCarrossel}" class="d-block w-100 h-100" style="object-fit: cover;">
              <div style="position: absolute; top:0; left:0; width:100%; height:100%; background: linear-gradient(180deg, rgba(0,0,0,0.1) 40%, rgba(0,0,0,0.75) 100%);"></div>
            </div>
            <div class="carousel-caption text-start px-4 pb-5 mb-2">
              <h3 class="display-5 fw-bold text-white mb-2">${item.titulo}</h3>
              <p class="fs-4 text-light text-opacity-90 d-none d-md-block mb-0">${item.descricao}</p>
            </div>
          </a>
        </div>
      `;
    }
  });
}

function init() {
  const campoPesquisa = document.getElementById("campoPesquisa");
  if (campoPesquisa) {
    campoPesquisa.addEventListener("input", aplicarPesquisa);
  }
  fetchDados();
}

document.addEventListener("DOMContentLoaded", init);