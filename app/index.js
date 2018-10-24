import io from "socket.io-client";

const socket = io();
const app = document.getElementById("content");

// #region - Styles
{
  const general = require("../assets/css/general.scss");
  const buttons = require("../assets/css/buttons.scss");
}
// #endregion

// #region - Pages
const PageChart = require("../assets/pages/pageChart");
const pageChart = new PageChart();
pageChart.addEventListener({
  revote: () => {
    socket.emit("client_requests_votedata");
  },
  reset: () => {
    socket.emit("client_sends_reset");
  }
});

const PageVote = require("../assets/pages/pageVote");
const pageVote = new PageVote();
pageVote.addEventListener({
  submitVote: data => {
    socket.emit("client_sends_vote", { votes: data });
  }
});

const PageCreateRoom = require("../assets/pages/pageCreateRoom");
const pageCreateRoom = new PageCreateRoom();
pageCreateRoom.addEventListener({
  submitRoom: data => {
    socket.emit("client_requests_create", {
      roomname: data.name,
      preset: data.preset,
      anonym: true
    });
  }
});

const PageRoomlist = require("../assets/pages/pageRoomlist");
const pageRoomlist = new PageRoomlist();
pageRoomlist.addEventListener({
  join: data => {
    socket.emit("client_requests_join", { roomname: data.roomname });
  },
  createRoom: () => {
    socket.emit("client_requests_presets");
    clearApp();
    app.appendChild(pageCreateRoom.getDom());
  }
});
// #endregion

// #region - Socket.io
socket.on("server_confirms_connection", data => {
  clearApp();
  app.appendChild(pageRoomlist.getDom());
  socket.emit("client_requests_roomlist");
});

socket.on("server_confirms_vote", () => {
  clearApp();
  app.appendChild(pageChart.getDom());
});

socket.on("server_confirms_created", data => {
  socket.emit("client_requests_join", { roomname: data.roomname });
});

socket.on("server_sends_roomlist", data => {
  pageRoomlist.setRooms(data);
  if (app.getElementsByClassName("roomlist").length > 0) {
    clearApp();
    app.appendChild(pageRoomlist.getDom());
  }
});

socket.on("server_sends_chart", data => {
  pageChart.setCharts(data.charts);
  pageChart.setAverage(data.average);
  if (
    document.getElementsByClassName("chart").length > 0 &&
    !pageChart.updateCharts()
  ) {
    clearApp();
    app.appendChild(pageChart.getDom());
  }
});

socket.on("server_sends_presets", data => {
  pageCreateRoom.setPresets(data);
  if (app.getElementsByClassName("createRoom").length > 0) {
    clearApp();
    app.appendChild(pageCreateRoom.getDom());
  }
});

socket.on("server_sends_votedata", data => {
  clearApp();
  pageVote.setPreset(data.preset);
  pageVote.setName(data.roomname);
  app.appendChild(pageVote.getDom());
});

socket.on("server_requests_name", callback => {
  dialog_name(callback);
});
// #endregion

// #region - Functions
function dialog_name(callback) {
  let div = document.createElement("div");
  let text = document.createElement("input");
  div.appendChild(text);

  let submit = document.createElement("button");
  submit.textContent = "Submit";
  submit.onclick = () => {
    callback(name.value);
  };
  div.appendChild(submit);

  clear_app();
  app.appendChild(div);
}

function clearApp() {
  while (app.firstChild) {
    app.removeChild(app.firstChild);
  }
}
// #endregion

