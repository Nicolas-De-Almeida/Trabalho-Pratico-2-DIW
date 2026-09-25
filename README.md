## Informações Gerais

- **Nome:** Nicolas De Almeida
- **Curso:** Engenharia de Software
- **GitHub:** Nicolas-De-Almeida
- **LinkedIn:** Nicolas De Almeida
- **Matricula:** 1638671
- **Turma:** 0439.1.00

---

## Como executar localmente

Na pasta `meu-projeto-jsonserver`, execute:

```bash
npm start
```

Depois, acesse `http://localhost:3000/`

---

## Proposta do Projeto 
- **Tema:** Uma grande ONG focada no meio ambiente.
- **Breve descrição:** O objetivo é criar um site informativo e educativo sobre o meio ambiente. A ideia é oferecer um ambiente onde as pessoas possam saber mais sobre as ONGs existentes, e onde as próprias instituições possam entrar em contato e se juntar para realizar mais trabalhos em conjunto.

---

## Login
O site foi pensado e desenvolvido para que os usuários possam criar contas ou fazer login, permitindo testar funções específicas para cada tipo de acesso.

Se necessário, disponibilizo aqui duas contas já cadastradas no `db.json`. Você pode utilizar o login de administrador para testar a função de cadastro, ou o login de usuário comum caso não queira criar uma nova conta do zero.

```json
"usuarios": [
  {
    "id": "1",
    "nome": "Primeiro Usuario",
    "email": "primeiro_usuario@gmail.com",
    "senha": "123",
    "admin": false
  },
  {
    "id": "admin1",
    "nome": "Programador1",
    "email": "programador@gmail.com",
    "senha": "123",
    "admin": true
  }
]
```

---

## Funções
As funções principais do sistema só ficarão disponíveis no menu após o usuário realizar o login em uma das contas. Portanto, não se assuste se não visualizar nenhuma delas enquanto explora o site de forma anônima.

* **Cadastro de Denúncias:** Caso utilize o login de administrador (apresentado acima), você poderá realizar o cadastro de novos projetos e acessar sua tela de projetos favoritados, tudo com atualizações instantâneas no `db.json`.

* **Favoritos:** Caso utilize o login de usuário comum, você ainda poderá usar a função de favoritos, porém sem a opção de cadastro de projetos mencionada anteriormente.

* **Pesquisa:** Qualquer tipo de usuário, logado ou não, tem acesso ao sistema de pesquisa para encontrar os projetos apresentados de forma mais fácil. O sistema filtra as opções em tempo real de acordo com o nome que está sendo digitado, apresentando o resultado mais específico possível.

* **Dashboard:** Ambos os tipos de usuários têm permissão para acessar o dashboard (uma página onde é possível visualizar e acompanhar melhor as médias dos projetos), além de contar com a opção de favoritar os projetos e acessar a página de favoritos para checá-los.

**Muito Obrigado!**