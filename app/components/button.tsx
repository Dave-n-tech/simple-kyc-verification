'use client'

export default function Button({ children, onClick, className }: { children: React.ReactNode; onClick: () => void; className?: string }) {
  return (
    <button
      onClick={onClick}
      className={`cursor-pointer w-full bg-black text-white py-2 rounded ${className}`}
    >
      {children}
    </button>
  );
}
