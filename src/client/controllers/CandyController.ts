import { Controller, OnStart, OnInit } from "@flamework/core";
import { Players, ReplicatedStorage, Workspace } from "@rbxts/services";
import { Make, Modify } from "@rbxts/altmake";
import { Events } from "client/network";
import { CandyState } from "shared/types";
import { mountCandyInfo } from "client/ui/components/CandyInfo";

/**
 * Client-side candy controller that handles all candy-related client functionality:
 * - Visual feedback and click detection
 * - Candy spawning and positioning
 * - Visual management and animations
 * Uses proper lifecycle management with OnInit and OnStart.
 */
@Controller({})
export class CandyController implements OnInit, OnStart {
	private candyState?: CandyState;
	private playerCandy?: Model;

	/**
	 * Initialize controller state and validate dependencies
	 */
	public onInit(): void {
		// Initialize state
		this.candyState = undefined;
		this.playerCandy = undefined;
		print("CandyController initialized");
	}

	/**
	 * Start controller operations and event handlers
	 */
	public onStart(): void {
		this.setupNetworkHandlers();
		this.setupClickHandler();
		print("CandyController started - handling visual feedback");
	}

	/**
	 * Setup network event handlers for candy updates and spawning
	 */
	private setupNetworkHandlers(): void {
		// Listen for player data updates to get candy state
		Events.playerDataUpdated.connect((playerData) => {
			if (playerData.candyState) {
				this.candyState = playerData.candyState;
				print(
					`[Candy] Player data updated: ${playerData.candyPoints} candy points, Candy level: ${this.candyState.candyLevel}`,
				);

				// Always spawn/update candy with current state
				this.spawnCandyFromAssets(playerData.candyState.candyLevel, Players.LocalPlayer.UserId);
			}
		});

		// Listen for candy visual updates from server for spawning
		Events.candyVisualUpdated.connect((candyData) => {
			print(`[Candy] Received candy visual update: Level ${candyData.level}, Player ID: ${candyData.playerId}`);
			this.spawnCandyFromAssets(candyData.level, candyData.playerId);
		});
	}

	/**
	 * Setup click handler for candy interaction
	 */
	private setupClickHandler(): void {
		const mouse = Players.LocalPlayer.GetMouse();
		mouse.Button1Down.Connect(() => {
			this.handleClick();
		});
	}

	/**
	 * Handle click events - detect clicks and provide immediate visual feedback
	 */
	private handleClick(): void {
		if (!this.playerCandy) {
			return; // No candy to click
		}

		// Check if click hit the candy
		const mouse = Players.LocalPlayer.GetMouse();
		if (mouse.Target && mouse.Target.IsDescendantOf(this.playerCandy)) {
			// Immediate visual feedback
			this.playClickFeedback();

			// Send click to server for data processing
			Events.candyClicked.fire();
		}
	}

	/**
	 * Play visual and audio feedback for candy click
	 */
	private playClickFeedback(): void {
		if (!this.playerCandy) return;

		// Try to find any part for animation - check AttachUI first, then any part
		const candyPart = this.playerCandy.FindFirstChild("Body") as Part;

		if (candyPart) {
			this.playClickSound(candyPart);
		}
	}

	/**
	 * Play click sound effect with random sound selection
	 */
	private playClickSound(candyPart: BasePart | Model): void {
		// Array of candy click sound IDs
		const candySounds = ["rbxassetid://71494735856888", "rbxassetid://104017874962810"];

		// Select random sound
		const randomIndex = math.random(0, candySounds.size() - 1);
		const selectedSoundId = candySounds[randomIndex];

		// Check for existing click sound
		const clickSound = candyPart.FindFirstChild("ClickSound") as Sound;
		if (clickSound) {
			print(`[Candy] Updating existing click sound with ID: ${selectedSoundId}`);
			// Update existing sound with random selection using Modify
			Modify(clickSound, {
				SoundId: selectedSoundId,
				Volume: 0.7,
			});
			clickSound.Play();
		} else {
			// Create new sound with random selection using Make
			const sound = Make("Sound", {
				Name: "ClickSound",
				SoundId: selectedSoundId,
				Volume: 0.7,
				Parent: candyPart,
			});
			sound.Play();

			// Clean up sound after playing
			sound.Ended.Connect(() => {
				sound.Destroy();
			});
		}
	}

	/**
	 * Spawn candy from ReplicatedStorage assets in MAP.CandyCenter
	 */
	private spawnCandyFromAssets(level: number, playerId: number): void {
		// Clean up existing candy first
		this.cleanupCandy();

		// Get assets folder from ReplicatedStorage
		const assetsFolder = ReplicatedStorage.FindFirstChild("Assets") as Folder;
		if (!assetsFolder) {
			warn("Assets folder not found in ReplicatedStorage");
			return;
		}

		// Find the appropriate candy asset for the level
		const candyAsset = assetsFolder.FindFirstChild(`Candy_Level_${level}`) as Model;
		if (!candyAsset) {
			warn(`Candy asset for level ${level} not found in ReplicatedStorage.Assets`);
			return;
		}

		// Get CandyCenter using MapService
		const candyCenter = Workspace.FindFirstChild("MAP")?.FindFirstChild("CandyCenter");
		if (!candyCenter) {
			warn("CandyCenter not available from MapService");
			return;
		}

		// Clone and spawn the candy using Make for enhanced setup
		const candyClone = candyAsset.Clone();
		Modify(candyClone, {
			Name: `Candy_Player_${playerId}`,
			Parent: candyCenter,
		});

		// Position the candy (if CandyCenter is a BasePart, use its position)
		if (candyCenter.IsA("BasePart")) {
			candyClone.PivotTo(candyCenter.CFrame);
		}

		// Add UI info - show candy level
		mountCandyInfo(candyClone, {
			title: `Level ${level} Candy`,
		});

		// Store reference and setup click detection
		this.playerCandy = candyClone;
		print(`[Candy] Spawned candy for player ${playerId} at level ${level}`);
	}

	/**
	 * Update candy level and respawn with new visual
	 */
	public updateCandyLevel(newLevel: number, playerId: number): void {
		print(`[Candy] Updating candy to level ${newLevel} for player ${playerId}`);
		this.spawnCandyFromAssets(newLevel, playerId);
	}

	/**
	 * Get the current candy model
	 */
	public getCandyModel(): Model | undefined {
		return this.playerCandy;
	}

	/**
	 * Clean up existing candy
	 */
	public cleanupCandy(): void {
		if (this.playerCandy) {
			this.playerCandy.Destroy();
			this.playerCandy = undefined;
		}
	}
}
