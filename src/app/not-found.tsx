import Link from "next/link";
import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <Container className="py-24 text-center">
      <h1 className="text-4xl text-charcoal">Page not found</h1>
      <p className="mx-auto mt-3 max-w-md text-stone">
        This page does not exist yet or the link is wrong. Go back to the home
        page to continue.
      </p>
      <div className="mt-8 flex justify-center">
        <Button asChild>
          <Link href="/">Back to home</Link>
        </Button>
      </div>
    </Container>
  );
}
