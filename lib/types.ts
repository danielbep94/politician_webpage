export type SocialLink = {
  label: string;
  href: string;
};

export type SanityReference = {
  _ref: string;
  _type: "reference";
  _weak?: boolean;
};

export type ImageWithAlt = {
  _type?: "imageWithAlt";
  asset?: SanityReference;
  alt: string;
  caption?: string;
  src?: string;
};

export type FileWithAsset = {
  _type?: "file";
  asset?: SanityReference;
  src?: string;
};

export type VideoProvider =
  | "youtube"
  | "vimeo"
  | "facebook"
  | "instagram"
  | "other";

export type VideoEmbed = {
  _type?: "videoEmbed";
  provider: VideoProvider;
  url: string;
  title?: string;
};

export type PortableTextLinkMark = {
  _key?: string;
  _type: "link";
  href: string;
  openInNewTab?: boolean;
};

export type PortableTextSpan = {
  _key?: string;
  _type: "span";
  text: string;
  marks?: string[];
};

export type PortableTextStyle = "normal" | "h2" | "h3" | "blockquote";

export type PortableTextListItem = "bullet" | "number";

export type PortableTextBlock = {
  _key?: string;
  _type: "block";
  style?: PortableTextStyle;
  listItem?: PortableTextListItem;
  level?: number;
  children: PortableTextSpan[];
  markDefs?: PortableTextLinkMark[];
};

export type BlockContentItem =
  | PortableTextBlock
  | (ImageWithAlt & { _key?: string; _type: "imageWithAlt" })
  | (VideoEmbed & { _key?: string; _type: "videoEmbed" });

export type BlockContent = BlockContentItem[];

export type Seo = {
  metaTitle?: string;
  metaDescription?: string;
  ogImage?: ImageWithAlt;
  canonical?: string;
  noindex?: boolean;
};

export type ActivityCategory = {
  _type?: "activityCategory";
  title: string;
  slug: string;
};

export type ActivitySourceEvent = {
  title: string;
  slug: string;
};

export type SiteSettings = {
  title: string;
  description: string;
  url: string;
  locale: string;
  contactEmail: string;
  heroMessage: string;
  heroSubheadline: string;
  defaultOgImage: string;
  defaultOgImageAsset?: ImageWithAlt;
};

export type Candidate = {
  name: string;
  shortName: string;
  role: string;
  location: string;
  headline: string;
  summary: string;
  biography: string[];
  trajectory: string[];
  values: string[];
  vision: string;
  email: string;
  phone: string;
  socialLinks: SocialLink[];
};

export type Proposal = {
  title: string;
  slug: string;
  theme: string;
  summary: string;
  problem: string;
  context: string;
  proposal: string;
  actions: string[];
  expectedImpact: string[];
  citizenCta: string;
  featured?: boolean;
};

export type Post = {
  title: string;
  slug: string;
  excerpt: string;
  body: BlockContent;
  category: string;
  publishedAt: string;
  readingTime: string;
  featured?: boolean;
  coverImage?: ImageWithAlt;
};

export type Event = {
  title: string;
  slug: string;
  type: string;
  summary: string;
  date: string;
  time: string;
  location: string;
  isVirtual: boolean;
  ctaLabel: string;
  ctaHref: string;
};

export type Activity = {
  title: string;
  slug: string;
  excerpt: string;
  body: BlockContent;
  activityDate: string;
  publishedAt: string;
  location: string;
  coverImage: ImageWithAlt;
  gallery: ImageWithAlt[];
  video?: VideoEmbed;
  categories: ActivityCategory[];
  featured?: boolean;
  sourceEvent?: ActivitySourceEvent | null;
  seo?: Seo;
};

export type PressRelease = {
  title: string;
  slug: string;
  excerpt: string;
  publishedAt: string;
  summary: string;
  downloadUrl: string;
  downloadFile?: FileWithAsset;
};

export type MediaAsset = {
  title: string;
  kind: "photo" | "logo" | "document";
  description: string;
  fileUrl: string;
  image?: ImageWithAlt;
  file?: FileWithAsset;
};

export type FAQ = {
  question: string;
  answer: string;
};

export type Priority = {
  title: string;
  description: string;
};

export type ContactTopic = {
  label: string;
  value: string;
};

export type VolunteerArea = {
  label: string;
  value: string;
};

export type AvailabilityOption = {
  label: string;
  value: string;
};
