document.addEventListener(
    "DOMContentLoaded",
    function () {

        /* =====================================================
           ELEMENTOS
        ===================================================== */

        const listaPedidos =
            document.getElementById(
                "listaPedidos"
            );

        const pedidosVazio =
            document.getElementById(
                "pedidosVazio"
            );

        const filtros =
            document.querySelectorAll(
                ".filtro"
            );

        const menuToggle =
            document.getElementById(
                "menuToggle"
            );

        const menu =
            document.querySelector(
                ".menu"
            );


        let pedidosCarregados = [];

        let filtroAtual =
            "todos";


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
           MOEDA
        ===================================================== */

        function formatarMoeda(
            valor
        ) {

            return Number(
                valor || 0
            ).toLocaleString(
                "pt-BR",
                {
                    style: "currency",
                    currency: "BRL"
                }
            );

        }


        /* =====================================================
           DATA
        ===================================================== */

        function formatarData(
            data
        ) {

            if (!data) {
                return "-";
            }


            return new Date(
                data
            ).toLocaleDateString(
                "pt-BR"
            );

        }


        /* =====================================================
           PAGAMENTO
        ===================================================== */

        function nomePagamento(
            forma
        ) {

            const nomes = {

                pix:
                    "Pix",

                boleto:
                    "Boleto",

                faturamento_10:
                    "Faturamento em 10 dias"

            };


            return (
                nomes[forma] ||
                forma ||
                "-"
            );

        }


        /* =====================================================
           STATUS
        ===================================================== */

        function nomeStatus(
            status
        ) {

            const nomes = {

                pendente:
                    "Pendente",

                separado:
                    "Pedido separado",

                entregue:
                    "Entregue",

                cancelado:
                    "Cancelado"

            };


            return (
                nomes[status] ||
                status
            );

        }


        /* =====================================================
           QUANTIDADE TOTAL DE ITENS
        ===================================================== */

        function quantidadeItens(
            itens
        ) {

            return itens.reduce(
                function (
                    total,
                    item
                ) {

                    return (
                        total +
                        Number(
                            item.quantidade
                        )
                    );

                },
                0
            );

        }


        /* =====================================================
           MONTA UM PEDIDO
        ===================================================== */

        function criarPedido(
            pedido
        ) {

            const card =
                document.createElement(
                    "article"
                );


            card.className =
                "pedido-card";


            card.dataset.status =
                pedido.status;


            const itens =
                Array.isArray(
                    pedido.itens
                )
                    ? pedido.itens
                    : [];


            let htmlItens = "";


            itens.forEach(
                function (item) {

                    let complemento = "";


                    if (
                        item.variacao_nome
                    ) {

                        const tipo =
                            item.variacao_tipo ===
                            "tamanho"
                                ? "Tamanho"
                                : "Sabor";


                        complemento =
                            tipo +
                            ": " +
                            item.variacao_nome;

                    }


                    htmlItens += `

                        <div class="item-pedido">

                            <div>

                                <strong>
                                    ${item.produto_nome}
                                </strong>

                                ${
                                    complemento
                                        ? `
                                            <span>
                                                ${complemento}
                                            </span>
                                          `
                                        : ""
                                }

                                <span>
                                    ${formatarMoeda(
                                        item.preco_unitario
                                    )}
                                    cada
                                </span>

                            </div>


                            <div>

                                <span>
                                    Qtd.
                                    ${item.quantidade}
                                </span>

                                <strong>
                                    ${formatarMoeda(
                                        item.subtotal
                                    )}
                                </strong>

                            </div>

                        </div>

                    `;

                }
            );


            const desconto =
                Number(
                    pedido.desconto_valor
                ) || 0;


            let htmlDesconto = "";


            if (
                desconto > 0
            ) {

                htmlDesconto = `

                    <div class="item-pedido">

                        <span>
                            Desconto
                            (${Number(
                                pedido.desconto_percentual
                            )}%)
                        </span>

                        <strong>
                            - ${formatarMoeda(
                                desconto
                            )}
                        </strong>

                    </div>

                `;

            }


            card.innerHTML = `

                <div class="pedido-cabecalho">

                    <div>

                        <span class="pedido-numero">
                            Pedido #${String(
                                pedido.id
                            ).padStart(
                                4,
                                "0"
                            )}
                        </span>

                        <span class="pedido-data">
                            Realizado em
                            ${formatarData(
                                pedido.criado_em
                            )}
                        </span>

                    </div>


                    <span
                        class="status ${pedido.status}"
                    >
                        ${nomeStatus(
                            pedido.status
                        )}
                    </span>

                </div>


                <div class="pedido-resumo">

                    <div class="pedido-info">

                        <span>
                            Itens
                        </span>

                        <strong>
                            ${quantidadeItens(
                                itens
                            )}
                        </strong>

                    </div>


                    <div class="pedido-info">

                        <span>
                            Total
                        </span>

                        <strong>
                            ${formatarMoeda(
                                pedido.total
                            )}
                        </strong>

                    </div>


                    <div class="pedido-info">

                        <span>
                            Pagamento
                        </span>

                        <strong>
                            ${nomePagamento(
                                pedido.forma_pagamento
                            )}
                        </strong>

                    </div>

                </div>


                <div class="pedido-acoes">

                    <button
                        type="button"
                        class="btn-detalhes"
                    >
                        Ver detalhes
                    </button>

                </div>


                <div class="pedido-detalhes">

                    <div class="detalhes-conteudo">

                        <h2>
                            Itens do pedido
                        </h2>


                        ${htmlItens}


                        <div class="item-pedido">

                            <span>
                                Subtotal
                            </span>

                            <strong>
                                ${formatarMoeda(
                                    pedido.subtotal
                                )}
                            </strong>

                        </div>


                        ${htmlDesconto}


                        <div class="item-pedido">

                            <strong>
                                Total
                            </strong>

                            <strong>
                                ${formatarMoeda(
                                    pedido.total
                                )}
                            </strong>

                        </div>


                        <div class="item-pedido">

                            <span>
                                Forma de pagamento
                            </span>

                            <strong>
                                ${nomePagamento(
                                    pedido.forma_pagamento
                                )}
                            </strong>

                        </div>

                    </div>

                </div>

            `;


            return card;

        }


        /* =====================================================
           RENDERIZAR
        ===================================================== */

        function renderizarPedidos() {

            listaPedidos.innerHTML =
                "";


            const pedidosFiltrados =
                pedidosCarregados.filter(
                    function (pedido) {

                        if (
                            filtroAtual ===
                            "todos"
                        ) {

                            return true;

                        }


                        return (
                            pedido.status ===
                            filtroAtual
                        );
                    }
                );

            pedidosFiltrados.forEach(
                function (pedido) {

                    listaPedidos.appendChild(
                        criarPedido(
                            pedido
                        )
                    );
                }
            );

            if (pedidosVazio) {

                pedidosVazio.style.display =
                    pedidosFiltrados.length === 0
                        ? "block"
                        : "none";
            }
        }

        /* =====================================================
           CARREGAR PEDIDOS DO MYSQL
        ===================================================== */

        async function carregarPedidos() {

            const token =
                obterToken();

            if (!token) {

                alert(
                    "Sua sessão expirou. Faça login novamente."
                );

                window.location.href =
                    "area-cliente.html";
                return;
            }

            try {

                const resposta =
                    await fetch(
                        `${API_URL}/meus-pedidos`,
                        {
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
                        "Não foi possível carregar seus pedidos."
                    );
                    return;
                }

                pedidosCarregados =
                    Array.isArray(
                        dados.pedidos
                    )
                        ? dados.pedidos
                        : [];

                renderizarPedidos();

            } catch (erro) {

                console.error(
                    "Erro ao carregar pedidos:",
                    erro
                );

                alert(
                    "Não foi possível conectar ao servidor."
                );
            }
        }

        /* =====================================================
           VER / OCULTAR DETALHES
        ===================================================== */

        listaPedidos.addEventListener(
            "click",
            function (event) {

                const botao =
                    event.target.closest(
                        ".btn-detalhes"
                    );

                if (!botao) {
                    return;
                }

                const card =
                    botao.closest(
                        ".pedido-card"
                    );

                const detalhes =
                    card.querySelector(
                        ".pedido-detalhes"
                    );

                const aberto =
                    detalhes.classList.toggle(
                        "ativo"
                    );

                botao.textContent =
                    aberto
                        ? "Ocultar detalhes"
                        : "Ver detalhes";
            }
        );

        /* =====================================================
           FILTROS
        ===================================================== */

        filtros.forEach(
            function (botao) {

                botao.addEventListener(
                    "click",
                    function () {

                        filtros.forEach(
                            function (item) {

                                item.classList.remove(
                                    "ativo"
                                );

                            }
                        );

                        botao.classList.add(
                            "ativo"
                        );

                        filtroAtual =
                            botao.dataset.filtro;


                        renderizarPedidos();

                    }
                );
            }
        );

        /* =====================================================
           MENU MOBILE
        ===================================================== */

        if (
            menuToggle &&
            menu
        ) {

            menuToggle.addEventListener(
                "click",
                function () {

                    menu.classList.toggle(
                        "ativo"
                    );

                    menuToggle.setAttribute(
                        "aria-expanded",
                        menu.classList.contains(
                            "ativo"
                        )
                    );
                }
            );
        }

        /* =====================================================
           INICIAL
        ===================================================== */

        carregarPedidos();

    }
);