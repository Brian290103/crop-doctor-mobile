import { Text, TextProps } from "react-native";

const headingStyles = {
  h1: "text-4xl font-bold",
  h2: "text-3xl font-bold",
  h3: "text-2xl font-bold",
  h4: "text-xl font-bold",
  h5: "text-lg font-bold",
  h6: "text-base font-bold",
};

type HeadingVariant = keyof typeof headingStyles;

interface CustomTextProps extends TextProps {
  variant?: HeadingVariant;
  className?: string;
}

export function CustomText({
  variant = "h6",
  className = "",
  ...props
}: CustomTextProps) {
  const variantStyle = headingStyles[variant];
  return (
    <Text
      className={`text-dark ${variantStyle} ${className}`}
      {...props}
    />
  );
}