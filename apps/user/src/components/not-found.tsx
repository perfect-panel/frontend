import { Link } from "@tanstack/react-router";
import { Button } from "@workspace/ui/components/button";

export function NotFound() {
  return (
    <main className="flex min-h-[70vh] items-center justify-center p-6">
      <div className="mx-auto w-full max-w-md text-center">
        <div className="mb-2 font-semibold text-3xl">404</div>
        <p className="mb-6 text-muted-foreground">
          The page you’re looking for doesn’t exist.
        </p>
        <div className="flex flex-col justify-center gap-3 sm:flex-row">
          <Button asChild variant="default">
            <Link to="/">Go Home</Link>
          </Button>
          <Button asChild variant="secondary">
            <Link to="/auth">Sign in</Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
