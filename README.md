# WebrtcVideoChat

**WebRtc Video chat application.**

Using [EasyRtc](https://github.com/priologic/easyrtc) which is an  API for webRtc by priologic.

***Main Features:***
-
*Two ways video chat*.
*Users can connect/disconnect* from a call by pressing a button
*Online application* -  Users no need to install anything, just use link for the firebase app.


***Usage:***
---
**Regular Use:**


    https://videochatitamargs.firebaseapp.com

Just enter the online [firebase app](https://videochatitamargs.firebaseapp.com/)  and wait for your doctor to connect.
Users can also use the app on localHost (More advanced, see below)

 **For developers:**
 ---
**Run app on localhost:**
`ng serve` 

**After ng serve app will be available at:**
  

    http://localhost:4200

 
 **Online app at:** 

     https://videochatitamargs.firebaseapp.com

**Online server at heroku:**

    https://vast-bastion-49340.herokuapp.com/
---

**Note:** the Server is 'just' handling connections.
the actual data transfer is peer to peer
Take a look at [my server repo](https://github.com/itamargs/server_easyRtc)
