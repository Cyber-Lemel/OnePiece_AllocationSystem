function validateLogin(event) {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    if (email === "" || password === "") {
        alert("Don't let it empty!");
        return false;
    }

    if (!email.includes("@")) {
        alert("Enter a valid one.");
        return false;
    }

    alert("Login successful!");
    window.location.href = "index.html";

    return false;

}

function logout() {
    alert("You have been logged out.");
    window.location.href = "index.html";
}
