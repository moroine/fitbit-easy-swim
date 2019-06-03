import exercice from "exercise";
import clock from "clock";
import { preferences } from "fitbit-preferences";
import logger from '../logger';

let wait = 0;
let lastTick = null;
let currentLap = exercice.currentLapStats;

clock.ontick = onTick;

class Stat {
  constructor() {
    this.onUpdate = null;
  }
  
  // "started" | "paused" | "stopped"
  getStatus () {
    return exercice.state;
  }
  
  startLap() {
    if (this.getStatus() === "stopped") {
      logger.log('Staarting with poolLength: ' + preferences.poolLength);
      exercice.start("swim", { autopause: false, poolLength: preferences.poolLength });
    } else {
      exercice.resume();
    }
    currentLap = exercice.currentLapStats;
    clock.granularity = 'seconds';
    onUpdate();
  }
  
  pause() {
    exercice.pause();
    currentLap = exercice.splitLap();
    lastTick = Date.now();
    wait = 0;
    clock.granularity = 'seconds';
    onUpdate();
  }

  stop() {
    exercice.stop();
    clock.granularity = "off";
    onUpdate() 
  }

  getStat(id) {
    switch (id) {
      case "wait": 
        return { 
          label: 'resting',
           value: wait,
           type: 'time',
        };
      case "activeTime": 
        return { 
          label: 'lap time', 
          value: currentLap == null ? 0 : currentLap.activeTime,
          type: 'time',
        };
      case "totalActiveTime": 
        return { 
          label: 'total time', 
          value: exercice.stats == null ? 0 : exercice.stats.activeTime,
          type: 'time',
        };
      case "distance": 
        return { 
          label: 'lap distance', 
          value: currentLap == null ? 0 : currentLap.distance,
          type: 'distance',
        };
      case "totalDistance": 
        return { 
          label: 'total distance', 
          value: exercice.stats == null ? 0 : exercice.stats.distance,
          type: 'distance',
        };
      case "pace": 
        return { 
          label: 'pace', 
          value:  currentLap == null ? 0 : currentLap.pace.average,
          type: 'pace',
        };
      case "totalPace": 
        return { 
          label: 'average pace', 
          value: exercice.stats == null ? 0 : exercice.stats.pace.average,
          type: 'pace',
        };
      case "swimLengths":
        return { 
          label: 'lap lengths', 
          value: currentLap == null || currentLap.swimLengths == null ? 0 : currentLap.swimLengths,
          type: 'number',
        }; 
      case "totalSwimLengths": 
        return { 
          label: 'total lengths', 
          value: exercice.stats == null || exercice.stats.swimLengths == null ? 0 : exercice.stats.swimLengths,
          type: 'number',
        };
    }
  }
}

const stat = new Stat();

function onUpdate() {
  if (stat.onUpdate != null) {
    stat.onUpdate();
  }
}

exercice.onswimlength = () => {
  logger.log('swim length');
  onUpdate();
}

function onTick() {
  if (stat.getStatus() === 'paused') {
    const now = Date.now();
    const elapsed = now - lastTick;
    wait += elapsed;
    lastTick = now;
  }
  onUpdate();
}

export default stat;
