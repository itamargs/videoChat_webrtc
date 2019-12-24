// Main logic for the angular video chat app

//imports declerations for Easyrtc
/// <reference path="../../../webrtc-videoChat/node_modules/easyrtc/typescript_support/d.ts.files/client/easyrtc.d.ts" />>
import {Component, ChangeDetectorRef} from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})

export class AppComponent {

  constructor(private cdr: ChangeDetectorRef) {
  }

  myId: string = '';
  connectedClientsList: Array<string> = [];

  // clear connected peers in the starts of the app or refresh
  clearConnectList(): void {
    this.connectedClientsList = [];
    this.cdr.detectChanges();
  }

  // calling the selected peer after pressing on the call button
  performCall(clientEasyrtcId: string): void {
    let successCB = function(a: string, b: string): void {
    };
    let failureCB = function(a: string, b: string): void {
    };
    easyrtc.call(clientEasyrtcId, successCB, failureCB, undefined, undefined);
  }

  buildCaller(easyrtcid: string): (() => void) {
    return (): void => {
      this.performCall(easyrtcid);
    };
  }

  convertListToButtons(roomName: string, data: Easyrtc_PerRoomData, isPrimary: boolean): void {
    this.clearConnectList();
    for (let easyrtcid in data) {
      this.connectedClientsList.push(easyrtc.idToName(easyrtcid));
    }
    this.cdr.detectChanges();
  }

  // updating current user ID (will give new id on refresh)
  updateMyEasyRTCId(myEasyRTCId: string): void {
    this.myId = myEasyRTCId;
    this.cdr.detectChanges();
  }

  loginSuccess(easyrtcid: string): void {
    this.updateMyEasyRTCId(easyrtc.cleanId(easyrtcid));
  }

  loginFailure(errorCode: string, message: string): void {
    this.updateMyEasyRTCId('Login failed. Reason: ' + message);
  }

  // actual logic for connecting between peers
  connect(): void {
    easyrtc.setVideoDims(320, 240, undefined);
    let convertListToButtonShim = (roomName: string, data: Easyrtc_PerRoomData, isPrimary: boolean): void => {
      this.convertListToButtons(roomName, data, isPrimary);
    };

    // connecting to the node.js server via secure connection (here on heroku)
    easyrtc.setSocketUrl('https://vast-bastion-49340.herokuapp.com', {secure: true});
    // easyrtc.setSocketUrl('https://localhost:5000', {rejectUnauthorized: false});
    easyrtc.setRoomOccupantListener(convertListToButtonShim);
    easyrtc.easyApp('easyrtc.audioVideoSimple', 'videoSelf', ['videoCaller'], this.loginSuccess.bind(this), this.loginFailure.bind(this));
  }

  ngAfterViewInit() {
    this.connect();
  }

}
