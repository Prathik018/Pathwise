export default function MainLoading() {
  return (
    <div className="container mx-auto mt-24 mb-20">
      <div className="space-y-4 animate-pulse">
        <div className="h-8 w-48 rounded-md bg-muted" />
        <div className="h-28 w-full rounded-lg bg-muted" />
        <div className="h-28 w-full rounded-lg bg-muted" />
      </div>
    </div>
  );
}
