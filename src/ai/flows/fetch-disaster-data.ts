
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
  description: z.string().nullable(),
  categories: z.array(z.object({ id: z.string(), title: z.string() })).optional(),
  sources: z.array(z.object({ id: z.string(), url: z.string() })).optional(),
  geometries: z.array(z.any()), // Allow any object in the array to make parsing more robust
});

const EonetResponseSchema = z.object({
  title: z.string(),
  description: z.string(),
  link: z.string(),
  events: z.array(EonetEventSchema),
});

// Mapping from EONET category IDs to our app's disaster types
const categoryToDisasterType: Record<string, Disaster['type']> = {
    drought: 'wildfire', // Categorizing drought as related to wildfire risk
    dustAndHaze: 'cyclone', // Generic category
    earthquakes: 'earthquake',
    floods: 'flood',
    landslides: 'earthquake', // Related to seismic/ground activity
    manmade: 'cyclone', // Generic category
    seaAndLakeIce: 'flood', // Related to water levels
    severeStorms: 'cyclone',
    snow: 'flood', // Potential for melting
    tempExtremes: 'wildfire', // Related to heat
    volcanoes: 'wildfire', // Related to heat/fire
    waterColor: 'flood', // Water-related event
    wildfires: 'wildfire',
};

// Mapping from EONET category IDs to our app's disaster severity
const categoryToSeverity: Record<string, Disaster['severity']> = {
    drought: 'medium',
    dustAndHaze: 'low',
    earthquakes: 'high',
    floods: 'high',
    landslides: 'medium',
    manmade: 'low',
    seaAndLakeIce: 'low',
    severeStorms: 'critical',
    snow: 'medium',
    tempExtremes: 'high',
    volcanoes: 'critical',
    waterColor: 'low',
    wildfires: 'high',
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
    const response = await fetch(
      'https://eonet.gsfc.nasa.gov/api/v3/events?status=open&limit=50'
    );
    if (!response.ok) {
      // Throw an error that can be caught by the calling component
      throw new Error(`Failed to fetch data from EONET: ${response.statusText}`);
    }
    const rawData = await response.json();
    const parsedData = EonetResponseSchema.safeParse(rawData);

    if (!parsedData.success) {
      console.error('Failed to parse EONET data:', parsedData.error);
      // Throw an error instead of returning an empty array
      throw new Error('Failed to parse data from EONET.');
    }

    const disasters: Disaster[] = parsedData.data.events
      .map((event) => {
        try {
            const categoryId = event.categories?.[0]?.id;
            // Use the mapping, but default to 'cyclone' if no specific category matches
            const disasterType = categoryId ? categoryToDisasterType[categoryId] || 'cyclone' : 'cyclone';
            
            // Use the mapping, but default to 'low' if no severity mapping exists
            const severity = categoryId ? categoryToSeverity[categoryId] || 'low' : 'low'; 
            
            // Find the first geometry object that is a point.
            const geometry = event.geometries.find(g => g && g.type === 'Point' && Array.isArray(g.coordinates) && g.coordinates.length >= 2);
            if (!geometry) {
              return null; // Skip events without a valid point location
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
        } catch (e) {
            console.error(`Failed to process event ${event.id}:`, e);
            return null; // Skip this event if there's an error processing it
        }
      })
      .filter((d): d is Disaster => d !== null);

    return disasters;
  }
);
