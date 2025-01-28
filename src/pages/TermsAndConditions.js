import React from 'react';
import { ScrollText, Leaf, Shield, Scale } from 'lucide-react';

const TermsAndConditions = () => {
  const sections = [
    {
      title: "1. Services Overview",
      icon: <Leaf className="w-6 h-6 text-green-600" />,
      content: [
        "1.1 IoT Monitoring Services: Our platform provides real-time monitoring of agricultural conditions through IoT devices. Users are responsible for maintaining their devices and ensuring accurate data transmission.",
        "1.2 AI Disease Detection: Our artificial intelligence models assist in crop disease detection. While we strive for accuracy, results should be verified by agricultural experts.",
        "1.3 Marketplace Services: We facilitate transactions between buyers and sellers of agricultural products. We act solely as a platform and are not responsible for the quality of products traded."
      ]
    },
    {
      title: "2. User Responsibilities",
      icon: <Shield className="w-6 h-6 text-green-600" />,
      content: [
        "2.1 Account Security: Users must maintain the confidentiality of their account credentials and promptly notify us of any unauthorized access.",
        "2.2 Data Accuracy: Users are responsible for providing accurate information about their products, farming conditions, and other submitted data.",
        "2.3 Compliance: Users must comply with all applicable agricultural laws and regulations in their jurisdiction."
      ]
    },
    {
      title: "3. Data Rights and Privacy",
      icon: <ScrollText className="w-6 h-6 text-green-600" />,
      content: [
        "3.1 Data Collection: We collect data from IoT devices, user interactions, and marketplace transactions to improve our services.",
        "3.2 Data Usage: Collected data may be used to train AI models and enhance platform functionality.",
        "3.3 Data Sharing: User data is shared only with explicit consent or as required by law."
      ]
    },
    {
      title: "4. Marketplace Rules",
      icon: <Scale className="w-6 h-6 text-green-600" />,
      content: [
        "4.1 Transaction Terms: All marketplace transactions must be conducted through our platform's payment system.",
        "4.2 Product Quality: Sellers must accurately describe their agricultural products and maintain quality standards.",
        "4.3 Dispute Resolution: We provide a mediation process for resolving disputes between buyers and sellers."
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-green-50">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-4xl font-bold text-green-800 mb-8 text-center">
            Terms and Conditions
          </h1>
          
          <div className="space-y-8">
            <p className="text-gray-600 leading-relaxed">
              Welcome to AgriTech Platform. By accessing our services, you agree to these terms and conditions. Our platform provides IoT monitoring, AI-powered disease detection, and marketplace services for the agricultural sector.
            </p>

            {sections.map((section, index) => (
              <div key={index} className="border-b border-green-100 pb-6 last:border-b-0">
                <div className="flex items-center gap-3 mb-4">
                  {section.icon}
                  <h2 className="text-2xl font-semibold text-green-700">
                    {section.title}
                  </h2>
                </div>
                <div className="space-y-4">
                  {section.content.map((text, idx) => (
                    <p key={idx} className="text-gray-600 leading-relaxed pl-9">
                      {text}
                    </p>
                  ))}
                </div>
              </div>
            ))}

            <div className="mt-8 p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-gray-600 text-center">
                Last updated: January 2025. For questions about these terms, please contact our support team.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions;