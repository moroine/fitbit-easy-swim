import { preferences } from "fitbit-preferences";
import logger from '../logger';
import { zeroPad } from '../swim/utils';
import { $at, $wrap, View, Application } from '../view';
const $ = $at( '#settings' );

const tumbler = $("#settings__pool-size");

export default class Settings extends View {
  el = $();

  onMount() {
    tumbler.value = preferences.poolLength - 10;
  }

  save() {
    preferences.poolLength = tumbler.value + 10;
    logger.log('Save settings poolLength: ' + preferences.poolLength);
  }

  onKeyBack(e) {
    e.preventDefault();
    this.save();
    Application.switchTo("Home");
  }
}
