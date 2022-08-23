const form = document.getElementById('form');

form.querySelectorAll('input').forEach(element => {
    // remover a borda de erro quando mudar o valor do input
    element.addEventListener('input', () => element.classList.remove('error'));
    // enviar o formulário ao apertar enter
    element.addEventListener('keyup', event => {
        if (event.key === 'Enter') {
            form.submit();
        }
    });
});

form.addEventListener('submit', e => getToken(e));

async function getToken(event) {
    try {
        const dados = {
            email: document.getElementById('email').value,
            password: document.getElementById('password').value
        }

        const response = await axios.post('http://localhost:6847/api/token', dados);

        localStorage.setItem('token', response.data.token);

    } catch (error) {
        console.log(error);
    }
}