import {
  StyleSheet,
  Text,
  View,
  TextInput,
  KeyboardAvoidingView,
  Button,
} from "react-native";

export const globalStyles = StyleSheet.create({
  headerText: {
    marginLeft: 30,
    marginBottom: 30,
    fontSize: 24,
  },
  container: {
    flex: 1,
    marginTop: 50,
    backgroundColor: "#FFFFFF",
  },
  containerDrawer: {
    flex: 1,
    marginTop: 10,
    backgroundColor: "#FFFFFF",
  },
  inlineTextButton: {
    paddingTop: 15,
    textAlign: "center",
    textShadowColor: "black",
    textShadowRadius: 0.5,
    color: "#FFDCAB",
  },
  textInputContainer: {
    borderRadius: 15,
    backgroundColor: "#FAFAFA",
    paddingLeft: 20,
    paddingRight: 20,
    marginLeft: 30,
    marginRight: 30,
    marginBottom: 16,
    height: 44,
  },
  backButton: {
    elevation: 8,
    backgroundColor: "#FFDCAB",
    borderRadius: 15,
    height: 34,
    width: 148,
    paddingVertical: 6,
    position: "absolute",
    left: 30,
    bottom: 45,
  },
  nextButton: {
    elevation: 8,
    backgroundColor: "#FFDCAB",
    borderRadius: 15,
    height: 34,
    width: 148,
    paddingVertical: 6,
    position: "absolute",
    right: 30,
    bottom: 45,
  },
  actionButtonText: {
    textAlign: "center",
    fontSize: 16,
  },
  headerText: {
    marginLeft: 15,
    fontSize: 22,
    fontWeight: "400",
  },
  bodyText: {
    textAlign: "center",
  },
});
