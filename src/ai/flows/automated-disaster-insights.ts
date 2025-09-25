'use server';

/**
 * @fileOverview A flow that generates brief, insightful summaries of incoming disaster data using AI.
 *
 * - generateDisasterInsight - A function that generates a disaster insight.
 * - GenerateDisasterInsightInput - The input type for the generateDisasterInsight function.
 * - GenerateDisasterInsightOutput - The return type for the generateDisasterInsight function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';

const GenerateDisasterInsightInputSchema = z.object({
  disasterType: z.string().describe('The type of disaster (e.g., earthquake, flood, cyclone, wildfire).'),
  location: z.string().describe('The location of the disaster.'),
  magnitude: z.number().optional().describe('The magnitude of the disaster, if applicable.'),
  additionalDetails: z.string().describe('Additional details about the disaster event.'),
});
export type GenerateDisasterInsightInput = z.infer<typeof GenerateDisasterInsightInputSchema>;

const GenerateDisasterInsightOutputSchema = z.object({
  insight: z.string().describe('A brief, insightful summary of the disaster data.'),
});
export type GenerateDisasterInsightOutput = z.infer<typeof GenerateDisasterInsightOutputSchema>;

export async function generateDisasterInsight(input: GenerateDisasterInsightInput): Promise<GenerateDisasterInsightOutput> {
  return generateDisasterInsightFlow(input);
}

const disasterInsightPrompt = ai.definePrompt({
  name: 'disasterInsightPrompt',
  input: {schema: GenerateDisasterInsightInputSchema},
  output: {schema: GenerateDisasterInsightOutputSchema},
  prompt: `You are an AI assistant designed to provide brief, insightful summaries of disaster data for alert notifications.

  Based on the following information, generate a concise summary suitable for inclusion in an alert:

  Disaster Type: {{{disasterType}}}
  Location: {{{location}}}
  Magnitude (if applicable): {{#if magnitude}}{{{magnitude}}}{{else}}N/A{{/if}}
  Additional Details: {{{additionalDetails}}}

  Insight:`, // Ensure the Insight field is the last one in the prompt
});

const generateDisasterInsightFlow = ai.defineFlow(
  {
    name: 'generateDisasterInsightFlow',
    inputSchema: GenerateDisasterInsightInputSchema,
    outputSchema: GenerateDisasterInsightOutputSchema,
  },
  async input => {
    const {output} = await disasterInsightPrompt(input);
    return output!;
  }
);

