const fetchBuilding = async () => {
    const payloads = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    }
    const response = await fetch('http://localhost:8000/api/getBuild', payloads);
    const json = await response.json();
    if(json.success){
        return json.data;
    } else {
        return null;
    }
}

const loadBuildingsToSelect = async () => {
    const buildings = await fetchBuilding();
    // โหลด dropdown อาคาร
    const buildingSelect = document.getElementById("buildingSelect");
    const floorSelect = document.getElementById("floorSelect");

    // สร้างตัวเลือกอาคาร
    buildings.forEach(b => {
        let option = document.createElement("option");
        option.value = b.buildingID; 
        option.textContent = b.building_name;
        buildingSelect.appendChild(option);
    });

    // เมื่อเลือกอาคาร ให้สร้าง dropdown ชั้นตามจำนวนชั้นของอาคารนั้น
    buildingSelect.addEventListener("change", () => {
        const selectedID = parseInt(buildingSelect.value);

        // หา building ที่เลือก
        const building = buildings.find(b => b.buildingID === selectedID);

        // ล้างชั้นเก่า
        floorSelect.innerHTML = '<option value="" disabled selected>เลือกชั้น</option>';

        // เพิ่มชั้นใหม่
        for (let i = 1; i <= building.total_floor; i++) {
            let option = document.createElement("option");
            option.value = i;
            option.textContent = `ชั้น ${i}`;
            floorSelect.appendChild(option);
        }
    });
};

// เรียกใช้งาน
loadBuildingsToSelect();

async function addPatientRecord() {
    const buildingID = document.getElementById("buildingSelect").value;
    const floorNumber = document.getElementById("floorSelect").value;
    const session = localStorage.getItem("sessionId");
    console.log(session);

    if (!buildingID || !floorNumber) {
        alert("กรุณาเลือกตึกและชั้นให้ครบก่อน!");
        return;
    }

    const payload = {
        session: session,
        buildingID: Number(buildingID),
        floor_number: Number(floorNumber)
    };

    try {
        const response = await fetch('/api/addPatient', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        }).then(r => r.json());

        if (response.success) {
            const profile = localStorage.getItem("profile");
            const profileJson = JSON.parse(profile);
            console.log(profileJson);
            profileJson.at = buildingID;
            console.log(profileJson);
            localStorage.setItem("profile", JSON.stringify(profileJson));
            alert("บันทึกข้อมูลสำเร็จ!");
            window.location.href = '/';
        } else {
            alert("บันทึกไม่สำเร็จ: " + (response.message || "Error"));
        }
    } catch (error) {
        console.error("Fetch error:", error);
        alert("เกิดข้อผิดพลาดในการเชื่อมต่อ API");
    }
}

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("sickRecordBtn")
            .addEventListener("click", addPatientRecord);
});
