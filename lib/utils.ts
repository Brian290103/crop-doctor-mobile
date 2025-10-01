import { supabase } from "./supabase";
import { Alert } from "react-native";
import { router } from "expo-router";

export async function handleUpload(uri: string, mimeType: string) {
  Alert.alert("Uploading", "Please wait...", [{ text: "OK" }], {
    cancelable: false,
  });
  try {
    const arrayBuffer = await fetch(uri).then((res) => res.arrayBuffer());
    const fileName = `${Date.now()}.jpg`;

    const { error } = await supabase.storage
      .from("crop-doctor")
      .upload(fileName, arrayBuffer, { contentType: mimeType });

    if (error) throw error;

    const { data: publicUrl } = supabase.storage
      .from("crop-doctor")
      .getPublicUrl(fileName);

    Alert.alert("✅ Success", "Image uploaded successfully!", [
      {
        text: "OK",
        onPress: () => {
          router.push({
            pathname: "/home/chat", // match your Chat route file
            params: { imageUrl: publicUrl.publicUrl },
          });
        },
      },
    ]);
  } catch (err: any) {
    Alert.alert("Upload failed", err.message);
  }
}
