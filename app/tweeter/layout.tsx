export default function TweeterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex justify-center items-center min-h-screen bg-black text-white md:p-4 font-sans">
      <div className="max-w-3xl w-full">{children}</div>
    </div>
  );
}
