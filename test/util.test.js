import { formatURL, combineURL } from '../src/util';

test('format', () => {
  expect(formatURL('/api/:id', { id: 1 })).toBe('/api/1');
  expect(formatURL('/api/:id/save', { id: 1 })).toBe('/api/1/save');
  expect(formatURL('/api/:id/save')).toBe('/api//save');
  expect(formatURL('/api/:id')).toBe('/api/');
});

test('combineURL', () => {
  expect(combineURL('/api')).toBe('/api');
  expect(combineURL('/api', 'do')).toBe('/api.do');
  expect(combineURL('/api', '.do')).toBe('/api.do');
  expect(/^\/api\.do\?_=\d+$/.test(combineURL('/api', '.do', false))).toBe(true);
});
