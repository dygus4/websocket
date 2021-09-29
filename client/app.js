const loginForm = document.getElementById('welcome-form');
const messagesSection = document.getElementById('messages-section');
const messagesList = document.getElementById('messages-list');
const addMessageForm = document.getElementById('add-messages-form');
const userNameInput = document.getElementById('username');
const messageContentInput = document.getElementById('message-content');

let userName;

const socket = io();

socket.on('message', ({ author, content }) => addMessage(author, content))


const login = (event) => {
    event.preventDefault();

    if (userNameInput.value){
        userName = userNameInput.value;
        loginForm.classList.remove('show')
        messagesSection.classList.add('show')
        socket.emit('login', userName)
    } else {
        alert ('Please, write Your name and log-in')
    }
}

const sendMessage = (event) => {
    event.preventDefault();

    let messageContent = messageContentInput.value;

    if (messageContent) {
        addMessage(userName, messageContent);
        socket.emit('message', { author: userName, content: messageContent })
        messageContentInput.value= '';
    } else {
        alert ('Please, write Your message')
    }
}

function addMessage(author, content) {
    const message = document.createElement('li');
    message.classList.add('message');
    message.classList.add('message--received');
    if(author === userName) message.classList.add('message--self');
    message.innerHTML = `
      <h3 class="message__author">${userName === author ? 'You' : author }</h3>
      <div class="message__content">
        ${content}
      </div>
    `;
    messagesList.appendChild(message);
  }


loginForm.addEventListener('submit', login);
addMessageForm.addEventListener('submit', sendMessage);