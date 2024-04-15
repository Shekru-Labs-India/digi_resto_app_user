import React from 'react'
import applogo from '../assets/menumitra_logo.png';
const Logoname = () => {
  return (
    <div className='logotitle' style={{ textAlign: 'center' }}>
       <h4 className="title"> <img src={applogo} alt="wave" style={{ width: '70px', height: 'auto' }}  className="logo-image" /></h4>
       <h5 className='title'>MenuMitra</h5>
    </div>
  )
}

export default Logoname
