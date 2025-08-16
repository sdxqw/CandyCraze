import { Controller, OnStart } from "@flamework/core";
import { Players, ReplicatedStorage, Workspace, TweenService, SoundService } from "@rbxts/services";
import { Events } from "client/network";
import { CandyState } from "shared/types";

/**
 * Client-side candy controller that spawns player's own candy based on their level.
 */
@Controller({})
export class CandyController implements OnStart {
	private candyState?: CandyState;
	private playerCandy?: Model;

	onStart(): void {
		this.setupNetworkHandlers();
		this.setupClickHandler();
		print("CandyController started");
	}

	/**
	 * Setup network event handlers
	 */
	private setupNetworkHandlers(): void {
		Events.candyStateUpdated.connect((candyState) => {
			this.candyState = candyState;
			print(
				`[CandyController] Candy state updated: Level ${candyState.candyLevel}, Points per click: ${candyState.pointsPerClick}`,
			);
		});

		Events.playerDataUpdated.connect((playerData) => {
			if (playerData.candyState) {
				this.candyState = playerData.candyState;
				print(
					`[CandyController] Player data updated: ${playerData.candyPoints} candy points, Candy level: ${playerData.candyState.candyLevel}`,
				);
			}
		});

		// Listen for candy data updates from server for visual spawning
		Events.candyDataUpdated.connect((candyData) => {
			print(
				`[CandyController] Received candy data for spawning: Level ${candyData.level}, Player ID: ${candyData.playerId}`,
			);
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
	 * Handle click events
	 */
	private handleClick(): void {
		if (!this.candyState) {
			print(`[CandyController] Cannot click: No candy state (candyState: ${this.candyState})`);
			return;
		}
		if (!this.playerCandy) {
			print(`[CandyController] Cannot click: No candy model (playerCandy: ${this.playerCandy})`);
			return;
		}

		// Check if click hit the candy
		const mouse = Players.LocalPlayer.GetMouse();
		if (mouse.Target && mouse.Target.IsDescendantOf(this.playerCandy)) {
			// Send click to server
			Events.candyClicked.fire();
			print(`[CandyController] Candy clicked! Sending to server... (Level: ${this.candyState.candyLevel})`);

			// Add visual feedback
			this.playClickFeedback();
		} else {
			print(
				`[CandyController] Click missed candy target (Target: ${mouse.Target?.Name !== undefined || "none"})`,
			);
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
		} else {
			// If CandyCenter is a folder, position at origin or find a spawn point
			const spawnPoint = candyCenter.FindFirstChild("SpawnPoint") as BasePart;
			if (spawnPoint) {
				candyClone.PivotTo(spawnPoint.CFrame);
			}
		}

		// Store reference to the spawned candy
		this.playerCandy = candyClone;

		print(`Spawned candy at level ${level} for player ${playerId} in MAP.CandyCenter`);
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
			// Create bounce animation
			const originalSize = candyPart.Size;
			const bounceSize = originalSize.mul(1.1);

			const bounceInfo = new TweenInfo(0.1, Enum.EasingStyle.Quad, Enum.EasingDirection.Out, 0, true);
			const bounceTween = TweenService.Create(candyPart, bounceInfo, { Size: bounceSize });
			bounceTween.Play();

			// Play click sound (if available)
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
	}

	/**
	 * Clean up existing candy
	 */
	private cleanupCandy(): void {
		if (this.playerCandy) {
			this.playerCandy.Destroy();
			this.playerCandy = undefined;
		}
	}
}
