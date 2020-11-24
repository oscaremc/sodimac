// registro de usuario 
const signupForm = document.querySelector('#form');

signupForm.addEventListener('submit', (e) =>{
      e.preventDefault();
      
      const email = document.querySelector('#singup-email').value;
      const password = document.querySelector('#sigup-password').value;

      auth
            .createUserWithEmailAndPassword(email, password)
            .then(userCredential => {
                  console.log('Usuario Creado')
            }) 
})


// ingreso del usuruario
const signinForm = document.querySelector('#form-login');

signinForm.addEventListener('submit', e =>{
      e.preventDefault();
      const email = document.querySelector('#login-email').value;
      const password = document.querySelector('#login-password').value;

      console.log(email, password)

      auth
            .signInWithEmailAndPassword(email, password)
            .then(userCredential => {
                  location.assign("../superUsuario.html")
            }) 
})
