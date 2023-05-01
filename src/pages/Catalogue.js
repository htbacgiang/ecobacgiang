import React from 'react'
import { NavLink, Link } from 'react-router-dom'
import rau from '../Image/img catalogue/rau.webp'
import thit from '../Image/img catalogue/thit.webp'
import qua from '../Image/img catalogue/qua.webp'
import traicay from '../Image/img catalogue/traicay.webp'
import combo from '../Image/img catalogue/combo.webp'

const About = () => {
  return (
    <>
    <section className='catalogue py-3'>
      <div className='container'>
        <div className='row'>
          <div className='col-12'>
            <div className='catalogue-child d-flex justify-content-betwen align-item-center'>
                <Link className='catalogue-item' to='rau-hu-co'>
                <div className='catalogue-title'>
                <h6> Rau hữu cơ</h6>
                <p> (50) loại</p>
                </div>
                <img src={rau} alt='rau'/> 
                </Link> 
                <Link className='catalogue-item' to=''>
                <div className='catalogue-title'>
                <h6> Hoa quả</h6>
                <p> (50) loại</p>
                </div>
                <img src={qua} alt='rau'/> 
                </Link> 
                <Link className='catalogue-item' to=''>
                <div className='catalogue-title'>
                <h6> Thịt</h6>
                <p> (50) loại</p>
                </div>
                <img src={thit} alt='rau'/> 
                </Link> 
                <Link className='catalogue-item' to=''>
                <div className='catalogue-title'>
                <h6> Trái cây</h6>
                <p> (50) loại</p>
                </div>
                <img src={traicay} alt='rau'/> 
                </Link> 
                <Link className='catalogue-item' to=''>
                <div className='catalogue-title'>
                <h6> Combo quà tặng</h6>
                <p> (50) loại</p>
                </div>
                <img src={combo} alt='rau'/> 
                </Link> 
                
            </div>
          </div>
        </div>
      </div>
    </section>
    </>
  )
}

export default About