import ingredientsReducer, { fetchIngredients } from '../ingredientsSlice';
import { TIngredient } from '../../../utils/types';

describe('редьюсер слайса ingredients', () => {
  const initialState = {
    ingredients: [],
    isLoading: false,
    error: null
  };

  const mockIngredients: TIngredient[] = [
    {
      _id: '643d69a5c3f7b9001cfa093c',
      name: 'Флюоресцентная булка R2-D3',
      type: 'bun',
      proteins: 44,
      fat: 26,
      carbohydrates: 85,
      calories: 643,
      price: 988,
      image: 'https://example.com/bun.png',
      image_large: 'https://example.com/bun-large.png',
      image_mobile: 'https://example.com/bun-mobile.png'
    },
    {
      _id: '643d69a5c3f7b9001cfa0941',
      name: 'Биокотлета из марсианской Магнолии',
      type: 'main',
      proteins: 420,
      fat: 142,
      carbohydrates: 242,
      calories: 4242,
      price: 424,
      image: 'https://example.com/main.png',
      image_large: 'https://example.com/main-large.png',
      image_mobile: 'https://example.com/main-mobile.png'
    }
  ];

  test('должен вернуть начальное состояние при неизвестном экшене', () => {
    const state = ingredientsReducer(undefined, { type: 'UNKNOWN_ACTION' });
    expect(state).toEqual(initialState);
  });

  test('должен обработать fetchIngredients.pending', () => {
    const stateBefore = {
      ingredients: [],
      isLoading: false,
      error: 'предыдущая ошибка'
    };
    const action = { type: fetchIngredients.pending.type };

    const state = ingredientsReducer(stateBefore, action);

    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  test('должен обработать fetchIngredients.fulfilled и записать список ингредиентов', () => {
    const stateBefore = {
      ingredients: [],
      isLoading: true,
      error: null
    };
    const action = {
      type: fetchIngredients.fulfilled.type,
      payload: mockIngredients
    };

    const state = ingredientsReducer(stateBefore, action);

    expect(state.isLoading).toBe(false);
    expect(state.ingredients).toEqual(mockIngredients);
  });

  test('должен обработать fetchIngredients.rejected и записать текст ошибки', () => {
    const stateBefore = {
      ingredients: [],
      isLoading: true,
      error: null
    };
    const action = {
      type: fetchIngredients.rejected.type,
      error: { message: 'Не удалось загрузить ингредиенты' }
    };

    const state = ingredientsReducer(stateBefore, action);

    expect(state.isLoading).toBe(false);
    expect(state.error).toBe('Не удалось загрузить ингредиенты');
  });

  test('должен обработать fetchIngredients.rejected без сообщения об ошибке значением по умолчанию', () => {
    const stateBefore = {
      ingredients: [],
      isLoading: true,
      error: null
    };
    const action = {
      type: fetchIngredients.rejected.type,
      error: {}
    };

    const state = ingredientsReducer(stateBefore, action);

    expect(state.isLoading).toBe(false);
    expect(state.error).toBe('Ошибка загрузки ингредиентов');
  });
});
