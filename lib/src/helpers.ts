import { LabelValues } from 'prom-client';

export function filterLabels(labels: LabelValues<string>): LabelValues<string> {
  return Object.fromEntries(Object.entries(labels).filter(([_label, value]) => value !== undefined && value !== null));
}

export function convertNsToS(seconds: number): number {
  return seconds / 1_000_000_000;
}
