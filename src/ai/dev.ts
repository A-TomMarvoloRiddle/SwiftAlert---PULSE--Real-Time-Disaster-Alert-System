
import { config } from 'dotenv';
config();

// Import flows to register them with Genkit
import '@/ai/flows/automated-disaster-insights';
import '@/ai/flows/fetch-disaster-data';
import '@/ai/flows/translate-text';
import '@/ai/flows/predict-disaster-flow';
