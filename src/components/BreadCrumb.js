import React from 'react'
import { Link } from 'react-router-dom'

const BreadCrumb = (props) => {
  const { title } = props;
  return (
    <>
      <div className='detail-product py-2'>
        <div className='container-xxl'>
          <div className='row'>
            <div className='col-12 d-flex justify-content-center align-items-center'>
              <p className='text-center'>
                <Link to='/' className='text-dark' >
                  Trang chủ
                </Link>{' '}
                / {title}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default BreadCrumb