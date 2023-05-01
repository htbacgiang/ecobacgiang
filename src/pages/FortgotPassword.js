import React from 'react'
import BreadCrumb from '../components/BreadCrumb'
import Meta from '../components/Meta';
import { Link } from 'react-router-dom'
import logo from '../../src/Image/logo.png'
import CustomInput from '../components/CustomInput';

const Login = () => {
  return (
    <>
      <Meta title={'Đặt lại mật khẩu'} />
      <div className=''>
        <div className='container '>
          <div className='row'>
            <div className='col-12'>
              <div className='login-form d-flex'>
                <div className='col-6'>
                  <div className='login-img text-center text-white'>
                    <p className='login-p'> Welcome to</p>
                    <img src={logo} />
                    <p className='login-p'>
                      Thuận tự nhiên là tôn chỉ của chúng tôi trong quá trình chăn nuôi, trồng cấy các sản phẩm để cung cấp đến người tiêu dung tại hệ thống chuỗi thực phẩm sạch Eco BacGiang.
                    </p>
                  </div>
                </div>
                <div className='col-6'>
                  <div className='login-card'>
                    <h3 className='boder-content-h3 '> Đặt lại mật khẩu </h3>
                    <p>Chúng tôi sẽ gửi cho bạn một email để kích hoạt việc đặt lại mật khẩu.</p>
                    <form action='' style={{ marginTop: 80 }}  >
                      <div className='form-login'>
                      <CustomInput type='email' name = 'email' placeholder='Nhập email hoặc số điện thoại để lấy lại mật khẩu'  />
                      </div>
                      <div className=''>
                        <Link className='signup' to='/dang-nhap'> Quay lại đăng nhập </Link>
                        <div className='d-flex justify-content-center gap-15 align-item-center'>
                          <button className='btn boder-0'> Lấy lại mật khẩu </button>
                        </div>

                      </div>
                    </form>
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

export default Login