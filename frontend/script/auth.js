const register = async () => {
    const username = document.getElementById("username");
    const firstname = document.getElementById("firstname");
    const lastname = document.getElementById("lastname");
    const password = document.getElementById("password");
    const confirmpassword = document.getElementById("confirmpassword");

    if (await validateFields(username)){ alert("Username are require!"); return;}
    if (await validateFields(firstname)){ alert("Firstname are require!"); return;}
    if (await validateFields(lastname)){ alert("Lastname are require!"); return;}
    if (await validateFields(password) || await validateFields(confirmpassword)){ alert("Password are require!"); return;}

    if (password.value === confirmpassword.value) {
        console.log("Call fetch");
        const payload = {
            "username": username.value,
            "password": password.value,
            "firstname": firstname.value,
            "lastname": lastname.value
        };
        const response = await fetch('/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        }).then( r => r.json() );
        if (response.success) {
            window.location.href = "/login";
        } else {
            alert("Register fail");
        }
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
        const response = await fetch('/api/login', {
            method: 'POST', 
            credentials: "include",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        }).then( r => r.json() );

        if(!response.success) {
            alert(response.message);
            console.log("Login faild.");
        } else {
            console.log(response.sessionId);
            localStorage.setItem("sessionId", response.sessionId);
            const profile = {
                userID: response.userId,
                at: null,
                isSick: false
            }
            localStorage.setItem("profile", JSON.stringify(profile));
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
        localStorage.clear();
        window.location.href = '/';
    } else {
        alert(response.message);
    }
}