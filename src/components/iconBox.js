import React from 'react'
import './banner.css'
import eco from '../../src/Image/eco-friendly.png'
import farmer from '../../src/Image/farmer.png'
import green from '../../src/Image/green-eco.png'

const iconBox = () => {
  return (
    <section className='col-inner'>
      <div className='container'>
        <div className='row'>
          <div className='col-4 d-flex'>
            <div className='boder-content '>
              <img src={eco} alt="..." className="rounded-circle" />
              <h3 className='boder-content-h3'>Quy trình thuận tự nhiên</h3>
              <p>
                Thuận tự nhiên là tôn chỉ của chúng tôi trong quá trình chăn nuôi, trồng cấy các sản phẩm để cung cấp đến người tiêu dung tại hệ thống chuỗi thực phẩm sạch Eco BacGiang.
              </p>
            </div>
          </div>
          <div className='col-4 d-flex'>
            <div className='boder-content '>
              <img src={farmer} alt="..." className="rounded-circle" />
              <h3 className='boder-content-h3'> Chuỗi cung ứng tiêu chuẩn</h3>
              <p>
                Bộ phận kỹ sư thực địa tại Eco BacGiang luôn giám sát nghiêm ngặt đối với các nông trại, đối tác tham gia trong chuỗi cung ứng tiêu chuẩn của chúng tôi.
              </p>
            </div>
          </div>
          <div className='col-4 d-flex'>
            <div className='boder-content '>
              <img src={green} alt="..." className="rounded-circle" />
              <h3 className='boder-content-h3'>Nguồn gốc minh bạch</h3>
              <p>
                Sản phẩm thuận tự nhiên phải có thông tin nguồn gốc, quá trình nuôi trồng, sản phẩm được công khai minh bạch theo thời gian thực trên từng sản phẩm.
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}

export default iconBox