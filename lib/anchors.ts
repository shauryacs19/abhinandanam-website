// Kept apart from lib/hotels.ts so client components can use it without bundling the hotel data.

/** id of a room card on its hotel page, e.g. "Family Room" -> "room-family-room" */
export const roomAnchor = (name: string) => `room-${name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}`;
