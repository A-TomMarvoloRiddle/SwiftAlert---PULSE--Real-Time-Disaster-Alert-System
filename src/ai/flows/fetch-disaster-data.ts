
'use server';

/**
 * @fileOverview A flow that provides sample disaster data.
 *
 * - fetchDisasterData - Fetches and processes sample disaster events.
 * - Disaster - The type for a processed disaster event.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { Disaster } from '@/lib/data';

const sampleDisasters: Disaster[] = [
    {
      id: "EVT001",
      type: 'earthquake',
      location: 'Tokyo, Japan',
      latitude: 35.6895,
      longitude: 139.6917,
      timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
      magnitude: 7.2,
      severity: 'high',
      details: 'Major earthquake reported near the coast. Tsunami warnings issued.',
    },
    {
      id: "EVT002",
      type: 'wildfire',
      location: 'California, USA',
      latitude: 38.5816,
      longitude: -121.4944,
      timestamp: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
      severity: 'critical',
      details: 'Large wildfire spreading rapidly due to strong winds.',
    },
    {
      id: "EVT003",
      type: 'flood',
      location: 'Kerala, India',
      latitude: 10.8505,
      longitude: 76.2711,
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
      severity: 'high',
      details: 'Severe flooding due to monsoon rains displacing thousands.',
    },
    {
      id: "EVT004",
      type: 'cyclone',
      location: 'Queensland, Australia',
      latitude: -20.9176,
      longitude: 148.9698,
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
      magnitude: 4,
      severity: 'critical',
      details: 'Category 4 cyclone making landfall. Evacuations in progress.',
    },
    {
      id: "EVT005",
      type: 'earthquake',
      location: 'Santiago, Chile',
      latitude: -33.4489,
      longitude: -70.6693,
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
      magnitude: 6.5,
      severity: 'medium',
      details: 'Strong earthquake felt in the capital city. Minor damages reported.',
    },
    {
        id: "EVT006",
        type: 'wildfire',
        location: 'British Columbia, Canada',
        latitude: 53.7267,
        longitude: -127.6476,
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
        severity: 'high',
        details: 'Multiple wildfires burning out of control in the northern regions.',
    },
    {
        id: "EVT007",
        type: 'flood',
        location: 'Rhine River, Germany',
        latitude: 50.7374,
        longitude: 7.0982,
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
        severity: 'medium',
        details: 'River levels rising to dangerous levels after heavy rainfall.',
    },
    {
        id: "EVT008",
        type: 'earthquake',
        location: 'Lombok, Indonesia',
        latitude: -8.4095,
        longitude: 116.4044,
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 96).toISOString(),
        magnitude: 6.9,
        severity: 'high',
        details: 'Aftershock from a previous major earthquake causes further damage.',
    },
     {
      id: "EVT009",
      type: 'cyclone',
      location: 'Florida, USA',
      latitude: 27.6648,
      longitude: -81.5158,
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 120).toISOString(),
      magnitude: 2,
      severity: 'medium',
      details: 'Tropical storm forming in the Atlantic, expected to become a hurricane.',
    },
    {
      id: "EVT010",
      type: 'wildfire',
      location: 'Siberia, Russia',
      latitude: 61.5240,
      longitude: 105.3188,
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 150).toISOString(),
      severity: 'low',
      details: 'Seasonal wildfires reported in remote taiga forests.',
    },
];

export async function fetchDisasterData(): Promise<Disaster[]> {
  return fetchDisasterDataFlow();
}

const fetchDisasterDataFlow = ai.defineFlow(
  {
    name: 'fetchDisasterDataFlow',
    outputSchema: z.array(z.custom<Disaster>()),
  },
  async () => {
    // Return the hardcoded sample data
    return sampleDisasters;
  }
);
