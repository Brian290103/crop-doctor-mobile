import React, { ReactNode } from "react";
import { SafeAreaView, SafeAreaViewProps } from "react-native-safe-area-context";

interface ContainerProps extends SafeAreaViewProps {
  children: ReactNode;
  className?: string;
}

export function Container({ children, className, ...props }: ContainerProps) {
  return (
    <SafeAreaView className={`flex-1 bg-light ${className}`} {...props}>
      {children}
    </SafeAreaView>
  );
}
