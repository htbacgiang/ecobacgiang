import React from 'react'
import Meta from '../components/Meta';
import BreadCrumb from '../components/BreadCrumb'
import BlogCard from '../components/blogCard';
import banner7 from '../Image/banner7.jpg'
import banner8 from '../Image/banner4.jpg'
import banner9 from '../Image/banner9.jpg'
import banner10 from '../Image/banner10.jpg'
import { Link } from 'react-router-dom'
import Button from 'react-bootstrap/Button'
import Container from '../../src/components/Container'

const About = () => {
  return (

    <>
      <BreadCrumb title='Chuyện Farm Kể' />
      <Meta title={'Chuyện Farm Kể'} />
      <Container class1='blog-wrapper py-4'>
          <div className='row'>
            <div className='col-12'>
              <div className='row'>
                <div className='col-3'>
                  <div className='blog-card'>
                    <div className='card-img'>
                      <img src={banner7} alt='' className='img-fluid' />
                    </div>
                    <div className='blog-content'>
                      {/* <p className='date'> Update: 04/20/2023</p> */}
                      <Link to='/chuyen-farm-ke/:id' className='links' onClick={() => {window.scroll({top: 0,left: 0,behavior: "smooth",});}}>
                        <h4 className='title'> Cuộc cách mạng một cọng rơm (ebook)</h4>
                        <p className='desc'>Các bạn thân mến, Bản sách này là ebook Cuộc cách mạng một cọng rơm có bản quyền...</p>
                        <Button variant="outline-success" className='button'>Xem thêm </Button>{' '}
                      </Link>
                    </div>
                  </div>
                </div>
                <div className='col-3'>
                  <div className='blog-card'>
                    <div className='card-img'>
                      <img src={banner8} alt='' className='img-fluid' />
                    </div>
                    <div className='blog-content'>
                      {/* <p className='date'> Update: 04/20/2023</p> */}
                      <Link to='/chuyen-farm-ke/:id' className='links' onClick={() => {window.scroll({top: 0,left: 0,behavior: "smooth",});}}>
                        <h4 className='title'> Cuộc cách mạng một cọng rơm (ebook)</h4>
                        <p className='desc'>Các bạn thân mến, Bản sách này là ebook Cuộc cách mạng một cọng rơm có bản quyền...</p>
                        <Button variant="outline-success" className='button'>Xem thêm </Button>{' '}
                      </Link>
                    </div>
                  </div>
                </div>
                <div className='col-3'>
                  <div className='blog-card'>
                    <div className='card-img'>
                      <img src={banner9} alt='' className='img-fluid' />
                    </div>
                    <div className='blog-content'>
                      {/* <p className='date'> Update: 04/20/2023</p> */}
                      <Link to='/chuyen-farm-ke/:id' className='links' onClick={() => {window.scroll({top: 0,left: 0,behavior: "smooth",});}}>
                        <h4 className='title'> Cuộc cách mạng một cọng rơm (ebook)</h4>
                        <p className='desc'>Các bạn thân mến, Bản sách này là ebook Cuộc cách mạng một cọng rơm có bản quyền...</p>
                        <Button variant="outline-success" className='button'>Xem thêm </Button>{' '}
                      </Link>
                    </div>
                  </div>
                </div>
                <div className='col-3'>
                  <div className='blog-card'>
                    <div className='card-img'>
                      <img src={banner10} alt='' className='img-fluid' />
                    </div>
                    <div className='blog-content'>
                      {/* <p className='date'> Update: 04/20/2023</p> */}
                      <Link to='/chuyen-farm-ke/:id' className='links' onClick={() => {window.scroll({top: 0,left: 0,behavior: "smooth",});}}>
                        <h4 className='title'> Cuộc cách mạng một cọng rơm (ebook)</h4>
                        <p className='desc'>Các bạn thân mến, Bản sách này là ebook Cuộc cách mạng một cọng rơm có bản quyền...</p>
                        <Button variant="outline-success" className='button'>Xem thêm </Button>{' '}
                      </Link>
                    </div>
                  </div>
                </div>

              </div>
            </div>
            <div>
              <nav aria-label="Page navigation example">
                <ul className="pagination justify-content-center">
                  <li className="page-item disabled">
                    <a className="page-link" href="#" tabIndex="-1" aria-disabled="true">Previous</a>
                  </li>
                  <li className="page-item"><a className="page-link" href="#">1</a></li>
                  <li className="page-item"><a className="page-link" href="#">2</a></li>
                  <li className="page-item"><a className="page-link" href="#">3</a></li>
                  <li className="page-item">
                    <a className="page-link" href="#">Next</a>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
      </Container>
    </>
  )
}

export default About