import { Networking } from "@flamework/networking";
import { PlayerData } from "./types";

// Simplified networking - only essential events

interface ClientToServerEvents {
	/** Player clicked the candy */
	candyClicked: () => void;
}

interface ServerToClientEvents {
	/** Send updated player data to client (includes candy state) */
	playerDataUpdated: (data: PlayerData) => void;

	/** Send candy visual update when level changes */
	candyVisualUpdated: (candyData: { level: number; playerId: number }) => void;
}

interface ClientToServerFunctions {}

interface ServerToClientFunctions {}

// ============================================================================
// GLOBAL NETWORKING OBJECTS
// ============================================================================

export const GlobalEvents = Networking.createEvent<ClientToServerEvents, ServerToClientEvents>();
export const GlobalFunctions = Networking.createFunction<ClientToServerFunctions, ServerToClientFunctions>();
