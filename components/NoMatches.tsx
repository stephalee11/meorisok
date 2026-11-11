import { Button } from "./Button";
import { EmptyState } from "./EmptyState";

export function NoMatches({ onClear }: { onClear: () => void }) {
  return (
    <EmptyState
      title="no tickets match."
      body="try fewer filters."
      action={
        <Button variant="secondary" size="sm" onClick={onClear}>
          clear filters
        </Button>
      }
    />
  );
}
