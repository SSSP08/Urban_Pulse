/**
 * TEMPORARY TEST ROUTE — Gemini connectivity check.
 *
 * Purpose: Verify that the NEXT_PUBLIC_GEMINI_API_KEY is valid and Gemini
 *          responds correctly. Remove this file once connectivity is confirmed.
 *
 * Usage:   GET /api/test-gemini
 *
 * Success: { "status": "ok", "response": "CONNECTED", "model": "gemini-1.5-flash" }
 * Failure: { "status": "error", "message": "<reason>" }
 */

import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

export async function GET() {
  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

  if (!apiKey || apiKey === 'your_gemini_api_key_here') {
    return NextResponse.json(
      { status: 'error', message: 'NEXT_PUBLIC_GEMINI_API_KEY is not set in .env.local' },
      { status: 500 }
    );
  }

  try {
    const ai = new GoogleGenAI({ apiKey });

    const result = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: 'This is a connectivity test. Please reply with exactly one word: CONNECTED',
            },
          ],
        },
      ],
    });

    const resultData = result as unknown as {
      candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
    };
    const text =
      (result.text ?? '').trim() ||
      (resultData.candidates?.[0]?.content?.parts?.[0]?.text ?? '').trim() ||
      '(empty response from model)';

    return NextResponse.json({
      status: 'ok',
      response: text,
      model: 'gemini-3.5-flash'
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ status: 'error', message }, { status: 502 });
  }
}
