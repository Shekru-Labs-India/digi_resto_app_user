import React from 'react'
import { Link } from 'react-router-dom'

const ClientBody = () => {
  return (
    
  <>
   {/* Start Page Title Area */}
   <div className="page-title-area item-bg-5">
    <div className="container">
      <div className="page-title-content">
        <h2>Client Details</h2>
        <ul>
          <li>
            <Link to="/">
              Home
              <i className="fa fa-chevron-right" />
            </Link>
          </li>
          <li>Clients</li>
        </ul>
      </div>
    </div>
  </div>
  {/* End Page Title Area */}

  {/* Start Box Area */}
  <section className="box-area pt-100 pb-70">
    <div className="container">
      <div className="row">
        <div className="col-lg-4 col-md-6">
          <div className="single-box">
            <div className="box-icon">
            <i class="fa-solid fa-user"></i>
            </div>
            <h3>Contactless Order</h3>
            
            
          </div>
        </div>
        <div className="col-lg-4 col-md-6 icon-color">
          <div className="single-box">
            <div className="box-icon">
            <i class="fa-solid fa-user"></i>
            </div>
            <h3>Inventory Management</h3>
            
            
          </div>
        </div>
        <div className="col-lg-4 col-md-6 offset-md-3 offset-lg-0 icon-color">
          <div className="single-box">
            <div className="box-icon">
            <i class="fa-solid fa-user"></i>
            </div>
            <h3>Low Staff Cost</h3>
            
            
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-lg-4 col-md-6">
          <div className="single-box">
            <div className="box-icon">
            <i class="fa-solid fa-user"></i>
            </div>
            <h3>Contactless Order</h3>
            
            
          </div>
        </div>
        <div className="col-lg-4 col-md-6 icon-color">
          <div className="single-box">
            <div className="box-icon">
            <i class="fa-solid fa-user"></i>
            </div>
            <h3>Inventory Management</h3>
            
            
          </div>
        </div>
        <div className="col-lg-4 col-md-6 offset-md-3 offset-lg-0 icon-color">
          <div className="single-box">
            <div className="box-icon">
            <i class="fa-solid fa-user"></i>
            </div>
            <h3>Low Staff Cost</h3>
            
            
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-lg-4 col-md-6">
          <div className="single-box">
            <div className="box-icon">
            <i class="fa-solid fa-user"></i>
            </div>
            <h3>Contactless Order</h3>
            
            
          </div>
        </div>
        <div className="col-lg-4 col-md-6 icon-color">
          <div className="single-box">
            <div className="box-icon">
            <i class="fa-solid fa-user"></i>
            </div>
            <h3>Inventory Management</h3>
            
            
          </div>
        </div>
        <div className="col-lg-4 col-md-6 offset-md-3 offset-lg-0 icon-color">
          <div className="single-box">
            <div className="box-icon">
            <i class="fa-solid fa-user"></i>
            </div>
            <h3>Low Staff Cost</h3>
            
            
          </div>
        </div>
      </div>
    </div>
    
  </section>
  {/* End Service Area */}
  </>

  )
}

export default ClientBody