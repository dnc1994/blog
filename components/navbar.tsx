"use client";

import cn from "clsx";
import { usePathname } from "next/navigation";
import Link from "next/link";
import ThemeToggle from "@/components/theme-toggle";

const items = [
  { href: "/", label: "about" },
  { href: "/posts", label: "posts" },
  { href: "/projects", label: "projects" },
  { href: "/lists", label: "curation" },
];

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(href + "/");
}

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className="flex flex-wrap items-center justify-between gap-x-8 gap-y-3 py-5 border-b border-rurikon-border font-mono text-[13px] leading-none">
      <Link
        href="/"
        className="flex items-center gap-2.5 font-bold tracking-[0.1em] text-rurikon-600 hover:text-rurikon-accent transition-colors"
        draggable={false}
      >
        <span
          aria-hidden="true"
          className="pulse-dot inline-block h-2 w-2 rounded-full bg-rurikon-accent"
        />
        LINGHAO.IO
      </Link>

      <nav aria-label="Main" className="order-3 w-full sm:order-none sm:w-auto">
        <ul className="flex flex-wrap gap-x-5 gap-y-1">
          {items.map((item, i) => {
            const active = isActive(pathname, item.href);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  draggable={false}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "inline-block py-2 transition-colors",
                    active
                      ? "text-rurikon-accent"
                      : "text-rurikon-400 hover:text-rurikon-600",
                  )}
                >
                  <span className={cn(active ? "text-rurikon-accent" : "text-rurikon-300")}>
                    0x0{i}
                  </span>{" "}
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="flex items-center gap-4">
        <div id="music-player-slot" className="hidden mobile:flex" />
        <ThemeToggle />
      </div>
    </header>
  );
}
