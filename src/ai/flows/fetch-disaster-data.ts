'use server';

/**
 * @fileOverview A flow that fetches real-time disaster data from the NASA EONET API.
 *
 * - fetchDisasterData - Fetches and processes disaster events.
 * - Disaster - The type for a processed disaster event.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { Disaster } from '@/lib/data';

const EonetEventSchema = z.object({
  id: z.string(),
  title: z.string(),
  link: z.string(),
  description: z.string().nullable().optional(),
  categories: z.array(z.object({ id: z.string(), title: z.string() })),
  sources: z.array(z.object({ id: z.string(), url: z.string() })),
  geometries: z.array(
    z.object({
      date: z.string(),
      type: z.literal('Point'),
      coordinates: z.tuple([z.number(), z.number()]), // [longitude, latitude]
    })
  ),
});

const EonetResponseSchema = z.object({
  title: z.string(),
  description: z.string(),
  link: z.string(),
  events: z.array(EonetEventSchema),
});

// Mapping from EONET category IDs to our app's disaster types
const categoryToDisasterType: Record<string, Disaster['type']> = {
  wildfires: 'wildfire',
  floods: 'flood',
  earthquakes: 'earthquake',
  severeStorms: 'cyclone', // Using cyclone for severe storms
};

// Mapping from EONET category IDs to our app's disaster severity
const categoryToSeverity: Record<string, Disaster['severity']> = {
    wildfires: 'high',
    floods: 'medium',
    earthquakes: 'high',
    severeStorms: 'critical',
  };

export async function fetchDisasterData(): Promise<Disaster[]> {
  return fetchDisasterDataFlow();
}

const fetchDisasterDataFlow = ai.defineFlow(
  {
    name: 'fetchDisasterDataFlow',
    outputSchema: z.array(z.custom<Disaster>()),
  },
  async () => {
    try {
      const response = await fetch(
        'https://eonet.gsfc.nasa.gov/api/v3/events?status=open&limit=50'
      );
      if (!response.ok) {
        throw new Error(`Failed to fetch data from EONET: ${response.statusText}`);
      }
      const rawData = await response.json();
      const parsedData = EonetResponseSchema.safeParse(rawData);

      if (!parsedData.success) {
        console.error('Failed to parse EONET data:', parsedData.error);
        return [];
      }

      const disasters: Disaster[] = parsedData.data.events
        .map((event) => {
          const disasterType = categoryToDisasterType[event.categories[0]?.id];
          const severity = categoryToSeverity[event.categories[0]?.id] || 'low';
          
          if (!disasterType) {
            return null; // Skip events that don't map to our types
          }
          
          const geometry = event.geometries.find(g => g.type === 'Point');
          if (!geometry) {
            return null; // Skip events without a point location
          }

          return {
            id: event.id,
            type: disasterType,
            location: event.title,
            latitude: geometry.coordinates[1],
            longitude: geometry.coordinates[0],
            timestamp: geometry.date,
            magnitude: undefined, // EONET doesn't consistently provide this
            severity: severity,
            details: event.description || 'No additional details available.',
          };
        })
        .filter((d): d is Disaster => d !== null);

      return disasters;
    } catch (error) {
      console.error('Error in fetchDisasterDataFlow:', error);
      return [];
    }
  }
);
