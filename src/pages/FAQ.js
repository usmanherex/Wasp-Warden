import React, { useState, useEffect, useRef } from 'react';

const AnimatedCounter = ({ end, duration = 2000, label }) => {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const counterRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (counterRef.current) {
      observer.observe(counterRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    let startTime;
    const startValue = 0;
    
    const animate = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const progress = (currentTime - startTime) / duration;

      if (progress < 1) {
        const currentCount = Math.floor(startValue + (end - startValue) * progress);
        setCount(currentCount);
        requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    };

    requestAnimationFrame(animate);
  }, [end, duration, isVisible]);

  return (
    <CircleProgress percentage={count} label={label} ref={counterRef} />
  );
};

const CircleProgress = React.forwardRef(({ percentage, label }, ref) => (
  <div ref={ref} className="relative w-32 h-32 transform transition-all duration-500 hover:scale-105">
    <svg className="w-full h-full" viewBox="0 0 100 100">
      <circle
        className="text-green-100"
        strokeWidth="8"
        stroke="currentColor"
        fill="transparent"
        r="40"
        cx="50"
        cy="50"
      />
      <circle
        className="text-green-600 transform -rotate-90 origin-center transition-all duration-1000"
        strokeWidth="8"
        strokeDasharray={`${percentage * 2.51327} 251.327`}
        strokeLinecap="round"
        stroke="currentColor"
        fill="transparent"
        r="40"
        cx="50"
        cy="50"
      />
    </svg>
    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
      <span className="text-2xl font-bold text-gray-900">{percentage}%</span>
      <p className="text-xs text-gray-600 mt-1 whitespace-pre-wrap max-w-[80px]">{label}</p>
    </div>
  </div>
));

const AdditionalFAQSection = () => {
  const [expandedQuestion, setExpandedQuestion] = useState(null);

  const additionalQuestions = [
    {
      question: "What types of IoT devices do you offer for farm monitoring?",
      answer: "We offer a comprehensive range of IoT devices including soil moisture sensors, weather stations, crop growth monitors, and automated irrigation systems. Each device is carefully calibrated for agricultural use and can be integrated into our central monitoring platform."
    },
    {
      question: "How accurate is your AI disease detection system?",
      answer: "Our AI disease detection system has achieved over 95% accuracy in identifying common crop diseases. The system is continuously trained on new data and validated by agricultural experts to ensure reliable results. However, we recommend using it as a support tool alongside traditional farming expertise."
    },
    {
      question: "What commission do you charge on marketplace transactions?",
      answer: "We charge a competitive 3% commission on successful sales through our marketplace. This includes secure payment processing, buyer-seller verification, and basic dispute resolution services. Volume sellers may qualify for reduced rates."
    },
    {
      question: "Do you provide training for using the IoT devices and AI systems?",
      answer: "Yes, we provide comprehensive training through both online modules and in-person sessions. Our team of agricultural technology experts will help you set up the systems and teach you how to interpret the data effectively for better farm management."
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-16 bg-gray-50">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div>
          <span className="text-green-600 uppercase tracking-wide text-sm">FREQUENTLY ASKED QUESTIONS</span>
          <h2 className="text-4xl font-bold text-gray-900 mt-2 mb-6">
            Have Questions About Our AgriTech Solutions?
          </h2>
          <p className="text-gray-600 mb-8">
            If you have any questions about our IoT devices, AI models, or marketplace, feel free to reach out to our agricultural technology experts!
          </p>

          <div className="flex flex-wrap gap-8 mt-8">
            <AnimatedCounter end={95} label="AI Detection Accuracy" />
            <AnimatedCounter end={88} label="Farmer Satisfaction Rate" />
          </div>
        </div>

        <div className="space-y-4">
          {additionalQuestions.map((item, index) => (
            <div 
              key={index} 
              className="bg-white rounded-lg shadow-sm transform transition-all duration-300 hover:shadow-md"
            >
              <button
                onClick={() => setExpandedQuestion(expandedQuestion === index ? null : index)}
                className="w-full flex justify-between items-center p-4 text-left"
              >
                <span className="text-lg text-gray-900 pr-8">{item.question}</span>
                <span className={`text-green-600 text-2xl flex-shrink-0 transition-transform duration-300 ${
                  expandedQuestion === index ? 'rotate-180' : ''
                }`}>
                  ＋
                </span>
              </button>
              <div className={`overflow-hidden transition-all duration-300 ease-in-out ${
                expandedQuestion === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
              }`}>
                <div className="p-4 pt-0 text-gray-600">
                  {item.answer}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const FAQSection = () => {
  const [activeTab, setActiveTab] = useState('team');
  const [expandedQuestion, setExpandedQuestion] = useState(null);

  const questions = {
    general: [
      {
        question: "How do I get started with your IoT farming solutions?",
        answer: "Getting started is simple. First, schedule a consultation with our team to assess your farm's needs. We'll then recommend the right combination of IoT devices and set up a customized monitoring system for your farm."
      },
      {
        question: "What kind of support do you provide?",
        answer: "We provide 24/7 technical support for our IoT devices and AI systems, regular maintenance checks, and continuous system updates. Our agricultural experts are also available for consultation on implementing the insights from our systems."
      }
    ],
    service: [
      {
        question: "How does the crop disease detection system work?",
        answer: "Our AI-powered disease detection system uses advanced image recognition technology. Simply upload photos of concerning plant symptoms through our mobile app, and our AI will analyze them for signs of common crop diseases, providing quick and accurate results."
      },
      {
        question: "What types of products can I sell on your marketplace?",
        answer: "You can sell a wide range of agricultural products including crops, seeds, organic fertilizers, and farming equipment. All items must meet our quality standards and comply with local agricultural regulations."
      }
    ],
    team: [
      {
        question: "What qualifications do your agricultural experts have?",
        answer: "Our team includes certified agronomists, agricultural technologists, and AI specialists with extensive experience in modern farming techniques and technology implementation."
      },
      {
        question: "Do your experts provide multilingual support?",
        answer: "Yes, our team members are proficient in multiple languages to better serve our diverse farming community. We can provide technical support and training in various regional languages."
      },
      {
        question: "Are your experts available 24/7?",
        answer: "Yes, we maintain a 24/7 support system with agricultural experts available for emergency consultations and technical assistance whenever you need it."
      }
    ]
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <div className="mb-12">
        <span className="text-green-600">FAQ</span>
        <h2 className="text-4xl font-bold mt-2 mb-4">Frequently Asked Questions</h2>
        <p className="text-gray-600 max-w-2xl">
          Welcome to our FAQ section! You'll find answers to common queries about our agricultural IoT solutions, AI disease detection, and marketplace services. If you don't see your question here, feel free to contact us—we're here to help!
        </p>
        <button className="mt-6 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors duration-200">
          Read More
        </button>
      </div>

      <div className="flex flex-col space-y-8">
        <div className="flex space-x-4 border-b border-gray-200">
          {['General', 'Service', 'Team'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab.toLowerCase())}
              className={`pb-4 px-4 text-lg relative transition-colors duration-300 ${
                activeTab === tab.toLowerCase()
                  ? 'text-green-600 font-medium'
                  : 'text-gray-500 hover:text-green-600'
              }`}
            >
              {tab}
              {activeTab === tab.toLowerCase() && (
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-green-600 animate-slide-in"></div>
              )}
            </button>
          ))}
        </div>

        <div className="space-y-4">
          {questions[activeTab].map((item, index) => (
            <div 
              key={index} 
              className="border-b border-gray-200 last:border-b-0 transform transition-all duration-300 hover:bg-gray-50"
            >
              <button
                onClick={() => setExpandedQuestion(expandedQuestion === index ? null : index)}
                className="w-full flex justify-between items-center py-4 text-left"
              >
                <span className="text-lg text-gray-900">{item.question}</span>
                <div className={`w-6 h-6 flex items-center justify-center rounded-full bg-green-600 text-white transition-transform duration-300 ${
                  expandedQuestion === index ? 'rotate-180' : ''
                }`}>
                  ＋
                </div>
              </button>
              <div className={`transition-all duration-300 ease-in-out overflow-hidden ${
                expandedQuestion === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
              }`}>
                <div className="pb-4 text-gray-600">
                  {item.answer}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {AdditionalFAQSection()}
    </div>
  );
};

export default FAQSection;