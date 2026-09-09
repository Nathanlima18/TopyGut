/* =========================================================
   TOPY'GUT - ÁREA DO CLIENTE
   Comportamentos da tela de login
========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    /* =====================================================
       ELEMENTOS
    ===================================================== */

    const formulario = document.getElementById("formLogin");
    const email = document.getElementById("email");
    const senha = document.getElementById("senha");
    const lembrar = document.getElementById("lembrar");
    const mostrarSenha = document.getElementById("mostrarSenha");


    /* =====================================================
       SEGURANÇA
    ===================================================== */

    if (!formulario) {
        return;
    }


    /* =====================================================
       MOSTRAR / OCULTAR SENHA
    ===================================================== */

    if (mostrarSenha && senha) {

        mostrarSenha.addEventListener("click", function () {

            const senhaVisivel =
                senha.type === "text";


            if (senhaVisivel) {

                senha.type = "password";

                mostrarSenha.textContent = "👁";

                mostrarSenha.setAttribute(
                    "aria-label",
                    "Mostrar senha"
                );

            } else {

                senha.type = "text";

                mostrarSenha.textContent = "🙈";

                mostrarSenha.setAttribute(
                    "aria-label",
                    "Ocultar senha"
                );

            }

        });

    }


    /* =====================================================
       LEMBRAR E-MAIL

       Salva apenas o e-mail.
       Nunca salvamos a senha.
    ===================================================== */

    const emailSalvo =
        localStorage.getItem("topygut_email");


    if (emailSalvo && email) {

        email.value = emailSalvo;

        lembrar.checked = true;

    }


    /* =====================================================
       ENVIO DO FORMULÁRIO
    ===================================================== */

    formulario.addEventListener("submit", function (event) {

        /*
           Ainda não temos backend.
           Então impedimos o login real por enquanto.
        */

        event.preventDefault();


        /* =================================================
           VALIDAÇÃO NATIVA
        ================================================= */

        if (!formulario.checkValidity()) {

            formulario.reportValidity();

            return;

        }


        /* =================================================
           LIMPA ESPAÇOS
        ================================================= */

        const emailDigitado =
            email.value.trim();

        const senhaDigitada =
            senha.value.trim();


        /* =================================================
           VALIDA E-MAIL
        ================================================= */

        if (!emailDigitado) {

            alert(
                "Digite seu e-mail."
            );

            email.focus();

            return;

        }


        /* =================================================
           VALIDA SENHA
        ================================================= */

        if (!senhaDigitada) {

            alert(
                "Digite sua senha."
            );

            senha.focus();

            return;

        }


        /* =================================================
           LEMBRAR E-MAIL
        ================================================= */

        if (lembrar.checked) {

            localStorage.setItem(
                "topygut_email",
                emailDigitado
            );

        } else {

            localStorage.removeItem(
                "topygut_email"
            );

        }


        /* =================================================
           MENSAGEM TEMPORÁRIA

           Quando tivermos backend, este bloco será
           substituído pela autenticação real.
        ================================================= */

        alert(
            "Tela de login funcionando corretamente!\n\n" +
            "Na próxima etapa do projeto, este formulário " +
            "será conectado ao sistema de autenticação."
        );

    });


    /* =====================================================
       SE DESMARCAR "LEMBRAR DE MIM"

       Já removemos o e-mail salvo.
    ===================================================== */

    if (lembrar) {

        lembrar.addEventListener("change", function () {

            if (!lembrar.checked) {

                localStorage.removeItem(
                    "topygut_email"
                );

            }

        });

    }

});