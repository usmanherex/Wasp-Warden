import React, { useState, useEffect } from 'react';
import { useNavigate, Routes, Route } from 'react-router-dom';

const RandomPostsGrid = ({ posts, handlePostClick }) => {
  const [randomPosts, setRandomPosts] = useState([]);

  useEffect(() => {
    // Function to get 3 random posts
    const getRandomPosts = () => {
      const shuffled = [...posts].sort(() => 0.5 - Math.random());
      return shuffled.slice(0, 3);
    };

    setRandomPosts(getRandomPosts());
  }, [posts]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
      {randomPosts.map((post) => (
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
  );
};

const DashboardBlogLayout = () => {
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
     

      <div className="container mx-auto px-6 py-16">
        
          
      <RandomPostsGrid posts={posts} handlePostClick={handlePostClick} />

     
      </div>

    </div>
  );
};

export default DashboardBlogLayout;