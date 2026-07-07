jest.mock('uuid', () => ({
  v4: jest.fn(() => 'test-id-123')
}));

import constructorReducer, {
  addIngredient,
  removeIngredient,
  moveIngredient,
  clearConstructor
} from '../constructorSlice';
import { TConstructorIngredient, TIngredient } from '../../../utils/types';

describe('редьюсер слайса burgerConstructor', () => {
  const initialState = {
    bun: null,
    ingredients: []
  };

  const bun: TIngredient = {
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
  };

  const main: TIngredient = {
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
  };

  const sauce: TIngredient = {
    _id: '643d69a5c3f7b9001cfa0942',
    name: 'Соус Spicy-X',
    type: 'sauce',
    proteins: 30,
    fat: 20,
    carbohydrates: 40,
    calories: 30,
    price: 90,
    image: 'https://example.com/sauce.png',
    image_large: 'https://example.com/sauce-large.png',
    image_mobile: 'https://example.com/sauce-mobile.png'
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('должен вернуть начальное состояние при неизвестном экшене', () => {
    const state = constructorReducer(undefined, { type: 'UNKNOWN_ACTION' });
    expect(state).toEqual(initialState);
  });

  test('addIngredient должен добавить булку в поле bun с сгенерированным id', () => {
    const state = constructorReducer(initialState, addIngredient(bun));

    expect(state.bun).toEqual({ ...bun, id: 'test-id-123' });
    expect(state.ingredients).toHaveLength(0);
  });

  test('addIngredient должен заменить булку при повторном добавлении', () => {
    const stateWithBun = {
      bun: { ...bun, id: 'old-id' },
      ingredients: []
    };
    const newBun: TIngredient = { ...bun, _id: 'new-bun-id' };

    const state = constructorReducer(stateWithBun, addIngredient(newBun));

    expect(state.bun).toEqual({ ...newBun, id: 'test-id-123' });
  });

  test('addIngredient должен добавить начинку в конец списка ingredients с сгенерированным id', () => {
    const state = constructorReducer(initialState, addIngredient(main));

    expect(state.bun).toBeNull();
    expect(state.ingredients).toEqual([{ ...main, id: 'test-id-123' }]);
  });

  test('addIngredient должен добавить соус в конец списка ingredients', () => {
    const stateWithMain: TConstructorIngredient[] = [
      { ...main, id: 'main-id' }
    ];
    const stateBefore = { bun: null, ingredients: stateWithMain };

    const state = constructorReducer(stateBefore, addIngredient(sauce));

    expect(state.ingredients).toEqual([
      { ...main, id: 'main-id' },
      { ...sauce, id: 'test-id-123' }
    ]);
  });

  test('removeIngredient должен удалить ингредиент по id', () => {
    const stateBefore = {
      bun: null,
      ingredients: [
        { ...main, id: 'id-1' },
        { ...sauce, id: 'id-2' }
      ]
    };

    const state = constructorReducer(stateBefore, removeIngredient('id-1'));

    expect(state.ingredients).toEqual([{ ...sauce, id: 'id-2' }]);
  });

  test('removeIngredient не должен ничего менять, если id не найден', () => {
    const stateBefore = {
      bun: null,
      ingredients: [{ ...main, id: 'id-1' }]
    };

    const state = constructorReducer(
      stateBefore,
      removeIngredient('несуществующий-id')
    );

    expect(state.ingredients).toEqual(stateBefore.ingredients);
  });

  test('moveIngredient должен переместить ингредиент вниз по списку', () => {
    const stateBefore = {
      bun: null,
      ingredients: [
        { ...main, id: 'id-1' },
        { ...sauce, id: 'id-2' }
      ]
    };

    const state = constructorReducer(
      stateBefore,
      moveIngredient({ fromIndex: 0, toIndex: 1 })
    );

    expect(state.ingredients.map((i) => i.id)).toEqual(['id-2', 'id-1']);
  });

  test('moveIngredient должен переместить ингредиент вверх по списку', () => {
    const stateBefore = {
      bun: null,
      ingredients: [
        { ...main, id: 'id-1' },
        { ...sauce, id: 'id-2' }
      ]
    };

    const state = constructorReducer(
      stateBefore,
      moveIngredient({ fromIndex: 1, toIndex: 0 })
    );

    expect(state.ingredients.map((i) => i.id)).toEqual(['id-2', 'id-1']);
  });

  test('clearConstructor должен очистить булку и список ингредиентов', () => {
    const stateBefore = {
      bun: { ...bun, id: 'id-bun' },
      ingredients: [{ ...main, id: 'id-1' }]
    };

    const state = constructorReducer(stateBefore, clearConstructor());

    expect(state).toEqual(initialState);
  });
});
