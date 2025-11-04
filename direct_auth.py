#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
Прямая авторизация в AmoCRM через логин и пароль (для старых аккаунтов)
или использование готовых токенов
"""

import os
import json
import requests
from dotenv import load_dotenv

load_dotenv()

subdomain = os.getenv('AMOCRM_SUBDOMAIN')
client_id = os.getenv('AMOCRM_CLIENT_ID')
client_secret = os.getenv('AMOCRM_CLIENT_SECRET')

print("="*70)
print("Альтернативные способы авторизации AmoCRM")
print("="*70)

print("\n╔════════════════════════════════════════════════════════════════════╗")
print("║  ВАРИАНТ 1: Авторизация через веб-интерфейс (РЕКОМЕНДУЕТСЯ)       ║")
print("╚════════════════════════════════════════════════════════════════════╝")
print("\n1. Откройте в браузере:")
print(f"   https://{subdomain}.amocrm.ru/settings/widgets")
print("\n2. Войдите в свой аккаунт AmoCRM")
print("\n3. Найдите вашу интеграцию в списке")
print("\n4. Нажмите 'Настроить' или 'Авторизовать'")
print("\n5. После успешной авторизации URL изменится на:")
print("   http://localhost:8080/?code=ДЛИННЫЙ_КОД")
print("\n6. Скопируйте этот URL целиком и вставьте ниже")

print("\n" + "="*70)
url_or_code = input("\nВставьте URL или код (или нажмите Enter для пропуска): ").strip()

if url_or_code:
    # Извлекаем код
    if url_or_code.startswith('http'):
        from urllib.parse import urlparse, parse_qs
        parsed = urlparse(url_or_code)
        params = parse_qs(parsed.query)
        if 'code' in params:
            code = params['code'][0]
        else:
            print("✗ Не найден параметр 'code' в URL")
            exit(1)
    else:
        code = url_or_code

    print(f"\n✓ Код получен: {code[:50]}...")
    print("\nОбмениваем код на токены...")

    # Обмениваем код на токены
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

        print("\n✓ Токены успешно получены и сохранены!")
        print("\nТеперь запустите:")
        print("  python amocrm_chat_export.py")
        print("="*70)

    except Exception as e:
        print(f"\n✗ Ошибка: {e}")
        if hasattr(e, 'response') and e.response is not None:
            print(f"Ответ сервера: {e.response.text}")

print("\n╔════════════════════════════════════════════════════════════════════╗")
print("║  ВАРИАНТ 2: Авторизация через кнопку в интеграции                 ║")
print("╚════════════════════════════════════════════════════════════════════╝")
print("\n1. Зайдите: https://amoshturm.amocrm.ru/settings/integrations")
print("2. Найдите интеграцию с ID: fc29d0e5-34f5-4be5-876d-ad887a980884")
print("3. Нажмите кнопку 'Подключить' или 'Авторизовать'")
print("4. Скопируйте URL после редиректа")
print("5. Запустите этот скрипт снова и вставьте URL")

print("\n" + "="*70)
