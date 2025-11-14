const register = () => {
    const username = document.getElementById("username");
    const firstname = document.getElementById("firstname");
    const lastname = document.getElementById("lastname");
    const password = document.getElementById("password");
    const confirmpassword = document.getElementById("confirmpassword");

    if (password === confirmpassword) {
        console.log("Call fetch");
    } else {
        alert("Incorrect password");
    }
}

const checkpassword = () => {
    const password = document.getElementById("password");
    const confirmpassword = document.getElementById("confirmpassword");
    const incorrectAlert = document.getElementById("incorrectAlert");

    if (password.value !== confirmpassword.value) {
        incorrectAlert.style.display = 'block';
    } else {
        incorrectAlert.style.display = 'none';
    }
}