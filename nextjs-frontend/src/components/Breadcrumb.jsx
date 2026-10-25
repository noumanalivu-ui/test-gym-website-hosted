import Link from "next/link";
import { Home, ChevronRight } from "lucide-react";

// One level:  <Breadcrumb items={[{ label: "Contact Us", href: "/contact" }]} />
// Two levels: <Breadcrumb items={[{ label: "Services", href: "/services" }, { label: "SEO", href: "/services/seo" }]} />
// Left aligned: <Breadcrumb cssClassName="justify-start" items={[...]} />

export default function Breadcrumb({ items = [], cssClassName = "justify-center" }) {
  const crumbs = [{ label: "Home", href: "/" }, ...(items ?? [])];
  const alignClass = cssClassName === "justify-start" ? "justify-start" : "justify-center";

  return (
    <nav aria-label="Breadcrumb" className={`flex w-full ${alignClass}`}>
      <ol
        className="mb-5 inline-flex flex-wrap items-center gap-y-1 rounded-full border border-border bg-surface px-4 py-2 shadow-sm"
        itemScope
        itemType="https://schema.org/BreadcrumbList"
      >
        {crumbs.map((crumb, i) => {
          const isLast = i === crumbs.length - 1;
          const isHome = i === 0;

          return (
            <li
              key={crumb?.href ?? i}
              className="flex items-center"
              itemProp="itemListElement"
              itemScope
              itemType="https://schema.org/ListItem"
            >
              {isHome ? (
                <Link
                  href={crumb?.href}
                  itemProp="item"
                  className="flex items-center gap-1.5 rounded text-sm text-text-secondary transition-colors duration-150 hover:text-text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary"
                >
                  <Home className="h-[14px] w-[14px] shrink-0" aria-hidden="true" strokeWidth={1.8} />
                  <span itemProp="name">{crumb?.label}</span>
                </Link>
              ) : isLast ? (
                <span aria-current="page" itemProp="name" className="text-sm font-semibold text-text-primary">
                  {crumb?.label}
                </span>
              ) : (
                <Link
                  href={crumb?.href}
                  itemProp="item"
                  className="rounded text-sm text-text-secondary transition-colors duration-150 hover:text-text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary"
                >
                  <span itemProp="name">{crumb?.label}</span>
                </Link>
              )}

              {!isLast && (
                <ChevronRight className="mx-1.5 h-3.5 w-3.5 shrink-0 text-text-secondary" aria-hidden="true" strokeWidth={2} />
              )}

              <meta itemProp="position" content={String(i + 1)} />
            </li>
          );
        })}
      </ol>
    </nav>
  );
}