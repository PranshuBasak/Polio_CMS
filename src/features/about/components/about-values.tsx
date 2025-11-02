import { Card, CardContent } from '@/components/ui/card';
import { useTranslations } from '@/lib/i18n/translations-context';
import type { AboutValue as AboutValueType } from '@/lib/types';
import {
  Award,
  Compass,
  Heart,
  Lightbulb,
  Shield,
  Star,
  Target,
  Zap,
} from 'lucide-react';

/**
 * About Values - Presentational Component
 *
 * Displays core values and mission statement
 */
interface AboutValuesProps {
  values: AboutValueType[];
  mission: string;
}

export function AboutValues({ values, mission }: AboutValuesProps) {
  const { t } = useTranslations();

  const getIconComponent = (iconName: string) => {
    const iconMap: Record<string, typeof Heart> = {
      Heart,
      Target,
      Lightbulb,
      Star,
      Zap,
      Award,
      Compass,
      Shield,
    };
    return iconMap[iconName] || Heart;
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {values.map((value) => {
          const IconComponent = getIconComponent(value.icon);
          return (
            <Card
              key={value.id}
              className="border border-border hover:border-primary/50 transition-all"
            >
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <IconComponent className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">{value.title}</h3>
                <p className="text-muted-foreground">{value.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="mt-8 p-6 bg-muted/30 rounded-lg">
        <h3 className="text-xl font-bold mb-4">{t('about.mission.title')}</h3>
        <p className="text-lg">{mission}</p>
      </div>
    </>
  );
}
