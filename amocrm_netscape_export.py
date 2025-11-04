#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
AmoCRM Chat Export через Netscape Cookie File
Использует cookies в формате Netscape (из расширений браузера EditThisCookie, Cookie-Editor и др.)
"""

import os
import sys
import json
import sqlite3
import requests
from datetime import datetime
import time
from urllib.parse import unquote


class NetscapeCookieParser:
    """Парсер для Netscape cookie file format"""

    @staticmethod
    def parse_file(file_path):
        """
        Парсит файл cookies в формате Netscape

        Формат Netscape Cookie File:
        domain    flag    path    secure    expiration    name    value
        """
        cookies = {}

        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                for line in f:
                    # Пропускаем комментарии и пустые строки
                    line = line.strip()
                    if not line or line.startswith('#'):
                        continue

                    # Парсим строку cookie
                    parts = line.split('\t')
                    if len(parts) >= 7:
                        domain = parts[0]
                        flag = parts[1]
                        path = parts[2]
                        secure = parts[3]
                        expiration = parts[4]
                        name = parts[5]
                        value = parts[6]

                        # Декодируем URL-encoded значения
                        try:
                            value = unquote(value)
                        except:
                            pass

                        cookies[name] = value

            return cookies

        except Exception as e:
            print(f"✗ Ошибка при чтении файла cookies: {e}")
            return None

    @staticmethod
    def parse_string(cookie_string):
        """
        Парсит строку cookies в формате Netscape
        """
        cookies = {}

        for line in cookie_string.split('\n'):
            line = line.strip()
            if not line or line.startswith('#'):
                continue

            parts = line.split('\t')
            if len(parts) >= 7:
                name = parts[5]
                value = parts[6]

                # Декодируем URL-encoded значения
                try:
                    value = unquote(value)
                except:
                    pass

                cookies[name] = value

        return cookies

    @staticmethod
    def cookies_to_header_string(cookies_dict):
        """
        Конвертирует словарь cookies в строку для HTTP заголовка
        """
        return '; '.join([f"{name}={value}" for name, value in cookies_dict.items()])


class AmoCRMWebClient:
    """Клиент для работы с AmoCRM через Web API используя cookies"""

    def __init__(self, subdomain, cookies_dict):
        """
        Инициализация клиента

        :param subdomain: поддомен AmoCRM (например, 'amoshturm')
        :param cookies_dict: словарь cookies {name: value}
        """
        self.subdomain = subdomain
        self.base_url = f'https://{subdomain}.amocrm.ru'
        self.session = requests.Session()

        # Устанавливаем cookies
        for name, value in cookies_dict.items():
            self.session.cookies.set(name, value, domain=f'.amocrm.ru')

        # Настройка headers как у браузера
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36',
            'Accept': 'application/json, text/javascript, */*; q=0.01',
            'Accept-Language': 'ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7',
            'X-Requested-With': 'XMLHttpRequest',
            'Referer': f'{self.base_url}/',
        })

        self.db_file = 'amocrm_chats.db'

    def init_database(self):
        """Инициализировать базу данных SQLite"""
        print("Инициализация базы данных...")

        conn = sqlite3.connect(self.db_file)
        cursor = conn.cursor()

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

    def test_connection(self):
        """Проверить подключение"""
        print("\nПроверка подключения к AmoCRM...")

        try:
            # Пробуем получить информацию об аккаунте
            response = self.session.get(f'{self.base_url}/api/v4/account')

            if response.status_code == 200:
                data = response.json()
                print(f"✓ Подключение успешно!")
                print(f"  Аккаунт: {data.get('name', 'N/A')}")
                print(f"  ID: {data.get('id', 'N/A')}")
                return True
            elif response.status_code == 401:
                print("✗ Ошибка авторизации. Cookies недействительны или устарели.")
                print(f"  Попробуйте экспортировать новые cookies из браузера.")
                return False
            else:
                print(f"✗ Ошибка: {response.status_code}")
                print(f"  Ответ: {response.text[:200]}")
                return False

        except Exception as e:
            print(f"✗ Ошибка подключения: {e}")
            return False

    def get_all_conversations(self):
        """Получить все разговоры (чаты)"""
        print("\nПолучение списка разговоров...")

        conversations = []
        page = 1

        while True:
            print(f"Загрузка страницы {page}...")

            try:
                # Пробуем разные endpoints
                endpoints = [
                    f'{self.base_url}/api/v4/talks',
                    f'{self.base_url}/private/api/v2/json/talks/list',
                    f'{self.base_url}/ajax/talks/list',
                ]

                items = []
                for endpoint in endpoints:
                    params = {
                        'page': page,
                        'limit': 250
                    }

                    response = self.session.get(endpoint, params=params)

                    if response.status_code == 200:
                        try:
                            data = response.json()

                            # Пробуем разные форматы ответа
                            if '_embedded' in data and 'talks' in data['_embedded']:
                                items = data['_embedded']['talks']
                            elif 'response' in data and 'talks' in data['response']:
                                items = data['response']['talks']
                            elif isinstance(data, list):
                                items = data
                            elif 'talks' in data:
                                items = data['talks']

                            if items:
                                conversations.extend(items)
                                print(f"  ✓ Получено {len(items)} разговоров")
                                break

                        except json.JSONDecodeError:
                            continue

                if not items:
                    break

                page += 1
                time.sleep(0.5)

            except Exception as e:
                print(f"  ✗ Ошибка: {e}")
                break

        print(f"\n✓ Всего получено {len(conversations)} разговоров")
        return conversations

    def get_conversation_messages(self, conversation_id):
        """Получить все сообщения из конкретного разговора"""
        messages = []
        page = 1

        while True:
            try:
                # Пробуем разные endpoints для сообщений
                endpoints = [
                    f'{self.base_url}/api/v4/talks/{conversation_id}/messages',
                    f'{self.base_url}/private/api/v2/json/talks/{conversation_id}/messages',
                    f'{self.base_url}/ajax/talks/{conversation_id}/messages',
                ]

                items = []
                for endpoint in endpoints:
                    params = {'page': page, 'limit': 250}
                    response = self.session.get(endpoint, params=params)

                    if response.status_code == 200:
                        try:
                            data = response.json()

                            # Пробуем разные форматы
                            if '_embedded' in data and 'messages' in data['_embedded']:
                                items = data['_embedded']['messages']
                            elif 'response' in data and 'messages' in data['response']:
                                items = data['response']['messages']
                            elif isinstance(data, list):
                                items = data
                            elif 'messages' in data:
                                items = data['messages']

                            if items:
                                messages.extend(items)
                                break

                        except json.JSONDecodeError:
                            continue

                if not items:
                    break

                page += 1
                time.sleep(0.3)

            except Exception as e:
                break

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
                str(conv.get('id')),
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
                str(msg.get('id')),
                str(conversation_id),
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
        print("\n" + "=" * 60)
        print("AmoCRM Netscape Cookie Export")
        print("=" * 60)

        # Инициализация базы данных
        self.init_database()

        # Проверка подключения
        if not self.test_connection():
            print("\n✗ Не удалось подключиться к AmoCRM")
            print("\nПроверьте:")
            print("1. Вы авторизованы в AmoCRM в браузере")
            print("2. Cookies экспортированы правильно")
            print("3. Cookies не устарели (обычно действуют 24-48 часов)")
            return False

        # Получаем все разговоры
        conversations = self.get_all_conversations()

        if not conversations:
            print("\n⚠ Разговоры не найдены")
            print("Это может означать, что:")
            print("- В вашем аккаунте нет чатов")
            print("- Требуются дополнительные права доступа")
            print("- API endpoint изменился")
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
    print("=" * 60)
    print("AmoCRM Netscape Cookie File Export")
    print("Экспорт чатов через cookies в формате Netscape")
    print("=" * 60)

    # Определяем способ ввода cookies
    print("\nВыберите способ ввода cookies:")
    print("1. Из файла (Netscape Cookie File)")
    print("2. Вставить текст из буфера обмена")

    choice = input("\nВаш выбор (1 или 2): ").strip()

    cookies_dict = None

    if choice == '1':
        # Из файла
        cookie_file = input("\nПуть к файлу с cookies (например, cookies.txt): ").strip()

        if not os.path.exists(cookie_file):
            print(f"\n✗ Файл не найден: {cookie_file}")
            return

        cookies_dict = NetscapeCookieParser.parse_file(cookie_file)

    elif choice == '2':
        # Из буфера
        print("\nВставьте содержимое Netscape Cookie File:")
        print("(Нажмите Enter, затем Ctrl+D (Linux/Mac) или Ctrl+Z (Windows) для завершения)")
        print("-" * 60)

        lines = []
        try:
            while True:
                line = input()
                lines.append(line)
        except EOFError:
            pass

        cookie_string = '\n'.join(lines)
        cookies_dict = NetscapeCookieParser.parse_string(cookie_string)

    else:
        print("\n✗ Неверный выбор")
        return

    if not cookies_dict:
        print("\n✗ Не удалось распарсить cookies")
        return

    print(f"\n✓ Найдено {len(cookies_dict)} cookies")

    # Определяем поддомен
    subdomain = input("\nВведите поддомен AmoCRM (например, 'amoshturm'): ").strip()

    if not subdomain:
        print("\n✗ Поддомен не указан")
        return

    # Создаем клиент и запускаем экспорт
    client = AmoCRMWebClient(subdomain, cookies_dict)

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
