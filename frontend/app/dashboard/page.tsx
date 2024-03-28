import Link from "next/link";
import Image from "next/image";

export default function Page() {
  return (
    <>
      <div>
        <div className="relative pl-0 mt-10 ml-0">
          <Link href="/" >
            <Image src="/IntelliSpace.png" alt="logo" width={30} height={30} className="w-8 h-8 ml-3 cursor-pointer" />
          </Link>
        </div>
      </div>
    </>
  )
}
