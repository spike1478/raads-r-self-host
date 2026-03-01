export interface Domain {
  key: string;
  label: string;
  itemIds: number[];
  maxScore: number;
  cutoff: number;
}

export interface Item {
  id: number;
  text: string;
  isNormative: boolean;
  domain: string;
}

export interface DatasetMeta {
  totalItems: number;
  responseOptions: string[];
  domains: Domain[];
  totalCutoff: number;
}

export interface Dataset {
  meta: DatasetMeta;
  items: Item[];
}

export type Response = 0 | 1 | 2 | 3;
export type Responses = Record<number, Response>;

export interface DomainResult {
  key: string;
  label: string;
  score: number;
  maxScore: number;
  cutoff: number;
  aboveCutoff: boolean;
}

export interface Results {
  total: number;
  totalMax: number;
  totalCutoff: number;
  aboveTotalCutoff: boolean;
  domains: DomainResult[];
}
