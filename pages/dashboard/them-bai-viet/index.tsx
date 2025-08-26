import axios from "axios";
import { NextPage } from "next";
import { useRouter } from "next/router";
import { useState } from "react";
import { toast } from "react-toastify";
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
      toast.success("Bài viết mới đã được tạo thành công!");
      router.push("/dashboard/bai-viet/update/" + data.post.slug);
    } catch (error: any) {
      console.log(error.response.data);
      toast.error("Có lỗi xảy ra khi tạo bài viết mới!");
    }
    setCreating(false);
  };
  return (
    <AdminLayout title="Thêm bài viết mới">
      <div className="add-post-container">
        <div className="add-post-content">
          <Editor onSubmit={handleSubmit} busy={creating} />
        </div>
      </div>
    </AdminLayout>
  );
};

export default Create;
