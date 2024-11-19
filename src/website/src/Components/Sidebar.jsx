import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import logo from "../Assets/img/mm-logo-bg-fill.png";

const Sidebar = () => {
  const location = useLocation(); // Hook to get the current location

  useEffect(() => {
    const closeModal = () => {
      const modal = document.getElementById('myModal2');
      if (modal) {
        const bootstrapModal = window.bootstrap.Modal.getInstance(modal);
        if (bootstrapModal) {
          bootstrapModal.hide();
        }
      }

      // Remove the modal backdrop
      const backdrop = document.querySelector('.modal-backdrop');
      if (backdrop) {
        backdrop.remove();
      }

      // Remove 'modal-open' class and reset styles
      document.body.classList.remove('modal-open');
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    };

    // Close modal on location change
    closeModal();

    // Listen for additional events if necessary
  }, [location]);

  return (
    <>
      {/* Start Sidebar Modal */}
      <div className="sidebar-modal">
        <div
          className="modal right fade"
          id="myModal2"
          tabIndex={-1}
          role="dialog"
          aria-labelledby="myModalLabel2"
        >
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <button
                  type="button"
                  className="close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                >
                  <span aria-hidden="true">
                    <i className="fa fa-times" />
                  </span>
                </button>
                <h2 className="modal-title d-flex align-items-center" id="myModalLabel2">
                  <Link to="/">
                    <img src={logo} alt="Logo" width="50" height="50" />
                  </Link>
                  <Link className="ms-3" to="/">
                    <div className="fs-2 fw-semibold text-dark">MenuMitra</div>
                  </Link>
                </h2>
              </div>
              <div className="modal-body">
                <div className="sidebar-modal-widget">
                  <h3 className="title"> Links</h3>
                  <ul>
                    <li>
                      <Link to="/">Home</Link>
                    </li>
                    <li>
                      <Link to="/features">Features</Link>
                    </li>
                    
                    <li>
                      <Link to="/pricing">Pricing</Link>
                    </li>

                 
								<li>
									<Link to="/about">About</Link>
								</li>
								<li>
									<Link to="/contact">Contact </Link>
								</li>
								
                   
                  </ul>
                </div>
                <div className="sidebar-modal-widget">
                  <h3 className="title">Contact </h3>
                  <ul className="contact-info">
                    <li>
                      <i className="fa fa-map-marker" />
                      Address
                      <span>Muktangan English School & Jr College, office No. 6, 2 Floor manogat, Parvati, Pune, Maharashtra 411009</span>
                    </li>
                    <li>
                      <i className="fa fa-envelope" />
                      Email
                      <a href="mailto:example@example.com">
                      shekrulabs@gmail.com
                      </a>
                    </li>
                    <li>
                      <i className="fa fa-phone" />
                      Phone
                      <a href="tel:123456124">+91 7776827177</a>
                      
                    </li>
                  </ul>
                </div>
                <div className="sidebar-modal-widget">
                  <h3 className="title">Connect With Us</h3>
                  <ul className="social-list">
                    <li className='mx-1'>
                      <Link to="https://www.facebook.com/share/x5wymXr6w7W49vaQ/?mibextid=qi2Omg" target="_blank" rel="noreferrer">
                      <i className="fa-brands fa-facebook-f" />
                      </Link>
                    </li>
                   
                    
                    <li className='mx-1'>
                      <Link to="https://www.youtube.com/@menumitra" target="_blank" rel="noreferrer">
                      <i className="fa-brands fa-youtube"></i>
                      </Link>
                    </li>
                    <li className='mx-1'>
                      <Link to="https://x.com/MenuMitra" target="_blank" rel="noreferrer">
                      <i className="fa-brands fa-twitter"></i>
                      </Link>
                    </li>
                    <li className='mx-1'>
                      <Link to="https://www.instagram.com/menumitra/" target="_blank" rel="noreferrer">
                      <i className="fa-brands fa-instagram"></i>
                      </Link>
                    </li>
                  </ul>
                </div>
                
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* End Sidebar Modal */}
    </>
  );
};

export default Sidebar;
