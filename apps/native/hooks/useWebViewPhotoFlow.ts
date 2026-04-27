import { useCallback, useState, type RefObject } from "react";
import { Alert, Linking } from "react-native";
import { Camera } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import type { WebView } from "react-native-webview";
import type { BridgeMessage } from "@/types/bridge";
import type { PhotoPickerAction } from "@/components/PhotoPickerBottomSheet";
import { injectWebViewWindowPostMessage } from "@/lib/injectWebViewWindowPostMessage";

/**
 * 메인 WebView 의 카메라·포토피커 브리지(OPEN_CAMERA / OPEN_PHOTO_PICKER) 및
 * 결과를 웹으로 주입하는 상태·핸들러.
 */
export function useWebViewPhotoFlow(webViewRef: RefObject<WebView | null>) {
  const [isCameraVisible, setIsCameraVisible] = useState(false);
  const [currentReqId, setCurrentReqId] = useState<string | null>(null);
  const [isPhotoPickerVisible, setIsPhotoPickerVisible] = useState(false);
  const [fileInputReqId, setFileInputReqId] = useState<string | null>(null);
  const [cameraOpenedFromFileInput, setCameraOpenedFromFileInput] =
    useState(false);

  const sendPhotoPickerResultToWeb = useCallback(
    (reqId: string, base64: string, mimeType: string) => {
      injectWebViewWindowPostMessage(webViewRef.current, {
        type: "PHOTO_PICKER_RESULT",
        reqId,
        payload: { base64, mimeType },
      });
    },
    [webViewRef],
  );

  const sendPhotoPickerErrorToWeb = useCallback(
    (reqId: string, errorMessage: string) => {
      injectWebViewWindowPostMessage(webViewRef.current, {
        type: "ERROR",
        reqId,
        payload: null,
        error: errorMessage,
      });
    },
    [webViewRef],
  );

  /** 브리지에서 OPEN_CAMERA / OPEN_PHOTO_PICKER 를 처리했으면 true */
  const tryConsumePhotoBridgeMessage = useCallback(
    (data: BridgeMessage): boolean => {
      if (data.type === "OPEN_CAMERA") {
        setCameraOpenedFromFileInput(false);
        setCurrentReqId(data.reqId || null);
        setIsCameraVisible(true);
        return true;
      }
      if (data.type === "OPEN_PHOTO_PICKER") {
        setFileInputReqId(data.reqId ?? null);
        setIsPhotoPickerVisible(true);
        return true;
      }
      return false;
    },
    [],
  );

  const handlePhotoTaken = useCallback(
    (uri: string, base64?: string) => {
      setIsCameraVisible(false);
      const wv = webViewRef.current;
      if (wv && currentReqId) {
        if (cameraOpenedFromFileInput && base64) {
          sendPhotoPickerResultToWeb(currentReqId, base64, "image/jpeg");
          setCameraOpenedFromFileInput(false);
          setFileInputReqId(null);
        } else {
          injectWebViewWindowPostMessage(wv, {
            type: "CAMERA_RESULT",
            payload: { uri },
            reqId: currentReqId,
          });
        }
        setCurrentReqId(null);
      }
    },
    [
      webViewRef,
      currentReqId,
      cameraOpenedFromFileInput,
      sendPhotoPickerResultToWeb,
    ],
  );

  const handlePhotoPickerSelect = useCallback(
    async (action: PhotoPickerAction) => {
      if (action === "cancel" || !fileInputReqId) return;

      if (action === "camera") {
        const reqId = fileInputReqId;
        setIsPhotoPickerVisible(false);

        const { status, canAskAgain } =
          await Camera.requestCameraPermissionsAsync();

        if (status !== "granted") {
          setFileInputReqId(null);
          if (canAskAgain === false) {
            sendPhotoPickerErrorToWeb(
              reqId,
              "카메라 접근 권한이 거부되었습니다. 설정에서 카메라 접근을 허용해 주세요.",
            );
            Alert.alert(
              "카메라 권한 필요",
              "사진을 촬영하려면 설정에서 카메라 접근을 허용해 주세요.",
              [
                { text: "취소", style: "cancel" },
                { text: "설정 열기", onPress: () => void Linking.openSettings() },
              ],
            );
          } else {
            sendPhotoPickerErrorToWeb(
              reqId,
              "카메라 접근 권한이 필요합니다. 권한을 허용해 주세요.",
            );
          }
          return;
        }

        setCurrentReqId(reqId);
        setCameraOpenedFromFileInput(true);
        setIsCameraVisible(true);
        return;
      }

      if (action === "gallery") {
        const reqId: string = fileInputReqId;

        try {
          const { status, canAskAgain } =
            await ImagePicker.requestMediaLibraryPermissionsAsync();

          setIsPhotoPickerVisible(false);

          if (status !== "granted") {
            setFileInputReqId(null);
            if (canAskAgain === false) {
              sendPhotoPickerErrorToWeb(
                reqId,
                "갤러리 접근 권한이 거부되었습니다. 설정에서 사진 접근을 허용해 주세요.",
              );
              Alert.alert(
                "사진 접근 권한 필요",
                "사진을 선택하려면 설정에서 사진 접근을 허용해 주세요.",
                [
                  { text: "취소", style: "cancel" },
                  {
                    text: "설정 열기",
                    onPress: () => void Linking.openSettings(),
                  },
                ],
              );
            } else {
              sendPhotoPickerErrorToWeb(
                reqId,
                "갤러리 접근 권한이 필요합니다. 권한을 허용해 주세요.",
              );
            }
            return;
          }

          const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ["images"],
            allowsEditing: false,
            base64: true,
            quality: 0.9,
          });
          if (
            !result.canceled &&
            result.assets[0]?.base64 &&
            webViewRef.current
          ) {
            const asset = result.assets[0];
            const mimeType = asset.mimeType ?? "image/jpeg";
            sendPhotoPickerResultToWeb(reqId, asset.base64 as string, mimeType);
          } else {
            sendPhotoPickerErrorToWeb(reqId, "사진 선택이 취소되었습니다.");
          }
        } catch (err) {
          const message =
            err instanceof Error ? err.message : "갤러리를 열 수 없습니다.";
          sendPhotoPickerErrorToWeb(reqId, message);
        } finally {
          setFileInputReqId(null);
        }
      }
    },
    [fileInputReqId, webViewRef, sendPhotoPickerErrorToWeb, sendPhotoPickerResultToWeb],
  );

  const closePhotoPickerSheet = useCallback(() => {
    setIsPhotoPickerVisible(false);
    setFileInputReqId(null);
  }, []);

  return {
    isCameraVisible,
    setIsCameraVisible,
    isPhotoPickerVisible,
    cameraOpenedFromFileInput,
    tryConsumePhotoBridgeMessage,
    handlePhotoTaken,
    handlePhotoPickerSelect,
    closePhotoPickerSheet,
  };
}
