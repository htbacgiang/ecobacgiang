import React, { useRef, useState } from "react";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import "./style.css";

// import required modules
import { FreeMode, Navigation, Thumbs } from "swiper";
import Bapcai from '../Image/rau/bau.jpg'
import Caitim from '../Image/rau/bap-cai-tim.jpg'
import CaiNgong from '../Image/rau/cai-ngong.webp'
import Cachua from '../Image/rau/ca-chua.jpg'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGift } from '@fortawesome/free-solid-svg-icons'
import { Link } from 'react-router-dom'
import Button from 'react-bootstrap/Button'
import Fresh from '../Image/icon/fresh.png'
import Organic from '../Image/icon/organic.png'
import HealtCcare from '../Image/icon/healthcare.png'
import Check from '../Image/icon/check-mark.png'
import Visa from '../Image/icon/visa.jpg'
import AdSwiper from '../components/AdSwiper'
import Container from '../../src/components/Container'

const DetailProduct = () => {
    const [thumbsSwiper, setThumbsSwiper] = useState(null);

    return (
        <>
            <Container class1="">
                    <div className='row'>
                        <div className='col-12 chi-tiet-san-pham'>
                            <div className='san-pham d-flex'>
                                <div className='col-5'>
                                    <Swiper
                                        style={{
                                            "--swiper-navigation-color": "#fff",
                                            "--swiper-pagination-color": "#fff",
                                        }}
                                        loop={true}
                                        spaceBetween={10}
                                        navigation={true}
                                        thumbs={{ swiper: thumbsSwiper }}
                                        modules={[FreeMode, Navigation, Thumbs]}
                                        className="mySwiper3"
                                    >
                                        <SwiperSlide>
                                            <img src={Bapcai} />
                                        </SwiperSlide>
                                        <SwiperSlide>
                                            <img src={Caitim} />
                                        </SwiperSlide>
                                        <SwiperSlide>
                                            <img src={CaiNgong} />
                                        </SwiperSlide>
                                        <SwiperSlide>
                                            <img src={Cachua} />
                                        </SwiperSlide>

                                    </Swiper>
                                    <Swiper
                                     onSwiper={setThumbsSwiper}
                                     loop={true}
                                     spaceBetween={10}
                                     slidesPerView={4}
                                     freeMode={true}
                                     watchSlidesProgress={true}
                                     modules={[FreeMode, Navigation, Thumbs]}
                                     className="mySwiper4"
                                    >
                                        <SwiperSlide>
                                            <img src={Bapcai} />
                                        </SwiperSlide>
                                        <SwiperSlide>
                                            <img src={Caitim} />
                                        </SwiperSlide>
                                        <SwiperSlide>
                                            <img src={CaiNgong} />
                                        </SwiperSlide>
                                        <SwiperSlide>
                                            <img src={Cachua} />
                                        </SwiperSlide>
                                    </Swiper>
                                </div>
                                <div className="col-10 d-flex">
                                    <div className="mo-ta-san-pham">
                                        <div className="row">
                                            <div className="col-12">
                                                <div className="product-desc">
                                                    <h3 className="">Bắp Cải Trái Tím CP 1kg </h3>
                                                    <p className=""> Tình trạng: <span className=""> Còn hàng</span> </p>
                                                    <div className="price-box">
                                                        <div className="special-price">
                                                            <div className="price product-price">
                                                                42,000₫
                                                            </div>
                                                        </div>
                                                    </div>
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
                                                    <Link to='/' className='addtocard' onClick={() => { window.scroll({ top: 0, left: 0, behavior: "smooth", }); }}>
                                                        <Button variant="success" className='button'>Thêm vào giỏ hàng </Button>{' '}
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-4">
                                        <div className="nguon-goc">
                                            <h3> Chỉ có tại Eco Bắc Giang</h3>
                                            <ul className='ps-0'>
                                                <div className="d-flex" style={{ alignItems: 'center' }} >
                                                    <img className="" src={Organic} />
                                                    <li className=''>100% Sạch</li>
                                                </div>
                                                <div className="d-flex" style={{ alignItems: 'center' }} >
                                                    <img className="" src={Check} />
                                                    <li className=''>Rõ nguồn gốc</li>
                                                </div>
                                                <div className="d-flex" style={{ alignItems: 'center' }} >
                                                    <img className="" src={Fresh} />
                                                    <li className=''>Luôn tươi ngon</li>
                                                </div>
                                                <div className="d-flex" style={{ alignItems: 'center' }} >
                                                    <img className="" src={HealtCcare} />
                                                    <li className=''>An toàn cho sức khoẻ</li>
                                                </div>
                                            </ul>
                                        </div>
                                        <div className="product-trustbadge my-3 col-12 visa">
                                            <img className="lazyload img-fluid loaded" src={Visa} data-src="" alt="Phương thức thanh toán" data-was-processed="true" />
                                        </div>
                                    </div>
                                    <div>
                                    </div>
                                </div>

                            </div>
                        </div>
                        <div className="col-12 bai-viet-san-pham home-wrapper-2">
                            <h3> Mô tả sản phẩm</h3>
                            <span>
                                🎯  Sáng ngày 24/4/2023, Hội nghị Toàn cầu về Hệ thống Lương thực, Thực phẩm lần thứ 4 đã khai mạc tại khách sạn Sheraton, Hà Nội. Đây là hội nghị cấp Bộ trưởng với sự tham gia của hơn 300 đại biểu, trong đó khoảng 200 đại biểu quốc tế đến từ các quốc gia, các cơ quan của Liên hợp quốc, các tổ chức quốc tế.

                                🎯 Tham dự về phía Việt Nam có ông Trần Lưu Quang - Phó Thủ tướng Chính phủ, ông Lê Minh Hoan - Bộ trưởng Bộ NN - PTNT, lãnh đạo một số bộ, ngành, địa phương…

                                🎯 Nổi bật trong nhóm đại diện các hiệp hội ngành hàng, tập đoàn lớn trong và ngoài nước là sự góp mặt của Tập đoàn Tân Long cùng các thương hiệu thành viên.

                                🔰 Tập đoàn Tân Long là một trong những doanh nghiệp tiên phong về chuyển đổi hệ thống lương thực, thực phẩm theo hướng bền vững. Sản phẩm điển hình là gạo lành A An, thịt sạch từ heo ăn chay BaF và hệ thống cửa hàng thực phẩm sạch Siba Food.

                                🔰 Với những thành tựu ấn tượng về việc phát triển nông nghiệp trong thời gian qua, khu vực trưng bày triển lãm và giới thiệu của Tập đoàn Tân Long, Siba Food, A An, BaF đã vinh dự nhận được sự quan tâm của đông đảo các vị đại biểu: Bộ trưởng Bộ NN-PTNT và người sáng lập One Planet - Bộ trưởng Bộ Nông nghiệp Thụy Sỹ

                                Mời Quý vị cùng theo dõi hành trình của Tập đoàn Tân Long,Siba Food, BaF và gạo A An qua những hình ảnh dưới đây ❣️
                            </span>
                        </div>
                        <div className=" san-pham-ngau-nhien ">
                            <h3>
                                Sản phẩm ngẫu nhiên
                            </h3>
                            <AdSwiper />
                        </div>
                    </div>
            </Container>
        </>
    )
}

export default DetailProduct