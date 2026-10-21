import Brand from '../components/Brand';

export default function AuthShell({ title, subtitle, children, footer }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-[1fr_1.1fr]">
      <aside className="hidden flex-col justify-between bg-forest p-10 text-cream lg:flex">
        <Brand light />
        <div>
          <p className="font-heading text-4xl font-semibold leading-tight">Every lost thing has someone looking for it.</p>
          <p className="mt-4 max-w-sm text-leaf">Report, match, verify and return, all in one place.</p>
        </div>
        <span className="text-sm text-leaf/80">REFOUND</span>
      </aside>
      <main className="flex items-center justify-center px-5 py-10">
        <div className="w-full max-w-md">
          <div className="mb-8 lg:hidden"><Brand /></div>
          <h1 className="text-3xl font-semibold">{title}</h1>
          <p className="mb-6 mt-1 text-forest/70">{subtitle}</p>
          {children}
          <div className="mt-6 text-sm text-forest/70">{footer}</div>
        </div>
      </main>
    </div>
  );
}
