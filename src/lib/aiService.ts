import { GoogleGenAI } from '@google/genai';
import type { ParkingYard } from '@/store/useParkingStore';
import type { CongestionLevel } from '@/types/traffic';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ParkingSnapshot {
  name: string;
  availableSpots: number;
  totalCapacity: number;
  hourlyRate: number;
  walkingDistance: string;
  drivingTime: string;
  isEVCharging: boolean;
  isCovered: boolean;
}

export interface TrafficSnapshot {
  roadName: string;
  congestionLevel: CongestionLevel;
  averageSpeed: number;
}

export interface GeminiRecommendationInput {
  city: string;
  parkingOptions: ParkingSnapshot[];
  trafficConditions: TrafficSnapshot[];
}

export interface GeminiRecommendationOutput {
  recommendedParking: string;
  estimatedTravelTime: string;
  trafficCondition: 'Low' | 'Moderate' | 'Heavy';
  timeSaved: string;
  confidence: number;
  reason: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Summarise traffic conditions into a short human-readable string for the prompt.
 */
function summariseTraffic(traffic: TrafficSnapshot[]): string {
  if (traffic.length === 0) return 'No traffic data available.';
  return traffic
    .map((t) => `${t.roadName}: ${t.congestionLevel} (${t.averageSpeed} km/h avg)`)
    .join('; ');
}

/**
 * Convert a ParkingYard from the store into the minimal snapshot the prompt needs.
 */
export function toSnapshot(yard: ParkingYard): ParkingSnapshot {
  return {
    name: yard.name,
    availableSpots: yard.availableSpots,
    totalCapacity: yard.totalCapacity,
    hourlyRate: yard.isFree ? 0 : yard.hourlyRate,
    walkingDistance: yard.walkingDistance,
    drivingTime: yard.drivingTime,
    isEVCharging: yard.isEVCharging,
    isCovered: yard.isCovered,
  };
}

// ─── Prompt builder ───────────────────────────────────────────────────────────

function buildPrompt(input: GeminiRecommendationInput): string {
  const parkingLines = input.parkingOptions
    .map(
      (p, i) =>
        `${i + 1}. ${p.name} — ${p.availableSpots}/${p.totalCapacity} spaces, ` +
        `₹${p.hourlyRate}/hr, ${p.walkingDistance} walk, ${p.drivingTime} drive` +
        (p.isEVCharging ? ', EV charging' : '') +
        (p.isCovered ? ', covered' : '')
    )
    .join('\n');

  return `
You are a smart urban mobility assistant for ${input.city}, India.

Current parking options:
${parkingLines}

Current traffic conditions:
${summariseTraffic(input.trafficConditions)}

Task: Recommend the single best parking option for a driver heading to the city center.
Criteria (in priority order):
1. Highest availability (available spots vs capacity ratio)
2. Shortest combined travel + walking time
3. Lowest congestion on the approach route
4. Reasonable price

Respond ONLY with a valid JSON object — no markdown, no code fences, no extra text:
{
  "recommendedParking": "<exact name from the list above>",
  "estimatedTravelTime": "<X minutes>",
  "trafficCondition": "<Low | Moderate | Heavy>",
  "timeSaved": "<X minutes>",
  "confidence": <integer 0-100>,
  "reason": "<one concise sentence, max 40 words>"
}
`.trim();
}

// ─── Core service function ────────────────────────────────────────────────────

/**
 * Calls Google Gemini and returns a structured parking recommendation.
 * Throws if the API key is missing, the call fails, or the JSON cannot be parsed.
 * The caller is responsible for falling back to mock data on error.
 */
export async function fetchAIRecommendation(
  input: GeminiRecommendationInput
): Promise<GeminiRecommendationOutput> {
  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

  if (!apiKey || apiKey === 'your_gemini_api_key_here') {
    throw new Error('NEXT_PUBLIC_GEMINI_API_KEY is not configured.');
  }

  const ai = new GoogleGenAI({ apiKey });

  const response = await ai.models.generateContent({
    model: 'gemini-3.5-flash',
    contents: [
      {
        role: 'user',
        parts: [{ text: buildPrompt(input) }],
      },
    ],
  });

  // Primary: SDK convenience getter. Fallback: walk candidates manually.
  const responseData = response as unknown as {
    candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
  };
  const raw =
    (response.text ?? '').trim() ||
    (responseData.candidates?.[0]?.content?.parts?.[0]?.text ?? '').trim();


  // Strip any accidental markdown fences Gemini might add
  const cleaned = raw
    .replace(/^```(?:json)?\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim();

  let parsed: Record<string, unknown>;
  try {
    parsed = JSON.parse(cleaned) as Record<string, unknown>;
  } catch {
    throw new Error(`Gemini returned non-JSON response: ${cleaned.slice(0, 200)}`);
  }

  // Validate and coerce fields
  const recommendedParking = String(parsed.recommendedParking ?? '');
  const estimatedTravelTime = String(parsed.estimatedTravelTime ?? '');
  const rawTraffic = String(parsed.trafficCondition ?? 'Moderate');
  const trafficCondition: GeminiRecommendationOutput['trafficCondition'] =
    rawTraffic === 'Low' || rawTraffic === 'Heavy' ? rawTraffic : 'Moderate';
  const timeSaved = String(parsed.timeSaved ?? '');
  const confidence = Math.min(100, Math.max(0, Number(parsed.confidence ?? 80)));
  const reason = String(parsed.reason ?? '');

  if (!recommendedParking || !estimatedTravelTime || !reason) {
    throw new Error('Gemini response missing required fields.');
  }

  return {
    recommendedParking,
    estimatedTravelTime,
    trafficCondition,
    timeSaved,
    confidence,
    reason,
  };
}

/**
 * Calls Gemini to generate a short, high-priority summary explaining why
 * the automated emergency corridor route is currently mathematically optimal.
 */
export async function fetchEmergencySummary(): Promise<string> {
  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

  if (!apiKey || apiKey === 'your_gemini_api_key_here') {
    throw new Error('NEXT_PUBLIC_GEMINI_API_KEY is not configured.');
  }

  const ai = new GoogleGenAI({ apiKey });

  const response = await ai.models.generateContent({
    model: 'gemini-3.5-flash',
    contents: [
      {
        role: 'user',
        parts: [
          {
            text: 'Explain in one concise, professional sentence (under 35 words) why locking traffic signals to green on the Hitec City emergency corridor is mathematically optimal to bypass heavy tech-park congestion bottlenecks.',
          },
        ],
      },
    ],
  });

  const responseData = response as unknown as {
    candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
  };
  const raw =
    (response.text ?? '').trim() ||
    (responseData.candidates?.[0]?.content?.parts?.[0]?.text ?? '').trim();

  if (!raw) {
    throw new Error('Empty response from model.');
  }

  return raw;
}
