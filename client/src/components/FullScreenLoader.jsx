export default function FullScreenLoader() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-80">
      <div className="text-blue-600 font-semibold text-lg animate-pulse">
        Loading...
      </div>
    </div>
  );
}
