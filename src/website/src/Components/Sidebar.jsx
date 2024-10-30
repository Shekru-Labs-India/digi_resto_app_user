import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import logo from '../Assets/img/MenuMitra.png';
import jpg1 from '../Assets/img/instagram/1.jpg'
import jpg2 from '../Assets/img/instagram/2.jpg'
import jpg3 from '../Assets/img/instagram/3.jpg'
import jpg4 from '../Assets/img/instagram/4.jpg'
import jpg5 from '../Assets/img/instagram/5.jpg'
import jpg6 from '../Assets/img/instagram/6.jpg'



const Sidebar = () => {
  const location = useLocation(); // Hook to get the current location

  useEffect(() => {
    // Close the modal and remove the backdrop when the location changes
    const modal = document.getElementById('myModal2');
    if (modal) {
      const bootstrapModal = window.bootstrap.Modal.getInstance(modal);
      if (bootstrapModal) {
        bootstrapModal.hide();
      }
    }

    // Manually remove the modal backdrop if it exists
    const backdrop = document.querySelector('.modal-backdrop');
    if (backdrop) {
      backdrop.remove();
    }

    // Remove the 'modal-open' class and reset body styles to allow scrolling
    document.body.classList.remove('modal-open');
    document.body.style.overflow = ''; // Reset any overflow style
    document.body.style.paddingRight = ''; // Reset padding if applied for scrollbar width
  }, [location]); // Effect triggered when location changes

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
                <h2 className="modal-title" id="myModalLabel2">
                  <Link to="/">
                    <img src={logo} alt="Logo" width="50" height="50" />
                  </Link>
                  <Link className="ms-3" to="/">
                    <h4>Menumitra</h4>
                  </Link>
                </h2>
              </div>
              <div className="modal-body">
                <div className="sidebar-modal-widget">
                  <h3 className="title">Additional Links</h3>
                  <ul>
                    <li>
                      <Link href="/">Home</Link>
                    </li>
                    <li>
                      <Link to="/features">Features</Link>
                    </li>
                    <li>
                      <Link to="/client">Clients</Link>
                    </li>
                    <li>
                      <Link to="/pricing">Pricing</Link>
                    </li>
                  </ul>
                </div>
                <div className="sidebar-modal-widget">
                  <h3 className="title">Contact Info</h3>
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
                    <li>
                      <Link to="https://www.facebook.com/share/x5wymXr6w7W49vaQ/?mibextid=qi2Omg" target="_blank" rel="noreferrer">
                      <i className="fa-brands fa-facebook-f" />
                      </Link>
                    </li>
                    <li>
                      <Link to="https://x.com/MenuMitra" target="_blank" rel="noreferrer">
                      <i className="fa-brands fa-x-twitter" />
                      </Link>
                    </li>
                    <li>
                      <Link to="https://www.linkedin.com/company/102429337/admin/dashboard/" target="_blank" rel="noreferrer">
                      <i className="fa-brands fa-linkedin-in" />
                      </Link>
                    </li>
                    <li>
                      <Link to="https://www.youtube.com/@menumitra" target="_blank" rel="noreferrer">
                      <i className="fa-brands fa-youtube"></i>
                      </Link>
                    </li>
                    <li>
                      <Link to="https://t.me/MenuMitra" target="_blank" rel="noreferrer">
                      <i className="fa-brands fa-telegram"></i>
                      </Link>
                    </li>
                    <li>
                      <Link to="https://www.instagram.com/menumitra/" target="_blank" rel="noreferrer">
                      <i className="fa-brands fa-instagram"></i>
                      </Link>
                    </li>
                  </ul>
                </div>
                <div className="sidebar-modal-widget">
                  <h3 className="title">Instagram</h3>
                  <ul className="instagram">
                    <li>
                      <a href="index.html#">
                        <img src={jpg1} alt="Instagram" />
                      </a>
                    </li>
                    <li>
                      <a href="index.html#">
                        <img src={jpg2} alt="Instagram" />
                      </a>
                    </li>
                    <li>
                      <a href="index.html#">
                        <img src={jpg3} alt="Instagram" />
                      </a>
                    </li>
                    <li>
                      <a href="index.html#">
                        <img src={jpg4} alt="Instagram" />
                      </a>
                    </li>
                    <li>
                      <a href="index.html#">
                        <img src={jpg5} alt="Instagram" />
                      </a>
                    </li>
                    <li>
                      <a href="index.html#">
                        <img src={jpg6} alt="Instagram" />
                      </a>
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
