#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
Быстрый тест для проверки работы cookies
"""

import sys
sys.path.insert(0, '/home/user/1111')

from amocrm_netscape_export import NetscapeCookieParser, AmoCRMWebClient

def test_cookies():
    """Тестирование cookies из файла"""

    # Парсим cookies из файла
    cookies_dict = NetscapeCookieParser.parse_file('/home/user/1111/cookies.txt')

    if not cookies_dict:
        print("✗ Не удалось прочитать cookies из файла")
        return False

    print(f"✓ Найдено {len(cookies_dict)} cookies:")
    for name in sorted(cookies_dict.keys()):
        value = cookies_dict[name]
        if len(value) > 50:
            value = value[:47] + "..."
        print(f"  - {name}: {value}")

    # Создаем клиент
    subdomain = 'amoshturm'
    client = AmoCRMWebClient(subdomain, cookies_dict)

    # Проверяем подключение
    print(f"\nПроверка подключения к {subdomain}.amocrm.ru...")
    result = client.test_connection()

    return result

if __name__ == '__main__':
    success = test_cookies()
    sys.exit(0 if success else 1)
