import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

import { register, listen } from "push-receiver"
// import yargs from "yargs";
import { Low } from 'lowdb'
import { JSONFile } from 'lowdb/node'

// const senderId = yargs.argv.senderId;

// if (!senderId) {
//   console.error('Missing senderId');
//   process.exit(1);
// }

const senderId = process.argv[2];

// File path
const __dirname = dirname(fileURLToPath(import.meta.url));
const file = join(__dirname, 'db.json')

// Configure lowdb to write to JSONFile
const adapter = new JSONFile(file)
const db = new Low(adapter)

// Read data from JSON file, this will set db.data content
await db.read()

// If db.json doesn't exist, db.data will be null
db.data ||= {
  credentials: {},
  messageIds: []
}             // For Node >= 15.x

const main = async () => {
  let credentials = db.data.credentials;
  console.log(credentials);

  if (Object.keys(credentials).length < 1) {
    // First time
    // Register to GCM and FCM
    credentials = await register(senderId); // You should call register only once and then store the credentials somewhere
    db.data.credentials = credentials;
    console.log(credentials);
  }

  const fcmToken = credentials.fcm.token; // Token to use to send notifications
  console.log('Use this following token to send a notification', fcmToken);
  // persistentIds is the list of notification ids received to avoid receiving all already received notifications on start.
  const persistentIds = db.data.messageIds; // get all previous persistentIds from somewhere (file, db, etc...)
  await listen({ ...credentials, persistentIds }, onNotification);
}

// Called on new notification
function onNotification({ notification }) {
  // Do someting with the notification
  console.log('Notification received');
  console.log(notification);
  !db.data.messageIds.includes(notification.fcmMessageId) && db.data.messageIds.push(notification.fcmMessageId)
}

main();

process.on("SIGINT", () => {
  db.write().finally(() => process.exit(0))
})