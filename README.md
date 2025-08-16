
---

# 🍬 Game Design Document: Candy Craze

---

## 1. Overview

* **Game Name**: Candy Craze
* **Genre**: Incremental / Simulator
* **Platform**: Roblox
* **Target Audience**: Kids & teens (ages 8–14), fans of Roblox simulators (Pet Simulator 99, Bubble Gum Simulator).
* **Theme**: Players run a magical candy factory, clicking a **Big Candy** to earn **Candy Points**, spending them on **upgrades, dice rolls, and boosters**, while unlocking **Candy Pets** and prestige rewards.
* **Core Concept**: Click → Upgrade → Roll Dice → Unlock Pets → Prestige → Repeat.
* **Unique Selling Points**:

  * Bright, kid-friendly **candy factory theme**.
  * Personalized **Big Candy** that evolves visually per player.
  * **Sugar Dice** mechanic: always-rewarding chance-based system.
  * Mix of **active clicking** + **idle automation**.
  * **Pets & prestige loop** for long-term engagement.

---

## 2. Core Gameplay Loop

1. **Click Big Candy** → Earn Candy Points.
2. **Spend Candy Points** → Buy **upgrades, dice rolls, boosters**.
3. **Unlock Candy Pets** → From hatch progress or dice rolls.
4. **Prestige (Sugar Reset)** → Trade progress for Golden Sprinkles (permanent multipliers + new candy forms).
5. **Repeat** → Bigger numbers, rarer pets, stronger boosts.

👉 Designed for **short-session fun** + **long-term addiction**.

---

## 3. Big Candy (Central Mechanic)

* **Static central model**, clicked for Candy Points.
* Evolves instantly at milestones (per player, client-side).
* **Visual Progression Example**:

  * Lvl 1 → Small Jawbreaker.
  * Lvl 2 → Gummy Bear.
  * Lvl 3 → Rainbow Lollipop.
  * Prestige → Chocolate Orb → Star Candy → beyond.

**Mechanics**:

* Click starts at **+1 Candy Point**.
* Progress Bar above Big Candy fills every 1,000 clicks → **Hatches Pet or Booster Chest**.
* Swaps are **instant model changes** (no animation).

---

## 4. Candy Merchant (Dice & Boosters)

### 4.1 Sugar Dice (Main Chance Mechanic)

* Buy dice rolls for **100–5,000 Candy Points**.
* Rolling = always some reward (no empty rolls).

**Reward Table**:

* 🎲 Roll 1 → +100 Candies.
* 🎲 Roll 2 → 2× Click Power (30s).
* 🎲 Roll 3 → 2× Auto Production (30s).
* 🎲 Roll 4 → +10% Hatch Progress.
* 🎲 Roll 5 → Temporary Booster Pet (5m, e.g. “Candy Spirit”).
* 🎲 Roll 6 → Rare Pet (Unicorn Gummy, \~1% chance).

👉 Gives **excitement + “one more roll” addiction**.

---

### 4.2 Boosters (Short-Term Power-Ups)

* Earned via **dice rolls, shop, or events**.
* Examples:

  * **Fizzy Potion** → +50% click power (1 min).
  * **Golden Wrapper** → Next hatch = guaranteed Rare Pet.
  * **Candy Storm Booster** → Next Candy Storm = 2× rewards.

👉 Boosters = **dynamic gameplay spikes**.

---

## 5. Upgrades

### Click Upgrades (active play)

* **Sugar Glove** (50 Candies) → 2× per click.
* **Lollipop Hammer** (500 Candies) → 5× per click.
* **Candy Blaster** (5,000 Candies) → 10× per click.

### Automation Upgrades (idle play)

* **Gummy Bot** (100 Candies) → +10 cps.
* **Chocolate Fountain** (1,000 Candies) → +100 cps.
* **Rainbow Conveyor** (10,000 Candies) → +1,000 cps.

### Special Upgrades (variety & surprise)

* **Sugar Surge** (2,000 Candies) → 10% chance to triple output for 10s.
* **Caramel Link** (5,000 Candies) → Doubles 2 machines.
* **Mystery Candy** (50,000 Candies) → Unlocks Prestige currency (Golden Sprinkles).

---

## 6. Candy Pets

* Core collectible & multiplier system.
* Obtained via:

  * Progress Bar hatches.
  * Dice rolls (rare outcomes).
  * Event rewards.

**Pet Examples**:

* **Gummy Bear** → +10% auto production.
* **Chocolate Bunny** → +5% click power.
* **Unicorn Gummy (Rare)** → +50% click power + sparkle effect.

👉 Pets = **long-term grind & bragging rights**.

---

## 7. Prestige (Sugar Reset)

* Unlocks after **100,000 Candy Points**.
* Resets **Candy Points, upgrades, Big Candy stage**.
* Grants **Golden Sprinkles** (1 per 100k Candies reset).
* Each Sprinkle = +2× permanent multiplier.
* Prestige unlocks **exclusive Big Candy models**.

👉 Infinite replayability with exponential growth.

---

## 8. Events & Retention

* **Candy Storms** → Global 30s frenzy (all players 2× Candy).
* **Daily Login Rewards** → Free dice, candies, or boosters.
* **Leaderboards** → Candy Points, pets collected.
* **Seasonal Events** → Halloween Pumpkins, Christmas Peppermints.

---

## 9. Monetization

* **Gamepasses**:

  * VIP Wrapper → Permanent 2× multiplier (\~50 Robux).
  * Lucky Dice → Better odds for rare rolls (\~100 Robux).
  * Auto-Clicker Machine → Permanent automation (\~200 Robux).

* **Robux Purchases**:

  * Dice Bundles.
  * Booster Packs.
  * Exclusive Pets.

👉 Monetization tied directly to **dice & pets = addictive loop**.

---

## 10. Technical Implementation

* **Big Candy** → Part with ClickDetector → GUI progress bar → client-side model swaps.
* **Merchant** → NPC with ProximityPrompt → Shop GUI → dice roll animations.
* **Upgrades** → DataStore saves multipliers + auto production.
* **Dice Rolls** → RNG weighted system, always guaranteed reward.
* **Pets** → Follower models with stat modifiers.
* **Prestige** → Data reset with permanent multiplier currency.

---

## 11. Development Plan

**Prototype (Week 1)**

* Big Candy clicking system.
* Candy Points + shop GUI.
* Basic dice roll mechanic.

**Alpha (Week 2–3)**

* Add upgrades, automation, boosters.
* Implement Candy Pets.
* Prestige system.

**Polish (Week 4–5)**

* Add effects, music, models from Toolbox.
* Leaderboards, daily rewards, Candy Storm events.

**Launch (Week 6)**

* Publish with thumbnail + icon.
* Promote via Roblox groups, YouTube shorts.

---

## 12. Future Updates

* More Big Candy evolutions (Cotton Candy Cloud, Pop Rocks).
* Legendary pets with unique abilities.
* Co-op Factory Mode → Merge factories with friends.
* Trading system for Candy Pets.
* Seasonal Events → Candy Corn Halloween, Gingerbread Xmas.

## 13. Technical Details

* @rbxts/flamework for efficient code organization. (Installed)
* @rbxts/charm for state management. (Installed)
* @rbxts/vide-charm state manager for GUI using charm. (Installed)
* @rbxts/vide for GUI. (Installed)
* @rbxts/profileservice for player data management. (Installed)
* @rbxts/shared-components-flamework used for shared components. (Installed)

