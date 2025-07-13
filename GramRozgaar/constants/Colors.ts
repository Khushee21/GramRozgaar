const tintColorLight = '#4CAF50'; // Leaf green
const tintColorDark = '#CDEAC0';  // Soft green glow

export const Colors = {
  light: {
    text: '#2E3A1F',              // Deep earthy text
    background: '#FAF9F6',        // Soft wheat background
    tint: tintColorLight,         // Primary button/links
    icon: '#6D8B5E',              // Muted leaf icon
    tabIconDefault: '#B6CBA3',
    tabIconSelected: tintColorLight,
    card: '#E7F2DA',              // Optional: for cards
    border: '#D0E4BC',
  },
  dark: {
    text: '#F0F7EC',              // Light green-white text
    background: '#1B2B19',        // Deep soil green
    tint: tintColorDark,          // Soft green highlight
    icon: '#A2BBA5',
    tabIconDefault: '#A2BBA5',
    tabIconSelected: tintColorDark,
    card: '#2D4030',              // Optional: card background
    border: '#3D5540',
  },
};
