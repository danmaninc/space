"use client";
import Image from 'next/image'
import {Canvas} from "@/app/_components/Canvas";
import {ConnectionManager} from "@/app/_components/ConnectionManager";

export default function Home() {
  return (
      <>
        <ConnectionManager/>
        <Canvas/>
      </>
  )
}
