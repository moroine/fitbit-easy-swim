import document from "document"
import { $at, View, Application } from '../view';
const $ = $at( '#home' );

const settingsBtn = $("#home__settings");
const startBtn = $("#home__start");

function openSettings() {
  console.log("Want to switch to Settings");
  Application.switchTo("Settings");
}
function openSwim() {
  console.log("Want to switch to Swim");
  Application.switchTo("Swim");
}
settingsBtn.onclick = openSettings;
startBtn.onclick = openSwim;

export default class Home extends View {
  el = $();
  
  onKeyUp(e) {
    e.preventDefault();
    openSwim();
  }
}
