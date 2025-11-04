#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
AmoCRM Chat Export - Автоматическая авторизация через логин/пароль
Самый простой способ - авторизуется автоматически и экспортирует переписку
"""

import os
import json
import sqlite3
import requests
from datetime import datetime
import time

class AmoCRMAutoClient:
    def __init__(self, email, password, subdomain='amoshturm'):
        """
        Инициализация клиента с автоматической авторизацией

        :param email: Email для входа
        :param password: Пароль
        :param subdomain: Поддомен AmoCRM
        """
        self.email = email
        self.password = password
        self.subdomain = subdomain
        self.base_url = f'https://{subdomain}.amocrm.ru'
        self.session = requests.Session()

        # Настройка headers как у браузера
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'application/json, text/javascript, */*; q=0.01',
            'Accept-Language': 'ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7',
            'Content-Type': 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
            'Referer': f'{self.base_url}/',
        })

        self.db_file = 'amocrm_chats.db'

    def login(self):
        """Авторизация через логин/пароль"""
        print("Авторизация в AmoCRM...")

        # Пробуем разные endpoints для авторизации
        login_endpoints = [
            f'{self.base_url}/oauth2/authorize',
            f'{self.base_url}/private/login',
            f'{self.base_url}/auth/login',
        ]

        login_data = {
            'login': self.email,
            'password': self.password,
        }

        for endpoint in login_endpoints:
            try:
                response = self.session.post(endpoint, json=login_data)

                if response.status_code == 200:
                    print(f"✓ Авторизация успешна через {endpoint}")
                    return True

            except Exception as e:
                continue

        # Пробуем стандартную форму входа
        try:
            # Получаем страницу входа
            response = self.session.get(f'{self.base_url}/')

            # Пытаемся войти через форму
            form_data = {
                'USER_LOGIN': self.email,
                'USER_HASH': self.password,
            }

            response = self.session.post(
                f'{self.base_url}/oauth',
                data=form_data
            )

            if 'session' in self.session.cookies or response.status_code == 200:
                print("✓ Авторизация успешна")
                return True

        except Exception as e:
            pass

        print("✗ Не удалось авторизоваться автоматически")
        return False

    def init_database(self):
        """Инициализировать базу данных SQLite"""
        print("Инициализация базы данных...")

        conn = sqlite3.connect(self.db_file)
        cursor = conn.cursor()

        # Таблица для разговоров
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

    def test_connection(self):
        """Проверить подключение к API"""
        print("Проверка доступа к API...")

        endpoints_to_test = [
            ('api/v4/account', 'API v4'),
            ('private/api/v2/json/accounts/current', 'Private API'),
        ]

        for endpoint, name in endpoints_to_test:
            try:
                url = f'{self.base_url}/{endpoint}'
                response = self.session.get(url)

                if response.status_code == 200:
                    print(f"✓ Доступ к {name} получен")
                    return True

            except:
                continue

        print("⚠ Не удалось получить доступ к API")
        print("Попробуем продолжить...")
        return True  # Продолжаем в любом случае

    def get_all_conversations(self):
        """Получить все разговоры"""
        print("\nПолучение списка разговоров...")

        conversations = []
        page = 1

        # Пробуем разные endpoints
        endpoints = [
            'api/v4/talks',
            'private/api/v2/json/talks/list',
            'ajax/v1/talks/list',
            'ajax/talks/list',
        ]

        while True:
            print(f"Загрузка страницы {page}...")

            for endpoint in endpoints:
                try:
                    url = f'{self.base_url}/{endpoint}'
                    params = {'page': page, 'limit': 250}

                    response = self.session.get(url, params=params)

                    if response.status_code == 200:
                        try:
                            data = response.json()

                            # Парсим разные форматы ответа
                            items = []
                            if '_embedded' in data and 'talks' in data['_embedded']:
                                items = data['_embedded']['talks']
                            elif 'response' in data:
                                if isinstance(data['response'], dict) and 'talks' in data['response']:
                                    items = data['response']['talks']
                                elif isinstance(data['response'], list):
                                    items = data['response']
                            elif 'talks' in data:
                                items = data['talks']
                            elif isinstance(data, list):
                                items = data

                            if items:
                                conversations.extend(items)
                                print(f"  ✓ Получено {len(items)} разговоров")
                                break

                        except json.JSONDecodeError:
                            continue

                except Exception as e:
                    continue

            if not items:
                break

            page += 1
            time.sleep(0.5)

        print(f"\n✓ Всего получено {len(conversations)} разговоров")
        return conversations

    def get_conversation_messages(self, conversation_id):
        """Получить сообщения из разговора"""
        messages = []
        page = 1

        endpoints = [
            f'api/v4/talks/{conversation_id}/messages',
            f'private/api/v2/json/talks/{conversation_id}/messages',
            f'ajax/talks/{conversation_id}/messages',
        ]

        while True:
            for endpoint in endpoints:
                try:
                    url = f'{self.base_url}/{endpoint}'
                    params = {'page': page, 'limit': 250}

                    response = self.session.get(url, params=params)

                    if response.status_code == 200:
                        try:
                            data = response.json()

                            items = []
                            if '_embedded' in data and 'messages' in data['_embedded']:
                                items = data['_embedded']['messages']
                            elif 'response' in data:
                                if isinstance(data['response'], dict) and 'messages' in data['response']:
                                    items = data['response']['messages']
                                elif isinstance(data['response'], list):
                                    items = data['response']
                            elif 'messages' in data:
                                items = data['messages']
                            elif isinstance(data, list):
                                items = data

                            if items:
                                messages.extend(items)
                                break

                        except:
                            continue

                except:
                    continue

            if not items:
                break

            page += 1
            time.sleep(0.3)

        return messages

    def save_conversations_to_db(self, conversations):
        """Сохранить разговоры в БД"""
        if not conversations:
            return

        print("\nСохранение разговоров в базу данных...")

        conn = sqlite3.connect(self.db_file)
        cursor = conn.cursor()

        for conv in conversations:
            cursor.execute('''
            INSERT OR REPLACE INTO conversations
            (id, entity_type, entity_id, created_at, updated_at, data)
            VALUES (?, ?, ?, ?, ?, ?)
            ''', (
                str(conv.get('id', '')),
                conv.get('entity_type', ''),
                conv.get('entity_id', 0),
                conv.get('created_at', 0),
                conv.get('updated_at', 0),
                json.dumps(conv, ensure_ascii=False)
            ))

        conn.commit()
        conn.close()
        print(f"✓ Сохранено {len(conversations)} разговоров")

    def save_messages_to_db(self, conversation_id, messages):
        """Сохранить сообщения в БД"""
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
                str(msg.get('id', '')),
                str(conversation_id),
                msg.get('author_id', 0),
                msg.get('text', ''),
                msg.get('created_at', 0),
                msg.get('type', ''),
                json.dumps(msg, ensure_ascii=False)
            ))

        conn.commit()
        conn.close()

    def export_chats(self):
        """Главный метод экспорта"""
        print("=" * 60)
        print("AmoCRM Auto Export - Автоматический экспорт переписки")
        print("=" * 60)

        # Авторизация
        if not self.login():
            print("\n✗ Не удалось авторизоваться")
            print("\nВозможные причины:")
            print("- Неверный логин или пароль")
            print("- Требуется капча")
            print("- Блокировка автоматического входа")
            print("\nПопробуйте использовать amocrm_web_export.py с cookies")
            return False

        # Инициализация БД
        self.init_database()

        # Проверка подключения
        self.test_connection()

        # Получение разговоров
        conversations = self.get_all_conversations()

        if not conversations:
            print("\n⚠ Разговоры не найдены")
            return False

        # Сохранение разговоров
        self.save_conversations_to_db(conversations)

        # Получение сообщений
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
    # Читаем учетные данные из .env или запрашиваем
    email = os.getenv('AMOCRM_EMAIL', 'amoshturm@gmail.com')
    password = os.getenv('AMOCRM_PASSWORD', 'GbbT4Z5L')
    subdomain = os.getenv('AMOCRM_SUBDOMAIN', 'amoshturm')

    print("=" * 60)
    print("AmoCRM Automatic Export")
    print("=" * 60)
    print(f"\nЛогин: {email}")
    print(f"Поддомен: {subdomain}")
    print("=" * 60)

    # Создаем клиент и запускаем экспорт
    client = AmoCRMAutoClient(email, password, subdomain)

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
