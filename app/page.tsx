"use client";
import React, { useState } from "react";
import PlusIcon from "@/components/misc/PlusIcon";
import MinusIcon from "@/components/misc/MinusIcon";

export default function Home() {
  const [matrix, setMatrix] = useState([[""]]);

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

  const handleInputChange = (rowIndex, colIndex, value) => {
    const newMatrix = [...matrix];
    newMatrix[rowIndex][colIndex] = value;
    setMatrix(newMatrix);
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-24 bg-gray-200">
      <div className="grid grid-flow-col-dense">
        {matrix.map((row, rowIndex) => (
          <div key={rowIndex} className="flex flex-col">
            {row.map((col, colIndex) => (
              <div key={colIndex} className="relative m-2">
                <input
                  type="text"
                  value={col}
                  onChange={(e) =>
                    handleInputChange(rowIndex, colIndex, e.target.value)
                  }
                  className="p-2 border-2 border-gray-300"
                />
              </div>
            ))}
            <button
              onClick={ removeRow}
              className="self-center mt-2"
            >
               <MinusIcon /> 
            </button>
            <button
              onClick={addRow}
              className="self-center mt-2"
            >
              {matrix.length < 5 ? <PlusIcon /> : <MinusIcon />}
            </button>
          </div>
        ))}
        <button
          onClick={matrix[0].length < 5 ? addColumn : removeColumn}
          className="self-start ml-2 mt-10"
        >
          {matrix[0].length < 5 ? <PlusIcon /> : <MinusIcon />}
        </button>
      </div>
    </main>
  );
}
