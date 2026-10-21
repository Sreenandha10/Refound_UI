
export default function PageHeader({ title, subtitle, children }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 className="text-3xl font-semibold">{title}</h1>
        {subtitle && <p className="mt-1 text-forest/70">{subtitle}</p>}
      </div>
      {children && <div className="flex flex-wrap gap-2">{children}</div>}
    </div>
  );
}

export const Empty = ({ children }) => (
  <div className="rounded-2xl border border-dashed border-forest/25 bg-mist/40 p-10 text-center text-forest/70">{children}</div>
);

export const Spinner = () => (
  <div className="flex justify-center p-10" role="status" aria-label="Loading">
    <div className="h-7 w-7 animate-spin rounded-full border-2 border-leaf border-t-forest" />
  </div>
);
