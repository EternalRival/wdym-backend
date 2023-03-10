<iframe src="/public" style="width:100%;height:3.5em;"></iframe>

---

## Администрирование

- [SocketIO](/socketio) (Взаимодействие в вебсокетами)
- [OpenApi](/api) (Примеры REST запросов)

<sup>Ссылки работают со страницы документации деплоя.</sup>

---

## Процесс игры со стороны сервера

Создается лобби

Фаза `prepare`

Сервер ожидает запуска игры

Игра запускается с кнопки
Фаза меняется

Фаза `choose-situation`

Запустился таймер для перехода к следующей фазе (обычный)
Сервер слушает события отправки голосов за ситуацию

Фаза `situation`

Запустился таймер для перехода к следующей фазе (выбранный при создании лобби)
Сервер слушает события отправки мемов

При получении мемов происходит проверка "каждый ли игрок отправил мем"
При получении мемов от каждого игрока фаза меняется
Если таймер закончился раньше получения всех мемов - фаза меняется

Фаза `vote`

Запустился таймер для перехода к следующей фазе (выбранный при создании лобби)
Сервер слушает события отправки голосов за мем

При получении голосов происходит проверка "каждый ли игрок проголосовал"
При получении голосов от каждого игрока фаза меняется
Если таймер закончился раньше получения всех мемов - фаза меняется

Фаза `vote-results`

Запустился таймер для перехода к следующей фазе (короткий)

Если таймер закончился, то происходит проверка "последний ли раунд"
Если раунд не последний, переходим к фазе `situation` и начинается новый раунд
Если раунд последний, переходим к фазе `end`

Фаза `end`

Сервер ждёт команду от создателя лобби для перехода в фазу `prepare`

---

## xCheck

<sup>Информация для тимлида проекта:</sup>

1. Task: https://github.com/rolling-scopes-school/tasks/blob/master/tasks/rsclone/rsclone.md

2. <details><summary>Screenshots:</summary><img src='https://user-images.githubusercontent.com/59611223/221384211-451d1507-33cd-414c-a189-eb44afbae13a.png'><img src='https://user-images.githubusercontent.com/59611223/221384234-8f61f33d-0357-46da-8fb0-1e5590df6f67.png'></details>

3. Deploy: https://wdym-js-er-sd.onrender.com/

4. Done 28.02.2023 / deadline 28.02.2023

5. Score: 200/200

- Написан своими руками (с нуля) и имеет историю коммитов.
- Back-end задеплоен и отвечает на запросы POSTman. (примеры некоторых запросов описаны ниже. примеры всех запросов описаны в OpenApi)
  - `curl -X 'GET' 'https://wdym-js-er-sd.onrender.com/uptime' -H 'accept: application/json'`
  - `curl -X 'GET' 'https://wdym-js-er-sd.onrender.com/users' -H 'accept: application/json'`
  - `curl -X 'GET' 'https://wdym-js-er-sd.onrender.com/users/id/1' -H 'accept: application/json'`
  - `curl -X 'GET' 'https://wdym-js-er-sd.onrender.com/users/has?username=Rival' -H 'accept: application/json'`
  - `curl -X 'GET' 'https://wdym-js-er-sd.onrender.com/file/random-avatar' -H 'accept: application/json'`
- Использован JS стек (NestJS/Express/Node.js/TS)

---

- Написан своими руками (с нуля) и имеет историю коммитов.
- Back-end задеплоен и отвечает на запросы POSTman. (примеры некоторых запросов описаны ниже. примеры всех запросов описаны в OpenApi)
  - `curl -X 'GET' 'https://wdym-js-er-sd.onrender.com/uptime' -H 'accept: application/json'`
  - `curl -X 'GET' 'https://wdym-js-er-sd.onrender.com/users' -H 'accept: application/json'`
  - `curl -X 'GET' 'https://wdym-js-er-sd.onrender.com/users/id/1' -H 'accept: application/json'`
  - `curl -X 'GET' 'https://wdym-js-er-sd.onrender.com/users/has?username=Rival' -H 'accept: application/json'`
  - `curl -X 'GET' 'https://wdym-js-er-sd.onrender.com/file/random-avatar' -H 'accept: application/json'`
- Использован JS стек (NestJS/Express/Node.js/TS)

---

### Качество кода

- [x] ESLint подключен, настроен и отсутствуют ошибки (используются плагины `recommended`, `airbnb`, плюс несколько кастомных правил по типу `no-explicit-any`, `max-lines-per-function`, `explicit-function-return-type` и т.п.)
- [x] нигде не используется тип `Any`
- [x] В конфигурационном файле TypeScript стоят флаги `"noImplicitAny": true` и `"strict": true`

### Проект (50)

- [x] Использован MVC паттерн. (5)
- [x] Реализована работа с REST API. (5)
- [x] Реализованы подключение и работа с БД (PostgreSQL). (5)
- [x] Используется ORM (TypeORM). (5)
- [x] Реализована документация проекта (Compodoc) (5)
- [x] Реализована работа с OpenApi (Swagger) (5)
- [x] Реализована работа с веб-сокетами (SocketIO). (5)
- [x] Реализована возможность администрирования сокет-сервера через админ-панель SocketIO (5)
- [x] OpenApi и админ-панель SocketIO защищены авторизацией (5)
- [x] Сервер выводит читаемые логи в консоль (5)

### Аутентификация/Авторизация (15)

- [x] Basic (Login+Password) (5)
- [x] JWT (JWT Token)
  - [x] с использованием Header(Bearer) (5)
  - [x] с использованием Cookie (5)

### Пользователь (30)

- [x] Регистрация. (5)
- [x] Шифрование пароля (хеширование) (5)
- [x] Данные пользователя хранятся в БД (5)
- [x] Данные пользователя можно редактировать через REST запросы (5)
- [x] Пользователь может удалить себя через REST запрос (5)
- [x] Изменение данных и удаление пользователя происходит только с JWT валидацией (5)

### Файлы (30)

- [x] Реализовано хранение статических файлов на сервере (5)
- [x] Реализовано взаимодействие с статическими файлами на сервере (10)
  - [x] Выдача полного списка файлов по REST запросу
  - [x] Выдача частичного списка файлов по REST запросу с использованием Query параметров
- [x] Реализована выдача случайной аватарки по REST запросу (5)
- [x] Реализована архивация файлов (Zip) для загрузки (download) выбранных файлов (мемов) по REST запросу (10)

### Игра (75)

- [x] Чат (10)
  - [x] Реализованы получение и отправка сообщений в глобальном чате
  - [x] Реализованы получение и отправка сообщений в индивидуальных чатах лобби
- [x] Лобби
  - [x] Реализовано создание и удаление лобби (5)
  - [x] Параметры игры можно настроить на фронт-энде (5)
  - [x] Реализовано подключение игроков к лобби (5)
  - [x] Реализована выдача списка лобби через веб-сокеты (10)
    - [x] Реализована выдача полного списка лобби
    - [x] Реализована выдача частичного списка лобби (для динамической подгрузки на фронт-энде)
- [x] Гемплей
  - [x] Реализована валидация для управления игрой (только владелец лобби может запускать игру и вручную переключать фазы) (5)
  - [x] Продумана и реализована логика самой игры
    - [x] Реализована фаза PREPARE (ожидание игроков и запуск игры владельцем лобби)
    - [x] Реализована фаза CHOOSE_SITUATION (динамический прием голосов за ситуацию раунда) (5)
    - [x] Реализована фаза SITUATION (прием мемов от игроков) (5)
    - [x] Реализована фаза VOTE (прием голосов от игроков) (5)
    - [x] Реализована фаза VOTE_RESULTS (подсчет обновление очков) (5)
    - [x] Реализована фаза END (результаты игры и ожидание перехода к фазе подготовки)
  - [x] Реализовано переключение фаз игры
    - [x] Автоматическое по таймеру (5)
    - [x] Автоматическое досрочное (всё готово для смены и нет смысла ждать таймер) (5)
    - [x] Ручное (запуск/перезапуск игры и возможность досрочного переключения к следующей фазе) (5)
