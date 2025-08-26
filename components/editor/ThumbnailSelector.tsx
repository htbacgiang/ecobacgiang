import classNames from "classnames";
import { ChangeEventHandler, FC, useEffect, useState } from "react";
import Image from 'next/image';
interface Props {
  initialValue?: string;
  onChange(file: File): void;
}

const ThumbnailSelector: FC<Props> = ({
  initialValue,
  onChange,
}): JSX.Element => {
  const [selectedThumbnail, setSelectedThumbnail] = useState("");
  const handleChange: ChangeEventHandler<HTMLInputElement> = ({ target }) => {
    const { files } = target;
    if (!files) return;

    const file = files[0];
    setSelectedThumbnail(URL.createObjectURL(file));
    onChange(file);
  };

  useEffect(() => {
    if (typeof initialValue === "string") setSelectedThumbnail(initialValue);
  }, [initialValue]);

  return (
    <div className="thumbnail-container">
      <input
        type="file"
        hidden
        accept="image/jpg, image/png, image/jpeg"
        id="thumbnail"
        onChange={handleChange}
      />
      <label htmlFor="thumbnail">
        {selectedThumbnail ? (
          <div className="thumbnail-section compact">
            <img
              src={selectedThumbnail}
              alt="Thumbnail"
              className="w-full h-full object-cover rounded"
            />
          </div>
        ) : (
          <PosterUI label="Ảnh đại diện" />
        )}
      </label>
    </div>
  );
};

const PosterUI: FC<{ label: string; className?: string }> = ({
  label,
  className,
}) => {
  return (
    <div className={classNames("thumbnail-section", className)}>
      <div className="thumbnail-icon">📷</div>
      <div className="thumbnail-text">{label}</div>
    </div>
  );
};

export default ThumbnailSelector;
