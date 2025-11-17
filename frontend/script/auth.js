const register = async () => {
    const username = document.getElementById("username");
    const firstname = document.getElementById("firstname");
    const lastname = document.getElementById("lastname");
    const password = document.getElementById("password");
    const confirmpassword = document.getElementById("confirmpassword");

    if (password.value === confirmpassword.value) {
        console.log("Call fetch");
        const payload = {
            "username": username.value,
            "password": password.value,
            "firstname": firstname.value,
            "lastname": lastname.value
        };
        const response = await fetch('http://localhost:8000/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });
        console.log(response);
    } else {
        alert("Incorrect password");
    }
}

const validateFields = async (element) => {
    if (!element.value.trim()) {
        return true;
    } else {
        return false;
    }
}

const login = async () => {
    const usernameElement = document.getElementById("username");
    const passwordElement = document.getElementById("password");

    if (await validateFields(usernameElement) || await validateFields(passwordElement)){
        alert("Please fill every field below.");
    } else {
        const payload = {
            "username": usernameElement.value,
            "password": passwordElement.value
        }
        const response = await fetch('http://localhost:8000/api/login', {
            method: 'POST', 
            credentials: "include",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        }).then( r => r.json());

        if(!response.success) {
            alert(response.message);
            console.log("Login faild.");
        } else {
            console.log(response.sessionId);
            localStorage.setItem("sessionId", response.sessionId);
            window.location.href = "/";
        }
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

const logout = async () => {
    const response = await fetch('/api/logout', {
        method: 'POST',
        credentials: 'include'   // สำคัญ! ให้ cookie ถูกส่งมาด้วย
    }).then(r => r.json());

    if (response.success) {
        // redirect ไป login
        window.location.href = '/login';
    } else {
        alert(response.message);
    }
}