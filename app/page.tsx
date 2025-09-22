import Snakegrid from "@/components/Snakegrid";

import { FaXTwitter } from "react-icons/fa6";
export default function Home() {
  return (
    <div className="container flex-wrap mx-auto text-center flex flex-col">
      <Snakegrid />

      <div className="flex w-full items-end cursor-pointer justify-end  text-right mt-[5%] ">
        <a
          href="https://x.com/haakimii__"
          className="rounded-2xl py-4 px-5 text-white  bg-gradient-to-r from-[#3673f5] to-[#4F9CFD] font-bold text-[16px] flex items-center gap-2"
        >
          <FaXTwitter className="text-xl" />
          Hakimi
        </a>
      </div>
    </div>
  );
}
