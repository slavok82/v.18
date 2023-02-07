const body = document.getElementsByTagName('body')[0];
const form = document.getElementById('form');
const email = document.getElementById('email');
const password = document.getElementById('password');
const logInBtn = document.getElementById('send');
const messageToUeser = document.createElement('p');
const users = document.createElement('div');
users.classList.add('users');
const URL = 'https://reqres.in/api';

function onSendForm(e) {
    e.preventDefault();
    let sendLogIn = new XMLHttpRequest();
    sendLogIn.open('POST', `${URL}/login`);
    sendLogIn.setRequestHeader('content-type', 'application/json');
    sendLogIn.onload = function (e) {
        if (e.currentTarget.status === 400) {
            messageToUeser.innerText = Object.values(JSON.parse(sendLogIn.response));
            form.append(messageToUeser);
            return false;
        }
        if (e.currentTarget.status >= 200 && e.currentTarget.status <= 299) {
            form.classList.add('d-none');
            const requestUsers = new XMLHttpRequest;
            requestUsers.open('GET', `${URL}/users?page=1`, false);
            requestUsers.send();
            const responseUsers = JSON.parse(requestUsers.response);
            body.append(users);
            responseUsers.data.forEach(element => {
                user = document.createElement('div');
                user.classList.add('user');
                editBtn = document.createElement('button');
                editBtn.classList.add('edit_btn');
                editBtn.innerText = 'edit';
                deleteBtn = document.createElement('button');
                deleteBtn.classList.add('delete_btn');
                deleteBtn.innerText = 'delete';
                Object.values(element).forEach((el, index, arr) => {
                    spanValue = document.createElement('p');
                    if (index === arr.length - 1) {
                        spanValue = document.createElement('img');
                        spanValue.classList.add('photo');
                        spanValue.src = `${el}`;
                        user.append(spanValue);
                        return false;
                    }
                    if (index === 0) {
                        spanValue.classList.add('id');
                    };
                    if (index === 1) {
                        spanValue.classList.add('email');
                    };
                    if (index === 2) {
                        spanValue.classList.add('first_name');
                    };
                    if (index === 3) {
                        spanValue.classList.add('last_name');
                    };
                    spanValue.innerText = el;
                    user.append(spanValue);
                })                
                user.append(editBtn, deleteBtn);
                users.append(user);
                editBtn.addEventListener('click', onEditUser);
                deleteBtn.addEventListener('click', onDeleteUser);
            }); 
        };
    };
    sendLogIn.send(JSON.stringify({
        email: email.value,
        password: password.value
    }));
}
function onEditUser(e) {
    const userChildren = e.target.parentElement.children;
    const saveBtn = document.createElement('button');
    saveBtn.classList.add('save_btn');
    e.target.hidden = true;
    saveBtn.innerText = 'save';    
    for (let j = 0; j < userChildren.length; j++) {
        if (userChildren[j].className === 'email' || userChildren[j].className === 'first_name' || userChildren[j].className === 'last_name' || userChildren[j].className === 'photo') {
            editInput = document.createElement('input');
            editInput.value = userChildren[j].innerText;
            userChildren[j].after(editInput);
        }
        if (userChildren[j].className === 'email' || userChildren[j].className === 'first_name' || userChildren[j].className === 'last_name') {
            userChildren[j].style.display = 'none';
        }
        if (userChildren[j].className === 'photo') {
            editInput.value = userChildren[j].src;
            editInput.classList.add('edit_photo');
        }
        if (userChildren[j].className === 'email') {
            editInput.classList.add('edit_email');
        }
        if (userChildren[j].className === 'first_name') {
            editInput.classList.add('edit_first_name');
        }
        if (userChildren[j].className === 'last_name') {
            editInput.classList.add('edit_last_name');
        }
        if (userChildren[j].className === 'delete_btn') {
            userChildren[j].hidden = true;
        }
    }
    e.target.parentElement.append(saveBtn);
    saveBtn.addEventListener('click', onSeveСhangesUser); 
}
function onSeveСhangesUser(e) {
    const userChildren = e.target.parentElement.children;
    const id = (() => {
        for (el of userChildren) {
            if (el.className === 'id') {
                return el.innerText;
            };
        };
    })();
      const emailEdit = (() => {
        for (el of userChildren) {
            if (el.className === 'edit_email') {
                return el;
            };
        };
    })();
      const firstNameEdit = (() => {
        for (el of userChildren) {
            if (el.className === 'edit_first_name') {
                return el;
            };
        };
    })();
      const lastNameEdit = (() => {
        for (el of userChildren) {
            if (el.className === 'edit_last_name') {
                return el;
            };
        };
    })();
      const photoEdit = (() => {
        for (el of userChildren) {
            if (el.className === 'edit_photo') {
                return el;
            };
        };
    })();
    const requestToUpdate = new XMLHttpRequest();
    requestToUpdate.open('PATCH', `${URL}/users/${id}`);
    requestToUpdate.setRequestHeader('content-type', 'application/json');
    requestToUpdate.onload = function (e) {
        if (e.currentTarget.status === 200) {
            for (el of userChildren) {
                if (el.className === 'email') {
                    el.innerText = emailEdit.value;
                    el.style.display = 'block';
                };
                if (el.className === 'first_name') {
                    el.innerText = firstNameEdit.value;
                    el.style.display = 'block';
                };
                if (el.className === 'last_name') {
                    el.innerText = lastNameEdit.value;
                    el.style.display = 'block';
                };
                if (el.className === 'photo') {
                    el.src = photoEdit.value;
                    el.style.display = 'block';
                };
                if (el.localName === 'input' || el.className === 'save_btn') {
                    el.hidden = true;
                }
                if (el.className === 'edit_btn' || el.className === 'delete_btn') {
                    el.hidden = false;
                }
            };
        } 
    }
    requestToUpdate.send(JSON.stringify({
        email: emailEdit.value,
        first_name: firstNameEdit.value,
        last_name: lastNameEdit.value,
        avatar: photoEdit.value
    })); 
}
function onDeleteUser(ev) {
    const userChildren = ev.target.parentElement.children;
    const user = ev.target.parentElement;
    const id = (() => {
        for (el of userChildren) {
            if (el.className === 'id') {
                return el.innerText;
            };
        };
    })();
    const deleteRequest = new XMLHttpRequest();
    deleteRequest.open('DELETE', `${URL}/users/${id}`);
    deleteRequest.onload = (e) => {
        if (e.currentTarget.status === 204) {
            user.remove();
        }
    }
    deleteRequest.send();
}
form.addEventListener('submit', onSendForm);

