async function fetchItems() {
  const response = await fetch("http://localhost:3000/projetos");
  return await response.json();
}

function createCard(item) {
  const col = document.createElement("div");
  col.className = "col-12 col-md-4 mb-4";
  col.innerHTML = `
    <div class="card h-100 border-0 shadow-sm rounded-4 overflow-hidden">
      <img src="${item.imagem}" class="card-img-top">
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
  return col;
}

function renderCards(items) {
  const container = document.getElementById("container-projetos");
  container.innerHTML = "";
  items.forEach(item => {
    container.appendChild(createCard(item));
  });
}

function renderCarrossel(items) {
  const containerCarrossel = document.getElementById("container-carrossel");
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

async function init() {
  const items = await fetchItems();
  renderCards(items);
  renderCarrossel(items);
}

document.addEventListener("DOMContentLoaded", init);