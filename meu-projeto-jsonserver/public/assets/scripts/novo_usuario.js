document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("cadastroForm");

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const nome = form.querySelector('input[type="text"]').value.trim();
        const email = form.querySelector('input[type="email"]').value.trim();
        const senhas = form.querySelectorAll('input[type="password"]');
        const senha = senhas[0].value;
        const confirmar = senhas[1].value;

        if (senha !== confirmar) {
            alert("As senhas não coincidem!");
            return;
        }

        try {
            const response = await fetch("http://localhost:3000/usuarios");
            const usuarios = await response.json();

            if (usuarios.find(u => u.email === email)) {
                alert("Este e-mail já está cadastrado!");
                return;
            }

            await fetch("http://localhost:3000/usuarios", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    id: Date.now().toString(),
                    nome: nome,
                    email: email,
                    senha: senha,
                    admin: false
                })
            });

            alert("Conta criada com sucesso! Faça login.");
            window.location.href = "login.html";
        } catch (error) {
            alert("Erro ao criar conta. Tente novamente.");
        }
    });
});