
import {createNextApiHandler} from '@genkit-ai/next';

// Import flows to register them with Genkit
import '@/ai/flows/automated-disaster-insights';
import '@/ai/flows/fetch-disaster-data';
import '@/ai/flows/translate-text';

export const {GET, POST} = createNextApiHandler();
