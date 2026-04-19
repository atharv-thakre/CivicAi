import { Complaint } from '../types';

export const mockComplaints: Complaint[] = [
  {
    id: 1,
    title: "Pothole on Main Road",
    description: "Large pothole causing extreme traffic congestion and potential damage to vehicles near the City Hall signal. It's approximately 2 feet wide.",
    tags: ["road", "damage", "infrastructure"],
    severity: "high",
    location: "Main St & 5th Ave",
    date: "2024-03-15"
  },
  {
    id: 2,
    title: "Garbage Overflow",
    description: "The public trash bin in the Central Park North area has not been emptied for 3 days. Trash is starting to spill onto the sidewalk.",
    tags: ["sanitation", "public-space"],
    severity: "medium",
    location: "Central Park North, Gate 2",
    date: "2024-03-18"
  },
  {
    id: 3,
    title: "Street Light Outage",
    description: "Three consecutive street lights are out on Oak Street. Residents feel unsafe walking at night. Reported by several neighbors last week.",
    tags: ["electricity", "safety"],
    severity: "high",
    location: "Oak St (between 10th and 12th)",
    date: "2024-03-17"
  },
  {
    id: 4,
    title: "Vandalism at Bus Stop",
    description: "Graffiti and broken glass at the Westside bus stop. The seating bench has also been partially displaced.",
    tags: ["vandalism", "transit"],
    severity: "low",
    location: "Westside Blvd, Bus Stop #42",
    date: "2024-03-19"
  },
  {
    id: 5,
    title: "Water Leakage",
    description: "Clean water is gushing from a pipe under the sidewalk on Pine St. It seems like a main line burst.",
    tags: ["utilities", "water"],
    severity: "high",
    location: "124 Pine St",
    date: "2024-03-20"
  }
];
