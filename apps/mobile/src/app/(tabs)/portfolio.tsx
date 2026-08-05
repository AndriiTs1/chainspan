import { AppText } from '@/components/ui/app-text';
import { Card } from '@/components/ui/card';
import { Screen } from '@/components/ui/screen';

export default function PortfolioScreen() {
  return (
    <Screen>
      <AppText variant="heading">Portfolio</AppText>
      <Card>
        <AppText variant="body" color="secondary">
          Portfolio integration will be added in Stage 8.4.
        </AppText>
      </Card>
    </Screen>
  );
}
