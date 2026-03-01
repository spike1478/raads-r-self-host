import type { Dataset, Responses, Results, DomainResult } from '../data/dataset.schema';

/**
 * Score a single item given the response index (0-3) and whether it's normative.
 *
 * Response options in order: "Always been me" / "Just recently" / "Used to" / "Not me"
 *
 * Symptom items:  3 / 2 / 1 / 0
 * Normative items: 0 / 1 / 2 / 3  (reversed)
 */
export function scoreItem(responseIndex: number, isNormative: boolean): number {
  return isNormative ? responseIndex : 3 - responseIndex;
}

/**
 * Compute total and per-domain results from all responses.
 */
export function computeResults(responses: Responses, dataset: Dataset): Results {
  const itemMap = new Map(dataset.items.map((item) => [item.id, item]));

  const domains: DomainResult[] = dataset.meta.domains.map((domain) => {
    let score = 0;
    for (const itemId of domain.itemIds) {
      const item = itemMap.get(itemId);
      if (!item) continue;
      const response = responses[itemId];
      if (response === undefined) continue;
      score += scoreItem(response, item.isNormative);
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
