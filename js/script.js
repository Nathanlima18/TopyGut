/* =========================================================
   TOPY'GUT - JAVASCRIPT PRINCIPAL
========================================================= */

document.addEventListener("DOMContentLoaded", function () {


    /* =========================================================
    PRODUTOS DA PÁGINA INICIAL
    ========================================================= */

    async function carregarProdutosPublicos() {

        const listaProdutos =
            document.getElementById(
                "listaProdutos"
            );

        const listaPaoDeQueijo =
            document.getElementById(
                "listaPaoDeQueijo"
            );


        if (
            !listaProdutos ||
            !listaPaoDeQueijo
        ) {

            return;

        }


        try {

            const resposta =
                await fetch(
                    `${API_URL}/produtos-publicos`
                );


            const dados =
                await resposta.json();


            if (!resposta.ok) {

                console.error(
                    "Erro ao carregar produtos:",
                    dados
                );

                return;

            }


            listaProdutos.innerHTML = "";

            listaPaoDeQueijo.innerHTML = "";


            dados.produtos.forEach(
                function (produto) {

                    const card =
                        document.createElement(
                            "article"
                        );

                        card.dataset.nome =
                            produto.nome || "";

                        card.dataset.categoria =
                            produto.categoria || "";

                        card.dataset.tamanho =
                            produto.tamanho || "";

                        card.dataset.descricao =
                            produto.descricao || "";

                        card.dataset.imagem =
                            produto.imagem || "";

                    
                    /* =============================================
                    PÃO DE QUEIJO
                    ============================================= */

                    if (
                        produto.categoria ===
                        "pao_de_queijo"
                    ) {

                        card.className =
                            "card-pao-queijo";


                        card.innerHTML = `

                            <div class="produto-imagem">

                                ${
                                    produto.imagem
                                        ? `
                                            <img
                                                src="${API_URL}${produto.imagem}"
                                                alt="${produto.nome}"
                                            >
                                        `
                                        : ""
                                }

                            </div>


                            <div class="produto-conteudo">

                                <span class="produto-categoria">
                                    Pão de Queijo
                                </span>

                                <h3>
                                    ${produto.nome}
                                </h3>

                                ${
                                    produto.tamanho
                                        ? `
                                            <span class="produto-tamanho">
                                                ${produto.tamanho}
                                            </span>
                                        `
                                        : ""
                                }

                                <p>
                                    ${produto.descricao || ""}
                                </p>

                                <button
                                    type="button"
                                    class="produto-botao"
                                >
                                    Ver detalhes
                                </button>

                            </div>
                        `;

                        listaPaoDeQueijo.appendChild(
                            card
                        );

                        return;
                    }

                    /* =============================================
                    DEMAIS PRODUTOS
                    ============================================= */

                    let classeCor = "card-rosa";

                    if (
                        produto.categoria === "laticinios"
                    ) {
                        classeCor = "card-azul";
                    }


                    if (
                        produto.categoria === "sucos"
                    ) {
                        classeCor = "card-amarelo";
                    }

                    card.className = "card-produto " +
                        classeCor;

                    let nomeCategoria = "Iogurtes";


                    if (
                        produto.categoria === "laticinios"
                    ) {
                        nomeCategoria = "Laticínios";
                    }


                    if (
                        produto.categoria === "sucos"
                    ) {
                        nomeCategoria = "Sucos";
                    }


                    card.innerHTML = `

                        <div class="produto-imagem">

                            ${
                                produto.imagem
                                    ? `
                                        <img
                                            src="${API_URL}${produto.imagem}"
                                            alt="${produto.nome}"
                                        >
                                    `
                                    : ""
                            }

                        </div>


                        <div class="produto-conteudo">

                            <span class="produto-categoria">
                                ${nomeCategoria}
                            </span>

                            <h3>
                                ${produto.nome}
                            </h3>

                            ${
                                produto.tamanho
                                    ? `
                                        <span class="produto-tamanho">
                                            ${produto.tamanho}
                                        </span>
                                    `
                                    : ""
                            }

                            <p>
                                ${produto.descricao || ""}
                            </p>

                            <button
                                type="button"
                                class="produto-botao"
                            >
                                Ver detalhes
                            </button>

                        </div>
                        `;
                    card.dataset.nome = produto.nome || "";

                    card.dataset.categoria = produto.categoria || "";

                    card.dataset.tamanho = produto.tamanho || "";

                    card.dataset.descricao = produto.descricao || "";

                    card.dataset.imagem = produto.imagem || "";

                    listaProdutos.appendChild(
                        card
                    );
                }
            );

        } catch (erro) {

            console.error(
                "Erro ao conectar com os produtos:",
                erro
            );
        }
    }

    /* =========================================================
    MODAL - DETALHES DO PRODUTO
    ========================================================= */

    const modalProdutoPublico =
        document.getElementById(
            "modalProdutoPublico"
        );

    const modalProdutoPublicoOverlay =
        document.getElementById(
            "modalProdutoPublicoOverlay"
        );

    const fecharModalProdutoPublico =
        document.getElementById(
            "fecharModalProdutoPublico"
        );

    const modalProdutoPublicoImagem =
        document.getElementById(
            "modalProdutoPublicoImagem"
        );

    const modalProdutoPublicoCategoria =
        document.getElementById(
            "modalProdutoPublicoCategoria"
        );

    const modalProdutoPublicoNome =
        document.getElementById(
            "modalProdutoPublicoNome"
        );

    const modalProdutoPublicoTamanho =
        document.getElementById(
            "modalProdutoPublicoTamanho"
        );

    const modalProdutoPublicoDescricao =
        document.getElementById(
            "modalProdutoPublicoDescricao"
        );

    const btnWhatsappProduto =
        document.getElementById(
            "btnWhatsappProduto"
        );


    function abrirModalProdutoPublico(card) {

        const nome = card.dataset.nome || "";

        const categoria = card.dataset.categoria || "";

        const tamanho = card.dataset.tamanho || "";

        const descricao = card.dataset.descricao || "";

        const imagem = card.dataset.imagem || "";

        modalProdutoPublicoNome.textContent = nome;

        modalProdutoPublicoCategoria.textContent = categoria;

        modalProdutoPublicoTamanho.textContent = tamanho;

        modalProdutoPublicoDescricao.textContent = descricao;


        if (imagem) {

            modalProdutoPublicoImagem.innerHTML = `
                <img
                    src="${API_URL}${imagem}"
                    alt="${nome}"
                >
            `;

        } else {

            modalProdutoPublicoImagem.innerHTML = "";
        }

        const mensagemWhatsapp =
            encodeURIComponent(
                `Olá! Tenho interesse no produto ${nome}. Gostaria de mais informações.`
            );


        btnWhatsappProduto.href =
            `https://wa.me/5511942977455?text=${mensagemWhatsapp}`;


        modalProdutoPublico.classList.add(
            "ativo"
        );

        modalProdutoPublico.setAttribute(
            "aria-hidden",
            "false"
        );
    }

    function fecharModalProdutoPublicoFunc() {

        modalProdutoPublico.classList.remove(
            "ativo"
        );

        modalProdutoPublico.setAttribute(
            "aria-hidden",
            "true"
        );
    }

    document.addEventListener(
        "click",
        function (event) {

            const botao =
                event.target.closest(
                    ".produto-botao"
                );

            if (!botao) {
                return;
            }

            const card =
                botao.closest(
                    ".card-produto, .card-pao-queijo"
                );

            if (!card) {
                return;
            }

            abrirModalProdutoPublico(
                card
            );
        }
    );


    fecharModalProdutoPublico.addEventListener(
        "click",
        fecharModalProdutoPublicoFunc
    );

    modalProdutoPublicoOverlay.addEventListener(
        "click",
        fecharModalProdutoPublicoFunc
    );

    document.addEventListener(
        "keydown",
        function (event) {
            if (
                event.key === "Escape" &&
                modalProdutoPublico.classList.contains(
                    "ativo"
                )
            ) {
                fecharModalProdutoPublicoFunc();
            }
        }
    );

    /* =========================================================
    INICIAL
    ========================================================= */

    carregarProdutosPublicos();
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