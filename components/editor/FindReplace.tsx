import { FC, useState, useEffect } from "react";
import { Editor } from "@tiptap/react";
import { BsSearch, BsArrowUp, BsArrowDown, BsX } from "react-icons/bs";
import { BsArrowRepeat } from "react-icons/bs";

interface Props {
  editor: Editor | null;
}

const FindReplace: FC<Props> = ({ editor }): JSX.Element | null => {
  const [showFindReplace, setShowFindReplace] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [replaceTerm, setReplaceTerm] = useState("");
  const [currentMatch, setCurrentMatch] = useState(0);
  const [totalMatches, setTotalMatches] = useState(0);
  const [caseSensitive, setCaseSensitive] = useState(false);
  const [wholeWord, setWholeWord] = useState(false);

  useEffect(() => {
    if (!editor) return;
    
    if (searchTerm) {
      findMatches();
    } else {
      setTotalMatches(0);
      setCurrentMatch(0);
    }
  }, [searchTerm, caseSensitive, wholeWord, editor]);

  const findMatches = () => {
    if (!editor || !searchTerm) return;

    try {
      const content = editor.getText();
      const regex = new RegExp(
        wholeWord ? `\\b${searchTerm}\\b` : searchTerm,
        caseSensitive ? "g" : "gi"
      );
      
      const matches = content.match(regex) || [];
      setTotalMatches(matches.length);
      setCurrentMatch(matches.length > 0 ? 1 : 0);
    } catch (error) {
      console.error("Error in findMatches:", error);
      setTotalMatches(0);
      setCurrentMatch(0);
    }
  };

  const findNext = () => {
    if (!editor || !searchTerm || totalMatches === 0) return;

    try {
      const content = editor.getText();
      const regex = new RegExp(
        wholeWord ? `\\b${searchTerm}\\b` : searchTerm,
        caseSensitive ? "g" : "gi"
      );

      let match;
      let position = editor.state.selection.from;
      let found = false;

      // Search from current position to end
      const textAfter = content.slice(position);
      match = regex.exec(textAfter);
      
      if (match) {
        editor.commands.setTextSelection(position + match.index);
        setCurrentMatch(prev => Math.min(prev + 1, totalMatches));
        found = true;
      } else {
        // Search from beginning
        match = regex.exec(content);
        if (match) {
          editor.commands.setTextSelection(match.index);
          setCurrentMatch(1);
          found = true;
        }
      }

      if (!found) {
        setCurrentMatch(0);
      }
    } catch (error) {
      console.error("Error in findNext:", error);
    }
  };

  const findPrevious = () => {
    if (!editor || !searchTerm || totalMatches === 0) return;

    try {
      const content = editor.getText();
      const regex = new RegExp(
        wholeWord ? `\\b${searchTerm}\\b` : searchTerm,
        caseSensitive ? "g" : "gi"
      );

      let match;
      let position = editor.state.selection.from;
      let found = false;

      // Search backwards from current position
      const textBefore = content.slice(0, position);
      const matches = textBefore.match(regex);
      
      if (matches) {
        const lastMatchIndex = textBefore.lastIndexOf(matches[matches.length - 1]);
        editor.commands.setTextSelection(lastMatchIndex);
        setCurrentMatch(prev => Math.max(prev - 1, 1));
        found = true;
      } else {
        // Search from end
        const allMatches = content.match(regex);
        if (allMatches) {
          const lastMatchIndex = content.lastIndexOf(allMatches[allMatches.length - 1]);
          editor.commands.setTextSelection(lastMatchIndex);
          setCurrentMatch(totalMatches);
          found = true;
        }
      }

      if (!found) {
        setCurrentMatch(0);
      }
    } catch (error) {
      console.error("Error in findPrevious:", error);
    }
  };

  const replace = () => {
    if (!editor || !searchTerm || !replaceTerm) return;

    try {
      const { from, to } = editor.state.selection;
      const selectedText = editor.state.doc.textBetween(from, to);

      const regex = new RegExp(
        wholeWord ? `\\b${searchTerm}\\b` : searchTerm,
        caseSensitive ? "g" : "gi"
      );

      if (regex.test(selectedText)) {
        editor.commands.insertContent(replaceTerm);
        findNext();
      }
    } catch (error) {
      console.error("Error in replace:", error);
    }
  };

  const replaceAll = () => {
    if (!editor || !searchTerm || !replaceTerm) return;

    try {
      const content = editor.getText();
      const regex = new RegExp(
        wholeWord ? `\\b${searchTerm}\\b` : searchTerm,
        caseSensitive ? "g" : "gi"
      );

      const newContent = content.replace(regex, replaceTerm);
      editor.commands.setContent(newContent);
      
      setTotalMatches(0);
      setCurrentMatch(0);
    } catch (error) {
      console.error("Error in replaceAll:", error);
    }
  };

  const closeFindReplace = () => {
    setShowFindReplace(false);
    setSearchTerm("");
    setReplaceTerm("");
    setCurrentMatch(0);
    setTotalMatches(0);
  };

  // Early return after all hooks
  if (!editor) return null;

  if (!showFindReplace) {
    return (
      <button
        onClick={() => setShowFindReplace(true)}
        className="flex items-center gap-1 px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded transition-colors"
        title="Tìm kiếm và Thay thế"
      >
        <BsSearch size={14} />
        <span className="hidden sm:inline">Tìm</span>
      </button>
    );
  }

  return (
    <div className="fixed top-20 right-4 z-50 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg p-4 min-w-[400px]">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Tìm kiếm & Thay thế</h3>
        <button
          onClick={closeFindReplace}
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <BsX size={20} />
        </button>
      </div>

      <div className="space-y-3">
        {/* Search Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Tìm kiếm
          </label>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            placeholder="Nhập từ khóa tìm kiếm..."
          />
        </div>

        {/* Replace Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Thay thế bằng
          </label>
          <input
            type="text"
            value={replaceTerm}
            onChange={(e) => setReplaceTerm(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
            placeholder="Nhập văn bản thay thế..."
          />
        </div>

        {/* Options */}
        <div className="flex items-center space-x-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={caseSensitive}
              onChange={(e) => setCaseSensitive(e.target.checked)}
              className="mr-2"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">Phân biệt chữ hoa/thường</span>
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={wholeWord}
              onChange={(e) => setWholeWord(e.target.checked)}
              className="mr-2"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">Từ hoàn chỉnh</span>
          </label>
        </div>

        {/* Match Info */}
        {totalMatches > 0 && (
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {currentMatch} trong {totalMatches} kết quả
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center space-x-2">
          <button
            onClick={findPrevious}
            disabled={!searchTerm || totalMatches === 0}
            className="px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed rounded transition-colors"
          >
            <BsArrowUp />
          </button>
          <button
            onClick={findNext}
            disabled={!searchTerm || totalMatches === 0}
            className="px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed rounded transition-colors"
          >
            <BsArrowDown />
          </button>
          <button
            onClick={replace}
            disabled={!searchTerm || !replaceTerm}
            className="px-3 py-2 text-sm bg-blue-100 hover:bg-blue-200 disabled:opacity-50 disabled:cursor-not-allowed rounded transition-colors flex items-center space-x-1"
          >
            <BsArrowRepeat />
            <span>Thay thế</span>
          </button>
          <button
            onClick={replaceAll}
            disabled={!searchTerm || !replaceTerm}
            className="px-3 py-2 text-sm bg-red-100 hover:bg-red-200 disabled:opacity-50 disabled:cursor-not-allowed rounded transition-colors"
          >
            Thay thế tất cả
          </button>
        </div>
      </div>
    </div>
  );
};

export default FindReplace;
