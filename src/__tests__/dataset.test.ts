import dataset from '../data/dataset.json';
import type { Dataset } from '../data/dataset.schema';

const ds = dataset as Dataset;

describe('dataset structural validation', () => {
  it('has exactly 80 items', () => {
    expect(ds.items).toHaveLength(80);
    expect(ds.meta.totalItems).toBe(80);
  });

  it('item IDs are 1-80 with no gaps or duplicates', () => {
    const ids = ds.items.map((item) => item.id).sort((a, b) => a - b);
    const expected = Array.from({ length: 80 }, (_, i) => i + 1);
    expect(ids).toEqual(expected);
  });

  it('every item has required fields', () => {
    for (const item of ds.items) {
      expect(item).toHaveProperty('id');
      expect(item).toHaveProperty('text');
      expect(item).toHaveProperty('isNormative');
      expect(item).toHaveProperty('domain');
      expect(typeof item.id).toBe('number');
      expect(typeof item.text).toBe('string');
      expect(typeof item.isNormative).toBe('boolean');
      expect(typeof item.domain).toBe('string');
    }
  });

  it('response options array has exactly 4 entries', () => {
    expect(ds.meta.responseOptions).toHaveLength(4);
    expect(ds.meta.responseOptions).toEqual([
      'True now and when I was young',
      'True only now',
      'True only when I was younger than 16',
      'Never true',
    ]);
  });

  describe('domain item counts', () => {
    it('social has 39 items', () => {
      const social = ds.meta.domains.find((d) => d.key === 'social')!;
      expect(social.itemIds).toHaveLength(39);
    });

    it('interests has 14 items', () => {
      const interests = ds.meta.domains.find((d) => d.key === 'interests')!;
      expect(interests.itemIds).toHaveLength(14);
    });

    it('language has 7 items', () => {
      const language = ds.meta.domains.find((d) => d.key === 'language')!;
      expect(language.itemIds).toHaveLength(7);
    });

    it('sensory has 20 items', () => {
      const sensory = ds.meta.domains.find((d) => d.key === 'sensory')!;
      expect(sensory.itemIds).toHaveLength(20);
    });

    it('domain item counts sum to 80', () => {
      const total = ds.meta.domains.reduce((sum, d) => sum + d.itemIds.length, 0);
      expect(total).toBe(80);
    });
  });

  it('no item belongs to multiple domains', () => {
    const allDomainItemIds = ds.meta.domains.flatMap((d) => d.itemIds);
    const unique = new Set(allDomainItemIds);
    expect(unique.size).toBe(allDomainItemIds.length);
  });

  it('all domain itemIds reference valid item IDs', () => {
    const validIds = new Set(ds.items.map((item) => item.id));
    for (const domain of ds.meta.domains) {
      for (const itemId of domain.itemIds) {
        expect(validIds.has(itemId)).toBe(true);
      }
    }
  });

  it('item domain field matches the domain it appears in', () => {
    const itemDomainMap = new Map<number, string>();
    for (const domain of ds.meta.domains) {
      for (const itemId of domain.itemIds) {
        itemDomainMap.set(itemId, domain.key);
      }
    }
    for (const item of ds.items) {
      expect(itemDomainMap.get(item.id)).toBe(item.domain);
    }
  });

  describe('normative items', () => {
    it('has exactly 17 normative items', () => {
      const normative = ds.items.filter((item) => item.isNormative);
      expect(normative).toHaveLength(17);
    });

    it('normative item IDs match expected set', () => {
      const expected = [1, 6, 11, 18, 23, 26, 33, 37, 43, 47, 48, 53, 58, 62, 68, 72, 77];
      const actual = ds.items
        .filter((item) => item.isNormative)
        .map((item) => item.id)
        .sort((a, b) => a - b);
      expect(actual).toEqual(expected);
    });

    it('normative items per domain: social=14, interests=0, language=1, sensory=2', () => {
      const normativeByDomain: Record<string, number> = {};
      for (const item of ds.items) {
        if (item.isNormative) {
          normativeByDomain[item.domain] = (normativeByDomain[item.domain] || 0) + 1;
        }
      }
      expect(normativeByDomain['social']).toBe(14);
      expect(normativeByDomain['interests'] ?? 0).toBe(0);
      expect(normativeByDomain['language']).toBe(1);
      expect(normativeByDomain['sensory']).toBe(2);
    });
  });

  describe('max scores and cutoffs', () => {
    it('social maxScore is 117', () => {
      expect(ds.meta.domains.find((d) => d.key === 'social')!.maxScore).toBe(117);
    });

    it('interests maxScore is 42', () => {
      expect(ds.meta.domains.find((d) => d.key === 'interests')!.maxScore).toBe(42);
    });

    it('language maxScore is 21', () => {
      expect(ds.meta.domains.find((d) => d.key === 'language')!.maxScore).toBe(21);
    });

    it('sensory maxScore is 60', () => {
      expect(ds.meta.domains.find((d) => d.key === 'sensory')!.maxScore).toBe(60);
    });

    it('total max score is 240', () => {
      const totalMax = ds.meta.domains.reduce((sum, d) => sum + d.maxScore, 0);
      expect(totalMax).toBe(240);
    });

    it('total cutoff is 65', () => {
      expect(ds.meta.totalCutoff).toBe(65);
    });
  });
});
