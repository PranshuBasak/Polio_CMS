'use client';

import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';

export default function SiteSettings() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  // Mock site settings - in a real implementation, this would come from your data provider
  const [settings, setSettings] = useState({
    general: {
      siteName: '0xTanzim Portfolio',
      siteDescription:
        'Personal portfolio website of Tanzim, a Software Architect and Backend Developer',
      timezone: 'utc',
      publicProfile: true,
    },
    seo: {
      metaTitle: 'Tanzim | Software Architect & Backend Developer',
      metaDescription:
        'Portfolio website of Tanzim, a Software Architect and Backend Developer specializing in TypeScript, Java, Spring Boot, and Node.js',
      keywords:
        'software architect, backend developer, typescript, java, spring boot, node.js',
    },
    appearance: {
      theme: 'system',
      primaryColor: '#3b82f6',
      animations: true,
      reducedMotion: true,
    },
    advanced: {
      cacheDuration: 60,
      debugMode: false,
    },
  });

  const handleChange = (section: string, field: string, value: unknown) => {
    setSettings((prev) => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev],
        [field]: value,
      },
    }));
  };

  const handleSave = () => {
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      toast({
        title: 'Settings saved',
        description: 'Your settings have been saved successfully.',
      });

      setIsLoading(false);
    }, 1000);
  };

  return (
    <Tabs defaultValue="general" className="space-y-4">
      <TabsList>
        <TabsTrigger value="general">General</TabsTrigger>
        <TabsTrigger value="appearance">Appearance</TabsTrigger>
        <TabsTrigger value="seo">SEO</TabsTrigger>
        <TabsTrigger value="advanced">Advanced</TabsTrigger>
      </TabsList>

      <TabsContent value="general" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>General Settings</CardTitle>
            <CardDescription>
              Manage your basic portfolio settings
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="site-name">Site Name</Label>
              <Input
                id="site-name"
                value={settings.general.siteName}
                onChange={(e) =>
                  handleChange('general', 'siteName', e.target.value)
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="site-description">Site Description</Label>
              <Textarea
                id="site-description"
                value={settings.general.siteDescription}
                onChange={(e) =>
                  handleChange('general', 'siteDescription', e.target.value)
                }
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="timezone">Timezone</Label>
              <Select
                value={settings.general.timezone}
                onValueChange={(value) =>
                  handleChange('general', 'timezone', value)
                }
              >
                <SelectTrigger id="timezone">
                  <SelectValue placeholder="Select timezone" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="utc">
                    UTC (Coordinated Universal Time)
                  </SelectItem>
                  <SelectItem value="est">
                    EST (Eastern Standard Time)
                  </SelectItem>
                  <SelectItem value="cst">
                    CST (Central Standard Time)
                  </SelectItem>
                  <SelectItem value="pst">
                    PST (Pacific Standard Time)
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="public-profile">Public Profile</Label>
                <div className="text-sm text-muted-foreground">
                  Make your portfolio visible to everyone
                </div>
              </div>
              <Switch
                id="public-profile"
                checked={settings.general.publicProfile}
                onCheckedChange={(checked) =>
                  handleChange('general', 'publicProfile', checked)
                }
              />
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="appearance" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Theme Settings</CardTitle>
            <CardDescription>
              Customize the appearance of your portfolio
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Default Theme</Label>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="light"
                    name="theme"
                    value="light"
                    checked={settings.appearance.theme === 'light'}
                    onChange={() =>
                      handleChange('appearance', 'theme', 'light')
                    }
                  />
                  <Label htmlFor="light">Light</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="dark"
                    name="theme"
                    value="dark"
                    checked={settings.appearance.theme === 'dark'}
                    onChange={() => handleChange('appearance', 'theme', 'dark')}
                  />
                  <Label htmlFor="dark">Dark</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="system"
                    name="theme"
                    value="system"
                    checked={settings.appearance.theme === 'system'}
                    onChange={() =>
                      handleChange('appearance', 'theme', 'system')
                    }
                  />
                  <Label htmlFor="system">System</Label>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="primary-color">Primary Color</Label>
              <div className="flex items-center gap-4">
                <div
                  className="w-10 h-10 rounded-full border"
                  style={{ backgroundColor: settings.appearance.primaryColor }}
                ></div>
                <Input
                  id="primary-color"
                  value={settings.appearance.primaryColor}
                  onChange={(e) =>
                    handleChange('appearance', 'primaryColor', e.target.value)
                  }
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="animations">Animations</Label>
                <div className="text-sm text-muted-foreground">
                  Enable animations throughout the portfolio
                </div>
              </div>
              <Switch
                id="animations"
                checked={settings.appearance.animations}
                onCheckedChange={(checked) =>
                  handleChange('appearance', 'animations', checked)
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="reduced-motion">Reduced Motion</Label>
                <div className="text-sm text-muted-foreground">
                  Respect user&apos;s reduced motion preferences
                </div>
              </div>
              <Switch
                id="reduced-motion"
                checked={settings.appearance.reducedMotion}
                onCheckedChange={(checked) =>
                  handleChange('appearance', 'reducedMotion', checked)
                }
              />
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="seo" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>SEO Settings</CardTitle>
            <CardDescription>
              Optimize your portfolio for search engines
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="meta-title">Meta Title</Label>
              <Input
                id="meta-title"
                value={settings.seo.metaTitle}
                onChange={(e) =>
                  handleChange('seo', 'metaTitle', e.target.value)
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="meta-description">Meta Description</Label>
              <Textarea
                id="meta-description"
                value={settings.seo.metaDescription}
                onChange={(e) =>
                  handleChange('seo', 'metaDescription', e.target.value)
                }
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="keywords">Keywords</Label>
              <Input
                id="keywords"
                value={settings.seo.keywords}
                onChange={(e) =>
                  handleChange('seo', 'keywords', e.target.value)
                }
              />
              <p className="text-xs text-muted-foreground">
                Separate keywords with commas
              </p>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="advanced" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Advanced Settings</CardTitle>
            <CardDescription>
              Configure advanced options for your portfolio
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="cache-duration">Cache Duration (minutes)</Label>
              <Input
                id="cache-duration"
                type="number"
                value={settings.advanced.cacheDuration}
                onChange={(e) =>
                  handleChange(
                    'advanced',
                    'cacheDuration',
                    Number.parseInt(e.target.value) || 0
                  )
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="debug-mode">Debug Mode</Label>
                <div className="text-sm text-muted-foreground">
                  Enable detailed error messages
                </div>
              </div>
              <Switch
                id="debug-mode"
                checked={settings.advanced.debugMode}
                onCheckedChange={(checked) =>
                  handleChange('advanced', 'debugMode', checked)
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="export-data">Export Data</Label>
              <Button variant="outline" className="w-full">
                Export Portfolio Data
              </Button>
              <p className="text-xs text-muted-foreground">
                Download all your portfolio data as a JSON file
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="reset-data" className="text-destructive">
                Danger Zone
              </Label>
              <Button variant="destructive" className="w-full">
                Reset to Default
              </Button>
              <p className="text-xs text-muted-foreground">
                This will reset all your portfolio data to default values
              </p>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={isLoading}>
          {isLoading ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </Tabs>
  );
}
