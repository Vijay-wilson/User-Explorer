import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { BottomTabScreenProps, createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { CompositeScreenProps } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from '@expo/vector-icons';
import Feather from '@expo/vector-icons/Feather';
// Import your screen components
import { DemoCommunityScreen, DemoDebugScreen } from "../screens";

// Define your navigation param list
export type DemoTabParamList = {
  DemoCommunity: undefined;
  DemoDebug: undefined;
};

// Define your screen props type
export type DemoTabScreenProps<T extends keyof DemoTabParamList> = CompositeScreenProps<
  BottomTabScreenProps<DemoTabParamList, T>,
  // Adjust this type based on your app's main navigator
  any
>;

const Tab = createBottomTabNavigator<DemoTabParamList>();

const ACTIVE_COLOR = '#4C3BCF';
const INACTIVE_COLOR = '#A599E9'; 

export function DemoNavigator() {
  const { bottom } = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarHideOnKeyboard: true,
        tabBarStyle: [styles.tabBar, { height: 60 + bottom }],
        tabBarActiveTintColor: ACTIVE_COLOR,
        tabBarInactiveTintColor: INACTIVE_COLOR,
      }}
    >
      <Tab.Screen
        name="DemoCommunity"
        component={DemoCommunityScreen}
        options={{
          tabBarLabel: ({ focused, color }) => (
            <Text style={[styles.tabBarLabel, { color }]}>
              Home
            </Text>
          ),
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons name={focused ? "home" : "home-outline"} size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="DemoDebug"
        component={DemoDebugScreen}
        options={{
          tabBarLabel: ({ focused, color }) => (
            <Text style={[styles.tabBarLabel, { color }]}>
              Profile
            </Text>
          ),
          tabBarIcon: ({ focused, color, size }) => (
            <Feather name={focused ? "user" : "user"} size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#D2E0FB',
    borderTopWidth: 1,
    borderTopColor: '#091057',
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    elevation: 8,
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  tabBarLabel: {
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 16,
    textAlign: 'center',
    paddingBottom: 4,
  },
});