import React, { useState } from "react";
import { ScrollView, View, TouchableOpacity } from "react-native";
import { Part } from "@ai-sdk/react";
import Markdown from "react-native-markdown-display";
import { CustomIcon } from "../CustomIcon";
import { CustomText } from "../CustomText";

type ToolViewProps = {
  parts: Part[];
};

export const ToolView = ({ parts }: ToolViewProps) => {
  const [expandedTool, setExpandedTool] = useState<number | null>(null);

  const toggleExpand = (index: number) => {
    setExpandedTool(expandedTool === index ? null : index);
  };

  return (
    <ScrollView className="h-full">
      {parts.map((part, i) => {
        if (
          part.type === "tool-getCropId" ||
          part.type === "tool-getInformation" ||
          part.type === "tool-analyzeImage"
        ) {
          const isExpanded = expandedTool === i;

          return (
            <View
              key={i}
              className="flex flex-col gap-3 py-3 border border-gray-300 rounded-lg px-3 mb-2"
            >
              <TouchableOpacity
                onPress={() => toggleExpand(i)}
                className={"flex-row justify-start gap-3 items-center"}
              >
                <CustomIcon
                  name="tool"
                  iconSet="Feather"
                  size={18}
                  color={isExpanded ? "green" : "gray"}
                />

                <CustomText
                  className={isExpanded ? "text-primary" : "text-dark"}
                >
                  {part.type === "tool-getCropId"
                    ? "Getting the Crop ID"
                    : part.type === "tool-getInformation"
                      ? "Getting the Crop Information"
                      : part.type === "tool-analyzeImage"
                        ? "Getting the Image Analysis"
                        : "Unknown Tool"}
                </CustomText>
                <View className="">
                  {part.state === "output-available" ? (
                    <View className="bg-green-50 border-primary border py-1 px-2 rounded-full flex flex-row gap-1 items-center">
                      <CustomIcon
                        name="checkmark-circle-outline"
                        iconSet="Ionicons"
                        size={18}
                        color="green"
                      />

                      <CustomText className="text-primary">
                        Completed
                      </CustomText>
                    </View>
                  ) : (
                    <View className="bg-red-50 border-red-500 border py-1 px-2 rounded-full flex flex-row gap-1 items-center">
                      <CustomIcon
                        name="alert-circle-outline"
                        iconSet="Ionicons"
                        size={18}
                        color="red"
                      />

                      <CustomText>Error</CustomText>
                    </View>
                  )}
                </View>

                <View className="ms-auto">
                  {isExpanded ? (
                    <CustomIcon
                      name="chevron-up"
                      iconSet="Ionicons"
                      size={18}
                      color="green"
                    />
                  ) : (
                    <CustomIcon
                      name="chevron-down"
                      iconSet="Ionicons"
                      size={18}
                      color="gray"
                    />
                  )}
                </View>
              </TouchableOpacity>

              {isExpanded && (
                <>
                  <CustomText>PARAMETERS</CustomText>
                  <View className="w-full  ">
                    <Markdown>
                      {`\`\`\`json\n${JSON.stringify(part.input, null, 2)}\n\`\`\``}
                    </Markdown>
                  </View>

                  <CustomText>RESULT</CustomText>
                  <View className="w-full">
                    <Markdown>{`\`\`\`json
${JSON.stringify(part.output, null, 2)}
\`\`\``}</Markdown>
                  </View>
                </>
              )}
            </View>
          );
        }
        return null;
      })}
    </ScrollView>
  );
};
