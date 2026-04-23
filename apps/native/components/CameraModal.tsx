import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  ActivityIndicator,
} from "react-native";
import { CameraView, CameraType, useCameraPermissions } from "expo-camera";

interface CameraModalProps {
  visible: boolean;
  onClose: () => void;
  onPhotoTaken: (uri: string, base64?: string) => void;
  /** true이면 촬영 결과를 base64로도 전달 (웹뷰 파일 선택 연동용) */
  returnBase64?: boolean;
}

export default function CameraModal({
  visible,
  onClose,
  onPhotoTaken,
  returnBase64 = false,
}: CameraModalProps) {
  const [facing, setFacing] = useState<CameraType>("back");
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);
  const [isTaking, setIsTaking] = useState(false);

  if (!visible) return null;

  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (!permission.granted) {
    return (
      <Modal visible={visible} animationType="slide">
        <View style={styles.container}>
          <Text style={styles.message}>
            We need your permission to show the camera
          </Text>
          <TouchableOpacity style={styles.button} onPress={requestPermission}>
            <Text style={styles.text}>Grant Permission</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, { marginTop: 20 }]}
            onPress={onClose}
          >
            <Text style={styles.text}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    );
  }

  const takePicture = async () => {
    if (cameraRef.current && !isTaking) {
      setIsTaking(true);
      try {
        const photo = await cameraRef.current.takePictureAsync(
          returnBase64 ? { base64: true } : undefined
        );
        if (photo?.uri) {
          onPhotoTaken(photo.uri, photo.base64 ?? undefined);
        }
      } catch (e) {
        console.error("Failed to take picture", e);
      } finally {
        setIsTaking(false);
      }
    }
  };

  const toggleCameraFacing = () => {
    setFacing((current) => (current === "back" ? "front" : "back"));
  };

  return (
    <Modal visible={visible} animationType="slide">
      <View style={styles.container}>
        <CameraView style={styles.camera} facing={facing} ref={cameraRef}>
          <View style={styles.controls}>
            <TouchableOpacity style={styles.controlBtn} onPress={onClose}>
              <Text style={styles.text}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.captureBtn}
              onPress={takePicture}
              disabled={isTaking}
            >
              {isTaking ? (
                <ActivityIndicator color="white" />
              ) : (
                <View style={styles.captureInner} />
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.controlBtn}
              onPress={toggleCameraFacing}
            >
              <Text style={styles.text}>Flip</Text>
            </TouchableOpacity>
          </View>
        </CameraView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },
  message: {
    textAlign: "center",
    paddingBottom: 10,
    color: "white",
  },
  camera: {
    flex: 1,
    justifyContent: "flex-end",
  },
  controls: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 40,
    paddingHorizontal: 20,
    backgroundColor: "rgba(0,0,0,0.3)",
    paddingTop: 20,
  },
  text: {
    fontSize: 18,
    fontWeight: "bold",
    color: "white",
  },
  button: {
    padding: 15,
    backgroundColor: "#007AFF",
    borderRadius: 8,
  },
  controlBtn: {
    padding: 10,
  },
  captureBtn: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 4,
    borderColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },
  captureInner: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: "white",
  },
});
