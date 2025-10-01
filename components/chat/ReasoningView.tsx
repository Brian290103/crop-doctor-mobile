import React from "react";
import { ScrollView } from "react-native";
import { Part } from "@ai-sdk/react";
import Markdown from "react-native-markdown-display";

type ReasoningViewProps = {
  parts: Part[];
};

export const ReasoningView = ({ parts }: ReasoningViewProps) => {
  return (
    <ScrollView>
      {parts.map((part, i) => {
        if (part.type === "reasoning") {
          return <Markdown key={i}>{part.text}</Markdown>;
        }
        return null;
      })}
    </ScrollView>
  );
};
