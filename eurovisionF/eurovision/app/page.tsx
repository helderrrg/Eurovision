"use client";

import { useState, useEffect } from "react";

interface Odd {
  country: string;
  odd: string;
}

export default function Home() {
  const [odds, setOdds] = useState<Odd[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOdds = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}`);
        if (!response.ok) {
          throw new Error("Error searching for API information");
        }
        const data = await response.json();
        setOdds(data);
      } catch (err) {
        setError("Not able to load the odds. Try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchOdds();
  }, []);

  if (loading) {
    return <div className="text-center text-lg font-semibold p-5 text-black">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 font-semibold p-5 text-black">{error}</div>;
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-center mb-4 text-black">Eurovision 2025 Odds</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 shadow-lg rounded-lg">
          <thead>
            <tr className="bg-gray-300 text-black">
              <th className="py-2 px-4 border-b">Position</th>
              <th className="py-2 px-4 border-b">Country</th>
              <th className="py-2 px-4 border-b">Winning Probability (%)</th>
            </tr>
          </thead>
          <tbody>
            {odds.map((item, index) => (
              <tr
                key={index}
                className={
                  index % 2 === 0 ? "bg-gray-100 text-black" : "bg-white text-black"
                }
              >
                <td className="py-2 px-4 border-b text-center">{`${index + 1}º`}</td>
                <td className="py-2 px-4 border-b text-center">{item.country}</td>
                <td className="py-2 px-4 border-b text-center font-semibold">{item.odd}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
