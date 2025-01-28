import React from 'react';

const BlogLayout = () => {
  const posts = [
    {
      image: "/api/placeholder/400/300",
      category: "Cherish",
      title: "Cheering Cherries",
      date: "March 6th, 2022"
    },
    {
      image: "/api/placeholder/400/300",
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
              <a href="#" className="text-green-600 hover:text-green-800">
                <span className="sr-only">Twitter</span>
                <svg className="w-6 h-6 inline-block" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5 0-.278-.028-.556-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
                </svg>
              </a>
              <a href="#" className="text-green-600 hover:text-green-800">
                <span className="sr-only">Facebook</span>
                <svg className="w-6 h-6 inline-block" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                </svg>
              </a>
              <a href="#" className="text-green-600 hover:text-green-800">
                <span className="sr-only">Instagram</span>
                <svg className="w-6 h-6 inline-block" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                  <rect x="2" y="9" width="4" height="12"></rect>
                  <circle cx="4" cy="4" r="2"></circle>
                </svg>
              </a>
            </div>
            
            {/* Logo */}
            <div className="text-center">
              <h1 className="text-4xl font-serif">
                <a href="#" className="text-black hover:text-green-700">
                  Chateau de Oasis Blogs
                  <sup className="text-xl">TM</sup>
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
