export function PageHeader({
  eyebrow,
  title,
  action,
}: {
  eyebrow?: string;
  title: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4 border-b border-line pb-6">
      <div>
        {eyebrow ? <span className="label-mono">{eyebrow}</span> : null}
        <h1 className="mt-1 font-display text-2xl font-extrabold tracking-tight sm:text-3xl">
          {title}
        </h1>
      </div>
      {action}
    </div>
  );
}
