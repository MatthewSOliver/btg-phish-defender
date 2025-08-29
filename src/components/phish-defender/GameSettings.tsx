"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import type { GameConfig } from "@/types/phish-defender";
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
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Zap } from "lucide-react";

const formSchema = z.object({
  numberOfEmails: z.number().min(1).max(10),
  numberOfRounds: z.number().min(1).max(5),
  colorblindMode: z.boolean(),
  highContrastMode: z.boolean(),
});

interface GameSettingsProps {
  onStartGame: (config: GameConfig) => void;
}

export function GameSettings({ onStartGame }: GameSettingsProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      numberOfEmails: 5,
      numberOfRounds: 3,
      colorblindMode: false,
      highContrastMode: false,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    onStartGame(values);
  }

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader>
        <CardTitle>Game Customization</CardTitle>
        <CardDescription>
          Adjust the settings for your phishing awareness session.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-8">
            <FormField
              control={form.control}
              name="numberOfEmails"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Emails per Round: {field.value}</FormLabel>
                  <FormControl>
                    <Slider
                      min={1}
                      max={10}
                      step={1}
                      value={[field.value]}
                      onValueChange={(vals) => field.onChange(vals[0])}
                    />
                  </FormControl>
                  <FormDescription>
                    Choose how many emails you want to review in each round.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="numberOfRounds"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Number of Rounds: {field.value}</FormLabel>
                  <FormControl>
                    <Slider
                      min={1}
                      max={5}
                      step={1}
                      value={[field.value]}
                      onValueChange={(vals) => field.onChange(vals[0])}
                    />
                  </FormControl>
                  <FormDescription>
                    Select the total number of rounds for this game.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="colorblindMode"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">
                      Colorblind Mode
                    </FormLabel>
                    <FormDescription>
                      Adjust colors for better visibility.
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="highContrastMode"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">
                      High Contrast Mode
                    </FormLabel>
                    <FormDescription>
                      Increase contrast for better readability.
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full">
              <Zap className="mr-2 h-4 w-4" />
              Start Game
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
