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
            function (event) {

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

                alert(
                    "Tela de login funcionando corretamente!\n\n" +
                    "Na próxima etapa do projeto, este formulário " +
                    "será conectado ao sistema de autenticação."
                );

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