# FCM Push Notification Receiver

## Command
```
node index.js <replace-this-with-12-digit-firebase-sender-id>
```


## How to Start?
1. `yarn` to install dependencies
2. `yarn start <firebase-sender-id>` to start listening from FCM
3. if you run this the first time, the receiver will generate db.json for storing your device information.
4. please take a note on the device ID given by the console. register that device ID in your push notification processor so that your server can reach to this device ID.
4. trigger some FCM push notification from your server, look for the result
