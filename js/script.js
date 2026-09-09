/* =========================================================
   TOPY'GUT - JAVASCRIPT PRINCIPAL
========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    /* =====================================================
       ANIMAÇÃO DAS FIORINOS
       Entrada estilo "Panorama" da direita para a esquerda
    ===================================================== */

    const fiorinos = document.querySelector(".fiorinos-img");


    /* Se a imagem não existir, não executa nada */
    if (!fiorinos) {
        return;
    }


    /* =====================================================
       ACESSIBILIDADE
       Respeita usuários que preferem menos animações
    ===================================================== */

    const reduzirMovimento = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    );


    if (reduzirMovimento.matches) {

        fiorinos.classList.add("fiorinos-visiveis");

        return;

    }


    /* =====================================================
       OBSERVADOR
       Detecta quando as Fiorinos entram na tela
    ===================================================== */

    const observadorFiorinos = new IntersectionObserver(

        function (entradas, observador) {

            entradas.forEach(function (entrada) {

                if (entrada.isIntersecting) {

                    /*
                       Ativa a animação
                    */

                    fiorinos.classList.add(
                        "fiorinos-visiveis"
                    );


                    /*
                       A animação acontece apenas uma vez.
                       Depois disso não precisamos continuar
                       observando o elemento.
                    */

                    observador.unobserve(
                        entrada.target
                    );

                }

            });

        },

        {

            /*
               A animação começa quando aproximadamente
               20% da imagem já entrou na área visível.
            */

            threshold: 0.20,


            /*
               Faz a animação começar um pouco antes
               da imagem chegar totalmente ao viewport.
            */

            rootMargin:
                "0px 0px -5% 0px"

        }

    );


    /* =====================================================
       INICIA A OBSERVAÇÃO
    ===================================================== */

    observadorFiorinos.observe(fiorinos);
/* =========================================================
   MENU MOBILE
========================================================= */

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