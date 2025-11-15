const register = async () => {
    const username = document.getElementById("username");
    const firstname = document.getElementById("firstname");
    const lastname = document.getElementById("lastname");
    const password = document.getElementById("password");
    const confirmpassword = document.getElementById("confirmpassword");

    if (password.value === confirmpassword.value) {
        console.log("Call fetch");
        data = {
            "username": username.value,
            "password": password.value,
            "firstname": firstname.value,
            "lastname": lastname.value
        };
        const response = await fetch('http://localhost:8000/api/register', {
            method: 'POST', // Specify the HTTP method
            headers: {
                'Content-Type': 'application/json' // Indicate that the body is JSON
            },
            body: JSON.stringify(data) // Convert the JavaScript object to a JSON string
        });
        console.log(response);
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