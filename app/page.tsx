
"use client";

import { useEffect, useState } from "react";
import { Shuffle, RotateCcw, X, Sparkles } from "lucide-react";
import { ALL_CARDS } from "@/data/cards";
import { shuffleArray } from "@/lib/shuffle";

type FortuneResult = {
  position: number;
  card: (typeof ALL_CARDS)[number];
};

export default function Home() {
  const [deck, setDeck] = useState(ALL_CARDS);
  const [numbers, setNumbers] = useState(["", "", "", "", ""]);
  const [selectedCards, setSelectedCards] = useState<FortuneResult[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [isShuffling, setIsShuffling] = useState(false);
  const [shuffleCount, setShuffleCount] = useState(0);
  const [flipped, setFlipped] = useState<number[]>([]);
  const [fortunes, setFortunes] = useState<Record<string, string>>({});
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("hwatu-card-fortunes");
      if (saved) setFortunes(JSON.parse(saved));
    } catch {
      setFortunes({});
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) {
      localStorage.setItem("hwatu-card-fortunes", JSON.stringify(fortunes));
    }
  }, [fortunes, loaded]);

  // 셔플 애니메이션
  const handleShuffle = () => {
    if (isShuffling) return;

    setIsShuffling(true);
    setSelectedCards([]);
    setFlipped([]);
    setNumbers(["", "", "", "", ""]);

    setTimeout(() => {
      setDeck(shuffleArray(ALL_CARDS));
      setShuffleCount((prev) => prev + 1);
      setIsShuffling(false);
    }, 1600);
  };

  // 번호 입력
  const handleNumberChange = (index: number, value: string) => {
    const cleaned = value.replace(/[^0-9]/g, "");

    if (cleaned.length > 2) return;
    if (cleaned && (Number(cleaned) < 1 || Number(cleaned) > 48)) return;

    setNumbers((prev) =>
      prev.map((item, i) => (i === index ? cleaned : item))
    );
  };

  // 카드 뽑기
  const handleDraw = () => {
    if (numbers.some((n) => n === "")) {
      alert("번호 5개를 모두 입력해 주세요.");
      return;
    }

    const values = numbers.map(Number);

    if (new Set(values).size !== 5) {
      alert("중복되지 않는 번호를 입력해 주세요.");
      return;
    }

    setSelectedCards(
      values.map((position) => ({
        position,
        card: deck[position - 1],
      }))
    );

    setFlipped([]);
    setShowModal(false);
  };

  const handleReset = () => {
    setDeck(ALL_CARDS);
    setNumbers(["", "", "", "", ""]);
    setSelectedCards([]);
    setFlipped([]);
    setShowModal(false);
    setShuffleCount(0);
  };

  const toggleCard = (index: number) => {
    setFlipped((prev) =>
      prev.includes(index)
        ? prev.filter((item) => item !== index)
        : [...prev, index]
    );
  };

  const handleFlipAll = () => {
    setFlipped(selectedCards.map((_, index) => index));
  };

  const updateFortune = (key: string, value: string) => {
    setFortunes((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <main className="relative h-dvh overflow-hidden bg-[#174d35] text-white">
      {/* 배경 패턴 */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.12]"
        style={{
          backgroundImage:
            "radial-gradient(#d9e9c8 0.7px, transparent 0.7px)",
          backgroundSize: "20px 20px",
        }}
      />

      <div className="relative mx-auto flex h-full w-full max-w-[1500px] flex-col gap-2 px-3 py-3 sm:px-5 sm:py-4">

        {/* 헤더 */}
        <header className="flex shrink-0 items-center justify-between border-b border-white/15 pb-2">
          <div>
            <h1 className="text-lg font-black tracking-tight sm:text-xl">
              화투점
            </h1>
            <p className="text-[8px] tracking-[0.3em] text-white/40">
              HWATU FORTUNE
            </p>
          </div>

          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 rounded-full border border-white/20 px-3 py-1.5 text-[11px] text-white/70 hover:bg-white/10"
          >
            <RotateCcw size={12} />
            초기화
          </button>
        </header>

        {/* 카드 결과 */}
        <section className="flex min-h-0 flex-1 flex-col py-2">
          <div className="mb-3 flex shrink-0 items-center justify-between">
            <div>
              <h2 className="text-base font-bold sm:text-lg">
                {selectedCards.length ? "오늘의 운명" : "운명의 다섯 장"}
              </h2>
              <p className="text-[10px] text-white/45">
                {selectedCards.length
                  ? "카드를 눌러 앞면을 확인하세요."
                  : "다섯 장의 카드를 선택하세요."}
              </p>
            </div>

            {selectedCards.length > 0 && (
              <span className="text-[10px] text-amber-200">
                {flipped.length} / 5 공개
              </span>
            )}

            {selectedCards.length > 0 && (
              <button
                onClick={handleFlipAll}
                className="rounded-lg bg-white/15 px-4 py-2 text-xs font-semibold text-white transition hover:bg-white/25"
              >
                한번에 열기
              </button>
            )}
          </div>

          {selectedCards.length > 0 ? (
            <div className="grid min-h-0 flex-1 grid-cols-5 items-start gap-1.5 sm:gap-3">
              {selectedCards.map(({ position, card }, index) => {
                const key = `${position}-${card.id}`;
                const isFlipped = flipped.includes(index);

                return (
                  <div
                    key={key}
                    className="min-w-0"
                    style={{
                      animation: `card-enter .45s ease-out ${index * 0.1}s both`,
                    }}
                  >
                    <div className="mb-1 text-center text-[9px] text-amber-100/80 sm:text-xs">
                      {index + 1}번째
                    </div>

                    {/* 뒤집기 카드 */}
                    <button
                      type="button"
                      onClick={() => toggleCard(index)}
                      aria-label={`${index + 1}번째 카드 뒤집기`}
                      className="block w-full [perspective:900px]"
                    >
                      <div
                        className="relative aspect-[3/4] w-full transition-transform duration-700 [transform-style:preserve-3d]"
                        style={{
                          transform: isFlipped
                            ? "rotateY(180deg)"
                            : "rotateY(0deg)",
                        }}
                      >
                        {/* 뒷면 */}
                        <div className="absolute inset-0 flex items-center justify-center overflow-hidden rounded-lg border-2 border-[#edc99d] bg-[#a62932] shadow-lg [backface-visibility:hidden]">
                          <div className="absolute inset-1 rounded-md border border-[#f2d7a5]/50" />
                          <div className="text-center">
                            <span className="text-2xl text-[#f5d6a5] sm:text-4xl">
                              花
                            </span>
                            <p className="mt-1 text-[6px] tracking-widest text-[#f5d6a5]/70 sm:text-[8px]">
                              HWATU
                            </p>
                          </div>
                        </div>

                        {/* 앞면 */}
                        <div className="absolute inset-0 flex flex-col overflow-hidden rounded-lg border-2 border-[#edc99d] bg-[#f3e8d0] p-1 text-[#3b2920] shadow-lg [backface-visibility:hidden] [transform:rotateY(180deg)]">
                          <div className="flex justify-between text-[7px] font-bold sm:text-[10px]">
                            <span>{card.month}월</span>
                            <span>{card.type}</span>
                          </div>

                          <div className="flex min-h-0 flex-1 items-center justify-center overflow-hidden">
                            <img
                              src={`/cards/hwatu/${String(card.id).padStart(2, "0")}.svg`}
                              alt={card.name}
                              className="h-full w-full object-contain"
                            />
                          </div>

                          <div className="truncate text-center text-[8px] font-black sm:text-[11px]">
                            {card.name}
                          </div>
                        </div>
                      </div>
                    </button>

                    {/* 운세 입력 */}
                    <textarea
                      value={fortunes[key] ?? ""}
                      onChange={(e) => updateFortune(key, e.target.value)}
                      placeholder="설명 입력"
                      maxLength={500}
                      className="mt-1.5 h-16 w-full resize-none rounded-md border border-white/15 bg-[#103c2a] p-1.5 text-[9px] leading-relaxed text-white outline-none placeholder:text-white/35 focus:border-amber-300 sm:h-20 sm:p-2 sm:text-xs"
                    />
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex min-h-0 flex-1 items-center justify-center">
              <div className="flex items-center justify-center gap-2 sm:gap-4">
                {[1, 2, 3, 4, 5].map((item) => (
                  <div
                    key={item}
                    className="flex aspect-[3/4] w-11 items-center justify-center rounded-lg border-2 border-[#edc99d] bg-[#a62932] shadow-lg sm:w-16"
                    style={{
                      transform: `rotate(${(item - 3) * 5}deg)`,
                    }}
                  >
                    <span className="text-2xl text-[#f5d6a5]">花</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* 하단 카드 뭉치 */}
        <section className="flex shrink-0 flex-col items-center border-t border-white/15 pt-2">

          <div className="mb-1 flex items-center gap-2 text-[10px] text-white/50">
            <span>카드 뭉치</span>
            <span>·</span>
            <span>{shuffleCount}회 섞음</span>
          </div>


          {/* 셔플 카드 애니메이션 */}
          <button
            type="button"
            onClick={handleShuffle}
            disabled={isShuffling}
            aria-label="카드 뭉치 섞기"
            className="relative my-2 h-[105px] w-[190px] cursor-pointer disabled:cursor-wait sm:h-[115px] sm:w-[210px]"
          >
            {Array.from({ length: 5 }).map((_, index) => {
              const offset = (index - 2) * 19;
              const angle = (index - 2) * 4;

              return (
                <div
                  key={index}
                  className={`absolute top-2 h-[78px] w-[54px] rounded-lg border-2 border-[#edc99d] bg-[#a62932] shadow-md sm:h-[88px] sm:w-[62px] ${isShuffling ? "shuffle-piece" : ""
                    }`}
                  style={{
                    left: `calc(50% + ${offset}px)`,
                    zIndex: index,
                    transform: `translateX(-50%) rotate(${angle}deg)`,
                    transformOrigin: "bottom center",
                    animationDelay: `${index * 0.07}s`,
                  }}
                >
                  <div className="absolute inset-1 rounded-md border border-[#f2d7a5]/50" />
                  <div className="absolute inset-0 flex items-center justify-center text-2xl font-black text-[#f5d6a5]">
                    花
                  </div>
                </div>
              );
            })}
          </button>

          <div className="mt-1 grid w-full max-w-sm grid-cols-2 gap-2">
            <button
              onClick={handleShuffle}
              disabled={isShuffling}
              className="flex items-center justify-center gap-2 rounded-lg border border-[#f1d2a1]/40 bg-[#a62932] py-2.5 text-xs font-bold text-[#fff0d3] transition hover:bg-[#bd353d] disabled:opacity-50"
            >
              <Shuffle size={14} />
              {isShuffling ? "섞는 중..." : "카드 섞기"}
            </button>

            <button
              onClick={() => setShowModal(true)}
              disabled={isShuffling}
              className="flex items-center justify-center gap-2 rounded-lg bg-[#f1d2a1] py-2.5 text-xs font-black text-[#452b1d] transition hover:bg-[#ffe3b5] disabled:opacity-50"
            >
              <Sparkles size={14} />
              번호 입력
            </button>
          </div>
        </section>
      </div>

      {/* 번호 입력 팝업 */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
          onClick={() => setShowModal(false)}
        >
          <div
            className="w-full max-w-xs rounded-2xl border border-[#e7c28e]/30 bg-[#17412e] p-5 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-lg font-black">번호 입력</h2>
              <button
                onClick={() => setShowModal(false)}
                className="rounded-full p-1 text-white/60 hover:bg-white/10"
              >
                <X size={19} />
              </button>
            </div>

            <div className="grid grid-cols-5 gap-2">
              {numbers.map((number, index) => (
                <div key={index}>
                  <p className="mb-2 text-center text-[9px] text-amber-200">
                    {index + 1}번
                  </p>
                  <input
                    type="number"
                    min={1}
                    max={48}
                    value={number}
                    onChange={(e) =>
                      handleNumberChange(index, e.target.value)
                    }
                    placeholder="?"
                    className="h-12 w-full rounded-lg border border-white/20 bg-[#0d3022] text-center text-lg font-bold text-amber-200 outline-none placeholder:text-white/20 focus:border-amber-300"
                  />
                </div>
              ))}
            </div>

            <p className="mt-3 text-center text-[10px] text-white/40">
              {numbers.filter(Boolean).length} / 5
            </p>

            <button
              onClick={handleDraw}
              className="mt-4 w-full rounded-lg bg-[#f1d2a1] py-3 text-sm font-black text-[#452b1d] hover:bg-[#ffe3b5]"
            >
              카드 다섯 장 뽑기
            </button>
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes realShuffle {
          0% {
            translate: 0 0;
            rotate: 0deg;
          }

          25% {
            translate: -3px -2px;
            rotate: -1deg;
          }

          50% {
            translate: 3px 1px;
            rotate: 1deg;
          }

          75% {
            translate: -2px 0;
            rotate: -0.5deg;
          }

          100% {
            translate: 0 0;
            rotate: 0deg;
          }
        }

        .shuffle-piece {
          animation: realShuffle 0.45s ease-in-out infinite;
        }

        @keyframes card-enter {
          from {
            opacity: 0;
            transform: translateY(25px) scale(0.9);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .shuffle-piece {
            animation: none;
          }
        }
      `}</style>
    </main>
  );
}
