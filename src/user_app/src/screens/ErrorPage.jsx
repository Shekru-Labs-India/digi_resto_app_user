import React from 'react'

function ErrorPage() {
  return (
    <>
      {/* <header class="header header-fixed style-3">
		<div class="header-content">
			
			<div class="mid-content"><h5 class="title">Error</h5></div>
			<div class="right-content"></div>
		</div>
	</header> */}

      <div class="page-content space-top">
        <div class="container">
          <div class="error-page">
            <div class="icon-bx">
              <i className="fas fa-exclamation-triangle fa-4x text-warning"></i>
            </div>
            <div class="clearfix">
              <h2 class="title text-primary">Sorry</h2>
              <p>Table having issue rescan the QR Code again!.</p>
            </div>
          </div>
          <div class="error-img">
            <img src="assets/images/error.png" alt="" />
          </div>
        </div>
      </div>
    </>
  );
}

export default ErrorPage