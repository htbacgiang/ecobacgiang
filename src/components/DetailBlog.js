import React from 'react'
import Meta from './Meta'
import BreadCrumb from './BreadCrumb'
import banner9 from '../Image/banner9.jpg'
import Container from '../../src/components/Container'

const DetailProduct = () => {
  return (
    <>
      <BreadCrumb title='Dynamic Blog Name' />
      <Meta title={'Dynamic Blog Name'} />
      <Container class1='blog-wrapper home-wrapper-2 py-5'>
        <div className='container'>
          <div className='row text-center'>
            <div className='col-10'>
              <div className='detail-blog-card'>
                <h3 className='title'> Cuộc cách mạng một cọng rơm (ebook)</h3>
                <img className='img-fluid w-100 my-4' src={banner9} alt='cuoc-cach-mang-mot-cong-rom' />
                <p>
                  Các bạn thân mến,

                  Bản sách này là ebook Cuộc cách mạng một cọng rơm có bản quyền, được đưa đến các bạn nhờ sự đóng góp của các bên sau đây:
                  1. XanhShop.com và các cộng sự trong việc biên dịch và liên lạc mua bản quyền;
                  2. Một số mạnh thường quân yêu cuốn sách muốn đưa tư tưởng của cụ Fukuoka tới cộng đồng đã ủng hộ về tài chính để trả tiền bản quyền cho bản ebook cùng phí chuyển tiền ra nước ngoài;
                  3. Phoenix Books.vn giúp tạo ebook với giá 0đ;

                  Chân thành cám ơn mọi người đã chung sức!

                  Chúng tôi mong muốn cuốn sách đến được với thật nhiều người Việt Nam, kể cả những người không có điều kiện mua sách, cũng không có điều kiện truy cập tới mạng internet và máy vi tính, nhất là các nông dân và những người ở vùng sâu vùng xa. Vì thế, chúng tôi mong các bạn, sau khi đọc bản ebook này, nếu bạn thấy nó hữu ích và bạn có điều kiện tài chính, thì hãy ủng hộ bằng cách mua sách giấy để gửi tặng các đối tượng trên. Sách có thể mua tại các điểm bán ở đây.

                  Cùng chúng tôi Đáp-Đền-Tiếp-Nối nhé!
                </p>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </>
  )
}

export default DetailProduct