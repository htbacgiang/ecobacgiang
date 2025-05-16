import axios from "axios";
import {
  GetServerSideProps,
  InferGetServerSidePropsType,
  NextPage,
} from "next";
import { useState } from "react";
import Editor, { FinalPost } from "../../../../components/editor";
import AdminLayout from "../../../../components/layout/AdminLayout";
import db from "../../../../utils/db";
import Post from "../../../../models/Post";
import { generateFormData } from "../../../../utils/helper";
import toast from "react-hot-toast";

interface PostResponse extends FinalPost {
  id: string;
}

type Props = InferGetServerSidePropsType<typeof getServerSideProps>;

const Update: NextPage<Props> = ({ post }) => {
  const [updating, setUpdating] = useState(false);

  // Debug props to confirm values
  console.log("Update page props:", { post, btnTitle: "Cập nhật" });

  const handleSubmit = async (post: FinalPost) => {
    setUpdating(true);
    try {
      const formData = generateFormData(post);
      const { data } = await axios.patch(`/api/posts/${post.id}`, formData);
      console.log("Update response:", data);
      toast.success("Cập nhật bài viết thành công!");
    } catch (error: any) {
      console.error("Update error:", error.response?.data);
      toast.error(error.response?.data?.message || "Cập nhật bài viết thất bại");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <AdminLayout title="Cập nhật bài viết">
      <div className="max-w-10/12 mx-auto">
        <Editor
          initialValue={post}
          onSubmit={handleSubmit}
          busy={updating}
          btnTitle="Cập nhật"
        />
      </div>
    </AdminLayout>
  );
};

interface ServerSideResponse {
  post: PostResponse;
}

export const getServerSideProps: GetServerSideProps<ServerSideResponse> = async (
  context
) => {
  try {
    const slug = context.query.slug as string;

    await db.connectDb();
    const post = await Post.findOne({ slug });
    if (!post) return { notFound: true };

    const { _id, meta, title, content, thumbnail, tags, category } = post;

    return {
      props: {
        post: {
          id: _id.toString(),
          title,
          content,
          tags: tags.join(", "),
          thumbnail: thumbnail?.url || "",
          slug,
          category,
          meta,
        },
      },
    };
  } catch (error) {
    console.error("getServerSideProps error:", error);
    return { notFound: true };
  } finally {
    await db.disconnectDb();
  }
};

export default Update;