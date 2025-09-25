
import { collection, writeBatch, doc, Firestore, getDocs } from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

const disasterData = [
  {
    "type": "earthquake",
    "location": "Tokyo, Japan",
    "latitude": 35.6895,
    "longitude": 139.6917,
    "timestamp": "2024-07-20T01:00:00Z",
    "magnitude": 7.2,
    "severity": "critical",
    "details": "Major earthquake causing widespread damage and power outages."
  },
  {
    "type": "flood",
    "location": "Kerala, India",
    "latitude": 10.8505,
    "longitude": 76.2711,
    "timestamp": "2024-07-19T18:30:00Z",
    "severity": "high",
    "details": "Severe flooding due to monsoon rains, displacing thousands."
  },
  {
    "type": "wildfire",
    "location": "California, USA",
    "latitude": 38.5816,
    "longitude": -121.4944,
    "timestamp": "2024-07-19T22:00:00Z",
    "severity": "high",
    "details": "Fast-moving wildfire threatening residential areas."
  },
  {
    "type": "cyclone",
    "location": "Queensland, AUS",
    "latitude": -20.9176,
    "longitude": 148.9621,
    "timestamp": "2024-07-20T04:00:00Z",
    "magnitude": 4,
    "severity": "critical",
    "details": "Category 4 cyclone making landfall with destructive winds."
  },
  {
    "type": "earthquake",
    "location": "Santiago, Chile",
    "latitude": -33.4489,
    "longitude": -70.6693,
    "timestamp": "2024-07-18T15:45:00Z",
    "magnitude": 6.8,
    "severity": "high",
    "details": "Strong earthquake felt across the central region."
  },
  {
    "type": "flood",
    "location": "Venice, Italy",
    "latitude": 45.4408,
    "longitude": 12.3155,
    "timestamp": "2024-07-19T09:00:00Z",
    "severity": "medium",
    "details": "'Acqua alta' reaching medium-high levels, flooding St. Mark's Square."
  },
  {
    "type": "wildfire",
    "location": "British Columbia, CAN",
    "latitude": 53.7267,
    "longitude": -127.6476,
    "timestamp": "2024-07-20T00:15:00Z",
    "severity": "medium",
    "details": "Multiple wildfires burning, air quality advisories in effect."
  },
  {
    "type": "earthquake",
    "location": "Christchurch, NZ",
    "latitude": -43.5321,
    "longitude": 172.6362,
    "timestamp": "2024-07-17T23:30:00Z",
    "magnitude": 5.5,
    "severity": "medium",
    "details": "Moderate earthquake causing minor structural damage."
  },
  {
      "type": "cyclone",
      "location": "Florida, USA",
      "latitude": 27.9944024,
      "longitude": -81.7602544,
      "timestamp": "2024-07-21T10:00:00Z",
      "magnitude": 2,
      "severity": "medium",
      "details": "Tropical Storm approaching the coast with heavy rain."
  },
  {
      "type": "flood",
      "location": "Dhaka, Bangladesh",
      "latitude": 23.8103,
      "longitude": 90.4125,
      "timestamp": "2024-07-21T08:20:00Z",
      "severity": "high",
      "details": "Riverine flooding affecting low-lying urban areas."
  }
];

export async function seedDisasters(db: Firestore): Promise<void> {
  const disastersCollection = collection(db, 'disasterEvents');
  const snapshot = await getDocs(disastersCollection);
  if (!snapshot.empty) {
    console.log("Database already seeded.");
    return Promise.resolve();
  }

  const batch = writeBatch(db);
  
  disasterData.forEach((disaster) => {
    // Use a simpler, deterministic ID for seed data
    const docRef = doc(disastersCollection, `${disaster.location.replace(/, /g, '-')}-${disaster.type}`);
    batch.set(docRef, disaster);
  });

  return batch.commit().catch(serverError => {
    // The batch write is treated as a single 'write' operation.
    // In a real scenario, you might not have the exact individual document that fails.
    // Here, we provide a generic representation of the operation.
    const permissionError = new FirestorePermissionError({
      path: disastersCollection.path,
      operation: 'write', // Batch writes are considered a 'write' operation
      requestResourceData: {
        message: "A batch write operation to seed the database was attempted.",
        itemCount: disasterData.length,
      }
    });

    // Emit the error for the global listener
    errorEmitter.emit('permission-error', permissionError);

    // Also reject the promise to allow the calling UI to handle the failed state.
    return Promise.reject(permissionError);
  });
}
