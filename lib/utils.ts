import formidable from "formidable";
import { ObjectId } from "mongoose";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import Post, { PostModelSchema } from "../models/Post";
// import { authOptions } from "../pages/api/auth/[...nextauth]";
import { CommentResponse, PostDetail, UserProfile } from "../utils/types";
import db from "../utils/db";
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

interface FormidablePromise<T> {
  files: formidable.Files;
  body: T;
}

export const readFile = <T extends object>(
  req: NextApiRequest
): Promise<FormidablePromise<T>> => {
  const form = formidable();
  return new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) reject(err);

      resolve({ files, body: fields as T });
    });
  });
};

export const readPostsFromDb = async (
  limit: number,
  pageNo: number,
  skip?: number
) => {
  if (!limit || limit > 10)
    throw Error("Please use limit under 10 and a valid pageNo");
  const finalSkip = skip || limit * pageNo;
   await db.connectDb();
  const posts = await Post.find()
    .sort({ createdAt: "desc" })
    .select("-content")
    .skip(finalSkip)
    .limit(limit);

  return posts;
};

export const formatPosts = (posts: PostModelSchema[]): PostDetail[] => {
  return posts.map((post) => ({
    id: post._id.toString(),
    title: post.title,
    slug: post.slug,
    category: post.category,
    createdAt: post.createdAt.toString(),
    thumbnail: post.thumbnail?.url || "",
    meta: post.meta,
    tags: post.tags,
  }));
};

const getLikedByOwner = (likes: any[], user: UserProfile) =>
  likes.includes(user.id);

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
