import { ViewTransition } from "react";

/**
 * Wraps a page so navigating between the ledger's tabs turns the page:
 * forward = the old page lifts away to the left; back = the previous page swings back in.
 */
export default function PageTurn({ children }: { children: React.ReactNode }) {
  return (
    <ViewTransition
      enter={{ "turn-fwd": "turn-fwd", "turn-back": "turn-back", default: "none" }}
      exit={{ "turn-fwd": "turn-fwd", "turn-back": "turn-back", default: "none" }}
      default="none"
    >
      <div>{children}</div>
    </ViewTransition>
  );
}
