import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card2';
import { Download, FileText, Search, Calendar, User, BrainCircuit, Trash2 } from 'lucide-react';
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';



import Image4 from '../assets/images/ward.png';

// Create styles
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 12,
    fontFamily: 'Helvetica',
  },
  headerSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
    borderBottom: 1, // Changed from '2px solid' to number
    borderColor: '#166534',
    paddingBottom: 20,
  },
  logoSection: {
    width: 120,
  },
  logo: {
    width: 100,
    height: 80,
  },
  titleSection: {
    flex: 1,
    textAlign: 'right',
  },
  companyName: {
    fontSize: 24,
    color: '#166534',
    marginBottom: 5,
  },
  title: {
    fontSize: 20,
    color: '#166534',
    marginBottom: 5,
  },
  reportInfo: {
    marginBottom: 25,
    backgroundColor: '#F0FDF4',
    padding: 15,
    borderRadius: 5,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  label: {
    width: 120,
    color: '#166534',
  },
  value: {
    flex: 1,
    color: '#374151',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    backgroundColor: '#166534',
    color: 'white',
    padding: 8,
    marginBottom: 10,
  },
  detectionImage: {
    width: 400,
    height: 300,
    marginVertical: 15,
    alignSelf: 'center',
    border: 1, // Changed from '1px solid' to number
    borderColor: '#E5E7EB',
  },
  bulletPoint: {
    flexDirection: 'row',
    marginBottom: 5,
    paddingLeft: 15,
  },
  bullet: {
    width: 15,
    color: '#166534',
  },
  bulletText: {
    flex: 1,
  },
  severity: {
    padding: 8,
    borderRadius: 4,
    marginTop: 10,
    textAlign: 'center',
  },
  severitySevere: {
    backgroundColor: '#FEE2E2',
    color: '#991B1B',
  },
  severityHigh: {
    backgroundColor: '#FECACA',
    color: '#B91C1C',
  },
  severityMedium: {
    backgroundColor: '#FEF3C7',
    color: '#92400E',
  },
  severityLow: {
    backgroundColor: '#DCFCE7',
    color: '#166534',
  },
  userInfo: {
    marginTop: 10,
    borderTop: 1, // Changed from '1px solid' to number
    borderColor: '#E5E7EB',
    paddingTop: 10,
  },
});

const ReportPDF = ({ report, userName }) => {
  // Helper function to split text into bullet points
  const createBulletPoints = (text) => {
    if (!text) return [];
    return text.split('.').filter(item => item.trim().length > 0);
  };

  // Helper function to get severity style
  const getSeverityStyle = (severity) => {
    if (!severity) return styles.severityLow;
    const severityLower = severity.toLowerCase();
    switch (severityLower) {
      case 'severe':
        return styles.severitySevere;
      case 'high':
        return styles.severityHigh;
      case 'medium':
        return styles.severityMedium;
      case 'low':
        return styles.severityLow;
      default:
        return styles.severityLow;
    }
  };

  // Safe base64 image conversion
  const getImageSource = () => {
    try {
      if (!report.imageData) return null;
      if (typeof report.imageData === 'string') {
        if (report.imageData.startsWith('data:')) {
          return report.imageData;
        }
        return `data:image/jpeg;base64,${report.imageData}`;
      }
      return null;
    } catch (error) {
      console.error('Error processing image:', error);
      return null;
    }
  };

  const imageSource = getImageSource();

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header Section */}
        <View style={styles.headerSection}>
          <View style={styles.logoSection}>
            <Image src={Image4} style={styles.logo} />
          </View>
          <View style={styles.titleSection}>
            <Text style={styles.companyName}>Wasp Warden</Text>
            <Text style={styles.title}>AI Detection Report</Text>
          </View>
        </View>

        {/* Report Information */}
        <View style={styles.reportInfo}>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Report ID:</Text>
            <Text style={styles.value}>{report?.reportID || 'N/A'}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Submitted By:</Text>
            <Text style={styles.value}>{userName || 'N/A'}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Date:</Text>
            <Text style={styles.value}>
              {report?.timestamp ? new Date(report.timestamp).toLocaleString() : 'N/A'}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Model:</Text>
            <Text style={styles.value}>{report?.modelName || 'N/A'}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Detected Issue:</Text>
            <Text style={styles.value}>{report?.detectedIssue || 'N/A'}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Confidence:</Text>
            <Text style={styles.value}>
              {report?.confidence ? `${report.confidence.toFixed(2)}%` : 'N/A'}
            </Text>
          </View>
          <Text style={[
            styles.severity,
            getSeverityStyle(report?.severity)
          ]}>
            Severity Level: {report?.severity || 'N/A'}
          </Text>
        </View>

        {/* Detection Image */}
        {imageSource && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Detection Image</Text>
            <Image src={imageSource} style={styles.detectionImage} />
          </View>
        )}

        {/* Treatment Section */}
        {report?.treatment && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Recommended Treatment</Text>
            {createBulletPoints(report.treatment).map((point, index) => (
              <View key={index} style={styles.bulletPoint}>
                <Text style={styles.bullet}>•</Text>
                <Text style={styles.bulletText}>{point.trim()}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Recommendations Section */}
        {report?.recommendations && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Recommendations</Text>
            {createBulletPoints(report.recommendations).map((point, index) => (
              <View key={index} style={styles.bulletPoint}>
                <Text style={styles.bullet}>•</Text>
                <Text style={styles.bulletText}>{point.trim()}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Preventive Measures Section */}
        {report?.preventiveMeasures && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Preventive Measures</Text>
            {createBulletPoints(report.preventiveMeasures).map((point, index) => (
              <View key={index} style={styles.bulletPoint}>
                <Text style={styles.bullet}>•</Text>
                <Text style={styles.bulletText}>{point.trim()}</Text>
              </View>
            ))}
          </View>
        )}

        {/* User Information Footer */}
        <View style={styles.userInfo}>
          <Text style={styles.value}>Report generated by: {userName || 'N/A'}</Text>
        </View>
      </Page>
    </Document>
  );
};

// Update the download button in your table to use PDFDownloadLink
const ReportDownloadButton = ({ report, userName }) => (
  <PDFDownloadLink
    document={<ReportPDF report={report} userName={userName} />}
    fileName={`${report.reportID}-detection-report.pdf`}
    className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
  >
    {({ loading }) => (
      <>
        <Download className="h-4 w-4 mr-1" />
        {loading ? 'Generating...' : 'Download PDF'}
      </>
    )}
  </PDFDownloadLink>
);

const AIReportsPage = () => {
  const [reports, setReports] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userName, setUserName] = useState('');
  // Get user info from localStorage
  const user = JSON.parse(localStorage.getItem('user'));

  const fetchUserName = async (userId) => {
    try {
      const response = await fetch(`http://localhost:5000/users/${userId}/name`);
      const data = await response.json();
      
      if (data.success) {
        setUserName(data.UserName); // Assuming the API returns UserName field
      }
    } catch (err) {
      console.error('Failed to fetch user name:', err);
    }
  };
  // Fetch reports from the database
  const fetchReports = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:5000/disease-reports/user/${user.userId}`);
      const data = await response.json();
      
      if (data.success) {
        setReports(data.reports);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Failed to fetch reports');
    } finally {
      setLoading(false);
    }
  };
  // Delete report
  const handleDeleteReport = async (reportId) => {
    if (!window.confirm('Are you sure you want to delete this report?')) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/disease-reports/${reportId}`, {
        method: 'DELETE',
      });
      const data = await response.json();

      if (data.success) {
        setReports(reports.filter(report => report.reportID !== reportId));
      } else {
        alert(data.message);
      }
    } catch (err) {
      alert('Failed to delete report');
    }
  };

  useEffect(() => {
    if (user.userId) {
      fetchReports();
      fetchUserName(user.userId);
    }
  }, [user.userId]);

  const filteredReports = reports.filter(report => 
    report.detectedIssue.toLowerCase().includes(searchTerm.toLowerCase()) ||
    report.reportID.toLowerCase().includes(searchTerm.toLowerCase()) ||
    report.modelName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!user.userId) {
    return (
      <div className="min-h-screen bg-green-50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-2xl font-bold text-gray-900">Please log in to view reports</h1>
        </div>
      </div>
    );
  }
 
  return (
  
    <div className="min-h-screen bg-green-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">AI Detection Reports</h1>
          <p className="mt-2 text-gray-600">View and download your previous AI detection results</p>
        </div>

        {/* Search and Stats */}
        <Card className="mb-8">
          <CardContent className="py-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="relative flex-1 max-w-xl">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="Search reports by ID, issue, or module name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex gap-4 text-sm">
                <div className="px-4 py-2 bg-green-100 rounded-md">
                  <span className="text-green-800 font-medium">{reports.length }</span>
                  <span className="ml-1 text-green-600">Total Reports</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      
        {/* Reports Table */}
        <Card>
          <CardContent className="p-0">
            {loading ? (
              <div className="text-center py-12">
                <p>Loading reports...</p>
              </div>
            ) : error ? (
              <div className="text-center py-12 text-red-600">
                <p>{error}</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-green-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Report ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Model</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Detection</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Confidence</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Severity</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredReports.map((report) => (
                      <tr key={report.reportID} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <FileText className="h-5 w-5 text-gray-400 mr-2" />
                            <span className="text-sm font-medium text-gray-900">{report.reportID}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                            <span className="text-sm text-gray-500">
                              {new Date(report.timestamp).toLocaleDateString()}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <BrainCircuit className="h-4 w-4 text-gray-400 mr-2" />
                            <span className="text-sm text-gray-500">{report.modelName
                            }</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-gray-900">{report.detectedIssue}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-gray-900">{report.confidence.toFixed(2)}%</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            report.severity === 'Severe' ? 'bg-red-100 text-red-800' :
                            report.severity === 'Moderate' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {report.severity}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right space-x-2">
                        <ReportDownloadButton report={report} userName={userName} />
                          <button
                            onClick={() => handleDeleteReport(report.reportID)}
                            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {!loading && !error && filteredReports.length === 0 && (
              <div className="text-center py-12">
                <FileText className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No reports found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {searchTerm ? 'Try adjusting your search terms.' : 'No AI detection reports available.'}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AIReportsPage;