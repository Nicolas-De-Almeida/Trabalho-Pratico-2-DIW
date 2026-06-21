document.addEventListener("DOMContentLoaded", () => {
  const usuarioLogado = sessionStorage.getItem("usuarioLogado");
  let usuario = null;
  if (usuarioLogado) {
    usuario = JSON.parse(usuarioLogado);
  }

  const isDashboard = window.location.pathname.includes("dashboard.html");
  const isCadastro = window.location.pathname.includes("cadastro_itens.html");
  const isFavoritos = window.location.pathname.includes("usuario_favoritos.html");

  if ((isDashboard || isFavoritos) && !usuarioLogado) {
    window.location.href = "login.html";
    return;
  }

  if (isCadastro && (!usuarioLogado || !usuario.admin)) {
    window.location.href = "index.html";
    return;
  }

  const menu = document.getElementById("menu-layout-novo");
  if (menu) {
    const linksExistentes = Array.from(menu.getElementsByTagName("a"));
    linksExistentes.forEach(link => {
      const texto = link.textContent.trim();
      if (texto === "Dashboard" || texto === "Login" || texto === "Sair" || texto === "Cadastro" || texto === "Meus Favoritos") {
        link.remove();
      }
    });

    if (usuarioLogado) {
      if (usuario.admin && !isCadastro) {
        menu.insertAdjacentHTML("beforeend", `
          <a href="cadastro_itens.html" class="text-black py-3 text-decoration-none fs-5 nav-item-custom w-100 border-bottom">Cadastro</a>
        `);
      }
      
      if (!isFavoritos) {
        menu.insertAdjacentHTML("beforeend", `
          <a href="usuario_favoritos.html" class="text-black py-3 text-decoration-none fs-5 nav-item-custom w-100 border-bottom">Meus Favoritos</a>
        `);
      }

      if (!isDashboard) {
        menu.insertAdjacentHTML("beforeend", `
          <a href="dashboard.html" class="text-black py-3 text-decoration-none fs-5 nav-item-custom w-100 border-bottom">Dashboard</a>
        `);
      }

      menu.insertAdjacentHTML("beforeend", `
        <a href="#" id="btn-sair" class="text-danger py-3 text-decoration-none fs-5 nav-item-custom fw-bold w-100 border-bottom">Sair</a>
      `);
      
      document.getElementById("btn-sair").addEventListener("click", (e) => {
        e.preventDefault();
        sessionStorage.removeItem("usuarioLogado");
        window.location.href = "index.html";
      });
    } else {
      menu.insertAdjacentHTML("beforeend", `
        <a href="login.html" class="text-black py-3 text-decoration-none fs-5 nav-item-custom fw-bold w-100 border-bottom">Login</a>
      `);
    }
  }
});