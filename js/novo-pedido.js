/* =========================================================
   TOPY'GUT - NOVO PEDIDO
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        /* =====================================================
           ELEMENTOS
        ===================================================== */

        const listaIogurtes =
            document.getElementById(
                "listaIogurtes"
            );

        const listaLaticinios =
            document.getElementById(
                "listaLaticinios"
            );

        const listaSucos =
            document.getElementById(
                "listaSucos"
            );

        const listaPaoDeQueijo =
            document.getElementById(
                "listaPaoDeQueijo"
            );


        const areaProdutos =
            document.querySelector(
                ".produtos-pedido"
            );


        const totalItensElemento =
            document.getElementById(
                "totalItens"
            );

        const subtotalElemento =
            document.getElementById(
                "subtotalPedido"
            );

        const totalElemento =
            document.getElementById(
                "totalPedido"
            );

        const botaoFinalizar =
            document.getElementById(
                "btnFinalizar"
            );

        const modalPagamento =
            document.getElementById(
                "modalPagamento"
            );

        const modalPagamentoOverlay =
            document.getElementById(
                "modalPagamentoOverlay"
            );

        const fecharModalPagamento =
            document.getElementById(
                "fecharModalPagamento"
            );

        const cancelarPagamento =
            document.getElementById(
                "cancelarPagamento"
            );

        const pagamentoResumo =
            document.getElementById(
                "pagamentoResumo"
            );

        const confirmarPedido =
            document.getElementById(
                "confirmarPedido"
            );
        /* =====================================================
           TOKEN
        ===================================================== */

        function obterToken() {

            return (
                sessionStorage.getItem(
                    "topygut_token"
                ) ||
                localStorage.getItem(
                    "topygut_token"
                )
            );

        }


        /* =====================================================
           FORMATAR MOEDA
        ===================================================== */

        function formatarMoeda(valor) {

            return Number(valor).toLocaleString(
                "pt-BR",
                {
                    style: "currency",
                    currency: "BRL"
                }
            );

        }


        /* =====================================================
           NOME DA CATEGORIA
        ===================================================== */

        function nomeCategoria(categoria) {

            const nomes = {

                iogurtes:
                    "Iogurte",

                laticinios:
                    "Laticínio",

                sucos:
                    "Suco",

                pao_de_queijo:
                    "Pão de Queijo"

            };


            return (
                nomes[categoria] ||
                "Produto"
            );

        }


        /* =====================================================
           CRIAR PRODUTO DO PEDIDO
        ===================================================== */

        function criarProdutoPedido(
            produto
        ) {

            const card =
                document.createElement(
                    "article"
                );

            card.className =
                "produto-pedido";

            card.dataset.id =
                produto.id;

            card.dataset.produto =
                produto.nome;

            card.dataset.preco =
                Number(
                    produto.preco
                );

            card.dataset.categoria =
                produto.categoria;

            card.dataset.tamanho =
                produto.tamanho || "";


            /* =============================================
            VARIAÇÕES DO PRODUTO
            ============================================= */

            const variacoes =
                Array.isArray(produto.variacoes)
                    ? produto.variacoes
                    : [];


            let controles = "";


            if (variacoes.length > 0) {

                controles =
                    variacoes.map(
                        function (variacao) {

                            const tipo =
                                variacao.tipo === "tamanho"
                                    ? "Tamanho"
                                    : "Sabor";

                            return `

                                <div
                                    class="variacao-pedido"
                                    data-variacao-id="${variacao.id}"
                                    data-variacao-tipo="${variacao.tipo}"
                                    data-variacao-nome="${variacao.nome}"
                                >

                                    <div class="variacao-info">

                                        <span class="variacao-tipo">
                                            ${tipo}
                                        </span>

                                        <strong>
                                            ${variacao.nome}
                                        </strong>

                                    </div>


                                    <div class="quantidade">

                                        <button
                                            type="button"
                                            class="btn-quantidade diminuir"
                                            aria-label="Diminuir quantidade"
                                        >
                                            −
                                        </button>

                                        <input
                                            type="number"
                                            class="quantidade-input"
                                            value="0"
                                            min="0"
                                            readonly
                                        >

                                        <button
                                            type="button"
                                            class="btn-quantidade aumentar"
                                            aria-label="Aumentar quantidade"
                                        >
                                            +
                                        </button>

                                    </div>

                                </div>

                            `;

                        }
                    ).join("");

            } else {

                controles = `

                    <div class="variacao-pedido">

                        <div class="quantidade">

                            <button
                                type="button"
                                class="btn-quantidade diminuir"
                                aria-label="Diminuir quantidade"
                            >
                                −
                            </button>

                            <input
                                type="number"
                                class="quantidade-input"
                                value="0"
                                min="0"
                                readonly
                            >

                            <button
                                type="button"
                                class="btn-quantidade aumentar"
                                aria-label="Aumentar quantidade"
                            >
                                +
                            </button>

                        </div>

                    </div>

                `;

            }


            /* =============================================
            CONTEÚDO DO CARD
            ============================================= */

            card.innerHTML = `

                <div class="produto-info">

                    <span class="produto-tipo">
                        ${nomeCategoria(
                            produto.categoria
                        )}
                    </span>

                    <h3>
                        ${produto.nome}
                    </h3>

                    ${
                        variacoes.length === 0
                            ? `
                                <p>
                                    ${produto.tamanho || ""}
                                </p>
                            `
                            : ""
                    }

                    ${
                        produto.sabor &&
                        variacoes.length === 0
                            ? `
                                <span class="produto-sabor">
                                    ${produto.sabor}
                                </span>
                            `
                            : ""
                    }

                    <strong class="produto-preco">
                        ${formatarMoeda(
                            produto.preco
                        )}
                    </strong>

                </div>


                <div class="produto-variacoes">
                    ${controles}
                </div>

            `;


            return card;

        }

        /* =====================================================
           COLOCAR PRODUTO NA CATEGORIA CORRETA
        ===================================================== */

        function adicionarProduto(
            produto
        ) {

            const card =
                criarProdutoPedido(
                    produto
                );


            if (
                produto.categoria ===
                "iogurtes"
            ) {

                listaIogurtes.appendChild(
                    card
                );

                return;

            }


            if (
                produto.categoria ===
                "laticinios"
            ) {

                listaLaticinios.appendChild(
                    card
                );

                return;

            }


            if (
                produto.categoria ===
                "sucos"
            ) {

                listaSucos.appendChild(
                    card
                );

                return;

            }


            if (
                produto.categoria ===
                "pao_de_queijo"
            ) {

                listaPaoDeQueijo.appendChild(
                    card
                );

            }

        }


        /* =====================================================
           CARREGAR PRODUTOS DO CLIENTE
        ===================================================== */

        async function carregarProdutos() {

            const token =
                obterToken();


            if (!token) {

                alert(
                    "Sua sessão expirou. Faça login novamente."
                );

                return;

            }


            try {

                const resposta =
                    await fetch(
                        `${API_URL}/pedido/produtos`,
                        {
                            method: "GET",

                            headers: {

                                "Authorization":
                                    "Bearer " +
                                    token

                            }

                        }
                    );


                const dados =
                    await resposta.json();


                if (!resposta.ok) {

                    alert(
                        dados.mensagem ||
                        "Não foi possível carregar os produtos."
                    );

                    return;

                }


                /* LIMPA TODAS AS CATEGORIAS */

                listaIogurtes.innerHTML =
                    "";

                listaLaticinios.innerHTML =
                    "";

                listaSucos.innerHTML =
                    "";

                listaPaoDeQueijo.innerHTML =
                    "";


                /* CRIA OS PRODUTOS */

                dados.produtos.forEach(
                    function (produto) {

                        adicionarProduto(
                            produto
                        );

                    }
                );


                atualizarResumo();


            } catch (erro) {

                console.error(
                    "Erro ao carregar produtos:",
                    erro
                );


                alert(
                    "Não foi possível conectar ao servidor."
                );

            }

        }


        /* =====================================================
           ATUALIZAR RESUMO
        ===================================================== */

        function atualizarResumo() {

        const produtos =
            document.querySelectorAll(
                ".produto-pedido"
            );


        let totalItens = 0;

        let subtotal = 0;


        produtos.forEach(
            function (produto) {

                const preco =
                    Number(
                        produto.dataset.preco
                    ) || 0;


                const inputs =
                    produto.querySelectorAll(
                        ".quantidade-input"
                    );


                let quantidadeProduto = 0;


                inputs.forEach(
                    function (input) {

                        const quantidade =
                            Number(
                                input.value
                            ) || 0;


                        totalItens +=
                            quantidade;


                        quantidadeProduto +=
                            quantidade;


                        subtotal +=
                            quantidade *
                            preco;

                    }
                );


                produto.classList.toggle(
                    "selecionado",
                    quantidadeProduto > 0
                );

            }
        );


        totalItensElemento.textContent =
            totalItens;


        subtotalElemento.textContent =
            formatarMoeda(
                subtotal
            );


        totalElemento.textContent =
            formatarMoeda(
                subtotal
            );


        botaoFinalizar.disabled =
            totalItens === 0;

    }

        /* =====================================================
        BOTÕES + E -
        ===================================================== */

        if (areaProdutos) {

            areaProdutos.addEventListener(
                "click",
                function (event) {

                    const botao =
                        event.target.closest(
                            ".btn-quantidade"
                        );


                    if (!botao) {
                        return;
                    }


                    /* LINHA DA VARIAÇÃO OU CONTADOR ÚNICO */

                    const linha =
                        botao.closest(
                            ".variacao-pedido"
                        );


                    if (!linha) {
                        return;
                    }


                    const input =
                        linha.querySelector(
                            ".quantidade-input"
                        );


                    if (!input) {
                        return;
                    }


                    let quantidade =
                        Number(
                            input.value
                        ) || 0;


                    /* AUMENTAR */

                    if (
                        botao.classList.contains(
                            "aumentar"
                        )
                    ) {

                        quantidade++;

                    }


                    /* DIMINUIR */

                    if (
                        botao.classList.contains(
                            "diminuir"
                        )
                    ) {

                        if (quantidade > 0) {

                            quantidade--;

                        }

                    }


                    input.value =
                        quantidade;


                    atualizarResumo();

                }
            );

        }

        /* =====================================================
        MODAL DE PAGAMENTO
        ===================================================== */

        async function abrirPagamento(
            itensPedido
        ) {

            let subtotal = 0;


            itensPedido.forEach(
                function (item) {

                    subtotal +=
                        item.subtotal;

                }
            );


            const token =
                obterToken();


            if (!token) {

                alert(
                    "Sua sessão expirou. Faça login novamente."
                );

                return;

            }


            try {

                const resposta =
                    await fetch(
                        `${API_URL}/pedido/desconto`,
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json",

                                "Authorization":
                                    "Bearer " + token
                            },

                            body: JSON.stringify({
                                subtotal:
                                    subtotal
                            })
                        }
                    );


                const desconto =
                    await resposta.json();


                if (!resposta.ok) {

                    alert(
                        desconto.mensagem ||
                        "Não foi possível calcular o desconto."
                    );

                    return;

                }


                const valorDesconto =
                    Number(
                        desconto.valorDesconto
                    ) || 0;


                const total =
                    Number(
                        desconto.total
                    ) || subtotal;


                let html = "";


                itensPedido.forEach(
                    function (item) {

                        let nome =
                            item.produto;


                        if (
                            item.variacaoNome
                        ) {

                            nome +=
                                " - " +
                                item.variacaoNome;

                        }


                        html += `

                            <div class="pagamento-item">

                                <span>
                                    ${nome}
                                    × ${item.quantidade}
                                </span>

                                <strong>
                                    ${formatarMoeda(
                                        item.subtotal
                                    )}
                                </strong>

                            </div>

                        `;

                    }
                );


                html += `

                    <div class="pagamento-total">

                        <span>
                            Subtotal
                        </span>

                        <strong>
                            ${formatarMoeda(
                                subtotal
                            )}
                        </strong>

                    </div>

                `;


                if (
                    desconto.descontoAplicado &&
                    valorDesconto > 0
                ) {

                    html += `

                        <div class="pagamento-item">

                            <span>
                                Desconto
                                (${desconto.percentual}%)
                            </span>

                            <strong>
                                - ${formatarMoeda(
                                    valorDesconto
                                )}
                            </strong>

                        </div>

                    `;

                }


                html += `

                    <div class="pagamento-total">

                        <span>
                            Total
                        </span>

                        <strong>
                            ${formatarMoeda(
                                total
                            )}
                        </strong>

                    </div>

                `;


                pagamentoResumo.innerHTML =
                    html;


                sessionStorage.setItem(
                    "topygut_subtotal_pedido",
                    subtotal
                );


                sessionStorage.setItem(
                    "topygut_desconto_pedido",
                    valorDesconto
                );


                sessionStorage.setItem(
                    "topygut_total_pedido",
                    total
                );


                sessionStorage.setItem(
                    "topygut_desconto_id",
                    desconto.descontoId || ""
                );


                document
                    .querySelectorAll(
                        'input[name="formaPagamento"]'
                    )
                    .forEach(
                        function (radio) {

                            radio.checked =
                                false;

                        }
                    );


                confirmarPedido.disabled =
                    true;


                modalPagamento.classList.add(
                    "ativo"
                );

                modalPagamento.setAttribute(
                    "aria-hidden",
                    "false"
                );

            } catch (erro) {

                console.error(
                    "Erro ao calcular desconto:",
                    erro
                );

                alert(
                    "Não foi possível conectar ao servidor."
                );
            }
        }

        function fecharPagamento() {

            modalPagamento.classList.remove(
                "ativo"
            );


            modalPagamento.setAttribute(
                "aria-hidden",
                "true"
            );

        }

        /* =====================================================
        FORMA DE PAGAMENTO
        ===================================================== */

        const formasPagamento =
            document.querySelectorAll(
                'input[name="formaPagamento"]'
            );


        formasPagamento.forEach(
            function (forma) {

                forma.addEventListener(
                    "change",
                    function () {

                        confirmarPedido.disabled =
                            false;

                    }
                );

            }
        );


        if (fecharModalPagamento) {

            fecharModalPagamento.addEventListener(
                "click",
                fecharPagamento
            );

        }


        if (cancelarPagamento) {

            cancelarPagamento.addEventListener(
                "click",
                fecharPagamento
            );

        }


        if (modalPagamentoOverlay) {

            modalPagamentoOverlay.addEventListener(
                "click",
                fecharPagamento
            );

        }

        /* =====================================================
        CONFIRMAR PEDIDO
        ===================================================== */

        if (confirmarPedido) {

            confirmarPedido.addEventListener(
                "click",
                async function () {

                    const formaSelecionada =
                        document.querySelector(
                            'input[name="formaPagamento"]:checked'
                        );


                    if (!formaSelecionada) {

                        alert(
                            "Selecione uma forma de pagamento."
                        );

                        return;

                    }


                    const pedidoSalvo =
                        sessionStorage.getItem(
                            "topygut_pedido_atual"
                        );


                    if (!pedidoSalvo) {

                        alert(
                            "Não foi possível localizar os itens do pedido."
                        );

                        return;

                    }


                    const itens =
                        JSON.parse(
                            pedidoSalvo
                        );


                    if (
                        !Array.isArray(itens) ||
                        itens.length === 0
                    ) {

                        alert(
                            "O pedido não possui itens."
                        );

                        return;

                    }


                    const token =
                        obterToken();


                    if (!token) {

                        alert(
                            "Sua sessão expirou. Faça login novamente."
                        );

                        return;

                    }


                    /*
                    EVITA CLIQUE DUPLO
                    */

                    confirmarPedido.disabled =
                        true;

                    const textoOriginal =
                        confirmarPedido.textContent;

                    confirmarPedido.textContent =
                        "Confirmando...";


                    try {

                        const resposta =
                            await fetch(
                                `${API_URL}/pedidos`,
                                {
                                    method: "POST",

                                    headers: {

                                        "Content-Type":
                                            "application/json",

                                        "Authorization":
                                            "Bearer " + token

                                    },

                                    body: JSON.stringify({

                                        itens:
                                            itens,

                                        formaPagamento:
                                            formaSelecionada.value

                                    })

                                }
                            );


                        const dados =
                            await resposta.json();


                        if (!resposta.ok) {

                            alert(
                                dados.mensagem ||
                                "Não foi possível confirmar o pedido."
                            );

                            confirmarPedido.disabled =
                                false;

                            confirmarPedido.textContent =
                                textoOriginal;

                            return;

                        }


                        /*
                        PEDIDO SALVO COM SUCESSO
                        */

                        sessionStorage.removeItem(
                            "topygut_pedido_atual"
                        );

                        sessionStorage.removeItem(
                            "topygut_subtotal_pedido"
                        );

                        sessionStorage.removeItem(
                            "topygut_desconto_pedido"
                        );

                        sessionStorage.removeItem(
                            "topygut_total_pedido"
                        );

                        sessionStorage.removeItem(
                            "topygut_desconto_id"
                        );


                        alert(
                            "Pedido #" +
                            dados.pedido.id +
                            " confirmado com sucesso!"
                        );


                        window.location.href =
                            "meus-pedidos.html";


                    } catch (erro) {

                        console.error(
                            "Erro ao confirmar pedido:",
                            erro
                        );


                        alert(
                            "Não foi possível conectar ao servidor."
                        );


                        confirmarPedido.disabled =
                            false;

                        confirmarPedido.textContent =
                            textoOriginal;

                    }

                }
            );

        }

        /* =====================================================
        FINALIZAR PEDIDO
        MONTA PRODUTOS + VARIAÇÕES
        ===================================================== */

        if (botaoFinalizar) {

            botaoFinalizar.addEventListener(
                "click",
                function () {

                    const produtos =
                        document.querySelectorAll(
                            ".produto-pedido"
                        );


                    const itensPedido = [];


                    produtos.forEach(
                        function (produto) {

                            const preco =
                                Number(
                                    produto.dataset.preco
                                ) || 0;


                            const linhas =
                                produto.querySelectorAll(
                                    ".variacao-pedido"
                                );


                            linhas.forEach(
                                function (linha) {

                                    const input =
                                        linha.querySelector(
                                            ".quantidade-input"
                                        );


                                    const quantidade =
                                        Number(
                                            input.value
                                        ) || 0;


                                    if (
                                        quantidade <= 0
                                    ) {

                                        return;

                                    }


                                    const variacaoId =
                                        linha.dataset.variacaoId
                                            ? Number(
                                                linha.dataset.variacaoId
                                            )
                                            : null;


                                    const variacaoTipo =
                                        linha.dataset.variacaoTipo ||
                                        null;


                                    const variacaoNome =
                                        linha.dataset.variacaoNome ||
                                        null;


                                    itensPedido.push({

                                        produtoId:
                                            Number(
                                                produto.dataset.id
                                            ),

                                        produto:
                                            produto.dataset.produto,

                                        variacaoId:
                                            variacaoId,

                                        variacaoTipo:
                                            variacaoTipo,

                                        variacaoNome:
                                            variacaoNome,

                                        quantidade:
                                            quantidade,

                                        precoUnitario:
                                            preco,

                                        subtotal:
                                            preco *
                                            quantidade

                                    });

                                }
                            );

                        }
                    );


                    if (
                        itensPedido.length === 0
                    ) {

                        alert(
                            "Selecione pelo menos um produto."
                        );

                        return;

                    }


                    console.log(
                        "Itens do pedido:",
                        itensPedido
                    );


                    /*
                    GUARDA TEMPORARIAMENTE O PEDIDO
                    PARA A ETAPA DE PAGAMENTO
                    */

                    sessionStorage.setItem(
                        "topygut_pedido_atual",
                        JSON.stringify(
                            itensPedido
                        )
                    );

                   abrirPagamento(itensPedido);

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


        if (
            menuToggle &&
            menu
        ) {

            menuToggle.addEventListener(
                "click",
                function () {

                    const aberto =
                        menu.classList.toggle(
                            "ativo"
                        );


                    menuToggle.classList.toggle(
                        "ativo",
                        aberto
                    );


                    menuToggle.setAttribute(
                        "aria-expanded",
                        aberto
                    );


                    menuToggle.setAttribute(
                        "aria-label",
                        aberto
                            ? "Fechar menu"
                            : "Abrir menu"
                    );

                }
            );


            menu
                .querySelectorAll("a")
                .forEach(
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
                            }
                        );
                    }
                );
        }

        /* =====================================================
           INICIAL
        ===================================================== */

        botaoFinalizar.disabled =
            true;

        carregarProdutos();

    }
);