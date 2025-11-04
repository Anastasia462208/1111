#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
AmoCRM Chat Export Tool
Экспорт переписки из AmoCRM в SQLite базу данных
"""

import os
import json
import sqlite3
import requests
from datetime import datetime
from dotenv import load_dotenv
import time

# Загрузка переменных окружения
load_dotenv()

class AmoCRMClient:
    def __init__(self):
        self.subdomain = os.getenv('AMOCRM_SUBDOMAIN')
        self.client_id = os.getenv('AMOCRM_CLIENT_ID')
        self.client_secret = os.getenv('AMOCRM_CLIENT_SECRET')
        self.redirect_uri = os.getenv('AMOCRM_REDIRECT_URI')
        self.auth_code = os.getenv('AMOCRM_AUTH_CODE')

        self.base_url = f'https://{self.subdomain}.amocrm.ru'
        self.api_url = 'https://api-b.amocrm.ru'  # API домен для запросов
        self.tokens_file = 'tokens.json'
        self.db_file = 'amocrm_chats.db'

        self.access_token = None
        self.refresh_token = None

    def get_tokens_from_code(self):
        """Получить токены доступа из кода авторизации"""
        print("Получение токенов доступа...")

        url = f'{self.base_url}/oauth2/access_token'
        data = {
            'client_id': self.client_id,
            'client_secret': self.client_secret,
            'grant_type': 'authorization_code',
            'code': self.auth_code,
            'redirect_uri': self.redirect_uri
        }

        try:
            response = requests.post(url, json=data)
            response.raise_for_status()

            tokens = response.json()
            self.access_token = tokens['access_token']
            self.refresh_token = tokens['refresh_token']

            # Сохранить токены в файл
            self.save_tokens(tokens)
            print("✓ Токены успешно получены и сохранены")
            return True

        except requests.exceptions.RequestException as e:
            print(f"✗ Ошибка при получении токенов: {e}")
            if hasattr(e, 'response') and e.response is not None:
                print(f"Ответ сервера: {e.response.text}")
            return False

    def save_tokens(self, tokens):
        """Сохранить токены в файл"""
        tokens['obtained_at'] = datetime.now().isoformat()
        with open(self.tokens_file, 'w') as f:
            json.dump(tokens, f, indent=2)

    def load_tokens(self):
        """Загрузить токены из файла"""
        if os.path.exists(self.tokens_file):
            with open(self.tokens_file, 'r') as f:
                tokens = json.load(f)
                self.access_token = tokens.get('access_token')
                self.refresh_token = tokens.get('refresh_token')
                return True
        return False

    def refresh_access_token(self):
        """Обновить access token используя refresh token"""
        print("Обновление access token...")

        url = f'{self.base_url}/oauth2/access_token'
        data = {
            'client_id': self.client_id,
            'client_secret': self.client_secret,
            'grant_type': 'refresh_token',
            'refresh_token': self.refresh_token,
            'redirect_uri': self.redirect_uri
        }

        try:
            response = requests.post(url, json=data)
            response.raise_for_status()

            tokens = response.json()
            self.access_token = tokens['access_token']
            self.refresh_token = tokens['refresh_token']

            self.save_tokens(tokens)
            print("✓ Токен успешно обновлен")
            return True

        except requests.exceptions.RequestException as e:
            print(f"✗ Ошибка при обновлении токена: {e}")
            return False

    def make_request(self, endpoint, method='GET', params=None, data=None):
        """Выполнить запрос к API AmoCRM"""
        url = f'{self.api_url}/api/v4/{endpoint}'
        headers = {
            'Authorization': f'Bearer {self.access_token}',
            'Content-Type': 'application/json'
        }

        try:
            if method == 'GET':
                response = requests.get(url, headers=headers, params=params)
            elif method == 'POST':
                response = requests.post(url, headers=headers, json=data)

            # Если токен истек, обновляем его
            if response.status_code == 401:
                print("Токен истек, обновляем...")
                if self.refresh_access_token():
                    headers['Authorization'] = f'Bearer {self.access_token}'
                    if method == 'GET':
                        response = requests.get(url, headers=headers, params=params)
                    elif method == 'POST':
                        response = requests.post(url, headers=headers, json=data)

            response.raise_for_status()
            return response.json()

        except requests.exceptions.RequestException as e:
            print(f"✗ Ошибка запроса к {endpoint}: {e}")
            if hasattr(e, 'response') and e.response is not None:
                print(f"Ответ сервера: {e.response.text}")
            return None

    def init_database(self):
        """Инициализировать базу данных SQLite"""
        print("Инициализация базы данных...")

        conn = sqlite3.connect(self.db_file)
        cursor = conn.cursor()

        # Таблица для контактов
        cursor.execute('''
        CREATE TABLE IF NOT EXISTS contacts (
            id INTEGER PRIMARY KEY,
            name TEXT,
            created_at INTEGER,
            updated_at INTEGER,
            data TEXT
        )
        ''')

        # Таблица для сделок
        cursor.execute('''
        CREATE TABLE IF NOT EXISTS leads (
            id INTEGER PRIMARY KEY,
            name TEXT,
            price INTEGER,
            status_id INTEGER,
            created_at INTEGER,
            updated_at INTEGER,
            data TEXT
        )
        ''')

        # Таблица для разговоров (чатов)
        cursor.execute('''
        CREATE TABLE IF NOT EXISTS conversations (
            id TEXT PRIMARY KEY,
            entity_type TEXT,
            entity_id INTEGER,
            created_at INTEGER,
            updated_at INTEGER,
            data TEXT
        )
        ''')

        # Таблица для сообщений
        cursor.execute('''
        CREATE TABLE IF NOT EXISTS messages (
            id TEXT PRIMARY KEY,
            conversation_id TEXT,
            author_id INTEGER,
            message_text TEXT,
            created_at INTEGER,
            message_type TEXT,
            data TEXT,
            FOREIGN KEY (conversation_id) REFERENCES conversations(id)
        )
        ''')

        conn.commit()
        conn.close()
        print("✓ База данных инициализирована")

    def get_all_conversations(self):
        """Получить все разговоры (чаты) из AmoCRM"""
        print("\nПолучение списка разговоров...")

        conversations = []
        page = 1

        while True:
            print(f"Загрузка страницы {page}...")
            params = {
                'page': page,
                'limit': 250
            }

            result = self.make_request('talks', params=params)

            if not result or '_embedded' not in result:
                break

            items = result['_embedded'].get('talks', [])
            if not items:
                break

            conversations.extend(items)
            print(f"✓ Получено {len(items)} разговоров на странице {page}")

            page += 1
            time.sleep(0.5)  # Задержка между запросами

        print(f"\n✓ Всего получено {len(conversations)} разговоров")
        return conversations

    def get_conversation_messages(self, conversation_id):
        """Получить все сообщения из конкретного разговора"""
        messages = []
        page = 1

        while True:
            params = {
                'page': page,
                'limit': 250
            }

            result = self.make_request(f'talks/{conversation_id}/messages', params=params)

            if not result or '_embedded' not in result:
                break

            items = result['_embedded'].get('messages', [])
            if not items:
                break

            messages.extend(items)
            page += 1
            time.sleep(0.3)

        return messages

    def save_conversations_to_db(self, conversations):
        """Сохранить разговоры в базу данных"""
        print("\nСохранение разговоров в базу данных...")

        conn = sqlite3.connect(self.db_file)
        cursor = conn.cursor()

        for conv in conversations:
            cursor.execute('''
            INSERT OR REPLACE INTO conversations
            (id, entity_type, entity_id, created_at, updated_at, data)
            VALUES (?, ?, ?, ?, ?, ?)
            ''', (
                conv.get('id'),
                conv.get('entity_type'),
                conv.get('entity_id'),
                conv.get('created_at'),
                conv.get('updated_at'),
                json.dumps(conv, ensure_ascii=False)
            ))

        conn.commit()
        conn.close()
        print(f"✓ Сохранено {len(conversations)} разговоров")

    def save_messages_to_db(self, conversation_id, messages):
        """Сохранить сообщения в базу данных"""
        if not messages:
            return

        conn = sqlite3.connect(self.db_file)
        cursor = conn.cursor()

        for msg in messages:
            cursor.execute('''
            INSERT OR REPLACE INTO messages
            (id, conversation_id, author_id, message_text, created_at, message_type, data)
            VALUES (?, ?, ?, ?, ?, ?, ?)
            ''', (
                msg.get('id'),
                conversation_id,
                msg.get('author_id'),
                msg.get('text', ''),
                msg.get('created_at'),
                msg.get('type'),
                json.dumps(msg, ensure_ascii=False)
            ))

        conn.commit()
        conn.close()

    def export_chats(self):
        """Основной метод экспорта чатов"""
        print("=" * 60)
        print("AmoCRM Chat Export - Экспорт переписки из AmoCRM")
        print("=" * 60)

        # Инициализация базы данных
        self.init_database()

        # Попытка загрузить существующие токены
        if not self.load_tokens():
            # Если токенов нет, получаем их из кода авторизации
            if not self.get_tokens_from_code():
                print("\n✗ Не удалось получить токены доступа")
                return False

        print(f"\n✓ Используем токен: {self.access_token[:20]}...")

        # Получаем все разговоры
        conversations = self.get_all_conversations()

        if not conversations:
            print("\n⚠ Разговоры не найдены")
            return False

        # Сохраняем разговоры в БД
        self.save_conversations_to_db(conversations)

        # Получаем сообщения для каждого разговора
        print("\nПолучение сообщений из разговоров...")
        total_messages = 0

        for i, conv in enumerate(conversations, 1):
            conv_id = conv.get('id')
            print(f"\n[{i}/{len(conversations)}] Разговор ID: {conv_id}")

            messages = self.get_conversation_messages(conv_id)
            if messages:
                self.save_messages_to_db(conv_id, messages)
                total_messages += len(messages)
                print(f"  ✓ Сохранено {len(messages)} сообщений")
            else:
                print(f"  ⚠ Нет сообщений")

            time.sleep(0.5)

        print("\n" + "=" * 60)
        print("✓ Экспорт завершен!")
        print(f"✓ Всего разговоров: {len(conversations)}")
        print(f"✓ Всего сообщений: {total_messages}")
        print(f"✓ База данных: {self.db_file}")
        print("=" * 60)

        return True


def main():
    """Главная функция"""
    client = AmoCRMClient()

    try:
        client.export_chats()
    except KeyboardInterrupt:
        print("\n\n⚠ Прервано пользователем")
    except Exception as e:
        print(f"\n✗ Ошибка: {e}")
        import traceback
        traceback.print_exc()


if __name__ == '__main__':
    main()
