const loadDashboard = async () => {
    const tbody = document.querySelector('.table-body');

    // ล้างข้อมูลเก่า
    tbody.innerHTML = '';

    try {
        const response = await fetch('/api/getDashboard');
        const data = await response.json();

        if (!data.success) {
            console.error("API Error:", data);
            return;
        }

        const rows = data.data;

        rows.forEach(item => {
            const { building_name, total } = item;

            const risk = getRiskLevel(total);

            const tr = document.createElement('tr');
            tr.classList.add('table-row');

            tr.innerHTML = `
                <td class="col col-1">${building_name}</td>
                <td class="col col-2">${total}</td>
                <td class="col col-3 ${risk.class}">${risk.text}</td>
            `;

            tbody.appendChild(tr);
        });

    } catch (err) {
        console.error("Fetch Error:", err);
    }
}


// ระดับความเสี่ยง (แก้ได้ตามใจคุณ)
const getRiskLevel = total => {
    if (total >= 15) return { text: "สูง", class: "text-red" };
    if (total >= 7) return { text: "ปานกลาง", class: "text-yellow" };
    return { text: "ต่ำ", class: "text-green" };
}

const initial = async () => {
    const profile = localStorage.getItem("profile");
    if( profile === null ){
        console.log("Not login yet");
        await showStatusPopup(false);
        await showUserStatus(false);
    } else {
        await showUserStatus(true);
        const profileJson = JSON.parse(profile);
        console.log(profileJson);
        const {success, stillsick, data} = await fetch('/api/isUserSick', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                "userID": profileJson.userID
            })
        }).then(r => r.json());
        if(success){
            showStatusPopup(stillsick);
        } else {
            console.log('Error fetch /api/isUserSick')
        }
    }
}

const showUserStatus = async (userLogin) => {
    const statusBlock = document.getElementById("status-card");
    const userStatus = document.getElementById("userStatus");
    const atBuilding = document.getElementById("atBuilding");
    const riskLevel = document.getElementById("riskLevel");

    const profile = localStorage.getItem("profile");
    const profileJson = JSON.parse(profile);

    if(userLogin) {
        console.log(userLogin);
        userStatus.innerHTML = profileJson.stillsick ? "ป่วย" : "ปกติ";
        atBuilding.innerHTML = profileJson.at;
        riskLevel.innerHTML = "Please login";
        return;
    } else {
        statusBlock.style.display = "none";
        console.log("Eieieie");
        return;
    }
}

const showStatusPopup = async (userIsSick) => {
    const modal = document.getElementById('sickStatusPopup');
    if(userIsSick) {
        modal.style.display = "blcok";
        return;
    } else {
        modal.style.display = "none";
        return;
    }
}

const userGetWell = async () => {
    const session = localStorage.getItem("sessionId");
    console.log(session);
    const response = await fetch('/api/userGetWell', {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            session: session
        })
    }).then( r => r.json());
    if(response.success){
        console.log("User status update");
        await showStatusPopup(false);
    }
}


// เรียกทำงานตอนหน้าโหลด
window.addEventListener('DOMContentLoaded', initial);
window.addEventListener('DOMContentLoaded', loadDashboard);
window.addEventListener('DOMContentLoaded', () => {
    document.getElementById("imSick").addEventListener("click", () => {
        window.location.href = '/sickreccord';
    });
    document.getElementById("getWellBtn").addEventListener("click", async () => {
        await userGetWell();
        window.location.href = '/';
    })
    document.querySelector(".modal-close").addEventListener("click", async () => {
        await showStatusPopup(false);
    })
});
