import { Service, OnStart, OnInit } from "@flamework/core";
import { Events } from "../network";
import { OnPlayerDataLoaded, PlayerData, CandyState } from "shared/types";
import { PlayerDataService } from "./PlayerDataService";

/**
 * Server-side candy service that handles candy click logic and data management.
 * Focuses purely on business logic without visual concerns.
 * Uses proper lifecycle management with OnInit and OnStart.
 */
@Service({})
export class CandyService implements OnInit, OnStart, OnPlayerDataLoaded {
	constructor(private readonly playerDataService: PlayerDataService) {}

	/**
	 * Initialize service dependencies and validate configuration
	 */
	public onInit(): void {
		// Validate that PlayerDataService is available
		if (!this.playerDataService) {
			throw "CandyService requires PlayerDataService dependency";
		}
		print("CandyService initialized with dependencies");
	}

	/**
	 * Start service operations and event handlers
	 */
	public onStart(): void {
		Events.candyClicked.connect((player: Player) => {
			this.handleCandyClick(player);
		});
		print("CandyService started - handling candy clicks");
	}

	/**
	 * Called when player data is loaded - sends initial candy state to client
	 */
	public onPlayerDataLoaded(player: Player, playerData: PlayerData): void {
		this.sendInitialCandyState(player, playerData);
	}

	/**
	 * Handle candy click - pure data processing
	 */
	private handleCandyClick(player: Player): void {
		this.playerDataService.updatePlayerData(player, (playerData) => {
			const clickResult = this.processCandyClick(playerData);

			// If level changed, notify for visual update
			if (clickResult.levelChanged) {
				Events.candyVisualUpdated.fire(player, {
					level: playerData.candyState.candyLevel,
					playerId: player.UserId,
				});
			}

			return playerData;
		});
	}

	/**
	 * Process candy click logic - returns click result info
	 */
	private processCandyClick(playerData: PlayerData): { levelChanged: boolean; pointsEarned: number } {
		const pointsEarned = playerData.candyState.pointsPerClick;

		// Add points
		playerData.candyPoints += pointsEarned;
		playerData.totalCandyPoints += pointsEarned;

		// Update click stats
		playerData.candyState.totalClicks += 1;
		playerData.totalClicks += 1;
		playerData.candyState.lastClickTime = tick();

		// Check for level up
		const levelChanged = this.checkAndProcessLevelUp(playerData.candyState);

		return { levelChanged, pointsEarned };
	}

	/**
	 * Check and process candy level up logic
	 */
	private checkAndProcessLevelUp(candyState: CandyState): boolean {
		const maxLevel = 6;
		if (candyState.candyLevel >= maxLevel) return false;

		const requiredClicks = this.calculateClicksForLevel(candyState.candyLevel + 1);
		if (candyState.totalClicks >= requiredClicks) {
			candyState.candyLevel += 1;
			candyState.totalClicks = 0;
			candyState.pointsPerClick = math.floor(candyState.pointsPerClick * 1.2);

			print(`Candy leveled up to ${candyState.candyLevel}!`);
			return true;
		}

		return false;
	}

	/**
	 * Send initial candy state to client when player data loads
	 */
	private sendInitialCandyState(player: Player, playerData: PlayerData): void {
		// Send initial candy visual data to client for spawning
		Events.candyVisualUpdated.fire(player, {
			level: playerData.candyState.candyLevel,
			playerId: player.UserId,
		});

		print(`Initialized candy state for ${player.Name}: Level ${playerData.candyState.candyLevel}`);
	}

	/**
	 * Calculate clicks required for a given level
	 */
	private calculateClicksForLevel(level: number): number {
		return math.floor(10 * math.pow(1.5, level - 1));
	}

	/**
	 * Get current candy state for a player (public API)
	 */
	public getCandyState(player: Player): CandyState | undefined {
		const playerData = this.playerDataService.getPlayerData(player);
		return playerData?.candyState;
	}
}
