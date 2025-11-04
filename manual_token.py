#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
Ручной ввод токенов для AmoCRM
"""

import json
from datetime import datetime

print("="*70)
print("Ручной ввод токенов AmoCRM")
print("="*70)
print("\nЕсли у вас уже есть access_token и refresh_token,")
print("вы можете ввести их вручную.\n")

print("Как получить токены:")
print("1. Зайдите в AmoCRM → Настройки → Интеграции")
print("2. Откройте вашу интеграцию")
print("3. Если есть токены - скопируйте их")
print("="*70)

access_token = input("\nВведите Access Token: ").strip()
refresh_token = input("Введите Refresh Token: ").strip()

if access_token and refresh_token:
    tokens = {
        'access_token': access_token,
        'refresh_token': refresh_token,
        'token_type': 'Bearer',
        'expires_in': 86400,
        'obtained_at': datetime.now().isoformat()
    }

    with open('tokens.json', 'w') as f:
        json.dump(tokens, f, indent=2)

    print("\n✓ Токены сохранены в tokens.json")
    print("\nТеперь запустите:")
    print("  python amocrm_chat_export.py")
    print("="*70)
else:
    print("\n✗ Токены не введены")
