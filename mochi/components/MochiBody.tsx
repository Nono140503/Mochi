import React, { useEffect } from "react";
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withTiming,
  withRepeat,
  withSequence,
  Easing,
} from "react-native-reanimated";
import Svg, {
  Path,
  Circle,
  Ellipse,
  Defs,
  LinearGradient,
  RadialGradient,
  Stop,
  G,
  Rect,
  Text as SvgText,
} from "react-native-svg";
import { MochiMood } from "../store/mochiStore";
import { shiftColor } from "../lib/color";

const AnimatedPath = Animated.createAnimatedComponent(Path);
const AnimatedG = Animated.createAnimatedComponent(G);

// Hand-tuned cute creature paths with little arm/foot nubs for each mood
const BLOB_PATHS: Record<string, string> = {
  neutral:
    "M100,22 C148,22 176,55 174,98 C172,130 178,145 160,172 C142,185 130,182 100,182 C70,182 58,185 40,172 C22,145 28,130 26,98 C24,55 52,22 100,22 Z",
  glowing:
    "M100,18 C152,18 182,50 180,95 C178,130 184,142 165,174 C145,188 132,184 100,184 C68,184 55,188 35,174 C16,142 22,130 20,95 C18,50 48,18 100,18 Z",
  blooming:
    "M100,16 C155,16 185,48 182,92 C180,128 188,140 168,175 C146,190 135,185 100,185 C65,185 54,190 32,175 C12,140 20,128 18,92 C15,48 45,16 100,16 Z",
  wilting:
    "M100,32 C142,32 168,62 165,102 C162,135 166,148 152,170 C136,180 125,178 100,178 C75,178 64,180 48,170 C34,148 38,135 35,102 C32,62 58,32 100,32 Z",
  curled:
    "M100,42 C135,42 158,70 156,108 C154,136 156,148 144,168 C130,176 120,174 100,174 C80,174 70,176 56,168 C44,148 46,136 44,108 C42,70 65,42 100,42 Z",
  tired:
    "M100,38 C138,38 162,68 160,105 C158,134 162,146 148,168 C132,176 122,174 100,174 C78,174 68,176 52,168 C38,146 42,134 40,105 C38,68 62,38 100,38 Z",
};

// Mood color shift deltas
const MOOD_SHIFTS: Record<
  string,
  { hueShift: number; satShift: number; lightShift: number }
> = {
  neutral: { hueShift: 0, satShift: 0, lightShift: 0 },
  glowing: { hueShift: 8, satShift: 15, lightShift: 8 },
  blooming: { hueShift: 15, satShift: 20, lightShift: 5 },
  wilting: { hueShift: -20, satShift: -25, lightShift: -8 },
};

export const EXACT_MOOD_COLORS: Record<string, string> = {
  happy: "#FFE9A8",
  loved: "#F7B8D2",
  content: "#FFD0B5",
  calm: "#BDE8D4",
  sad: "#AFC9E8",
  deeply_sad: "#9EB6D3",
  anxious: "#C9B9E8",
  overwhelmed: "#D5C5E8",
  angry: "#F3A6A0",
  annoyed: "#F6BE8A",
  lonely: "#AEB5D8",
  tired: "#B8C7B0",
  burnt_out: "#C5AFC1",
  scared: "#C5DCE8",
  numb: "#D9D6DF",
  hopeful: "#A9D9B5",
  excited: "#E5B8E5",
  grateful: "#F5DFA6",
  proud: "#E9AFC0",
  at_peace: "#B8DFDE",
  glowing: "#FFE9A8",
  blooming: "#F7B8D2",
  curled: "#C9B9E8",
  wilting: "#AFC9E8",
};

export default function MochiBody({
  mood,
  baseColor,
  size = 200,
  hasLaptop = false,
  hasPomPoms = false,
}: {
  mood: MochiMood;
  baseColor: string;
  size?: number;
  hasLaptop?: boolean;
  hasPomPoms?: boolean;
}) {
  const breathe = useSharedValue(1);
  const moodColor = mood === "neutral" ? baseColor : (EXACT_MOOD_COLORS[mood] || baseColor);
  const lightColor = shiftColor(moodColor, { hueShift: -10, satShift: 10, lightShift: 14 });
  const shadowTint = shiftColor(moodColor, { hueShift: 10, satShift: -5, lightShift: -10 });

  useEffect(() => {
    breathe.value = withRepeat(
      withSequence(
        withTiming(1.04, { duration: 1800, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 1800, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );
  }, []);

  const animatedGroupProps = useAnimatedProps(() => ({
    transform: [{ scale: breathe.value }],
  }));

  const isWinking = mood === "glowing" || mood === "excited";
  const isSleeping = mood === "tired";
  const isWorried = ["anxious", "overwhelmed", "scared"].includes(mood);
  const isSad = ["sad", "deeply_sad", "lonely", "burnt_out", "numb", "wilting"].includes(mood);
  const isAngry = ["angry", "annoyed"].includes(mood);
  const isCalmOrPeaceful = ["calm", "content", "at_peace"].includes(mood);

  return (
    <Svg width={size} height={size} viewBox="0 0 200 200">
      <Defs>
        {/* 3D Glassy top highlight */}
        <LinearGradient id="glossHighlight" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.6" />
          <Stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.0" />
        </LinearGradient>

        {/* Soft Blush Gradient */}
        <RadialGradient id="blushGradient" cx="50%" cy="50%" r="50%">
          <Stop offset="0%" stopColor="#FF8EA6" stopOpacity="0.65" />
          <Stop offset="100%" stopColor="#FF8EA6" stopOpacity="0.0" />
        </RadialGradient>
      </Defs>

      {/* Ground Soft Drop Shadow */}
      <Ellipse cx="100" cy="186" rx="58" ry="8" fill="#D6C7F5" opacity={0.4} />

      {/* Animated Creature Body Group */}
      <AnimatedG animatedProps={animatedGroupProps} originX={100} originY={100}>
        {/* Waving Left Arm Nub */}
        <Path
          d="M32,108 C16,92 18,68 34,72 C42,74 46,90 42,108 Z"
          fill={lightColor}
        />

        {/* Right Arm Nub */}
        <Path
          d="M168,110 C182,118 184,132 170,138 C160,140 156,128 162,114 Z"
          fill={shadowTint}
        />

        {/* Main Body Path - filled with moodColor */}
        <Path
          d={BLOB_PATHS[mood] || BLOB_PATHS.neutral}
          fill={moodColor}
        />

        {/* Glassy 3D Highlight Overlay */}
        <Path
          d="M75,28 C120,28 152,50 158,80 C146,54 116,36 75,28 Z"
          fill="url(#glossHighlight)"
        />

        {/* Sparkle Highlights on Body */}
        <Circle cx="138" cy="65" r="2.5" fill="#FFFFFF" opacity={0.8} />
        <Circle cx="148" cy="80" r="1.5" fill="#FFFFFF" opacity={0.7} />
        <Circle cx="60" cy="145" r="2" fill="#FFFFFF" opacity={0.6} />

        {/* Floating Magic Sparkle or Sweat drop */}
        {isWorried ? (
          <Path
            d="M148,60 C154,64 154,72 148,76 C144,72 144,64 148,60 Z"
            fill="#B8E3FF"
            opacity={0.9}
          />
        ) : (
          <Path
            d="M24,56 L26,61 L31,63 L26,65 L24,70 L22,65 L17,63 L22,61 Z"
            fill="#FFFFFF"
            opacity={0.85}
          />
        )}

        {/* Blush Cheeks */}
        <Ellipse cx="62" cy="106" rx="10" ry="6" fill="url(#blushGradient)" />
        <Ellipse cx="138" cy="106" rx="10" ry="6" fill="url(#blushGradient)" />

        {/* EYES */}
        {isSleeping ? (
          // Tired / Sleepy drooped eyes (u u) with Zzz bubbles
          <G>
            <Path
              d="M68,90 Q78,98 88,90"
              stroke="#2D2146"
              strokeWidth="3.5"
              strokeLinecap="round"
              fill="none"
            />
            <Path
              d="M112,90 Q122,98 132,90"
              stroke="#2D2146"
              strokeWidth="3.5"
              strokeLinecap="round"
              fill="none"
            />
            {/* Zzz floating sleep bubbles */}
            <SvgText
              x="136"
              y="58"
              fill="#7D7AF2"
              fontSize="14"
              fontWeight="800"
              opacity={0.9}
            >
              z
            </SvgText>
            <SvgText
              x="146"
              y="44"
              fill="#7D7AF2"
              fontSize="18"
              fontWeight="800"
              opacity={0.8}
            >
              Z
            </SvgText>
          </G>
        ) : isCalmOrPeaceful ? (
          // Peaceful closed curved eyes (^ ^)
          <G>
            <Path
              d="M68,95 C74,88 82,88 88,95"
              stroke="#2D2146"
              strokeWidth="3"
              strokeLinecap="round"
              fill="none"
            />
            <Path
              d="M112,95 C118,88 126,88 132,95"
              stroke="#2D2146"
              strokeWidth="3"
              strokeLinecap="round"
              fill="none"
            />
          </G>
        ) : isSad ? (
          // Sad / Downcast teary drooped eyes
          <G>
            <Path
              d="M68,96 C74,103 82,103 88,96"
              stroke="#2D2146"
              strokeWidth="3"
              strokeLinecap="round"
              fill="none"
            />
            <Path
              d="M112,96 C118,103 126,103 132,96"
              stroke="#2D2146"
              strokeWidth="3"
              strokeLinecap="round"
              fill="none"
            />
          </G>
        ) : isAngry ? (
          // Angry / Annoyed slanted eyes (/ \)
          <G>
            <Path
              d="M68,78 L86,86"
              stroke="#2D2146"
              strokeWidth="3"
              strokeLinecap="round"
            />
            <Path
              d="M132,78 L114,86"
              stroke="#2D2146"
              strokeWidth="3"
              strokeLinecap="round"
            />
            <Ellipse cx="78" cy="95" rx="9" ry="12" fill="#2D2146" />
            <Ellipse cx="122" cy="95" rx="9" ry="12" fill="#2D2146" />
            <Circle cx="75" cy="90" r="3" fill="#FFFFFF" />
            <Circle cx="119" cy="90" r="3" fill="#FFFFFF" />
          </G>
        ) : isWorried ? (
          // Worried / Anxious / Overwhelmed wide eyes (\ /)
          <G>
            <Path
              d="M68,82 L86,76"
              stroke="#2D2146"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <Path
              d="M132,82 L114,76"
              stroke="#2D2146"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <Ellipse cx="78" cy="94" rx="10" ry="13" fill="#2D2146" />
            <Ellipse cx="122" cy="94" rx="10" ry="13" fill="#2D2146" />
            <Circle cx="75" cy="89" r="4" fill="#FFFFFF" />
            <Circle cx="119" cy="89" r="4" fill="#FFFFFF" />
          </G>
        ) : (
          // Happy / Excited / Loving / Default Kawaii Eyes
          <G>
            <G>
              <Path
                d="M71,76 C76,73 82,74 85,76"
                stroke="#2D2146"
                strokeWidth="2"
                strokeLinecap="round"
                fill="none"
              />
              <Ellipse cx="78" cy="94" rx="11" ry="14" fill="#2D2146" />
              <Circle cx="74" cy="88" r="4.5" fill="#FFFFFF" />
              <Circle cx="82" cy="98" r="2.2" fill="#FFFFFF" />
            </G>
            {isWinking ? (
              <G>
                <Path
                  d="M112,95 C118,88 126,88 132,95"
                  stroke="#2D2146"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  fill="none"
                />
                <Path
                  d="M114,76 C118,74 124,74 128,76"
                  stroke="#2D2146"
                  strokeWidth="2"
                  strokeLinecap="round"
                  fill="none"
                />
              </G>
            ) : (
              <G>
                <Path
                  d="M115,76 C118,74 124,74 129,76"
                  stroke="#2D2146"
                  strokeWidth="2"
                  strokeLinecap="round"
                  fill="none"
                />
                <Ellipse cx="122" cy="94" rx="11" ry="14" fill="#2D2146" />
                <Circle cx="118" cy="88" r="4.5" fill="#FFFFFF" />
                <Circle cx="126" cy="98" r="2.2" fill="#FFFFFF" />
              </G>
            )}
          </G>
        )}

        {/* MOUTH */}
        {isSleeping ? (
          // Sleepy soft pouting mouth
          <Path
            d="M95,107 C97,111 103,111 105,107"
            stroke="#2D2146"
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
          />
        ) : isWorried ? (
          // Wavy worried mouth
          <Path
            d="M91,108 C96,103 104,113 109,108"
            stroke="#2D2146"
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
          />
        ) : isSad ? (
          // Downward sad curve
          <Path
            d="M93,112 C97,105 103,105 107,112"
            stroke="#2D2146"
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
          />
        ) : isAngry ? (
          // Firm pouting mouth
          <Path
            d="M93,110 Q100,104 107,110"
            stroke="#2D2146"
            strokeWidth="3"
            strokeLinecap="round"
            fill="none"
          />
        ) : (
          // Open Happy Kawaii Smile with Tongue
          <G>
            <Path
              d="M91,102 C91,114 109,114 109,102 Z"
              fill="#2D2146"
            />
            <Path
              d="M94,107 C97,113 103,113 106,107 C103,104 97,104 94,107 Z"
              fill="#FF6B8B"
            />
          </G>
        )}

        {/* Cute Working Laptop in front of Mochi when acting busy */}
        {hasLaptop && (
          <G>
            {/* Screen Lid (Back) */}
            <Rect x="64" y="116" width="72" height="42" rx="6" fill="#3A364F" />
            {/* Screen Glow (Front) */}
            <Rect x="67" y="119" width="66" height="36" rx="4" fill="#A4D4FF" opacity={0.9} />
            {/* Code Lines on Screen */}
            <Rect x="73" y="125" width="28" height="3" rx="1.5" fill="#7D7AF2" opacity={0.8} />
            <Rect x="73" y="131" width="42" height="3" rx="1.5" fill="#FF8EA6" opacity={0.8} />
            <Rect x="73" y="137" width="20" height="3" rx="1.5" fill="#52C41A" opacity={0.8} />
            <Rect x="73" y="143" width="34" height="3" rx="1.5" fill="#FFA940" opacity={0.8} />
            {/* Mini Logo Sticker on Back */}
            <Circle cx="100" cy="137" r="4" fill="#FFFFFF" opacity={0.6} />

            {/* Keyboard Base */}
            <Path d="M50,158 L150,158 L158,170 L42,170 Z" fill="#29263A" />
            {/* Trackpad */}
            <Rect x="88" y="161" width="24" height="6" rx="2" fill="#4B4763" />

            {/* Mochi's Paws on Keyboard */}
            <Ellipse cx="68" cy="157" rx="9" ry="6" fill={lightColor} />
            <Ellipse cx="132" cy="157" rx="9" ry="6" fill={lightColor} />
          </G>
        )}
        {hasPomPoms && (
          <G>
            {/* Left Fluffy Pom-Pom Burst */}
            <G>
              <Circle cx="24" cy="74" r="16" fill="#FF6B8B" />
              <Circle cx="18" cy="68" r="12" fill="#FFC2D1" />
              <Circle cx="30" cy="80" r="11" fill="#FFD166" />
              <Circle cx="24" cy="74" r="8" fill="#B79CFF" />
              <Circle cx="34" cy="66" r="7" fill="#7D7AF2" />
              <Circle cx="14" cy="80" r="6" fill="#FF8EA6" />
            </G>
            {/* Right Fluffy Pom-Pom Burst */}
            <G>
              <Circle cx="176" cy="74" r="16" fill="#FF6B8B" />
              <Circle cx="182" cy="68" r="12" fill="#FFC2D1" />
              <Circle cx="170" cy="80" r="11" fill="#FFD166" />
              <Circle cx="176" cy="74" r="8" fill="#B79CFF" />
              <Circle cx="166" cy="66" r="7" fill="#7D7AF2" />
              <Circle cx="186" cy="80" r="6" fill="#FF8EA6" />
            </G>
            {/* Flying Cheer Sparkles */}
            <Circle cx="12" cy="50" r="3" fill="#FFD166" opacity={0.9} />
            <Circle cx="188" cy="50" r="3" fill="#FFD166" opacity={0.9} />
            <Circle cx="38" cy="40" r="2.5" fill="#7D7AF2" opacity={0.8} />
            <Circle cx="162" cy="40" r="2.5" fill="#7D7AF2" opacity={0.8} />
          </G>
        )}
      </AnimatedG>
    </Svg>
  );
}
