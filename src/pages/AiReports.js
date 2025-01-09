import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card2';
import { Download, FileText, Search, Calendar, User } from 'lucide-react';
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';
import Image2 from '../assets/images/strawberry.jpeg';
import Image4 from '../assets/images/rice.jpg';
// Define PDF styles
const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 12,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 10,
    color: '#166534', // green-800
  },
  reportInfo: {
    marginBottom: 20,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  label: {
    width: 120,
    fontWeight: 'bold',
    color: '#166534', // green-800
  },
  value: {
    flex: 1,
  },
  section: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#166534', // green-800
  },
  image: {
    width: 300,
    height: 200,
    marginBottom: 20,
    alignSelf: 'center',
  },
  list: {
    marginLeft: 20,
  },
  listItem: {
    marginBottom: 3,
  },
  severity: {
    padding: 5,
    borderRadius: 4,
    marginVertical: 5,
  },
  severitySevere: {
    backgroundColor: '#FEE2E2', // red-100
    color: '#991B1B', // red-800
  },
  severityModerate: {
    backgroundColor: '#FEF3C7', // yellow-100
    color: '#92400E', // yellow-800
  },
  severityLow: {
    backgroundColor: '#DCFCE7', // green-100
    color: '#166534', // green-800
  },
});

// PDF Document Component
const ReportPDF = ({ report }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.title}>AI Detection Report</Text>
        
        <View style={styles.reportInfo}>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Report ID:</Text>
            <Text style={styles.value}>{report.id}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Date:</Text>
            <Text style={styles.value}>
              {new Date(report.timestamp).toLocaleString()}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Submitted by:</Text>
            <Text style={styles.value}>{report.username}</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Detection Results</Text>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Detected Issue:</Text>
          <Text style={styles.value}>{report.detectedIssue}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Confidence:</Text>
          <Text style={styles.value}>{report.confidence.toFixed(2)}%</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={[
            styles.severity,
            report.severity === 'Severe' ? styles.severitySevere :
            report.severity === 'Moderate' ? styles.severityModerate :
            styles.severityLow
          ]}>
            Severity: {report.severity}
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Submitted Image</Text>
        <Image src={report.image} style={styles.image} />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recommended Treatment</Text>
        <Text style={styles.value}>{report.treatment}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recommendations</Text>
        <View style={styles.list}>
          {report.recommendations.map((rec, index) => (
            <Text key={index} style={styles.listItem}>• {rec}</Text>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Preventive Measures</Text>
        <View style={styles.list}>
          {report.preventiveMeasures.map((measure, index) => (
            <Text key={index} style={styles.listItem}>• {measure}</Text>
          ))}
        </View>
      </View>
    </Page>
  </Document>
);

// Update the download button in your table to use PDFDownloadLink
const ReportDownloadButton = ({ report }) => (
  <PDFDownloadLink
    document={<ReportPDF report={report} />}
    fileName={`${report.id}-detection-report.pdf`}
    className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
  >
    {({ blob, url, loading, error }) =>
      loading ? (
        'Generating...'
      ) : (
        <>
          <Download className="h-4 w-4 mr-1" />
          Download PDF
        </>
      )
    }
  </PDFDownloadLink>
);

const AIReportsPage = () => {
  // Dummy data for testing
  const dummyReports = [
    {
      id: "RPT-2025-001",
      timestamp: "2025-01-09T14:30:00",
      username: "JohnFarmer",
      detectedIssue: "Citrus Canker",
      confidence: 99.98,
      severity: "Severe",
      image: Image2,
      recommendations: [
        "Prune and destroy infected plant material",
        "Apply copper-based fungicides to protect plants",
        "Ensure proper spacing for good air circulation",
        "Avoid overhead watering to reduce leaf wetness"
      ],
      preventiveMeasures: [
        "Use disease-resistant citrus varieties",
        "Sterilize tools after pruning",
        "Inspect plants regularly for early signs of infection",
        "Control leaf miners, which spread the bacteria"
      ],
      treatment: "Copper hydroxide sprays"
    },
    {
      id: "RPT-2025-002",
      timestamp: "2025-01-08T10:15:00",
      username: "SarahGardener",
      detectedIssue: "Tomato Blight",
      confidence: 97.5,
      severity: "Moderate",
      image: Image4,
      recommendations: [
        "Remove infected leaves immediately",
        "Improve air circulation between plants",
        "Water at soil level to keep leaves dry"
      ],
      preventiveMeasures: [
        "Plant resistant varieties",
        "Rotate crops annually",
        "Maintain proper plant spacing"
      ],
      treatment: "Fungicidal spray treatment"
    }
  ];

  const [searchTerm, setSearchTerm] = useState('');

  const filteredReports = dummyReports.filter(report => 
    report.detectedIssue.toLowerCase().includes(searchTerm.toLowerCase()) ||
    report.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    report.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

 

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
                  placeholder="Search reports by ID, issue, or username..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex gap-4 text-sm">
                <div className="px-4 py-2 bg-green-100 rounded-md">
                  <span className="text-green-800 font-medium">{dummyReports.length}</span>
                  <span className="ml-1 text-green-600">Total Reports</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Reports Table */}
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-green-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Report ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Detection</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Confidence</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Severity</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredReports.map((report) => (
                    <tr key={report.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <FileText className="h-5 w-5 text-gray-400 mr-2" />
                          <span className="text-sm font-medium text-gray-900">{report.id}</span>
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
                          <User className="h-4 w-4 text-gray-400 mr-2" />
                          <span className="text-sm text-gray-500">{report.username}</span>
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
                      <td className="px-6 py-4 whitespace-nowrap text-right">
  <ReportDownloadButton report={report} />
</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredReports.length === 0 && (
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