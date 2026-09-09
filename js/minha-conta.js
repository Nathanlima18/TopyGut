/* =========================================================
   TOPY'GUT - MINHA CONTA
========================================================= */

document.addEventListener("DOMContentLoaded", function () {

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