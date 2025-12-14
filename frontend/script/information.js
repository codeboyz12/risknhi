document.addEventListener("DOMContentLoaded", () => {
    fetchUserData();

    const confirmPassInput = document.getElementById("confirmpassword");
    const passInput = document.getElementById("password");

    if (confirmPassInput) confirmPassInput.addEventListener("input", checkPasswordMatch);
    if (passInput) passInput.addEventListener("input", checkPasswordMatch);

    const saveBtn = document.getElementById("saveProfileBtn");
    if (saveBtn) {
        saveBtn.addEventListener("click", saveProfile);
    }
});

const fetchUserData = async () => {
    try {
        const response = await fetch('/api/getProfile', {
            method: 'POST',
            credentials: 'include'
        });
        const json = await response.json();

        if (json.success) {
            document.getElementById("firstname").value = json.data.firstname;
            document.getElementById("lastname").value = json.data.lastname;
        } else {
            alert("ไม่สามารถดึงข้อมูลผู้ใช้ได้ หรือ Session หมดอายุ");
            window.location.href = "/login";
        }
    } catch (error) {
        console.error("Error fetching profile:", error);
    }
};

const checkPasswordMatch = () => {
    const password = document.getElementById("password").value;
    const confirm = document.getElementById("confirmpassword").value;
    const alertBox = document.getElementById("incorrectAlert");

    if (password && confirm && password !== confirm) {
        alertBox.style.display = 'block';
        return false;
    } else {
        alertBox.style.display = 'none';
        return true;
    }
};

const saveProfile = async () => {
    const firstname = document.getElementById("firstname").value;
    const lastname = document.getElementById("lastname").value;
    const password = document.getElementById("password").value;
    const confirmpassword = document.getElementById("confirmpassword").value;

    if (!firstname.trim() || !lastname.trim()) {
        alert("กรุณากรอกชื่อและนามสกุล");
        return;
    }

    if (password && password !== confirmpassword) {
        alert("รหัสผ่านใหม่ไม่ตรงกัน");
        return;
    }

    const payload = {
        firstname,
        lastname,
        password: password || null
    };

    try {
        const response = await fetch('/api/updateProfile', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });
        const json = await response.json();

        if (json.success) {
            alert("บันทึกข้อมูลสำเร็จ!");
            window.location.href = "/";
        } else {
            alert("บันทึกข้อมูลไม่สำเร็จ: " + (json.message || "Unknown error"));
        }
    } catch (error) {
        console.error("Error updating profile:", error);
        alert("เกิดข้อผิดพลาดในการเชื่อมต่อ");
    }
};

document.addEventListener("DOMContentLoaded", () => {
    const deleteAccountBtn = document.getElementById("deleteAccountBtn");

    if (deleteAccountBtn) {
        deleteAccountBtn.addEventListener("click", async () => {
            // 1. ถามยืนยันก่อนลบ (Safety First)
            const confirmed = confirm("⚠️ คำเตือน: คุณต้องการลบบัญชีถาวรใช่หรือไม่?\nข้อมูลประวัติการป่วยทั้งหมดจะหายไปและกู้คืนไม่ได้");
            
            if (!confirmed) return;

            // 2. ดึง userID จาก LocalStorage
            const session = localStorage.getItem("sessionId");
            if (!session) {
                alert("ไม่พบข้อมูลผู้ใช้ กรุณา Login ใหม่");
                return;
            }

            try {
                // 3. ยิง Request ไปที่ API
                const response = await fetch('/api/deleteAccount', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ session: session })
                });

                const result = await response.json();

                if (result.success) {
                    alert("บัญชีของคุณถูกลบเรียบร้อยแล้ว");
                    
                    // 4. เคลียร์ข้อมูลในเครื่องและดีดออกไปหน้า Login
                    localStorage.clear();
                    window.location.href = '/login'; 
                } else {
                    alert("เกิดข้อผิดพลาด: " + (result.message || "ไม่สามารถลบบัญชีได้"));
                }

            } catch (error) {
                console.error("Error deleting account:", error);
                alert("เกิดข้อผิดพลาดในการเชื่อมต่อ Server");
            }
        });
    }
});