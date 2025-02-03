"use server";
import { ApiResponse, ErrorCodes } from "answerwriting/types/general.types";
import { DateTime } from "luxon";

export interface Post {
  title: string;
  excerpt: string;
  slug: string;
  featured_image: string;
  author: string;
  data: string;
  content: string;
}

export const getAllBlogsPaginated = async (
  page: number,
): Promise<ApiResponse<Post[]>> => {
  try {
    const response = await fetch(
      `${process.env.HEADLESS_CME_BASE_URI}/wp-json/wp/v2/posts?_embed=true&page=${page}&per_page=9`,
    );
    const posts = await response.json();
    console.log(
      "====posts",
      posts[0]._embedded["wp:featuredmedia"][0]["source_url"],
    );

    if (!posts || !posts.length) {
      return {
        success: true,
        data: [],
        message: "No blogs found",
      };
    }

    return {
      success: true,
      message: "Blogs fetched successfully",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data: posts.map((post: any) => {
        return {
          title: post.title.rendered,
          excerpt: post.excerpt.rendered,
          slug: post.slug,
          featured_image: post._embedded["wp:featuredmedia"][0]["source_url"],
          author: post._embedded.author[0].name,
          data: DateTime.fromISO(post.date).toFormat("yyyy-MM-dd"),
          content: post.content.rendered,
        };
      }),
    };
  } catch (err) {
    console.error("=====err", err);
    return {
      errorCode: ErrorCodes.INTERNAL_SERVER_ERROR,
      success: false,
      message: "Failed to load list of blogs",
    };
  }
};
