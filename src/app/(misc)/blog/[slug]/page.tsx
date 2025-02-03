/* eslint-disable @typescript-eslint/no-explicit-any */
import { Metadata } from "next";
import tw from "tailwind-styled-components";
import { stripHtmlTags } from "answerwriting/lib/utils";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const BlogStylesContainer = tw.div<any>`
  px-8
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
  [&_h2]:mb-4
  [&_h2]:mt-4
  [&_h2]:md:mb-8
  [&_h2]:md:mt-8
  [&_h2]:text-2xl
  [&_h2]:font-bold

  [&_h3]:md:text-md
  [&_h3]:leading-1
  [&_h3]:tracking-tighter
  [&_h3]:md:mb-2
  [&_h3]:md:mt-2
  [&_h3]:md:mb-4
  [&_h3]:md:mt-4
  [&_h3]:text-xl
  [&_h3]:font-bold

  [&_h4]:md:text-md
  [&_h4]:leading-1
  [&_h4]:tracking-tighter
  [&_h4]:md:mb-2
  [&_h4]:md:mt-2
  [&_h4]:md:mb-4
  [&_h4]:md:mt-4
  [&_h4]:text-xl
  [&_h4]:font-bold

  [&_h5]:md:text-md
  [&_h5]:leading-1
  [&_h5]:tracking-tighter
  [&_h5]:md:mb-2
  [&_h5]:md:mt-2
  [&_h5]:md:mb-4
  [&_h5]:md:mt-4
  [&_h5]:text-md
  [&_h5]:font-bold

  [&_p]:mt-4
  [&_p]:mb-4

  [&_img]:mt-8
  [&_img]:mb-8
  [&_img]:w-full
  [&_img]:max-w-full
  [&_img]:h-auto
  [&_img]:object-cover

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

  [&_thead]:bg-gray-100 
  [&_thead]:text-gray-700 
  [&_thead]:uppercase 
  [&_tbody]:text-xs 
  [&_thead]:font-medium

  [&_tbody]:divide-y 
  [&_tbody]:divide-gray-200

  [&_tr]:hover:bg-gray-50 
  [&_tr]:transition

  [&_th]:px-4 
  [&_th]:py-3 
  [&_th]:border
  [&_th]:border-black-300 
  [&_th]:text-left
  [&_th]:text-xl

  [&_td]:px-4 
  [&_td]:py-3 
  [&_td]:border
  [&_td]:border-black-200
  [&_td]:text-lg
`;

const fetchPostBySlug = async (slug: string) => {
  const resp = await fetch(
    `${process.env.HEADLESS_CME_BASE_URI}/wp-json/wp/v2/posts?slug=${slug}`
  );

  const data = await resp.json();

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

export async function generateMetadata({
  params,
}: {
  params: any;
}): Promise<Metadata> {
  const dynamicParams = await params;
  const post = await fetchPostBySlug(dynamicParams.slug);
  return {
    title: post.title,
    description: stripHtmlTags(post.excerpt),
  };
}

export default async function SingleBlog({ params }: { params: any }) {
  const dynamicParams = await params;
  const post = await fetchPostBySlug(dynamicParams.slug);

  return (
    <div className="max-w-md md:max-w-4xl p-4 lg:p-8">
      <h1 className="text-center text-3xl lg:text-5xl lg:leading-none tracking-tighter bg-gradient-to-r from-primary via-blue-500 to-blue-700 text-transparent bg-clip-text mb-6 lg:mb-8">
        {post.title}
      </h1>
      <BlogStylesContainer>
        <div
          dangerouslySetInnerHTML={{
            __html: post.content,
          }}
        ></div>
      </BlogStylesContainer>
    </div>
  );
}
