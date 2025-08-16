/**
 * PlayerDataService - Simplified player data management using ProfileService
 */

import { Service, OnStart, Modding } from "@flamework/core";
import { Players } from "@rbxts/services";
import { DEFAULT_PLAYER_DATA, PlayerData, OnPlayerDataLoaded } from "shared/types";
import ProfileService from "@rbxts/profileservice";

@Service()
export class PlayerDataService implements OnStart {
	private profileStore = ProfileService.GetProfileStore("PlayerTests", DEFAULT_PLAYER_DATA);
	private profiles = new Map<Player, PlayerData>();
	private loadedPlayers = new Set<Player>();
	private listeners = new Set<OnPlayerDataLoaded>();

	onStart(): void {
		// Setup lifecycle event listeners
		Modding.onListenerAdded<OnPlayerDataLoaded>((object) => {
			this.listeners.add(object);
			// Fire the event for all already loaded players
			for (const player of this.loadedPlayers) {
				const playerData = this.getPlayerData(player);
				if (playerData) {
					task.spawn(() => object.onPlayerDataLoaded(player, playerData));
				}
			}
		});
		Modding.onListenerRemoved<OnPlayerDataLoaded>((object) => this.listeners.delete(object));

		// Handle player joining
		Players.PlayerAdded.Connect((player) => {
			this.loadPlayerData(player);
		});

		// Handle player leaving
		Players.PlayerRemoving.Connect((player) => {
			this.unloadPlayerData(player);
		});

		// Handle existing players (for testing)
		for (const player of Players.GetPlayers()) {
			this.loadPlayerData(player);
		}
	}

	/**
	 * Load player data from ProfileService
	 */
	private loadPlayerData(player: Player): void {
		const profileKey = `Player_${player.UserId}`;

		const profile = this.profileStore.LoadProfileAsync(profileKey);

		if (profile !== undefined) {
			profile.AddUserId(player.UserId);
			profile.Reconcile();

			// Handle profile release (player leaves while profile is loading)
			profile.ListenToRelease(() => {
				this.profiles.delete(player);
				this.loadedPlayers.delete(player);
				player.Kick("Profile released. Please rejoin.");
			});

			// Check if player is still in game
			if (player.Parent === Players) {
				this.profiles.set(player, profile.Data);

				// Initialize player data if needed
				const data = profile.Data as PlayerData;
				data.playerId = player.UserId;
				data.username = player.Name;

				// Calculate offline progress

				this.loadedPlayers.add(player);

				// Fire the OnPlayerDataLoaded lifecycle event
				for (const listener of this.listeners) {
					task.spawn(() => listener.onPlayerDataLoaded(player, data));
				}

				print(`[PlayerDataService] Loaded data for ${player.Name}`);
			} else {
				// Player left before profile loaded
				profile.Release();
			}
		} else {
			// Profile couldn't be loaded
			player.Kick("Unable to load your data. Please try again later.");
			warn(`[PlayerDataService] Failed to load profile for ${player.Name}`);
		}
	}

	/**
	 * Unload player data and release profile
	 */
	private unloadPlayerData(player: Player): void {
		const profile = this.profiles.get(player);
		if (profile !== undefined) {
			this.profiles.delete(player);
			this.loadedPlayers.delete(player);
			print(`[PlayerDataService] Released data for ${player.Name}`);
		}
	}

	/**
	 * Get player data
	 */
	getPlayerData(player: Player): PlayerData | undefined {
		return this.profiles.get(player);
	}

	/**
	 * Update player data with a callback function
	 */
	updatePlayerData<T>(player: Player, updateFn: (data: PlayerData) => T): T | undefined {
		const data = this.getPlayerData(player);
		if (!data) return undefined;
		return updateFn(data);
	}
}
