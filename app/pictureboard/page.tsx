"use client";
import React, { useState } from "react";

import { useAuthStore } from "@/stores/AuthStore";


export default function Home() {
  const [matrix, setMatrix] = useState([[""]]);
  const setLoading = useAuthStore((state) => state.setLoading);

  

  

  const testLoading = () => {
    console.log("test");
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      console.log("test2");
    }, 10000);
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-24 bg-gray-200">
      <div>
        

        <div className="flex justify-center mt-8">
          <button className="px-4 py-2 text-white bg-primary-teal rounded hover:bg-teal-500" onClick={testLoading}>
            Submit
          </button>
        </div>
      </div>
    </main>
  );
}
