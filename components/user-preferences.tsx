'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Settings, Moon, Sun, Clock, User } from 'lucide-react'
import { useTheme } from '@/hooks/use-theme'

interface UserPreferences {
  theme: 'light' | 'dark' | 'auto'
  defaultSessionDuration: number
  studyReminders: boolean
  defaultLanguage: string
  timezone: string
}

export default function UserPreferences() {
  const [isOpen, setIsOpen] = useState(false)
  const { theme, setTheme } = useTheme()
  const [preferences, setPreferences] = useState<UserPreferences>({
    theme: theme as 'light' | 'dark' | 'auto',
    defaultSessionDuration: 60,
    studyReminders: true,
    defaultLanguage: 'english',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  })

  useEffect(() => {
    const saved = localStorage.getItem('learnai-preferences')
    if (saved) {
      const parsed = JSON.parse(saved)
      setPreferences(parsed)
    }
  }, [])

  const savePreferences = () => {
    localStorage.setItem('learnai-preferences', JSON.stringify(preferences))
    // Apply theme immediately
    setTheme(preferences.theme)
    setIsOpen(false)
  }

  const handleThemeChange = (newTheme: 'light' | 'dark' | 'auto') => {
    setPreferences({ ...preferences, theme: newTheme })
    // Apply theme immediately
    setTheme(newTheme)
  }

  if (!isOpen) {
    return (
      <Button
        variant="outline"
        size="icon"
        onClick={() => setIsOpen(true)}
        className="gap-2"
        title="User Preferences"
      >
        <Settings className="w-4 h-4" />
      </Button>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <Card className="w-full max-w-md border border-border/40 bg-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg font-medium">
            <Settings className="w-4 h-4" />
            Preferences
          </CardTitle>
          <div className="h-0.5 w-8 bg-primary/30 mt-2"></div>
          <CardDescription className="text-sm italic mt-2">Customize your LearnAI experience</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Theme */}
          <div>
            <label className="text-sm font-medium text-foreground block mb-3">Theme</label>
            <div className="flex gap-2">
              {(['light', 'dark', 'auto'] as const).map(t => (
                <Button
                  key={t}
                  variant={preferences.theme === t ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleThemeChange(t)}
                  className="flex-1 gap-1"
                >
                  {t === 'light' && <Sun className="w-4 h-4" />}
                  {t === 'dark' && <Moon className="w-4 h-4" />}
                  {t === 'auto' && <span>Auto</span>}
                  <span className="capitalize hidden sm:inline">{t}</span>
                </Button>
              ))}
            </div>
          </div>

          {/* Default Session Duration */}
          <div>
            <label className="text-sm font-medium text-foreground block mb-3">
              <Clock className="w-4 h-4 inline mr-2" />
              Default Session Duration
            </label>
            <div className="flex gap-2">
              {[30, 45, 60, 90, 120].map(duration => (
                <Button
                  key={duration}
                  variant={preferences.defaultSessionDuration === duration ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setPreferences({ ...preferences, defaultSessionDuration: duration })}
                >
                  {duration}m
                </Button>
              ))}
            </div>
          </div>

          {/* Study Reminders */}
          <div>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={preferences.studyReminders}
                onChange={e =>
                  setPreferences({ ...preferences, studyReminders: e.target.checked })
                }
                className="w-4 h-4 rounded border-border"
              />
              <span className="text-sm font-medium text-foreground">Enable study reminders</span>
            </label>
            <p className="text-xs text-muted-foreground mt-2 ml-7">
              Get notifications for scheduled study sessions
            </p>
          </div>

          {/* Timezone */}
          <div>
            <label className="text-sm font-medium text-foreground block mb-2">Timezone</label>
            <select
              value={preferences.timezone}
              onChange={e => setPreferences({ ...preferences, timezone: e.target.value })}
              className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground text-sm"
            >
              <option value="UTC">UTC</option>
              <option value="America/New_York">Eastern Time</option>
              <option value="America/Chicago">Central Time</option>
              <option value="America/Denver">Mountain Time</option>
              <option value="America/Los_Angeles">Pacific Time</option>
              <option value="Europe/London">London</option>
              <option value="Europe/Paris">Paris</option>
              <option value="Asia/Tokyo">Tokyo</option>
              <option value="Asia/Kolkata">India</option>
              <option value="Australia/Sydney">Sydney</option>
            </select>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-4">
            <Button onClick={savePreferences} className="flex-1">
              Save
            </Button>
            <Button variant="outline" onClick={() => setIsOpen(false)} className="flex-1">
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
