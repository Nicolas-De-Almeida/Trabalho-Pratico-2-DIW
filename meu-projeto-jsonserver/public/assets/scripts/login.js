const formLogin = document.getElementById("loginForm");

formLogin.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = formLogin.querySelector('input[type="email"]').value;
    const senha = formLogin.querySelector('input[type="password"]').value;

    try {
        const response = await fetch("http://localhost:3000/usuarios");
        const usuarios = await response.json();

        const usuarioValido = usuarios.find(user => user.email === email && user.senha === senha);

        if (usuarioValido) {
            sessionStorage.setItem("usuarioLogado", JSON.stringify({
                id: usuarioValido.id,
                email: usuarioValido.email,
                admin: usuarioValido.admin === true
            }));
            window.location.href = "index.html";
        } else {
            alert("E-mail ou senha incorretos!");
        }
    } catch (error) {
        alert("Erro ao conectar com o servidor.");
    }
});