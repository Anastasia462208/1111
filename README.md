# AmoCRM Chat Export

Инструмент для экспорта переписки из AmoCRM в SQLite базу данных.

## Описание

Этот скрипт позволяет:
- Получить все разговоры (чаты) из AmoCRM
- Экспортировать все сообщения из каждого разговора
- Сохранить данные в SQLite базу данных для дальнейшего анализа

## Требования

- Python 3.7+
- Активная интеграция в AmoCRM

## Установка

1. Клонируйте репозиторий:
```bash
git clone <repository-url>
cd 1111
```

2. Установите зависимости:
```bash
pip install -r requirements.txt
```

## Настройка

Файл `.env` уже настроен с вашими учетными данными AmoCRM:
- `AMOCRM_SUBDOMAIN` - поддомен вашего аккаунта
- `AMOCRM_CLIENT_ID` - ID интеграции
- `AMOCRM_CLIENT_SECRET` - секретный ключ
- `AMOCRM_REDIRECT_URI` - URI перенаправления
- `AMOCRM_AUTH_CODE` - код авторизации

## Использование

### Вариант 1: OAuth авторизация (классический метод)

Запустите скрипт:
```bash
python amocrm_chat_export.py
```

Скрипт выполнит следующие действия:
1. Обменяет код авторизации на токены доступа
2. Создаст базу данных SQLite (файл `amocrm_chats.db`)
3. Загрузит все разговоры из AmoCRM
4. Загрузит все сообщения из каждого разговора
5. Сохранит данные в базу данных

### Вариант 2: Экспорт через cookies (САМЫЙ ПРОСТОЙ)

#### Метод A: Header String формат

```bash
python amocrm_web_export.py
```

Скрипт попросит ввести:
1. Поддомен AmoCRM (например, `amoshturm`)
2. Cookies из браузера в формате HTTP заголовка

Подробная инструкция: [COOKIES_GUIDE.md](COOKIES_GUIDE.md)

#### Метод B: Netscape формат (из расширений браузера)

```bash
python amocrm_netscape_export.py
```

Этот метод поддерживает cookies, экспортированные в формате Netscape из расширений типа:
- EditThisCookie (Chrome/Edge)
- Cookie-Editor (Firefox)
- Cookie Quick Manager (Firefox)

Скрипт предложит:
1. Загрузить cookies из файла (например, `cookies.txt`)
2. Вставить cookies из буфера обмена

Затем введите поддомен (например, `amoshturm`)

**Устранение проблем**: См. [NETSCAPE_COOKIES_HOWTO.md](NETSCAPE_COOKIES_HOWTO.md)

### Вариант 3: Автоматический экспорт через логин/пароль

```bash
python amocrm_auto_export.py
```

Использует логин и пароль из файла `.env`

## Структура базы данных

База данных содержит следующие таблицы:

### conversations (разговоры)
- `id` - ID разговора
- `entity_type` - тип сущности (lead, contact и т.д.)
- `entity_id` - ID сущности
- `created_at` - дата создания
- `updated_at` - дата обновления
- `data` - полные данные в формате JSON

### messages (сообщения)
- `id` - ID сообщения
- `conversation_id` - ID разговора
- `author_id` - ID автора
- `message_text` - текст сообщения
- `created_at` - дата создания
- `message_type` - тип сообщения
- `data` - полные данные в формате JSON

### contacts (контакты)
- `id` - ID контакта
- `name` - имя контакта
- `created_at` - дата создания
- `updated_at` - дата обновления
- `data` - полные данные в формате JSON

### leads (сделки)
- `id` - ID сделки
- `name` - название сделки
- `price` - сумма сделки
- `status_id` - ID статуса
- `created_at` - дата создания
- `updated_at` - дата обновления
- `data` - полные данные в формате JSON

## Примеры SQL запросов

### Получить все сообщения из конкретного разговора:
```sql
SELECT * FROM messages WHERE conversation_id = 'YOUR_CONVERSATION_ID' ORDER BY created_at;
```

### Подсчитать количество сообщений по разговорам:
```sql
SELECT conversation_id, COUNT(*) as message_count
FROM messages
GROUP BY conversation_id
ORDER BY message_count DESC;
```

### Получить последние 10 сообщений:
```sql
SELECT * FROM messages ORDER BY created_at DESC LIMIT 10;
```

### Поиск по тексту сообщений:
```sql
SELECT * FROM messages WHERE message_text LIKE '%поисковый запрос%';
```

## Работа с базой данных

Вы можете открыть базу данных с помощью:
- SQLite Browser (DB Browser for SQLite)
- Командная строка: `sqlite3 amocrm_chats.db`
- Python с библиотекой sqlite3

## Обновление токена

Токены доступа сохраняются в файл `tokens.json`. При истечении access token скрипт автоматически обновит его используя refresh token.

## Безопасность

- Файл `.env` добавлен в `.gitignore` и не должен попадать в репозиторий
- Файл `tokens.json` также исключен из git
- База данных `amocrm_chats.db` не загружается в репозиторий

## Получение нового кода авторизации

Если код авторизации истек, получите новый:

1. Откройте в браузере:
```
https://amoshturm.amocrm.ru/oauth?client_id=fc29d0e5-34f5-4be5-876d-ad887a980884&redirect_uri=https://localhost&response_type=code
```

2. Авторизуйтесь и разрешите доступ

3. Из URL браузера скопируйте значение параметра `code`

4. Обновите значение `AMOCRM_AUTH_CODE` в файле `.env`

## Возможные проблемы

### Ошибка 401 Unauthorized
- Проверьте правильность Client ID и Client Secret
- Получите новый код авторизации
- Убедитесь, что redirect_uri совпадает с указанным в интеграции

### Ошибка при получении токенов
- Код авторизации используется только один раз
- Получите новый код авторизации (см. выше)

### База данных не создается
- Проверьте права доступа к директории
- Убедитесь, что установлен Python 3.7+

## Лицензия

MIT

## Автор

Создано с помощью Claude Code
