import i18n from '@/plugins/i18n';
import en from '@/locale/en-US';

describe('i18n', () => {
  it('Can translate', async () => {
    i18n.addLocale({
      ...en,
      resource: {
        hi: 'Hi, {name}',
        weekday: 'Today is {date[6]}',
        weekday2: 'Today is {date.5}',
        validation: {
          dupplicated: '{field} is invalid.'
        }
      },
      localize: {
        name: 'Jo',
        date: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
      }
    });

    expect(i18n.translate('hi')).toBe('Hi, Jo');
    expect(i18n.translate('weekday')).toBe('Today is Sunday');
    expect(i18n.translate('weekday2')).toBe('Today is Saturday');
    expect(
      i18n.translate('validation.dupplicated', {
        field: 'email'
      })
    ).toBe('email is invalid.');
    expect(
      i18n.translate('validation[dupplicated]', {
        field: 'email'
      })
    ).toBe('email is invalid.');
  });

  it('Can switch locale', async () => {
    i18n.addLocale({
      code: 'fr-ca',
      resource: {
        hi: 'Bonjour, {name}'
      },
      localize: {
        name: 'Jo'
      }
    });

    i18n.switchLocale('fr-ca');

    expect(i18n.translate('hi')).toBe('Bonjour, Jo');
  });
});
