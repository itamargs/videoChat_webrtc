// Main logic for the angular video chat app

//imports declerations for Easyrtc
/// <reference path="../../../webrtc-videoChat/node_modules/easyrtc/typescript_support/d.ts.files/client/easyrtc.d.ts" />>
import {Component, ChangeDetectorRef} from '@angular/core';

@Component({
  selector: 'app-root', // the app-root tag in index.html will rout to here
  templateUrl: 'app.component.html' //this func return the url to be loaded
})

export class AppComponent {

  constructor(private cdr: ChangeDetectorRef) { // wii be set to MANUAL change detection (by calling cdr.detectChanges())
  }

  myId: string = '';
  connectedClientsList: Array<string> = [];

  // clear connected peers in the starts of the app or refresh
  clearConnectList(): void {
    this.connectedClientsList = [];
    this.cdr.detectChanges();
  }

  // calling the selected peer after pressing on the call button
  // perform call needs 4 args:  (user ID, sucess callback, error callback, accepted/not accepted callback)
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

  //  builds a button for each peer known by the server
  //  Each button has a callback that generates a call to a particular peer
  convertListToButtons(roomName: string, data: Easyrtc_PerRoomData, isPrimary: boolean): void {
    console.log("new peer detected -- clean list and init buttons");
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
    console.log("init callback for new peers");
    easyrtc.setRoomOccupantListener(convertListToButtonShim); // init callback for listening to new peers connected

    // app name: name of the application.
    // monitorVideoId: id of the video object used for monitoring the local stream.
    // videoIds: array of video objectId
    // onReady: callback on sucess
    // onFailure on failure
    easyrtc.easyApp('easyrtc.audioVideoSimple', 'videoSelf', ['videoCaller'], this.loginSuccess.bind(this), this.loginFailure.bind(this));
  }


  // call back initiated after angular has completed init fo a components view (initiated only once)
  ngAfterViewInit() {
    console.log("connects first time");
    this.connect();
  }

}
