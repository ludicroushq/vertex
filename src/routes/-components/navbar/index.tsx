import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { Menu as MenuIcon } from "lucide-react";
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
  items: MenuItem[];
  onNavigate?: () => void;
};

type NavbarProps = {
  isAuthenticated: boolean;
};

export function Navbar({ isAuthenticated }: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
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
            <Menu isAuthenticated={isAuthenticated} items={menuItems} />
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
                  items={menuItems}
                  onNavigate={() => {
                    setIsMenuOpen(false);
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
  items,
  onNavigate,
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
        <Button asChild className={buttonClassName} size="sm" variant="ghost">
          <Link preload={false} to="/sign-out" onClick={onNavigate}>
            Sign Out
          </Link>
        </Button>
      ) : (
        <Button asChild className={buttonClassName} size="sm">
          <Link preload={false} to="/get-started" onClick={onNavigate}>
            Get Started
          </Link>
        </Button>
      )}
    </>
  );
}
