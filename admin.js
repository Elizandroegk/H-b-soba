document.addEventListener('DOMContentLoaded',
    function () {

        inicializarAdmin();
    }
);

// =====================================
// INICIALIZAÇÃO
// =====================================

async function inicializarAdmin() {

    try {

        if (
            
            document.getElementById(
                'clientesTable'
            )
        ) {

            await carregarClientes();
        }

        if (
            document.getElementById("totalQuartos").innerText = dados.total_quartos
            
        ) {

            await carregarQuartos();
        }

        if (
            document.getElementById(
                'totalReservas'
            )
        ) {

            await carregarReservas();
        }

        setupFormListeners();

    } catch (error) {

        console.error(error);

        mostrarAlerta(
            'Erro ao inicializar painel',
            'error'
        );
    }
}

// =====================================
// FORMULÁRIOS
// =====================================

function setupFormListeners() {

    const clienteForm =
        document.getElementById(
            'clienteForm'
        );

    if (clienteForm) {

        clienteForm.addEventListener(
            'submit',
            handleClienteSubmit
        );
    }

    const reservaForm =
        document.getElementById(
            'reservaForm'
        );

    if (reservaForm) {

        reservaForm.addEventListener(
            'submit',
            handleReservaSubmit
        );
    }
}

// =====================================
// CLIENTES
// =====================================

async function handleClienteSubmit(e) {

    e.preventDefault();

    const formData =
        new FormData(e.target);

    const cliente =
        Object.fromEntries(formData);

    try {

        await criarCliente(cliente);

        mostrarAlerta(
            'Cliente cadastrado com sucesso!',
            'success'
        );

        e.target.reset();

        await carregarClientes();

    } catch (error) {

        console.error(error);

        mostrarAlerta(
            error.message,
            'error'
        );
    }
}

async function carregarClientes() {

    try {

        const clientes =
            await listarClientes();

        const tbody =
            document.querySelector(
                '#clientesTable tbody'
            );

        if (!tbody) return;

        tbody.innerHTML = clientes.map(
            cliente => `

            <tr>

                <td>${cliente.nome}</td>

                <td>${cliente.bi}</td>

                <td>${cliente.telefone}</td>

                <td>${cliente.email}</td>

                <td>

                    ${new Date(
                        cliente.data_cadastro
                    ).toLocaleDateString('pt-AO')}

                </td>

            </tr>
        `
        ).join('');

    } catch (error) {

        console.error(error);
    }
}

// =====================================
// RESERVAS
// =====================================

async function handleReservaSubmit(e) {

    e.preventDefault();

    const formData =
        new FormData(e.target);

    const reserva =
        Object.fromEntries(formData);

    try {

        await criarReserva(reserva);

        mostrarAlerta(
            'Reserva criada com sucesso!',
            'success'
        );

        e.target.reset();

        await carregarReservas();

    } catch (error) {

        console.error(error);

        mostrarAlerta(
            error.message,
            'error'
        );
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

    document.querySelector(
        '.admin-container'
    )?.prepend(alerta);

    setTimeout(() => {

        alerta.remove();

    }, 4000);
}