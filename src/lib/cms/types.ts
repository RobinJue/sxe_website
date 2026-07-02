export const LANGUAGE_CODES = ["de", "en"] as const;

export type LanguageCode = (typeof LANGUAGE_CODES)[number];

export type LocalizedString = Record<LanguageCode, string>;

export type PodcastLink = {
	label: string;
	url: string;
};

export type PodcastEpisode = {
	id: string;
	title: string;
	description: string;
	date: string;
	url: string;
	audioUrl: string;
	image: string;
	duration: string;
};

export type PodcastFeedStatus = "missing-url" | "ok" | "error" | "empty";

export type PodcastFeedResult = {
	status: PodcastFeedStatus;
	episodes: PodcastEpisode[];
	errorMessage?: string;
};

export type PodcastSettings = {
	rssUrl: string;
	title: LocalizedString;
	kicker: LocalizedString;
	intro: LocalizedString;
	metaTitle: LocalizedString;
	metaDescription: LocalizedString;
	backLinkLabel: LocalizedString;
	listenLabel: LocalizedString;
	searchLabel: LocalizedString;
	searchPlaceholder: LocalizedString;
	latestLabel: LocalizedString;
	recentLabel: LocalizedString;
	noResultsMessage: LocalizedString;
	missingFeedMessage: LocalizedString;
	feedErrorMessage: LocalizedString;
	emptyFeedMessage: LocalizedString;
	newsletterTitle: LocalizedString;
	newsletterLead: LocalizedString;
	newsletterEmailLabel: LocalizedString;
	newsletterEmailPlaceholder: LocalizedString;
	newsletterSubmitLabel: LocalizedString;
	episodeCtaLabel: LocalizedString;
	fallbackCover: string;
	platformLinks: PodcastLink[];
};

export type LandingNavItem = {
	id: string;
	label: LocalizedString;
};

export type LandingHeroStat = {
	value: string;
	label: LocalizedString;
};

export type LandingFeature = {
	icon: string;
	title: LocalizedString;
	text: LocalizedString;
	href?: string;
};

export type InfographicItem = {
	variant?: "career" | "skills" | "cofounder";
	title: LocalizedString;
	teaser: LocalizedString;
	src: string;
	alt: LocalizedString;
	credit: string;
};

export type FaqLink = {
	label: LocalizedString;
	url: string;
};

export type FaqItem = {
	id: string;
	question: LocalizedString;
	answer: LocalizedString;
	links: FaqLink[];
};

export type FaqGroup = {
	title: LocalizedString;
	itemIds: string[];
};

export type ResourceItem = {
	name: string;
	description: LocalizedString;
	url: string;
};

export type ResourceCategory = {
	title: LocalizedString;
	items: ResourceItem[];
};

export type PartnerItem = {
	name: string;
	url: string;
	logo?: string;
};

export type PartnerTier = {
	id: string;
	name: LocalizedString;
	items: PartnerItem[];
	title?: LocalizedString;
	description?: LocalizedString;
};

export type TeamMember = {
	id: string;
	name: string;
	role: LocalizedString;
	linkedinUrl: string;
	photo?: string;
	motivation?: LocalizedString;
};

export type SocialLink = {
	label: string;
	url: string;
};

export type SocialProof = {
	statement: LocalizedString;
	ctaLabel: LocalizedString;
	ctaHref: string;
};

export type Testimonial = {
	quote: LocalizedString;
	author: string;
	title: LocalizedString;
	attribution: LocalizedString;
	photo?: string;
};

export type LandingContent = {
	meta: {
		title: LocalizedString;
		description: LocalizedString;
		ogImage: string;
	};
	brandName: string;
	brandSubtitle: string;
	skipLinkLabel: LocalizedString;
	languageToggleLabel: LocalizedString;
	themeToggleAriaLabel: LocalizedString;
	nav: LandingNavItem[];
	hero: {
		kicker: LocalizedString;
		title: LocalizedString;
		lead: LocalizedString;
		primaryLabel: LocalizedString;
		primaryHref: string;
		secondaryLabel: LocalizedString;
		secondaryHref: string;
		stats: LandingHeroStat[];
	};
	socialProof?: SocialProof;
	testimonial?: Testimonial;
	about: {
		kicker: LocalizedString;
		heroStatement: LocalizedString;
		lead?: LocalizedString;
		story: LocalizedString;
		mission: LocalizedString;
		teamLabel: LocalizedString;
		title?: LocalizedString;
		body?: LocalizedString;
		offerTitle?: LocalizedString;
		features?: LandingFeature[];
		primaryLabel?: LocalizedString;
		primaryHref?: string;
	};
	infographics: {
		kicker: LocalizedString;
		title: LocalizedString;
		items: InfographicItem[];
	};
	podcast: {
		kicker: LocalizedString;
		title: LocalizedString;
		lead: LocalizedString;
		ctaLabel: LocalizedString;
		href: string;
	};
	faq: {
		kicker: LocalizedString;
		title: LocalizedString;
		intro: LocalizedString;
		groups: FaqGroup[];
		items: FaqItem[];
	};
	resources: {
		kicker: LocalizedString;
		title: LocalizedString;
		lead?: LocalizedString;
		categories: ResourceCategory[];
	};
	partners: {
		kicker: LocalizedString;
		title: LocalizedString;
		intro: LocalizedString;
		heroTitle?: LocalizedString;
		heroLead?: LocalizedString;
		heroCtaLabel?: LocalizedString;
		tiers: PartnerTier[];
		ctaTitle: LocalizedString;
		ctaDescription: LocalizedString;
		ctaButtonLabel: LocalizedString;
		comingSoon: LocalizedString;
	};
	contact: {
		kicker: LocalizedString;
		title: LocalizedString;
		lead: LocalizedString;
		newsletterTitle: LocalizedString;
		newsletterLead: LocalizedString;
		newsletterEmailLabel: LocalizedString;
		newsletterEmailPlaceholder: LocalizedString;
		newsletterSubmitLabel: LocalizedString;
		nameLabel: LocalizedString;
		emailLabel: LocalizedString;
		messageLabel: LocalizedString;
		submitLabel: LocalizedString;
		successMessage: LocalizedString;
		emailHref: string;
		emailLabelText: string;
		socialLinks: SocialLink[];
	};
	team: {
		kicker: LocalizedString;
		title: LocalizedString;
		lead: LocalizedString;
		members: TeamMember[];
	};
	footer: {
		description: LocalizedString;
		imprintLabel: LocalizedString;
		privacyLabel: LocalizedString;
		copyright: string;
	};
};

export type HomeContent = {
	landing: LandingContent;
	podcastSettings: PodcastSettings;
	podcastFeed: PodcastFeedResult;
};

export type PodcastPageContent = {
	landing: LandingContent;
	podcastSettings: PodcastSettings;
	podcastFeed: PodcastFeedResult;
};

export type LegalContent = {
	brandName: string;
	pageKicker: string;
	pageTitle: string;
	pageLead: string;
	backLinkLabel: string;
	impressumTitle: string;
	impressumHtml: string;
	websiteCreditLabel: string;
	websiteLinkedInUrl: string;
	datenschutzTitle: string;
	datenschutzHtml: string;
	noticeText: string;
};
