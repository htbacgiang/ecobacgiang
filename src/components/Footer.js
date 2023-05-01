import React from 'react'
import { Link } from 'react-router-dom'
import Image from '../../src/Image/da-dang-ky.png'
import Facebook from '../../src/Image/facebook.png'
import Instagram from '../../src/Image/instagram.png'
import Tiktok from '../../src/Image/tik-tok.png'
import Gmail from '../../src/Image/gmail.png'
import Youtube from '../../src/Image/youtube.png'

const Footer = () => {
  return (
    <>
      <footer className='py-1'></footer>
      <div className='container-xxl'>
        <div className='row'>
          <div className='col-1'> </div>
          <div className='col-2 '>
            <h5 className='footer-tittle'>Về Eco Bắc Giang</h5>
            <div className='footer-link'>
              <Link className='mb-1' to="/thanhtoan"> Giới thiệu về công ty</Link><br />
              <Link className='mb-1' to="/thanhtoan"> Hồ sơ năng lực </Link> <br />
              <Link className='mb-1' to="/thanhtoan"> Hệ thống nông trại</Link><br />
            </div>
          </div>
          <div className='col-3'>
            <h5 className='footer-tittle'>Hỗ trợ khách hàng</h5>
            <div className='footer-link'>
              <Link className='mb-1' to="/thanhtoan"> Hướng dẫn cài đặt và thanh toán</Link><br />
              <Link className='mb-1' to="/thanhtoan"> Chính sách đổi trả </Link> <br />
              <Link className='mb-1' to="/thanhtoan"> Chính sách giao hàng</Link><br />
              <Link className='mb-1' to="/thanhtoan"> Chính sách thẻ hội viên</Link><br />


            </div>
          </div>
          <div className='col-3'>
            <h5 className='footer-tittle'>Tin tức</h5>
          </div>
          <div className='col-2'>
            <h5 className='footer-tittle'>Thông tin liên hệ</h5>

            <div className='social-icon'>
              <Link to='/'>
                <img className='' src={Facebook} /></Link>
              <Link to='/'>
                <img className='' src={Youtube} /></Link>
              <Link to='/'>
                <img className='' src={Tiktok} /></Link>
              <Link to='/'>
                <img className='' src={Instagram} /></Link>
              <Link to='/'>
                <img className='' src={Gmail} /></Link>
            </div>
          </div>
        </div>
      </div>
      <footer className='py-2'>
        <div className='container-xxl'>
          <div className='row'>
            <div className='col-4 '>
              <h5 className='footer-name'>CÔNG TY TNHH NÔNG NGHIỆP CÔNG NGHỆ CAO ECO BACGIANG</h5>
              <p className='footer-p'>Mã số doanh nghiệp: {1} do Sở Kế hoạch và Đầu Tư Thành phố Hà Nội cấp ngày 29/07/2024 </p>
              {/* <p className='text-center mb-0 text-black'> &copy; {new Date().getFullYear()}: Desgin by TruongNQ.vn </p> */}
            </div>
            <div className='col-5'>
              <h5 className='footer-name'>ĐỊA CHỈ NÔNG TRẠI ECOBACGIANG</h5>
              <address className='footer-p'>Thôn An Cư, xã Trầm Lộng, huyện Ứng Hoà, thành phố Hà Nội</address>
            </div>

            <div className='col-1 footer-img'>
              <Link className='' to="https://truongnq.vn" > <img src={Image} />  </Link>

            </div>
          </div>
        </div>
      </footer>


    </>
  )
}

export default Footer