import { observer } from "mobx-react-lite"
import { ComponentType, FC, useEffect, useMemo, useRef, useState } from "react"
import { StyleSheet, TextInput, TextStyle, TouchableOpacity, View, ViewStyle } from "react-native"
import { Icon, Screen, Text, TextField, TextFieldAccessoryProps } from "../components"
import { useStores } from "../models"
import { AppStackScreenProps } from "../navigators"
import type { ThemedStyle } from "@/theme"
import { useAppTheme } from "@/utils/useAppTheme"

interface LoginScreenProps extends AppStackScreenProps<"Login"> {}

export const LoginScreen: FC<LoginScreenProps> = observer(function LoginScreen(_props) {
  const authPasswordInput = useRef<TextInput>(null)

  const [authPassword, setAuthPassword] = useState("")
  const [isAuthPasswordHidden, setIsAuthPasswordHidden] = useState(true)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [attemptsCount, setAttemptsCount] = useState(0)
  const {
    authenticationStore: { authEmail, setAuthEmail, setAuthToken, validationError },
  } = useStores()

  const {
    themed,
    theme: { colors },
  } = useAppTheme()

  useEffect(() => {
    setAuthEmail("ignite@infinite.red")
    setAuthPassword("ign1teIsAwes0m3")

    return () => {
      setAuthPassword("")
      setAuthEmail("")
    }
  }, [setAuthEmail])

  const error = isSubmitted ? validationError : ""

  function login() {
    setIsSubmitted(true)
    setAttemptsCount(attemptsCount + 1)

    if (validationError) return

    setIsSubmitted(false)
    setAuthPassword("")
    setAuthEmail("")

    setAuthToken(String(Date.now()))
  }

  const PasswordRightAccessory: ComponentType<TextFieldAccessoryProps> = useMemo(
    () =>
      function PasswordRightAccessory(props: TextFieldAccessoryProps) {
        return (
          <Icon
            icon={isAuthPasswordHidden ? "view" : "hidden"}
            color={colors.palette.neutral800}
            containerStyle={props.style}
            size={20}
            onPress={() => setIsAuthPasswordHidden(!isAuthPasswordHidden)}
          />
        )
      },
    [isAuthPasswordHidden, colors.palette.neutral800],
  )

  return (
    <Screen preset="auto" contentContainerStyle={styles.screenContentContainer}>
      <View style={styles.loginContainer}>
        <Text
          testID="login-heading"
          tx="loginScreen:logIn"
          preset="heading"
          style={styles.loginHeading}
        />
        {attemptsCount > 2 && (
          <Text tx="loginScreen:hint" size="sm" weight="light" style={themed($hint)} />
        )}

        <Text style={styles.labelText}>Email</Text>
        <TextField
          value={authEmail}
          onChangeText={setAuthEmail}
          containerStyle={styles.textField}
          inputStyle={styles.textFieldInput}
          labelStyle={styles.textFieldLabel}
          autoCapitalize="none"
          autoComplete="email"
          autoCorrect={false}
          keyboardType="email-address"
          placeholderTx="loginScreen:emailFieldPlaceholder"
          placeholderTextColor="#999"
          helper={error}
          status={error ? "error" : undefined}
          onSubmitEditing={() => authPasswordInput.current?.focus()}
        />

        <Text style={styles.labelText}>Password</Text>
        <TextField
          ref={authPasswordInput}
          value={authPassword}
          onChangeText={setAuthPassword}
          containerStyle={styles.textField}
          labelStyle={styles.textFieldLabel}
          autoCapitalize="none"
          autoComplete="password"
          autoCorrect={false}
          secureTextEntry={isAuthPasswordHidden}
          placeholderTx="loginScreen:passwordFieldPlaceholder"
          placeholderTextColor="#999"
          onSubmitEditing={login}
          RightAccessory={PasswordRightAccessory}
        />

        <TouchableOpacity style={styles.button} onPress={login}>
          <Text style={styles.buttonText}>Next</Text>
        </TouchableOpacity>
      </View>
    </Screen>
  )
})

const $hint: ThemedStyle<TextStyle> = ({ colors, spacing }) => ({
  color: colors.tint,
  marginBottom: spacing.md,
})

const styles = StyleSheet.create({
  screenContentContainer: {
    flex: 1,
    backgroundColor: "#D2E0FB",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  loginContainer: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  loginHeading: {
    color: "#091057",
    textAlign: "center",
    marginBottom: 20,
  },
  textField: {
    marginBottom: 15,
  },
  textFieldInput: {
    color: "black",
  },
  textFieldLabel: {
    color: "#091057",
  },
  button: {
    backgroundColor: '#091057',
    paddingVertical: 15,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  labelText: {
    color: "black",
    fontSize: 16,
    marginBottom: 5,
  },
})