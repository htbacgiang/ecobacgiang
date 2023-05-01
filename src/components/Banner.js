import React from 'react'
import './banner.css'
import banner from '../../src/Image/banner.jpg'
const Banner = () => {
  return (
    <>
    <section className=''>
    <div className='container'>
        <div className='row'>
        <div className='col-12'>
            <div className='banner'>
            <div className='banner-content position-absolute'>
              <h4>CÂU CHUYỆN ECO BACGIANG - NÔNG NGHIỆP CHÍNH XÁC THUẬN TỰ NHIÊN</h4>
              <h6>
              Nông nghiệp tự nhiên thực sự là bên trong mỗi chúng ta, chúng ta chỉ phải nhớ cách lắng nghe
              </h6>
            </div>
            </div>
            <div className='banner-img position-relative'>
                <img src={banner} alt='' />
            </div>
        </div>
        </div>

    </div>
    </section>
    </>
  )
}

export default Banner