import React, { useState } from 'react';
import { Coins, X, RefreshCw, Heart } from 'lucide-react';
import confetti from 'canvas-confetti';

interface CoinTossModalProps {
  isOpen: boolean;
  onClose: () => void;
  optionA: string;
  optionB: string;
}

export const CoinTossModal: React.FC<CoinTossModalProps> = ({
  isOpen,
  onClose,
  optionA,
  optionB,
}) => {
  const [flipping, setFlipping] = useState<boolean>(false);
  const [result, setResult] = useState<'A' | 'B' | null>(null);
  const [rotation, setRotation] = useState<number>(0);

  if (!isOpen) return null;

  const handleFlip = () => {
    if (flipping) return;
    setFlipping(true);
    setResult(null);

    // Pick random winner
    const picked: 'A' | 'B' = Math.random() < 0.5 ? 'A' : 'B';
    const extraSpins = 5 + Math.floor(Math.random() * 4);
    const finalAngle = extraSpins * 360 + (picked === 'A' ? 0 : 180);

    setRotation((prev) => prev + finalAngle);

    setTimeout(() => {
      setResult(picked);
      setFlipping(false);
      confetti({
        particleCount: 60,
        spread: 65,
        origin: { y: 0.7 },
      });
    }, 1800);
  };

  const winningOption = result === 'A' ? optionA : optionB;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-lg w-full shadow-2xl p-6 sm:p-8 space-y-6 text-center">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3 text-left">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 flex items-center justify-center">
              <Coins className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">
                The Subconscious Coin Test
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">
                Reveals your true subconscious preference
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* The Psychological Insight Box */}
        <div className="p-4 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-2xl text-left">
          <div className="flex items-start gap-3">
            <Heart className="w-5 h-5 text-rose-500 mt-0.5 shrink-0" />
            <p className="text-xs sm:text-sm text-amber-950 dark:text-amber-100 leading-relaxed font-medium">
              <strong className="font-extrabold">The Golden Rule of the Coin:</strong> While the coin is spinning in mid-air, notice what outcome your heart is hoping for. That feeling is your real answer.
            </p>
          </div>
        </div>

        {/* Competing Sides */}
        <div className="grid grid-cols-2 gap-3 text-xs sm:text-sm">
          <div className="p-4 rounded-2xl border-2 border-indigo-200 dark:border-indigo-900 bg-indigo-50/60 dark:bg-indigo-950/30 text-left space-y-1">
            <span className="text-xs uppercase font-extrabold text-indigo-700 dark:text-indigo-400 font-mono">
              Heads = Option A
            </span>
            <p className="font-bold text-slate-900 dark:text-white truncate">
              {optionA}
            </p>
          </div>
          <div className="p-4 rounded-2xl border-2 border-purple-200 dark:border-purple-900 bg-purple-50/60 dark:bg-purple-950/30 text-left space-y-1">
            <span className="text-xs uppercase font-extrabold text-purple-700 dark:text-purple-400 font-mono">
              Tails = Option B
            </span>
            <p className="font-bold text-slate-900 dark:text-white truncate">
              {optionB}
            </p>
          </div>
        </div>

        {/* 3D Coin Animation */}
        <div className="py-6 flex flex-col items-center justify-center">
          <div
            style={{
              perspective: 1000,
            }}
          >
            <div
              className={`w-36 h-36 rounded-full border-4 border-amber-300 bg-gradient-to-br from-amber-300 via-amber-400 to-amber-600 text-white font-extrabold text-2xl flex items-center justify-center shadow-2xl shadow-amber-500/25 transition-transform ${
                flipping ? 'duration-[1800ms] ease-out' : 'duration-300'
              }`}
              style={{
                transform: `rotateY(${rotation}deg)`,
                transformStyle: 'preserve-3d',
              }}
            >
              <div className="flex flex-col items-center">
                <Coins className="w-10 h-10 text-amber-100" />
                <span className="text-base font-mono mt-1 text-amber-950 font-black">
                  {result ? (result === 'A' ? 'HEADS' : 'TAILS') : 'FLIP ME'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Result Message */}
        {result && !flipping && (
          <div className="p-5 bg-slate-950 text-white rounded-2xl space-y-2 animate-in zoom-in-95 duration-200 border border-slate-800">
            <span className="text-xs text-amber-400 font-mono font-extrabold uppercase tracking-wider block">
              Coin Landed on {result === 'A' ? 'Heads (Option A)' : 'Tails (Option B)'}
            </span>
            <p className="text-base font-extrabold text-white">
              {winningOption}
            </p>
            <p className="text-sm text-slate-300 italic pt-1 leading-relaxed">
              Did you feel a sense of relief, or did you secretly wish it had landed on the other side?
            </p>
          </div>
        )}

        {/* Action Button */}
        <div className="pt-2 flex items-center justify-center gap-3">
          <button
            onClick={handleFlip}
            disabled={flipping}
            className="px-7 py-3.5 text-sm font-bold uppercase tracking-wider text-white bg-amber-500 hover:bg-amber-600 active:bg-amber-700 disabled:opacity-50 rounded-xl shadow-lg shadow-amber-500/30 transition-all flex items-center gap-2.5 cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${flipping ? 'animate-spin' : ''}`} />
            <span>{flipping ? 'Coin is in the air...' : result ? 'Flip Again' : 'Toss The Coin'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
