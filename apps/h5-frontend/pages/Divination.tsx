
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, RefreshCw, Share2, BookOpen } from 'lucide-react';

// ─────────────────────────────────────────────
//  Types & Data
// ─────────────────────────────────────────────
type CupResult = 'sheng' | 'xiao' | 'yin';

interface CupOutcome {
    type: CupResult;
    name: string;
    emoji: string;
    color: string;
    glow: string;
    meaning: string;
    detail: string;
    icon: string;
}

const CUP_OUTCOMES: Record<CupResult, CupOutcome> = {
    sheng: {
        type: 'sheng',
        name: '聖杯',
        emoji: '🟡',
        color: '#D4A017',
        glow: 'rgba(212,160,23,0.6)',
        meaning: '神明允诺，诸事大吉',
        detail: '您的祈求已蒙神明首肯。当前所求之事可顺利推进，时机成熟，宜大胆行事，好运将随之而来。',
        icon: '✅',
    },
    xiao: {
        type: 'xiao',
        name: '笑杯',
        emoji: '⚪',
        color: '#6B9FD4',
        glow: 'rgba(107,159,212,0.5)',
        meaning: '神明微笑，需再虔诚',
        detail: '神明尚在观察，所求之事需更多诚心与准备。建议先整饬心境，再次诚心祈愿，或稍作等待。',
        icon: '🙂',
    },
    yin: {
        type: 'yin',
        name: '阴杯',
        emoji: '⚫',
        color: '#8B5CF6',
        glow: 'rgba(139,92,246,0.5)',
        meaning: '神明摇头，暂停此事',
        detail: '所求之事与当下时机不合，神明示意暂缓。此时宜静思反省，调整方向，待时机成熟再行。不必灰心，逆境亦是历练。',
        icon: '❌',
    },
};

// Fortune sticks (签文)
const FORTUNE_STICKS = [
    { num: 1, tier: '上上签', title: '龙凤呈祥', poem: '天高云淡风自清，龙凤相逢万事兴。\n贵人相助前程远，否极泰来喜临门。', advice: '把握当下，积极行动，贵人将至。' },
    { num: 2, tier: '上签', title: '春风得意', poem: '春风拂面百花开，事事如意步步来。\n积累功德福自来，勤奋耕耘有所为。', advice: '踏实努力，回报将比预期更好。' },
    { num: 3, tier: '中上签', title: '守正待时', poem: '守得云开见月明，坚持正道自光明。\n暂时低谷莫灰心，拨云见日在不远。', advice: '现在是积累阶段，耐心等待转机。' },
    { num: 4, tier: '中签', title: '平稳前行', poem: '平稳如月照江心，步步为营保安宁。\n不急不躁稳前行，细水长流有真情。', advice: '维持现状，稳中求进，勿冒进。' },
    { num: 5, tier: '中下签', title: '谨慎思量', poem: '风云变幻难预测，谨言慎行少差错。\n三思而后再行事，仔细权衡利与害。', advice: '重要决定需三思，避免冲动行事。' },
    { num: 6, tier: '下签', title: '逆境磨砺', poem: '磨砺方知金色美，逆境方知心性坚。\n困难只是过客尔，坚守心中那一念。', advice: '困难是成长的机会，勿轻言放弃。' },
    { num: 7, tier: '上上签', title: '喜气临门', poem: '喜气盈门百福至，四季平安万事宜。\n家和人旺事业兴，天随人愿梦成真。', advice: '近期运势极佳，可以大胆尝试心中所愿。' },
    { num: 8, tier: '上签', title: '功德圆满', poem: '善缘积德自有福，功德圆满天佑护。\n持续向善心自宽，天道酬勤终有报。', advice: '坚持做好人做好事，福报将在不远处。' },
];

// ─────────────────────────────────────────────
//  Cup 3D Component
// ─────────────────────────────────────────────
interface CupProps {
    face: 'front' | 'back';
    isFlipping: boolean;
    result?: CupResult;
    index: number;
}

const Cup3D: React.FC<CupProps> = ({ face, isFlipping, result, index }) => {
    const outcome = result ? CUP_OUTCOMES[result] : null;

    return (
        <div
            className="relative"
            style={{
                perspective: '600px',
                width: 80,
                height: 90,
            }}
        >
            <div
                className="relative w-full h-full"
                style={{
                    transformStyle: 'preserve-3d',
                    animation: isFlipping
                        ? `cupFlip3D 1.2s cubic-bezier(0.175, 0.885, 0.32, 1.275) ${index * 200}ms forwards`
                        : 'none',
                    transition: 'transform 0.3s ease',
                }}
            >
                {/* Front face */}
                <div
                    className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl"
                    style={{
                        backfaceVisibility: 'hidden',
                        background: 'linear-gradient(135deg, #3d1a02 0%, #1a0800 100%)',
                        border: '2px solid rgba(212,160,23,0.3)',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
                    }}
                >
                    <div className="text-4xl">🥮</div>
                    <div className="text-[10px] text-amber-300/60 font-bold mt-1">杯</div>
                </div>

                {/* Back face (result) */}
                <div
                    className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl"
                    style={{
                        backfaceVisibility: 'hidden',
                        transform: 'rotateY(180deg)',
                        background: outcome
                            ? `linear-gradient(135deg, ${outcome.color}33, ${outcome.color}11)`
                            : 'linear-gradient(135deg, #3d1a02, #1a0800)',
                        border: `2px solid ${outcome ? outcome.color + '66' : 'rgba(212,160,23,0.3)'}`,
                        boxShadow: outcome ? `0 4px 30px ${outcome.glow}` : '0 4px 20px rgba(0,0,0,0.5)',
                    }}
                >
                    <div className="text-3xl">{outcome?.icon || '🥮'}</div>
                    <div className="text-[10px] font-black mt-1" style={{ color: outcome?.color || '#D4A017' }}>
                        {outcome?.name || ''}
                    </div>
                </div>
            </div>
        </div>
    );
};

// ─────────────────────────────────────────────
//  Divination Page
// ─────────────────────────────────────────────
const Divination: React.FC = () => {
    const navigate = useNavigate();
    const [phase, setPhase] = useState<'intro' | 'shaking' | 'flipping' | 'revealed' | 'fortune'>('intro');
    const [results, setResults] = useState<[CupResult, CupResult] | null>(null);
    const [fortune, setFortune] = useState<typeof FORTUNE_STICKS[0] | null>(null);
    const [shakeCount, setShakeCount] = useState(0);
    const [isShaking, setIsShaking] = useState(false);
    const [attempts, setAttempts] = useState(0);
    const [showConfetti, setShowConfetti] = useState(false);
    const [confettiParticles, setConfettiParticles] = useState<{ id: number; x: number; y: number; color: string; delay: number }[]>([]);
    const shakeSoundRef = useRef<HTMLAudioElement | null>(null);
    const idRef = useRef(0);

    const REQUIRED_SHAKES = 3;

    const spawnConfetti = useCallback(() => {
        const colors = ['#D4A017', '#F5D16B', '#C8860A', '#FFF3B0', '#FF6B6B', '#4ECDC4'];
        const particles = Array.from({ length: 30 }, () => ({
            id: idRef.current++,
            x: 30 + Math.random() * 40,
            y: 20 + Math.random() * 60,
            color: colors[Math.floor(Math.random() * colors.length)],
            delay: Math.random() * 0.5,
        }));
        setConfettiParticles(particles);
        setShowConfetti(true);
        setTimeout(() => setShowConfetti(false), 3000);
    }, []);

    const handleShake = () => {
        if (phase !== 'intro' && phase !== 'shaking') return;
        if (isShaking) return;
        setIsShaking(true);
        setPhase('shaking');
        setTimeout(() => {
            setIsShaking(false);
            const newCount = shakeCount + 1;
            setShakeCount(newCount);
            if (newCount >= REQUIRED_SHAKES) {
                // Ready to throw
            }
        }, 600);
    };

    const handleThrow = () => {
        if (shakeCount < REQUIRED_SHAKES) return;
        setPhase('flipping');

        // Determine result
        const rand = Math.random();
        let r1: CupResult, r2: CupResult;
        // Sheng (holy): one face up, one face down → different faces
        // Xiao (laugh): both face up
        // Yin: both face down
        if (rand < 0.45) {
            // Sheng: one 'sheng' marker each
            r1 = 'sheng'; r2 = 'sheng'; // Both show sheng pattern (one flat one round)
            // Actually: sheng = one cup face-up + one face-down
            // For display: result pair = [front, back]
        } else if (rand < 0.70) {
            r1 = 'xiao'; r2 = 'xiao';
        } else {
            r1 = 'yin'; r2 = 'yin';
        }
        // Refined: actual sheng = one 'flat' (regular side) + one 'round' (curved side)
        // Let's simplify: result indicates overall outcome type
        // random result distribution: sheng 45%, xiao 30%, yin 25%
        let outcome: CupResult;
        if (rand < 0.45) outcome = 'sheng';
        else if (rand < 0.75) outcome = 'xiao';
        else outcome = 'yin';

        // Individual cup results for display (mixed for sheng, same for xiao/yin)
        let cup1: CupResult, cup2: CupResult;
        if (outcome === 'sheng') { cup1 = 'sheng'; cup2 = 'sheng'; }
        else if (outcome === 'xiao') { cup1 = 'xiao'; cup2 = 'xiao'; }
        else { cup1 = 'yin'; cup2 = 'yin'; }

        setTimeout(() => {
            setResults([cup1, cup2]);
            setPhase('revealed');
            setAttempts(a => a + 1);
            if (outcome === 'sheng') spawnConfetti();
        }, 1800); // after animation
    };

    const handleDrawFortune = () => {
        const stick = FORTUNE_STICKS[Math.floor(Math.random() * FORTUNE_STICKS.length)];
        setFortune(stick);
        setPhase('fortune');
        if (stick.tier.includes('上')) spawnConfetti();
    };

    const handleReset = () => {
        setPhase('intro');
        setResults(null);
        setFortune(null);
        setShakeCount(0);
        setIsShaking(false);
    };

    const overallOutcome = results ? CUP_OUTCOMES[results[0]] : null;

    return (
        <div
            className="min-h-full flex flex-col relative overflow-hidden"
            style={{ background: 'linear-gradient(180deg, #0d0520 0%, #1a0a3d 40%, #0d0520 100%)' }}
        >
            <style>{`
        @keyframes cupFlip3D {
          0%   { transform: rotateY(0deg) rotateZ(0deg) translateY(0); }
          20%  { transform: rotateY(90deg) rotateZ(15deg) translateY(-30px); }
          50%  { transform: rotateY(200deg) rotateZ(-10deg) translateY(-60px); }
          80%  { transform: rotateY(300deg) rotateZ(5deg) translateY(-20px); }
          100% { transform: rotateY(360deg) rotateZ(0deg) translateY(0); }
        }
        @keyframes shakeAnim {
          0%,100% { transform: rotate(0deg) scale(1); }
          15%  { transform: rotate(-12deg) scale(1.05) translateY(-5px); }
          30%  { transform: rotate(12deg) scale(1.08) translateY(-10px); }
          45%  { transform: rotate(-8deg) scale(1.05) translateY(-5px); }
          60%  { transform: rotate(8deg) scale(1.07) translateY(-8px); }
          75%  { transform: rotate(-5deg) scale(1.04) translateY(-3px); }
          90%  { transform: rotate(5deg) scale(1.02) translateY(-2px); }
        }
        @keyframes spinFortune {
          0%   { transform: rotateX(90deg) scale(0.5); opacity: 0; }
          60%  { transform: rotateX(-10deg) scale(1.05); opacity: 1; }
          100% { transform: rotateX(0deg) scale(1); opacity: 1; }
        }
        @keyframes confettiFall {
          0%   { transform: translateY(-20px) rotate(0deg); opacity: 1; }
          100% { transform: translateY(200px) rotate(720deg); opacity: 0; }
        }
        @keyframes resultReveal {
          0%   { transform: scale(0.5) translateY(20px); opacity: 0; }
          70%  { transform: scale(1.05) translateY(-5px); opacity: 1; }
          100% { transform: scale(1) translateY(0); opacity: 1; }
        }
        @keyframes starOrbit {
          0%   { transform: rotate(0deg) translateX(60px) rotate(0deg); }
          100% { transform: rotate(360deg) translateX(60px) rotate(-360deg); }
        }
        @keyframes glowPulse {
          0%,100% { opacity: 0.4; transform: scale(1); }
          50%     { opacity: 0.8; transform: scale(1.1); }
        }
        .purple-glow { box-shadow: 0 0 40px rgba(139,92,246,0.3), 0 0 80px rgba(139,92,246,0.1); }
      `}</style>

            {/* Confetti */}
            {showConfetti && (
                <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
                    {confettiParticles.map(p => (
                        <div
                            key={p.id}
                            className="absolute text-lg"
                            style={{
                                left: `${p.x}%`,
                                top: `${p.y}%`,
                                color: p.color,
                                animation: `confettiFall 2s ease-in forwards`,
                                animationDelay: `${p.delay}s`,
                            }}
                        >
                            ✨
                        </div>
                    ))}
                </div>
            )}

            {/* Header */}
            <div className="flex items-center justify-between px-5 pt-12 pb-4 z-10 relative">
                <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center active:scale-90 transition-transform">
                    <ChevronLeft className="w-5 h-5 text-purple-200" />
                </button>
                <div className="text-center">
                    <p className="text-purple-300/60 text-[10px] font-bold tracking-[0.3em]">ORACLE · 神明指引</p>
                    <h1 className="text-white text-lg font-black tracking-wider">掷杯问卦</h1>
                </div>
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                    <span className="text-lg">🎲</span>
                </div>
            </div>

            {/* Stars background */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                {Array.from({ length: 20 }).map((_, i) => (
                    <div
                        key={i}
                        className="absolute rounded-full bg-white"
                        style={{
                            width: 1 + Math.random() * 2,
                            height: 1 + Math.random() * 2,
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 60}%`,
                            animation: `glowPulse ${2 + Math.random() * 3}s ease-in-out infinite`,
                            animationDelay: `${Math.random() * 3}s`,
                        }}
                    />
                ))}
            </div>

            <div className="flex-1 flex flex-col items-center px-6 pb-8 z-10 relative">

                {/* ── Phase: Intro & Shaking ── */}
                {(phase === 'intro' || phase === 'shaking') && (
                    <>
                        {/* Instructions */}
                        <div className="w-full max-w-sm mb-6">
                            <div
                                className="rounded-3xl p-5 text-center"
                                style={{ background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.2)' }}
                            >
                                <p className="text-purple-200/80 text-sm font-bold leading-relaxed">
                                    心中默念所问之事，<br />
                                    摇动聖杯至少 <span className="text-yellow-300 font-black">{REQUIRED_SHAKES}</span> 次，<br />
                                    再掷出问神明。
                                </p>
                            </div>
                        </div>

                        {/* Cup Container - Shakeable */}
                        <div className="flex flex-col items-center gap-8 mb-8">
                            <div
                                onClick={handleShake}
                                className="cursor-pointer select-none relative"
                                style={{
                                    animation: isShaking ? 'shakeAnim 0.6s cubic-bezier(0.36,0.07,0.19,0.97) forwards' : 'none',
                                }}
                            >
                                {/* Glow under cup */}
                                <div
                                    className="absolute bottom-0 left-1/2 -translate-x-1/2 w-40 h-6 rounded-full blur-xl"
                                    style={{ background: 'rgba(139,92,246,0.4)', animation: 'glowPulse 2s infinite' }}
                                />
                                {/* Cup Visual */}
                                <div
                                    className="w-36 h-36 rounded-full flex items-center justify-center relative"
                                    style={{
                                        background: 'linear-gradient(135deg, #2d1060 0%, #1a0a3d 100%)',
                                        border: '3px solid rgba(139,92,246,0.4)',
                                        boxShadow: '0 0 40px rgba(139,92,246,0.3), inset 0 0 20px rgba(139,92,246,0.1)',
                                    }}
                                >
                                    <div className="text-7xl">🥮</div>
                                    {/* Orbit stars */}
                                    {[0, 120, 240].map((deg, i) => (
                                        <div
                                            key={i}
                                            className="absolute text-sm"
                                            style={{
                                                animation: `starOrbit ${3 + i * 0.5}s linear infinite`,
                                                animationDelay: `${i * 0.5}s`,
                                            }}
                                        >
                                            ⭐
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Shake Progress */}
                            <div className="flex flex-col items-center gap-3">
                                <div className="flex gap-2">
                                    {Array.from({ length: REQUIRED_SHAKES }).map((_, i) => (
                                        <div
                                            key={i}
                                            className="w-8 h-8 rounded-full flex items-center justify-center text-sm transition-all duration-300"
                                            style={{
                                                background: i < shakeCount ? 'rgba(212,160,23,0.8)' : 'rgba(255,255,255,0.1)',
                                                border: `2px solid ${i < shakeCount ? '#D4A017' : 'rgba(255,255,255,0.2)'}`,
                                                transform: i < shakeCount ? 'scale(1.2)' : 'scale(1)',
                                                boxShadow: i < shakeCount ? '0 0 15px rgba(212,160,23,0.5)' : 'none',
                                            }}
                                        >
                                            {i < shakeCount ? '🎲' : '○'}
                                        </div>
                                    ))}
                                </div>
                                <p className="text-purple-300/60 text-xs font-bold">
                                    {shakeCount < REQUIRED_SHAKES
                                        ? `还需摇 ${REQUIRED_SHAKES - shakeCount} 次`
                                        : '已虔诚摇杯，可以掷出！'}
                                </p>
                            </div>
                        </div>

                        {/* Shake hint */}
                        {shakeCount === 0 && (
                            <p className="text-purple-400/40 text-xs font-bold animate-pulse mb-6">👆 点击圣杯摇杯</p>
                        )}

                        {/* Throw Button */}
                        <button
                            onClick={handleThrow}
                            disabled={shakeCount < REQUIRED_SHAKES}
                            className="w-full max-w-sm py-5 rounded-3xl font-black text-xl tracking-widest active:scale-95 transition-all"
                            style={{
                                background: shakeCount >= REQUIRED_SHAKES
                                    ? 'linear-gradient(135deg, #7C3AED, #4F46E5)'
                                    : 'rgba(255,255,255,0.05)',
                                color: shakeCount >= REQUIRED_SHAKES ? 'white' : 'rgba(255,255,255,0.2)',
                                boxShadow: shakeCount >= REQUIRED_SHAKES ? '0 8px 32px rgba(124,58,237,0.4)' : 'none',
                            }}
                        >
                            🎲 掷杯问神明
                        </button>
                    </>
                )}

                {/* ── Phase: Flipping ── */}
                {phase === 'flipping' && (
                    <div className="flex flex-col items-center gap-10 pt-10">
                        <div className="flex gap-8">
                            {[0, 1].map(i => (
                                <Cup3D
                                    key={i}
                                    face="front"
                                    isFlipping={true}
                                    result={undefined}
                                    index={i}
                                />
                            ))}
                        </div>
                        <p className="text-purple-200/60 text-sm font-bold animate-pulse">神明降示中…</p>
                    </div>
                )}

                {/* ── Phase: Revealed ── */}
                {phase === 'revealed' && results && overallOutcome && (
                    <div className="w-full max-w-sm space-y-5" style={{ animation: 'resultReveal 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards' }}>
                        {/* Cups Display */}
                        <div className="flex justify-center gap-8 mb-2">
                            {results.map((r, i) => (
                                <Cup3D key={i} face="back" isFlipping={false} result={r} index={i} />
                            ))}
                        </div>

                        {/* Result Card */}
                        <div
                            className="rounded-3xl p-7 text-center border"
                            style={{
                                background: `linear-gradient(135deg, ${overallOutcome.color}22, ${overallOutcome.color}11)`,
                                borderColor: `${overallOutcome.color}44`,
                                boxShadow: `0 0 50px ${overallOutcome.glow}, 0 0 100px ${overallOutcome.glow}40`,
                            }}
                        >
                            <div className="text-5xl mb-3">{overallOutcome.icon}</div>
                            <h2 className="text-3xl font-black mb-2" style={{ color: overallOutcome.color }}>
                                {overallOutcome.name}
                            </h2>
                            <p className="text-white/80 font-black text-base mb-4">{overallOutcome.meaning}</p>
                            <p className="text-white/50 text-xs leading-relaxed">{overallOutcome.detail}</p>
                            <div className="mt-4 pt-4 border-t border-white/10">
                                <p className="text-white/30 text-[10px]">第 {attempts} 次掷杯</p>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="space-y-3">
                            {overallOutcome.type === 'sheng' ? (
                                <button
                                    onClick={handleDrawFortune}
                                    className="w-full py-5 rounded-3xl font-black text-lg text-white tracking-wider active:scale-95 transition-transform"
                                    style={{
                                        background: 'linear-gradient(135deg, #D4A017, #8B4513)',
                                        boxShadow: '0 8px 24px rgba(212,160,23,0.4)',
                                    }}
                                >
                                    📜 已蒙允诺，求取签文
                                </button>
                            ) : overallOutcome.type === 'xiao' ? (
                                <button
                                    onClick={handleReset}
                                    className="w-full py-5 rounded-3xl font-black text-base text-white tracking-wider active:scale-95 transition-transform"
                                    style={{ background: 'linear-gradient(135deg, #4A6FA5, #2D4A7A)', boxShadow: '0 8px 24px rgba(74,106,165,0.4)' }}
                                >
                                    🔄 再次诚心掷杯
                                </button>
                            ) : (
                                <button
                                    onClick={handleReset}
                                    className="w-full py-5 rounded-3xl font-black text-base text-white tracking-wider active:scale-95 transition-transform"
                                    style={{ background: 'linear-gradient(135deg, #5B21B6, #3730A3)', boxShadow: '0 8px 24px rgba(91,33,182,0.4)' }}
                                >
                                    🙏 三思后再问
                                </button>
                            )}

                            <div className="flex gap-3">
                                <button
                                    onClick={handleReset}
                                    className="flex-1 py-4 rounded-2xl flex items-center justify-center gap-2 bg-white/5 border border-white/10 text-purple-200 text-sm font-bold active:scale-95"
                                >
                                    <RefreshCw className="w-4 h-4" />重来
                                </button>
                                <button
                                    onClick={() => navigate('/prayer')}
                                    className="flex-1 py-4 rounded-2xl flex items-center justify-center gap-2 bg-white/5 border border-white/10 text-purple-200 text-sm font-bold active:scale-95"
                                >
                                    <span>🙏</span>回祈福
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* ── Phase: Fortune (Stick) ── */}
                {phase === 'fortune' && fortune && (
                    <div
                        className="w-full max-w-sm space-y-5"
                        style={{ animation: 'spinFortune 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards' }}
                    >
                        {/* Fortune Header */}
                        <div className="text-center mb-2">
                            <div className="text-5xl mb-3">📜</div>
                            <p className="text-amber-300/60 text-[10px] tracking-[0.3em] font-bold">神明赐签</p>
                        </div>

                        {/* Fortune Card */}
                        <div
                            className="rounded-3xl overflow-hidden border"
                            style={{
                                background: 'linear-gradient(180deg, #2d1200 0%, #1a0800 100%)',
                                borderColor: 'rgba(212,160,23,0.4)',
                                boxShadow: '0 0 40px rgba(212,160,23,0.2)',
                            }}
                        >
                            {/* Header */}
                            <div
                                className="flex items-center justify-between px-6 py-4 border-b"
                                style={{ borderColor: 'rgba(212,160,23,0.2)', background: 'rgba(212,160,23,0.1)' }}
                            >
                                <span className="text-amber-300/60 text-xs font-bold">第 {fortune.num} 签</span>
                                <span
                                    className="px-3 py-1 rounded-full text-xs font-black"
                                    style={{
                                        background: fortune.tier.includes('上上') ? 'rgba(212,160,23,0.3)' :
                                            fortune.tier.includes('上') ? 'rgba(34,197,94,0.2)' :
                                                fortune.tier.includes('中') ? 'rgba(59,130,246,0.2)' : 'rgba(239,68,68,0.2)',
                                        color: fortune.tier.includes('上上') ? '#D4A017' :
                                            fortune.tier.includes('上') ? '#22C55E' :
                                                fortune.tier.includes('中') ? '#60A5FA' : '#EF4444',
                                        border: `1px solid currentColor`,
                                    }}
                                >
                                    {fortune.tier}
                                </span>
                            </div>

                            <div className="p-6 space-y-5">
                                {/* Title */}
                                <h2 className="text-2xl font-black text-center"
                                    style={{
                                        background: 'linear-gradient(90deg, #c8860a, #f5d16b, #c8860a)',
                                        backgroundSize: '200% auto',
                                        WebkitBackgroundClip: 'text',
                                        WebkitTextFillColor: 'transparent',
                                        backgroundClip: 'text',
                                    }}
                                >
                                    {fortune.title}
                                </h2>

                                {/* Poem */}
                                <div
                                    className="rounded-2xl p-5 text-center"
                                    style={{ background: 'rgba(212,160,23,0.05)', border: '1px solid rgba(212,160,23,0.1)' }}
                                >
                                    <p className="text-amber-100/70 text-sm leading-loose font-bold whitespace-pre-line">
                                        {fortune.poem}
                                    </p>
                                </div>

                                {/* Advice */}
                                <div
                                    className="rounded-2xl p-4 flex items-start gap-3"
                                    style={{ background: 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.2)' }}
                                >
                                    <BookOpen className="w-4 h-4 text-purple-300 mt-0.5 flex-shrink-0" />
                                    <div>
                                        <p className="text-purple-300/60 text-[10px] font-bold mb-1">签诗解析</p>
                                        <p className="text-purple-100/80 text-xs leading-relaxed">{fortune.advice}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-3">
                            <button
                                onClick={() => {
                                    const msg = `我在心愿殿堂求得【${fortune.tier}·${fortune.title}】\n${fortune.poem}\n解析：${fortune.advice}`;
                                    if (navigator.share) navigator.share({ title: '我的签文', text: msg });
                                    else alert(msg);
                                }}
                                className="flex-1 py-4 rounded-2xl flex items-center justify-center gap-2 bg-white/5 border border-white/10 text-amber-200 text-sm font-bold active:scale-95"
                            >
                                <Share2 className="w-4 h-4" />分享签文
                            </button>
                            <button
                                onClick={handleReset}
                                className="flex-1 py-4 rounded-2xl flex items-center justify-center gap-2 bg-white/5 border border-white/10 text-amber-200 text-sm font-bold active:scale-95"
                            >
                                <RefreshCw className="w-4 h-4" />再问一签
                            </button>
                        </div>

                        <button
                            onClick={() => navigate('/prayer')}
                            className="w-full py-4 rounded-2xl text-amber-400/60 text-xs font-bold text-center"
                        >
                            🙏 返回祈福殿
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Divination;
