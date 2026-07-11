import type { TrafficSegment } from '@/types/traffic';

const now = () => new Date().toISOString();

/**
 * Realistic mock traffic segments for Hyderabad.
 * Coordinates are accurate polyline waypoints for each road corridor.
 */
export const INITIAL_TRAFFIC_SEGMENTS: TrafficSegment[] = [
  {
    id: 'HYD-SEG-001',
    roadName: 'Outer Ring Road',
    coordinates: [
      [17.4847, 78.3267],
      [17.4700, 78.3420],
      [17.4556, 78.3582],
      [17.4406, 78.3730],
      [17.4230, 78.3885],
      [17.4085, 78.4030],
    ],
    congestionLevel: 'MEDIUM',
    averageSpeed: 35,
    lastUpdated: now(),
  },
  {
    id: 'HYD-SEG-002',
    roadName: 'HITEC City Main Road',
    coordinates: [
      [17.4477, 78.3764],
      [17.4490, 78.3800],
      [17.4500, 78.3840],
      [17.4510, 78.3875],
      [17.4518, 78.3910],
    ],
    congestionLevel: 'HIGH',
    averageSpeed: 12,
    lastUpdated: now(),
  },
  {
    id: 'HYD-SEG-003',
    roadName: 'Gachibowli Junction',
    coordinates: [
      [17.4401, 78.3489],
      [17.4415, 78.3525],
      [17.4430, 78.3560],
      [17.4440, 78.3600],
    ],
    congestionLevel: 'HIGH',
    averageSpeed: 8,
    lastUpdated: now(),
  },
  {
    id: 'HYD-SEG-004',
    roadName: 'Jubilee Hills Road No. 36',
    coordinates: [
      [17.4315, 78.4080],
      [17.4325, 78.4115],
      [17.4338, 78.4150],
      [17.4350, 78.4185],
      [17.4362, 78.4215],
    ],
    congestionLevel: 'MEDIUM',
    averageSpeed: 28,
    lastUpdated: now(),
  },
  {
    id: 'HYD-SEG-005',
    roadName: 'Banjara Hills Road No. 1',
    coordinates: [
      [17.4150, 78.4330],
      [17.4165, 78.4365],
      [17.4180, 78.4400],
      [17.4195, 78.4435],
      [17.4210, 78.4465],
    ],
    congestionLevel: 'LOW',
    averageSpeed: 55,
    lastUpdated: now(),
  },
  {
    id: 'HYD-SEG-006',
    roadName: 'Necklace Road',
    coordinates: [
      [17.4060, 78.4630],
      [17.4085, 78.4670],
      [17.4110, 78.4705],
      [17.4138, 78.4735],
      [17.4165, 78.4758],
    ],
    congestionLevel: 'LOW',
    averageSpeed: 60,
    lastUpdated: now(),
  },
  {
    id: 'HYD-SEG-007',
    roadName: 'Tank Bund Road',
    coordinates: [
      [17.4196, 78.4737],
      [17.4220, 78.4758],
      [17.4248, 78.4773],
      [17.4275, 78.4788],
      [17.4302, 78.4797],
    ],
    congestionLevel: 'MEDIUM',
    averageSpeed: 30,
    lastUpdated: now(),
  },
  {
    id: 'HYD-SEG-008',
    roadName: 'NH44',
    coordinates: [
      [17.5150, 78.4010],
      [17.5020, 78.4050],
      [17.4890, 78.4090],
      [17.4760, 78.4130],
      [17.4630, 78.4175],
      [17.4500, 78.4220],
    ],
    congestionLevel: 'LOW',
    averageSpeed: 65,
    lastUpdated: now(),
  },
  {
    id: 'HYD-SEG-009',
    roadName: 'Secunderabad Main Road',
    coordinates: [
      [17.4415, 78.4990],
      [17.4430, 78.5030],
      [17.4445, 78.5070],
      [17.4460, 78.5110],
      [17.4472, 78.5148],
    ],
    congestionLevel: 'MEDIUM',
    averageSpeed: 25,
    lastUpdated: now(),
  },
];
