import React, { ReactNode } from "react";
import { TouchableOpacity, TouchableOpacityProps } from "react-native";
import { CustomText } from "./CustomText";

const buttonStyles = {
  variant: {
    default: "bg-primary",
    destructive: "bg-danger",
    outline: "border border-gray-400 bg-transparent",
    secondary: "bg-secondary",
    ghost: "bg-transparent",
    link: "bg-transparent underline",
  },
  size: {
    default: "h-10 py-2 px-4",
    sm: "h-9 px-3 rounded-md",
    lg: "h-11 px-8 rounded-md",
    icon: "h-10 w-10 items-center justify-center",
  },
};

const textStyles = {
  variant: {
    default: "text-light",
    destructive: "text-light",
    outline: "text-dark",
    secondary: "text-light",
    ghost: "text-dark",
    link: "text-primary",
  },
  size: {
    default: "",
    sm: "text-sm",
    lg: "text-lg",
    icon: "",
  },
};

interface ButtonProps extends TouchableOpacityProps {
  children?: ReactNode;
  variant?: keyof typeof buttonStyles.variant;
  size?: keyof typeof buttonStyles.size;
  label?: string;
  labelClassName?: string;
}

export function CustomButton({
  children,
  variant = "default",
  size = "default",
  label,
  labelClassName,
  className,
  ...props
}: ButtonProps) {
  const buttonVariantStyle = buttonStyles.variant[variant];
  const buttonSizeStyle = buttonStyles.size[size];

  const textVariantStyle = textStyles.variant[variant];
  const textSizeStyle = textStyles.size[size];

  const gap = label && children ? "gap-x-2" : "";

  return (
    <TouchableOpacity
      className={`flex-row items-center justify-center rounded-md ${buttonVariantStyle} ${buttonSizeStyle} ${gap} ${className}`}
      {...props}
    >
      {label && (
        <CustomText
          className={`${textVariantStyle} ${textSizeStyle} ${labelClassName}`}
        >
          {label}
        </CustomText>
      )}
      {children}
    </TouchableOpacity>
  );
}
