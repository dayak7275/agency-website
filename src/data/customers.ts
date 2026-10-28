/**
 * Placeholder customer records used to simulate social proof /
 * customer acquisition metrics in the Hero layer.
 *
 * Self-contained, zero secrets, zero client-side API keys. These are
 * illustrative demo values only — real data must be fetched server-side.
 */
export interface CustomerRecord {
  readonly id: string;
  readonly company: string;
  readonly metric: string;
  readonly value: string | number;
  readonly logoColor: string; // tailwind-ish arbitrary color hint
}

export const CUSTOMER_RECORDS: readonly CustomerRecord[] = [
  {
    id: 'cust-01',
    company: 'Nebula Studio',
    metric: 'Conversion lift',
    value: '+34%',
    logoColor: 'bg-amber-400',
  },
  {
    id: 'cust-02',
    company: 'Vertex Labs',
    metric: 'Page-load speed',
    value: '2.1s',
    logoColor: 'bg-blue-500',
  },
  {
    id: 'cust-03',
    company: 'Aether Commerce',
    metric: 'Retention rate',
    value: '94%',
    logoColor: 'bg-purple-500',
  },
  {
    id: 'cust-04',
    company: 'Prism Data',
    metric: 'Support tickets',
    value: '-62%',
    logoColor: 'bg-emerald-400',
  },
  {
    id: 'cust-05',
    company: 'Monolith AI',
    metric: 'Deploy frequency',
    value: '12x/day',
    logoColor: 'bg-rose-500',
  },
  {
    id: 'cust-06',
    company: 'Orbit Financial',
    metric: 'UX score',
    value: '4.9/5',
    logoColor: 'bg-cyan-400',
  },
] as const;

export const AGENCY_METRICS = {
  projectsDelivered: '412',
  uptime: '99.99%',
  averageRoi: '3.1x',
  yearsExperience: '8',
} as const;
