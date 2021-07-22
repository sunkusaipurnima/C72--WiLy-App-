/** @format */

import React, { useState, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  MaterialCommunityIcons,
  Feather,
  FontAwesome,
} from "react-native-vector-icons";
import { useFonts } from "expo-font";
import { Rajdhani_600SemiBold } from "@expo-google-fonts/rajdhani";
import AppLoading from "expo-app-loading";

import TransactionScreen from "./Screens/BookTransactionScreen";
import SearchScreen from "./Screens/SearchScreen";

const Tab = createBottomTabNavigator();

const App = (props) => {
  const [fontLoaded] = useFonts({ Rajdhani_600SemiBold });

  if (fontLoaded) {
    return (
      <NavigationContainer>
        <Tab.Navigator
          tabBarOptions={{
            activeTintColor: "#FFFFFF",
            inactiveBackgroundColor: "black",
            style: {
              height: 130,
              borderTopWidth: 2,
              backgroundColor: "#5653d4",
            },
            labelStyle: { fontSize: 20, fontFamily: "Rajdhani_600SemiBold" },
            labelPosition: "beside-icon",
            tabStyle: {
              marginTop: 20,
              marginLeft: 10,
              marginRight: 10,
              borderRadius: 30,
              borderWidth: 2,
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: "#5653d4",
            },
          }}
        >
          <Tab.Screen
            name="Issue/Return"
            component={TransactionScreen}
            options={{
              tabBarIcon: ({ color, size }) => (
                <FontAwesome name="book" color={color} size={size} />
              ),
            }}
          />
          <Tab.Screen
            name="Search"
            component={SearchScreen}
            options={{
              tabBarIcon: ({ color, size }) => (
                <Feather name="search" color={color} size={size} />
              ),
            }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    );
  } else {
    return <AppLoading />;
  }
};

const styles = StyleSheet.create({});

export default App;
