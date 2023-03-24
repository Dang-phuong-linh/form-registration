"use strict";
const form = document.getElementById("form");
const name = document.getElementById("name");
const female = document.getElementById("female");
const male = document.getElementById("male");
const different = document.getElementById("different");
const date = document.getElementById("date");
const number = document.getElementById("number");
const email = document.getElementById("email");
const address = document.getElementById("address");
const description = document.getElementById("description");
const swim = document.getElementById("swim");
const soccer = document.getElementById("soccer");
const badminton = document.getElementById("badminton");
const btnSubmit = document.querySelector(".submit");
const btnUpdate = document.querySelector(".update");

const Elements = [name, email, date, address, number];

const setError = (element, message) => {
  const inputControl = element.parentElement;
  const errorDisplay = inputControl.querySelector(".error");

  errorDisplay.innerText = message;
  inputControl.classList.add("error");
  inputControl.classList.remove("success");
};

const setSuccess = (element) => {
  const inputControl = element.parentElement;
  const errorDisplay = inputControl.querySelector(".error");

  errorDisplay.innerText = "";
  inputControl.classList.add("success");
  inputControl.classList.remove("error");
};

const isValidEmail = (email) => {
  const re =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  return re.test(String(email).toLowerCase());
};

function isValidDate(date) {
  // First check for the pattern
  if (
    !/^(0?[1-9]|[12][0-9]|3[01])[\/\-](0?[1-9]|1[012])[\/\-]\d{4}$/.test(
      date.value
    )
  )
    setError(date, "date is not valid");

  var parts = date.value.split("/");
  var day = parseInt(parts[1], 10);
  var month = parseInt(parts[0], 10);
  var year = parseInt(parts[2], 10);

  if (year < 1000 || year > 3000 || month == 0 || month > 12)
    setError(date, "date is not valid");

  var monthLength = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

  if (year % 400 == 0 || (year % 100 != 0 && year % 4 == 0))
    monthLength[1] = 29;

  setSuccess(date);
}

const submit = () => {
  const nameValue = name.value.trim();
  console.log(nameValue);

  const emailValue = email.value.trim();
  const numberValue = number.value.trim();
  const descriptionValue = description.value.trim();
  const addressValue = address.value.trim();
  isValidDate(date);
  if (nameValue === "") {
    setError(name, "your name is required");
    return;
  } else {
    setSuccess(name);
  }

  if (emailValue === "") {
    setError(email, "your email is required");
  } else if (!isValidEmail(emailValue)) {
    setError(email, "Provide a valid email address");
  } else {
    setSuccess(email);
  }

  const isValidNumber = /^\d{10}$/;
  if (numberValue.match(isValidNumber)) {
    setSuccess(number);
  } else if (numberValue === "") {
    setError(number, "Number is invalid");
  } else {
    setError(number, "Number is invalid");
  }

  if (descriptionValue === "") {
    setError(description, "i want to know you more");
  } else {
    setSuccess(description);
  }

  if (addressValue === "") {
    setError(address, "choose again!");
  } else {
    setSuccess(address);
  }
  return true;
};
btnSubmit.addEventListener("click", submit);

let list = document.querySelectorAll('input[name = "gender"]');
let gender = Array.from(list).filter((element) => {
  if (element.checked) {
    return element;
  }
});

function HandleSubmit() {
  if (submit()) {
    let user = {
      name: name.value,
      email: email.value,
      date: date.value,
      number: number.value,
      address: address.value,
      gender: gender[0].value,
      description: description.value,
    };
    const preUser = JSON.parse(localStorage.getItem("ListUser"));
    if (preUser) {
      localStorage.setItem("listUsers", JSON.stringify([...preUser, user]));
    } else {
      localStorage.setItem("ListUsers", JSON.stringify([user]));
    }
    ResetValue();
    renderUser();
  }
}

function renderUser() {
  let dataLocalStorage = JSON.parse(localStorage.getItem("ListUsers"));
  if (dataLocalStorage && dataLocalStorage.length > 0) {
    let itemChildren = Object.keys(dataLocalStorage[0]);
    let th = itemChildren.map((item) => `<th>${item}</th>`);
    let td = dataLocalStorage.map((user) => {
      let keys = Object.keys(user);
      let htmltd = keys.map((item) => `<td>${user[item]}</td>`);
      return `<tr>${htmltd.join("")} <td>
      <button type="button" class="btn-edit" onclick="editUser(${
        user.id
      })">edit</button></td>
       <td><button class="btn-remove" type="button" onclick="removeUser(${
         user.id
       })">remove</button></td<tr/>`;
    });
    document.getElementById("add-table").innerHTML = `<table>
    <tr>${th.join("")}</tr>
    <tr>${td.join("")}</tr>`;
  } else {
    document.getElementById("add-table").innerHTML = "";
  }
}
renderUser();

function editUser(id) {
  let dataLocalStorage = JSON.parse(localStorage.getItem("ListUsers"));
  let userEdit = dataLocalStorage.filter((user) => {
    return user.id == id;
  });
  const objUser = userEdit[0];
  name.value = objUser.name;
  email.value = objUser.email;
  date.value = objUser.date;
  address.value = objUser.address;
  number.value = objUser.number;
  let listRadio = document.querySelectorAll('input[name="gender"]');
  Array.from(listRadio).filter((element) => {
    if (element.value == objUser.gender) {
      element.checked = true;
    } else {
      element.checked = false;
    }
  });

  btnUpdate.disabled = false;
  btnSubmit.disabled = true;
  btnUpdate.onclick = () => {
    if (submit()) {
      let newDataLocalStorage = dataLocalStorage.map((user) => {
        if (user.id == id) {
          user = { ...submit(), id: id };
        }
        return user;
      });
      localStorage.setItem("ListUsers", JSON.stringify(newDataLocalStorage));
      renderUser();
      ResetValue();
      btnUpdate.disabled = true;
      btnSubmit.disabled = false;
    }
  };
}
function ResetValue() {
  Elements.map((element) => {
    element.value = "";
  });
  let listRadio = document.querySelectorAll('input[name = "gender"]');
  Array.from(listRadio).filter((element) => {
    if (element.value == "female") {
      element.checked = true;
    } else {
      element.checked = false;
    }
  });
}
function removeUser(id) {
  let dataLocalStorage = JSON.parse(localStorage.getItem("ListUsers"));
  const newDataLocalStorage = dataLocalStorage.filter((user) => user.id != id);
  localStorage.setItem("ListUsers", JSON.stringify(newDataLocalStorage));
  renderUser();
}
