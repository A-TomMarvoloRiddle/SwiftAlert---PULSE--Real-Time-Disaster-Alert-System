import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"

export default function SettingsPage() {
  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Notification Preferences</CardTitle>
          <CardDescription>
            Choose how you want to be notified about disaster events.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-6">
            <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="push-notifications" className="flex flex-col space-y-1">
                <span>Push Notifications</span>
                <span className="font-normal leading-snug text-muted-foreground">
                    Receive alerts directly on your device.
                </span>
                </Label>
                <Switch id="push-notifications" defaultChecked />
            </div>
            <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="email-notifications" className="flex flex-col space-y-1">
                <span>Email Notifications</span>
                <span className="font-normal leading-snug text-muted-foreground">
                    Get detailed alerts sent to your email.
                </span>
                </Label>
                <Switch id="email-notifications" defaultChecked />
            </div>
            <div className="flex items-center justify-between space-x-2">
                <Label htmlFor="sms-notifications" className="flex flex-col space-y-1">
                <span>SMS Notifications</span>
                <span className="font-normal leading-snug text-muted-foreground">
                    Receive critical alerts via text message.
                </span>
                </Label>
                <Switch id="sms-notifications" />
            </div>
          </form>
        </CardContent>
        <CardFooter className="border-t px-6 py-4">
          <Button>Save Changes</Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Disaster Types</CardTitle>
          <CardDescription>
            Select which types of disasters you want to receive alerts for.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div className="flex items-center space-x-2">
            <Checkbox id="earthquakes" defaultChecked />
            <label
              htmlFor="earthquakes"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Earthquakes
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="floods" defaultChecked />
            <label
              htmlFor="floods"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Floods
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="wildfires" defaultChecked />
            <label
              htmlFor="wildfires"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Wildfires
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="cyclones" defaultChecked />
            <label
              htmlFor="cyclones"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Cyclones
            </label>
          </div>
        </CardContent>
        <CardFooter className="border-t px-6 py-4">
          <Button>Save Changes</Button>
        </CardFooter>
      </Card>
    </div>
  )
}
