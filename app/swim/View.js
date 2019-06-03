import { $at, View, Application } from '../view';
import stat from "./stat.js";
import { displayStat } from './utils';
import logger from '../logger';
const $ = $at('#swim');

const $start = $("#swim__start");
const $stop = $("#swim__stop");
const $pause = $("#swim__pause");
const $top = $("#swim__top");
const $main = $("#swim__main");
const $bot = $("#swim__bot");
const $topLabel = $("#swim__top__label");
const $mainLabel = $("#swim__main__label");
const $botLabel = $("#swim__bot__label");

const STATE_CYCLE = [
  'activeTime',
  'totalActiveTime',
  'distance',
  'totalDistance',
  'pace',
  'totalPace',
  'swimLengths',
  'totalSwimLengths',
]

const state = {
  top: 'totalDistance',
  main: STATE_CYCLE[0],
  bot: 'wait',
};

const cycle = () => {
  const i = STATE_CYCLE.indexOf(state.main);

  state.main = STATE_CYCLE[i+1 % STATE_CYCLE.length];
}

function start() {
  stat.startLap();
}
function stop() {
  if (stat.getStatus() !== "stopped") {
    stat.stop();
  }

  Application.switchTo("Home");
}
function pause() {
  logger.log('Pause');
  stat.pause();
}

$start.onclick = start;
$stop.onclick = stop;
$pause.onclick = pause;

export default class Swim extends View {
  el = $();

  onMount() {
    stat.onUpdate = () => this.render();
  }

  onUnmount() {
    stat.onUpdate = null;
  }

  onKeyBack(e) {
    e.preventDefault();
    cycle();
    this.render();
  }

  onKeyUp(e) {
    e.preventDefault();
    if (stat.getStatus() !== "started") {
      stop();
    }
  }

  onKeyDown(e) {
    e.preventDefault();
    if (stat.getStatus() !== "started") {
      start();
    } else {
      pause();
    }
  }

  onRender() {
    switch (stat.getStatus()) {
      case "started": {
        $start.style.display = "none";
        $stop.style.display = "none";
        $pause.style.display = "inline";
        break;
      }
      case "stopped":
      case "paused": {
        $start.style.display = "inline";
        $stop.style.display = "inline";
        $pause.style.display = "none";
        break;
      }
    }
    displayStat($top, $topLabel, stat.getStat(state.top));
    displayStat($main, $mainLabel, stat.getStat(state.main));
    displayStat($bot, $botLabel, stat.getStat(state.bot));
  }
}
