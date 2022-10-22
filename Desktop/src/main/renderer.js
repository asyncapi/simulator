const { remote, ipcRenderer } = require('electron');

function getCurrentWindow() {
  return remote.getCurrentWindow();
}

function openMenu(x, y) {
  ipcRenderer.send(`display-app-menu`, { x, y });
}

function minimizeWindow(browserWindow = getCurrentWindow()) {
  if (browserWindow.minimizable) {
    // browserWindow.isMinimizable() for old electron versions
    browserWindow.minimize();
  }
}

function maximizeWindow(browserWindow = getCurrentWindow()) {
  if (browserWindow.maximizable) {
    // browserWindow.isMaximizable() for old electron versions
    browserWindow.maximize();
  }
}

function unmaximizeWindow(browserWindow = getCurrentWindow()) {
  browserWindow.unmaximize();
}

function maxUnmaxWindow(browserWindow = getCurrentWindow()) {
  if (browserWindow.isMaximized()) {
    browserWindow.unmaximize();
  } else {
    browserWindow.maximize();
  }
}

function closeWindow(browserWindow = getCurrentWindow()) {
  browserWindow.close();
}

function isWindowMaximized(browserWindow = getCurrentWindow()) {
  return browserWindow.isMaximized();
}

window.addEventListener('DOMContentLoaded', () => {
  const menuButton = document.getElementById('menu-btn');
  const minimizeButton = document.getElementById('minimize-btn');
  const maxUnmaxButton = document.getElementById('max-unmax-btn');
  const closeButton = document.getElementById('close-btn');

  menuButton.addEventListener('click', (e) => {
    openMenu(e.x, e.y);
  });

  minimizeButton.addEventListener('click', (e) => {
    minimizeWindow();
  });

  maxUnmaxButton.addEventListener('click', (e) => {
    const icon = maxUnmaxButton.querySelector('i.far');

    maxUnmaxWindow();
    if (isWindowMaximized()) {
      icon.classList.remove('fa-square');
      icon.classList.add('fa-clone');
    } else {
      icon.classList.add('fa-square');
      icon.classList.remove('fa-clone');
    }
  });
  closeButton.addEventListener('click', (e) => {
    closeWindow();
  });
});
