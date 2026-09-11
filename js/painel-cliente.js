/* =========================================================
   TOPY'GUT - PAINEL DO CLIENTE
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        /* =====================================================
           ELEMENTOS
        ===================================================== */

        const nomeCliente =
            document.getElementById(
                "nomeCliente"
            );

        const clienteNome =
            document.getElementById(
                "clienteNome"
            );

        const clienteEmail =
            document.getElementById(
                "clienteEmail"
            );

        const clienteTelefone =
            document.getElementById(
                "clienteTelefone"
            );

        const clienteCodigo =
            document.getElementById(
                "clienteCodigo"
            );

        const ultimosPedidos =
            document.getElementById(
                "ultimosPedidos"
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
           DADOS DO CLIENTE
        ===================================================== */

        async function carregarCliente() {

            const token =
                obterToken();


            if (!token) {
                return;
            }


            try {

                const resposta =
                    await fetch(
                        `${API_URL}/cliente/painel`,
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

                    console.error(
                        dados
                    );

                    return;

                }


                const cliente =
                    dados.cliente;


                /*
                   NOME NO "OLÁ"
                */

                nomeCliente.textContent =
                    cliente.razao_social ||
                    "Cliente";


                /*
                   CARD MINHA CONTA
                */

                clienteNome.textContent =
                    cliente.razao_social ||
                    "-";


                clienteEmail.textContent =
                    cliente.email ||
                    "-";


                clienteTelefone.textContent =
                    cliente.telefone ||
                    "-";


                clienteCodigo.textContent =
                    "#" +
                    String(
                        cliente.id
                    ).padStart(
                        4,
                        "0"
                    );


            } catch (erro) {

                console.error(
                    "Erro ao carregar dados do cliente:",
                    erro
                );

            }

        }


        /* =====================================================
           ÚLTIMOS PEDIDOS
        ===================================================== */

        async function carregarUltimosPedidos() {

            const token =
                obterToken();


            if (!token) {
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

                    console.error(
                        dados
                    );

                    return;

                }


                ultimosPedidos.innerHTML =
                    "";


                const pedidos =
                    Array.isArray(
                        dados.pedidos
                    )
                        ? dados.pedidos.slice(
                            0,
                            3
                        )
                        : [];


                if (
                    pedidos.length === 0
                ) {

                    ultimosPedidos.innerHTML = `

                        <tr>

                            <td colspan="4">
                                Nenhum pedido realizado.
                            </td>

                        </tr>

                    `;

                    return;

                }


                pedidos.forEach(
                    function (pedido) {

                        const tr =
                            document.createElement(
                                "tr"
                            );


                        tr.innerHTML = `

                            <td>
                                #${String(
                                    pedido.id
                                ).padStart(
                                    4,
                                    "0"
                                )}
                            </td>


                            <td>
                                ${formatarData(
                                    pedido.criado_em
                                )}
                            </td>


                            <td>

                                <span
                                    class="status-pedido ${pedido.status}"
                                >
                                    ${nomeStatus(
                                        pedido.status
                                    )}
                                </span>

                            </td>


                            <td>
                                ${formatarMoeda(
                                    pedido.total
                                )}
                            </td>

                        `;


                        ultimosPedidos.appendChild(
                            tr
                        );

                    }
                );


            } catch (erro) {

                console.error(
                    "Erro ao carregar últimos pedidos:",
                    erro
                );

            }

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

                    const menuAberto =
                        menu.classList.toggle(
                            "ativo"
                        );


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
        }

        /* =====================================================
           INICIAL
        ===================================================== */

        carregarCliente();

        carregarUltimosPedidos();

    }
);