import { Complaint } from '../types';

/**
 * Injects context into the user input if @ai is present and a complaint is active.
 * The injected string ?complaint=ID is hidden from UI but used by the processor.
 */
export function injectContext(input: string, activeComplaint: Complaint | null): string {
  if (!input.includes("@ai")) return input;
  if (!activeComplaint) return input;

  // Find the first occurrence of @ai and replace it with @ai ?complaint=ID
  // Using a simple replace for the first occurrence as per PRD
  return input.replace("@ai", `@ai ?complaint=${activeComplaint.id}`);
}

/**
 * Extracts the complaint ID from a message string.
 */
export function extractComplaintId(msg: string): number | null {
  const match = msg.match(/\?complaint=(\d+)/);
  return match ? Number(match[1]) : null;
}

/**
 * Mocks an AI response generator based on injected context.
 */
export function generateAIResponse(input: string, complaints: Complaint[]): string {
  const id = extractComplaintId(input);

  if (id) {
    const complaint = complaints.find(c => c.id === id);
    if (!complaint) return "I'm sorry, I couldn't find the data for that complaint reference.";

    // Simple keyword-based mock analysis
    const query = input.toLowerCase();
    
    if (query.includes("what") && query.includes("issue")) {
      return `The issue reported is: "${complaint.title}". ${complaint.description}. It is currently marked as ${complaint.severity} severity.`;
    }
    
    if (query.includes("location") || query.includes("where")) {
       return `This issue is located at ${complaint.location}.`;
    }

    if (query.includes("action") || query.includes("do")) {
       return `Given the ${complaint.severity} severity, we should dispatch a ${complaint.tags[0]} maintenance team immediately to ${complaint.location}.`;
    }

    return `I am now analyzing complaint #${complaint.id}: "${complaint.title}". How can I help you with more specifics about this case?`;
  }

  if (input.includes("@ai")) {
    return "Please select a complaint from the sidebar first so I have context to assist you.";
  }

  // Generic non-AI responses
  const genericResponses = [
    "I'm here to help with civic issues. You can select a complaint and type @ai to get specialized analysis.",
    "Civic management requires precise data. Use the @ai trigger once you've selected a task.",
    "How can I assist you with city maintenance today?",
  ];
  
  return genericResponses[Math.floor(Math.random() * genericResponses.length)];
}
