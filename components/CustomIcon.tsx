import React from "react";
import { View } from "react-native";
import { FontAwesome, Ionicons, MaterialIcons } from "@expo/vector-icons";
import Feather from "@expo/vector-icons/Feather";
import colors from "../colors";

const colorVariants = {
  primary: colors.primary,
  secondary: colors.secondary,
  accent: colors.accent,
  danger: colors.danger,
  light: colors.light,
};

type IconProps = {
  name: any;
  size?: number;
  color?: string;
  className?: string;
  iconSet?: "MaterialIcons" | "FontAwesome" | "Ionicons" | "Feather";
  variant?: keyof typeof colorVariants;
};

export function CustomIcon({
  name,
  size = 24,
  color,
  className,
  iconSet = "MaterialIcons",
  variant,
}: IconProps) {
  const iconColor = color || (variant && colorVariants[variant]) || "black";

  const renderIcon = () => {
    switch (iconSet) {
      case "FontAwesome":
        return <FontAwesome name={name} size={size} color={iconColor} />;
      case "Ionicons":
        return <Ionicons name={name} size={size} color={iconColor} />;
      case "Feather":
        return <Feather name={name} size={size} color={iconColor} />;
      case "MaterialIcons":
      default:
        return <MaterialIcons name={name} size={size} color={iconColor} />;
    }
  };

  return <View className={className}>{renderIcon()}</View>;
}
