import { Container } from "@/components/Container";
import { CustomButton } from "@/components/CustomButton";
import { CustomIcon } from "@/components/CustomIcon";
import { CustomText } from "@/components/CustomText";
import { handleUpload } from "@/lib/utils";
import { useNavigation, router } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { Image } from "expo-image";
import { useEffect } from "react";
import { View, TouchableOpacity } from "react-native";

export default function Index() {
  const navigation = useNavigation();
  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  async function captureFromCamera() {
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
      allowsEditing: true, // Enable cropping
      aspect: [1, 1], // Optional aspect ratio
    });

    if (result.canceled) return;

    await handleUpload(
      result.assets[0].uri,
      result.assets[0].mimeType ?? "image/jpeg",
    );
  }

  async function pickFromGallery() {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
      allowsEditing: true, // Enable cropping
      aspect: [1, 1], // Optional aspect ratio
    });

    if (result.canceled) return;

    await handleUpload(
      result.assets[0].uri,
      result.assets[0].mimeType ?? "image/jpeg",
    );
  }

  const actions = [
    {
      title: "Take a photo",
      description: "Use your camera to identify diseases.",
      imageUrl:
        "https://res.cloudinary.com/duttrcvye/image/upload/v1758884307/c51042f3-32a0-42a8-9d56-596d84b5322c.png",
      onPress: captureFromCamera,
      visible: true,
    },
    {
      title: "Choose from gallery",
      description: "Select a photo from your gallery.",
      imageUrl:
        "https://res.cloudinary.com/duttrcvye/image/upload/v1758884440/911dcde1-2b88-4063-92e4-132e6cd31750.png",
      onPress: pickFromGallery,
      visible: true,
    },
    {
      title: "Ask a question",
      description: "Chat with the AI about your plants.",
      imageUrl:
        "https://img.icons8.com/?size=100&id=111409&format=png&color=000000", // Placeholder, consider a chat icon
      onPress: () => router.push("/home/chat"),
      visible: true,
    },
    {
      title: "View history",
      description: "Browse your previous detections.",
      imageUrl:
        "https://res.cloudinary.com/duttrcvye/image/upload/v1758884468/8c953333-08cc-453e-b899-c042e4fdb406.png",
      onPress: () => router.push("/home/history"), // placeholder URL
      visible: false,
    },
  ];

  return (
    <Container className="bg-primary">
      <View className="flex-row justify-between items-center px-4 py-2 ">
        <View className="w-8" />
        <CustomText variant="h3" className="text-white">
          CropDoctor
        </CustomText>
        <View className="w-8" />
        {/*<CustomButton
          onPress={() => router.push("/home/settings")}
          variant="ghost"
          size="icon"
          className="hidden"
        >
          <CustomIcon
            name="settings-outline"
            iconSet="Ionicons"
            size={24}
            color="white"
          />
        </CustomButton>*/}
      </View>
      <View className="px-8 pt-4">
        <View className=" bg-white items-center justify-center rounded-xl p-10 shadow ">
          <Image
            source={{
              uri: "https://img.icons8.com/?size=100&id=hRYeybAc6tk_&format=png&color=000000",
            }}
            style={{ width: 80, height: 80 }}
          />
          <CustomText variant="h3" className="text-primary mt-3">
            Smart Crop Health Check 🌱
          </CustomText>
          <CustomText variant="h5" className=" mt-3 text-dark text-center">
            Take or upload a photo of your crop and let our AI doctor analyze
            it. Get instant insights on possible diseases and simple steps to
            protect and treat your plants.
          </CustomText>
        </View>
      </View>
      <View className="px-8 pt-4 space-y-4">
        {actions.map((action) =>
          action.visible ? (
            <TouchableOpacity key={action.title} onPress={action.onPress}>
              <View className="bg-white p-4 mt-4 rounded-xl flex-row items-center shadow-sm">
                <Image
                  source={{ uri: action.imageUrl }}
                  style={{ width: 60, height: 60 }}
                />
                <View className="ml-4 flex-1">
                  <CustomText variant="h4" className="text-primary">
                    {action.title}
                  </CustomText>
                  <CustomText className="text-dark mt-1">
                    {action.description}
                  </CustomText>
                </View>
                <CustomIcon
                  name="chevron-forward"
                  iconSet="Ionicons"
                  size={24}
                  color="gray"
                />
              </View>
            </TouchableOpacity>
          ) : null,
        )}
      </View>
    </Container>
  );
}
