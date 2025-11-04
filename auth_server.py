#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
Локальный сервер для получения кода авторизации AmoCRM
"""

import os
import webbrowser
from http.server import HTTPServer, BaseHTTPRequestHandler
from urllib.parse import urlparse, parse_qs
from dotenv import load_dotenv
import json

load_dotenv()

subdomain = os.getenv('AMOCRM_SUBDOMAIN')
client_id = os.getenv('AMOCRM_CLIENT_ID')
client_secret = os.getenv('AMOCRM_CLIENT_SECRET')

# Код будет сохранен сюда
auth_code = None

class AuthHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        global auth_code

        # Парсим URL
        parsed_url = urlparse(self.path)
        params = parse_qs(parsed_url.query)

        if 'code' in params:
            auth_code = params['code'][0]

            # Отправляем успешный ответ
            self.send_response(200)
            self.send_header('Content-type', 'text/html; charset=utf-8')
            self.end_headers()

            html = """
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <title>Авторизация успешна</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        max-width: 600px;
                        margin: 50px auto;
                        padding: 20px;
                        text-align: center;
                    }
                    .success { color: #28a745; font-size: 24px; }
                    .code {
                        background: #f5f5f5;
                        padding: 10px;
                        margin: 20px 0;
                        word-break: break-all;
                        font-family: monospace;
                    }
                </style>
            </head>
            <body>
                <h1 class="success">✓ Авторизация успешна!</h1>
                <p>Код авторизации получен и сохранен.</p>
                <p>Вы можете закрыть это окно и вернуться в терминал.</p>
            </body>
            </html>
            """

            self.wfile.write(html.encode('utf-8'))

            print("\n" + "="*60)
            print("✓ Код авторизации успешно получен!")
            print("="*60)
            print(f"\nКод: {auth_code[:50]}...")
            print("\nОбмениваем код на токены...")

            # Сразу обмениваем код на токены
            exchange_code_for_tokens(auth_code)

        else:
            self.send_response(200)
            self.send_header('Content-type', 'text/html; charset=utf-8')
            self.end_headers()
            self.wfile.write(b"<html><body><h1>Waiting for authorization...</h1></body></html>")

    def log_message(self, format, *args):
        # Отключаем логи сервера
        pass


def exchange_code_for_tokens(code):
    """Обменять код на токены"""
    import requests

    url = f'https://{subdomain}.amocrm.ru/oauth2/access_token'
    data = {
        'client_id': client_id,
        'client_secret': client_secret,
        'grant_type': 'authorization_code',
        'code': code,
        'redirect_uri': 'http://localhost:8080'
    }

    try:
        response = requests.post(url, json=data)
        response.raise_for_status()

        tokens = response.json()

        # Сохраняем токены
        with open('tokens.json', 'w') as f:
            json.dump(tokens, f, indent=2)

        print("\n✓ Токены успешно получены и сохранены в tokens.json")
        print("\nТеперь вы можете запустить:")
        print("  python amocrm_chat_export.py")
        print("="*60)

        return True

    except Exception as e:
        print(f"\n✗ Ошибка при обмене кода на токены: {e}")
        if hasattr(e, 'response') and e.response is not None:
            print(f"Ответ сервера: {e.response.text}")

        print(f"\nКод авторизации сохранен, обновите его в .env файле:")
        print(f"AMOCRM_AUTH_CODE={code}")
        return False


def main():
    print("="*60)
    print("AmoCRM Authorization Server")
    print("="*60)
    print("\n1. Запускаю локальный сервер на http://localhost:8080")
    print("2. Открываю браузер для авторизации...")
    print("3. После авторизации код будет автоматически получен\n")

    # Создаем сервер
    server = HTTPServer(('localhost', 8080), AuthHandler)

    # Формируем URL для авторизации
    auth_url = f"https://{subdomain}.amocrm.ru/oauth?client_id={client_id}&redirect_uri=http://localhost:8080&response_type=code&mode=post_message"

    print(f"URL авторизации: {auth_url}\n")
    print("Открываю браузер...")

    # Открываем браузер
    webbrowser.open(auth_url)

    print("\nОжидание авторизации...")
    print("(Нажмите Ctrl+C для отмены)\n")

    # Запускаем сервер
    try:
        while auth_code is None:
            server.handle_request()

        # Даем время на отправку ответа
        import time
        time.sleep(1)

    except KeyboardInterrupt:
        print("\n\n✗ Отменено пользователем")
    finally:
        server.server_close()


if __name__ == '__main__':
    main()
