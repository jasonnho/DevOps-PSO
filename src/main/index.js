import {
  app,
  BrowserWindow,
  Menu,
  dialog,
  powerMonitor,
  shell,
  Notification,
} from 'electron';
import Store from 'electron-store';
import isDev from 'electron-is-dev';
import path from 'path';
import { version } from '../../package.json';

const store = new Store();

let notificationSettings = {
  resetNotification: store.get('reset') || true,
  reminderNotification: store.get('reminder') || 'hour', // Default reminder
};

let mainWindow = {
  show: () => {
    console.log('show');
  },
}; // Temporary object while app loads
let willQuit = false;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    minWidth: 320,
    height: 600,
    fullscreenable: true,
    backgroundColor: '#403F4D',
    icon: path.join(app.getAppPath(), 'assets/png/128x128.png'),
    webPreferences: {
      preload: path.join(app.getAppPath(), 'dist/preload/index.cjs'),
    },
  });

  mainWindow.loadURL(
    isDev
      ? 'http://localhost:5173'
      : new URL('../dist/renderer/index.html', 'file://' + __dirname).toString()
  );
}

function menuSetup() {
  const menuTemplate = [
    {
      label: 'todometer',
      submenu: [
        {
          label: 'Jason',
          click: () => {
            dialog.showMessageBox(mainWindow, {
              type: 'info',
              title: 'About',
              message: 'todometer is built by @cassidoo',
              detail:
                'You can find her on most things @cassidoo, or on her website cassidoo.co.',
              icon: path.join(app.getAppPath(), 'assets/png/64x64.png'),
            });
          },
        },
        {
          label: 'Contribute (v' + version + ')',
          click: () => {
            shell.openExternal('https://github.com/cassidoo/todometer');
          },
        },
        {
          type: 'separator',
        },
        {
          label: 'Dev tools',
          click: () => {
            mainWindow.webContents.openDevTools();
          },
        },
        {
          label: 'Quit',
          accelerator: 'CommandOrControl+Q',
          click: () => {
            app.quit();
          },
        },
      ],
    },
    {
      label: 'Edit',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
        { role: 'delete' },
        { role: 'selectall' },
      ],
    },
    {
      label: 'View',
      submenu: [
        {
          type: 'separator',
        },
        { role: 'reload' },
        { role: 'togglefullscreen' },
        { role: 'minimize' },
        { role: 'close' },
      ],
    },
    {
      label: 'Notifications',
      submenu: [
        {
          label: 'Enable reset notification',
          type: 'checkbox',
          checked: store.get('reset'),
          click: (e) => {
            notificationSettings.resetNotification = e.checked;
            mainWindow.webContents.send(
              'notificationSettingsChange',
              notificationSettings
            );
            store.set('reset', e.checked);
          },
        },
        {
          label: 'Reminder notifications',
          submenu: [
            {
              label: 'Every 1 minute',
              type: 'radio',
              checked: store.get('reminder') === 'oneminute',
              click: (e) => {
                if (e.checked) {
                  notificationSettings.reminderNotification = 'oneminute';
                  mainWindow.webContents.send(
                    'notificationSettingsChange',
                    notificationSettings
                  );
                  store.set('reminder', 'oneminute');
                }
              },
            },
            {
              label: 'Every 5 minutes',
              type: 'radio',
              checked: store.get('reminder') === 'fiveminutes',
              click: (e) => {
                if (e.checked) {
                  notificationSettings.reminderNotification = 'fiveminutes';
                  mainWindow.webContents.send(
                    'notificationSettingsChange',
                    notificationSettings
                  );
                  store.set('reminder', 'fiveminutes');
                }
              },
            },
            {
              label: 'Every 15 minutes',
              type: 'radio',
              checked: store.get('reminder') === 'quarterhour',
              click: (e) => {
                if (e.checked) {
                  notificationSettings.reminderNotification = 'quarterhour';
                  mainWindow.webContents.send(
                    'notificationSettingsChange',
                    notificationSettings
                  );
                  store.set('reminder', 'quarterhour');
                }
              },
            },
            {
              label: 'Every 30 minutes',
              type: 'radio',
              checked: store.get('reminder') === 'halfhour',
              click: (e) => {
                if (e.checked) {
                  notificationSettings.reminderNotification = 'halfhour';
                  mainWindow.webContents.send(
                    'notificationSettingsChange',
                    notificationSettings
                  );
                  store.set('reminder', 'halfhour');
                }
              },
            },
            {
              label: 'Every hour',
              type: 'radio',
              checked: store.get('reminder') === 'hour',
              click: (e) => {
                if (e.checked) {
                  notificationSettings.reminderNotification = 'hour';
                  mainWindow.webContents.send(
                    'notificationSettingsChange',
                    notificationSettings
                  );
                  store.set('reminder', 'hour');
                }
              },
            },
            {
              label: 'Every 12 hours',
              type: 'radio',
              checked: store.get('reminder') === '12hours',
              click: (e) => {
                if (e.checked) {
                  notificationSettings.reminderNotification = '12hours';
                  mainWindow.webContents.send(
                    'notificationSettingsChange',
                    notificationSettings
                  );
                  store.set('reminder', '12hours');
                }
              },
            },
          ],
        },
        {
          label: 'Show example notification',
          click: (e) => {
            let exNotification = new Notification({
              title: 'todometer reminder!',
              body: "Here's an example todometer notification!",
              silent: false,
            });
            exNotification.show();
          },
        },
      ],
    },
  ];
  const menu = Menu.buildFromTemplate(menuTemplate);
  Menu.setApplicationMenu(menu);
}

function getIntervalMilliseconds(interval) {
  switch (interval) {
    case 'oneminute':
      return 1 * 60 * 1000;
    case 'fiveminutes':
      return 5 * 60 * 1000;
    case 'quarterhour':
      return 15 * 60 * 1000;
    case 'halfhour':
      return 30 * 60 * 1000;
    case 'hour':
      return 60 * 60 * 1000;
    case '12hours':
      return 12 * 60 * 60 * 1000;
    default:
      return 0;
  }
}

app.on('ready', () => {
  createWindow();
  menuSetup();

  mainWindow.webContents.on('did-finish-load', () => {
    mainWindow.webContents.send(
      'notificationSettingsChange',
      notificationSettings
    );
  });

  powerMonitor.on('resume', () => {
    mainWindow.reload();
  });

  setInterval(() => {
    if (notificationSettings.reminderNotification !== 'never') {
      new Notification({
        title: 'Reminder!',
        body: `This is your reminder.`,
        silent: false,
      }).show();
    }
  }, getIntervalMilliseconds(notificationSettings.reminderNotification));

  mainWindow.on('close', (e) => {
    if (willQuit || process.platform === 'win32') {
      mainWindow = null;
      app.quit();
    } else {
      e.preventDefault();
      mainWindow.hide();
    }
  });
});

app.on('activate', () => mainWindow.show());
app.on('before-quit', () => (willQuit = true));
