#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
Тестирование токена AmoCRM
"""

import json
import requests

# Загружаем токен
with open('tokens.json', 'r') as f:
    tokens = json.load(f)

access_token = tokens['access_token']

print("="*60)
print("Тестирование токена AmoCRM")
print("="*60)

# Тестируем разные endpoints
endpoints = [
    ('account', 'Информация об аккаунте'),
    ('users', 'Список пользователей'),
    ('leads', 'Список сделок'),
    ('contacts', 'Список контактов'),
    ('talks', 'Список разговоров (чатов)'),
    ('conversations', 'Список conversations'),
]

for endpoint, description in endpoints:
    print(f"\n{description} ({endpoint}):")

    url = f'https://api-b.amocrm.ru/api/v4/{endpoint}'
    headers = {
        'Authorization': f'Bearer {access_token}',
        'Content-Type': 'application/json'
    }

    try:
        response = requests.get(url, headers=headers, params={'limit': 1})

        if response.status_code == 200:
            data = response.json()
            print(f"  ✓ Успешно! Получено данных: {len(str(data))} символов")
            if '_embedded' in data:
                for key in data['_embedded'].keys():
                    items = data['_embedded'][key]
                    print(f"    - {key}: {len(items) if isinstance(items, list) else 'N/A'} элементов")
        elif response.status_code == 403:
            print(f"  ✗ 403 Forbidden - Нет доступа")
        elif response.status_code == 401:
            print(f"  ✗ 401 Unauthorized - Токен недействителен")
        elif response.status_code == 404:
            print(f"  ⚠ 404 Not Found - Endpoint не существует")
        else:
            print(f"  ✗ {response.status_code} - {response.text[:100]}")

    except Exception as e:
        print(f"  ✗ Ошибка: {e}")

print("\n" + "="*60)
