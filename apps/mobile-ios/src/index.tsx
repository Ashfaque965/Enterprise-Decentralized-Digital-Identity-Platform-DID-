import { SafeAreaView, StyleSheet, Text, View } from "react-native";

export default function IosAppRoot() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>NexusCore iOS Node</Text>
        <Text style={styles.subtitle}>
          Hardware validation mapped directly through the device Secure Enclave
          microchip
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#ffffff" },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1c1c1e",
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 13,
    color: "#8e8e93",
    textAlign: "center",
    marginTop: 8,
  },
});
