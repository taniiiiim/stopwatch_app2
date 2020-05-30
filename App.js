const SECOND = 100;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;
const MAX_TIME = 24 * HOUR + 59 * MINUTE + 59 * SECOND + 99;
const FUNCTION_NAMES = [
  "Stopwatch",
  "Timer"
];

let timerId

let screenTemplate = `
  <div class="screen">
    <div class="function">
      <h1><span id="fnc">{{functionName}}</span></h1>
    </div>
    <div class="time">
      <h2>{{hour}}:{{min}}:{{sec}}.<span id="tenms">{{tenms}}</span></h2>
    </div>
  </div>
`;

let leftButtonTemplate = `
  <div class="left">
    <input class="btn" type="button" :value="buttonName" @click="handleStartStop" :disabled="timeOvered"/>
  </div>
`;

let rightButtonTemplate = `
  <div class="right">
    <input class="btn" type="button" value="Reset" @click="handleReset"/>
  </div>
`;

let bottomButtonTemplate = `
  <div class="bottom">
    <input class="btn" type="button" value="Toggle" @click='handleToggle' :disabled='isRunning && !timeOvered'/>
  </div>
`;

let App = new Vue({
  el: '#app',
  components: {
    'screen': {
      props: {
        time: {
          type: Number,
          default: 0,
          required: true
        },
        isRunning: {
          type: Boolean,
          default: false,
          required: true
        },
        functionName: {
          type: String,
          default: "Stopwatch",
          required: true
        }
      },
      template: screenTemplate,
      computed: {
        hour: function() {
          return ("0" + Math.floor(this.time / HOUR)).slice(-2);
        },
        min: function() {
          return ("0" + Math.floor((this.time % HOUR) / MINUTE)).slice(-2);
        },
        sec: function() {
          return ("0" + Math.floor(((this.time % HOUR) % MINUTE) / SECOND)).slice(-2);
        },
        tenms: function() {
          return ("0" + Math.floor(((this.time % HOUR) % MINUTE) % SECOND)).slice(-2);
        }
      }
    },
    'left-button': {
      props: {
        isRunning: {
          type: Boolean,
          default: false,
          required: true
        },
        functionName: {
          type: String,
          default: "Stopwatch",
          required: true
        },
        timeOvered: {
          type: Boolean,
          default: false,
          required: true
        }
      },
      template: leftButtonTemplate,
      data: function() {
        return {
          buttonName: "Start"
        }
      },
      methods: {
        handleStartStop: function() {
          if (this.buttonName === "Start") {
            this.buttonName = "Stop";
          } else {
            this.buttonName = "Start"
          }
          this.$emit('process');
        }
      }
    },
    'right-button': {
      props: {
        isRunning: {
          type: Boolean,
          default: false,
          required: true
        },
        functionName: {
          type: String,
          default: "Stopwatch",
          required: true
        }
      },
      template: rightButtonTemplate,
      methods: {
        handleReset: function() {
          this.$emit('reset');
        }
      }
    },
    'bottom-button': {
      props: {
        isRunning: {
          type: Boolean,
          default: false,
          required: true
        },
        timeOvered: {
          type: Boolean,
          default: false,
          required: true
        }
      },
      template: bottomButtonTemplate,
      methods: {
        handleToggle: function() {
          this.$emit('toggle');
        }
      }
    }
  },
  data: function() {
    return {
      initialTime: 0,
      time: 0,
      isRunning: false,
      functionName: "Stopwatch"
    }
  },
  computed: {
    timeOvered: function() {
      if (this.functionName === "Stopwatch") {
        return this.time === MAX_TIME;
      } else if (this.functionName === "Timer") {
        return this.time === 0;
      }
    },
    initialTimeHour: function() {
      return Math.floor(this.initialTime / HOUR);
    },
    initialTimeMin: function() {
      return Math.floor((this.initialTime % HOUR) / MINUTE);
    },
    initialTimeSec: function() {
      return Math.floor(((this.initialTime % HOUR) % MINUTE) / SECOND);
    }
  },
  methods: {
    process: function() {
      this.isRunning = !this.isRunning;
      if (this.isRunning) {
        timerId = setInterval(() => {
          if (this.functionName === "Stopwatch") {
            this.time += 1;
          } else if (this.functionName === "Timer") {
            this.time -= 1;
          }
          if (this.timeOvered) {
            this.isRunning = !this.isRunning;
            clearInterval(timerId);
            alert("It's time, you guys!!");
          }
        }, 10);
      } else {
        clearInterval(timerId);
      }
    },
    reset: function() {
      if (this.isRunning) {
        this.isRunning = !this.isRunning;
        clearInterval(timerId);
      } else {
        this.time = this.initialTime;
      }
    },
    toggle: function() {
      toggle_index = (FUNCTION_NAMES.findIndex(elem => elem === this.functionName) + 1) % FUNCTION_NAMES.length;
      this.functionName = FUNCTION_NAMES[toggle_index];
      switch (this.functionName) {
        case "Stopwatch":
          this.initialTime = 0;
          break;
        case "Timer":
          this.initialTime = 3 * MINUTE;
          break;
        default:
          this.initialTime = 0;
          break;
      }
      this.time = this.initialTime;
    },
    initialTimeHourChange: function(e) {
      this.initialTime = parseInt(e.target.value) * HOUR + Math.floor(this.initialTime % HOUR);
      this.time = this.initialTime;
    },
    initialTimeMinChange: function(e) {
      this.initialTime = Math.floor(this.initialTime / HOUR) * HOUR + parseInt(e.target.value) * MINUTE + Math.floor(this.initialTime % MINUTE);
      this.time = this.initialTime;
    },
    initialTimeSecChange: function(e) {
      this.initialTime =  Math.floor(this.initialTime / MINUTE) * MINUTE + parseInt(e.target.value) * SECOND;
      this.time = this.initialTime;
    }
  }
});
