import {createNextApiHandler} from '@genkit-ai/next';
import '@/ai/flows/automated-disaster-insights.ts';
import '@/ai/flows/fetch-disaster-data.ts';

export const {GET, POST} = createNextApiHandler();
