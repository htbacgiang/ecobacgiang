import React from 'react'
import BreadCrumb from '../components/BreadCrumb'
import Meta from '../components/Meta';
import { Link } from 'react-router-dom'
import logo from '../../src/Image/logo.png'
import CustomInput from '../components/CustomInput';

const Login = () => {
  return (
    <>
      <Meta title={'Đăng ký tài khoản'} />

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
                    <h3 className='boder-content-h3 '> Đăng ký tài khoản</h3>
                    <form action='' style={{ marginTop: 30 }}  >
                      
                    <div className='form-login'>
                    <CustomInput type='text' name = 'text' placeholder='Họ'  />
                    <CustomInput type='text' name = 'text' placeholder='Tên'  />
                    <CustomInput type='text' name = 'number' placeholder='Số điện thoại'  />
                    <CustomInput type='email' name = 'email' placeholder='Nhập email của bạn'  />
                    <CustomInput type='password' name = 'password' placeholder='Nhập mật khẩu'  />
                      </div>
                      <div className=''>
                        <Link className='signup' to='/dang-nhap'> Bạn đã có tài khoản </Link>
                        <div className='d-flex justify-content-center gap-15 align-item-center'>
                          <button className='btn boder-0'> Đăng ký </button>
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