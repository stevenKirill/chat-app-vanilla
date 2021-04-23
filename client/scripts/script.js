let socket = io();

const form = document.getElementsByTagName('form')[0];
const textInput = document.getElementById('text_input');
const messagesBlock = document.querySelector('.messages');
const leaveButton = document.querySelector('.leave-button');
const msgWrapper = document.querySelector('.messages_wrapper');
const currentRoomName = document.querySelector('.current_room_name');
const currentUsersList = document.querySelector('.room-users-list');

/** Функция парсинга урла */
(function parseSearchParams() {
  const userData = {};
  const {search} = window.location;
  const withoutQuestionMark =  search.slice(1);
  const splited = withoutQuestionMark.split('&');
  let currRoom = '';
  for(const param of splited) {
    const inner = param.split('=');
    if (inner[0] === 'room') {
      currRoom = inner[1];
    }
    userData[inner[0]] = inner[1];
  }
  socket.emit('joinRoom', {
    ...userData
  });
})();

form.addEventListener('submit',(e) => {
    e.preventDefault();
    let {value} = textInput;
    if (textInput.value) {
      socket.emit('chat message',{
        message: value
      });
      textInput.value = '';
    }
});

leaveButton.addEventListener('click', () => {
  window.location.replace('index.html');
});

function makeMessage(data) {
  const eachMessage = document.createElement('li');
  eachMessage.innerHTML = `
  <span class="nick-name">${data.user_name}</span>
  <span class="time-message">${data.time}</span>
  <div class="chat-msg">${data.message}</div>
  `;
  if (msgWrapper.offsetHeight > 350) {
    msgWrapper.classList.add('scrollable');
  }
  messagesBlock.appendChild(eachMessage);
}

socket.on('chat message',(data) => {
  makeMessage(data);
});

socket.on('message',(data) => {
  makeMessage(data);
});

socket.on('room users',(data) => {
  const {users, room} = data;
  drawChatUsersList(users)
  drawRoomName(room);
});

socket.on('user left',(data) => {
  const {users} = data;
  drawChatUsersList(users)
})

function drawChatUsersList(users) {
  currentUsersList.innerHTML = '';
  users.map(member => {
    const el = document.createElement('li');
    el.innerText = member.user_name;
    currentUsersList.appendChild(el)
  })
};

function drawRoomName(room) {
  currentRoomName.innerHTML = room;
}