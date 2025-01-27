import axios from 'axios';
import { faker } from '@faker-js/faker';

const API_BASE_URL = 'http://localhost:5000/api'; // Adjust this to match your backend URL

// Notification templates (using the same ones from before)
const notificationTypes = [
  'order',
  'alert',
  'promotion',
  'report',
  'message',
  'system',
  'security'
];

const notificationTemplates = [
  {
    type: 'order',
    templates: [
      "New order #{orderId} has been placed in your mart",
      "Order #{orderId} has been successfully delivered",
      "Your order #{orderId} is ready for pickup"
    ]
  },
  {
    type: 'alert',
    templates: [
      "Your IoT device '{deviceName}' detected unusual activity",
      "High temperature alert from your {deviceName}",
      "Low moisture levels detected in {deviceName}"
    ]
  },
  {
    type: 'promotion',
    templates: [
      "Special offer: {discount}% off on your next purchase!",
      "Limited time deal: Buy one get one free on seeds",
      "Flash sale: Agricultural tools at {discount}% discount"
    ]
  },
  {
    type: 'report',
    templates: [
      "Your monthly Warden report is ready",
      "Weekly performance summary available",
      "New analytics report generated for your farm"
    ]
  },
  {
    type: 'message',
    templates: [
      "New message from Support regarding your inquiry",
      "Vendor {vendorName} sent you a message",
      "New response to your question about {topic}"
    ]
  },
  {
    type: 'system',
    templates: [
      "System maintenance scheduled for {time}",
      "Important: Platform update notification",
      "New feature available: {featureName}"
    ]
  },
  {
    type: 'security',
    templates: [
      "New login detected from {location}",
      "Your password was changed successfully",
      "Security alert: Unusual activity detected"
    ]
  }
];

const generateNotification = () => {
  const type = notificationTypes[Math.floor(Math.random() * notificationTypes.length)];
  const typeTemplates = notificationTemplates.find(t => t.type === type).templates;
  let text = typeTemplates[Math.floor(Math.random() * typeTemplates.length)];

  // Replace placeholders with random values
  text = text
    .replace('{orderId}', faker.number.int({ min: 1000, max: 9999 }))
    .replace('{deviceName}', faker.helpers.arrayElement(['Garden Sensor', 'Temperature Monitor', 'Moisture Sensor', 'Weather Station']))
    .replace('{discount}', faker.number.int({ min: 10, max: 50 }))
    .replace('{vendorName}', faker.company.name())
    .replace('{topic}', faker.helpers.arrayElement(['pest control', 'irrigation', 'soil health', 'crop rotation']))
    .replace('{time}', faker.date.future().toLocaleString())
    .replace('{location}', faker.location.city())
    .replace('{featureName}', faker.helpers.arrayElement(['Crop Tracking', 'Weather Alerts', 'Market Analysis', 'Supply Chain Manager']));

  return {
    user_id: 12, // Fixed user ID as requested
    type,
    text
  };
};

const sendNotificationToBackend = async (notification) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/notifications`, notification);
    console.log(`✅ Successfully created notification: ${notification.text}`);
    return response.data;
  } catch (error) {
    console.error(`❌ Failed to create notification: ${error.message}`);
    throw error;
  }
};

const seedNotifications = async (count = 5) => {
  console.log(`Starting to seed ${count} notifications for user ID 12...`);
  
  try {
    const promises = Array(count)
      .fill(null)
      .map(() => sendNotificationToBackend(generateNotification()));
    
    await Promise.all(promises);
    console.log('✨ Successfully seeded all notifications!');
  } catch (error) {
    console.error('Failed to seed notifications:', error);
  }
};

// Execute the seeder
seedNotifications(5);

// If you want to run this from the command line:
if (require.main === module) {
  seedNotifications(5)
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}