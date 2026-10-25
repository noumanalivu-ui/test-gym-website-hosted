// src/components/SectionHeading.jsx
// Reusable section title: <SectionHeading id="x" title="Our" highlight="Values" description="..." />
export default function SectionHeading({
  id,
  title,
  highlight,
  description,
  align = "left", // "left" | "center"
  as: Tag = "h2",
  className = "",
}) {
  const center = align === "center";

  return (
    <header className={`space-y-3 ${center ? "mx-auto text-center" : ""} ${className}`}>
      <Tag
        id={id}
        className="font-display text-3xl font-bold leading-[1.15] tracking-tight text-text-primary sm:text-4xl lg:text-5xl"
      >
        {title}
        {highlight && <> <span className="text-brand-primary">{highlight}</span></>}
      </Tag>
      {description && (
        <p className={`max-w-2xl text-base leading-relaxed text-text-secondary ${center ? "mx-auto" : ""}`}>
          {description}
        </p>
      )}
    </header>
  );
}