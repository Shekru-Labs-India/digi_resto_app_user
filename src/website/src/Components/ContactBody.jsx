import React from 'react'

const ContactBody = () => {
  return (
    
  <>
   <>
  {/* Start Page Title Area */}
  <div className="page-title-area item-bg-1">
    <div className="container">
      <div className="page-title-content">
        <h2>Contact Us</h2>
        <ul>
          <li>
            <a href="index.html">
              Home
              <i className="fa fa-chevron-right" />
            </a>
          </li>
          <li>Contact Us</li>
        </ul>
      </div>
    </div>
  </div>
  {/* End Page Title Area */}
  {/* Start Contact Info Area */}
  <section className="contact-info-area pt-100 pb-70">
    <div className="container">
      <div className="row">
        <div className="col-lg-6">
          <div className="row">
            <div className="col-lg-6 col-sm-6 col-md-6">
              <div className="single-contact-info">
                <i className="flaticon-paper-plane" />
                <h3>Email Us:</h3>
                <a href="contact.html#">
                  <span
                    className="__cf_email__"
                    data-cfemail="e189848d8d8ea193888c94cf828e8c"
                  >
                    shekrulabs@gmail.com
                  </span>
                </a>
                
              </div>
            </div>
            <div className="col-lg-6 col-sm-6 col-md-6">
              <div className="single-contact-info">
                <i className="flaticon-customer-service" />
                <h3>Call Us:</h3>
                <a href="contact.html#">Tel. +91 7776827177</a>
                
              </div>
            </div>
            <div className="col-lg-6 col-sm-6 col-md-6">
              <div className="single-contact-info">
                <i className="flaticon-pin" />
                <h3>Address</h3>
                <a href="contact.html#">
                Muktangan English School & Jr College, office No. 6, 2 Floor manogat, Parvati, Pune, Maharashtra 411009
                </a>
              </div>
            </div>
            
          </div>
        </div>
        <div className="col-lg-6">
          <div className="map">
            <iframe src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d60541.903684004654!2d73.853951!3d18.489593!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2c1982877f07b%3A0x1627e42ae3e8b0c2!2sShekru%20labs%20India%20Pvt.%20Ltd.!5e0!3m2!1sen!2sin!4v1721196205198!5m2!1sen!2sin" />
          </div>
        </div>
      </div>
    </div>
  </section>
  {/* End Contact Info Area */}
  {/* Start Contact Area */}
  <section className="main-contact-area pb-100">
    <div className="container">
      <div className="section-title">
        <h2>Write Us</h2>
      </div>
      <form id="contactForm">
        <div className="row">
          <div className="col-lg-6 col-sm-6">
            <div className="form-group">
              <label>Your Name</label>
              <input
                type="text"
                name="name"
                id="name"
                className="form-control"
                required=""
                data-error="Please enter your name"
              />
              <div className="help-block with-errors" />
            </div>
          </div>
          <div className="col-lg-6 col-sm-6">
            <div className="form-group">
              <label>Your Email</label>
              <input
                type="email"
                name="email"
                id="email"
                className="form-control"
                required=""
                data-error="Please enter your email"
              />
              <div className="help-block with-errors" />
            </div>
          </div>
          <div className="col-lg-6 col-sm-6">
            <div className="form-group">
              <label>Your Phone</label>
              <input
                type="text"
                name="phone_number"
                id="phone_number"
                required=""
                data-error="Please enter your number"
                className="form-control"
              />
              <div className="help-block with-errors" />
            </div>
          </div>
          <div className="col-lg-6 col-sm-6">
            <div className="form-group">
              <label>Subject</label>
              <input
                type="text"
                name="msg_subject"
                id="msg_subject"
                className="form-control"
                required=""
                data-error="Please enter your subject"
              />
              <div className="help-block with-errors" />
            </div>
          </div>
          <div className="col-12">
            <div className="form-group">
              <label>Your Message</label>
              <textarea
                name="message"
                className="form-control"
                id="message"
                cols={30}
                rows={8}
                required=""
                data-error="Write your message"
                defaultValue={""}
              />
              <div className="help-block with-errors" />
            </div>
          </div>
          <div className="col-lg-12 col-md-12">
            <div className="form-group checkboxs">
              <input type="checkbox" id="chb2" />
              <p>
                Accept <a href="log-in.html">Terms &amp; Conditions</a> And{" "}
                <a href="sign-up.html">Privacy Policy.</a>
              </p>
            </div>
          </div>
          <div className="col-lg-12 col-md-12">
            <button type="submit" className="default-btn">
              <span>Send Message</span>
            </button>
            <div id="msgSubmit" className="h3 text-center hidden" />
            <div className="clearfix" />
          </div>
        </div>
      </form>
    </div>
  </section>
  {/* End Contact Area */}
</>

  </>

  )
}

export default ContactBody