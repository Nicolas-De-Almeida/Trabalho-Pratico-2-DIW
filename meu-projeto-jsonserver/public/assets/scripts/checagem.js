document.addEventListener("DOMContentLoaded", () => {
    const usuarioLogado = sessionStorage.getItem("usuarioLogado");
    let usuario = null;

    if (usuarioLogado) {
        usuario = JSON.parse(usuarioLogado);
    }

    const isDashboard = window.location.pathname.includes("dashboard.html");
    const isCadastroItens = window.location.pathname.includes("cadastro_itens.html");
    const isFavoritos = window.location.pathname.includes("usuario_favoritos.html");

    if ((isDashboard || isFavoritos) && !usuarioLogado) {
        window.location.href = "login.html";
        return;
    }

    if (isCadastroItens && (!usuarioLogado || !usuario.admin)) {
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

        if (usuarioLogado && usuario) {
            if (usuario.admin) {
                menu.insertAdjacentHTML("beforeend", `
                    <a href="cadastro_itens.html" class="text-black py-2 text-decoration-none fs-5 nav-item-custom">Cadastro</a>
                `);
            }

            menu.insertAdjacentHTML("beforeend", `
                <a href="usuario_favoritos.html" class="text-black py-2 text-decoration-none fs-5 nav-item-custom">Meus Favoritos</a>
                <a href="dashboard.html" class="text-black py-2 text-decoration-none fs-5 nav-item-custom">Dashboard</a>
                <a href="#" id="btn-sair" class="text-danger py-2 text-decoration-none fs-5 nav-item-custom fw-bold">Sair</a>
            `);

            document.getElementById("btn-sair").addEventListener("click", (e) => {
                e.preventDefault();
                sessionStorage.removeItem("usuarioLogado");
                window.location.href = "login.html";
            });
        } else {
            menu.insertAdjacentHTML("beforeend", `
                <a href="login.html" class="text-black py-2 text-decoration-none fs-5 nav-item-custom fw-bold">Login</a>
            `);
        }
    }
});