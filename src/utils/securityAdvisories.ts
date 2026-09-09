import { getCollection } from 'astro:content';
import type { CollectionEntry } from 'astro:content';
import { fetchPosts } from '~/utils/blog';
import { getPermalink } from '~/utils/permalinks';

export type AdvisorySeverity = CollectionEntry<'securityAdvisory'>['data']['severity'];

export interface SecurityAdvisory {
  version: string;
  date: Date;
  severity: AdvisorySeverity;
  summary: string;
  cves: string[];
  bulletins: { label: string; url: string }[];
  postUrl: string;
}

const NVD_BASE_URL = 'https://nvd.nist.gov/vuln/detail/';

const resolvePostUrl = async (postId: string): Promise<string> => {
  const post = (await fetchPosts()).find((candidate) => candidate.id === postId);
  if (post === undefined) {
    throw new Error(`Security advisory references post "${postId}", which is a draft or not published yet.`);
  }
  return getPermalink(post.permalink, 'post');
};

const toAdvisory = async (entry: CollectionEntry<'securityAdvisory'>): Promise<SecurityAdvisory> => ({
  version: entry.id,
  date: new Date(entry.data.date),
  severity: entry.data.severity,
  summary: entry.data.summary,
  cves: entry.data.cves,
  bulletins: entry.data.bulletins,
  postUrl: await resolvePostUrl(entry.data.post.id),
});

export const getSecurityAdvisories = async (): Promise<SecurityAdvisory[]> => {
  const advisories = await Promise.all((await getCollection('securityAdvisory')).map(toAdvisory));
  return advisories.sort((a, b) => b.date.getTime() - a.date.getTime());
};

export const getLatestSecurityAdvisory = async (): Promise<SecurityAdvisory | null> =>
  (await getSecurityAdvisories())[0] ?? null;

export const getCveUrl = (cve: string): string => `${NVD_BASE_URL}${cve}`;
