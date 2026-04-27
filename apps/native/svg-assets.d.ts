/**
 * Metro가 SVG를 이미지 에셋으로 번들할 때 require() 결과 타입
 * (expo-image / React Native Image source)
 */
declare module "*.svg" {
  const value: number;
  export default value;
}
