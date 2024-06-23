import React from "react";
import Image from "next/image";
import Link from "next/link";

const AppLogo = () => {
  return (
    <Link href="/">
      <div className="flex items-center justify-center">
        <Image
          width={0}
          height={0}
          src="/Logo.svg"
          alt="Logo"
          style={{ width: '300px', height: "auto" }}
        />
      </div>
    </Link>
  );
};

export default AppLogo;
