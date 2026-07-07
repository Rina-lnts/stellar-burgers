const fs = require('fs');
const path = require('path');

const BASE_URL = 'https://norma.education-services.ru/api';
const outDir = path.resolve(__dirname, '..', 'tests', 'hars');

if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

function buildHar(entries) {
  return {
    log: {
      version: '1.2',
      creator: { name: 'stellar-burgers-tests', version: '1.0' },
      entries: entries.map((entry) => ({
        startedDateTime: '2026-01-01T00:00:00.000Z',
        time: 0,
        request: {
          method: entry.method,
          url: entry.url,
          httpVersion: 'HTTP/1.1',
          cookies: [],
          headers: [],
          queryString: [],
          headersSize: -1,
          bodySize: 0
        },
        response: {
          status: entry.status,
          statusText: entry.status === 200 ? 'OK' : 'Error',
          httpVersion: 'HTTP/1.1',
          cookies: [],
          headers: [{ name: 'content-type', value: 'application/json' }],
          content: {
            size: JSON.stringify(entry.body).length,
            mimeType: 'application/json',
            text: JSON.stringify(entry.body)
          },
          redirectURL: '',
          headersSize: -1,
          bodySize: -1
        },
        cache: {},
        timings: { send: 0, wait: 0, receive: 0 }
      }))
    }
  };
}

// --- моковые ингредиенты ---
const bun = {
  _id: '643d69a5c3f7b9001cfa093c',
  name: 'Флюоресцентная булка R2-D3',
  type: 'bun',
  proteins: 44,
  fat: 26,
  carbohydrates: 85,
  calories: 643,
  price: 988,
  image: 'https://code.s3.yandex.net/react/code/bun-02.png',
  image_large: 'https://code.s3.yandex.net/react/code/bun-02-large.png',
  image_mobile: 'https://code.s3.yandex.net/react/code/bun-02-mobile.png'
};

const main1 = {
  _id: '643d69a5c3f7b9001cfa0941',
  name: 'Биокотлета из марсианской Магнолии',
  type: 'main',
  proteins: 420,
  fat: 142,
  carbohydrates: 242,
  calories: 4242,
  price: 424,
  image: 'https://code.s3.yandex.net/react/code/meat-01.png',
  image_large: 'https://code.s3.yandex.net/react/code/meat-01-large.png',
  image_mobile: 'https://code.s3.yandex.net/react/code/meat-01-mobile.png'
};

const main2 = {
  _id: '643d69a5c3f7b9001cfa0942',
  name: 'Мясо бессмертных моллюсков Protostomia',
  type: 'main',
  proteins: 433,
  fat: 244,
  carbohydrates: 33,
  calories: 420,
  price: 1337,
  image: 'https://code.s3.yandex.net/react/code/meat-03.png',
  image_large: 'https://code.s3.yandex.net/react/code/meat-03-large.png',
  image_mobile: 'https://code.s3.yandex.net/react/code/meat-03-mobile.png'
};

const sauce1 = {
  _id: '643d69a5c3f7b9001cfa0943',
  name: 'Соус Spicy-X',
  type: 'sauce',
  proteins: 30,
  fat: 20,
  carbohydrates: 40,
  calories: 30,
  price: 90,
  image: 'https://code.s3.yandex.net/react/code/sauce-02.png',
  image_large: 'https://code.s3.yandex.net/react/code/sauce-02-large.png',
  image_mobile: 'https://code.s3.yandex.net/react/code/sauce-02-mobile.png'
};

const ingredientsHar = buildHar([
  {
    method: 'GET',
    url: `${BASE_URL}/ingredients`,
    status: 200,
    body: {
      success: true,
      data: [bun, main1, main2, sauce1]
    }
  }
]);

// --- моковые данные пользователя ---
const userHar = buildHar([
  {
    method: 'GET',
    url: `${BASE_URL}/auth/user`,
    status: 200,
    body: {
      success: true,
      user: {
        email: 'test-user@example.com',
        name: 'Test User'
      }
    }
  }
]);

// --- моковые данные создания заказа ---
const orderHar = buildHar([
  {
    method: 'POST',
    url: `${BASE_URL}/orders`,
    status: 200,
    body: {
      success: true,
      name: 'Флюоресцентный люминесцентный бургер',
      order: {
        _id: '6666f0d197e2f001bcf00001',
        status: 'done',
        name: 'Флюоресцентный люминесцентный бургер',
        createdAt: '2026-01-01T00:00:00.000Z',
        updatedAt: '2026-01-01T00:00:05.000Z',
        number: 12345,
        ingredients: [bun._id, main1._id, sauce1._id, bun._id]
      }
    }
  }
]);

fs.writeFileSync(
  path.join(outDir, 'ingredients.har'),
  JSON.stringify(ingredientsHar, null, 2)
);
fs.writeFileSync(path.join(outDir, 'user.har'), JSON.stringify(userHar, null, 2));
fs.writeFileSync(
  path.join(outDir, 'order.har'),
  JSON.stringify(orderHar, null, 2)
);

console.log('HAR files generated in', outDir);
console.log(JSON.stringify({ bun, main1, main2, sauce1 }, null, 2));
