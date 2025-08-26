import { FC } from "react";
import { useState } from "react";
import { Editor } from "@tiptap/react";
import { AiFillCaretDown } from "react-icons/ai";
import { RiDoubleQuotesL } from "react-icons/ri";
import {
  BsTypeStrikethrough,
  BsBraces,
  BsCode,
  BsListOl,
  BsListUl,
  BsTypeBold,
  BsTypeItalic,
  BsTypeUnderline,
  BsImageFill,
} from "react-icons/bs";
import { MdFormatAlignCenter,MdFormatAlignRight,MdFormatAlignLeft } from "react-icons/md";

import Button from "./Button";
import { getFocusedEditor } from "../EditorUtils";
import DropdownOptions from "../../common/DropdownOptions";
import InsertLink from "../Link/InsertLink";
import { linkOption } from "../Link/LinkForm";
import EmbedYoutube from "./EmbedYoutube";
import FindReplace from "../FindReplace";
import FileAttachment from "../FileAttachment";

interface Props {
  editor: Editor | null;
  onOpenImageClick?(): void;
}

const ToolBar: FC<Props> = ({
  editor,
  onOpenImageClick,
}): JSX.Element | null => {
  const [textColor, setTextColor] = useState<string>("#000000");

  const handleTextColorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!editor) return;
    
    const selectedColor = event.target.value;
    setTextColor(selectedColor);
    getFocusedEditor(editor).setColor(selectedColor).run();
  };

  const options = [
    {
      label: "Đoạn văn",
      onClick: () => {
        if (!editor) return;
        getFocusedEditor(editor).setParagraph().run();
      },
    },
    {
      label: "Tiêu đề 1",
      onClick: () => {
        if (!editor) return;
        getFocusedEditor(editor).toggleHeading({ level: 1 }).run();
      },
    },
    {
      label: "Tiêu đề 2",
      onClick: () => {
        if (!editor) return;
        getFocusedEditor(editor).toggleHeading({ level: 2 }).run();
      },
    },
    {
      label: "Tiêu đề 3",
      onClick: () => {
        if (!editor) return;
        getFocusedEditor(editor).toggleHeading({ level: 3 }).run();
      },
    },
  ];

  const getLabel = (): string => {
    if (!editor) return "Đoạn văn";
    
    if (editor.isActive("heading", { level: 1 })) return "Tiêu đề 1";
    if (editor.isActive("heading", { level: 2 })) return "Tiêu đề 2";
    if (editor.isActive("heading", { level: 3 })) return "Tiêu đề 3";

    return "Đoạn văn";
  };

  const handleLinkSubmit = ({ url, openInNewTab }: linkOption) => {
    if (!editor) return;
    
    const { commands } = editor;
    if (openInNewTab) commands.setLink({ href: url, target: "_blank" });
    else commands.setLink({ href: url });
  };

  const handleEmbedYoutube = (url: string) => {
    if (!editor) return;
    
    editor.chain().focus().setYoutubeVideo({ src: url }).run();
  };

  const Head = () => {
    return (
      <div className="flex items-center gap-1 text-gray-700 dark:text-gray-300">
        <span className="text-sm">{getLabel()}</span>
        <AiFillCaretDown size={12} />
      </div>
    );
  };

  // Early return after all hooks
  if (!editor) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 p-2 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
      {/* Text Formatting Group */}
      <div className="flex items-center gap-1 flex-wrap">
        <DropdownOptions options={options} head={<Head />} />
        
        <div className="h-4 w-[1px] bg-gray-300 dark:bg-gray-600 mx-1" />
        
        <Button
          active={editor.isActive("bold")}
          onClick={() => getFocusedEditor(editor).toggleBold().run()}
        >
          <BsTypeBold />
        </Button>

        <Button
          active={editor.isActive("italic")}
          onClick={() => getFocusedEditor(editor).toggleItalic().run()}
        >
          <BsTypeItalic />
        </Button>

        <Button
          active={editor.isActive("underline")}
          onClick={() => getFocusedEditor(editor).toggleUnderline().run()}
        >
          <BsTypeUnderline />
        </Button>

        <Button
          active={editor.isActive("strike")}
          onClick={() => getFocusedEditor(editor).toggleStrike().run()}
        >
          <BsTypeStrikethrough />
        </Button>

        {/* Color Picker */}
        <div className="flex items-center gap-1 ml-1">
          <span className="text-xs text-gray-600 dark:text-gray-400 hidden sm:inline">Màu:</span>
          <input
            type="color"
            value={textColor}
            onChange={handleTextColorChange}
            title="Chọn màu chữ"
            className="w-6 h-6 p-0 border border-gray-300 dark:border-gray-600 rounded cursor-pointer"
          />
        </div>
      </div>

      {/* Alignment Group */}
      <div className="flex items-center gap-1 flex-wrap">
        <div className="h-4 w-[1px] bg-gray-300 dark:bg-gray-600 mx-1" />
        
        <Button
          active={editor.isActive({ textAlign: "left" })}
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
        >
          <MdFormatAlignLeft />
        </Button>

        <Button
          active={editor.isActive({ textAlign: "center" })}
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
        >
          <MdFormatAlignCenter />
        </Button>

        <Button
          active={editor.isActive({ textAlign: "right" })}
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
        >
          <MdFormatAlignRight />
        </Button>
      </div>

      {/* Content Formatting Group */}
      <div className="flex items-center gap-1 flex-wrap">
        <div className="h-4 w-[1px] bg-gray-300 dark:bg-gray-600 mx-1" />
        
        <Button
          active={editor.isActive("blockquote")}
          onClick={() => getFocusedEditor(editor).toggleBlockquote().run()}
        >
          <RiDoubleQuotesL />
        </Button>

        <Button
          active={editor.isActive("code")}
          onClick={() => getFocusedEditor(editor).toggleCode().run()}
        >
          <BsCode />
        </Button>

        <Button
          active={editor.isActive("codeBlock")}
          onClick={() => getFocusedEditor(editor).toggleCodeBlock().run()}
        >
          <BsBraces />
        </Button>

        <InsertLink onSubmit={handleLinkSubmit} />

        <Button
          active={editor.isActive("orderedList")}
          onClick={() => getFocusedEditor(editor).toggleOrderedList().run()}
        >
          <BsListOl />
        </Button>

        <Button
          active={editor.isActive("bulletList")}
          onClick={() => getFocusedEditor(editor).toggleBulletList().run()}
        >
          <BsListUl />
        </Button>
      </div>

      {/* Media & Tools Group */}
      <div className="flex items-center gap-1 flex-wrap">
        <div className="h-4 w-[1px] bg-gray-300 dark:bg-gray-600 mx-1" />
        
        <EmbedYoutube onSubmit={handleEmbedYoutube} />

        <Button onClick={onOpenImageClick}>
          <BsImageFill />
        </Button>

        <FindReplace editor={editor} />
        <FileAttachment editor={editor} />
      </div>
    </div>
  );
};

export default ToolBar;
