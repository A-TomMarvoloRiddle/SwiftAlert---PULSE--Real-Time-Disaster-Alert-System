
import {createNextApiHandler} from '@genkit-ai/next';
import '@/ai/flows/automated-disaster-insights.ts';
import '@/ai/flows/fetch-disaster-data.ts';
import '@/ai/flows/translate-text.ts';
import '@/ai/flows/predict-disaster-flow.ts';

export const {GET, POST} = createNextApiHandler();
