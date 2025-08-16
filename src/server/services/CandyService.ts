import { Service, OnStart } from "@flamework/core";
import { Events } from "../network";
import { OnPlayerDataLoaded, PlayerData } from "shared/types";
import { PlayerDataService } from "./PlayerDataService";

@Service({})
export class CandyService implements OnStart, OnPlayerDataLoaded {
	constructor(private readonly playerDataService: PlayerDataService) {}
	public onStart(): void {
		Events.candyClicked.connect((player: Player) => {
			this.playerDataService.updatePlayerData(player, (playerData) => {
				this.processCandyClick(player, playerData);
				return playerData;
			});
		});
	}

	/**
	 * Called when player data is loaded - implements OnPlayerDataLoaded lifecycle event
	 */
	public onPlayerDataLoaded(player: Player, playerData: PlayerData): void {
		this.spawnCandyForPlayer(player, playerData);
	}

	private processCandyClick(player: Player, playerData: PlayerData) {
		// Add candy points based on current level
		const pointsEarned = playerData.candyState.pointsPerClick;
		playerData.candyPoints += pointsEarned;
		playerData.totalCandyPoints += pointsEarned;

		// Increment click count
		playerData.candyState.totalClicks += 1;
		playerData.totalClicks += 1;
		playerData.candyState.lastClickTime = tick();

		// Check if level up is required (max level is 6)
		const maxLevel = 6;
		if (playerData.candyState.candyLevel < maxLevel) {
			const requiredClicks = this.calculateClicksForLevel(playerData.candyState.candyLevel + 1);
			if (playerData.candyState.totalClicks >= requiredClicks) {
				// Level up!
				playerData.candyState.candyLevel += 1;
				playerData.candyState.totalClicks = 0; // Reset click count
				playerData.candyState.pointsPerClick = math.floor(playerData.candyState.pointsPerClick * 1.2); // Increase points per click

				// Send level up notification
				if (playerData.candyState.candyLevel >= maxLevel) {
					print(`Player ${player.Name} reached maximum candy level ${maxLevel}!`);
				} else {
					print(`Player ${player.Name} leveled up to candy level ${playerData.candyState.candyLevel}!`);
				}
			}
		}

		// Send updated data to client
		Events.playerDataUpdated.fire(player, playerData);
		Events.candyStateUpdated.fire(player, playerData.candyState);

		// Update candy visual if level changed
		Events.candyDataUpdated.fire(player, {
			level: playerData.candyState.candyLevel,
			playerId: player.UserId,
		});
	}

	/**
	 * Spawn candy for player and send initial state data
	 */
	public spawnCandyForPlayer(player: Player, playerData: PlayerData): void {
		// Send initial player data and candy state to client
		Events.playerDataUpdated.fire(player, playerData);
		Events.candyStateUpdated.fire(player, playerData.candyState);

		// Send candy data to client for visual spawning
		Events.candyDataUpdated.fire(player, {
			level: playerData.candyState.candyLevel,
			playerId: player.UserId,
		});

		print(
			`Sent initial candy state to ${player.Name}: Level ${playerData.candyState.candyLevel}, Points per click: ${playerData.candyState.pointsPerClick}`,
		);
	}

	/**
	 * Calculate clicks required for a given level
	 */
	private calculateClicksForLevel(level: number): number {
		return math.floor(10 * math.pow(1.5, level - 1));
	}
}
