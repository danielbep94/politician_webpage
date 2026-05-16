import { createClient } from "next-sanity";

import { isSanityConfigured, sanityConfig } from "@/lib/sanity/env";

export const sanityClient = isSanityConfigured
  ? createClient({
      projectId: sanityConfig.projectId,
      dataset: sanityConfig.dataset,
      apiVersion: sanityConfig.apiVersion,
      useCdn: false
    })
  : null;

export const sanityWriteClient =
  isSanityConfigured && sanityConfig.writeToken
    ? createClient({
        projectId: sanityConfig.projectId,
        dataset: sanityConfig.dataset,
        apiVersion: sanityConfig.apiVersion,
        token: sanityConfig.writeToken,
        useCdn: false
      })
    : null;
