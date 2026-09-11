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

        const totalPedidos =
            document.getElementById(
                "totalPedidos"
            );

        const pedidosVazio =
            document.getElementById(
                "pedidosVazio"
            );

        const pesquisaPedido =
            document.getElementById(
                "pesquisaPedido"
            );

        const filtroStatus =
            document.getElementById(
                "filtroStatus"
            );


        const modalPedido =
            document.getElementById(
                "modalPedido"
            );

        const modalPedidoOverlay =
            document.getElementById(
                "modalPedidoOverlay"
            );

        const fecharModalPedido =
            document.getElementById(
                "fecharModalPedido"
            );

        const cancelarPedido =
            document.getElementById(
                "cancelarPedido"
            );

        const tituloPedido =
            document.getElementById(
                "tituloPedido"
            );

        const pedidoDetalhes =
            document.getElementById(
                "pedidoDetalhes"
            );

        const statusPedido =
            document.getElementById(
                "statusPedido"
            );

        const salvarStatusPedido =
            document.getElementById(
                "salvarStatusPedido"
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

        let pedidoSelecionado = null;


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
            ).toLocaleString(
                "pt-BR",
                {
                    dateStyle:
                        "short",

                    timeStyle:
                        "short"
                }
            );

        }


        /* =====================================================
           CNPJ
        ===================================================== */

        function formatarCNPJ(
            cnpj
        ) {

            const numeros =
                String(cnpj || "")
                    .replace(
                        /\D/g,
                        ""
                    );


            if (
                numeros.length !== 14
            ) {

                return cnpj || "-";

            }


            return numeros.replace(
                /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/,
                "$1.$2.$3/$4-$5"
            );

        }


        /* =====================================================
           FORMA DE PAGAMENTO
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
                    "Faturamento 10 dias"

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
           MONTA LISTA
        ===================================================== */

        function renderizarPedidos() {

            const pesquisa =
                pesquisaPedido.value
                    .trim()
                    .toLowerCase();


            const status =
                filtroStatus.value;


            const filtrados =
                pedidosCarregados.filter(
                    function (pedido) {

                        const texto =
                            [
                                pedido.id,
                                pedido.razao_social,
                                pedido.cnpj
                            ]
                                .join(" ")
                                .toLowerCase();


                        const correspondePesquisa =
                            texto.includes(
                                pesquisa
                            );


                        const correspondeStatus =
                            !status ||
                            pedido.status ===
                                status;


                        return (
                            correspondePesquisa &&
                            correspondeStatus
                        );

                    }
                );


            listaPedidos.innerHTML =
                "";


            filtrados.forEach(
                function (pedido) {

                    const tr =
                        document.createElement(
                            "tr"
                        );


                    tr.innerHTML = `

                        <td>
                            <strong>
                                #${String(
                                    pedido.id
                                ).padStart(
                                    4,
                                    "0"
                                )}
                            </strong>
                        </td>


                        <td>
                            ${pedido.razao_social || "-"}
                        </td>


                        <td>
                            ${formatarCNPJ(
                                pedido.cnpj
                            )}
                        </td>


                        <td>
                            ${formatarData(
                                pedido.criado_em
                            )}
                        </td>


                        <td>
                            <strong>
                                ${formatarMoeda(
                                    pedido.total
                                )}
                            </strong>
                        </td>


                        <td>
                            ${nomePagamento(
                                pedido.forma_pagamento
                            )}
                        </td>


                        <td>

                            <span
                                class="status ${pedido.status}"
                            >
                                ${nomeStatus(
                                    pedido.status
                                )}
                            </span>

                        </td>


                        <td>

                            <button
                                type="button"
                                class="btn-ver-pedido"
                                data-id="${pedido.id}"
                            >
                                Ver pedido
                            </button>

                        </td>

                    `;


                    listaPedidos.appendChild(
                        tr
                    );

                }
            );


            totalPedidos.textContent =
                filtrados.length === 1
                    ? "1 pedido"
                    : filtrados.length +
                      " pedidos";


            pedidosVazio.classList.toggle(
                "mostrar",
                filtrados.length === 0
            );

        }


        /* =====================================================
           CARREGAR PEDIDOS
        ===================================================== */

        async function carregarPedidos() {

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
                        `${API_URL}/admin/pedidos`,
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
                        "Não foi possível carregar os pedidos."
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
           ABRIR PEDIDO
        ===================================================== */

        async function abrirPedido(
            pedido
        ) {

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
                        `${API_URL}/admin/pedidos/${pedido.id}`,
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
                        "Não foi possível carregar o pedido."
                    );

                    return;

                }


                pedidoSelecionado =
                    dados.pedido;


                const pedidoCompleto =
                    dados.pedido;


                const itens =
                    Array.isArray(
                        dados.itens
                    )
                        ? dados.itens
                        : [];


                tituloPedido.textContent =
                    "Pedido #" +
                    String(
                        pedidoCompleto.id
                    ).padStart(
                        4,
                        "0"
                    );


                statusPedido.value =
                    pedidoCompleto.status;


                let html = `

                    <div class="pedido-bloco">

                        <strong>
                            Cliente
                        </strong>

                        <span>
                            ${pedidoCompleto.razao_social || "-"}
                        </span>

                        <br>

                        <span>
                            CNPJ:
                            ${formatarCNPJ(
                                pedidoCompleto.cnpj
                            )}
                        </span>

                    </div>


                    <div class="pedido-bloco">

                        <strong>
                            Data do pedido
                        </strong>

                        <span>
                            ${formatarData(
                                pedidoCompleto.criado_em
                            )}
                        </span>

                    </div>


                    <div class="pedido-bloco">

                        <strong>
                            Forma de pagamento
                        </strong>

                        <span>
                            ${nomePagamento(
                                pedidoCompleto.forma_pagamento
                            )}
                        </span>

                    </div>


                    <div class="pedido-bloco">

                        <strong>
                            Itens do pedido
                        </strong>

                `;


                itens.forEach(
                    function (item) {

                        let variacao = "";


                        if (
                            item.variacao_nome
                        ) {

                            const tipo =
                                item.variacao_tipo ===
                                "tamanho"
                                    ? "Tamanho"
                                    : "Sabor";


                            variacao = `

                                <small>
                                    ${tipo}:
                                    ${item.variacao_nome}
                                </small>

                            `;

                        }


                        html += `

                            <div class="pedido-item">

                                <div>

                                    <strong>
                                        ${item.produto_nome}
                                    </strong>

                                    ${variacao}

                                    <div>
                                        ${item.quantidade}
                                        ×
                                        ${formatarMoeda(
                                            item.preco_unitario
                                        )}
                                    </div>

                                </div>


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
                    </div>


                    <div class="pedido-bloco">

                        <div class="pedido-item">

                            <span>
                                Subtotal
                            </span>

                            <strong>
                                ${formatarMoeda(
                                    pedidoCompleto.subtotal
                                )}
                            </strong>

                        </div>
                `;


                const desconto =
                    Number(
                        pedidoCompleto.desconto_valor
                    ) || 0;


                if (
                    desconto > 0
                ) {

                    html += `

                        <div class="pedido-item">

                            <span>
                                Desconto
                                (${Number(
                                    pedidoCompleto.desconto_percentual
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


                html += `

                        <div class="pedido-total">

                            <strong>
                                Total
                            </strong>

                            <strong>
                                ${formatarMoeda(
                                    pedidoCompleto.total
                                )}
                            </strong>

                        </div>

                    </div>

                `;


                pedidoDetalhes.innerHTML =
                    html;


                modalPedido.classList.add(
                    "ativo"
                );


                modalPedido.setAttribute(
                    "aria-hidden",
                    "false"
                );


            } catch (erro) {

                console.error(
                    "Erro ao carregar detalhes do pedido:",
                    erro
                );


                alert(
                    "Não foi possível conectar ao servidor."
                );

            }

        }


        /* =====================================================
           FECHAR MODAL
        ===================================================== */

        function fecharPedido() {

            modalPedido.classList.remove(
                "ativo"
            );


            modalPedido.setAttribute(
                "aria-hidden",
                "true"
            );


            pedidoSelecionado =
                null;

        }


        /* =====================================================
           CLIQUE NA LISTA
        ===================================================== */

        listaPedidos.addEventListener(
            "click",
            function (event) {

                const botao =
                    event.target.closest(
                        ".btn-ver-pedido"
                    );


                if (!botao) {
                    return;
                }


                const id =
                    Number(
                        botao.dataset.id
                    );


                const pedido =
                    pedidosCarregados.find(
                        function (item) {

                            return (
                                Number(
                                    item.id
                                ) === id
                            );

                        }
                    );


                if (pedido) {

                    abrirPedido(
                        pedido
                    );

                }

            }
        );


        /* =====================================================
           PESQUISA E FILTRO
        ===================================================== */

        pesquisaPedido.addEventListener(
            "input",
            renderizarPedidos
        );


        filtroStatus.addEventListener(
            "change",
            renderizarPedidos
        );


        /* =====================================================
           FECHAR MODAL
        ===================================================== */

        fecharModalPedido.addEventListener(
            "click",
            fecharPedido
        );


        cancelarPedido.addEventListener(
            "click",
            fecharPedido
        );


        modalPedidoOverlay.addEventListener(
            "click",
            fecharPedido
        );


        /* =====================================================
           SALVAR STATUS
        ======================================================== */
        salvarStatusPedido.addEventListener(
            "click",
            async function () {

                if (!pedidoSelecionado) {
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


                const novoStatus =
                    statusPedido.value;


                salvarStatusPedido.disabled =
                    true;


                const textoOriginal =
                    salvarStatusPedido.textContent;


                salvarStatusPedido.textContent =
                    "Salvando...";


                try {

                    const resposta =
                        await fetch(
                            `${API_URL}/admin/pedidos/${pedidoSelecionado.id}/status`,
                            {
                                method:
                                    "PATCH",

                                headers: {

                                    "Content-Type":
                                        "application/json",

                                    "Authorization":
                                        "Bearer " +
                                        token

                                },

                                body:
                                    JSON.stringify({
                                        status:
                                            novoStatus
                                    })

                            }
                        );


                    const dados =
                        await resposta.json();


                    if (!resposta.ok) {

                        alert(
                            dados.mensagem ||
                            "Não foi possível atualizar a situação."
                        );

                        return;

                    }


                    /*
                    ATUALIZA O PEDIDO NA LISTA LOCAL
                    */

                    const pedidoLista =
                        pedidosCarregados.find(
                            function (pedido) {

                                return (
                                    Number(
                                        pedido.id
                                    ) ===
                                    Number(
                                        pedidoSelecionado.id
                                    )
                                );

                            }
                        );


                    if (pedidoLista) {

                        pedidoLista.status =
                            novoStatus;

                    }


                    pedidoSelecionado.status =
                        novoStatus;


                    renderizarPedidos();


                    alert(
                        "Situação do pedido atualizada com sucesso!"
                    );


                    fecharPedido();


                } catch (erro) {

                    console.error(
                        "Erro ao atualizar situação:",
                        erro
                    );


                    alert(
                        "Não foi possível conectar ao servidor."
                    );


                } finally {

                    salvarStatusPedido.disabled =
                        false;


                    salvarStatusPedido.textContent =
                        textoOriginal;

                }

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

                }
            );

        }


        /* =====================================================
           INICIAL
        ===================================================== */

        carregarPedidos();

    }
);