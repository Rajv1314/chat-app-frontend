import React from 'react'

export default function AuthImagePatten({title,subtitle}) {
  return (
    <div className="hidden md:flex items-center justify-center bg-base-200 p-12 mt-5">
    <div className="max-w-md text-center">
      <div className="grid grid-cols-3 gap-3 mb-8">
        {[...Array(9)].map((_, i) => (
          <div
            key={i}
            className={`aspect-square rounded-2xl bg-primary/10 hover:bg-primary/50 ${
              i % 2 === 0 ? "animate-pulse" : ""
            }`}
          />
        ))}
      </div>
      <h2 className="text-2xl font-bold mb-4">{title}</h2>
      <p className="text-base-content/60">{subtitle}</p>
    </div>
  </div>
  )
}
