// chamando a função para verificar campos antes de enviar o formulário
// form.addEventListener('submit', event => verify(event));

document.querySelectorAll('form input').forEach(element => {
    // remover a borda de erro quando mudar o valor do input
    element.addEventListener('input', () => element.classList.remove('error'));
    // enviar o formulário ao apertar enter
    element.addEventListener('keyup', event => {
        if (event.key === 'Enter') {
            form.submit();
        }
    })
});

// fiz uma validação direto na página, mas perdeu o sentido.
// async function verify(event) {
//     // pegando inputs
//     const username = document.getElementById('username');
//     const email = document.getElementById('email');
//     const password = document.getElementById('password');

//     // criando regex
//     const regName = /^\w{3,16}$/
//     const regMail = /^[\w+.]+@\w+\.\w{2,}(?:\.\w{2})?$/
//     const regPass = /^[\W\w]{8,}$/

//     // adicionando erros
//     if (!regName.test(username.value)) {
//         event.preventDefault();
//         username.classList.add('error');
//     }
//     if (!regMail.test(email.value)) {
//         event.preventDefault();
//         email.classList.add('error');
//     }
//     if (!regPass.test(password.value)) {
//         event.preventDefault();
//         password.classList.add('error');
//     }
// }