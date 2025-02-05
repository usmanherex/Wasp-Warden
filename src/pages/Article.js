import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const Article = () => {
  const [article, setArticle] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/blogs/${id}`);
        if (!response.ok) {
          throw new Error('Article not found');
        }
        const data = await response.json();
        setArticle(data);
      } catch (error) {
        console.error('Error fetching article:', error);
        navigate('/'); // Redirect to home if article not found
      }
    };

    fetchArticle();
  }, [id, navigate]);

  if (!article) {
    return (
      <div className="min-h-screen bg-white py-20">
        <div className="container mx-auto px-4 text-center">
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-20">
      {/* Back Button */}
      <div className="container mx-auto px-4 mb-8">
        <button 
          onClick={() => navigate('/')}
          className="text-gray-600 hover:text-gray-900 transition-colors duration-200"
        >
          ← Back to Articles
        </button>
      </div>
      
      {/* Main Content */}
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Article */}
          <article className="mb-20">
            {/* Featured Image */}
            {article.hasImage && (
              <img 
                src={`http://localhost:5000/api/blogs/${id}/image`}
                alt={article.title}
                className="mb-8 w-[1000px] h-[600px] object-cover mx-auto"
              />
            )}

            {/* Meta */}
            <div className="text-center mb-8">
              <span className="text-gray-600 font-sans text-sm uppercase tracking-wider">
                {article.category}
              </span>
              <h2 className="text-5xl font-serif text-black mt-4 mb-4">
                {article.title}
              </h2>
              <span className="text-gray-500 font-sans text-sm uppercase tracking-wider">
                {article.date} • By {article.author}
              </span>
            </div>

            {/* Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="text-gray-800 leading-relaxed mb-6 whitespace-pre-wrap">
                  {article.content}
                </div>
              </div>

              {/* Highlight Box */}
              {article.highlightBox && (
                <div className="lg:col-span-1">
                  <div className="border-4 border-gray-100 p-6">
                    <h4 className="text-sm uppercase tracking-wider text-gray-500 mb-4">
                      Highlight Box
                    </h4>
                    <p className="font-serif text-black text-lg">
                      {article.highlightBox}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Blockquote */}
            {article.quote && (
              <blockquote className="text-center my-12 px-8">
                <p className="font-serif text-2xl italic text-gray-800 mb-4">
                  {article.quote}
                </p>
                <cite className="text-gray-600">— {article.author}</cite>
              </blockquote>
            )}
          </article>
        </div>
      </div>
    </div>
  );
};

export default Article;