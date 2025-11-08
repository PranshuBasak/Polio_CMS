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
              className="border border-border hover:border-primary/50 transition-all duration-300 card-hover"
            >
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mb-4 transition-transform duration-300 hover:scale-110">
                  <IconComponent className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">{value.title}</h3>
                <p className="text-muted-foreground">{value.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="mt-8 p-8 bg-gradient-to-br from-primary/5 via-accent/5 to-primary/5 rounded-xl border border-primary/10 shadow-lg">
        <h3 className="text-xl font-bold mb-4 gradient-text">{t('about.mission.title')}</h3>
        <p className="text-lg leading-relaxed">{mission}</p>
      </div>
    </>
  );
}
