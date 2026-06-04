
document.addEventListener('DOMContentLoaded', function() {
    verificarAutenticacao();
});

function verificarAutenticacao() {
    const token = localStorage.getItem('admin_token');
    const user = localStorage.getItem('admin_user');
    
    if (!token || !user) {
    window.location.href = 'login.html';
    return false;
}


try {
    const userData = JSON.parse(user);
    console.log(`Bem-vindo, ${userData.nome}!`);
    return true;
} catch (e) {
    logout();
}
}

function logout() {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    window.location.href = 'login.html';
}


function adicionarLogout() {
    const header = document.querySelector('.admin-header .user-info');
    if (header) {
        header.innerHTML += 
            <button onclick="logout()" class="btn-logout">
                <i class="fas fa-sign-out-alt"></i>
            </button>
        ;
    }
}