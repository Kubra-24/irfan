import React from "react";
import { View, StyleSheet } from "react-native";
import { Calendar as RNCalendar } from "react-native-calendars";
import Icon from "react-native-vector-icons/MaterialIcons"; // veya tercih ettiğin ikon paketi

import { cn } from '../../lib/utils'; // 'calendar.tsx' dosyasının konumuna göre ayarla


// buttonVariants yerine React Native StyleSheet kullanılır
// Eğer buttonVariants özel bir şey yapıyorsa, buraya uygun stil ekleyebilirsin

type CalendarProps = React.ComponentProps<typeof RNCalendar>;

function Calendar({ style, ...props }: CalendarProps) {
  return (
    <View style={[styles.container, style]}>
      <RNCalendar
        {...props}
        theme={{
          calendarBackground: "#fff",
          textSectionTitleColor: "#000",
          selectedDayBackgroundColor: "#3b82f6",
          selectedDayTextColor: "#fff",
          todayTextColor: "#3b82f6",
          dayTextColor: "#000",
          textDisabledColor: "#d9e1e8",
          dotColor: "#3b82f6",
          selectedDotColor: "#ffffff",
          arrowColor: "#3b82f6",
          monthTextColor: "#000",
          indicatorColor: "#3b82f6",
          // Diğer stil ayarları buraya eklenebilir
        }}
        renderArrow={(direction) =>
          direction === "left" ? (
            <Icon name="chevron-left" size={24} color="#3b82f6" />
          ) : (
            <Icon name="chevron-right" size={24} color="#3b82f6" />
          )
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 12,
    // React Native'de padding veya margin gibi stil ayarları buraya gelir
  },
});

Calendar.displayName = "Calendar";

export { Calendar };
