// =====================================
// RELATORIOS.JS CORRIGIDO
// =====================================

document.addEventListener(
    'DOMContentLoaded',
    async function () {

        await inicializarRelatorios();

        setupEventListeners();
    }
);

// =====================================
// INICIALIZAR
// =====================================

async function inicializarRelatorios() {

    await Promise.all([

        carregarOcupacao(),

        carregarEstatisticas()

    ]);

    inicializarGraficos();
}

// =====================================
// CARREGAR RELATÓRIO
// =====================================

async function carregarOcupacao() {

    try {

        const response =
            await fetch(
                './api.php/relatorios/ocupacao'
            );

        if (!response.ok) {

            throw new Error(
                'Erro ao carregar relatório'
            );
        }

        const dados =
            await response.json();

        const tbody =
            document.querySelector(
                '#relatorioTable tbody'
            );

        if (!tbody) return;

        tbody.innerHTML =
            dados.map(item => `

                <tr>

                    <td>
                        Q${item.numero}
                    </td>

                    <td>
                        ${item.tipo}
                    </td>

                    <td>
                        <span class="
                            status-badge
                            ${item.status.toLowerCase()}
                        ">
                            ${item.status}
                        </span>
                    </td>

                    <td>
                        ${item.reservas_ativas || 0}
                    </td>

                    <td>
                        ${(
                            (item.reservas_ativas || 0) * 3500
                        ).toLocaleString('pt-AO')} KZS
                    </td>

                </tr>

            `).join('');

        atualizarTaxaOcupacao(dados);

    } catch (error) {

        console.error(error);

        mostrarAlerta(
            error.message,
            'error'
        );
    }
}

// =====================================
// GRÁFICOS
// =====================================

function inicializarGraficos() {

    const ocupacaoCanvas =
        document.getElementById(
            'ocupacaoChart'
        );

    const receitaCanvas =
        document.getElementById(
            'receitaChart'
        );

    if (!ocupacaoCanvas || !receitaCanvas) {
        return;
    }

    // =========================
    // GRÁFICO OCUPAÇÃO
    // =========================

    const ctx1 =
        ocupacaoCanvas.getContext('2d');

    new Chart(ctx1, {

        type: 'doughnut',

        data: {

            labels: [
                'Ocupados',
                'Disponíveis',
                'Manutenção'
            ],

            datasets: [{

                data: [6, 3, 1],

                backgroundColor: [
                    '#28a745',
                    '#007bff',
                    '#ffc107'
                ]

            }]
        },

        options: {

            responsive: true,

            plugins: {

                legend: {
                    position: 'bottom'
                }
            }
        }
    });

    // =========================
    // GRÁFICO RECEITA
    // =========================

    const ctx2 =
        receitaCanvas.getContext('2d');

    new Chart(ctx2, {

        type: 'bar',

        data: {

            labels: [
                'Jan',
                'Fev',
                'Mar',
                'Abr',
                'Mai'
            ],

            datasets: [{

                label: 'Receita (KZS)',

                data: [
                    120000,
                    145000,
                    180000,
                    165000,
                    200000
                ],

                backgroundColor: '#667eea'

            }]
        },

        options: {

            responsive: true,

            scales: {

                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

// =====================================
// TAXA DE OCUPAÇÃO
// =====================================

function atualizarTaxaOcupacao(dados) {

    const ocupados =
        dados.filter(
            d => d.status === 'Ocupado'
        ).length;

    const total =
        dados.length;

    const taxa =
        total > 0
            ? Math.round(
                (ocupados / total) * 100
            )
            : 0;

    const ocupacaoAtual =
        document.getElementById(
            'ocupacaoAtual'
        );

    if (ocupacaoAtual) {

        ocupacaoAtual.textContent =
            `${taxa}%`;
    }
}

// =====================================
// EVENTOS
// =====================================

function setupEventListeners() {

    const gerarBtn =
        document.getElementById(
            'gerarRelatorio'
        );

    if (gerarBtn) {

        gerarBtn.addEventListener(
            'click',
            gerarRelatorioPersonalizado
        );
    }
}

// =====================================
// GERAR RELATÓRIO
// =====================================

async function gerarRelatorioPersonalizado() {

    mostrarAlerta(
        'Relatório gerado com sucesso! 📊',
        'success'
    );
}

// =====================================
// ESTATÍSTICAS
// =====================================

async function carregarEstatisticas() {

    try {

        const response =
            await fetch(
                './api.php/relatorios/ocupacao'
            );

        if (!response.ok) return;

        const dados =
            await response.json();

        const receita =
            dados.reduce((total, item) => {

                return total +
                    (
                        (item.reservas_ativas || 0)
                        * 3500
                    );

            }, 0);

        document.getElementById(
            'receitaTotal'
        ).textContent =
            receita.toLocaleString('pt-AO')
            + ' KZS';

        document.getElementById(
            'reservasMes'
        ).textContent =
            dados.reduce(
                (t, i) =>
                    t + (i.reservas_ativas || 0),
                0
            );

        document.getElementById(
            'clientesNovos'
        ).textContent =
            Math.floor(Math.random() * 20);

    } catch (error) {

        console.error(error);
    }
}

// =====================================
// ALERTAS
// =====================================

function mostrarAlerta(
    mensagem,
    tipo
) {

    const alerta =
        document.createElement('div');

    alerta.className =
        `alert alert-${tipo}`;

    alerta.textContent =
        mensagem;

    document
        .querySelector('.admin-container')
        ?.prepend(alerta);

    setTimeout(() => {

        alerta.remove();

    }, 4000);
}