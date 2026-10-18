# Bulwark Webmail, русская сборка

Форк [bulwarkmail/webmail](https://github.com/bulwarkmail/webmail) для сервера Stalwart. Исходная лицензия AGPL-3.0-only сохранена, текст лицензии лежит в `LICENSES/`.

## Что изменено

- **Панель администратора на русском.** В оригинале панель `/admin` написана с английскими текстами прямо в коде и не использует next-intl. Здесь добавлен словарь `lib/admin/i18n/ru.json` (520 строк), правила для сообщений со вставленными значениями `lib/admin/i18n/patterns.ru.ts` и компонент `components/admin/admin-translator.tsx`. Он переводит страницы панели и сообщения диалогов, если язык страницы русский. Остальной интерфейс почты уже был переведён в оригинале.
- **Русский язык по умолчанию** при сборке образа с аргументом `NEXT_PUBLIC_DEFAULT_LOCALE=ru`.

## Сборка образа

```bash
docker build --build-arg NEXT_PUBLIC_DEFAULT_LOCALE=ru -t bulwark-webmail-ru .
```

## Как дополнять перевод

Если в панели осталась английская строка, добавьте её в `lib/admin/i18n/ru.json` ровно в том виде, как она показана на странице (пробелы схлопываются), либо правило в `patterns.ru.ts` для строк со вставками. Проверка: `npx vitest run lib/admin/i18n`.

## Исходный код

Как требует AGPL, исходный код этой сборки открыт: https://github.com/Streenger/bulwark-webmail-ru
