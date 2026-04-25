import Image from "next/image";

export default function TweeterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className={"hidden md:block"}>
        <Image
          className={"absolute m-10"}
          alt="logo"
          src="/assets/qrcode.png"
          width={100}
          height={100}
        />
      </div>
      <div className="flex justify-center items-center min-h-screen bg-black text-white md:p-4 font-sans">
        <div className="max-w-3xl w-full">{children}</div>
      </div>
    </>
  );
}
