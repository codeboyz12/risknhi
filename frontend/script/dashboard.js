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
    if (total >= 3) return { text: "สูง", class: "text-red" };
    if (total >= 2) return { text: "ปานกลาง", class: "text-yellow" };
    return { text: "ต่ำ", class: "text-green" };
}

const initial = async () => {
    let ft = localStorage.getItem("isFirstTime");
    console.log(`ft = ${ft}`);
    
    const profile = localStorage.getItem("profile");
    const sickbtn = document.getElementById("imSick");
    const finebtn = document.getElementById("imFine");
    const usernameLabel = document.getElementById("usernameLabel");
    setupPopupButtons()

    if( profile === null ){
        console.log("Not login yet");
        showStatusPopup(false);
        showLocationPopup(false);
        showUserStatus(false);
        usernameLabel.style.display = "none";
        sickbtn.style.display = "block";
        finebtn.style.display = "none";
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

        const response = await fetch('/api/getUsernameById', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                "userID": profileJson.userID
            })
        }).then(r => r.json());
        
        const username = response.data.username;

        if(success){
            ft = (ft === 'true');
            usernameLabel.innerHTML = username;
            if(stillsick) {
                if(ft){ 
                    showStatusPopup(false); 
                    localStorage.setItem("isFirstTime", JSON.parse(false))
                }
                else {showStatusPopup(true);}
                showLocationPopup(false);
                sickbtn.style.display = "none";
                finebtn.style.display = "block";
            } else {
                showStatusPopup(false);
                showLocationPopup(true);
                sickbtn.style.display = "block";
                finebtn.style.display = "none";
            }

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
    const riskIcon = riskLevel.previousElementSibling; // เลือก icon วงกลมข้างหน้า

    const profile = localStorage.getItem("profile");
    const profileJson = JSON.parse(profile || "{}");

    if(userLogin) {
        // 1. เช็คสถานะป่วยจาก Database
        const {success, stillsick, data} = await fetch('/api/isUserSick', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                "userID": profileJson.userID
            })
        }).then(r => r.json());

        // 2. หาสถานที่ปัจจุบัน
        // - ถ้าป่วย: ใช้ข้อมูลจาก Database (data.at)
        // - ถ้าไม่ป่วย: ใช้ข้อมูลล่าสุดจาก LocalStorage (profile.at)
        let currentLocation = "ไม่ระบุ";
        if (success && stillsick && data && data.at) {
            console.log("Data from local");
            currentLocation = data.at;
        } else if (profileJson.at) {
            console.log("Data from API");
            currentLocation = profileJson.at;
        }

        // 3. แสดงผล Text สถานะ และ สถานที่
        userStatus.innerHTML = (success && stillsick) ? "ป่วย" : "สบายดี";
        atBuilding.innerHTML = currentLocation;

        // 4. คำนวณ "ระดับความเสี่ยง" ของตึกที่เราอยู่ (แทนที่คำว่า Please Login)
        if (currentLocation !== "ไม่ระบุ") {
            try {
                // ดึงข้อมูล Dashboard มาเทียบดูว่าตึกที่เราอยู่มีคนป่วยกี่คน
                const dashResponse = await fetch('/api/getDashboard').then(r => r.json());
                if (dashResponse.success) {
                    // หาตึกที่เราอยู่
                    const buildingData = dashResponse.data.find(b => b.building_name === currentLocation);
                    const totalSick = buildingData ? buildingData.total : 0;
                    
                    // คำนวณความเสี่ยง (Reuse ฟังก์ชันที่มีอยู่แล้ว)
                    const risk = getRiskLevel(totalSick); 

                    // แสดงผล Text ความเสี่ยง
                    riskLevel.innerHTML = risk.text;
                    riskLevel.className = "value badge"; 
                    if (risk.text === "สูง") {
                        riskLevel.classList.add("bg-red-light", "text-red");
                    }
                    else if (risk.text === "ปานกลาง") {
                        riskLevel.classList.add("bg-yellow-light", "text-yellow");
                    }
                    else {
                        riskLevel.classList.add("bg-green-light", "text-green");
                    }
                }
            } catch (err) {
                console.error("Error fetching risk level:", err);
                riskLevel.innerHTML = "-";
            }
        } else {
            riskLevel.innerHTML = "-";
            riskIcon.style.color = "#ccc";
        }

    } else {
        // กรณีไม่ได้ Login
        statusBlock.style.display = "none";
    }
}

const showLocationPopup = (show) => {
    const modal = document.getElementById('StatusPopup');
    if (modal) {
        modal.style.display = show ? "flex" : "none";
    }
}

const showStatusPopup = async (userIsSick) => {
    const modal = document.getElementById('sickStatusPopup');
    if(userIsSick) {
        modal.style.display = "flex";
        return;
    } else {
        modal.style.display = "none";
        return;
    }
}

const setupPopupButtons = () => {
    const modal = document.getElementById('sickStatusPopup');
    const sickbtn = document.getElementById("imSick");
    const finebtn = document.getElementById("imFine");
    const buildingSelect = modal.querySelector('.buildingSelect');
    const floorSelect = modal.querySelector('.floorSelect');

    const profile = JSON.parse(localStorage.getItem("profile") || "{}");

    const getWellBtn = modal.querySelector('.btn-green');
    getWellBtn.addEventListener('click', async () => {
        const buildingID = buildingSelect.value;

        if (buildingID) {
            const selectedBuildingName = buildingSelect.options[buildingSelect.selectedIndex].text;
            profile.at = selectedBuildingName;
            profile.stillsick = false; 
            localStorage.setItem("profile", JSON.stringify(profile));
        }

        await userGetWell();
        await showStatusPopup(false);
        await showUserStatus(true);
        await loadDashboard();
        finebtn.style.display = "none";
        sickbtn.style.display = "block";
        // window.location.href = '/';
    });
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
};

// 1. ฟังก์ชันสำหรับดึงข้อมูลตึก (ใช้ Logic เดียวกับ building.js แต่ปรับ URL เป็น Relative Path)
const fetchBuildingData = async () => {
    try {
        // ใช้ Relative Path เพื่อความยืดหยุ่น
        const response = await fetch('/api/getBuild');
        const json = await response.json();
        return json.success ? json.data : [];
    } catch (error) {
        console.error("Error fetching buildings:", error);
        return [];
    }
}

// 2. ฟังก์ชันสำหรับกำหนดค่า Dropdown ให้กับ Modal ที่ระบุ
const setupModalDropdowns = async (modalId) => {
    const modal = document.getElementById(modalId);
    if (!modal) return;

    // เลือก Dropdown ภายใน Modal นั้นๆ โดยใช้ class
    const buildingSelect = modal.querySelector('.buildingSelect');
    const floorSelect = modal.querySelector('.floorSelect');

    if (!buildingSelect || !floorSelect) return;

    // ดึงข้อมูลตึก
    const buildings = await fetchBuildingData();

    // เคลียร์และเพิ่มตัวเลือกตึก
    buildingSelect.innerHTML = '<option value="" disabled selected>เลือกสถานที่</option>';
    buildings.forEach(b => {
        let option = document.createElement("option");
        option.value = b.buildingID;
        option.textContent = b.building_name;
        buildingSelect.appendChild(option);
    });

    // เพิ่ม Event Listener เมื่อเลือกตึก ให้คำนวณชั้น
    buildingSelect.addEventListener("change", () => {
        const selectedID = parseInt(buildingSelect.value);
        const building = buildings.find(b => b.buildingID === selectedID);

        // เคลียร์ชั้นเก่า
        floorSelect.innerHTML = '<option value="" disabled selected>เลือกชั้น</option>';

        // เพิ่มชั้นตามจำนวนจริงของตึกนั้น
        if (building) {
            for (let i = 1; i <= building.total_floor; i++) {
                let option = document.createElement("option");
                option.value = i;
                option.textContent = `ชั้น ${i}`;
                floorSelect.appendChild(option);
            }
        }
    });
}

// --------------------------------------------------------
// 1. ฟังก์ชันสำหรับ #sickStatusPopup (ยิง API อัปเดตตึก)
// --------------------------------------------------------
const setupApiLocationConfirm = (modalId) => {
    const modal = document.getElementById(modalId);
    if (!modal) return;

    const confirmBtn = modal.querySelector('.confirm-btn');
    const buildingSelect = modal.querySelector('.buildingSelect');
    const floorSelect = modal.querySelector('.floorSelect');

    if (!confirmBtn) return;

    // ล้าง Event Listener เก่า
    const newConfirmBtn = confirmBtn.cloneNode(true);
    confirmBtn.parentNode.replaceChild(newConfirmBtn, confirmBtn);

    newConfirmBtn.addEventListener('click', async () => {
        const buildingID = buildingSelect.value;
        const floorNumber = floorSelect.value;
        const session = localStorage.getItem("sessionId");

        if (!buildingID || !floorNumber) {
            alert("กรุณาเลือกตึกและชั้นให้ครบถ้วน");
            return;
        }

        try {
            // ยิง API เพื่อแจ้ง Server ว่าผู้ป่วยย้ายตึกแล้ว
            const response = await fetch('/api/updatePatientLocation', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    session: session,
                    buildingID: Number(buildingID),
                    floor_number: Number(floorNumber)
                })
            });
            const result = await response.json();

            if (result.success) {
                // อัปเดต LocalStorage
                const profile = JSON.parse(localStorage.getItem("profile") || "{}");
                const selectedBuildingName = buildingSelect.options[buildingSelect.selectedIndex].text;
                
                profile.at = selectedBuildingName;
                profile.stillsick = true; 
                localStorage.setItem("profile", JSON.stringify(profile));

                modal.style.display = "none";
                await showUserStatus(true);
                await loadDashboard(); 

            } else {
                alert("เกิดข้อผิดพลาด: " + (result.message || "ไม่สามารถบันทึกข้อมูลได้"));
            }
        } catch (error) {
            console.error("Error updating patient location:", error);
            alert("เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์");
        }
    });
}

// --------------------------------------------------------
// 2. ฟังก์ชันสำหรับ #StatusPopup (บันทึก LocalStorage อย่างเดียว)
// --------------------------------------------------------
const setupLocalLocationConfirm = (modalId) => {
    const modal = document.getElementById(modalId);
    if (!modal) return;

    const confirmBtn = modal.querySelector('.confirm-btn');
    const buildingSelect = modal.querySelector('.buildingSelect');
    
    // สำหรับ StatusPopup อาจจะไม่บังคับชั้นก็ได้ แต่ถ้ามี dropdown ก็รับค่าไว้
    // const floorSelect = modal.querySelector('.floorSelect'); 

    if (!confirmBtn) return;

    // ล้าง Event Listener เก่า
    const newConfirmBtn = confirmBtn.cloneNode(true);
    confirmBtn.parentNode.replaceChild(newConfirmBtn, confirmBtn);

    newConfirmBtn.addEventListener('click', async () => {
        const buildingID = buildingSelect.value;

        if (!buildingID) {
            alert("กรุณาเลือกสถานที่");
            return;
        }

        // --- ทำงานแค่ LocalStorage ---
        const profile = JSON.parse(localStorage.getItem("profile") || "{}");
        const selectedBuildingName = buildingSelect.options[buildingSelect.selectedIndex].text;

        profile.at = selectedBuildingName;
        // ไม่ต้องแก้ค่า stillsick เพราะแค่ระบุตำแหน่งเฉยๆ
        console.log(profile);
        
        localStorage.setItem("profile", JSON.stringify(profile));
        // ---------------------------

        modal.style.display = "none";

        // รีเฟรชหน้าจอ UI
        await showUserStatus(true);
    });
}

// เรียกทำงานตอนหน้าโหลด
window.addEventListener('DOMContentLoaded', initial);
window.addEventListener('DOMContentLoaded', loadDashboard);
window.addEventListener('DOMContentLoaded', () => {
    document.getElementById("imSick").addEventListener("click", () => {
        window.location.href = '/sickreccord';
    });
    document.getElementById("imFine").addEventListener("click", async () => {
        await userGetWell();
        document.getElementById("imFine").style.display = "none";
        window.location.href = '/';
    });
    document.getElementById("sickStatusPopupClose").addEventListener("click", async () => {
        await showStatusPopup(false);
    });
     document.getElementById("StatusPopupClose").addEventListener("click", async () => {
        await showLocationPopup(false);
    });
    if (typeof setupModalDropdowns === 'function') {
        setupModalDropdowns('sickStatusPopup');
        setupModalDropdowns('StatusPopup');
    }

    // 1. #sickStatusPopup -> ใช้แบบยิง API (คนป่วยย้ายที่)
    setupApiLocationConfirm('sickStatusPopup');

    // 2. #StatusPopup -> ใช้แบบ LocalStorage (คนทั่วไประบุตำแหน่ง)
    setupLocalLocationConfirm('StatusPopup');
});
