import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  ImageBackground,
  ScrollView,
  Animated,
} from 'react-native';
import Header from '../components/Header';
import officeIllustration from '../assets/img.jpg';
// ✅ Updated High-Quality Web Images
const bgImage = {
  uri: 'https://oss-community.eagle.cool/resource/attachment/584c64ae-05e6-4acd-b6e6-20500f22a04a/e0bfb5dd.webp/orginal',
};

const gmailIcon = {
  uri: 'https://cdn-icons-png.flaticon.com/128/732/732200.png',
};


const securityIllustration = {
  uri: 'https://www.svgrepo.com/show/397335/shield-security.svg',
};

const LoginScreen = ({ handleGoogleLogin }) => {
  // ✅ Create Animated Values for Floating Animation
  const translateY = useRef(new Animated.Value(0)).current;
  const translateX = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const floatAnimation = () => {
      // Vertical Floating Animation (Up and Down)
      Animated.loop(
        Animated.sequence([
          Animated.timing(translateY, {
            toValue: -3,
            duration: 1900,
            useNativeDriver: true,
          }),
          Animated.timing(translateY, {
            toValue: 3,
            duration: 1900,
            useNativeDriver: true,
          }),
        ])
      ).start();

      // Horizontal Floating Animation (Left and Right)
      Animated.loop(
        Animated.sequence([
          Animated.timing(translateX, {
            toValue: -3,
            duration: 1800,
            useNativeDriver: true,
          }),
          Animated.timing(translateX, {
            toValue: 3,
            duration: 1800,
            useNativeDriver: true,
          }),
        ])
      ).start();
    };

    floatAnimation(); // Start the animation
  }, [translateY, translateX]);

  // ✅ Apply Animated Styles to Components
  const animatedStyle = {
    transform: [{ translateY }, { translateX }],
  };

  return (
    <ImageBackground
      source={bgImage}
      style={styles.background}
      resizeMode="cover"
      imageStyle={styles.bgImageStyle}
    >
      <Header handleGoogleLogin={handleGoogleLogin} />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Main Container with Image and Login Card */}
        <View style={styles.container}>
          {/* Left Side: Floating Rounded Image */}
          <Animated.View style={[styles.leftContainer, animatedStyle]}>
            <Image source={officeIllustration} style={styles.officeImage} />
          </Animated.View>

          {/* Right Side: Floating Login Card */}
          <Animated.View style={[styles.rightContainer, animatedStyle]}>
            <View style={styles.loginCard}>
              <Text style={styles.heading}>🔗 Connect Your Google Account</Text>
<View style={styles.featuresContainer}>
  <View style={styles.featureItem}>
    <Text style={styles.featureEmoji}>📧</Text>
    <Text style={styles.featureText}>
      <Text style={styles.boldText}>Send Bulk Emails:</Text> Deliver customized emails effortlessly to thousands of recipients.
    </Text>
  </View>

  <View style={styles.featureItem}>
    <Text style={styles.featureEmoji}>📊</Text>
    <Text style={styles.featureText}>
      <Text style={styles.boldText}>Detailed Analytics:</Text> Track open rates, clicks, and performance in real time.
    </Text>
  </View>

  <View style={styles.featureItem}>
    <Text style={styles.featureEmoji}>🎯</Text>
    <Text style={styles.featureText}>
      <Text style={styles.boldText}>Smart Audience Targeting:</Text> Segment your audience and personalize email content.
    </Text>
  </View>

  <View style={styles.featureItem}>
    <Text style={styles.featureEmoji}>🚀</Text>
    <Text style={styles.featureText}>
      <Text style={styles.boldText}>Boost Engagement:</Text> Increase email deliverability and user interaction.
    </Text>
  </View>

  <View style={styles.featureItem}>
    <Text style={styles.featureEmoji}>🔒</Text>
    <Text style={styles.featureText}>
      <Text style={styles.boldText}>Secure & Reliable:</Text> Fully compliant with Google’s security protocols.
    </Text>
  </View>
</View>


              {/* Google Login Button */}
              <TouchableOpacity style={styles.googleButton} onPress={handleGoogleLogin}>
                <Image source={gmailIcon} style={styles.googleIcon} />
                <Text style={styles.buttonText}>Login with Google</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>

        {/* Bottom Security Illustration - Centered without Animation */}
        <View style={styles.securityContainer}>
          <Image source={securityIllustration} style={styles.securityIcon} />
          <Text style={styles.securityText}>100% Secure & Safe Login</Text>
        </View>
      </ScrollView>
    </ImageBackground>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
    backgroundColor: '#f5f5f5',
  },
  bgImageStyle: {
    transform: [{ scale: 0.85 }], // ✅ Proper Zoom Out
    borderRadius: 20,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingVertical: 20,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 30,
    paddingHorizontal: 20,
  },

  // ✅ Left Side: Rounded Floating Image
  leftContainer: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'center',
    marginLeft: -30,
  },
  officeImage: {
    width: 400,
    height: 400,
    borderRadius: 100,
    resizeMode: 'cover',
    borderWidth: 3,
    borderColor: '#ddd',
  },

  // ✅ Right Side: Floating Login Card
  rightContainer: {
    flex: 1,
    alignItems: 'center',
  },
  loginCard: {
    width: '90%',
    maxWidth: 400,
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 15,
    elevation: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    borderWidth: 0.5,
    borderColor: '#ddd',
  },
  heading: {
    fontSize: 24,
    marginBottom: 10,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  subText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  googleIcon: {
    width: 24,
    height: 24,
    marginRight: 10,
    resizeMode: 'contain',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },

  // ✅ Bottom Security Section - Centered without Animation
  securityContainer: {
    marginTop: 40,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  securityIcon: {
    width: 60,
    height: 60,
    resizeMode: 'contain',
    marginBottom: 10,
  },
  securityText: {
    fontSize: 14,
    color: '#555',
    fontWeight: '500',
    textAlign: 'center',
  },
  featuresContainer: {
  marginTop: 10,
  marginBottom: 20,
},
featureItem: {
  flexDirection: 'row',
  alignItems: 'center',
  marginBottom: 10,
},
featureEmoji: {
  fontSize: 18,
  marginRight: 10,
},
featureText: {
  fontSize: 14,
  color: '#555',
  lineHeight: 20,
},
boldText: {
  fontWeight: 'bold',
  color: '#333',
},

});