import { Metadata } from "next";
import tw from "tailwind-styled-components";
import { stripHtmlTags } from "answerwriting/lib/utils";
import { Button } from "answerwriting/components/ui/button";
import Link from "next/link";
import { ApiRoutePaths } from "answerwriting/types/general.types";

const BlogStylesContainer = tw.div`
  [&_ul]:flex
  [&_ul]:flex-col
  [&_ul]:gap-4
  [&_ul]:list-[circle]
  [&_ul]:pl-8
  [&_ul_strong]:text-lg
  [&_ul]:mb-4
  [&_ul]:mt-4

  [&_h2]:md:text-3xl
  [&_h2]:leading-1
  [&_h2]:tracking-tighter
  [&_h2]:md:mb-8
  [&_h2]:md:mt-8
  [&_h2]:text-2xl
  [&_h2]:font-bold

  [&_h3]:md:text-xl
  [&_h3]:leading-1
  [&_h3]:tracking-tighter
  [&_h3]:md:mb-4
  [&_h3]:md:mt-4
  [&_h3]:font-bold

  [&_p]:mt-4
  [&_p]:mb-4

  [&_img]:mt-8
  [&_img]:mb-8

  [&_a]:text-primary-dark

  [&_table]:mt-8
  [&_table]:mb-8
  [&_table]:w-full 
  [&_table]:border-collapse 
  [&_table]:border
  [&_table]:border-gray-300 
  [&_table]:text-left 
  [&_table]:text-sm
  [&_table]:p-4

  [&_th]:px-4 
  [&_th]:py-3 
  [&_th]:border
  [&_th]:border-gray-300 
  [&_th]:text-left
  [&_th]:text-xl

  [&_td]:px-4 
  [&_td]:py-3 
  [&_td]:border
  [&_td]:border-gray-200
  [&_td]:text-lg
`;

const fetchPostBySlug = async (slug: string) => {
  const resp = await fetch(
    `${process.env.HEADLESS_CME_BASE_URI}/wp-json/wp/v2/posts?slug=${slug}`
  );

  const data = await resp.json();

  if (!data || data.length === 0) {
    return null;
  }

  return {
    title: data[0].title.rendered,
    content: data[0].content.rendered,
    author: data[0].author,
    featuredImage: data[0].featured_media_url,
    excerpt: data[0].excerpt.rendered,
    date: data[0].date,
    slug: data[0].slug,
  };
};

// Generate metadata dynamically
export async function generateMetadata({
  params,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  params: any;
}): Promise<Metadata> {
  const post = await fetchPostBySlug(params.slug);

  if (!post) {
    return {
      title: "Post Not Found",
      description: "This blog post does not exist.",
    };
  }

  return {
    title: post.title,
    description: stripHtmlTags(post.excerpt),
  };
}

// Page Component
export default async function BlogPostPage({
  params,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  params: any;
}) {
  const dynamicUrl = (await params).slug;
  const post = await fetchPostBySlug(dynamicUrl);

  if (!post) {
    return (
      <div className="max-w-4xl p-4 lg:p-8 text-center">
        <h1 className="text-3xl text-red-500">Post Not Found</h1>
        <Link href={ApiRoutePaths.PAGE_BLOGS}>
          <Button size={"lg"} className="mt-4">
            Back to Blogs
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl p-4 lg:p-8">
      <h1 className="text-center text-3xl px-2 lg:text-5xl lg:leading-none tracking-tighter bg-gradient-to-r from-primary via-blue-500 to-blue-700 text-transparent bg-clip-text mb-6 lg:mb-8">
        {post.title}
      </h1>
      <BlogStylesContainer>
        <div
          className="table-container"
          dangerouslySetInnerHTML={{
            __html: post.content,
          }}
        />
      </BlogStylesContainer>
      <div className="flex flex-col items-center mt-8">
        <Link href={ApiRoutePaths.PAGE_BLOGS}>
          <Button size={"lg"} className="min-w-48">
            Back
          </Button>
        </Link>
      </div>
    </div>
  );
}
