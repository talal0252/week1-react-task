const button = document.getElementById('sbtn');
const name = document.getElementsByName('name')[0];
const email = document.getElementsByName('email')[0];
const password = document.getElementsByName('password')[0];

document.getElementById('toggleSwitch').addEventListener('click', function (e) {
  const attr = document
    .getElementsByTagName('html')[0]
    .getAttribute('data-bs-theme');
  if (attr == 'dark') {
    document
      .getElementsByTagName('html')[0]
      .setAttribute('data-bs-theme', 'light');
    document.getElementById('toggleVal').innerText = 'Light';
  } else {
    document
      .getElementsByTagName('html')[0]
      .setAttribute('data-bs-theme', 'dark');
    document.getElementById('toggleVal').innerText = 'Dark';
  }
});

function debounce(callback, timer = 1000) {
  let interval;
  return function () {
    clearTimeout(interval);
    interval = setTimeout(() => {
      callback();
    }, timer);
  };
}

function addInvalidationFeedback(element, errorMessage, message) {
  element.classList.add('is-invalid');
  element.classList.remove('is-valid');
  errorMessage.classList.add('invalid-feedback');
  errorMessage.classList.remove('valid-feedback');
  errorMessage.innerHTML = message;
}

function removeInvalidationFeedback(element, errorMessage) {
  element.classList.add('is-valid');
  element.classList.remove('is-invalid');
  errorMessage.classList.add('valid-feedback');
  errorMessage.classList.remove('invalid-feedback');
  errorMessage.innerHTML = 'Looks good!';
}

name.addEventListener(
  'input',
  debounce(function () {
    const value = name.value;
    const nameValidation = document.getElementById('name');
    if (value.length < 5) {
      addInvalidationFeedback(
        name,
        nameValidation,
        'Name must be at least 5 characters long'
      );
    } else {
      removeInvalidationFeedback(name, nameValidation);
    }
  })
);

email.addEventListener(
  'input',
  debounce(function () {
    const value = email.value;
    const emailValidation = document.getElementById('email');
    // It must have @arbisoft.com + standard email validation
    const emailRegex = /^[A-Za-z0-9._%+-]+@arbisoft\.com$/;
    if (!emailRegex.test(value)) {
      addInvalidationFeedback(
        email,
        emailValidation,
        'Email must be valid and have arbisoft.com domain'
      );
    } else {
      removeInvalidationFeedback(email, emailValidation);
    }
  })
);

password.addEventListener(
  'input',
  debounce(function () {
    const value = password.value;
    const passwordValidation = document.getElementById('password');
    // It must have at least 1 uppercase, 1 lowercase, 1 number and 1 special character
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/;
    if (!passwordRegex.test(value)) {
      addInvalidationFeedback(
        password,
        passwordValidation,
        'Password must have at least 1 uppercase, 1 lowercase, 1 number and 1 special character'
      );
    } else {
      removeInvalidationFeedback(password, passwordValidation);
    }
  })
);

async function getResponse() {
  try {
    return new Promise((resolve, reject) => {
      fetch('https://dummyjson.com/users/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: name.value,
          email: email.value,
          password: password.value,
        }),
      })
        .then((res) => {
          if (res.ok) {
            resolve(res.json());
          } else {
            reject(new Error('Submission Failed!'));
          }
        })
        .catch((error) => {
          reject(new Error(error));
        });
    });
  } catch (error) {
    console.log(error);
  }
}

button.addEventListener('click', function () {
  if (
    password.classList.contains('is-valid') &&
    email.classList.contains('is-valid') &&
    name.classList.contains('is-valid')
  ) {
    const res = getResponse();
    res
      .then((data) => {
        document.getElementById('result').innerHTML = `
            {
                name: ${data.firstName},
                email: ${data.email},
                password: ${data.password}
            }`;
      })
      .catch((error) => {
        document.getElementById('result').innerHTML = error;
      });
  } else {
    alert('Please fill all the fields correctly');
  }
});
