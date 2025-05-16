import { signOut } from "next-auth/react";
import { useRouter } from "next/router";
import { FC } from "react";
import useDarkMode from "../../../hooks/useDarkMode";
import DropdownOptions, { dropDownOptions } from "../DropdownOptions";
import ProfileHead from "../ProfileHead";

interface Props {}

const AdminSecondaryNav: FC<Props> = (props): JSX.Element => {
  const router = useRouter();
  const { toggleTheme } = useDarkMode();
  const navigateToCreateNewPost = () => router.push("/admin/posts/create");
  const handleLogOut = async () => await signOut();

  const options: dropDownOptions = [
    {
      label: "Thêm bài viết mới",
      onClick: navigateToCreateNewPost,
    },
    {
      label: "Change theme",
      onClick: toggleTheme,
    },
    {
      label: "Đăng xuất",
      onClick: handleLogOut,
    },
  ];

  return (
    <div className="flex items-center justify-between">
      {/* search bar */}
      {/* options / profile head */}
      <DropdownOptions
        head={<ProfileHead nameInitial="TL" />}
        options={options}
      />
    </div>
  );
};

export default AdminSecondaryNav;
