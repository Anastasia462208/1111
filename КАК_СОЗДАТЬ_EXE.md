# Как создать EXE файл из игры

## Быстрые варианты (без программирования):

### 1. BAT файл (уже создан)
Просто запустите `Запустить_игру.bat` - игра откроется в браузере

### 2. HTA файл (уже создан)
Запустите `Игра.hta` - игра откроется как отдельное приложение Windows

### 3. Создать ярлык с иконкой
1. Правой кнопкой на `index.html` → "Создать ярлык"
2. Правой кнопкой на ярлык → "Свойства"
3. Можно сменить иконку
4. Переименовать в "Приключения Грамотея"

---

## Для создания настоящего EXE (требует установки программ):

### Способ 1: Electron Builder

1. Установите Node.js: https://nodejs.org/

2. Создайте файл `package.json`:
```json
{
  "name": "russian-game",
  "version": "1.0.0",
  "main": "main.js",
  "scripts": {
    "start": "electron .",
    "build": "electron-builder"
  },
  "devDependencies": {
    "electron": "^27.0.0",
    "electron-builder": "^24.0.0"
  },
  "build": {
    "appId": "com.game.russian",
    "productName": "Приключения Грамотея",
    "win": {
      "target": "nsis",
      "icon": "icon.ico"
    }
  }
}
```

3. Создайте файл `main.js`:
```javascript
const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
  const win = new BrowserWindow({
    width: 1024,
    height: 768,
    title: 'Приключения Грамотея',
    icon: path.join(__dirname, 'icon.ico')
  });
  win.loadFile('index.html');
}

app.whenReady().then(createWindow);
```

4. Выполните команды:
```bash
npm install
npm run build
```

EXE файл появится в папке `dist/`

---

### Способ 2: Использовать онлайн-конвертеры

1. **HTML Executable**: https://www.htmlexe.com/ (бесплатная пробная версия)
2. **WebToEXE**: http://www.joejoesoft.com/vcms/108/ (бесплатная)

---

### Способ 3: Portable Chrome

Можно упаковать игру вместе с портативной версией Chrome:
1. Скачать Chromium Portable
2. Создать батник, который запускает Chrome с игрой в kiosk mode
3. Упаковать все в один архив

---

## Самый простой способ для вас:

**Используйте HTA файл (`Игра.hta`) - он уже создан и работает как обычное приложение Windows!**

Или просто дайте пользователям файл `index.html` - современные браузеры открывают его без проблем.
