"use client";
import React from "react";
import Image from "next/image";

import Link from "next/link";
// import post1 from "../../../public/images/post-1-min.jpg";
// import post2 from "../../../public/images/post-2-min.jpg";

const storyContent = {
  kstGia: {
    heading: "3. Giá cả và ưu đãi của các loại kệ siêu thị tại Tân Phát",
    p1: "Dòng kệ siêu thị tại Tân Phát không chỉ nổi bật với mức giá phải chăng mà còn được đánh giá cao về tính linh hoạt và hiệu suất. Với khả năng chịu lực tốt, khách hàng có thể yên tâm trưng bày hàng hóa một cách an toàn và tiện lợi. Bên cạnh đó, việc lắp đặt và di chuyển kệ cũng trở nên dễ dàng hơn bao giờ hết, giúp tối ưu hóa không gian trưng bày mà không cần đầu tư quá nhiều công sức.",
    p2: "Để biết thêm thông tin chi tiết và tư vấn cụ thể về các mẫu kệ siêu thị, quý khách vui lòng liên hệ với đội ngũ nhân viên bán hàng tại Tân Phát. Chúng tôi cam kết cung cấp cho quý khách hàng những thông tin chính xác và đáng tin cậy nhất, giúp quý khách có được sự lựa chọn phù hợp nhất với nhu cầu của mình.",
    p3: "Ngoài ra, để giúp quý khách hàng tiết kiệm thời gian và công sức, Tân Phát cung cấp dịch vụ vận chuyển và lắp đặt tận nhà miễn phí. Đội ngũ nhân viên chuyên nghiệp của chúng tôi sẽ đảm bảo rằng quá trình vận chuyển và lắp đặt diễn ra một cách nhanh chóng và hiệu quả, giúp quý khách hàng có được trải nghiệm mua sắm tốt nhất.",
  },
  kstLapdat: {
    heading: "4. Lắp đặt và bảo hành cho kệ siêu thị",
    p1: "Việc lắp đặt kệ siêu thị tại Tân Phát không chỉ đơn giản mà còn dễ dàng thực hiện, nhờ vào hướng dẫn chi tiết đi kèm và tính linh hoạt của sản phẩm. Chúng tôi tự hào là đơn vị có dịch vụ hỗ trợ lắp đặt và bảo trì sau khi bán hàng, mang lại sự an tâm và yên tâm cho khách hàng.",
    p2: "Độ bền cao là một trong những đặc điểm nổi bật của các mẫu kệ siêu thị mà Tân Phát cung cấp. Tất cả các sản phẩm đều được cam kết về độ bền cao và được bảo hành trong 5 năm, giúp khách hàng yên tâm sử dụng mà không cần phải lo lắng về việc kệ có thể bị hỏng hoặc hỏng hóc trong quá trình sử dụng.",
    p3: "Nhờ vào sự cam kết này, khách hàng có thể hoàn toàn tập trung vào việc kinh doanh mà không cần phải lo lắng về vấn đề vận hành của hệ thống lưu trữ hàng hóa. Chúng tôi luôn đặt sự hài lòng của khách hàng lên hàng đầu và cam kết đem lại sản phẩm chất lượng cùng dịch vụ chăm sóc khách hàng tận tình nhất.",
  },
  kstWhy2: {
    heading: "5. Tại sao nên mua kệ siêu thị  tại Giá kệ Tân Phát",
    p1: "Giá kệ Tân Phát là một trong những địa chỉ uy tín và đáng tin cậy khi bạn cần mua kệ siêu thị tôn đục lỗ. Với nhiều năm kinh nghiệm trong lĩnh vực cung cấp các giải pháp lưu trữ hàng hóa, Giá kệ Tân Phát cam kết cung cấp sản phẩm chất lượng, dịch vụ tốt nhất và giá cả cạnh tranh nhất trên thị trường.",
  },
  kstList2: [
    {
      title:
        "1. Chất lượng đảm bảo: Tân Phát cung cấp các sản phẩm chất lượng cao, bền bỉ và đáng tin cậy. Kệ siêu thị lưng lưới được thiết kế và sản xuất với các tiêu chuẩn nghiêm ngặt, đảm bảo sự an toàn cho hàng hóa và người sử dụng.",
    },
    {
      title:
        "2. Đa dạng mẫu mã: Tân Phát cung cấp nhiều mẫu kệ siêu thị lưng lưới với đa dạng về kích thước, màu sắc và kiểu dáng, từ kệ đơn giản đến kệ đa năng, phù hợp với mọi loại cửa hàng và nhu cầu trưng bày sản phẩm.",
    },
    {
      title:
        "3. Dịch vụ chuyên nghiệp: Đội ngũ nhân viên tại Tân Phát có kinh nghiệm và chuyên môn cao trong việc lắp đặt kệ siêu thị lưng lưới. Chúng tôi cam kết cung cấp dịch vụ lắp đặt nhanh chóng, chính xác và chuyên nghiệp, đảm bảo sự hài lòng của khách hàng.",
    },
    {
      title:
        "4. Bảo hành dài hạn: Tân Phát cam kết bảo hành sản phẩm trong thời gian dài, thường là 5 năm, để đảm bảo sự yên tâm và an tâm cho khách hàng.",
    },
    {
      title:
        "5. Giá cả cạnh tranh: Tân Phát cam kết cung cấp giá cả cạnh tranh và hợp lý cho các sản phẩm và dịch vụ của mình, đảm bảo sự hiệu quả kinh doanh và tiết kiệm chi phí cho khách hàng.",
    },
    {
      title:
        "6. Dịch vụ hậu mãi tốt: Sau khi lắp đặt, Tân Phát vẫn sẽ tiếp tục hỗ trợ khách hàng với các dịch vụ hậu mãi như sửa chữa, bảo trì và tư vấn về việc bố trí không gian trưng bày hàng hóa.",
    },
  ],
};

const SEO = ({ className }) => {
  return (
    <section className={`${className}`}>
      <div className="container px-4 mx-auto">
        <div className="lg:flex flex-col mt-5 text-left w-full lg:w-10/12 mx-auto ">
        <h1>
        Giá kệ siêu thị Tân Phát - Uy tín - Chất lượng - Dẫn đầu
        </h1>
          <h2 className="font-bold text-gray-800 text-xl md:text-2xl mt-2 mb-5 dark:text-light dark:text-primary">
            1. Giới thiệu về Giá kệ siêu thị Tân Phát
          </h2>
          <p className="leading-relaxed text-dark dark:text-primary">
            <Link href="/">
              <a className="text-[red]">
                <i> Giá kệ siêu thị Tân Phát</i>
              </a>
            </Link>{" "}
            là thương hiệu hàng đầu trong lĩnh vực sản xuất và cung cấp các loại
            kệ siêu thị, kệ tôn đục lỗ, và kệ kho hàng tại Việt Nam. Với nhà máy
            hiện đại và đội ngũ kỹ thuật lành nghề, sản phẩm của Tân Phát không
            chỉ đảm bảo chất lượng vượt trội mà còn đáp ứng mọi yêu cầu trưng
            bày và lưu trữ của các doanh nghiệp, cửa hàng tạp hóa và siêu thị
            mini.
          </p>
          <h2 className="font-bold text-gray-800 text-xl md:text-2xl mt-2 mb-5 dark:text-light dark:text-primary">
            2. Giá kệ siêu thị Tân Phát: Sự lựa chọn hoàn hảo cho mọi cửa hàng
          </h2>
          <p className="leading-relaxed text-dark dark:text-primary">
            {" "}
            Kệ siêu thị của Tân Phát được thiết kế chuyên dụng cho các cửa hàng
            bán lẻ, siêu thị mini và cửa hàng tạp hóa. Chúng bao gồm 3 loại
            chính:
          </p>
          <p className="leading-relaxed text-dark dark:text-primary ">
            <Link href="/ke-sieu-thi">
              <a className="text-[red]">
                <h3> 2.1 Kệ siêu thị: </h3>
              </a>
            </Link>{" "}
            là loại kệ được thiết kế để trưng bày hàng hóa tại các siêu thị, cửa
            hàng tiện lợi, và cửa hàng tạp hóa. Kệ siêu thị có thiết kế đa dạng,
            từ kệ lưng lưới, kệ tôn đục lỗ đến kệ đơn và kệ đôi. Kệ có kích
            thước linh hoạt với chiều cao từ 120cm đến 210cm, chiều dài từ 70cm
            đến 120cm, phù hợp với mọi không gian trưng bày.
          </p>
          <p className="leading-relaxed text-dark dark:text-primary ">
            <Link href="/ke-v-lo">
              <a className="text-[red]">
                <h3> 2.2 Kệ V lỗ đa năng </h3>
              </a>
            </Link>{" "}
            Đây là loại kệ kho hàng tiện lợi, dễ dàng lắp ráp và di chuyển. Kệ V
            lỗ có khả năng chịu lực tốt, phù hợp để lưu trữ hàng hóa nặng trong
            nhà kho hoặc cửa hàng. Đặc biệt, kệ V lỗ có tính linh hoạt cao, dễ
            dàng điều chỉnh theo nhu cầu sử dụng
          </p>
          <p className="leading-relaxed text-dark dark:text-primary ">
            <Link href="/">
              <a className="text-[red]">
                <h3> 2.3 Kệ tạp hóa </h3>
              </a>
            </Link>{" "}
            Dành riêng cho các cửa hàng tạp hóa, giúp trưng bày các mặt hàng
            thực phẩm, đồ gia dụng một cách khoa học. Kệ tạp hóa có thể chịu tải
            từ 50kg đến 70kg mỗi tầng, đảm bảo an toàn cho hàng hóa.
          </p>
          <b>
            {" "}
            Kệ siêu thị của Tân Phát có các kích thước linh hoạt từ chiều cao
            120cm đến 210cm, chiều dài từ 70cm đến 120cm, phù hợp cho các không
            gian trưng bày khác nhau. Đặc biệt, mỗi tầng kệ có khả năng chịu tải
            lên đến 70kg, đảm bảo an toàn cho việc lưu trữ hàng hóa số lượng
            lớn.
          </b>

          {storyContent.kstGia.heading && (
            <h2 className="font-bold text-gray-800 text-xl md:text-2xl mt-2 mb-2 dark:text-light dark:text-primary ">
              {storyContent.kstGia.heading}
            </h2>
          )}
          {storyContent.kstGia.p1 && (
            <p className="mb-1 dark:text-light dark:text-primary ">
              {storyContent.kstGia.p1}
            </p>
          )}
          {storyContent.kstGia.p2 && (
            <p className="mb-1 dark:text-light dark:text-primary ">
              {storyContent.kstGia.p2}
            </p>
          )}
          {storyContent.kstGia.p3 && (
            <p className="dark:text-light dark:text-primary ">
              {storyContent.kstGia.p3}
            </p>
          )}
          {storyContent.kstLapdat.heading && (
            <h2 className="font-bold text-gray-800 text-xl md:text-2xl mt-2 mb-2 dark:text-light dark:text-primary ">
              {storyContent.kstLapdat.heading}
            </h2>
          )}
          {storyContent.kstLapdat.p1 && (
            <p className="mb-1 dark:text-light dark:text-primary ">
              {storyContent.kstLapdat.p1}
            </p>
          )}
          {storyContent.kstLapdat.p2 && (
            <p className="mb-1 dark:text-light dark:text-primary ">
              {storyContent.kstLapdat.p2}
            </p>
          )}
          {storyContent.kstLapdat.p3 && (
            <b className=" text-gray-800 dark:text-light dark:text-primary ">
              {storyContent.kstLapdat.p3}
            </b>
          )}

          {storyContent.kstWhy2.heading && (
            <h2 className="font-bold text-gray-800 text-xl md:text-2xl mt-2 mb-2 dark:text-light dark:text-primary ">
              {storyContent.kstWhy2.heading}
            </h2>
          )}
          {storyContent.kstWhy2.p1 && (
            <b className=" text-gray-800 dark:text-light dark:text-primary ">
              {storyContent.kstWhy2.p1}
            </b>
          )}
          <b className="text-dark dark:text-primary text-gray-800">
            {" "}
            Lắp đặt kệ siêu thị lưng lưới tại{" "}
            <Link href="https://giaketanphat.com/">
              <a className="text-[red]"> Tân Phát </a>
            </Link>{" "}
            có nhiều lợi ích mà bạn nên xem xét:
          </b>
          <ul className="list-none">
            {storyContent.kstList2.map((item, index) => (
              <li className="flex items-start mb-1" key={item.title}>
                <div>
                  <p className="text-dark dark:text-primary">{item.title}</p>
                </div>
              </li>
            ))}
          </ul>
          <h3 className="font-bold text-gray-800 text-xl md:text-2xl mt-2 mb-2 dark:text-light dark:text-primary ">
            {" "}
            Đánh giá từ khách hàng về giá kệ Tân Phát
          </h3>
          <p>
            {" "}
            Rất nhiều doanh nghiệp lớn, cửa hàng tạp hóa và siêu thị đã tin dùng
            kệ Tân Phát và đánh giá cao về độ bền bỉ, tính thẩm mỹ cũng như khả
            năng chịu lực của sản phẩm. Sự hài lòng từ khách hàng chính là động
            lực để chúng tôi không ngừng cải tiến và nâng cao chất lượng sản
            phẩm.
          </p>
          <p className="leading-relaxed text-gray-500 mb-2 text-dark dark:text-primary">
            Đặc biệt, chúng tôi cung cấp dịch vụ vận chuyển và lắp đặt miễn phí
            tận nhà để tiết kiệm thời gian và công sức của bạn. Đừng ngần ngại
            liên hệ qua số điện thoại{" "}
            <b className="text-[#ff5e00fb]">0866.572.271 </b> để biết thêm thông
            tin chi tiết về các mẫu kệ và nhận tư vấn từ đội ngũ chuyên nghiệp
            của chúng tôi. Nếu máy bận, vui lòng để lại tin nhắn và chúng tôi sẽ
            gọi lại ngay sau đó.
          </p>

          <div className="flex-col flex  text-dark dark:text-primary mt-3">
            <h3 className="font-bold">
              {" "}
              Liên hệ ngay hôm nay để biết thêm chi tiết và nhận ưu đãi đặc
              biệt:
            </h3>
            <span>
              <b>Địa chỉ: </b>{" "}
              <span className="text-[#ff5e00fb]">
                Thị trấn Phùng, huyện Đan Phượng, thành phố Hà Nội{" "}
              </span>
            </span>
            <span>
              <b>Hotline </b>{" "}
              <span className="text-[#ff5e00fb]">0866.572.271 </span>
            </span>
            <span>
              <b>Email: </b>
              <span className="text-[#ff5e00fb]">
                kinhdoanh@giaketanphat.com{" "}
              </span>
            </span>
            <span>
              <b>Website: </b>{" "}
              <span className="text-[#ff5e00fb]">giaketanphat.com </span>
            </span>
            <span>
              <b>Fanpage: </b>{" "}
              <span className="text-[#ff5e00fb]">
                {" "}
                <Link href="https://www.facebook.com/giaketanphathn">
                  <a className="text-[#ff5e00fb] font-bold">
                    {" "}
                    Giá kệ Tân Phát{" "}
                  </a>
                </Link>{" "}
              </span>
            </span>
            <b className="text-[green]">
              Tạo sự thay đổi cho cửa hàng của bạn và làm cho nó đẹp hơn với giá
              kệ siêu thị Tân Phát!
            </b>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SEO;
