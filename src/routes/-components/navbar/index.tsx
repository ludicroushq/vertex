import { useMutation } from "@tanstack/react-query";
import { Link, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { Menu as MenuIcon } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { appName } from "@/lib/config";

type MenuItem = {
  title: string;
  to: "/" | "/app";
};

type MenuProps = {
  buttonClassName?: string;
  isAuthenticated: boolean;
  isSigningOut: boolean;
  items: MenuItem[];
  onNavigate?: () => void;
  onSignOut: () => void;
};

type NavbarProps = {
  isAuthenticated: boolean;
};

export function Navbar({ isAuthenticated }: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();
  const signOutMutation = useMutation({
    async mutationFn() {
      await authClient.signOut();
      await router.navigate({ to: "/" });
    },
  });
  const menuItems: MenuItem[] = isAuthenticated
    ? [{ title: "Dashboard", to: "/app" }]
    : [{ title: "Home", to: "/" }];

  return (
    <header className="border-b py-4">
      <div className="container mx-auto">
        <nav className="flex items-center justify-between gap-4">
          <Link
            className="font-bold text-xl"
            to={isAuthenticated ? "/app" : "/"}
          >
            {appName}
          </Link>

          <div className="hidden items-center gap-2 md:flex">
            <Menu
              isAuthenticated={isAuthenticated}
              isSigningOut={signOutMutation.isPending}
              items={menuItems}
              onSignOut={() => {
                signOutMutation.mutate();
              }}
            />
          </div>

          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger asChild>
              <Button
                aria-label="Toggle menu"
                className="md:hidden"
                size="icon"
                variant="ghost"
              >
                <MenuIcon />
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetHeader>
                <SheetTitle>{appName}</SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-2 px-2">
                <Menu
                  buttonClassName="w-full justify-start"
                  isAuthenticated={isAuthenticated}
                  isSigningOut={signOutMutation.isPending}
                  items={menuItems}
                  onNavigate={() => {
                    setIsMenuOpen(false);
                  }}
                  onSignOut={() => {
                    setIsMenuOpen(false);
                    signOutMutation.mutate();
                  }}
                />
              </div>
            </SheetContent>
          </Sheet>
        </nav>
      </div>
    </header>
  );
}

function Menu({
  buttonClassName,
  isAuthenticated,
  isSigningOut,
  items,
  onNavigate,
  onSignOut,
}: MenuProps) {
  return (
    <>
      {items.map((item) => (
        <Button
          key={item.title}
          asChild
          className={buttonClassName}
          size="sm"
          variant="ghost"
        >
          <Link to={item.to} onClick={onNavigate}>
            {item.title}
          </Link>
        </Button>
      ))}

      {isAuthenticated ? (
        <Button
          className={buttonClassName}
          disabled={isSigningOut}
          size="sm"
          type="button"
          variant="ghost"
          onClick={onSignOut}
        >
          Sign Out
        </Button>
      ) : (
        <Button asChild className={buttonClassName} size="sm">
          <Link to="/get-started" onClick={onNavigate}>
            Get Started
          </Link>
        </Button>
      )}
    </>
  );
}
