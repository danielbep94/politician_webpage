import { activitySchema } from "./activity";
import { activityCategorySchema } from "./objects/activityCategory";
import { blockContentSchema } from "./objects/blockContent";
import { imageWithAltSchema } from "./objects/imageWithAlt";
import { seoSchema } from "./objects/seo";
import { videoEmbedSchema } from "./objects/videoEmbed";
import { candidateSchema } from "./candidate";
import { contactMessageSchema } from "./contactMessage";
import { eventSchema } from "./event";
import { faqSchema } from "./faq";
import { mediaAssetSchema } from "./mediaAsset";
import { postSchema } from "./post";
import { pressReleaseSchema } from "./pressRelease";
import { proposalSchema } from "./proposal";
import { siteSettingsSchema } from "./siteSettings";
import { volunteerLeadSchema } from "./volunteerLead";

export const schemaTypes = [
  imageWithAltSchema,
  videoEmbedSchema,
  activityCategorySchema,
  seoSchema,
  blockContentSchema,
  activitySchema,
  siteSettingsSchema,
  candidateSchema,
  proposalSchema,
  postSchema,
  eventSchema,
  contactMessageSchema,
  pressReleaseSchema,
  mediaAssetSchema,
  faqSchema,
  volunteerLeadSchema
];
