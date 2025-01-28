import React from 'react';
import { Shield, Database, Eye, Bell, Lock, Share2 } from 'lucide-react';

const PrivacyPolicy = () => {
  const sections = [
    {
      title: "1. Information We Collect",
      icon: <Database className="w-6 h-6 text-green-600" />,
      content: [
        {
          subtitle: "1.1 Personal Information",
          text: "We collect information such as your name, contact details, farm location, and payment information when you register for our services."
        },
        {
          subtitle: "1.2 IoT Device Data",
          text: "Our IoT devices collect environmental data including soil conditions, temperature, humidity, and other agricultural metrics from your farm."
        },
        {
          subtitle: "1.3 AI Analysis Data",
          text: "When using our disease detection services, we collect images and data about your crops for analysis and improvement of our AI models."
        }
      ]
    },
    {
      title: "2. How We Use Your Data",
      icon: <Eye className="w-6 h-6 text-green-600" />,
      content: [
        {
          subtitle: "2.1 Service Improvement",
          text: "We analyze collected data to improve our IoT monitoring systems and AI detection accuracy for better agricultural insights."
        },
        {
          subtitle: "2.2 Marketplace Operations",
          text: "Your information is used to facilitate marketplace transactions and connect buyers with sellers in our agricultural community."
        },
        {
          subtitle: "2.3 Communications",
          text: "We use your contact information to send important updates about our services, agricultural alerts, and marketplace activities."
        }
      ]
    },
    {
      title: "3. Data Protection",
      icon: <Lock className="w-6 h-6 text-green-600" />,
      content: [
        {
          subtitle: "3.1 Security Measures",
          text: "We implement industry-standard security protocols to protect your personal information and agricultural data from unauthorized access."
        },
        {
          subtitle: "3.2 Data Storage",
          text: "Your data is stored on secure servers with regular backups and encryption to ensure data integrity and protection."
        },
        {
          subtitle: "3.3 Access Controls",
          text: "We maintain strict access controls and authentication procedures for all system users and administrators."
        }
      ]
    },
    {
      title: "4. Data Sharing",
      icon: <Share2 className="w-6 h-6 text-green-600" />,
      content: [
        {
          subtitle: "4.1 Third-Party Services",
          text: "We may share data with trusted third-party service providers who assist us in operating our platform, conducting business, or servicing you."
        },
        {
          subtitle: "4.2 Legal Requirements",
          text: "We may disclose your information when required by law or to protect our rights, privacy, safety, or property."
        },
        {
          subtitle: "4.3 Aggregated Data",
          text: "We may share anonymous, aggregated data for research and development purposes to improve agricultural practices."
        }
      ]
    },
    {
      title: "5. Your Rights",
      icon: <Shield className="w-6 h-6 text-green-600" />,
      content: [
        {
          subtitle: "5.1 Data Access",
          text: "You have the right to access, correct, or delete your personal information stored on our platform."
        },
        {
          subtitle: "5.2 Data Portability",
          text: "You can request a copy of your data in a structured, commonly used format."
        },
        {
          subtitle: "5.3 Communication Preferences",
          text: "You can manage your communication preferences and opt-out of non-essential communications."
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-green-50">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-4xl font-bold text-green-800 mb-8 text-center">
            Privacy Policy
          </h1>

          <div className="bg-green-100 rounded-lg p-6 mb-8">
            <div className="flex items-center gap-2 mb-3">
              <Bell className="w-5 h-5 text-green-600" />
              <h2 className="text-lg font-semibold text-green-700">
                Last Updated: January 2025
              </h2>
            </div>
            <p className="text-gray-700 leading-relaxed">
              Your privacy is important to us. This policy outlines how we collect, use, and protect your personal and agricultural data while providing our IoT monitoring, AI disease detection, and marketplace services.
            </p>
          </div>

          <div className="space-y-10">
            {sections.map((section, index) => (
              <div key={index} className="border-b border-green-100 pb-8 last:border-b-0">
                <div className="flex items-center gap-3 mb-6">
                  {section.icon}
                  <h2 className="text-2xl font-semibold text-green-700">
                    {section.title}
                  </h2>
                </div>
                <div className="space-y-6">
                  {section.content.map((item, idx) => (
                    <div key={idx} className="pl-9">
                      <h3 className="font-medium text-green-600 mb-2">
                        {item.subtitle}
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {item.text}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 p-4 bg-green-50 rounded-lg">
            <p className="text-sm text-gray-600 text-center">
              For questions about our privacy practices or to exercise your data rights, please contact our Data Protection Officer at privacy@agritech.example.com
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;