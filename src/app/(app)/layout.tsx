export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="m-auto flex h-dvh w-[500px] flex-col items-start justify-start py-24">
      {children}
    </div>
  );
}
