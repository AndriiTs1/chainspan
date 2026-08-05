import { AppText } from '@/components/ui/app-text';
import { Card } from '@/components/ui/card';
import { Screen } from '@/components/ui/screen';

// "Explorer" is the tab-level name (see Stage 8.1 architecture update);
// Contract Inspector is its first feature, added in Stage 8.6. Keeping the
// tab name stable now avoids a rename later when NFT/Transactions/ENS join it.
export default function ExplorerScreen() {
  return (
    <Screen>
      <AppText variant="heading">Explorer</AppText>
      <Card>
        <AppText variant="body" color="secondary">
          Contract Inspector integration will be added in Stage 8.6.
        </AppText>
      </Card>
    </Screen>
  );
}
