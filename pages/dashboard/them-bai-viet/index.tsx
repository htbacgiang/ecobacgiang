import axios from "axios";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useState } from "react";
import Editor, { FinalPost } from "../../../components/editor";
import AdminLayout from "../../../components/layout/AdminLayout";
import { generateFormData } from "../../../utils/helper";
import Heading from "../../../components/backend/Heading";
interface Props {}

const Create: NextPage<Props> = () => {
  const [creating, setCreating] = useState(false);
  const router = useRouter();

  const handleSubmit = async (post: FinalPost) => {
    setCreating(true);
    try {
      // we have to generate FormData
      const formData = generateFormData(post);

      // submit our post
      const { data } = await axios.post("/api/posts", formData);
      router.push("/dashboard/bai-viet/update/" + data.post.slug);
    } catch (error: any) {
      console.log(error.response.data);
    }
    setCreating(false);
  };

  return (
    <AdminLayout title="Thêm bài viết mới">
      <div className="p-2">
      <Heading title='Thêm bài viết mới'/>
      </div>
      <div className="w-11/12 mx-auto">
        <Editor onSubmit={handleSubmit} busy={creating} />
      </div>
    </AdminLayout>
  );
};

export default Create;
