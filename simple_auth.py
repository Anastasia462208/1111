#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
Простая авторизация AmoCRM без локального сервера
"""

import os
import json
import requests
from dotenv import load_dotenv

load_dotenv()

subdomain = os.getenv('AMOCRM_SUBDOMAIN')
client_id = os.getenv('AMOCRM_CLIENT_ID')
client_secret = os.getenv('AMOCRM_CLIENT_SECRET')
redirect_uri = os.getenv('AMOCRM_REDIRECT_URI')

print("="*70)
print("Простая авторизация AmoCRM")
print("="*70)

print("\n1. Откройте эту ссылку в браузере:\n")
auth_url = f"https://{subdomain}.amocrm.ru/oauth?client_id={client_id}&redirect_uri={redirect_uri}&response_type=code"
print(auth_url)

print("\n2. Авторизуйтесь и разрешите доступ")
print("\n3. Браузер перенаправит вас на:")
print(f"   {redirect_uri}?code=ДЛИННЫЙ_КОД")
print("\n4. Скопируйте ВЕСЬ URL из адресной строки браузера")
print("   (или только значение параметра 'code')")

print("\n" + "="*70)
redirect_url = input("\nВставьте URL или код: ").strip()

# Извлекаем код
if redirect_url.startswith('http'):
    # Это полный URL
    from urllib.parse import urlparse, parse_qs
    parsed = urlparse(redirect_url)
    params = parse_qs(parsed.query)
    if 'code' in params:
        code = params['code'][0]
    else:
        print("✗ Не найден параметр 'code' в URL")
        exit(1)
else:
    # Это просто код
    code = redirect_url

print(f"\n✓ Код получен: {code[:50]}...")
print("\nОбмениваем код на токены...")

# Обмениваем код на токены
url = f'https://{subdomain}.amocrm.ru/oauth2/access_token'
data = {
    'client_id': client_id,
    'client_secret': client_secret,
    'grant_type': 'authorization_code',
    'code': code,
    'redirect_uri': redirect_uri
}

try:
    response = requests.post(url, json=data)
    response.raise_for_status()

    tokens = response.json()

    # Сохраняем токены
    with open('tokens.json', 'w') as f:
        json.dump(tokens, f, indent=2)

    print("\n✓ Токены успешно получены и сохранены в tokens.json")
    print("\nТеперь запустите:")
    print("  python amocrm_chat_export.py")
    print("="*70)

except Exception as e:
    print(f"\n✗ Ошибка: {e}")
    if hasattr(e, 'response') and e.response is not None:
        print(f"Ответ сервера: {e.response.text}")
