"use client";
import React, { useState } from "react";
import PlusIcon from "@/components/misc/PlusIcon";
import MinusIcon from "@/components/misc/MinusIcon";
import { useAuthStore } from "@/stores/AuthStore";
import Image from "next/image";

export default function Home() {
  const [matrix, setMatrix] = useState([[""]]);
  const setLoading = useAuthStore((state) => state.setLoading);

  const addColumn = () => {
    if (matrix[0].length < 5) {
      setMatrix(matrix.map((row) => [...row, ""]));
    }
  };

  const removeColumn = () => {
    if (matrix[0].length > 1) {
      setMatrix(matrix.map((row) => row.slice(0, -1)));
    }
  };

  const addRow = () => {
    if (matrix.length < 5) {
      setMatrix([...matrix, new Array(matrix[0].length).fill("")]);
    }
  };

  const removeRow = () => {
    if (matrix.length > 1) {
      setMatrix(matrix.slice(0, -1));
    }
  };

  const handleInputChange = (
    rowIndex: number,
    colIndex: number,
    value: string
  ) => {
    const newMatrix = [...matrix];
    newMatrix[rowIndex][colIndex] = value;
    setMatrix(newMatrix);
  };

  const testLoading = () => {
    console.log("test");
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      console.log("test2");
    }, 10000);
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-24 bg-gray-200">
      <div>
        <div className="grid grid-flow-col-dense">
          {matrix.map((row, rowIndex) => (
            <div key={rowIndex} className="flex flex-col">
              {row.map((col, colIndex) => (
                <div key={colIndex} className="relative m-2">
                  <Image src="/images/plus.svg" alt="Pictureboard" />
                  <p className="p-2 border-2 border-gray-300">{col}</p>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
