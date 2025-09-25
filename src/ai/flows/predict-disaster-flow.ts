
'use server';

/**
 * @fileOverview A flow that "predicts" disaster risk based on environmental data using a generative model.
 *
 * - predictDisaster - A function that generates a disaster risk prediction.
 * - PredictDisasterInput - The input type for the predictDisaster function.
 * - PredictDisasterOutput - The return type for the predictDisaster function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const PredictDisasterInputSchema = z.object({
  location: z.string().describe('The geographical location for the prediction.'),
  temperature: z.coerce.number().describe('The current temperature in Celsius.'),
  humidity: z.coerce.number().min(0).max(100).describe('The current humidity percentage (0-100).'),
  windSpeed: z.coerce.number().min(0).describe('The current wind speed in km/h.'),
});
export type PredictDisasterInput = z.infer<typeof PredictDisasterInputSchema>;

const PredictDisasterOutputSchema = z.object({
  riskLevel: z.enum(['Low', 'Moderate', 'High', 'Critical']).describe('The predicted risk level for a disaster.'),
  prediction: z.string().describe('A brief, insightful explanation of the predicted risk, detailing potential disaster types (wildfire, flood, etc.) and contributing factors.'),
});
export type PredictDisasterOutput = z.infer<typeof PredictDisasterOutputSchema>;

export async function predictDisaster(input: PredictDisasterInput): Promise<PredictDisasterOutput> {
  return predictDisasterFlow(input);
}

const disasterPredictionPrompt = ai.definePrompt({
  name: 'disasterPredictionPrompt',
  input: { schema: PredictDisasterInputSchema },
  output: { schema: PredictDisasterOutputSchema },
  prompt: `You are an AI meteorologist and disaster prediction expert. Your task is to analyze the provided environmental data and predict the risk of a natural disaster.

  Based on the following data, assess the likelihood of disasters like wildfires, floods, or severe storms.
  - Location: {{{location}}}
  - Temperature: {{{temperature}}}°C
  - Humidity: {{{humidity}}}%
  - Wind Speed: {{{windSpeed}}} km/h

  Determine a risk level (Low, Moderate, High, Critical) and provide a concise justification for your prediction, mentioning the most likely disaster types.
  
  For example, high temperature, low humidity, and high wind speed would suggest a high risk of wildfires. High humidity and high temperature could indicate a risk of severe storms or flooding.`,
});

const predictDisasterFlow = ai.defineFlow(
  {
    name: 'predictDisasterFlow',
    inputSchema: PredictDisasterInputSchema,
    outputSchema: PredictDisasterOutputSchema,
  },
  async (input) => {
    const { output } = await disasterPredictionPrompt(input);
    return output!;
  }
);
