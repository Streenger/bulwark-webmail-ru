import { describe, expect, it } from 'vitest';
import { translateAdminText, translateAdminTextPreserving } from '../translate';
import ru from '../ru.json';

describe('перевод панели администратора', () => {
  it('переводит строку по словарю', () => {
    expect(translateAdminText('Dashboard')).toBe('Сводка');
    expect(translateAdminText('  Save   changes ')).toBe('Сохранить изменения');
  });

  it('переводит сообщения со вставленными значениями', () => {
    expect(translateAdminText('5 min ago')).toBe('5 мин. назад');
    expect(translateAdminText('All 3 plugin(s) enabled')).toBe('Включено плагинов: 3');
    expect(translateAdminText('Remove theme "Dark"? This cannot be undone.')).toBe('Удалить тему «Dark»? Это нельзя отменить.');
  });

  it('оставляет неизвестный текст без изменений и сохраняет пробелы', () => {
    expect(translateAdminText('Something unknown')).toBeNull();
    expect(translateAdminTextPreserving('  Cancel ')).toBe('  Отмена ');
    expect(translateAdminTextPreserving('Something unknown')).toBe('Something unknown');
  });

  it('не содержит пустых переводов', () => {
    for (const [key, value] of Object.entries(ru)) {
      expect(value.trim().length, key).toBeGreaterThan(0);
    }
  });
});
