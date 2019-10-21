const dateUtils = require('../utils/date');

describe('dateUtils suite', () => {
    test('expiration before', () => {
        const today = Date.now();
        const dateBefore3Days = today - 1000 * 60 * 60 * 24 * 3;

        expect(dateUtils.isExpired(today + 3242)).toBe(false);
        expect(dateUtils.isExpired(dateBefore3Days)).toBe(true);
        expect(dateUtils.isExpiredDay(dateBefore3Days)).toBe(true);
        expect(dateUtils.isExpiredDay(dateBefore3Days, 1)).toBe(true);
        expect(dateUtils.isExpiredDay(dateBefore3Days, 10)).toBe(true);
        expect(dateUtils.isExpiredDay(dateBefore3Days, 100)).toBe(true);
        expect(dateUtils.isExpiredDay(dateBefore3Days, -1)).toBe(true);
        expect(dateUtils.isExpiredDay(dateBefore3Days, -2)).toBe(true);
        expect(dateUtils.isExpiredDay(dateBefore3Days, -3)).toBe(true);
        expect(dateUtils.isExpiredDay(dateBefore3Days, -4)).toBe(false);
        
    });

    test('expiration after', () => {
        const today = Date.now();
        const dateAfter3Days = today + 1000 * 60 * 60 * 24 * 3;

        expect(dateUtils.isExpired(dateAfter3Days)).toBe(false);
        expect(dateUtils.isExpiredDay(dateAfter3Days)).toBe(false);
        expect(dateUtils.isExpiredDay(dateAfter3Days, 1)).toBe(false);
        expect(dateUtils.isExpiredDay(dateAfter3Days, 2)).toBe(false);
        expect(dateUtils.isExpiredDay(dateAfter3Days, 3)).toBe(true);
        expect(dateUtils.isExpiredDay(dateAfter3Days, 4)).toBe(true);
    });
});
