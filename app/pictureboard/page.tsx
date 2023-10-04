"use client";
import React, { useState } from "react";
import Submit from "@/components/pictureboard/Submit";

import { useAuthStore } from "@/stores/AuthStore";
import { Sub } from "@radix-ui/react-navigation-menu";
import axios from 'axios';

async function fetchImage(prompt: string) {
  try {
    const response = await axios.post('https://your-project-name.vercel.app/api/openai', {
      prompt: prompt
    });
    return response.data; // returning the data
  } catch (error) {
    console.error('Error fetching image for prompt:', prompt, error);
    return null; // or some error indicator
  }
}


export default function Home() {
  const [matrix, setMatrix] = useState([[""]]);
  const [images, setImages] = useState<any[][]>([[]]);
  const setLoading = useAuthStore((state) => state.setLoading);
  const handleFetchImages = async () => {
    setLoading(true);

    // map over the matrix to create a 2D array of promises
    const imagePromises = matrix.map(row => 
      Promise.all(row.map(item => fetchImage(item))) // for each item in the row, call fetchImage
    );

    // wait for all promises to resolve
    const newImages = await Promise.all(imagePromises);
    
    // set the images state
    setImages(newImages);

    setLoading(false);
  }

  


  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-24 bg-gray-200">
      <div>
        <Submit matrix={matrix} setMatrix={setMatrix} />

        <div className="flex justify-center mt-8">
          <button className="px-4 py-2 text-white bg-primary-teal rounded hover:bg-teal-500" onClick={handleFetchImages}>
            Submit
          </button>
        </div>
        {images.map((row, rowIndex) => (
        <div key={rowIndex} className="image-row">
          {row.map((image, imageIndex) => (
            <img key={imageIndex} src={image} alt={`Image ${rowIndex}-${imageIndex}`} />
          ))}
        </div>
      ))}
      </div>
    </main>
  );
}
