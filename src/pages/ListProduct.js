import React from 'react'
import BreadCrumb from '../components/BreadCrumb'
import Meta from '../components/Meta';
import cachua from '../../src/Image/rau/ca-chua.jpg'
import Bau from '../../src/Image/rau/bau.jpg'
import Caiboxoi from '../../src/Image/rau/cai-bo-xoi.jpg'
import Suhao from '../../src/Image/rau/su-hao.jpg'
import Product from '../components/Product';
import { Link } from 'react-router-dom'
import Button from 'react-bootstrap/Button'
import Container from '../../src/components/Container'

const ListProduct = () => {
    return (
        <>
            <Meta title={'Rau - Củ - Quả '} />
            <BreadCrumb title='Rau - Củ - Quả' />
            <Container class1='list-product-wrapper home-wrapper-2 py-4'>
                    <div className='row'>
                        <div className='col-3'>
                            <div className='filter-card mb-3'>
                                <h3 className='filter-title'> Mức giá </h3>
                                <div className='form-check'>
                                    <input className='form-check-input' type='checkbox' value='' id='/' />
                                    <label className='form-check-label' htmlFor=''> Giá dưới 50.000đ</label>
                                </div>
                                <div className='form-check'>
                                    <input className='form-check-input' type='checkbox' value='' id='/' />
                                    <label className='form-check-label' htmlFor=''> 50.000đ - 200.000đ</label>
                                </div>
                                <div className='form-check'>
                                    <input className='form-check-input' type='checkbox' value='' id='/' />
                                    <label className='form-check-label' htmlFor=''> Giá trên 200.000đ</label>
                                </div>
                                <h3 className='filter-title'> Phân loại theo</h3>

                                <div className='form-check'>
                                    <input className='form-check-input' type='checkbox' value='' id='/' />
                                    <label className='form-check-label' htmlFor=''> Rau hữu cơ</label>
                                </div>
                                <div className='form-check'>
                                    <input className='form-check-input' type='checkbox' value='' id='/' />
                                    <label className='form-check-label' htmlFor=''> Củ quả</label>
                                </div>
                                <div className='form-check'>
                                    <input className='form-check-input' type='checkbox' value='' id='/' />
                                    <label className='form-check-label' htmlFor=''> Rau sống </label>
                                </div>
                                <div className='form-check'>
                                    <input className='form-check-input' type='checkbox' value='' id='/' />
                                    <label className='form-check-label' htmlFor=''> Combo</label>
                                </div>
                            </div>
                            <div className='filter-card mb-3'>
                                <h3 className='filter-title'> Sản phẩm ngẫu nhiên </h3>
                                <div className='random-product mb-2 d-flex'>
                                    <div className='row'>
                                        <Link to='/san-pham/:id' className='d-flex 'onClick={() => {window.scroll({top: 0,left: 0,behavior: "smooth",});}} >
                                            <div className='col-4'>
                                                <img src={cachua} alt='' className='img-fluid' style={{ padding: "10px" }} />
                                            </div>
                                            <div className='col-8'>
                                                <h5 className=''>Cà chua Hà Lan</h5>
                                                <p className=''> 60.000đ </p>
                                            </div>
                                        </Link>
                                    </div>
                                </div>
                                <div className='random-product mb-2 d-flex'>
                                    <div className='row'>
                                        <Link to='/san-pham/:id' className='d-flex ' onClick={() => {window.scroll({top: 0,left: 0,behavior: "smooth",});}}>
                                            <div className='col-4'>
                                                <img src={Bau} alt='' className='img-fluid' style={{ padding: "10px" }} />
                                            </div>
                                            <div className='col-8'>
                                                <h5 className=''>Quả bầu</h5>
                                                <p className=''> 30.000đ </p>
                                            </div>
                                        </Link>
                                    </div>
                                </div>
                                <div className='random-product mb-2 d-flex'>
                                    <div className='row'>
                                        <Link to='/san-pham/:id' className='d-flex 'onClick={() => {window.scroll({top: 0,left: 0,behavior: "smooth",});}}>
                                            <div className='col-4'>
                                                <img src={Caiboxoi} alt='' className='img-fluid' style={{ padding: "10px" }} />
                                            </div>
                                            <div className='col-8'>
                                                <h5 className=''>Cải bó xôi</h5>
                                                <p className=''> 15.000đ </p>
                                            </div>
                                        </Link>
                                    </div>
                                </div>

                                <div className='random-product mb-2 d-flex'>
                                    <div className='row'>
                                        <Link to='/san-pham/:id' className='d-flex 'onClick={() => {window.scroll({top: 0,left: 0,behavior: "smooth",});}}>
                                            <div className='col-4'>
                                                <img src={Suhao} alt='' className='img-fluid' style={{ padding: "10px" }} />
                                            </div>
                                            <div className='col-8'>
                                                <h5 className=''>Su hào</h5>
                                                <p className=''> 27.000đ </p>
                                            </div>
                                        </Link>
                                    </div>
                                </div>
                            </div>

                        </div>
                        <div className='col-9'>
                            <div className='filter-sort-grid'>
                                <div className='d-flex align-items-center gap-10'>
                                    <h3>Sắp xếp theo </h3>
                                    <div className='sort-by'>
                                        <span className=''>Khuyến mãi tốt nhất</span>
                                    </div>
                                    <div className='sort-by'>
                                        <span className=''>Bán chạy</span>
                                    </div>
                                    <div className='sort-by'>
                                        <span className=''>Giá giảm dần</span>
                                    </div>
                                    <div className='sort-by'>
                                        <span className=''>Giá tăng dần</span>
                                    </div>
                                </div>
                            </div>
                            <div className='list-product d-flex'>
                                <Product />
                            </div>
                            <div className='list-product d-flex'>
                                <Product />
                            </div>
                            <div className='list-product d-flex'>
                                <Product />
                            </div>
                        </div>
                    </div>
            </Container>
        </>
    )
}

export default ListProduct