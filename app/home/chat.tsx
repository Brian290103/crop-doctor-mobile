import {
  BottomSheetModal,
  BottomSheetModalProvider,
} from "@gorhom/bottom-sheet";
import { DefaultChatTransport } from "ai";
import { BottomSheetContent } from "@/components/chat/BottomSheetContent";
import { ChatHeader } from "@/components/chat/ChatHeader";
import { Container } from "@/components/Container";
import { CustomButton } from "@/components/CustomButton";
import { CustomIcon } from "@/components/CustomIcon";
import { MessageActions } from "@/components/chat/MessageActions";
import colors from "@/colors";
import { supabase } from "@/lib/supabase";
import { useChat } from "@ai-sdk/react";
import { fetch as expoFetch } from "expo/fetch";
import * as ImagePicker from "expo-image-picker";
import { Image } from "expo-image";
import { useLocalSearchParams, useRouter } from "expo-router";
import Markdown from "react-native-markdown-display";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Platform,
  Text,
  TextInput,
  View,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import React, { useCallback, useRef, useState } from "react";
import { CustomText } from "@/components/CustomText";

type UploadedFilePart = {
  type: "file";
  url: string;
  name: string;
  mediaType: string;
};
export default function Chat() {
  const [selectedMessage, setSelectedMessage] = useState<
    import("@ai-sdk/react").Message | null
  >(null);
  // ref
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  // callbacks
  const handleShowDetails = useCallback(
    (message: import("@ai-sdk/react").Message) => {
      setSelectedMessage(message);
      bottomSheetModalRef.current?.present();
    },
    [],
  );

  const handleSheetChanges = useCallback((index: number) => {
    console.log("handleSheetChanges", index);
  }, []);

  const [input, setInput] = useState("");

  const { imageUrl } = useLocalSearchParams<{ imageUrl?: string }>();
  console.log(imageUrl);

  const [file, setFile] = useState<UploadedFilePart | null>(
    imageUrl
      ? {
          type: "file",
          url: imageUrl,
          name: "captured.jpg",
          mediaType: "image/jpeg",
        }
      : null,
  );

  const [uploading, setUploading] = useState(false);
  const [sending, setSending] = useState(false);

  const flatListRef = useRef<FlatList>(null);

  async function pickFile() {
    console.log("pickFile: Initiating image picker...");
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });

    if (result.canceled) {
      console.log("pickFile: Image picking canceled.");
      return;
    }

    const pickedAsset = result.assets[0];
    console.log("pickFile: Image picked:", pickedAsset.uri);
    setUploading(true);
    setFile(null); // Clear previous file while uploading new one

    try {
      console.log("pickFile: Starting upload process...");
      const arrayBuffer = await fetch(pickedAsset.uri).then((res) =>
        res.arrayBuffer(),
      );

      const fileExt = pickedAsset.uri.split(".").pop() || "jpg";
      const fileName = `${Date.now()}.${fileExt}`;

      const { data, error } = await supabase.storage
        .from("crop-doctor")
        .upload(fileName, arrayBuffer, {
          contentType: pickedAsset.mimeType ?? "image/jpeg",
        });

      if (error) {
        console.error("pickFile: Supabase upload error:", error);
        throw error;
      }

      const { data: publicUrl } = supabase.storage
        .from("crop-doctor")
        .getPublicUrl(fileName);

      const uploadedFilePart = {
        type: "file" as const,
        url: publicUrl.publicUrl,
        name: fileName,
        mediaType: pickedAsset.mimeType ?? "image/jpeg",
      };
      setFile(uploadedFilePart);
      console.log(
        "pickFile: Image uploaded successfully. Public URL:",
        publicUrl.publicUrl,
      );
      Alert.alert("Image Uploaded!", "Image is ready to be sent.");
    } catch (err: any) {
      console.error("pickFile: Error during upload:", err);
      Alert.alert("Upload failed", err.message);
    } finally {
      setUploading(false);
      console.log("pickFile: Upload process finished.");
    }
  }

  async function takePicture() {
    console.log("takePicture: Initiating camera...");
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
      allowsEditing: true, // Enable editing (cropping)
      aspect: [4, 3], // Optional aspect ratio
    });

    if (result.canceled) {
      console.log("takePicture: Camera canceled.");
      return;
    }

    const pickedAsset = result.assets[0];
    console.log("takePicture: Image taken:", pickedAsset.uri);
    setUploading(true);
    setFile(null); // Clear previous file while uploading new one

    try {
      console.log("takePicture: Starting upload process...");
      const arrayBuffer = await fetch(pickedAsset.uri).then((res) =>
        res.arrayBuffer(),
      );

      const fileExt = pickedAsset.uri.split(".").pop() || "jpg";
      const fileName = `${Date.now()}.${fileExt}`;

      const { data, error } = await supabase.storage
        .from("crop-doctor")
        .upload(fileName, arrayBuffer, {
          contentType: pickedAsset.mimeType ?? "image/jpeg",
        });

      if (error) {
        console.error("takePicture: Supabase upload error:", error);
        throw error;
      }

      const { data: publicUrl } = supabase.storage
        .from("crop-doctor")
        .getPublicUrl(fileName);

      const uploadedFilePart = {
        type: "file" as const,
        url: publicUrl.publicUrl,
        name: fileName,
        mediaType: pickedAsset.mimeType ?? "image/jpeg",
      };
      setFile(uploadedFilePart);
      console.log(
        "takePicture: Image uploaded successfully. Public URL:",
        publicUrl.publicUrl,
      );
      Alert.alert("Image Uploaded!", "Image is ready to be sent.");
    } catch (err: any) {
      console.error("takePicture: Error during upload:", err);
      Alert.alert("Upload failed", err.message);
    } finally {
      setUploading(false);
      console.log("takePicture: Upload process finished.");
    }
  }

  const { messages, error, sendMessage, stop, status } = useChat({
    transport: new DefaultChatTransport({
      fetch: expoFetch as unknown as typeof globalThis.fetch,
      api: process.env.EXPO_PUBLIC_API_URL
        ? `${process.env.EXPO_PUBLIC_API_URL}/api/chat/rag`
        : "http://192.168.100.5:3000/api/chat/rag",
    }),
    onError: (error) => console.error(error, "ERROR"),
  });

  // console.log(JSON.stringify(messages, null, 2));

  if (error) return <Text>{error.message}</Text>;

  async function handleSend() {
    console.log("handleSend: Send button pressed.");
    if (!input && !file) {
      console.log("handleSend: No input or file to send. Aborting.");
      Alert.alert("Please enter text or attach a file.");
      return;
    }

    setSending(true);

    const parts = [];
    if (input) {
      parts.push({ type: "text", text: input });
      console.log("handleSend: Adding text input to parts.");
    }
    if (file) {
      parts.push(file);
      console.log("handleSend: Adding uploaded file to parts.");
    }

    console.log("handleSend: Sending message with parts:", parts);
    sendMessage({
      role: "user",
      parts: parts,
    });
    setInput("");
    setFile(null);
    console.log("handleSend: Message sent, input and file cleared.");
    setSending(false);
  }

  return (
    <Container className="flex-1 bg-white">
      <BottomSheetModalProvider>
        <BottomSheetModal
          ref={bottomSheetModalRef}
          onChange={handleSheetChanges}
          snapPoints={["50%", "80%"]}
        >
          <BottomSheetContent message={selectedMessage} />
        </BottomSheetModal>

        <ChatHeader />

        <KeyboardAwareScrollView
          className="flex-1"
          bottomOffset={Platform.OS === "ios" ? 100 : 100}
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Chat list */}
          <FlatList
            ref={flatListRef}
            data={messages}
            keyExtractor={(item) => item.id}
            className="flex-1"
            contentContainerStyle={{ padding: 16 }}
            renderItem={({ item: m }) => (
              <View key={m.id} style={{ marginVertical: 8 }} className="w-full">
                <View
                  className={
                    m.role === "user"
                      ? "bg-primary max-w-[75%] p-4 rounded-lg ms-auto"
                      : "bg-white py-1 px-2 rounded-lg w-full"
                  }
                >
                  {m.parts.map((part: any, i: any) => {
                    if (part.type === "text" && m.role === "user") {
                      return (
                        <Text key={`${m.id}-${i}`} style={{ color: "white" }}>
                          {part.text}
                        </Text>
                      );
                    }
                    if (part.type === "text" && m.role === "assistant") {
                      return (
                        <Markdown key={`${m.id}-${i}`}>{part.text}</Markdown>
                      );
                    }
                    if (part.type === "file" && m.role === "user") {
                      return (
                        <Image
                          key={`${m.id}-img-${i}`}
                          source={{ uri: part.url }}
                          resizeMode="cover"
                          style={{
                            borderRadius: 10,
                            objectFit: "contain",
                            marginTop: 4,
                            width: "100%",
                            height: "auto",
                            aspectRatio: 1,
                          }}
                        />
                      );
                    }
                    return null;
                  })}
                </View>

                <MessageActions message={m} onShowDetails={handleShowDetails} />
              </View>
            )}
            onContentSizeChange={() =>
              flatListRef.current?.scrollToEnd({ animated: true })
            }
          />

          {(status === "streaming" || sending) && (
            <View className="w-full flex flex-row items-center justify-start gap-2 p-2">
              <ActivityIndicator size={24} color={colors.dark} />
              <CustomText>Crop Doctor is thinking...</CustomText>
            </View>
          )}

          {/* Input area stays anchored at bottom */}
          <View className="p-4 border-t border-gray-300 bg-white ">
            <View className="p-4 border border-gray-300 rounded-xl">
              <TextInput
                className="w-full p-2 text-black"
                placeholder="Ask me anything..."
                value={input}
                onChangeText={setInput}
                onSubmitEditing={handleSend}
              />
              <View className="flex items-center flex-row justify-between pt-4">
                <View className="flex items-center flex-row">
                  {file ? (
                    <View className="flex flex-row items-center">
                      <View className="rounded-lg overflow-hidden">
                        <Image
                          source={{ uri: file.url }}
                          style={{ width: 50, height: 50 }}
                        />
                      </View>

                      <CustomButton
                        size="icon"
                        variant="ghost"
                        onPress={() => {
                          setFile(null);
                        }}
                      >
                        <CustomIcon
                          color="red"
                          size={18}
                          name={"close-outline"}
                          iconSet="Ionicons"
                        />
                      </CustomButton>
                    </View>
                  ) : (
                    <>
                      <CustomButton
                        size="icon"
                        variant="outline"
                        onPress={takePicture}
                      >
                        <CustomIcon
                          color="gray"
                          name={"camera-outline"}
                          iconSet="Ionicons"
                        />
                      </CustomButton>
                      <View className="w-2" />
                      <CustomButton
                        disabled={uploading || !!file}
                        onPress={pickFile}
                        label="Gallery"
                        variant="outline"
                      >
                        <CustomIcon
                          color="gray"
                          size={18}
                          name={"file-tray-outline"}
                          iconSet="Ionicons"
                        />
                      </CustomButton>
                    </>
                  )}
                </View>
                {status === "streaming" ? (
                  <CustomButton
                    variant="destructive"
                    disabled={uploading || sending}
                    size="icon"
                    onPress={() => {
                      stop();
                    }}
                  >
                    <CustomIcon
                      color="white"
                      name={"stop-outline"}
                      iconSet="Ionicons"
                      size={18}
                    />
                  </CustomButton>
                ) : (
                  <CustomButton
                    disabled={uploading || sending}
                    size="icon"
                    onPress={handleSend}
                  >
                    <CustomIcon
                      color="white"
                      name={"send"}
                      iconSet="Ionicons"
                      size={18}
                    />
                  </CustomButton>
                )}
              </View>
            </View>
          </View>
        </KeyboardAwareScrollView>
      </BottomSheetModalProvider>
    </Container>
  );
}
