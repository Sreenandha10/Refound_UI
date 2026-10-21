const steps = [['REPORTED', 'Reported'], ['POTENTIAL_MATCH', 'Potential match'], ['UNDER_CLAIM', 'Under claim'], ['RECOVERED', 'Recovered']];

export default function RecoveryTrack({ status }) {
  const current = steps.findIndex(([k]) => k === status);
  return (
    <ol className="grid grid-cols-4 gap-1 text-center text-xs" aria-label="Recovery progress">
      {steps.map(([key, label], i) => (
        <li key={key} aria-current={i === current ? 'step' : undefined}>
          <div className={`mb-1.5 h-1.5 rounded-full ${i <= current ? 'bg-moss' : 'bg-mist'}`} />
          <span className={i === current ? 'font-semibold' : 'text-forest/60'}>{label}</span>
        </li>
      ))}
    </ol>
  );
}
