import { Page } from '@playwright/test';
import path from 'path';
import { BASE_API_URL } from './mock-data';

const harsDir = path.resolve(__dirname, 'hars');

/**
 * Блокирует любые запросы к реальному бэкенду, которые не были явно
 * замоканы через routeFromHAR ниже. Гарантирует изоляцию тестов от сети.
 */
export async function blockRealBackend(page: Page) {
  await page.route(`${BASE_API_URL}/**`, (route) => route.abort());
}

/** Подменяет ответ на GET /ingredients данными из HAR-файла. */
export async function mockIngredients(page: Page) {
  await page.routeFromHAR(path.join(harsDir, 'ingredients.har'), {
    url: '**/ingredients',
    update: false
  });
}

/** Подменяет ответ на GET /auth/user данными из HAR-файла. */
export async function mockUser(page: Page) {
  await page.routeFromHAR(path.join(harsDir, 'user.har'), {
    url: '**/auth/user',
    update: false
  });
}

/** Подменяет ответ на POST /orders данными из HAR-файла. */
export async function mockCreateOrder(page: Page) {
  await page.routeFromHAR(path.join(harsDir, 'order.har'), {
    url: '**/orders',
    update: false
  });
}
