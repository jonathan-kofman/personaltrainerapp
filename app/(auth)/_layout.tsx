import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import React from 'react'

export default function AuthLayout() {
  return (
    <>
      <StatusBar style="light" backgroundColor="#F3E8FF" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="signin" />
        <Stack.Screen name="signup" />
      </Stack>
    </>
  )
}