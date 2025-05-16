import { FC } from "react";
import { BsCardImage } from "react-icons/bs";
import Image from "./Image";

interface Props {
  images: { src: string }[];
  onSelect(src: string): void;
  uploading?: boolean;
  selectedImage?: string;
}

const Gallery: FC<Props> = ({
  images,
  uploading = false,
  selectedImage = "",
  onSelect,
}): JSX.Element => {
  if (!images || !Array.isArray(images)) {
    return <p className="text-center w-full">Invalid image data</p>;
  }

  return (
    <div className="flex flex-wrap">
      {uploading && images.length === 0 && (
        <div className="basis-1/4 p-2 aspect-square flex flex-col items-center justify-center bg-secondary-light text-primary-dark rounded animate-pulse">
          <BsCardImage size={60} />
          <p>Uploading...</p>
        </div>
      )}

      {images.length === 0 && !uploading && (
        <p className="text-center w-full">Không có hình ảnh nào</p>
      )}

      {uploading && (
        <div className="basis-1/4 p-2 aspect-square flex flex-col items-center justify-center bg-secondary-light text-primary-dark rounded animate-pulse">
          <BsCardImage size={60} />
          <p>Uploading</p>
        </div>
      )}

      {images.map(({ src }) => (
        <div key={src} className="basis-1/4 p-2 gallery">
          <Image
            src={src}
            selected={selectedImage === src}
            onClick={() => onSelect(src)}
            alt="gallery"
          />
        </div>
      ))}
    </div>
  );
};

export default Gallery;
