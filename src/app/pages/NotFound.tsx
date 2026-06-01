import { Link } from "react-router";
import { Button } from "../components/ui/Button";
import { Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary px-4">
      <div className="text-center">
        <h1 className="text-9xl mb-4">404</h1>
        <h2 className="text-3xl mb-4">Page Not Found</h2>
        <p className="text-muted-foreground mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link to="/">
          <Button size="lg">
            <Home className="w-5 h-5" />
            Go to Homepage
          </Button>
        </Link>
      </div>
    </div>
  );
}
