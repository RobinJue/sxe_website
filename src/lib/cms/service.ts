import landingContentSource from "$lib/content/landing-content.json";
import legalContentSource from "$lib/content/legal-content.json";
import podcastSettingsSource from "$lib/content/podcast-settings.json";

import {
	mapHomeContent,
	mapLegalContent,
	mapPodcastPageContent,
	mapPodcastSettings
} from "./mappers";
import { getDummyPodcastFeed, getPodcastFeed } from "./podcast-rss";
import type { HomeContent, LegalContent, PodcastFeedResult, PodcastPageContent } from "./types";

type CmsFetch = typeof fetch;

async function resolvePodcastFeed(
	podcastSettings: ReturnType<typeof mapPodcastSettings>,
	cmsFetch: CmsFetch
): Promise<PodcastFeedResult> {
	if (podcastSettingsSource.useDummyEpisodes) {
		return getDummyPodcastFeed(podcastSettingsSource.dummyEpisodes ?? []);
	}

	return getPodcastFeed(podcastSettings.rssUrl, podcastSettings.fallbackCover, cmsFetch);
}

export async function getHomeContent(cmsFetch: CmsFetch = fetch): Promise<HomeContent> {
	const podcastSettings = mapPodcastSettings(podcastSettingsSource);
	const podcastFeed = await resolvePodcastFeed(podcastSettings, cmsFetch);

	return mapHomeContent({
		landing: landingContentSource,
		podcastSettings: podcastSettingsSource,
		podcastFeed
	});
}

export async function getLegalContent(): Promise<LegalContent> {
	return mapLegalContent(legalContentSource);
}

export async function getPodcastPageContent(cmsFetch: CmsFetch = fetch): Promise<PodcastPageContent> {
	const podcastSettings = mapPodcastSettings(podcastSettingsSource);
	const podcastFeed = await resolvePodcastFeed(podcastSettings, cmsFetch);

	return mapPodcastPageContent({
		landing: landingContentSource,
		podcastSettings: podcastSettingsSource,
		podcastFeed
	});
}
