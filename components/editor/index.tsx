import { ChangeEventHandler, FC, useEffect, useState, useCallback } from "react";
import { useEditor, EditorContent, getMarkRange, Range } from "@tiptap/react";

import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Placeholder from "@tiptap/extension-placeholder";
import Link from "@tiptap/extension-link";
import Youtube from "@tiptap/extension-youtube";
import TipTapImage from "@tiptap/extension-image";
import TextStyle from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import TextAlign from "@tiptap/extension-text-align";

import ToolBar from "./ToolBar";
import EditLink from "./Link/EditLink";
import GalleryModal, { ImageSelectionResult } from "./GalleryModal";
import axios from "axios";
import SEOForm, { SeoResult } from "./SeoForm";
import ActionButton from "../common/ActionButton";
import ThumbnailSelector from "./ThumbnailSelector";
import WordCount from "./WordCount";
import { toast } from "react-toastify";

export interface FinalPost extends SeoResult {
  id?: string;
  title: string;
  content: string;
  thumbnail?: File | string;
  focusKeyword: string;
  isDraft?: boolean;
}

interface Props {
  initialValue?: FinalPost;
  btnTitle?: string;
  busy?: boolean;
  onSubmit(post: FinalPost): void;
}

const Editor: FC<Props> = ({
  initialValue,
  btnTitle = "Đăng bài",
  busy = false,
  onSubmit,
}): JSX.Element => {
  const [selectionRange, setSelectionRange] = useState<Range>();
  const [showGallery, setShowGallery] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [savingDraft, setSavingDraft] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [isDraft, setIsDraft] = useState(true); // Mặc định là nháp khi tạo mới
  const [images, setImages] = useState<{ src: string; altText?: string; id?: string }[]>([]);
  const [seoInitialValue, setSeoInitialValue] = useState<SeoResult>();
  const [post, setPost] = useState<FinalPost>({
    title: "",
    content: "",
    meta: "",
    tags: "",
    slug: "",
    category:"",
    focusKeyword: "",
  });

  // Kiểm tra xem có phải đang tạo bài viết mới không
  const isCreatingNewPost = !initialValue?.id;
  
  // Debug để kiểm tra giá trị
  console.log("Editor debug:", { 
    initialValue, 
    hasId: !!initialValue?.id, 
    isCreatingNewPost,
    btnTitle 
  });

  const fetchImages = async () => {
    const { data } = await axios("/api/image");
    setImages(data.images);
  };

  const handleImageUpload = async (imageData: File | { file: File; altText: string }) => {
    setUploading(true);
    const formData = new FormData();
    
    // Kiểm tra xem có phải là object chứa file và altText không
    if (typeof imageData === 'object' && 'file' in imageData && 'altText' in imageData) {
      formData.append("image", imageData.file);
      formData.append("altText", imageData.altText);
    } else {
      // Fallback cho trường hợp chỉ có file
      formData.append("image", imageData as File);
      formData.append("altText", "");
    }
    
    const { data } = await axios.post("/api/image", formData);
    setUploading(false);

    setImages([data, ...images]);
  };

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextStyle,
      Color,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Link.configure({
        autolink: false,
        linkOnPaste: false,
        openOnClick: false,
        HTMLAttributes: {
          target: "",
        },
      }),
      Placeholder.configure({
        placeholder: "Viết bài nhớ chuẩn SEO",
      }),
      Youtube.configure({
        HTMLAttributes: {
          class: "w-full aspect-video",
        },
      }),
      TipTapImage.configure({
        HTMLAttributes: {
          class: "mx-auto",
        },
      }),
    ],
    
    editorProps: {
      handleClick(view, pos, event) {
        const { state } = view;
        const selectionRange = getMarkRange(
          state.doc.resolve(pos),
          state.schema.marks.link
        );
        if (selectionRange) setSelectionRange(selectionRange);
      },
      attributes: {
        class:
          "blog prose prose-lg focus:outline-none dark:prose-invert max-w-full mx-auto h-full",
      },
    },
  });

  const handleImageSelection = (result: ImageSelectionResult) => {
    editor
      ?.chain()
        .focus()
        .setImage({ src: result.src, alt: result.altText })
        .run();
    };

    const handleSubmit = () => {
      if (!editor) return;
      onSubmit({ ...post, content: editor.getHTML() });
    };

    const saveDraft = useCallback(async () => {
      if (!editor || !isCreatingNewPost) return;
      
      setSavingDraft(true);
      try {
        const formData = new FormData();
        formData.append("title", post.title || "Nháp bài viết");
        formData.append("content", editor.getHTML());
        formData.append("meta", post.meta || "");
        formData.append("slug", post.slug || `draft-${Date.now()}`);
        formData.append("category", post.category || "");
        
        // Xử lý tags an toàn hơn
        let tagsArray: string[] = [];
        if (post.tags) {
          if (typeof post.tags === 'string') {
            tagsArray = post.tags.split(',').filter((tag: string) => tag.trim() !== '');
          } else if (Array.isArray(post.tags)) {
            tagsArray = (post.tags as any[]).filter((tag: any) => typeof tag === 'string');
          }
        }
        // Đảm bảo luôn gửi một mảng hợp lệ
        formData.append("tags", JSON.stringify(tagsArray || []));
        
        if (post.id) {
          formData.append("postId", post.id);
        }
        
        if (post.thumbnail instanceof File) {
          formData.append("thumbnail", post.thumbnail);
        }

        const { data } = await axios.post("/api/posts/draft", formData);
        
        // Cập nhật post ID nếu là nháp mới
        if (!post.id && data.post._id) {
          setPost(prev => ({ ...prev, id: data.post._id }));
          setIsDraft(true); // Đảm bảo trạng thái là nháp
        }
        
        // Toast thành công
        toast.success("Nháp bài viết đã được lưu thành công!");
      } catch (error) {
        console.error("Lỗi lưu nháp:", error);
        toast.error("Có lỗi xảy ra khi lưu nháp bài viết!");
      } finally {
        setSavingDraft(false);
      }
    }, [editor, post, isCreatingNewPost]);

    const publishDraft = useCallback(async () => {
      if (!post.id) {
        return;
      }
      
      setPublishing(true);
      try {
        const { data } = await axios.put("/api/posts/draft", {
          postId: post.id,
          isDraft: false
        });
        
        // Cập nhật trạng thái local
        setIsDraft(false);
        
        // Toast thành công
        toast.success("Bài viết đã được công khai thành công!");
        
        // Chuyển hướng sau khi hiển thị toast
        setTimeout(() => {
          window.location.href = "/dashboard/bai-viet";
        }, 1500);
      } catch (error: any) {
        console.error("Lỗi công khai bài viết:", error);
        toast.error("Có lỗi xảy ra khi công khai bài viết!");
      } finally {
        setPublishing(false);
      }
    }, [post.id]);

    // Tự động lưu nháp mỗi 30 giây chỉ khi tạo bài viết mới
    useEffect(() => {
      if (!isCreatingNewPost) return;
      
      const autoSaveInterval = setInterval(() => {
        if (editor && (post.title || editor.getHTML().trim())) {
          saveDraft();
        }
      }, 30000);

      return () => clearInterval(autoSaveInterval);
    }, [saveDraft, editor, post.title, isCreatingNewPost]);





    const updateTitle: ChangeEventHandler<HTMLInputElement> = ({ target }) =>
      setPost({ ...post, title: target.value });

    const updateSeoValue = (result: SeoResult) => setPost({ ...post, ...result });

    const updateThumbnail = (file: File) => setPost({ ...post, thumbnail: file });

    useEffect(() => {
      if (editor && selectionRange) {
        editor.commands.setTextSelection(selectionRange);
      }
    }, [editor, selectionRange]);

    useEffect(() => {
      fetchImages();
    }, []);

    useEffect(() => {
      if (initialValue) {
        setPost({ ...initialValue });
        editor?.commands.setContent(initialValue.content);

        const { meta, slug, tags, category, focusKeyword } = initialValue;
        setSeoInitialValue({ meta, slug, tags, category, focusKeyword });
        
        // Cập nhật trạng thái nháp từ initialValue
        setIsDraft(initialValue.isDraft !== false); // Mặc định là true nếu không có giá trị
      }
    }, [initialValue, editor]);

      return (
      <>
        <div className="editor-container">
          {/* Fixed Header Section - Luôn ở vị trí cố định trên đầu */}
          <div className="fixed-header">
            {/* Top Controls Row */}
            <div className="header-top-row">
              <ThumbnailSelector
                initialValue={post.thumbnail as string}
                onChange={updateThumbnail}
              />
              <div className="editor-button-container">
                {/* Draft save button - chỉ hiển thị khi tạo bài viết mới */}
                {isCreatingNewPost && (
                  <button
                    onClick={saveDraft}
                    disabled={savingDraft}
                    className={`editor-button save-draft ${savingDraft ? 'loading' : ''}`}
                  >
                    {savingDraft ? (
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                      </svg>
                    )}
                    {savingDraft ? "Đang lưu..." : "Lưu nháp"}
                  </button>
                )}
                
                {/* Publish draft button - chỉ hiển thị khi tạo bài viết mới, có post.id và bài viết là nháp */}
                  {isCreatingNewPost && post.id && isDraft && (
                    <button
                      onClick={publishDraft}
                      disabled={publishing}
                      className={`editor-button publish ${publishing ? 'loading' : ''}`}
                    >
                      {publishing ? (
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      ) : (
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      )}
                      {publishing ? "Đang công khai..." : "Công khai"}
                    </button>
                  )}
                
                <button
                  onClick={handleSubmit}
                  disabled={busy}
                  className={`editor-button submit ${busy ? 'loading' : ''}`}
                >
                  {busy ? (
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  )}
                  {busy ? "Đang đăng..." : btnTitle}
                </button>
              </div>
            </div>
            
            {/* Title Input */}
            <div className="title-section">
              <input
                type="text"
                className="post-title-input w-full"
                placeholder="Tiêu đề bài viết"
                onChange={updateTitle}
                value={post.title}
              />
            </div>
            
            {/* ToolBar - Luôn ở vị trí cố định */}
            <ToolBar
              editor={editor}
              onOpenImageClick={() => setShowGallery(true)}
            />
          </div>
          
          {/* Content Section - Mở rộng xuống dưới */}
          <div className="content-section">
            {editor ? <EditLink editor={editor} /> : null}
            <div className="editor-content">
              <EditorContent editor={editor} className="min-h-[300px]" />
            </div>
            
            {/* Word Count & Reading Time */}
            <div className="my-3">
              <WordCount editor={editor} />
            </div>
            
            <div className="h-[1px] w-full bg-secondary-dark dark:bg-secondary-light my-3" />
            
            {/* SEO Form Section */}
            <div className="seo-form-section">
              <SEOForm
                onChange={updateSeoValue}
                title={post.title}
                editor={editor}
                initialValue={seoInitialValue}
              />
            </div>
          </div>
        </div>

        <GalleryModal
          visible={showGallery}
          onClose={() => setShowGallery(false)}
          onSelect={handleImageSelection}
          images={images}
          onFileSelect={handleImageUpload}
          uploading={uploading}
        />

      </>
    );
  };

  export default Editor;
