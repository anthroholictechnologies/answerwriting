/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import React, { useState, useEffect, useCallback } from "react";
import { Card, CardContent } from "answerwriting/components/ui/card";
import { Button } from "answerwriting/components/ui/button";
import {
  User,
  ChevronRight,
  BookOpen,
  Clock10Icon,
  RefreshCw,
} from "lucide-react";
import {
  getAllBlogsPaginated,
  Post,
} from "answerwriting/lib/utils/api/blog.api";
import { calculateReadingTime, stripHtmlTags } from "answerwriting/lib/utils";
import Link from "next/link";
import Image from "next/image";
import { cn } from "answerwriting/lib/utils";
import { Skeleton } from "answerwriting/components/ui/skeleton";
import { useCustomToast } from "answerwriting/components/react-common/toast";
import { useAsyncFn } from "react-use";
import { ToastAction } from "answerwriting/components/ui/toast";
import Spinner from "answerwriting/components/react-common/spinner";

const BlogPage = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const toast = useCustomToast();

  // Retry Fetch
  const handleRetry = () => {
    setPage(1);
    getPosts(1, true);
  };

  const [{ loading }, getPosts] = useAsyncFn(
    async (currentPage: number, reset = false) => {
      try {
        const resp = await getAllBlogsPaginated(currentPage);
        const newPosts = resp.data as Post[];
        console.log("======newPosts=======", newPosts);

        if (resp.success) {
          setPosts((prev) => {
            const updatedPosts = reset ? newPosts : [...prev, ...newPosts];
            return [...new Map(updatedPosts.map((p) => [p.slug, p])).values()];
          });

          // Stop fetching if no more posts
          if (newPosts.length === 0) {
            setHasMore(false);
            toast.info({
              title: "No more blogs to load",
              description: "You've reached the end of the blog archive.",
            });
          }
        } else {
          toast.error({
            title: "Uh oh! Something went wrong.",
            description: "There was a problem fetching blogs.",
            action: (
              <ToastAction
                altText="Try again"
                className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg border border-white/20 hover:border-white/30 transition-all backdrop-blur-sm font-medium text-sm"
                onClick={handleRetry}
              >
                Try again
              </ToastAction>
            ),
          });
        }
        return newPosts;
      } catch (err: any) {
        console.error(err);
        toast.error({
          title: "Uh oh! Something went wrong.",
          description: "There was a problem fetching blogs.",
          action: (
            <ToastAction
              altText="Try again"
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg border border-white/20 hover:border-white/30 transition-all backdrop-blur-sm font-medium text-sm"
              onClick={handleRetry}
            >
              Try again
            </ToastAction>
          ),
        });
      }
    },
    [page],
  );

  useEffect(() => {
    let isMounted = true;
    getPosts(page).then((data) => {
      if (!isMounted) return;
      if (data && data.length === 0) setHasMore(false);
    });

    return () => {
      isMounted = false;
    };
  }, [page, getPosts]);

  // Load More Handler
  const handleLoadMore = () => {
    if (!loading && hasMore) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  return (
    <div className="container mx-auto py-4 px-4 md:py-16">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
        {loading && posts.length === 0 ? (
          Array(6)
            .fill(0)
            .map((_, i) => (
              <Skeleton key={i} className="h-64 w-full" />
            ))
        ) : posts.length === 0 ? (
          <div className="col-span-full text-center py-16 h-full">
            <BookOpen className="mx-auto h-16 w-16 text-gray-400 mb-4" />
            <p className="text-xl text-gray-600">No blog posts available</p>
          </div>
        ) : (
          posts.map((post: Post) => (
            <Card
              key={post.slug}
              className="group hover:shadow-xl transition-all duration-300"
            >
              {/* Featured Image */}
              <div className="relative aspect-video overflow-hidden rounded-t-lg">
                <Image
                  src={post.featured_image}
                  alt={post.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  // placeholder="blur"
                  // blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
                />
              </div>

              {/* Card Content */}
              <CardContent className="p-6 space-y-4">
                {/* Metadata */}
                <div className="flex justify-between text-sm text-gray-500">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    {post.author}
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock10Icon className="h-4 w-4" />
                    {calculateReadingTime(post.content)} min read
                  </div>
                </div>

                {/* Title */}
                <Link href={`/blog/${post.slug}`} passHref>
                  <h3 className="text-xl font-bold group-hover:text-blue-600 transition-colors">
                    {post.title}
                  </h3>
                </Link>

                {/* Excerpt */}
                <p
                  dangerouslySetInnerHTML={{ __html: post.excerpt }}
                  className="text-gray-600 line-clamp-2"
                ></p>

                {/* Read More */}
                <Link href={`/blog/${post.slug}`} passHref>
                  <Button variant="outline" className="w-full group mt-4">
                    Read More
                    <ChevronRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Load More Button */}
      {hasMore && (
        <div className="flex justify-center">
          <Button
            onClick={handleLoadMore}
            disabled={loading}
            className={cn(
              "px-8 py-3 text-base group",
              loading && "cursor-not-allowed opacity-50",
            )}
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <RefreshCw className="h-5 w-5 animate-spin" />
                Loading...
              </div>
            ) : (
              <>
                <BookOpen className="mr-2 h-5 w-5" />
                Load More Articles
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
};

export default BlogPage;
