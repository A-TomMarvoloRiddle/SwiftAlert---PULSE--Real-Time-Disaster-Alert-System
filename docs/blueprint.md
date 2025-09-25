# **App Name**: PULSE: Real-Time Disaster Alert System

## Core Features:

- Data Ingestion and Processing: Collect and process real-time data from USGS, OpenWeatherMap, NASA FIRMS, and weather APIs using Pub/Sub and Cloud Functions.
- Real-time Alerts: Send real-time alerts via SMS, email, and push notifications using Twilio, SendGrid, and Firebase Cloud Messaging (FCM).
- Interactive Map: Display disaster markers on a Google Maps interface, updated in real-time.
- Data Visualization: Present disaster trends and analytics using charts and graphs (Recharts or Chart.js).
- User Authentication and Preferences: Implement user authentication using Firebase Auth and allow users to set alert preferences based on location and disaster type; data is stored in Firestore.
- Admin Panel: Provide an admin panel for managing alerts and viewing detailed analytics.
- Automated Insights: Use an AI tool to proactively analyze incoming disaster data and produce brief insights suitable for integration directly into alert notifications.

## Style Guidelines:

- Primary color: Sky Blue (#87CEEB) to evoke calmness and trust during chaotic events.
- Background color: Light Gray (#F0F8FF) providing a clean and minimalist backdrop.
- Accent color: Orange (#FFA500) to highlight critical alerts and calls to action.
- Body and headline font: 'Inter', a grotesque-style sans-serif with a modern, machined, objective, neutral look; suitable for headlines or body text.
- Use clear, globally recognized icons for each disaster type (earthquake, flood, cyclone, wildfire).
- Implement a responsive grid layout to ensure optimal viewing on all devices (mobile, tablet, desktop).
- Use smooth transitions with Framer Motion to enhance user experience.