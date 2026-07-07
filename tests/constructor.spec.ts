import { test, expect } from '@playwright/test';
import { blockRealBackend, mockIngredients } from './helpers';
import { mockBun, mockMain1 } from './mock-data';

test.describe('Страница конструктора бургера: добавление ингредиентов', () => {
  test.beforeEach(async ({ page }) => {
    await blockRealBackend(page);
    await mockIngredients(page);
    await page.goto('/');
    // ждём, пока список ингредиентов отрисуется из мок-данных
    await expect(page.getByTestId(`ingredient-${mockBun._id}`)).toBeVisible();
  });

  test('добавление булки из списка попадает в конструктор', async ({
    page
  }) => {
    const bunCard = page.getByTestId(`ingredient-${mockBun._id}`);
    await bunCard.getByRole('button', { name: 'Добавить' }).click();

    await expect(page.getByTestId('constructor-bun-top')).toContainText(
      mockBun.name
    );
    await expect(page.getByTestId('constructor-bun-bottom')).toContainText(
      mockBun.name
    );
  });

  test('добавление начинки из списка попадает в конструктор', async ({
    page
  }) => {
    const mainCard = page.getByTestId(`ingredient-${mockMain1._id}`);
    await mainCard.getByRole('button', { name: 'Добавить' }).click();

    await expect(
      page.getByTestId('constructor-ingredients-list')
    ).toContainText(mockMain1.name);
  });
});

test.describe('Страница конструктора бургера: модальное окно ингредиента', () => {
  test.beforeEach(async ({ page }) => {
    await blockRealBackend(page);
    await mockIngredients(page);
    await page.goto('/');
    await expect(page.getByTestId(`ingredient-${mockBun._id}`)).toBeVisible();
  });

  test('клик по ингредиенту открывает модальное окно с данными именно этого ингредиента', async ({
    page
  }) => {
    const bunCard = page.getByTestId(`ingredient-${mockBun._id}`);
    await bunCard.locator('a').click();

    const modal = page.getByTestId('modal');
    await expect(modal).toBeVisible();
    await expect(page.getByTestId('ingredient-details-name')).toHaveText(
      mockBun.name
    );
  });

  test('модальное окно закрывается по клику на крестик', async ({ page }) => {
    const bunCard = page.getByTestId(`ingredient-${mockBun._id}`);
    await bunCard.locator('a').click();

    const modal = page.getByTestId('modal');
    await expect(modal).toBeVisible();

    await page.getByTestId('modal-close-button').click();
    await expect(modal).not.toBeVisible();
  });

  test('модальное окно закрывается по клику на оверлей', async ({ page }) => {
    const mainCard = page.getByTestId(`ingredient-${mockMain1._id}`);
    await mainCard.locator('a').click();

    const modal = page.getByTestId('modal');
    await expect(modal).toBeVisible();

    await page
      .getByTestId('modal-overlay')
      .click({ position: { x: 5, y: 5 } });
  });
});
