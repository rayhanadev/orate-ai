export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="m-auto flex h-dvh w-[300px] flex-col items-start justify-center">
      {children}
    </div>
  );
}
