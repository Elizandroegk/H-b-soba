<?php

header('Content-Type: application/json');

// =====================================
// CONEXÃO
// =====================================

$host = 'localhost';

$dbname = 'hospedaria';

$username = 'root';

$password = '';

try {

    $pdo = new PDO(

        "mysql:host=$host;
        dbname=$dbname;
        charset=utf8",

        $username,
        $password
    );

    $pdo->setAttribute(
        PDO::ATTR_ERRMODE,
        PDO::ERRMODE_EXCEPTION
    );

} catch(PDOException $e) {

    die(json_encode([

        'error' =>
        $e->getMessage()
    ]));
}

// =====================================
// DADOS
// =====================================

$method =
    $_SERVER['REQUEST_METHOD'];

$input =
    json_decode(
        file_get_contents(
            'php://input'
        ),
        true
    );

$path =
    $_GET['endpoint'] ?? '';

// =====================================
// RESPOSTA
// =====================================

function sendResponse(
    mixed $data,
    int $status = 200
): void {

    http_response_code($status);

    echo json_encode($data);

    exit;
}

// =====================================
// ROTAS
// =====================================

switch ($path) {

    // LOGIN

    case 'login':

        if ($method === 'POST') {

            sendResponse([
                'message' =>
                'Login funcionando'
            ]);
        }

    break;

    // CLIENTES

    case 'clientes':

        if ($method === 'GET') {

            $stmt = $pdo->query(

                "SELECT *
                 FROM cliente
                 ORDER BY id_cliente DESC"
            );

            sendResponse(
                $stmt->fetchAll(
                    PDO::FETCH_ASSOC
                )
            );
        }

        if ($method === 'POST') {

            $stmt = $pdo->prepare(

                "INSERT INTO cliente
                (
                    nome,
                    bi,
                    telefone,
                    email,
                    endereco
                )

                VALUES
                (?, ?, ?, ?, ?)"
            );

            $stmt->execute([

                $input['nome'],

                $input['bi'],

                $input['telefone'],

                $input['email'],

                $input['endereco']
            ]);

            sendResponse([

                'success' => true,

                'message' =>
                'Cliente cadastrado'
            ]);
        }

    break;

    // QUARTOS

    case 'quartos':

        if ($method === 'GET') {

            $stmt = $pdo->query(

                "SELECT *
                 FROM quarto"
            );

            sendResponse(
                $stmt->fetchAll(
                    PDO::FETCH_ASSOC
                )
            );
        }

    break;

    // RESERVAS

    case 'reservas':

        if ($method === 'GET') {

            $stmt = $pdo->query(

                "SELECT *
                 FROM reserva"
            );

            sendResponse(
                $stmt->fetchAll(
                    PDO::FETCH_ASSOC
                )
            );
        }

    break;

    default:

        sendResponse([

            'error' =>
            'Rota não encontrada'
        ], 404);
}
?>