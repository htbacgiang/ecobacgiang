import React from 'react'
import Cachua from '../../src/Image/rau/ca-chua.jpg'
import Bau from '../../src/Image/rau/bau.jpg'
import Caiboxoi from '../../src/Image/rau/cai-bo-xoi.jpg'
import Suhao from '../../src/Image/rau/su-hao.jpg'
import { Link } from 'react-router-dom'
import Button from 'react-bootstrap/Button'
import Container from '../../src/components/Container'

const Product = () => {
    return (

        <Container class1='product-card py-3'>
            <div className='row'>
                <div className='col-3'>
                    <Link to='/san-pham/:id' className='addtocard' onClick={() => { window.scroll({top: 0,left: 0,behavior: "smooth", }); }} >
                        <div className='product position-relative'>

                            <div className='product-img'>
                                <img src={Cachua} alt='' />
                            </div>
                            <h5 className='product-title'>Cà chua Hà Lan</h5>
                            <p className='price'> 60.000đ </p>
                            <div className='action-bar position-absolute'>
                                <div className='d-flex flex-column'>
                                </div>
                            </div>

                            <Button variant="success" className='button'>Thêm vào giỏ hàng </Button>{' '}
                        </div>
                    </Link>
                </div>

                <div className='col-3'>
                <Link to='/san-pham/:id' className='addtocard' onClick={() => { window.scroll({top: 0,left: 0,behavior: "smooth", }); }} >
                        <div className='product position-relative'>
                            <div className='product-img'>
                                <img src={Bau} alt='' />
                            </div>
                            <h5 className='product-title'>Quả bầu RH</h5>
                            <p className='price'> 30.000đ </p>
                            <div className='action-bar position-absolute'>
                                <div className='d-flex flex-column'>

                                </div>
                            </div>
                            <Button variant="success" className='button'>Thêm vào giỏ hàng </Button>{' '}
                        </div>
                    </Link>
                </div>


                <div className='col-3'>
                <Link to='/san-pham/:id' className='addtocard' onClick={() => { window.scroll({top: 0,left: 0,behavior: "smooth", }); }} >
                        <div className='product position-relative'>
                            <div className='product-img'>
                                <img src={Caiboxoi} alt='' />
                            </div>
                            <h5 className='product-title'>Cải bó xôi RH</h5>
                            <p className='price'> 15.000đ </p>
                            <div className='action-bar position-absolute'>
                                <div className='d-flex flex-column'>
                                </div>
                            </div>
                            <Button variant="success" className='button'>Thêm vào giỏ hàng </Button>{' '}
                        </div>
                    </Link>
                </div>
                <div className='col-3'>
                <Link to='/san-pham/:id' className='addtocard' onClick={() => { window.scroll({top: 0,left: 0,behavior: "smooth", }); }} >
                        <div className='product position-relative'>
                            <div className='product-img'>
                                <img src={Suhao} alt='' />
                            </div>
                            <h5 className='product-title'>Su hào RH</h5>
                            <p className='price'> 27.000đ </p>
                            <div className='action-bar position-absolute'>
                                <div className='d-flex flex-column'>
                                </div>
                            </div>
                            <Button variant="success" className='button'>Thêm vào giỏ hàng </Button>{' '}
                        </div>
                    </Link>
                </div>
            </div>
        </Container>
    )
}

export default Product