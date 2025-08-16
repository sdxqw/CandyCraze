import { Networking } from "@flamework/networking";
import { PlayerData, CandyState } from "./types";

// Simplified networking - only essential events

interface ClientToServerEvents {
	/** Player clicked the candy */
	candyClicked: () => void;
}

interface ServerToClientEvents {
	/** Send updated player data to client */
	playerDataUpdated: (data: PlayerData) => void;

	/** Send candy state update */
	candyStateUpdated: (candyState: CandyState) => void;

	/** Send candy data for client-side spawning */
	candyDataUpdated: (candyData: { level: number; playerId: number }) => void;
}

interface ClientToServerFunctions {}

interface ServerToClientFunctions {}

// ============================================================================
// GLOBAL NETWORKING OBJECTS
// ============================================================================

export const GlobalEvents = Networking.createEvent<ClientToServerEvents, ServerToClientEvents>();
export const GlobalFunctions = Networking.createFunction<ClientToServerFunctions, ServerToClientFunctions>();
