'use client';

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
import { useToast } from '@/hooks/use-toast';
import { useSiteSettingsStore } from '@/lib/stores';
import CloudinaryUpload from '@/components/ui/cloudinary-upload';
import { useState } from 'react';

export default function SiteSettings() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const { settings, updateSettings, updateSocial, updateSEO, updateAppearance, updateAdvanced } =
    useSiteSettingsStore();

  const handleSave = async () => {
    setIsLoading(true);
    console.log("Saving settings...", settings);

    try {
      await updateSettings(settings);
      toast({
        title: 'Settings saved',
        description: 'Your settings have been saved successfully.',
      });
    } catch (error) {
      console.error("Failed to save settings:", error);
      toast({
        title: 'Error',
        description: 'Failed to save settings. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Tabs defaultValue="general" className="space-y-4">
      <TabsList>
        <TabsTrigger value="general">General</TabsTrigger>
        <TabsTrigger value="social">Social Links</TabsTrigger>
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
                value={settings.siteName}
                onChange={(e) =>
                  updateSettings({ siteName: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="site-description">Site Description</Label>
              <Textarea
                id="site-description"
                value={settings.siteDescription}
                onChange={(e) =>
                  updateSettings({ siteDescription: e.target.value })
                }
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="site-url">Site URL</Label>
              <Input
                id="site-url"
                value={settings.siteUrl}
                onChange={(e) =>
                  updateSettings({ siteUrl: e.target.value })
                }
                placeholder="https://0xPranshu.dev"
              />
              <p className="text-xs text-muted-foreground">
                Include protocol, for example <code>http://localhost:3000</code> or <code>https://yourdomain.com</code>.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="timezone">Timezone</Label>
              <Select
                value={settings.timezone}
                onValueChange={(value) =>
                  updateSettings({ timezone: value })
                }
              >
                <SelectTrigger id="timezone">
                  <SelectValue placeholder="Select timezone" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="utc">UTC</SelectItem>
                  <SelectItem value="est">Eastern Time (EST)</SelectItem>
                  <SelectItem value="pst">Pacific Time (PST)</SelectItem>
                  <SelectItem value="cet">Central European Time (CET)</SelectItem>
                  <SelectItem value="ist">India Standard Time (IST)</SelectItem>
                  <SelectItem value="jst">Japan Standard Time (JST)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="public-profile">Public Profile</Label>
                <p className="text-sm text-muted-foreground">
                  Make your portfolio publicly accessible
                </p>
              </div>
              <Switch
                id="public-profile"
                checked={settings.publicProfile}
                onCheckedChange={(checked) =>
                  updateSettings({ publicProfile: checked })
                }
              />
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="social" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Social Links</CardTitle>
            <CardDescription>
              Manage your social media profiles
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="github">GitHub</Label>
              <Input
                id="github"
                value={settings.social.github}
                onChange={(e) =>
                  updateSocial({ github: e.target.value })
                }
                placeholder="https://github.com/yourusername"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="linkedin">LinkedIn</Label>
              <Input
                id="linkedin"
                value={settings.social.linkedin}
                onChange={(e) =>
                  updateSocial({ linkedin: e.target.value })
                }
                placeholder="https://linkedin.com/in/yourusername"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={settings.social.email}
                onChange={(e) =>
                  updateSocial({ email: e.target.value })
                }
                placeholder="your@email.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="medium">Medium</Label>
              <Input
                id="medium"
                value={settings.social.medium}
                onChange={(e) =>
                  updateSocial({ medium: e.target.value })
                }
                placeholder="https://medium.com/@yourusername"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="twitter">Twitter</Label>
              <Input
                id="twitter"
                value={settings.social.twitter}
                onChange={(e) =>
                  updateSocial({ twitter: e.target.value })
                }
                placeholder="@yourusername"
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
                <Button
                  variant={
                    settings.appearance.theme === 'light' ? 'default' : 'outline'
                  }
                  onClick={() => updateAppearance({ theme: 'light' })}
                  className="flex-1"
                >
                  Light
                </Button>
                <Button
                  variant={
                    settings.appearance.theme === 'dark' ? 'default' : 'outline'
                  }
                  onClick={() => updateAppearance({ theme: 'dark' })}
                  className="flex-1"
                >
                  Dark
                </Button>
                <Button
                  variant={
                    settings.appearance.theme === 'system' ? 'default' : 'outline'
                  }
                  onClick={() => updateAppearance({ theme: 'system' })}
                  className="flex-1"
                >
                  System
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="primary-color">Primary Color</Label>
              <div className="flex items-center gap-4">
                <input
                  type="color"
                  value={settings.appearance.primaryColor}
                  onChange={(e) =>
                    updateAppearance({ primaryColor: e.target.value })
                  }
                  className="h-10 w-20 cursor-pointer rounded border"
                />
                <Input
                  id="primary-color"
                  value={settings.appearance.primaryColor}
                  onChange={(e) =>
                    updateAppearance({ primaryColor: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="animations">Enable Animations</Label>
                <p className="text-sm text-muted-foreground">
                  Turn on smooth transitions and animations
                </p>
              </div>
              <Switch
                id="animations"
                checked={settings.appearance.animations}
                onCheckedChange={(checked) =>
                  updateAppearance({ animations: checked })
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="reduced-motion">Reduced Motion</Label>
                <p className="text-sm text-muted-foreground">
                  Minimize motion for accessibility
                </p>
              </div>
              <Switch
                id="reduced-motion"
                checked={settings.appearance.reducedMotion}
                onCheckedChange={(checked) =>
                  updateAppearance({ reducedMotion: checked })
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
                  updateSEO({ metaTitle: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="meta-description">Meta Description</Label>
              <Textarea
                id="meta-description"
                value={settings.seo.metaDescription}
                onChange={(e) =>
                  updateSEO({ metaDescription: e.target.value })
                }
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="keywords">Keywords</Label>
              <Input
                id="keywords"
                value={settings.seo.keywords.join(', ')}
                onChange={(e) =>
                  updateSEO({
                    keywords: e.target.value.split(',').map((k) => k.trim()),
                  })
                }
              />
              <p className="text-xs text-muted-foreground">
                Separate keywords with commas
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="og-image">Open Graph Image</Label>
              <CloudinaryUpload
                value={settings.seo.ogImage || ''}
                onChange={(value) =>
                  updateSEO({ ogImage: value as string })
                }
              />
              <Input
                id="og-image"
                value={settings.seo.ogImage}
                onChange={(e) =>
                  updateSEO({ ogImage: e.target.value })
                }
                placeholder="https://0xPranshu.dev/og-image.png"
              />
              <p className="text-xs text-muted-foreground">
                Upload to CDN or paste a direct image URL.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="twitter-image">Twitter Image</Label>
              <CloudinaryUpload
                value={settings.seo.twitterImage || ''}
                onChange={(value) =>
                  updateSEO({ twitterImage: value as string })
                }
              />
              <Input
                id="twitter-image"
                value={settings.seo.twitterImage || ''}
                onChange={(e) =>
                  updateSEO({ twitterImage: e.target.value })
                }
                placeholder="https://0xPranshu.dev/twitter-image.png"
              />
              <p className="text-xs text-muted-foreground">
                Upload to CDN or paste a direct image URL.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="icon-url">Site Icon</Label>
              <CloudinaryUpload
                value={settings.seo.iconUrl || ''}
                onChange={(value) =>
                  updateSEO({ iconUrl: value as string })
                }
                resourceType="auto"
              />
              <Input
                id="icon-url"
                value={settings.seo.iconUrl || ''}
                onChange={(e) =>
                  updateSEO({ iconUrl: e.target.value })
                }
                placeholder="https://0xPranshu.dev/favicon.svg"
              />
              <p className="text-xs text-muted-foreground">
                Upload to CDN or paste a direct icon URL.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="apple-icon-url">Apple Icon</Label>
              <CloudinaryUpload
                value={settings.seo.appleIconUrl || ''}
                onChange={(value) =>
                  updateSEO({ appleIconUrl: value as string })
                }
                resourceType="auto"
              />
              <Input
                id="apple-icon-url"
                value={settings.seo.appleIconUrl || ''}
                onChange={(e) =>
                  updateSEO({ appleIconUrl: e.target.value })
                }
                placeholder="https://0xPranshu.dev/apple-touch-icon.png"
              />
              <p className="text-xs text-muted-foreground">
                Upload to CDN or paste a direct icon URL.
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
                  updateAdvanced({
                    cacheDuration: Number.parseInt(e.target.value) || 0,
                  })
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="debug-mode">Debug Mode</Label>
                <p className="text-sm text-muted-foreground">
                  Enable debugging features (for development only)
                </p>
              </div>
              <Switch
                id="debug-mode"
                checked={settings.advanced.debugMode}
                onCheckedChange={(checked) =>
                  updateAdvanced({ debugMode: checked })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="export-data">Export Data</Label>
              <Button variant="outline" className="w-full">
                Export Portfolio Data (JSON)
              </Button>
              <p className="text-xs text-muted-foreground">
                Download all your portfolio data as JSON
              </p>
            </div>

            <div className="space-y-2">
              <Label className="text-destructive">Danger Zone</Label>
              <Button variant="destructive" className="w-full">
                Reset All Settings to Default
              </Button>
              <p className="text-xs text-muted-foreground">
                This action cannot be undone
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
