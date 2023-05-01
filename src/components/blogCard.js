import React from 'react'
import banner7 from '../Image/banner7.jpg'
import { Link } from 'react-router-dom'
import Button from 'react-bootstrap/Button'


const BlogCard = () => {
    return (
        <div className='col-4'>
            <div className='blog-card'>
                <div className='card-img'>
                    <img src={banner7} alt='' className='img-fluid' />
                </div>
                <div className='blog-content'>
                    {/* <p className='date'> Update: 04/20/2023</p> */}
                    <Link to='chuyen-farm-ke/:id' className='links' onClick={() => {window.scroll({top: 0,left: 0,behavior: "smooth",});}}>
                        <h4 className='title'> Cuộc cách mạng một cọng rơm (ebook)</h4>
                        <p className='desc'>Các bạn thân mến, Bản sách này là ebook Cuộc cách mạng một cọng rơm có bản quyền...</p>
                        <Button variant="outline-success" className='button'>Xem thêm </Button>{' '}
                    </Link>
                </div>
            </div>
        </div>

    )
}

export default BlogCard