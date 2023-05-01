import React from 'react'
import Meta from '../components/Meta';
import BreadCrumb from '../components/BreadCrumb'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGift, faTrash, faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import Suhao from '../../src/Image/rau/su-hao.jpg'
import { Link } from 'react-router-dom';
import Container from '../../src/components/Container'
const Cart = () => {
    return (
        <>
            <Meta title={'Giỏ hàng'} />
            <BreadCrumb title='Giỏ hàng' />
            <Container class1='cart-wrapper py-5'>
                    <div className='row'>
                        <div className='col-12'>
                            <div className='cart d-flex justify-content-between align-content-center'>
                                <h4> Giỏ hàng</h4>
                            </div>
                        </div>
                        <div className='col-12 d-flex' >
                            <div className='col-8 d-flex align-items-center cart-header justify-content-between'>
                                <div className='col-2 cart-san-pham'>
                                    <img className='img' src={Suhao} />
                                </div>
                                <div className='col-3'>
                                    <h5 className='product-title'>Cà chua Hà Lan</h5>
                                </div>
                                <div className='col-1 '>
                                    <p className='price'> 60.000đ </p>
                                </div>
                                <div className='col-3 d-flex align-items-center' style={{ padding: '20px' }}>
                                    <input className='form-control' type='number' name='amountInput' id='' min={1} step={1} style={{ marginRight: '20px' }} />
                                    <FontAwesomeIcon icon={faTrash} style={{ color: "#ffae00", }} />
                                </div>


                            </div>
                            <div className='col-4 total-cart-price ' >
                                <div className="title-cart " >
                                    <div className='col-12 d-flex justify-content-between align-content-center  '>
                                        <div className='col-6'>
                                            <h5 className="">Tổng tiền</h5>
                                        </div>
                                        <div className='col-6'>
                                            <span className="price-cart ">135,000₫</span>
                                        </div>
                                    </div>

                                </div>

                                <div className="checkout">
                                    <button style={{ width: '100%' }} className="btn" title="TIẾN HÀNH ĐẶT HÀNG" type="button" onClick={''}>
                                        <span>TIẾN HÀNH ĐẶT HÀNG</span></button>
                                </div>

                                <div style={{ textAlign: 'center' }}>
                                    <Link to='/san-pham'>
                                        <div className='align-items-center d-flex'>
                                            <FontAwesomeIcon icon={faArrowLeft} style={{ color: "#ffdd00", }} />
                                            <span style={{ padding: '0px 10px', color : 'black' }}> Tiếp tục mua hàng</span>
                                        </div>
                                    </Link>
                                </div>
                            </div>


                        </div>
                        <div className='col-8'>
                            <div className="back-index">
                                <div className="gift-list">
                                    <label className="h5"><FontAwesomeIcon icon={faGift} /> ƯU ĐÃI</label>
                                    <ul className="free-gifts">
                                        <li className="mb-3  ">
                                            <span className="align-items-baseline  ">
                                                <span className="mb-2">Miễn phí vận chuyển cho đơn hàng từ 300.000đ trong phạm vi 10km tính từ cửa hàng Eco Bắc Giang gần nhất
                                                </span>
                                            </span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
            </Container>


        </>
    )
}

export default Cart