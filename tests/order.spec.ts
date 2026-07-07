import { test, expect } from '@playwright/test';
import {
  blockRealBackend,
  mockIngredients,
  mockUser,
  mockCreateOrder
} from './helpers';
import {
  mockBun,
  mockMain1,
  mockSauce1,
  mockOrderNumber,
  fakeAccessToken,
  fakeRefreshToken
} from './mock-data';

test.describe('Создание заказа', () => {
  test.beforeEach(async ({ page, context, baseURL }) => {
    // фейковые токены авторизации подставляются до загрузки приложения
    await context.addCookies([
      {
        name: 'accessToken',
        value: fakeAccessToken,
        url: baseURL
      }
    ]);
    await page.addInitScript((token) => {
      window.localStorage.setItem('refreshToken', token);
    }, fakeRefreshToken);

    await blockRealBackend(page);
    await mockIngredients(page);
    await mockUser(page);
    await mockCreateOrder(page);

    await page.goto('/');
    await expect(page.getByTestId(`ingredient-${mockBun._id}`)).toBeVisible();
  });

  test.afterEach(async ({ page, context }) => {
    // очищаем фейковые токены после теста
    await context.clearCookies();
    await page.evaluate(() => window.localStorage.removeItem('refreshToken'));
  });

  test('собранный бургер оформляется в заказ с верным номером, конструктор очищается', async ({
    page
  }) => {
    // собираем бургер: булка + начинка + соус
    await page
      .getByTestId(`ingredient-${mockBun._id}`)
      .getByRole('button', { name: 'Добавить' })
      .click();
    await page
      .getByTestId(`ingredient-${mockMain1._id}`)
      .getByRole('button', { name: 'Добавить' })
      .click();
    await page
      .getByTestId(`ingredient-${mockSauce1._id}`)
      .getByRole('button', { name: 'Добавить' })
      .click();

    await expect(page.getByTestId('constructor-bun-top')).toContainText(
      mockBun.name
    );
    await expect(
      page.getByTestId('constructor-ingredients-list')
    ).toContainText(mockMain1.name);

    // оформляем заказ
    await page.getByTestId('order-button').click();

    const modal = page.getByTestId('modal');
    await expect(modal).toBeVisible();
    await expect(page.getByTestId('order-number')).toHaveText(
      String(mockOrderNumber)
    );

    // закрываем модальное окно и проверяем успешность закрытия
    await page.getByTestId('modal-close-button').click();
    await expect(modal).not.toBeVisible();

    // конструктор должен быть очищен от добавленных ингредиентов
    await expect(page.getByTestId('constructor-empty-bun-top')).toBeVisible();
    await expect(
      page.getByTestId('constructor-ingredients-list')
    ).not.toContainText(mockMain1.name);
  });
});
