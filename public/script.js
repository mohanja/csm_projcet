function strongPassword(p) {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;
    return regex.test(p);
}
function checkPassword() {
    const p = document.getElementById("password").value;

    toggle("len", p.length >= 8);
    toggle("upper", /[A-Z]/.test(p));
    toggle("lower", /[a-z]/.test(p));
    toggle("number", /[0-9]/.test(p));
    toggle("symbol", /[@$!%*?&]/.test(p));
}
function autoGmail() {
    let email = document.getElementById("email").value;
    if (!email.includes("@")) {
        document.getElementById("email").value = email + "@gmail.com";
    }
}
function toggle(id, condition) {
    const el = document.getElementById(id);
    const icon = el.querySelector(".icon");

    if (condition) {
        el.classList.add("valid");
        icon.textContent = "✔";
    } else {
        el.classList.remove("valid");
        icon.textContent = "✖";
    }
}
async function signup() {
    const name = document.getElementById("name").value;
    const mobile = document.getElementById("mobile").value;
    const email = document.getElementById("email").value;
    const dob = document.getElementById("dob").value;
    const password = document.getElementById("password").value;
    const confirm = document.getElementById("confirm").value;

    if (password !== confirm) return msg("Passwords not match");

    const res = await fetch("http://localhost:3000/signup", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ name, mobile, email, dob, password })
    });
    if (!isGmail(email)) {
    return msg("Email must be a valid @gmail.com address");
    }
    if (!isAdult(dob)) {
    return msg("You must be at least 18 years old");
    }
    const data = await res.json();

    if (data.message === "Signup successful") {
        localStorage.setItem("username", name); // ✅ store name
        window.location.href = "home.html";
    } else {
        msg(data.message);
    }
}

function msg(text) {
    document.getElementById("msg").innerText = text;
}

async function login() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const res = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (data.message === "Login success") {
        localStorage.setItem("username", data.name); // ✅ store name
        window.location.href = "home.html";
    } else {
        msg(data.message);
    }
}
const today = new Date();
const maxDate = new Date(
    today.getFullYear() - 18,
    today.getMonth(),
    today.getDate()
).toISOString().split("T")[0];

document.getElementById("dob").setAttribute("max", maxDate);

function isAdult(dob) {
    const today = new Date();
    const birthDate = new Date(dob);

    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();

    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }

    return age >= 18;
}

function msg(text) {
    document.getElementById("msg").innerText = text;
}
function isGmail(email) {
    return /^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(email);
}