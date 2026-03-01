import { scoreItem, computeResults } from '../engine/scoring';
import { scoreItemAlt, computeResultsAlt } from '../engine/scoring-alt';
import dataset from '../data/dataset.json';
import type { Dataset, Responses } from '../data/dataset.schema';

const ds = dataset as Dataset;

/** Build a Responses object where every item gets the same response index. */
function uniformResponses(index: 0 | 1 | 2 | 3): Responses {
  const responses: Responses = {};
  for (const item of ds.items) {
    responses[item.id] = index;
  }
  return responses;
}

describe('scoreItem', () => {
  describe('symptom items (isNormative = false)', () => {
    it('index 0 ("True now and when I was young") scores 3', () => {
      expect(scoreItem(0, false)).toBe(3);
    });

    it('index 1 ("True only now") scores 2', () => {
      expect(scoreItem(1, false)).toBe(2);
    });

    it('index 2 ("True only when I was younger than 16") scores 1', () => {
      expect(scoreItem(2, false)).toBe(1);
    });

    it('index 3 ("Never true") scores 0', () => {
      expect(scoreItem(3, false)).toBe(0);
    });
  });

  describe('normative items (isNormative = true)', () => {
    it('index 0 ("True now and when I was young") scores 0', () => {
      expect(scoreItem(0, true)).toBe(0);
    });

    it('index 1 ("True only now") scores 1', () => {
      expect(scoreItem(1, true)).toBe(1);
    });

    it('index 2 ("True only when I was younger than 16") scores 2', () => {
      expect(scoreItem(2, true)).toBe(2);
    });

    it('index 3 ("Never true") scores 3', () => {
      expect(scoreItem(3, true)).toBe(3);
    });
  });
});

describe('scoreItemAlt', () => {
  describe('symptom items (isNormative = false)', () => {
    it('index 0 scores 3', () => {
      expect(scoreItemAlt(0, false)).toBe(3);
    });

    it('index 1 scores 2', () => {
      expect(scoreItemAlt(1, false)).toBe(2);
    });

    it('index 2 scores 1', () => {
      expect(scoreItemAlt(2, false)).toBe(1);
    });

    it('index 3 scores 0', () => {
      expect(scoreItemAlt(3, false)).toBe(0);
    });
  });

  describe('normative items (isNormative = true)', () => {
    it('index 0 scores 0', () => {
      expect(scoreItemAlt(0, true)).toBe(0);
    });

    it('index 1 scores 1', () => {
      expect(scoreItemAlt(1, true)).toBe(1);
    });

    it('index 2 scores 2', () => {
      expect(scoreItemAlt(2, true)).toBe(2);
    });

    it('index 3 scores 3', () => {
      expect(scoreItemAlt(3, true)).toBe(3);
    });
  });
});

describe('scoreItem and scoreItemAlt agree', () => {
  it('produces identical scores for all response/normative combinations', () => {
    for (const isNormative of [true, false]) {
      for (const index of [0, 1, 2, 3]) {
        expect(scoreItem(index, isNormative)).toBe(scoreItemAlt(index, isNormative));
      }
    }
  });
});

describe('computeResults golden vectors', () => {
  describe('all index 0 ("True now and when I was young")', () => {
    const results = computeResults(uniformResponses(0), ds);

    it('total = 189', () => {
      expect(results.total).toBe(189);
    });

    it('social = 75', () => {
      const social = results.domains.find((d) => d.key === 'social')!;
      expect(social.score).toBe(75);
    });

    it('interests = 42', () => {
      const interests = results.domains.find((d) => d.key === 'interests')!;
      expect(interests.score).toBe(42);
    });

    it('language = 18', () => {
      const language = results.domains.find((d) => d.key === 'language')!;
      expect(language.score).toBe(18);
    });

    it('sensory = 54', () => {
      const sensory = results.domains.find((d) => d.key === 'sensory')!;
      expect(sensory.score).toBe(54);
    });

    it('is above total cutoff', () => {
      expect(results.aboveTotalCutoff).toBe(true);
    });
  });

  describe('all index 3 ("Never true")', () => {
    const results = computeResults(uniformResponses(3), ds);

    it('total = 51', () => {
      expect(results.total).toBe(51);
    });

    it('social = 42', () => {
      const social = results.domains.find((d) => d.key === 'social')!;
      expect(social.score).toBe(42);
    });

    it('interests = 0', () => {
      const interests = results.domains.find((d) => d.key === 'interests')!;
      expect(interests.score).toBe(0);
    });

    it('language = 3', () => {
      const language = results.domains.find((d) => d.key === 'language')!;
      expect(language.score).toBe(3);
    });

    it('sensory = 6', () => {
      const sensory = results.domains.find((d) => d.key === 'sensory')!;
      expect(sensory.score).toBe(6);
    });

    it('is below total cutoff', () => {
      expect(results.aboveTotalCutoff).toBe(false);
    });
  });

  describe('all index 1 ("True only now")', () => {
    const results = computeResults(uniformResponses(1), ds);

    it('total = 143', () => {
      expect(results.total).toBe(143);
    });
  });

  describe('all index 2 ("True only when I was younger than 16")', () => {
    const results = computeResults(uniformResponses(2), ds);

    it('total = 97', () => {
      expect(results.total).toBe(97);
    });
  });
});

describe('computeResults metadata', () => {
  const results = computeResults(uniformResponses(0), ds);

  it('totalMax is 240', () => {
    expect(results.totalMax).toBe(240);
  });

  it('totalCutoff matches dataset', () => {
    expect(results.totalCutoff).toBe(65);
  });

  it('domain maxScores match dataset', () => {
    for (const domain of ds.meta.domains) {
      const result = results.domains.find((d) => d.key === domain.key)!;
      expect(result.maxScore).toBe(domain.maxScore);
    }
  });

  it('domain cutoffs match dataset', () => {
    for (const domain of ds.meta.domains) {
      const result = results.domains.find((d) => d.key === domain.key)!;
      expect(result.cutoff).toBe(domain.cutoff);
    }
  });
});

describe('cutoff boundary tests', () => {
  it('score equal to totalCutoff is NOT above cutoff (uses strict >)', () => {
    // Build responses that produce exactly 65
    // All index 3 gives 51. We need 14 more points.
    // Change some symptom items from index 3 (score 0) to index 1 (score 2) -> +2 each
    // Need 7 symptom item flips: 7 * 2 = 14, total = 51 + 14 = 65
    const responses = uniformResponses(3);
    const symptomItems = ds.items.filter((item) => !item.isNormative);
    for (let i = 0; i < 7; i++) {
      responses[symptomItems[i].id] = 1; // score 2 instead of 0 -> +2 each
    }
    const results = computeResults(responses, ds);
    expect(results.total).toBe(65);
    expect(results.aboveTotalCutoff).toBe(false);
  });

  it('score one above totalCutoff IS above cutoff', () => {
    const responses = uniformResponses(3);
    const symptomItems = ds.items.filter((item) => !item.isNormative);
    // 7 flips give 65, need one more point: flip an 8th to index 2 (score 1) -> +1
    for (let i = 0; i < 7; i++) {
      responses[symptomItems[i].id] = 1;
    }
    responses[symptomItems[7].id] = 2; // score 1 instead of 0 -> +1
    const results = computeResults(responses, ds);
    expect(results.total).toBe(66);
    expect(results.aboveTotalCutoff).toBe(true);
  });
});

describe('cross-validation: primary vs alt engine', () => {
  it('all index 0 produces identical results', () => {
    const responses = uniformResponses(0);
    const primary = computeResults(responses, ds);
    const alt = computeResultsAlt(responses, ds);
    expect(primary).toEqual(alt);
  });

  it('all index 1 produces identical results', () => {
    const responses = uniformResponses(1);
    const primary = computeResults(responses, ds);
    const alt = computeResultsAlt(responses, ds);
    expect(primary).toEqual(alt);
  });

  it('all index 2 produces identical results', () => {
    const responses = uniformResponses(2);
    const primary = computeResults(responses, ds);
    const alt = computeResultsAlt(responses, ds);
    expect(primary).toEqual(alt);
  });

  it('all index 3 produces identical results', () => {
    const responses = uniformResponses(3);
    const primary = computeResults(responses, ds);
    const alt = computeResultsAlt(responses, ds);
    expect(primary).toEqual(alt);
  });
});
