"use client"

export default function Loading() {
    return (
        <div className="fixed inset-0 bg-black flex items-center justify-center">
            <div className="w-16 h-[2px] bg-primary relative overflow-hidden">
                <div className="absolute inset-0 bg-white animate-[loading_1.5s_infinite]"></div>
            </div>
            <style jsx>{`
        @keyframes loading {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
        </div>
    )
}
