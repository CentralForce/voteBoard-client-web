const styleRoomlist = require("../css/createRoom.scss");

module.exports = class {
  constructor() {
    this.listeners = [];
    this.presets = null;
  }

  getDom() {
    let div = document.createElement("div");

    // Head
    {
      let head = document.createElement("div");
      head.classList.add("createRoom", "head");
      div.appendChild(head);

      let titel = document.createElement("div");
      titel.classList.add("titel");
      titel.textContent = "Create Room";
      head.appendChild(titel);
    }

    // Content
    {
      let content = document.createElement("div");
      content.classList.add("createRoom", "content");
      div.appendChild(content);

      let name = document.createElement("input");
      name.setAttribute("placeholder", "Name");
      name.classList.add("textinput");
      content.appendChild(name);

      if (!_.isNull(this.presets)) {
        var preset = document.createElement("input");
        preset.setAttribute("list", "presetlist");
        preset.setAttribute("placeholder", "Preset");
        preset.classList.add("textlist");
        content.appendChild(preset);

        let presetlist = document.createElement("datalist");
        presetlist.setAttribute("id", "presetlist");
        for (let presetentity of this.presets.presets) {
          let option = document.createElement("option");
          option.setAttribute("value", presetentity.name);
          presetlist.appendChild(option);
        }
        content.appendChild(presetlist);
      }

      /*
      let anonym = document.createElement("input");
      anonym.setAttribute("placeholder", "Anonym");
      anonym.classList.add("textinput");
      content.appendChild(anonym);
      */

      let submit = document.createElement("div");
      submit.classList.add("button", "submit");
      submit.textContent = "Submit";
      submit.onclick = () => {
        let presetnumber;
        for (i = 0; i < this.presets.presets.length; i++) {
          if (_.isEqual(this.presets.presets[i].name, preset.value)) {
            presetnumber = i;
            break;
          }
        }
        if (_.isNumber(presetnumber)) {
          for (let listener of this.listeners) {
            listener.submitRoom({
              name: name.value,
              preset: presetnumber,
              anonym: true
            });
          }
        }
      };
      content.appendChild(submit);
    }

    return div;
  }

  setPresets(data) {
    this.presets = data;
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

