import {
    getAuth,
    signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";

import {
    app
} from "./firebase.js";

const auth = getAuth(app);

const loginForm =
    document.getElementById("login-form");

const loginMessage =
    document.getElementById("login-message");

loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email =
        document.getElementById("email").value.trim();

    const password =
        document.getElementById("password").value;

    loginMessage.textContent =
        "Signing in...";

    try {

        await signInWithEmailAndPassword(
            auth,
            email,
            password
        );

        loginMessage.textContent =
            "Login successful.";

        window.location.href =
            "dashboard.html";

    } catch (error) {

        console.error(
            "Login failed:",
            error
        );

        loginMessage.textContent =
            "Invalid email or password.";
    }
});