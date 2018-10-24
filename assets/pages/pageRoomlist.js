const styleRoomlist = require("../css/roomlist.scss");

module.exports = class {
  constructor() {
    this.listeners = [];
    this.rooms = [];
  }

  getDom() {
    let div = document.createElement("div");

    // Head
    {
      let head = document.createElement("div");
      head.classList.add("roomlist", "head");

      let titel = document.createElement("div");
      titel.classList.add("titel");
      titel.textContent = "Roomlist";
      head.appendChild(titel);

      let add = document.createElement("div");
      add.classList.add("button", "add");
      add.textContent = "Create Room";
      add.onclick = () => {
        for (let listener of this.listeners) {
          listener.createRoom();
        }
      };
      head.appendChild(add);

      div.appendChild(head);
    }

    // Content
    {
      let content = document.createElement("div");
      content.classList.add("roomlist", "content");

      for (let room of this.rooms) {
        let row = document.createElement("div");
        row.classList.add("row");

        let titel = document.createElement("div");
        titel.classList.add("titel");
        titel.textContent = room.name;
        row.appendChild(titel);

        let join = document.createElement("div");
        join.classList.add("button", "join");
        join.textContent = "Join";
        join.onclick = () => {
          for (let listener of this.listeners) {
            listener.join({ roomname: room.name });
          }
        };
        row.appendChild(join);

        content.appendChild(row);
      }

      div.appendChild(content);
    }

    return div;
  }

  setRooms(rooms) {
    this.rooms = rooms;
  }

  // #region - Listeners
  addEventListener(listener) {
    this.listeners[this.listeners.length] = listener;
  }

  removeEventListener(listener) {
    _.pull(this.listeners, listener);
  }

  removeAllEventListeners() {
    this.listeners = [];
  }
  // #endregion
};

