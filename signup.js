
let button = document.getElementById("sbtn");
let name = document.getElementsByName("name")[0];
let email = document.getElementsByName("email")[0];
let password = document.getElementsByName("password")[0];

document.getElementById("toggleSwitch").addEventListener("click", function(e) {
    let attr = document.getElementsByTagName('html')[0].getAttribute('data-bs-theme');
    if(attr == "dark") {
        document.getElementsByTagName('html')[0].setAttribute('data-bs-theme', 'light');
        document.getElementById('toggleVal').innerText = 'Light';
    } else {
        document.getElementsByTagName('html')[0].setAttribute('data-bs-theme', 'dark');
        document.getElementById('toggleVal').innerText = 'Dark';
    }
});

function debounce(callback, timer = 1000) {
    let interval;
    return function() {
        clearTimeout(interval);
        interval = setTimeout(() => {
            callback();
        }, timer);
    }
}

function addInValidationFeedback(element, e_msg, message) {
    element.classList.add("is-invalid");
    element.classList.remove("is-valid");
    e_msg.classList.add("invalid-feedback");
    e_msg.classList.remove("valid-feedback");
    e_msg.innerHTML = message;
}

function removeInValidationFeedback(element, e_msg) {
    element.classList.add("is-valid");
    element.classList.remove("is-invalid");
    e_msg.classList.add("valid-feedback");
    e_msg.classList.remove("invalid-feedback");
    e_msg.innerHTML = "Looks good!";

}

name.addEventListener("input", debounce(function() {
    let value = name.value;
    let name_validation = document.getElementById("name");
    if (value.length < 5) {
        addInValidationFeedback(name, name_validation, "Name must be at least 5 characters long");
    } else {
        removeInValidationFeedback(name, name_validation);
    }
}));

email.addEventListener("input", debounce(function() {
    let value = email.value;
    let email_validation = document.getElementById("email");
    // It must have @arbisoft.com + standard email validation
    let e_regex = /^[A-Za-z0-9._%+-]+@arbisoft\.com$/;
    if (!e_regex.test(value)) {
        addInValidationFeedback(email, email_validation, "Email must be valid and have arbisoft.com domain");
    } else {
        removeInValidationFeedback(email, email_validation);
    }
}));

password.addEventListener("input", debounce(function() {
    let value = password.value;
    let password_validation = document.getElementById("password");
    // It must have at least 1 uppercase, 1 lowercase, 1 number and 1 special character
    let p_regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/;
    if (!p_regex.test(value)) {
        addInValidationFeedback(password, password_validation, "Password must have at least 1 uppercase, 1 lowercase, 1 number and 1 special character");
    } else {
        removeInValidationFeedback(password, password_validation);
    }
}));

async function getResponse() {
    try {
        return new Promise((resolve, reject) => {
            fetch("https://dummyjson.com/users/add", {
                method: "POST",
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    firstName: name.value,
                    email: email.value,
                    password: password.value
                })
            })
            .then((res) => {
                if(res.ok) {
                    resolve(res.json());
                } else {
                    reject(new Error("Submission Failed!"));
                }
            }).catch((error) => {
                reject(new Error(error));
            });
        });
    } catch (error) {
        console.log(error);
    }
}

button.addEventListener("click", function() {
    if(password.classList.contains("is-valid") && email.classList.contains("is-valid") && name.classList.contains("is-valid")) {
        const res = getResponse();
        res.then((data) => {
            document.getElementById("result").innerHTML = `
            {
                name: ${data.firstName},
                email: ${data.email},
                password: ${data.password}
            }`;
        }).catch((error) => {
            document.getElementById("result").innerHTML = error;
        });
    } else {
        alert("Please fill all the fields correctly");
    }
});