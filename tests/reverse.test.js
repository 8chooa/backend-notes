const { test } = require('node:test');
const assert = require('node:assert');

const reverse = require('../utils/for_testing').reverse;
//primer argumento una descripcion, segundo una funcion callback que se ejecuta en caso de prueba
test('reverse of a', () => {
  const result = reverse('a');
  assert.strictEqual(result, 'a');
})

test('reverse of react', () => {
  const result = reverse('react');
  assert.strictEqual(result, 'tcaer');
})

test('revers of saippuakauppias', () => {
  const result = reverse('saippuakauppias');
  assert.strictEqual(result, 'saippuakauppias');
})