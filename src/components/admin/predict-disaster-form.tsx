
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { predictDisaster } from "@/ai/flows/predict-disaster-flow";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { AlertCircle, Bot } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

const formSchema = z.object({
  location: z.string().min(1, "Location is required"),
  temperature: z.string().min(1, "Temperature is required"),
  humidity: z.string().min(1, "Humidity is required"),
  windSpeed: z.string().min(1, "Wind speed is required"),
});

const riskVariantMap: { [key: string]: "default" | "secondary" | "destructive" | "accent" } = {
  Low: "default",
  Moderate: "secondary",
  High: "accent",
  Critical: "destructive",
};

export function PredictDisasterForm() {
  const [prediction, setPrediction] = useState<{ riskLevel: string; prediction: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      location: "",
      temperature: "",
      humidity: "",
      windSpeed: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    setError(null);
    setPrediction(null);
    try {
      const result = await predictDisaster({
        location: values.location,
        temperature: parseFloat(values.temperature),
        humidity: parseFloat(values.humidity),
        windSpeed: parseFloat(values.windSpeed),
      });
      setPrediction(result);
    } catch (e: any) {
      setError(e.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardHeader>
            <CardTitle>AI Disaster Prediction</CardTitle>
            <CardDescription>
              Use AI to forecast disaster risk based on environmental data.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., California, USA" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="temperature"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Temp (°C)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="35" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="humidity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Humidity (%)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="15" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="windSpeed"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Wind (km/h)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="30" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {loading && (
              <div className="space-y-2 pt-2">
                <Skeleton className="h-4 w-[150px]" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-4/5" />
              </div>
            )}

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {prediction && (
              <Alert>
                <Bot className="h-4 w-4" />
                <AlertTitle className="flex items-center gap-2">
                  <span>Prediction Result</span>
                  <Badge variant={riskVariantMap[prediction.riskLevel]}>{prediction.riskLevel} Risk</Badge>
                </AlertTitle>
                <AlertDescription>{prediction.prediction}</AlertDescription>
              </Alert>
            )}

          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={loading}>
              {loading ? "Predicting..." : "Predict Disaster Risk"}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
