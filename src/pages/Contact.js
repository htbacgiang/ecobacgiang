import React from 'react'
import Meta from '../components/Meta';
import BreadCrumb from '../components/BreadCrumb'
const About = () => {
  return (

    <>
      <Meta title={'Liên hệ Eco Bắc Giang'} />
      <BreadCrumb title='Liên hệ' />
      <div className='contact-wrapper home-wrapper-2 py-5'>
        <div className='container'>
          <div className='row'>
            <div className='col-12 map'>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d5783.364668373685!2d105.838955!3d20.691651!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135cbbd49100805%3A0xf7bd8a83a0cf059c!2zRWNvIELhuq9jIEdpYW5nIC0gTsO0bmcgVHLhuqFpIEjhu691IEPGoQ!5e1!3m2!1svi!2sjp!4v1682421897458!5m2!1svi!2sjp"
                width="400"
                height="300"
                className='boder-0 w-100'
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade" />
            </div>
            <div className='col-12 mt-4 contact'>
              <div className='contact-wrapper  justify-content-between'>
                <div className='contact-info'>
                  <h3 className='contact-title mb-4'> THÔNG TIN CỦA BẠN: </h3>


                  <form action='' className='flex-colum'>
                    <div className='row d-flex'>
                      <div className='col-2'>
                        <h4 className='contact-h4'> Họ & Tên :</h4>
                      </div>
                      <div className='col-10'>
                        <input type='text' className='form-control  mb-3' required />
                      </div>
                    </div>
                    <div className='row d-flex'>
                      <div className='col-2'>
                        <h4 className='contact-h4'> Số điệnt thoại :</h4>
                      </div>
                      <div className='col-10'>
                        <input type='text' className='form-control  mb-3' required />
                      </div>
                    </div>
                    <div className='row d-flex'>
                      <div className='col-2'>
                        <h4 className='contact-h4'> Địa chỉ E-Mail :</h4>
                      </div>
                      <div className='col-10'>
                        <input type='email' className='form-control  mb-3' required />
                      </div>
                    </div>
                    <div className='row d-flex'>
                      <div className='col-2'>
                        <h4 className='contact-h4'>Nội dung:</h4>
                      </div>
                      <div className='col-10'>
                        <textarea
                          name=''
                          id=''
                          cols='10'
                          rows='10'
                          className='w-100 form-control'>

                        </textarea>
                      </div>
                    </div>
                  </form>
                  <div className='btn-1'>
                    <button className='btn boder-0'> Gửi</button>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default About