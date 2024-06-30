export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-[300px] h-dvh m-auto flex flex-col items-start justify-center">
      {children}
    </div>
  );
}
