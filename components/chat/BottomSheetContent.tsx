import React, { useState, useMemo, useEffect } from "react";
import { View } from "react-native";
import { Message, Part } from "@ai-sdk/react";
import { CustomButton } from "../CustomButton";
import { ReasoningView } from "./ReasoningView";
import { ToolView } from "./ToolView";
import { BottomSheetView } from "@gorhom/bottom-sheet";

type BottomSheetContentProps = {
  message: Message | null;
};

export const BottomSheetContent = ({ message }: BottomSheetContentProps) => {
  const [activeTab, setActiveTab] = useState<"reasoning" | "tools">("reasoning");

  const { reasoningParts, toolParts } = useMemo(() => {
    if (!message) return { reasoningParts: [], toolParts: [] };
    const reasoning = message.parts.filter((part) => part.type === "reasoning");
    const tools = message.parts.filter((part) => part.type.startsWith("tool-"));
    return { reasoningParts: reasoning, toolParts: tools };
  }, [message]);

  const hasReasoning = reasoningParts.length > 0;
  const hasTools = toolParts.length > 0;

  useEffect(() => {
    if (hasReasoning) {
      setActiveTab("reasoning");
    } else if (hasTools) {
      setActiveTab("tools");
    }
  }, [hasReasoning, hasTools, message]);

  if (!message) {
    return null;
  }

  return (
    <BottomSheetView style={{ padding: 16, flex: 1 }}>
      <View className="flex-row justify-center gap-4 mb-4">
        {hasReasoning && (
          <CustomButton
            label="Reasoning"
            onPress={() => setActiveTab("reasoning")}
            variant={activeTab === "reasoning" ? "default" : "outline"}
          />
        )}
        {hasTools && (
          <CustomButton
            label="Tools"
            onPress={() => setActiveTab("tools")}
            variant={activeTab === "tools" ? "default" : "outline"}
          />
        )}
      </View>

      {activeTab === "reasoning" && <ReasoningView parts={reasoningParts} />}
      {activeTab === "tools" && <ToolView parts={toolParts} />}
    </BottomSheetView>
  );
};
