/* =========================================================
   TOPY'GUT - ÁREA DO CLIENTE
   Comportamentos da tela de login
========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    /* =====================================================
       ELEMENTOS DO LOGIN
    ===================================================== */

    const formulario =
        document.getElementById("formLogin");

    const email =
        document.getElementById("email");

    const senha =
        document.getElementById("senha");

    const lembrar =
        document.getElementById("lembrar");

    const mostrarSenha =
        document.getElementById("mostrarSenha");


    /* =====================================================
       MOSTRAR / OCULTAR SENHA
    ===================================================== */

    if (mostrarSenha && senha) {

        mostrarSenha.addEventListener(
            "click",
            function () {

                const senhaVisivel =
                    senha.type === "text";


                if (senhaVisivel) {

                    senha.type =
                        "password";

                    mostrarSenha.textContent =
                        "👁";

                    mostrarSenha.setAttribute(
                        "aria-label",
                        "Mostrar senha"
                    );

                } else {

                    senha.type =
                        "text";

                    mostrarSenha.textContent =
                        "🙈";

                    mostrarSenha.setAttribute(
                        "aria-label",
                        "Ocultar senha"
                    );

                }

            }
        );

    }


    /* =====================================================
       LEMBRAR E-MAIL
    ===================================================== */

    const emailSalvo =
        localStorage.getItem(
            "topygut_email"
        );


    if (
        emailSalvo &&
        email &&
        lembrar
    ) {

        email.value =
            emailSalvo;

        lembrar.checked =
            true;

    }


    /* =====================================================
       ENVIO DO FORMULÁRIO
    ===================================================== */

    if (formulario) {

        formulario.addEventListener(
            "submit",
            async function (event) {

                /*
                   Ainda não temos backend.
                   Então impedimos o login real.
                */

                event.preventDefault();


                /* =========================================
                   VALIDAÇÃO NATIVA
                ========================================= */

                if (!formulario.checkValidity()) {

                    formulario.reportValidity();

                    return;

                }


                /* =========================================
                   LIMPA ESPAÇOS
                ========================================= */

                const emailDigitado =
                    email.value.trim();

                const senhaDigitada =
                    senha.value.trim();


                /* =========================================
                   VALIDA E-MAIL
                ========================================= */

                if (!emailDigitado) {

                    alert(
                        "Digite seu e-mail."
                    );

                    email.focus();

                    return;

                }


                /* =========================================
                   VALIDA SENHA
                ========================================= */

                if (!senhaDigitada) {

                    alert(
                        "Digite sua senha."
                    );

                    senha.focus();

                    return;

                }


                /* =========================================
                   LEMBRAR E-MAIL
                ========================================= */

                if (
                    lembrar &&
                    lembrar.checked
                ) {

                    localStorage.setItem(
                        "topygut_email",
                        emailDigitado
                    );

                } else {

                    localStorage.removeItem(
                        "topygut_email"
                    );

                }


                /* =========================================
                   MENSAGEM TEMPORÁRIA
                ========================================= */

                try {

                    const resposta =
                        await fetch(
                            `${API_URL}/login`,
                            {
                                method: "POST",

                                headers: {
                                    "Content-Type":
                                        "application/json"
                                },

                                body: JSON.stringify({
                                    email: emailDigitado,
                                    senha: senhaDigitada
                                })
                            }
                        );


                        const dados =
                        await resposta.json();


                    if (!resposta.ok) {

                        alert(
                            dados.mensagem ||
                            "Não foi possível realizar o login."
                        );

                        return;

                    }


                    /* =================================================
                    SALVA DADOS DA SESSÃO
                    ================================================= */

                    if (
                        lembrar &&
                        lembrar.checked
                    ) {

                        /*
                        LEMBRAR DE MIM ATIVADO
                        A sessão continua mesmo após fechar o navegador.
                        */

                        localStorage.setItem(
                            "topygut_token",
                            dados.token
                        );

                        localStorage.setItem(
                            "topygut_usuario",
                            JSON.stringify(
                                dados.usuario
                            )
                        );


                        /*
                        Remove possíveis dados antigos
                        do sessionStorage.
                        */

                        sessionStorage.removeItem(
                            "topygut_token"
                        );

                        sessionStorage.removeItem(
                            "topygut_usuario"
                        );


                    } else {

                        /*
                        LEMBRAR DE MIM DESATIVADO
                        A sessão vale apenas para esta aba/sessão.
                        */

                        sessionStorage.setItem(
                            "topygut_token",
                            dados.token
                        );

                        sessionStorage.setItem(
                            "topygut_usuario",
                            JSON.stringify(
                                dados.usuario
                            )
                        );


                        /*
                        Remove uma sessão persistente antiga.
                        */

                        localStorage.removeItem(
                            "topygut_token"
                        );

                        localStorage.removeItem(
                            "topygut_usuario"
                        );

                    }

                    /* =================================================
                    REDIRECIONAMENTO
                    ================================================= */

                    if (
                        dados.usuario.tipo === "master" ||
                        dados.usuario.tipo === "admin"
                    ) {

                        window.location.href =
                            "admin-painel.html";

                        return;

                    }


                    if (
                        dados.usuario.tipo === "cliente"
                    ) {

                        window.location.href =
                            "painel-cliente.html";

                        return;

                    }


                    alert(
                        "Tipo de usuário não reconhecido."
                    );

                } catch (erro) {

                    console.error(
                        "Erro ao fazer login:",
                        erro
                    );


                    alert(
                        "Não foi possível conectar ao servidor."
                    );

                }

            }
        );

    }


    /* =====================================================
       SE DESMARCAR "LEMBRAR DE MIM"
    ===================================================== */

    if (lembrar) {

        lembrar.addEventListener(
            "change",
            function () {

                if (!lembrar.checked) {

                    localStorage.removeItem(
                        "topygut_email"
                    );

                }

            }
        );

    }


    /* =====================================================
       MENU MOBILE
    ===================================================== */

    const menuToggle =
        document.getElementById(
            "menuToggle"
        );

    const menu =
        document.querySelector(
            ".menu"
        );


    if (menuToggle && menu) {

        menuToggle.addEventListener(
            "click",
            function () {

                const menuAberto =
                    menu.classList.toggle(
                        "ativo"
                    );


                menuToggle.classList.toggle(
                    "ativo",
                    menuAberto
                );


                menuToggle.setAttribute(
                    "aria-expanded",
                    menuAberto
                );


                menuToggle.setAttribute(
                    "aria-label",
                    menuAberto
                        ? "Fechar menu"
                        : "Abrir menu"
                );

            }
        );


        /* =============================================
           FECHA AO CLICAR EM UM LINK
        ============================================= */

        const linksMenu =
            menu.querySelectorAll(
                "a"
            );


        linksMenu.forEach(
            function (link) {

                link.addEventListener(
                    "click",
                    function () {

                        menu.classList.remove(
                            "ativo"
                        );

                        menuToggle.classList.remove(
                            "ativo"
                        );

                        menuToggle.setAttribute(
                            "aria-expanded",
                            "false"
                        );

                        menuToggle.setAttribute(
                            "aria-label",
                            "Abrir menu"
                        );

                    }
                );

            }
        );

    }

});