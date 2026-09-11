/* =========================================================
   TOPY'GUT - PAINEL ADMINISTRATIVO
========================================================= */

document.addEventListener("DOMContentLoaded", function () {

   /* =====================================================
   NOME DO ADMINISTRADOR
    ===================================================== */

    const nomeAdmin =
        document.getElementById("nomeAdmin");

    const usuarioSalvo =
    sessionStorage.getItem(
        "topygut_usuario"
    ) ||
    localStorage.getItem(
        "topygut_usuario"
    );


    if (nomeAdmin && usuarioSalvo) {

        const usuario =
            JSON.parse(usuarioSalvo);

        /*
        Mostra somente o primeiro nome.
        Ex.: "Nathan Lima" -> "Nathan"
        */

        const primeiroNome =
            usuario.nome
                .trim()
                .split(" ")[0];

        nomeAdmin.textContent =
            primeiroNome;

    }


    /* =====================================================
       MENU MOBILE
    ===================================================== */

    const menuToggle =
        document.getElementById("menuToggle");

    const menu =
        document.querySelector(".menu");


    if (menuToggle && menu) {

        menuToggle.addEventListener(
            "click",
            function () {

                const menuAberto =
                    menu.classList.toggle("ativo");


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


        /* FECHA AO CLICAR EM UM LINK */

        const linksMenu =
            menu.querySelectorAll("a");


        linksMenu.forEach(function (link) {

            link.addEventListener(
                "click",
                function () {

                    menu.classList.remove("ativo");

                    menuToggle.classList.remove("ativo");

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

        });

    }

});