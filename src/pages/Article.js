import React from 'react';
import Image from '../assets/blogImages/croissant.jpg'
const Article = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="py-12 px-8">
        <div className="container mx-auto">
          <div className="text-center">
            {/* Social Links */}
            <ul className="flex justify-end space-x-4 mb-8">
              <li><a href="#" className="text-gray-800 hover:text-yellow-500"><i className="icon-twitter"></i></a></li>
              <li><a href="#" className="text-gray-800 hover:text-yellow-500"><i className="icon-facebook"></i></a></li>
              <li><a href="#" className="text-gray-800 hover:text-yellow-500"><i className="icon-instagram"></i></a></li>
            </ul>
            
            <h1 className="text-4xl font-serif">
              <a href="/" className="text-black hover:text-yellow-500">
              The Hive Mind 
              </a>
            </h1>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Article */}
          <article className="mb-20">
            {/* Featured Image */}
            <figure className="mb-8">
              <img 
                src='https://placehold.co/600x400'
                alt="French Croissant" 
                className="w-full h-auto rounded-lg"
              />
            </figure>

            {/* Meta */}
            <div className="text-center mb-8">
              <span className="text-gray-600 font-sans text-sm uppercase tracking-wider">Travel</span>
              <h2 className="text-5xl font-serif text-black mt-4 mb-4">La French</h2>
              <span className="text-gray-500 font-sans text-sm uppercase tracking-wider">March 6th, 2016</span>
            </div>

            {/* Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <p className="text-gray-800 leading-relaxed mb-6">
                  The bakery, located inside the hotel chain, is a collaboration between the hotel and a renowned French pastry chef. The chef brings with him decades of experience and expertise in the art of French baking, and his creations are already attracting food lovers from all over.
                </p>
                <p className="text-gray-800 leading-relaxed mb-6">
                  The bakery offers a range of classic French pastries, including croissants, pain au chocolat, and brioche, as well as a variety of savory options like quiches and sandwiches. Each pastry is made using traditional French techniques and the finest ingredients, ensuring that the flavors and textures are perfectly balanced.
                </p>
                <p className="text-gray-800 leading-relaxed mb-6">
                  But it's not just the food that makes the bakery special. The ambiance and decor of the bakery have been designed to transport guests to the heart of Paris. The bakery features a charming interior with white and blue tiles, vintage posters, and an open kitchen where guests can watch the pastry chefs at work.
                </p>
              </div>

              {/* Highlight Box */}
              <div className="lg:col-span-1">
                <div className="border-4 border-gray-100 p-6">
                  <h4 className="text-sm uppercase tracking-wider text-gray-500 mb-4">Fresh Bread & Beyond</h4>
                  <p className="font-serif text-black text-lg">
                    The aroma of freshly baked bread and pastries is enough to transport anyone to the streets of Paris. And now, guests at a hotel chain can experience the delights of French baking right at their doorstep with the opening of a new French bakery.
                  </p>
                </div>
              </div>
            </div>

            {/* Blockquote */}
            <blockquote className="text-center my-12 px-8">
              <p className="font-serif text-2xl italic text-gray-800 mb-4">
                "The bakery's authentic French pastries, freshly baked bread, and inviting ambiance are sure to make it a popular destination for both hotel guests and locals alike."
              </p>
              <cite className="text-gray-600">— Jean Smith</cite>
            </blockquote>
          </article>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-8 text-center">
        <p className="text-sm text-gray-600">&copy; All Rights Reserved.</p>
      </footer>
    </div>
  );
};

export default Article;
