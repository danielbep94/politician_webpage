/**
 * Studio layout — server component.
 *
 * metadata and viewport must live here (not in page.tsx)
 * because page.tsx is a 'use client' component and cannot
 * export server-side metadata in the same file.
 */
export { metadata, viewport } from "next-sanity/studio";

export default function StudioLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return children;
}
