import React, { FC } from "react"
import {
  View,
  ViewStyle,
  Image,
  ScrollView,
  TextStyle,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
} from "react-native"
import { Text } from "@/components"
import { useStores } from "@/models"
import { LinearGradient } from "expo-linear-gradient"
import { Ionicons } from "@expo/vector-icons"

export const DemoDebugScreen: FC = function DemoDebugScreen() {
  const {
    authenticationStore: { logout, user },
  } = useStores()

  return (
    <LinearGradient colors={["#091057", "#1E40AF", "#091057"]} style={$container}>
      <SafeAreaView style={$safeArea}>
        <StatusBar barStyle="light-content" />
        <ScrollView contentContainerStyle={$scrollViewContent}>
          <View style={$profileSection}>
            <Image source={require('../../assets/vijay/vijay.png')}  style={$profileImage} />
            <Text style={$name}>{user?.name || "Vijay W"}</Text>
            <Text style={$username}>{user?.username || "9745771368"}</Text>
          </View>
          <View style={$card}>
            <InfoItem label="Email" value={user?.email || "vijaywilsonofficial@gmail.com"} />
            <InfoItem label="Location" value={user?.location || "Trivandrum"} />
            <InfoItem label="Education" value="M.Tech" />
            <InfoItem label="Experience" value="2+ years in Software Development" />
            <View style={$bioSection}>
              <Text style={$bioHeader}>Bio</Text>
              <Text style={$bioText}>
                {user?.bio ||
                  "Passionate developer with a focus on mobile and web technologies. Always learning and exploring new frameworks and methodologies to create efficient, scalable solutions."}
              </Text>
            </View>
            <TouchableOpacity style={$logoutButton} onPress={logout}>
              <Text style={$logoutText}>Log Out</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
      {/* <View style={$bottomTabs}>
        <TabItem icon="home-outline" label="Home" />
        <TabItem icon="person-outline" label="Profile" />
        <TabItem icon="settings-outline" label="Settings" />
      </View> */}
    </LinearGradient>
  )
}

const InfoItem: FC<{ label: string; value: string }> = ({ label, value }) => (
  <View style={$infoItem}>
    <Text style={$infoLabel}>{label}</Text>
    <Text style={$infoValue}>{value}</Text>
  </View>
)

const TabItem: FC<{ icon: string; label: string }> = ({ icon, label }) => (
  <View style={$tabItem}>
    <Ionicons name={icon} size={24} color="#fff" />
    <Text style={$tabText}>{label}</Text>
  </View>
)

const $container: ViewStyle = {
  flex: 1,
}

const $safeArea: ViewStyle = {
  flex: 1,
}

const $scrollViewContent: ViewStyle = {
  flexGrow: 1,
  paddingHorizontal: 20,
  paddingTop: 30,
}

const $profileSection: ViewStyle = {
  alignItems: "center",
  marginBottom: 30,
}

const $profileImage: ViewStyle = {
  width: 120,
  height: 120,
  borderRadius: 60,
  marginBottom: 15,
  borderWidth: 4,
  borderColor: "#fff",
}

const $name: TextStyle = {
  fontSize: 28,
  fontWeight: "bold",
  color: "#fff",
  marginBottom: 5,
}

const $username: TextStyle = {
  fontSize: 18,
  color: "#e0e0e0",
}

const $card: ViewStyle = {
  backgroundColor: "rgba(255, 255, 255, 0.15)",
  borderRadius: 20,
  padding: 20,
  marginBottom: 84,
}

const $infoItem: ViewStyle = {
  flexDirection: "row",
  justifyContent: "space-between",
  paddingVertical: 12,
  borderBottomWidth: 1,
  borderBottomColor: "rgba(255, 255, 255, 0.1)",
}

const $infoLabel: TextStyle = {
  fontSize: 16,
  color: "#fff",
  fontWeight: "600",
}

const $infoValue: TextStyle = {
  fontSize: 16,
  color: "#e0e0e0",
  textAlign: "right",
  flex: 1,
  marginLeft: 10,
}

const $bioSection: ViewStyle = {
  marginTop: 20,
  marginBottom: 20,
}

const $bioHeader: TextStyle = {
  fontSize: 20,
  fontWeight: "bold",
  color: "#fff",
  marginBottom: 10,
}

const $bioText: TextStyle = {
  fontSize: 16,
  lineHeight: 24,
  color: "#e0e0e0",
}

const $logoutButton: ViewStyle = {
  backgroundColor: "rgba(255, 255, 255, 0.2)",
  paddingVertical: 14,
  paddingHorizontal: 20,
  borderRadius: 10,
  alignItems: "center",
  marginTop: 20,
}

const $logoutText: TextStyle = {
  color: "#fff",
  fontSize: 18,
  fontWeight: "bold",
}

const $bottomTabs: ViewStyle = {
  flexDirection: "row",
  justifyContent: "space-around",
  alignItems: "center",
  paddingVertical: 10,
  borderTopWidth: 1,
  borderTopColor: "rgba(255, 255, 255, 0.2)",
  backgroundColor: "rgba(0, 0, 0, 0.2)",
}

const $tabItem: ViewStyle = {
  alignItems: "center",
}

const $tabText: TextStyle = {
  fontSize: 12,
  color: "#fff",
  marginTop: 4,
}
