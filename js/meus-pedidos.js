/* =========================================================
   TOPY'GUT - MEUS PEDIDOS
========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    const filtros =
        document.querySelectorAll(".filtro");

    const pedidos =
        document.querySelectorAll(".pedido-card");

    const pedidosVazio =
        document.getElementById("pedidosVazio");


    /* =====================================================
       FILTROS
    ===================================================== */

    filtros.forEach(function (filtro) {

        filtro.addEventListener("click", function () {

            const statusSelecionado =
                filtro.dataset.filtro;


            /* REMOVE ATIVO DOS OUTROS */

            filtros.forEach(function (item) {

                item.classList.remove("ativo");

            });


            /* ATIVA O FILTRO CLICADO */

            filtro.classList.add("ativo");


            let pedidosVisiveis = 0;


            pedidos.forEach(function (pedido) {

                const statusPedido =
                    pedido.dataset.status;


                if (
                    statusSelecionado === "todos" ||
                    statusPedido === statusSelecionado
                ) {

                    pedido.classList.remove("oculto");

                    pedidosVisiveis++;

                } else {

                    pedido.classList.add("oculto");

                }

            });


            /* =================================================
               MOSTRA ESTADO VAZIO
            ================================================= */

            if (pedidosVisiveis === 0) {

                pedidosVazio.classList.add("mostrar");

            } else {

                pedidosVazio.classList.remove("mostrar");

            }

        });

    });


    /* =====================================================
       DETALHES DOS PEDIDOS
    ===================================================== */

    const botoesDetalhes =
        document.querySelectorAll(".btn-detalhes");


    botoesDetalhes.forEach(function (botao) {

        botao.addEventListener("click", function () {

            const pedido =
                botao.closest(".pedido-card");


            const detalhes =
                pedido.querySelector(".pedido-detalhes");


            const estaAberto =
                detalhes.classList.contains("aberto");


            /* =================================================
               FECHA
            ================================================= */

            if (estaAberto) {

                detalhes.classList.remove("aberto");

                botao.textContent =
                    "Ver detalhes";

            }

            /* =================================================
               ABRE
            ================================================= */

            else {

                detalhes.classList.add("aberto");

                botao.textContent =
                    "Ocultar detalhes";

            }

        });

    });

});