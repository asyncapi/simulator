const { contextBridge, ipcRenderer } = require('electron');
// cannot be used with context isolation false
// contextBridge.exposeInMainWorld('electron', {
//   doThing: () => console.log('test'),
//   myPromises: [Promise.resolve(), Promise.reject(new Error('whoops'))],
//   anAsyncFunction: async () => 123,
//   data: {
//     myFlags: ['a', 'b', 'c'],
//     bootTime: 1234,
//   },
//   nestedAPI: {
//     evenDeeper: {
//       youCanDoThisAsMuchAsYouWant: {
//         fn: () => ({
//           returnData: 123,
//         }),
//       },
//     },
//   },
// });

// contextBridge.exposeInMainWorld('electron', {
//   ipcRenderer: {
//     myPing() {
//       ipcRenderer.send('ipc-example', 'ping');
//     },
//     on(channel, func) {
//       const validChannels = ['ipc-example'];
//       if (validChannels.includes(channel)) {
//         // Deliberately strip event as it includes `sender`
//         ipcRenderer.on(channel, (event, ...args) => func(...args));
//       }
//     },
//     once(channel, func) {
//       const validChannels = ['ipc-example'];
//       if (validChannels.includes(channel)) {
//         // Deliberately strip event as it includes `sender`
//         ipcRenderer.once(channel, (event, ...args) => func(...args));
//       }
//     },
//   },
// });
