import { StyleSheet, StyleProp, ViewStyle, TextStyle, ImageStyle } from 'react-native';

type NamedStyle = ViewStyle | TextStyle | ImageStyle;
type Style = StyleProp<NamedStyle>;

export function cn(...inputs: Style[]): Style {
  // StyleSheet.flatten ile gelen stil dizilerini ve objelerini tek bir stil objesine çeviriyoruz
  return StyleSheet.flatten(inputs);
}
export function someUtil() {
  
  console.log("someUtil çalıştı");
}
