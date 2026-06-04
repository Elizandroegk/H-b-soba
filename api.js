const API_BASE = './api.php';

// =====================================
// REQUISIÇÃO BASE
// =====================================

async function apiRequest(endpoint, options = {}) {

    const token =
        localStorage.getItem('token');

    const config = {

        headers: {

            'Content-Type': 'application/json',

            ...(token && {
                'Authorization': `Bearer ${token}`
            }),

            ...options.headers
        },

        ...options
    };

    const response = await fetch(

        `${API_BASE}?endpoint=${endpoint}`,

        config
    );

    let data;

    try {

        data = await response.json();

    } catch {

        throw new Error(
            'Resposta inválida do servidor'
        );
    }

    if (!response.ok) {

        throw new Error(
            data.error ||
            'Erro na requisição'
        );
    }

    return data;
}

// =====================================
// LOGIN
// =====================================

async function login(username, senha) {

    const data = await apiRequest(
        'login',
        {

            method: 'POST',

            body: JSON.stringify({

                username,
                senha
            })
        }
    );

    if (data.token) {

        localStorage.setItem(
            'token',
            data.token
        );
    }

    return data;
}

// =====================================
// CLIENTES
// =====================================

async function listarClientes() {

    return apiRequest('clientes');
}

async function criarCliente(cliente) {

    return apiRequest(
        'clientes',
        {

            method: 'POST',

            body: JSON.stringify(cliente)
        }
    );
}

// =====================================
// QUARTOS
// =====================================

async function listarQuartos() {

    return apiRequest('quartos');
}

// =====================================
// RESERVAS
// =====================================

async function listarReservas() {

    return apiRequest('reservas');
}

async function criarReserva(reserva) {

    return apiRequest(
        'reservas',
        {

            method: 'POST',

            body: JSON.stringify(reserva)
        }
    );
}