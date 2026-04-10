export default function GlobalLoading() {
  return (
    <div className="container mx-auto mt-24 mb-20 px-4">
      <div className="space-y-4 animate-pulse">
        <div className="h-8 w-56 rounded-md bg-muted" />
        <div className="h-6 w-80 rounded-md bg-muted" />
        <div className="h-40 w-full rounded-xl bg-muted" />
      </div>
    </div>
  );
}
