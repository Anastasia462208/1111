#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
Получение кода авторизации для AmoCRM
"""

import os
from dotenv import load_dotenv

load_dotenv()

subdomain = os.getenv('AMOCRM_SUBDOMAIN')
client_id = os.getenv('AMOCRM_CLIENT_ID')
redirect_uri = os.getenv('AMOCRM_REDIRECT_URI')

print("=" * 70)
print("Получение кода авторизации AmoCRM")
print("=" * 70)
print("\nШаг 1: Откройте эту ссылку в браузере:\n")

auth_url = f"https://{subdomain}.amocrm.ru/oauth?client_id={client_id}&redirect_uri={redirect_uri}&response_type=code"
print(auth_url)

print("\nШаг 2: Авторизуйтесь и разрешите доступ")
print("\nШаг 3: Браузер попытается перейти на https://localhost")
print("         (страница не загрузится, это нормально)")
print("\nШаг 4: Скопируйте значение параметра 'code' из адресной строки")
print("         URL будет выглядеть так:")
print(f"         {redirect_uri}?code=ОЧЕНЬ_ДЛИННЫЙ_КОД&...")
print("\nШаг 5: Обновите значение AMOCRM_AUTH_CODE в файле .env")
print("\nШаг 6: Запустите снова: python amocrm_chat_export.py")
print("=" * 70)
