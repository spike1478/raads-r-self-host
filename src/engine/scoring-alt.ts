import type { Dataset, Responses, Results, DomainResult } from '../data/dataset.schema';

/**
 * Alternative scoring engine using lookup tables for cross-validation.
 * Must produce identical results to the primary engine.
 */

const SYMPTOM_SCORES = [3, 2, 1, 0] as const;
const NORMATIVE_SCORES = [0, 1, 2, 3] as const;

export function scoreItemAlt(responseIndex: number, isNormative: boolean): number {
  const table = isNormative ? NORMATIVE_SCORES : SYMPTOM_SCORES;
  return table[responseIndex];
}

export function computeResultsAlt(responses: Responses, dataset: Dataset): Results {
  const itemMap = new Map(dataset.items.map((item) => [item.id, item]));

  const domains: DomainResult[] = dataset.meta.domains.map((domain) => {
    let score = 0;
    for (const itemId of domain.itemIds) {
      const item = itemMap.get(itemId);
      if (!item) continue;
      const response = responses[itemId];
      if (response === undefined) continue;
      score += scoreItemAlt(response, item.isNormative);
    }
    return {
      key: domain.key,
      label: domain.label,
      score,
      maxScore: domain.maxScore,
      cutoff: domain.cutoff,
      aboveCutoff: score > domain.cutoff,
    };
  });

  const total = domains.reduce((sum, d) => sum + d.score, 0);

  return {
    total,
    totalMax: 240,
    totalCutoff: dataset.meta.totalCutoff,
    aboveTotalCutoff: total > dataset.meta.totalCutoff,
    domains,
  };
}
