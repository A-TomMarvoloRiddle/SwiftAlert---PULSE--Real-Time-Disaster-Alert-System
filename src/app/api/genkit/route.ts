import {createNextApiHandler} from '@genkit-ai/next';
import '@/ai/flows/automated-disaster-insights.ts';

export const {GET, POST} = createNextApiHandler();
