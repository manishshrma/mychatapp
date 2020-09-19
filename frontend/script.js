const chatform = document.getElementById("chat-form");
const chatmessage = document.querySelector(".chat-messages");
const roomName = document.getElementById("room-name");
const userList = document.getElementById("users");
var oldbutn = document.getElementById("mysubmit");

// get username and room from url
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});
console.log("..........................................");
console.log(username, room);

var firebaseConfig = {
  apiKey: "AIzaSyCmw1NnRkjuTfY_AS1Gw1F5qwo1gREYUMY",
  authDomain: "chatapp-6b2e9.firebaseapp.com",
  databaseURL: "https://chatapp-6b2e9.firebaseio.com",
  projectId: "chatapp-6b2e9",
  storageBucket: "chatapp-6b2e9.appspot.com",
  messagingSenderId: "1019268452596",
  appId: "1:1019268452596:web:bd1d68789b207a60c10ea1",
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
var database = firebase.database();

console.log(";;;;;;;;;;;;;;;;;;;;;;;;");
console.log(firebase);


oldbutn.addEventListener("click", getdatafromfirebase);
function getdatafromfirebase() {
  const dbobj = firebase.database().ref().child("mydata");
  dbobj.on("value", (snap) => {


    let allkey = Object.keys(snap.val());
    console.log(allkey);

    allkey.forEach((key) => {
      const div = document.createElement("div");
      div.classList.add("message");

      // console.log(snap.val()[key].mymsg.text);
      div.innerHTML = `	<p class="meta">${snap.val()[key].mymsg.username}<span>${
        snap.val()[key].mymsg.time}</span></p>
  <p class="text">
     ${snap.val()[key].mymsg.text}
  </p>`;
    document.querySelector(".chat-messages").appendChild(div);

    });
  });
}

let socket = io();

socket.emit("joinRoom", { username, room }); // got the  username and room  pass them to server

//get room and user
socket.on("roomUsers", ({ room, users }) => {
  outputRoomName(room);
  outputUsers(users);
});

console.log("id is:" + socket.id);

socket.on("message", (msg) => {
  console.log(msg);
  var ref = database.ref("mydata");
  var datas={
    mymsg:msg
  }
  ref.push(datas);
  outputmsg(msg);

  chatmessage.scrollTop = chatmessage.scrollHeight;
});

chatform.addEventListener("submit", (e) => {
  e.preventDefault();
  const msg = e.target.elements.msg.value;
  console.log("my msg", msg);

  socket.emit("chatmessage", msg); // 1
  e.target.elements.msg.value = "";
  e.target.elements.msg.focus();
});

function outputmsg(msg) {
  // var ref = database.ref("mydata");
  // ref.push({
  //   mymsg: msg,
  // });

  const div = document.createElement("div");
  div.classList.add("message");
  div.innerHTML = `	<p class="meta">${msg.username}<span>${msg.time}</span></p>
  <p class="text">
     ${msg.text}
  </p>`;
  document.querySelector(".chat-messages").appendChild(div);
}

function outputRoomName(room) {
  roomName.innerText = room;
}
// function outputUsers(users)
// {
//   userList.innerText=
//     `${users.map((user)=>`<li>${user.username}</li>`).join('')}`;
// }

function outputUsers(users) {
  userList.innerHTML = "";
  users.forEach((user) => {
    const li = document.createElement("li");
    li.innerText = user.username;
    userList.appendChild(li);
  });
}
