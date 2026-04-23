import * as Location from "expo-location";

export const handleGetLocation = async () => {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();

    if (status !== "granted") {
      return {
        error: "Location permission not granted",
      };
    }

    const location = await Location.getCurrentPositionAsync({});
    return {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    };
  } catch (error: any) {
    return {
      error: error.message || "Failed to get location",
    };
  }
};
