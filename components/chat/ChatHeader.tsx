import { Container } from "@/components/Container";
import { CustomButton } from "@/components/CustomButton";
import { CustomIcon } from "@/components/CustomIcon";
import { CustomText } from "@/components/CustomText";
import { useRouter } from "expo-router";
import React from "react";
import { TextInput, View } from "react-native";

export const ChatHeader = () => {
  const router = useRouter();
  return (
    <View className="items-center flex flex-row p-4">
      <CustomButton size="icon" onPress={() => router.back()}>
        <CustomIcon color="white" name={"arrow-back"} iconSet="Ionicons" />
      </CustomButton>
      <CustomText variant="h3" className="text-primary mx-auto">
        Ask your Question
      </CustomText>
    </View>
  );
};
