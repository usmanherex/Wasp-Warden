import React, { useState, useEffect } from 'react';
import { useNavigate, Routes, Route } from 'react-router-dom';

const BlogLayout = () => {
  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();
  
  useEffect(() => {
    fetchPosts();
  }, [currentPage]);

  const fetchPosts = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/blogs?page=${currentPage}&per_page=9`);
      const data = await response.json();
      setPosts(data.blogs);
      setTotalPages(data.total_pages);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  const handlePostClick = (blogId) => {
    navigate(`/blog/${blogId}`);
  };

  return (
    <div className="min-h-screen bg-white">
      <header className="py-12 px-6">
        <div className="container mx-auto">
          <div className="relative text-center">  
            <h1 className="text-4xl font-bold mb-4 text-black-700">Blogs</h1>
            <p className="text-center text-gray-600 mb-12">
            Explore our latest blogs written by our experienced and knowledgeable writers!
        </p>
          </div>
        </div>

      </header>
      
      <div className="container mx-auto px-6 ">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {posts.map((post) => (
            <article 
              key={post.id} 
              className="bg-green-100 rounded-xl shadow-xl overflow-hidden transition-all duration-500 ease-in-out transform hover:shadow-2xl hover:-translate-y-2 hover:bg-green-200 cursor-pointer"
              onClick={() => handlePostClick(post.id)}
            >
              <div className="block">
                <figure className="overflow-hidden">
                  <img 
                    src={`http://localhost:5000/api/blogs/${post.id}/image`}
                    alt={post.title}
                    className="w-full h-64 object-cover rounded-t-xl transition-all duration-500 ease-in-out hover:scale-105 hover:brightness-95"
                  />
                </figure>

                <div className="p-6 text-center">
                  <span className="text-green-700 text-sm font-medium uppercase tracking-wider block mb-2">
                    {post.category}
                  </span>

                  <h2 className="text-2xl font-serif text-green-900 transition-colors duration-300 hover:text-green-600">
                    {post.title}
                  </h2>

                  <span className="text-green-600 text-sm uppercase tracking-wide block mt-2">
                    {post.date}
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="flex justify-center mt-10 space-x-4">
          <button 
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className={`px-4 py-2 rounded-md text-white ${currentPage === 1 ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-700 hover:bg-green-600'}`}
          >
            Previous
          </button>

          <span className="px-4 py-2 rounded-md bg-green-200 text-green-700">
            Page {currentPage} of {totalPages}
          </span>

          <button 
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className={`px-4 py-2 rounded-md text-white ${currentPage === totalPages ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-700 hover:bg-green-600'}`}
          >
            Next
          </button>
        </div>
      </div>

      <footer className="py-8 text-center">
        <p className="text-sm text-gray-600">&copy; All Rights Reserved.</p>
      </footer>
    </div>
  );
};

export default BlogLayout;