# **App Name**: SwiftAlert

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

## Backend Architecture:

### Entities:

-   **UserProfile**: Represents a user profile with their preferences and contact information.
-   **DisasterEvent**: Represents a disaster event with its type, location, and severity.
-   **Alert**: Represents an alert sent to a user regarding a disaster event.
-   **Insight**: Represents an AI-generated insight about a disaster event.

### Authentication:

-   **Providers**:
    -   Password
    -   Anonymous

### Firestore:

#### Structure:

-   `/users/{userId}`: Stores user profiles.
-   `/users/{userId}/alerts/{alertId}`: Stores alerts for each user.
-   `/disasterEvents/{disasterEventId}`: Stores information about disaster events.
-   `/disasterEvents/{disasterEventId}/insights/{insightId}`: Stores AI-generated insights for each disaster event.

#### Reasoning:

The Firestore structure is designed to support a real-time disaster alert system (PULSE) with a focus on scalability, security, and real-time data processing. The structure leverages denormalization to achieve authorization independence, enabling secure and efficient data access. It incorporates structural segregation based on access patterns, and Access Modeling (Standardization and Consistency) is implemented via Path-Based Ownership, where appropriate, and via Membership Maps where shared authorization is required.

-   **Authorization Independence (Denormalization)**: The `alerts` subcollection under each user profile denormalizes relevant information from the `DisasterEvent` to avoid `get()` calls in security rules.
-   **Structural Segregation**: User profiles are stored in a dedicated collection (`/users/{userId}`), ensuring consistent security requirements for all user-related data.
-   **Access Modeling**:
    -   **Private Data**: User profiles are accessed via path-based ownership (`/users/{userId}`), ensuring that only the authenticated user can access their profile data.
    -   **Collaborative Data**: Should the need arise, a Membership Map (members: {uid1: \"role\", uid2: \"role\"}) would be implemented in relevant documents or subcollections to manage access control for shared resources.
-   **QAPs (Rules are not Filters)**: The structure supports secure list operations.
-   **Invariants**: Ownership is enforced via path-based security rules for user profiles and alerts.
