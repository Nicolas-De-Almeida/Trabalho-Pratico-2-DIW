document.addEventListener("DOMContentLoaded", () => {
    const usuarioLogado = localStorage.getItem("usuarioLogado");
    let usuario = null;

    if (usuarioLogado) {
        usuario = JSON.parse(usuarioLogado);
    }

    const isDashboard = window.location.pathname.includes("dashboard.html");
    const isCadastroItens = window.location.pathname.includes("cadastro_itens.html");

    if (isDashboard && !usuarioLogado) {
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
            if (texto === "Dashboard" || texto === "Login" || texto === "Sair" || texto === "Cadastro Admin") {
                link.remove();
            }
        });

        if (usuarioLogado) {
            if (usuario.admin === true) {
                menu.insertAdjacentHTML("beforeend", `
                    <a href="cadastro_itens.html" class="py-2 text-decoration-none fs-5 nav-item-custom fw-bold" style="color: rgb(46, 139, 87);">Cadastro Admin</a>
                `);
            }

            menu.insertAdjacentHTML("beforeend", `
                <a href="dashboard.html" class="text-black py-2 text-decoration-none fs-5 nav-item-custom">Dashboard</a>
                <a href="#" id="btn-sair" class="text-danger py-2 text-decoration-none fs-5 nav-item-custom fw-bold">Sair</a>
            `);

            document.getElementById("btn-sair").addEventListener("click", (e) => {
                e.preventDefault();
                localStorage.removeItem("usuarioLogado");
                window.location.reload(); 
            });
            
        } else {
            menu.insertAdjacentHTML("beforeend", `
                <a href="login.html" class="text-black py-2 text-decoration-none fs-5 nav-item-custom fw-bold">Login</a>
            `);
        }
    }
});