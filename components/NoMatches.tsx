import { Button } from "./Button";
import { EmptyState } from "./EmptyState";

export function NoMatches({ onClear }: { onClear: () => void }) {
  return (
    <EmptyState
      title="No tickets match."
      body="Try fewer filters."
      action={
        <Button variant="secondary" size="sm" onClick={onClear}>
          Clear filters
        </Button>
      }
    />
  );
}
