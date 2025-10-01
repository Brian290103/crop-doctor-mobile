import React from "react";
import { View } from "react-native";
import { Message } from "@ai-sdk/react";
import { CustomButton } from "../CustomButton";
import { CustomIcon } from "../CustomIcon";
import { CustomText } from "../CustomText";

type MessageActionsProps = {
  message: Message;
  onShowDetails: (message: Message) => void;
};

export const MessageActions = ({
  message,
  onShowDetails,
}: MessageActionsProps) => {
  const hasDetails = message.parts.some(
    (part) => part.type === "reasoning" || part.type.startsWith("tool-")
  );

  if (!hasDetails) {
    return null;
  }

  return (
    <View className="flex-row mt-2">
      <CustomButton
        onPress={() => onShowDetails(message)}
        size="sm"
        variant="outline"
      >
        <CustomIcon
          name="information-circle-outline"
          iconSet="Ionicons"
          size={16}
          color="gray"
        />
        <View className="w-2" />
        <CustomText>Show Details</CustomText>
      </CustomButton>
    </View>
  );
};
