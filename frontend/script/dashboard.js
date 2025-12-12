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

const initial = () => {
    const profile = localStorage.getItem("profile");
    if( profile === null ){
        console.log("Not login yet");
        return;
    } else {
        const data = JSON.parse(profile);
        console.log(data);
    }
}


// เรียกทำงานตอนหน้าโหลด
window.addEventListener('DOMContentLoaded', initial);
window.addEventListener('DOMContentLoaded', loadDashboard);
window.addEventListener('DOMContentLoaded', () => {
    document.getElementById("imSick").addEventListener("click", () => {
        window.location.href = '/sickreccord';
    })
});
