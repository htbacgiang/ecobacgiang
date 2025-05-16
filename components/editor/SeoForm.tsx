import { ChangeEventHandler, FC, useEffect, useState } from "react";
import classnames from "classnames";
import slugify from "slugify";

// Ánh xạ ký tự tiếng Việt
const vietnameseCharMap: { [key: string]: string } = {
  á: "a",
  à: "a",
  ả: "a",
  ã: "a",
  ạ: "a",
  ă: "a",
  ắ: "a",
  ằ: "a",
  ẳ: "a",
  ẵ: "a",
  ặ: "a",
  â: "a",
  ấ: "a",
  ầ: "a",
  ẩ: "a",
  ẫ: "a",
  ậ: "a",
  é: "e",
  è: "e",
  ẻ: "e",
  ẽ: "e",
  ẹ: "e",
  ê: "e",
  ế: "e",
  ề: "e",
  ể: "e",
  ễ: "e",
  ệ: "e",
  í: "i",
  ì: "i",
  ỉ: "i",
  ĩ: "i",
  ị: "i",
  ó: "o",
  ò: "o",
  ỏ: "o",
  õ: "o",
  ọ: "o",
  ô: "o",
  ố: "o",
  ồ: "o",
  ổ: "o",
  ỗ: "o",
  ộ: "o",
  ơ: "o",
  ớ: "o",
  ờ: "o",
  ở: "o",
  ỡ: "o",
  ợ: "o",
  ú: "u",
  ù: "u",
  ủ: "u",
  ũ: "u",
  ụ: "u",
  ư: "u",
  ứ: "u",
  ừ: "u",
  ử: "u",
  ữ: "u",
  ự: "u",
  ý: "y",
  ỳ: "y",
  ỷ: "y",
  ỹ: "y",
  ỵ: "y",
  đ: "d",
  Á: "A",
  À: "A",
  Ả: "A",
  Ã: "A",
  Ạ: "A",
  Ă: "A",
  Ắ: "A",
  Ằ: "A",
  Ẳ: "A",
  Ẵ: "A",
  Ặ: "A",
  Â: "A",
  Ấ: "A",
  Ầ: "A",
  Ẩ: "A",
  Ẫ: "A",
  Ậ: "A",
  É: "E",
  È: "E",
  Ẻ: "E",
  Ẽ: "E",
  Ẹ: "E",
  Ê: "E",
  Ế: "E",
  Ề: "E",
  Ể: "E",
  Ễ: "E",
  Ệ: "E",
  Í: "I",
  Ì: "I",
  Ỉ: "I",
  Ĩ: "I",
  Ị: "I",
  Ó: "O",
  Ò: "O",
  Ỏ: "O",
  Õ: "O",
  Ọ: "O",
  Ô: "O",
  Ố: "O",
  Ồ: "O",
  Ổ: "O",
  Ỗ: "O",
  Ộ: "O",
  Ơ: "O",
  Ớ: "O",
  Ờ: "O",
  Ở: "O",
  Ỡ: "O",
  Ợ: "O",
  Ú: "U",
  Ù: "U",
  Ủ: "U",
  Ũ: "U",
  Ụ: "U",
  Ư: "U",
  Ứ: "U",
  Ừ: "U",
  Ử: "U",
  Ữ: "U",
  Ự: "U",
  Ý: "Y",
  Ỳ: "Y",
  Ỷ: "Y",
  Ỹ: "Y",
  Ỵ: "Y",
  Đ: "D",
};

// Cấu hình slugify để hỗ trợ tiếng Việt
slugify.extend(vietnameseCharMap);

export interface SeoResult {
  meta: string;
  slug: string;
  tags: string;
  category: string;
}

interface Props {
  initialValue?: SeoResult;
  title?: string;
  onChange(result: SeoResult): void;
}

const commonInput =
  "w-full bg-transparent outline-none border-2 border-secondary-dark focus:border-primary-dark focus:dark:border-primary rounded transition text-dark dark:text-primary p-2";

const SEOForm: FC<Props> = ({
  initialValue,
  title = "",
  onChange,
}): JSX.Element => {
  // Initialize state with all SeoResult fields, including tags
  const [values, setValues] = useState<SeoResult>({
    meta: "",
    slug: "",
    tags: "",
    category: "",
  });

  const handleChange: ChangeEventHandler<
    HTMLTextAreaElement | HTMLInputElement | HTMLSelectElement
  > = ({ target }) => {
    let { name, value } = target;
    if (name === "meta") value = value.substring(0, 200);
    const newValues = { ...values, [name]: value };
    setValues(newValues);
    onChange(newValues);
  };

  useEffect(() => {
    const slug = slugify(title.toLowerCase(), {
      strict: true,
    });
    const newValues = { ...values, slug };
    setValues(newValues);
    onChange(newValues);
  }, [title, onChange]);

  useEffect(() => {
    if (initialValue) {
      setValues({
        meta: initialValue.meta || "",
        slug: slugify(initialValue.slug || "", {
          strict: true,
        }),
        tags: initialValue.tags || "",
        category: initialValue.category || "",
      });
    }
  }, [initialValue]);

  const { meta, slug, category } = values;

  return (
    <div className="space-y-4">
      <h3 className="text-dark dark:text-white text-xl font-semibold">
        Tối ưu SEO
      </h3>
      <label className="block relative">
        <span className="text-sm font-semibold text-primary-dark dark:text-white">
          Danh mục:
        </span>
        <select
          name="category"
          value={category}
          onChange={handleChange}
          className={classnames(commonInput, "mt-2")}
        >
          <option value="" disabled>
            Chọn một danh mục
          </option>
          <option value="Chuyện của Farm">Chuyện của Farm</option>
          <option value="Sống xanh">Sống xanh</option>
          <option value="Tin tức và xu hướng">
            Tin tức và xu hướng thực phẩm hữu cơ
          </option>
          <option value="Công thức nấu ăn">
            Công thức nấu ăn từ thực phẩm hữu cơ
          </option>
        </select>
      </label>
      <Input
        value={slug}
        onChange={handleChange}
        name="slug"
        placeholder="Tối ưu đường dẫn"
        label="Slug: "
      />

      <div className="relative">
        <textarea
          name="meta"
          value={meta}
          onChange={handleChange}
          className={classnames(commonInput, "text-lg h-20 resize-none")}
          placeholder="Meta description 160-200 ký tự thì ok"
        ></textarea>
        <p className="absolute bottom-3 right-3 text-dark dark:text-white text-sm">
          {meta.length}/200
        </p>
      </div>
    </div>
  );
};

const Input: FC<{
  name?: string;
  value?: string;
  placeholder?: string;
  label?: string;
  onChange?: ChangeEventHandler<HTMLInputElement>;
}> = ({ name, value, placeholder, label, onChange }) => {
  return (
    <label className="block relative">
      <span className="absolute top-1/2 -translate-y-1/2 text-sm font-semibold text-primary-dark dark:text-white pl-2">
        {label}
      </span>

      <input
        type="text"
        name={name}
        value={value}
        placeholder={placeholder}
        className={classnames(commonInput, "italic pl-10")}
        onChange={onChange}
      />
    </label>
  );
};

export default SEOForm;