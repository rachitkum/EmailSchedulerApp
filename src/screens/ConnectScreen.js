// ConnectScreen.js
import React, { useEffect, useState } from "react";
import { View, Text, Button, Linking, Alert, ActivityIndicator } from "react-native";
import axios from "axios";
import * as WebBrowser from "expo-web-browser";
import * as LinkingModule from "expo-linking";
import { useNavigation } from "@react-navigation/native";

WebBrowser.maybeCompleteAuthSession();

const BACKEND_URL = "https://custom-email-sender-production.up.railway.app/api";

const ConnectScreen = () => {
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false);

  // URL to redirect after login
  const redirectUrl = LinkingModule.createURL("email"); // Ensure this matches your deep link config

  // Handle OAuth Callback
  useEffect(() => {
    const handleOpenUrl = async (event) => {
      const { url } = event;
      console.log("URL received:", url);

      if (url.includes("/google-callback/")) {
        const code = url.split("code=")[1]?.split("&")[0];
        if (code) {
          console.log("Auth Code:", code);
          await exchangeAuthCodeForToken(code);
        }
      }
    };

    // Listen for deep link
    const subscription = Linking.addEventListener("url", handleOpenUrl);
    return () => {
      subscription.remove();
    };
  }, []);

  // Exchange Auth Code for Access Token
  const exchangeAuthCodeForToken = async (code) => {
    try {
      const response = await axios.get(`${BACKEND_URL}/google-callback/?code=${code}`);
      console.log("Auth Success:", response.data);
      Alert.alert("Success", "Google Account Connected!");
      navigation.navigate("EmailScreen"); // Navigate to EmailScreen within the same stack
    } catch (error) {
      console.error("Auth Error:", error);
      Alert.alert("Error", "Failed to authenticate with Google.");
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  // Open Google OAuth URL
  const connectEmail = async () => {
    setIsLoading(true); // Start loading
    try {
      const response = await axios.get(`${BACKEND_URL}/google-login/`);
      const authUrl = response.data.auth_url;
      console.log("Auth URL:", authUrl);

      // Open the OAuth URL in the browser
      const result = await WebBrowser.openAuthSessionAsync(authUrl, redirectUrl);
      console.log("WebBrowser result:", result);

      // If the WebBrowser closes, handle the result
      if (result.type === "success") {
        console.log("OAuth Success!");
        // The deep link will be handled by the Linking event listener
      } else if (result.type === "cancel") {
        console.log("OAuth Cancelled");
        Alert.alert("Cancelled", "Google login was cancelled.");
      }
    } catch (error) {
      console.error("Error fetching Google Auth URL:", error);
      Alert.alert("Error", "Unable to initiate Google Login.");
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ fontSize: 20, marginBottom: 20 }}>Connect Your Google Account</Text>
      {isLoading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <Button title="Connect Email" onPress={connectEmail} />
      )}
    </View>
  );
};

export default ConnectScreen;