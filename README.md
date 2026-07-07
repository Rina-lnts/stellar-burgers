# Тесты для Stellar Burgers — как применить

Все файлы в этом архиве сохраняют пути **относительно корня репозитория**
`stellar-burgers` (ветка `review`). Просто распакуйте архив поверх рабочей
копии репозитория — новые файлы добавятся, изменённые (`package.json`,
`.gitignore` и несколько UI-компонентов) обновятся.

## Что изменено в существующих файлах и почему

В UI-компонентах (`src/components/ui/**`) добавлены только атрибуты
`data-testid` — логика и разметка не менялись. Это сделано, чтобы Playwright
мог находить элементы стабильно, а не через захэшированные CSS-модули или
текст на русском языке:

- `burger-ingredient.tsx` — `data-testid="ingredient-{_id}"` на `<li>`.
- `modal.tsx` — `data-testid="modal"` и `"modal-close-button"`.
- `modal-overlay.tsx` — `data-testid="modal-overlay"`.
- `ingredient-details.tsx` — `data-testid="ingredient-details-name"`.
- `burger-constructor.tsx` — `constructor-bun-top`, `constructor-bun-bottom`,
  `constructor-empty-bun-top`, `constructor-empty-bun-bottom`,
  `constructor-ingredients-list`, `order-button`.
- `order-details.tsx` — `data-testid="order-number"`.

`package.json`: добавлены `@playwright/test` в devDependencies и скрипты:
```json
"test": "jest",
"test:coverage": "jest --coverage",
"test:e2e": "playwright test",
"test:e2e:ui": "playwright test --ui"
```

## Шаги для запуска

```bash
npm install
npx playwright install        # один раз, скачает браузеры
npm test                      # Jest: редьюсеры ingredients и burgerConstructor
npm run test:coverage         # Jest с покрытием
npm run test:e2e              # Playwright: конструктор, модалки, заказ
```

`playwright.config.ts` сам поднимает dev-сервер (`npm run start` на порту
4000) перед прогоном тестов, поэтому отдельно запускать `npm start` не нужно.

## Структура тестов

- `src/services/slices/__tests__/ingredientsSlice.test.ts` — редьюсер
  `ingredients`: неизвестный экшен, `fetchIngredients.pending/fulfilled/rejected`.
- `src/services/slices/__tests__/constructorSlice.test.ts` — редьюсер
  `burgerConstructor`: неизвестный экшен, `addIngredient` (булка и начинка,
  включая замену булки), `removeIngredient`, `moveIngredient`,
  `clearConstructor`. `uuid` замокан для предсказуемых id.
- `tests/constructor.spec.ts` — добавление булки/начинки в конструктор;
  открытие модального окна ингредиента и проверка, что показаны данные именно
  того ингредиента, по которому кликнули; закрытие по крестику и по оверлею.
- `tests/order.spec.ts` — полный сценарий заказа: фейковые токены авторизации
  подставляются в cookie/localStorage до захода на страницу и удаляются в
  `afterEach`; собирается бургер; клик «Оформить заказ»; проверяется номер
  заказа в открывшемся модальном окне и очистка конструктора; закрытие окна.
- `tests/hars/*.har` — HAR-файлы с моковыми ответами для `GET /ingredients`,
  `GET /auth/user`, `POST /orders`. Подключаются через `page.routeFromHAR`
  (см. `tests/helpers.ts`). Любой незамоканный запрос к реальному бэкенду
  дополнительно блокируется (`blockRealBackend`), чтобы тесты были полностью
  изолированы от сети.
- `scripts/generate-hars.js` — скрипт, которым сгенерированы HAR-файлы
  (запустить `node scripts/generate-hars.js`, если понадобится
  перегенерировать/добавить ингредиенты — не обязателен для CI).

## Что уже проверено в песочнице

- `npm test` — все 15 Jest-тестов проходят.
- `npx tsc --noEmit` — весь проект, включая изменённые файлы, типизируется
  без ошибок.
- `npx webpack --mode=development` — сборка проходит успешно.
- Тестовые файлы Playwright (`tests/*.ts`) прошли отдельную проверку
  `tsc --noEmit` с включённым `--strict`.

Playwright e2e-тесты **не запускались физически** в этой песочнице — сеть
здесь блокирует скачивание браузеров Chromium (`cdn.playwright.dev` не в
allowlist). Логика тестов и HAR-моки построены на основе реального кода
компонентов и слайсов из вашего репозитория (ветка `review`), но перед сдачей
обязательно прогоните `npm run test:e2e` локально и посмотрите
`npx playwright show-report` при необходимости отладки.

## Критические требования чек-листа — как учтены

- Каждый набор тестов обёрнут в `describe` с понятным описанием.
- Каждый `test(...)` содержит описание проверяемого поведения.
- Все тесты на TypeScript.
- HAR-файлы лежат в `tests/hars`.
- Перехват через `page.routeFromHAR` для всех бэкенд-запросов, используемых в
  сценариях (`ingredients`, `auth/user`, `orders`).
- Фейковые токены подставляются в `beforeEach` и очищаются в `afterEach`.
- Редьюсеры протестированы с неизвестным экшеном (`undefined` initial state)
  и со всеми поддерживаемыми экшенами, включая `pending/fulfilled/rejected`.
