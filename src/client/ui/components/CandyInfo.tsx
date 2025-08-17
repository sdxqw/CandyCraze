import Vide, { mount } from "@rbxts/vide";

interface CandyInfoProps {
	title: string;
}

export const CandyInfo = (props: CandyInfoProps) => {
	return (
		<billboardgui
			Active={true}
			AlwaysOnTop={true}
			MaxDistance={150}
			Size={new UDim2(14.454, 100, 9.034, 25)}
			ClipsDescendants={true}
			Brightness={1.25}
			ResetOnSpawn={false}
			DistanceUpperLimit={-0.7227}
		>
			<textlabel
				TextWrapped={true}
				TextStrokeTransparency={0.6}
				BorderSizePixel={0}
				BackgroundTransparency={1}
				FontFace={
					new Font(
						"rbxasset://fonts/families/FredokaOne.json",
						Enum.FontWeight.Regular,
						Enum.FontStyle.Normal,
					)
				}
				Text={props.title}
				TextScaled={true}
				TextColor3={Color3.fromRGB(0, 255, 255)}
				AnchorPoint={new Vector2(0.5, 0.5)}
				Position={UDim2.fromScale(0.5, 0.5)}
				TextSize={18}
				Size={UDim2.fromScale(0.95, 0.8)}
			>
				<uistroke LineJoinMode={Enum.LineJoinMode.Bevel} Thickness={3} />
			</textlabel>
		</billboardgui>
	);
};

export function mountCandyInfo(part: Model, props: CandyInfoProps) {
	// Find the AttachUI part specifically for mounting UI
	const attachUI = part.FindFirstChild("AttachUI") as Part;
	print(`Mounting candy info on part: ${part.Name}`);
	if (attachUI) {
		mount(() => {
			return <CandyInfo title={props.title} />;
		}, attachUI);
	} else {
		warn("AttachUI part not found in candy model for UI mounting");
	}
}
