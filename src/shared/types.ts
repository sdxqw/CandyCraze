// Simplified type definitions for Candy Craze

// Lifecycle events
export interface OnPlayerDataLoaded {
	onPlayerDataLoaded(player: Player, playerData: PlayerData): void;
}

// Core game types
export interface CandyState {
	playerId: number;
	candyLevel: number;
	clicksRemaining: number;
	maxClicks: number;
	lastClickTime: number;
	totalClicks: number;
	pointsPerClick: number;
}

// Simplified upgrade system
export interface PlayerUpgrade {
	upgradeId: string;
	level: number;
}

// Pet system removed for simplification

// Simplified prestige system
export interface PrestigeData {
	permanentMultiplier: number;
	prestigeLevel: number;
}

// ============================================================================
// PLAYER DATA STRUCTURE
// ============================================================================

/** Complete player data structure for ProfileService */
export interface PlayerData {
	/** Player identification */
	playerId: number;
	username: string;

	/** Core game progress */
	candyPoints: number;
	totalCandyPoints: number;
	totalClicks: number;

	/** Candy system state */
	candyState: CandyState;

	/** Owned upgrades */
	upgrades: PlayerUpgrade[];

	// Booster system removed for simplification

	/** Prestige progress */
	prestige: PrestigeData;

	/** Statistics */
	stats: {
		// Dice and booster stats removed for simplification
		// Pet stats removed for simplification
		totalUpgradesPurchased: number;
		playtimeSeconds: number;
		lastLogin: number;
		createdAt: number;
	};

	/** Settings */
	settings: {
		musicEnabled: boolean;
		sfxEnabled: boolean;
		notificationsEnabled: boolean;
		autoSaveEnabled: boolean;
	};
}

export const DEFAULT_PLAYER_DATA: PlayerData = {
	playerId: 0,
	username: "",
	candyPoints: 0,
	totalCandyPoints: 0,
	totalClicks: 0,
	candyState: {
		playerId: 0,
		candyLevel: 1,
		clicksRemaining: 10,
		maxClicks: 10,
		lastClickTime: 0,
		totalClicks: 0,
		pointsPerClick: 1,
	},
	upgrades: [],
	// Pet system and boosters removed for simplification
	prestige: {
		prestigeLevel: 0,
		permanentMultiplier: 1,
	},

	settings: {
		musicEnabled: true,
		sfxEnabled: true,
		notificationsEnabled: true,
		autoSaveEnabled: true,
	},
	stats: {
		totalUpgradesPurchased: 0,
		playtimeSeconds: 0,
		lastLogin: 0,
		createdAt: 0,
	},
};

// ============================================================================
// GAME EVENTS AND NETWORKING
// ============================================================================
