import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Pressable,
} from "react-native";

export type PhotoPickerAction = "gallery" | "camera" | "cancel";

interface PhotoPickerBottomSheetProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (action: PhotoPickerAction) => void;
}

/**
 * 파일 input 클릭 시 앱에서 보여줄 바텀시트.
 * "갤러리에서 선택" / "카메라" / "취소" 옵션 제공.
 */
export default function PhotoPickerBottomSheet({
  visible,
  onClose,
  onSelect,
}: PhotoPickerBottomSheetProps) {
  if (!visible) return null;

  const handleSelect = (action: PhotoPickerAction) => {
    onSelect(action);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable style={styles.sheet} onPress={(e) => e.stopPropagation()}>
          <View style={styles.handle} />
          <TouchableOpacity
            style={styles.option}
            onPress={() => handleSelect("gallery")}
            activeOpacity={0.7}
          >
            <Text style={styles.optionText}>갤러리에서 선택</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.option}
            onPress={() => handleSelect("camera")}
            activeOpacity={0.7}
          >
            <Text style={styles.optionText}>카메라</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.option, styles.cancelOption]}
            onPress={() => handleSelect("cancel")}
            activeOpacity={0.7}
          >
            <Text style={styles.cancelText}>취소</Text>
          </TouchableOpacity>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  sheet: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingTop: 8,
    paddingBottom: 34,
    paddingHorizontal: 24,
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#ddd",
    alignSelf: "center",
    marginBottom: 16,
  },
  option: {
    paddingVertical: 16,
    alignItems: "center",
  },
  optionText: {
    fontSize: 17,
    color: "#007AFF",
  },
  cancelOption: {
    marginTop: 8,
  },
  cancelText: {
    fontSize: 17,
    color: "#8E8E93",
    fontWeight: "600",
  },
});
