/** 	=========================
	Template Name 	 : PlantZone
	Author			 : DexignZone
	Version			 : 1.0
	File Name		 : custom.js
	Author Portfolio : https://themeforest.net/user/dexignzone/portfolio

	Core script to handle the entire theme and core functions
**/

/* JavaScript Document */
jQuery(document).ready(function() {
    'use strict';
	
    // Get Started ==========
	if(jQuery('.get-started').length > 0){
		var swiper = new Swiper(".get-started", {
			speed: 2000,
			parallax: true,
			slidesPerView: "auto",
			spaceBetween: 30,
			loop: true,
			// autoplay: {
			// 	delay: 2000,
			// },
			pagination: {
				el: ".swiper-pagination",
				clickable: true,
			},
		});
	
		var swiper2 = new Swiper(".get-started2", {
			speed: 1500,
			spaceBetween: 0,
			slidesPerView: "auto",
			effect: "fade",
			loop: true,
		});
	
		// Connect the two swipers
		swiper.controller.control = swiper2;
		swiper2.controller.control = swiper;
	}
	

	// Banner Swiper ==========
	if(jQuery('.banner-swiper').length > 0){
		var swiper = new Swiper('.banner-swiper', {
			speed: 1500,
			spaceBetween: 0,
			parallax: true,
			slidesPerView: "auto",
			effect: "fade",
			loop:true,
			// autoplay: {
			// 	delay: 2000,
			// },
			pagination: {
                el: ".swiper-pagination",
                clickable: true,
			},
		});
	}

	// Category Swiper ==========
	if(jQuery('.dz-category-swiper').length > 0){
		var swiper = new Swiper('.dz-category-swiper', {
			speed: 500,
			slidesPerView: "auto",
			spaceBetween: 10,
			loop: true,
		});
	}
	
	// CategorySlide ==========
	if(jQuery('.category-slide').length > 0){
		var swiper = new Swiper('.category-slide', {
			speed: 500,
			spaceBetween: 5,
			loop: true,
			slidesPerView: "auto",
		});
	}
	
	// Product Swiper ==========
	if(jQuery('.dz-product-swiper').length > 0){
		var swiper = new Swiper('.dz-product-swiper', {
			speed: 500,
			slidesPerView: "auto",
			spaceBetween: 15,
			loop: true,
		});
	}

	// Recent Product Swiper ==========
	if(jQuery('.recent-product-swiper').length > 0){
		var swiper = new Swiper('.recent-product-swiper', {
			speed: 500,
			slidesPerView: "auto",
			spaceBetween: 15,
			loop: true,
		});
	}
	
	// Sponsored Product Swiper ==========
	if(jQuery('.sponsored-product-swiper').length > 0){
		var swiper = new Swiper('.sponsored-product-swiper', {
			speed: 1000,
			slidesPerView: "auto",
			spaceBetween: 15,
			loop: true,
		});
	}

	// Product Swiper ==========
	if(jQuery('.product-swiper').length > 0){
		var swiper = new Swiper('.product-swiper', {
			speed: 500,
			spaceBetween: 15,
			slidesPerView: "auto",
			centeredSlides: true,
			loop: true,
			autoplay: {
				delay: 2000,
			},
		});
	}

	// Offer Banner Swiper1 ==========
	if(jQuery('.offer-banner1').length > 0){
		var swiper = new Swiper('.offer-banner1', {
			speed: 500,
			spaceBetween: 15,
			slidesPerView: 1,
			loop:false,
			breakpoints: {
				991: {
				  slidesPerView: 2.5,
				  spaceBetween: 15
				},
				640: {
				  slidesPerView: 2,
				  spaceBetween: 15
				},
				420: {
				  slidesPerView: 1,
				  spaceBetween: 15
				}
			  }
		});
	}

	// Deals Swiper ==========
	if(jQuery('.deals-swiper').length > 0){
		var swiper = new Swiper('.deals-swiper', {
			speed: 500,
			spaceBetween: 0,
			slidesPerView: "auto",	
			centeredSlides: true,
			loop:true,
			autoplay: {
				delay: 2000,
			},
		});
	}

	// Featured Swiper ==========
	if(jQuery('.featured-swiper').length > 0){
		var swiper = new Swiper('.featured-swiper', {
			speed: 500,
			spaceBetween: 10,
			slidesPerView: "auto",
			loop:true,
		});
	}

	// Featured Swiper 2 ==========
	if(jQuery('.featured-swiper2').length > 0){
		var swiper = new Swiper('.featured-swiper2', {
			speed: 500,
			spaceBetween: 15,
			slidesPerView: "auto",
			loop:true,
		});
	}
	
	// ProductDetailSwiper ==========
	if(jQuery('.product-detail-swiper').length > 0){
		var swiper = new Swiper('.product-detail-swiper', {
			speed: 500,
			spaceBetween: 45,
			slidesPerView: "auto",
			centeredSlides: true,
			loop:true,
			autoplay: {
				delay: 2000,
			},
			pagination: {
                el: ".swiper-pagination",
                clickable: true,
			},
		});
	}
	
	// PaymentCardSwiper ==========
	if(jQuery('.payment-card-swiper').length > 0){
		var swiper = new Swiper('.payment-card-swiper', {
			speed: 200,
			slidesPerView: "1.2",
			spaceBetween: 10,
		});
	}
});
/* Document .ready END */