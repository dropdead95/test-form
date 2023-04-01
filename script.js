const form = document.getElementById("form");
const password = document.getElementById("password");
let isValidData = false;
const URL = "https://jsonplaceholder.typicode.com/posts";

const errors = {
  textError: "Минимальное значение 2, максимальное 25",
  dateError: "Максимальное значение - сегодня",
  emailError: "Неверный формат адреса электронной почты",
  passwordError:
    "минимум 8 символов, " +
    "минимум 1 символ в верхнем регистре, " +
    "минимум одна цифра 1-9, " +
    "минимум 1 специальный символ из перечисленных !@#$%",
  identityPasswordError: "Пароли не совпадают",
  requiredFieldError: "Обязательное поле",
};

const now = new Date()
  .toLocaleDateString()
  .split(" ")[0]
  .split(".")
  .reverse()
  .join("-");

const validationEmail = (email) => {
  return /^([a-z0-9_-]+\.)*[a-z0-9_-]+@[a-z0-9_-]+(\.[a-z0-9_-]+)*\.[a-z]{2,6}$/.test(
    email
  );
};

const validationPassword = (password) => {
  return /(?=.*[0-9])(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z!@#$%^&*]{8,}/.test(
    password
  );
};

const validationTemplate = (element, textError, condition) => {
  if (condition) {
    element.classList.add("invalid");
    element.nextElementSibling.classList.add("active");
    element.nextElementSibling.textContent = textError;
    isValidData = false;
  } else {
    element.classList.remove("invalid");
    element.nextElementSibling.classList.remove("active");
    isValidData = true;
  }
};

const validateElement = (element) => {
  if (element.name === "name" || element.name === "surname") {
    validationTemplate(
      element,
      errors.textError,
      element.value.length < 2 || element.value.length > 25
    );
  }
  if (element.name === "date") {
    validationTemplate(element, errors.dateError, element.value > now);
  }
  if (element.name === "email") {
    validationTemplate(
      element,
      errors.emailError,
      !validationEmail(element.value)
    );
  }
  if (element.name === "password") {
    validationTemplate(
      element,
      errors.passwordError,
      !validationPassword(element.value)
    );
  }
  if (element.name === "repeat-password") {
    validationTemplate(
      element,
      errors.identityPasswordError,
      element.value !== password.value
    );
  }
};

for (let element of form.elements) {
  if (element.tagName !== "BUTTON") {
    element.addEventListener("blur", () => validateElement(element));
  }
}

const handleSubmit = async (e) => {
  e.preventDefault();

  for (let element of form.elements) {
    if (element.tagName !== "BUTTON") {
      validationTemplate(
        element,
        errors.requiredFieldError,
        element.value === ""
      );
    }
  }

  if (isValidData === true) {
    const formEl = e.currentTarget;
    const formData = new FormData(formEl);
    const formDataObject = Object.fromEntries(formData.entries());
    const jsonString = JSON.stringify(formDataObject);
    const fetchOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: jsonString,
    };
    const response = await fetch(URL, fetchOptions);

    const result = response.json();
    console.log(result);
    form.reset();
  }
};

form.addEventListener("submit", handleSubmit);
