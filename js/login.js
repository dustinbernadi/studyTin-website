const form = document.getElementById('loginForm');

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const response = await fetch("https://studytin-server-production.up.railway.app/api/auth/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (response.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        window.location.href = "/index.html"; // Redirect to dashboard on success
    }
    else {
        alert(data.message || "Login failed. Please try again.");
    }
    form.reset(); // Clear the form fields after submission

});