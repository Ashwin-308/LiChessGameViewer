'use client'
import React, { useCallback } from "react"
import { useTheme } from 'next-themes'
import { useSettings } from '@/hooks/useSettings'
import { ThemeToggleButton, useThemeTransition } from "@/components/ui/shadcn-io/theme-toggle-button"

const MyOtherComponent = () => {
  const { setTheme } = useTheme()
  const { settings, updateSettings } = useSettings()
  const { startTransition } = useThemeTransition()

  const handleThemeToggle = useCallback(() => {
    const newMode = settings.mode === 'dark' ? 'light' : 'dark'

    startTransition(() => {
      const updatedSettings = {
        ...settings,
        mode: newMode,
      }
      updateSettings(updatedSettings)
      setTheme(newMode)
    })
  }, [settings, updateSettings, setTheme, startTransition])

  const currentTheme = settings.mode === 'system' ? 'light' : settings.mode

  return (
    <div>
      {/* Your other components */}
      <ThemeToggleButton
        theme={currentTheme}
        onClick={handleThemeToggle}
        variant="gif"
        url="https://media.giphy.com/media/KBbr4hHl9DSahKvInO/giphy.gif?cid=790b76112m5eeeydoe7et0cr3j3ekb1erunxozyshuhxx2vl&ep=v1_stickers_search&rid=giphy.gif&ct=s"
      />
    </div>
  )
}

export default MyOtherComponent