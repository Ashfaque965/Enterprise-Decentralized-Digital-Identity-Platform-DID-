import { app, BrowserWindow } from "electron";
import * as path from "path";

function createSecureDesktopWindow() {
  const mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
    },
    titleBarStyle: "hidden",
  });

  // Load localized production application build assets
  mainWindow.loadURL(
    process.env.ELECTRON_START_URL ||
      `file://${path.join(__dirname, "../build/index.html")}`,
  );
}

app.whenReady().then(() => {
  createSecureDesktopWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createSecureDesktopWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
