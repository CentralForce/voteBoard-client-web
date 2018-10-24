const styleRoomlist = require("../css/vote.scss");
const styleCustom = require("../css/custom.scss");

module.exports = class {
  constructor() {
    this.listeners = [];
    this.name = "";
    this.preset = {};
    this.selection = [];
  }

  getDom() {
    let div = document.createElement("div");

    // Head
    {
      let head = document.createElement("div");
      head.classList.add("vote", "head");

      let titel = document.createElement("div");
      titel.classList.add("titel");
      titel.textContent = "Voteboard";
      head.appendChild(titel);

      let name = document.createElement("div");
      name.classList.add("roomname");
      name.textContent = "Roomname: " + this.name;
      head.appendChild(name);

      div.appendChild(head);
    }

    // Content
    {
      let content = document.createElement("div");
      content.classList.add("vote", "content");

      this.preset.rows.forEach((row, i) => {
        let divrow = document.createElement("div");
        divrow.classList.add("row");
        row.cards.forEach((card, j) => {
          let divcard = document.createElement("div");
          divcard.textContent = card.name;
          if (_.has(card, "cssclass")) {
            for (let cssclass of card.cssclass) {
              divcard.classList.add(cssclass);
            }
          }
          divcard.classList.add("card");
          divcard.onclick = () => {
            for (let card of divrow.getElementsByClassName("card")) {
              card.classList.remove("selected");
            }
            divcard.classList.add("selected");
            this.selection[i] = card.value;
          };
          divrow.appendChild(divcard);
        });
        content.appendChild(divrow);
      });
      div.appendChild(content);
    }

    // Foot
    {
      let foot = document.createElement("div");
      foot.classList.add("vote", "foot");
      div.appendChild(foot);

      let vote = document.createElement("div");
      vote.classList.add("button", "vote");
      vote.textContent = "Vote";
      vote.onclick = () => {
        for (let listener of this.listeners) {
          listener.submitVote(this.selection);
        }
      };
      foot.appendChild(vote);
    }

    return div;
  }

  setPreset(preset) {
    this.preset = preset;
    this.selection = new Array(this.preset.rows.length);
  }

  setName(roomname) {
    this.name = roomname;
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

