import React from 'react';
import Image from '../assets/blogImages/cherries.jpg'
import Image1 from '../assets/blogImages/croissant.jpg'
const BlogLayout = () => {
  const posts = [
    {
      image: Image,
      category: "Cherish",
      title: "Cheering Cherries",
      date: "March 6th, 2022"
    },
    {
      image: Image1,
      category: "Food & Drink",
      title: "Le French",
      date: "March 16th, 2017"
    },
    {
      image: "/api/placeholder/400/300",
      category: "Style",
      title: "Robust Wine and Vegetable Pasta",
      date: "September 2nd, 2020"
    },
    {
      image: "/api/placeholder/400/300",
      category: "Food & Drink",
      title: "Steak Frenzy",
      date: "November 19th, 2021"
    },
    {
      image: "/api/placeholder/400/300",
      category: "New Branch",
      title: "The Perfect Opening",
      date: "April 20th, 2023"
    },
    {
      image: "/api/placeholder/400/300",
      category: "Travel, Style",
      title: "A Modernize Huge and Beautiful Building",
      date: "Jan 22nd, 2023"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="py-12 px-6">
        <div className="container mx-auto">
          <div className="relative">
            {/* Social Links */}
            <div className="absolute right-0 top-2 space-x-4">
            
            </div>
            
            {/* Logo */}
            <div className="text-center">
              <h1 className="text-4xl font-serif">
                <a href="#" className="text-black hover:text-green-700">
                The Hive Mind
                  
                </a>
              </h1>
            </div>
          </div>
        </div>
      </header>

      {/* Blog Grid */}
      <div className="container mx-auto px-6 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post, index) => (
            <article key={index} className="group">
              <a href="#" className="block">
                <figure className="mb-4 overflow-hidden">
                  <img 
                    src={post.image} 
                    alt={post.title}
                    className="w-full transition-opacity duration-300 group-hover:opacity-40"
                  />
                </figure>
                <div className="text-center">
                  <span className="text-green-600 text-sm mb-2 block">{post.category}</span>
                  <h2 className="font-serif text-2xl mb-2 text-black group-hover:text-green-700">
                    {post.title}
                  </h2>
                  <span className="text-gray-500 text-sm uppercase tracking-wider">{post.date}</span>
                </div>
              </a>
            </article>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="py-8 text-center">
        <p className="text-sm text-gray-600">&copy; All Rights Reserved.</p>
      </footer>
    </div>
  );
};

export default BlogLayout;
