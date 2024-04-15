import React from 'react';

const CartItem = ({ imageUrl, productName, currentPrice, oldPrice, reviewCount, quantity }) => {
    return (
        <div className="col-12 mb-3">
            <div className="cart-list">
                <div className="dz-media media-75">
                    <img src={imageUrl} alt="Product" />
                </div>
                <div className="dz-content">
                    <h6 className="title"><a href="product-detail.html">{productName}</a></h6>
                    <div className="price-wrapper">
                        <h6 className="current-price">{currentPrice}</h6>
                        <span className="old-price">{oldPrice}</span>
                    </div>
                    <p className="review_count mb-0"><i class='bx bxs-star staricons'  ></i> <span>{reviewCount}</span></p>
                    <div className="dz-quantity">Quantity: <span className="quantity">{quantity}</span></div>
                </div>
                <a href="" className="dz-icon icon-sm"><i class='bx bx-x'></i></a>
            </div>
        </div>
    );
};

const ItemsCart = () => {
    return (
        <div className="dz-box bg-white style-2">
            <div className="title-bar">
                <h4 className="title">Items in your cart</h4>
                <a href="cart.html" className="font-13 font-w500">View Cart</a>
            </div>
            <div className="row m-b20">
                <CartItem 
                    imageUrl="assets/images/product/1.jpg"
                    productName="Velvet Violet Vines (M)"
                    currentPrice="₹830"
                    oldPrice="₹1000"
                    reviewCount="Review Count"
                    quantity={1}
                />
                <CartItem 
                    imageUrl="assets/images/product/1.jpg"
                    productName="Velvet Violet Vines (M)"
                    currentPrice="₹830"
                    oldPrice="₹1000"
                    reviewCount="Review Count"
                    quantity={1}
                />
            </div>
            <ul className="total-prize">
                <li className="name">Subtotal</li>
                <li className="prize">$3,599</li>
            </ul>
            <a href="checkout.html" className="btn w-100 btn-primary btn-thin rounded-xl">
                Proceed to checkout (3)
            </a>
        </div>
    );
};

export default ItemsCart;
