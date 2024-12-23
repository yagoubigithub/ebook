import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electron', {
  // Expose any necessary Electron API functions here
  // For example:
  ipcRenderer: {
    send: (channel, data) => ipcRenderer.send(channel, data),
    on: (channel, func) => ipcRenderer.on(channel, func),
    once: (channel, func) => ipcRenderer.once(channel, func),
    invoke: (channel, data) => ipcRenderer.invoke(channel, data),
  },
});
