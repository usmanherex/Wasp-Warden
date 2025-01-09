import React from 'react';
import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      
      <img
        src={product.image}
        alt={product.title}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="text-lg font-bold text-[#171313] truncate">
          {product.title}
        </h3>
        <p className="text-[#979797] truncate">{product.owner}</p>
        <div className="flex items-center my-2">
          <span className="text-[#34AC53] font-bold mr-2">
            {product.rating}
          </span>
          <i className="fas fa-star text-[#34AC53]"></i>
        </div>
        <p className="text-[#FF9933] font-bold">${product.price}</p>
        <Link to={`/product/${product.id}`}>
          <button className="bg-[#FF9933] text-[#171313] hover:bg-[#FF7F00] w-full rounded-md px-4 py-2">
            View Product
          </button>
        </Link>
      </div>
    </div>
  );
};

export default ProductCard;