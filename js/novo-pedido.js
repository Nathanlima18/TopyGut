/* =========================================================
   TOPY'GUT - NOVO PEDIDO
========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    const produtos = document.querySelectorAll(".produto-pedido");

    const totalItensElemento =
        document.getElementById("totalItens");

    const subtotalElemento =
        document.getElementById("subtotalPedido");

    const totalElemento =
        document.getElementById("totalPedido");

    const botaoFinalizar =
        document.getElementById("btnFinalizar");


    /* =====================================================
       FUNÇÃO PARA FORMATAR VALORES EM REAL
    ===================================================== */

    function formatarMoeda(valor) {

        return valor.toLocaleString(
            "pt-BR",
            {
                style: "currency",
                currency: "BRL"
            }
        );

    }


    /* =====================================================
       ATUALIZA RESUMO DO PEDIDO
    ===================================================== */

    function atualizarResumo() {

        let totalItens = 0;

        let subtotal = 0;


        produtos.forEach(function (produto) {

            const inputQuantidade =
                produto.querySelector(
                    ".quantidade-input"
                );


            const quantidade =
                Number(inputQuantidade.value);


            const preco =
                Number(
                    produto.dataset.preco
                ) || 0;


            totalItens += quantidade;

            subtotal +=
                quantidade * preco;


            /* =============================================
               DESTACA PRODUTO SELECIONADO
            ============================================= */

            if (quantidade > 0) {

                produto.classList.add(
                    "selecionado"
                );

            } else {

                produto.classList.remove(
                    "selecionado"
                );

            }

        });


        /* =============================================
           ATUALIZA NÚMERO DE ITENS
        ============================================= */

        totalItensElemento.textContent =
            totalItens;


        /* =============================================
           ATUALIZA VALORES
        ============================================= */

        subtotalElemento.textContent =
            formatarMoeda(subtotal);


        totalElemento.textContent =
            formatarMoeda(subtotal);


        /* =============================================
           HABILITA / DESABILITA FINALIZAÇÃO
        ============================================= */

        botaoFinalizar.disabled =
            totalItens === 0;

    }


    /* =====================================================
       CONTROLES DE QUANTIDADE
    ===================================================== */

    produtos.forEach(function (produto) {

        const botaoAumentar =
            produto.querySelector(
                ".aumentar"
            );


        const botaoDiminuir =
            produto.querySelector(
                ".diminuir"
            );


        const inputQuantidade =
            produto.querySelector(
                ".quantidade-input"
            );


        /* =============================================
           AUMENTAR
        ============================================= */

        botaoAumentar.addEventListener(
            "click",
            function () {

                let quantidade =
                    Number(
                        inputQuantidade.value
                    );


                quantidade++;


                inputQuantidade.value =
                    quantidade;


                atualizarResumo();

            }
        );


        /* =============================================
           DIMINUIR
        ============================================= */

        botaoDiminuir.addEventListener(
            "click",
            function () {

                let quantidade =
                    Number(
                        inputQuantidade.value
                    );


                if (quantidade > 0) {

                    quantidade--;

                }


                inputQuantidade.value =
                    quantidade;


                atualizarResumo();

            }
        );

    });


    /* =====================================================
       TAMANHOS DO PÃO DE QUEIJO
    ===================================================== */

    const seletoresTamanho =
        document.querySelectorAll(
            ".tamanho-pao-queijo"
        );


    seletoresTamanho.forEach(
        function (seletor) {

            seletor.addEventListener(
                "change",
                function () {

                    const produto =
                        seletor.closest(
                            ".produto-pedido"
                        );


                    const nomeProduto =
                        produto.dataset.produto;


                    const tamanho =
                        seletor.value;


                    /*
                       Por enquanto apenas registramos
                       a escolha.

                       Depois, quando tivermos backend
                       e tabela de preços, aqui será
                       possível buscar o preço correto
                       conforme:

                       Produto + tamanho + cliente.

                       Exemplo:

                       Tradicional 15g
                       Tradicional 90g
                       Gourmet 15g
                       Gourmet 90g
                    */


                    console.log(
                        "Produto:",
                        nomeProduto,
                        "| Tamanho:",
                        tamanho
                    );

                }
            );

        }
    );


    /* =====================================================
       FINALIZAR PEDIDO
    ===================================================== */

    botaoFinalizar.addEventListener(
        "click",
        function () {

            const itensPedido = [];


            produtos.forEach(
                function (produto) {

                    const quantidade =
                        Number(
                            produto.querySelector(
                                ".quantidade-input"
                            ).value
                        );


                    if (quantidade <= 0) {
                        return;
                    }


                    const nome =
                        produto.dataset.produto;


                    const preco =
                        Number(
                            produto.dataset.preco
                        ) || 0;


                    const seletorTamanho =
                        produto.querySelector(
                            ".tamanho-pao-queijo"
                        );


                    /*
                       Se existir seletor,
                       pega 15g ou 90g.

                       Se não existir,
                       consideramos tamanho único.
                    */

                    const tamanho =
                        seletorTamanho
                            ? seletorTamanho.value
                            : "Tamanho único";


                    itensPedido.push({

                        produto: nome,

                        tamanho: tamanho,

                        quantidade: quantidade,

                        precoUnitario: preco,

                        subtotal:
                            preco * quantidade

                    });

                }
            );


            /* =============================================
               TESTE NO CONSOLE
            ============================================= */

            console.log(
                "Pedido:",
                itensPedido
            );


            /*
               Ainda não vamos enviar o pedido.

               Quando o backend estiver pronto,
               esse objeto será enviado para o servidor.
            */


            alert(
                "Seu pedido foi montado com sucesso. " +
                "A finalização real será ativada " +
                "quando integrarmos o sistema ao backend."
            );

        }
    );
    atualizarResumo();
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