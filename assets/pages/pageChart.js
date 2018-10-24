const style = require("../css/charts.scss");
const chart = require("chart.js");

module.exports = class {
  constructor() {
    this.listeners = [];
    this.charts = [];
    this.chartObjects = [];
    this.average = [];
    this.averageObjects = [];
  }

  getDom() {
    let div = document.createElement("div");

    // Head
    {
      let head = document.createElement("div");
      head.classList.add("chart", "head");
      div.appendChild(head);

      let titel = document.createElement("div");
      titel.classList.add("titel");
      titel.textContent = "Result";
      head.appendChild(titel);
    }

    // Content
    {
      let content = document.createElement("div");
      content.classList.add("chart", "content");
      div.appendChild(content);

      this.charts.forEach((chartData, i) => {
        let row = document.createElement("div");
        row.classList.add("row");

        let canvas = document.createElement("canvas");
        canvas.classList.add("chart");
        this.chartObjects[this.chartObjects.length] = new Chart(
          canvas,
          chartData
        );
        row.appendChild(canvas);

        if (_.isNumber(this.average[i])) {
          let average = document.createElement("div");
          average.classList.add("average");
          average.textContent = "Average: " + this.average[i];
          content.appendChild;
          this.averageObjects[this.averageObjects.length] = average;
          row.appendChild(average);
        }

        content.appendChild(row);
      });
    }

    // Foot
    {
      let foot = document.createElement("div");
      foot.classList.add("chart", "foot");
      div.appendChild(foot);

      let revote = document.createElement("div");
      revote.classList.add("button", "vote");
      revote.textContent = "Revote";
      revote.onclick = () => {
        for (let listener of this.listeners) {
          listener.revote();
        }
      };
      foot.appendChild(revote);

      let reset = document.createElement("div");
      reset.classList.add("button", "reset");
      reset.textContent = "Reset";
      reset.onclick = () => {
        for (let listener of this.listeners) {
          listener.reset();
        }
      };
      foot.appendChild(reset);
    }

    return div;
  }

  setCharts(charts) {
    this.charts = charts;
  }

  setAverage(average) {
    this.average = average;
  }

  updateCharts() {
    if (
      _.isEqual(this.chartObjects.length, this.charts.length) &&
      _.isEqual(this.averageObjects.length, this.average.length)
    ) {
      this.chartObjects.forEach((chart, i) => {
        chart.config.data.datasets[0].data = this.charts[
          i
        ].data.datasets[0].data;
        chart.update();
      });

      this.averageObjects.forEach((average, i) => {
        average.textContent = "Average: " + this.average[i];
      });
      return true;
    } else {
      return false;
    }
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

