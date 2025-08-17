import { Controller, OnStart, OnInit } from "@flamework/core";
import { Players, TweenService, ReplicatedStorage, Workspace } from "@rbxts/services";
import { Events } from "client/network";
import { CandyState } from "shared/types";

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
				// Spawn candy if we don't have one yet
				if (!this.playerCandy) {
					this.spawnCandyFromAssets(playerData.candyState.candyLevel, Players.LocalPlayer.UserId);
				}
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

		// Find the main candy part for animation
		const candyPart =
			(this.playerCandy.FindFirstChild("Candy") as BasePart) ||
			(this.playerCandy.FindFirstChildOfClass("BasePart") as BasePart);

		if (candyPart) {
			this.animateCandyBounce(candyPart);
			this.playClickSound(candyPart);
		}
	}

	/**
	 * Animate candy bounce effect
	 */
	private animateCandyBounce(candyPart: BasePart): void {
		const originalSize = candyPart.Size;
		const bounceSize = originalSize.mul(1.1);

		const bounceInfo = new TweenInfo(0.1, Enum.EasingStyle.Quad, Enum.EasingDirection.Out, 0, true);
		const bounceTween = TweenService.Create(candyPart, bounceInfo, { Size: bounceSize });
		bounceTween.Play();
	}

	/**
	 * Play click sound effect
	 */
	private playClickSound(candyPart: BasePart): void {
		const clickSound = candyPart.FindFirstChild("ClickSound") as Sound;
		if (clickSound) {
			clickSound.Play();
		} else {
			// Create a simple click sound if none exists
			const sound = new Instance("Sound");
			sound.SoundId = "rbxasset://sounds/electronicpingshort.wav";
			sound.Volume = 0.5;
			sound.Parent = candyPart;
			sound.Play();
			sound.Ended.Connect(() => sound.Destroy());
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

		// Find MAP.CandyCenter in Workspace
		const map = Workspace.FindFirstChild("MAP") as Folder;
		if (!map) {
			warn("MAP folder not found in Workspace");
			return;
		}

		const candyCenter = map.FindFirstChild("CandyCenter") as Folder | BasePart;
		if (!candyCenter) {
			warn("CandyCenter not found in Workspace.MAP");
			return;
		}

		// Clone and spawn the candy
		const candyClone = candyAsset.Clone();
		candyClone.Name = `Candy_Player_${playerId}`;
		candyClone.Parent = candyCenter;

		// Position the candy (if CandyCenter is a BasePart, use its position)
		if (candyCenter.IsA("BasePart")) {
			candyClone.PivotTo(candyCenter.CFrame);
		}

		// Store reference and setup click detection
		this.playerCandy = candyClone;
		print(`[Candy] Spawned candy for player ${playerId} at level ${level}`);
	}

	/**
	 * Update candy visual level by spawning new candy
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
