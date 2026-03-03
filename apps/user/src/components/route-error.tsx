import { Link } from "@tanstack/react-router";
import { Button } from "@workspace/ui/components/button";

export function RouteError({ error }: { error: unknown }) {
  const message =
    error instanceof Error ? error.message : "Something went wrong.";

  return (
    <main className="flex min-h-[70vh] items-center justify-center p-6">
      <div className="mx-auto w-full max-w-lg">
        <h1 className="mb-2 font-semibold text-2xl">Unexpected error</h1>
        <p className="mb-4 text-muted-foreground">{message}</p>
        <div className="flex flex-wrap gap-3">
          <Button asChild variant="default">
            <Link to="/">Go Home</Link>
          </Button>
          <Button
            onClick={() => {
              if (typeof window !== "undefined") window.location.reload();
            }}
            type="button"
            variant="secondary"
          >
            Reload
          </Button>
        </div>
      </div>
    </main>
  );
}
