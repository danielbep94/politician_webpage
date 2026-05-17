import Image from "next/image";
import Link from "next/link";

import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { buttonVariants } from "@/components/ui/Button";
import type { Post } from "@/lib/types";
import { formatDate } from "@/lib/utils";

type NewsCardProps = {
  post: Post;
};

export function NewsCard({ post }: NewsCardProps) {
  return (
    <Card className="flex h-full flex-col overflow-hidden p-0 transition duration-200 hover:-translate-y-1 hover:border-brand/30">
      {post.coverImage?.src ? (
        <div className="aspect-[16/10] overflow-hidden border-b border-line bg-surface-alt">
          <Image
            src={post.coverImage.src}
            alt={post.coverImage.alt}
            width={960}
            height={600}
            sizes="(min-width: 1024px) 30vw, (min-width: 768px) 45vw, 100vw"
            className="h-full w-full object-cover transition duration-300 hover:scale-[1.02]"
          />
        </div>
      ) : null}
      <div className="flex flex-1 flex-col justify-between gap-6 p-5 sm:p-6">
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500">
            <Badge>{post.category}</Badge>
            <span>{formatDate(post.publishedAt)}</span>
            <span>{post.readingTime}</span>
          </div>
          <div className="space-y-3">
            <h3 className="text-xl font-semibold text-foreground sm:text-2xl">
              {post.title}
            </h3>
            <p className="leading-7 text-slate-700">{post.excerpt}</p>
          </div>
        </div>
        <Link
          href={`/noticias/${post.slug}`}
          className={buttonVariants({
            variant: "secondary",
            className: "mt-auto w-full sm:w-fit"
          })}
        >
          Leer nota
        </Link>
      </div>
    </Card>
  );
}

