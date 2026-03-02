
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Share2, Heart, Sparkles, Star } from 'lucide-react';

// ─────────────────────────────────────────────
//  Types
// ─────────────────────────────────────────────
interface Particle {
    id: number;
    x: number;
    y: number;
    size: number;
    opacity: number;
    vx: number;
    vy: number;
    life: number;
    color: string;
}

interface SmokeParticle {
    id: number;
    x: number;
    startY: number;
    offsetX: number;
    duration: number;
    delay: number;
    size: number;
    opacity: number;
}

// ─────────────────────────────────────────────
//  Deities Configuration
// ─────────────────────────────────────────────
const DEITIES = [
    {
        id: 'guanyin',
        name: '观世音菩萨',
        title: '慈悲救苦·千手千眼',
        color: '#C8860A',
        glowColor: 'rgba(200,134,10,0.4)',
        emoji: '🙏',
        gradient: 'from-amber-900 via-yellow-800 to-amber-700',
        bgGradient: 'from-amber-950 via-yellow-900 to-amber-800',
        blessings: ['身体健康，平安喜乐', '家庭和睦，万事如意', '学业进步，金榜题名', '事业顺遂，财源广进'],
        prayerText: '南无观世音菩萨，慈悲护佑，愿我',
    },
    {
        id: 'caishen',
        name: '财神爷',
        title: '招财进宝·五路财神',
        color: '#D4A017',
        glowColor: 'rgba(212,160,23,0.4)',
        emoji: '💰',
        gradient: 'from-yellow-900 via-amber-700 to-yellow-600',
        bgGradient: 'from-yellow-950 via-amber-900 to-yellow-800',
        blessings: ['财源滚滚，日进斗金', '生意兴隆，财运亨通', '投资顺遂，获利丰厚', '横财临门，好运连连'],
        prayerText: '财神爷保佑，愿我',
    },
    {
        id: 'wenchang',
        name: '文昌帝君',
        title: '主宰文运·护佑学子',
        color: '#4A90D9',
        glowColor: 'rgba(74,144,217,0.4)',
        emoji: '📚',
        gradient: 'from-blue-900 via-indigo-800 to-blue-700',
        bgGradient: 'from-blue-950 via-indigo-900 to-blue-800',
        blessings: ['金榜题名，学业有成', '才思敏捷，智慧增长', '考试顺利，马到成功', '文运昌盛，前途光明'],
        prayerText: '文昌帝君保佑，愿我',
    },
    {
        id: 'yueguanlaoye',
        name: '月老',
        title: '牵红线·司姻缘',
        color: '#C0325E',
        glowColor: 'rgba(192,50,94,0.4)',
        emoji: '❤️',
        gradient: 'from-rose-900 via-pink-800 to-rose-700',
        bgGradient: 'from-rose-950 via-pink-900 to-rose-800',
        blessings: ['红线相牵，良缘天定', '爱情甜蜜，白头偕老', '早遇良人，缘定三生', '姻缘美满，幸福久长'],
        prayerText: '月老保佑，愿我',
    },
];

// ─────────────────────────────────────────────
//  Smoke Animation Component
// ─────────────────────────────────────────────
const IncenseSmoke: React.FC<{ isLit: boolean; color: string }> = ({ isLit, color }) => {
    const [smokes, setSmokes] = useState<SmokeParticle[]>([]);
    const idRef = useRef(0);

    useEffect(() => {
        if (!isLit) { setSmokes([]); return; }
        const interval = setInterval(() => {
            const newSmoke: SmokeParticle = {
                id: idRef.current++,
                x: 50 + (Math.random() - 0.5) * 6,
                startY: 85,
                offsetX: (Math.random() - 0.5) * 30,
                duration: 3 + Math.random() * 2,
                delay: 0,
                size: 14 + Math.random() * 20,
                opacity: 0.3 + Math.random() * 0.3,
            };
            setSmokes(prev => [...prev.slice(-12), newSmoke]);
        }, 200);
        return () => clearInterval(interval);
    }, [isLit]);

    return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {smokes.map(s => (
                <div
                    key={s.id}
                    className="absolute rounded-full"
                    style={{
                        left: `${s.x}%`,
                        bottom: `${100 - s.startY}%`,
                        width: s.size,
                        height: s.size,
                        background: `radial-gradient(circle, ${color}88 0%, transparent 70%)`,
                        animation: `smokeRise ${s.duration}s ease-out forwards`,
                        '--smoke-offset': `${s.offsetX}px`,
                    } as React.CSSProperties}
                />
            ))}
        </div>
    );
};

// ─────────────────────────────────────────────
//  Lotus Petal Burst
// ─────────────────────────────────────────────
const LotusBurst: React.FC<{ trigger: boolean; onEnd: () => void }> = ({ trigger, onEnd }) => {
    const petals = Array.from({ length: 12 }, (_, i) => i);
    useEffect(() => {
        if (trigger) {
            const t = setTimeout(onEnd, 2000);
            return () => clearTimeout(t);
        }
    }, [trigger, onEnd]);

    if (!trigger) return null;
    return (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30">
            {petals.map(i => (
                <div
                    key={i}
                    className="absolute text-2xl"
                    style={{
                        animation: `petalBurst 1.8s ease-out forwards`,
                        animationDelay: `${i * 40}ms`,
                        '--angle': `${(i / 12) * 360}deg`,
                    } as React.CSSProperties}
                >
                    🌸
                </div>
            ))}
            <div className="text-5xl" style={{ animation: 'centerGlow 1.8s ease-out forwards' }}>✨</div>
        </div>
    );
};

// ─────────────────────────────────────────────
//  Main Prayer Page
// ─────────────────────────────────────────────
const Prayer: React.FC = () => {
    const navigate = useNavigate();
    const [selectedDeity, setSelectedDeity] = useState(0);
    const [isLit, setIsLit] = useState(false);
    const [prayerPhase, setPrayerPhase] = useState<'idle' | 'lighting' | 'praying' | 'blessed'>('idle');
    const [merit, setMerit] = useState(() => parseInt(localStorage.getItem('prayer_merit') || '0'));
    const [selectedBlessing, setSelectedBlessing] = useState('');
    const [showLotus, setShowLotus] = useState(false);
    const [particles, setParticles] = useState<Particle[]>([]);
    const [prayerCount, setPrayerCount] = useState(() => parseInt(localStorage.getItem('prayer_count') || '0'));
    const [showMeritAnim, setShowMeritAnim] = useState(false);
    const [meritDelta, setMeritDelta] = useState(0);
    const [customWish, setCustomWish] = useState('');
    const [showWishInput, setShowWishInput] = useState(false);
    const particleIdRef = useRef(0);
    const animFrameRef = useRef<number>();

    const deity = DEITIES[selectedDeity];

    // ──── Particle System ────
    const spawnParticles = useCallback((x: number, y: number, count: number, color: string) => {
        const newParticles: Particle[] = Array.from({ length: count }, () => ({
            id: particleIdRef.current++,
            x, y,
            size: 4 + Math.random() * 6,
            opacity: 1,
            vx: (Math.random() - 0.5) * 4,
            vy: -(1 + Math.random() * 3),
            life: 1,
            color,
        }));
        setParticles(prev => [...prev, ...newParticles]);
    }, []);

    useEffect(() => {
        const step = () => {
            setParticles(prev =>
                prev
                    .map(p => ({ ...p, x: p.x + p.vx, y: p.y + p.vy, life: p.life - 0.02, opacity: p.life }))
                    .filter(p => p.life > 0)
            );
            animFrameRef.current = requestAnimationFrame(step);
        };
        animFrameRef.current = requestAnimationFrame(step);
        return () => { if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current); };
    }, []);

    // ──── Prayer Flow ────
    const handleLight = () => {
        if (prayerPhase !== 'idle') return;
        setPrayerPhase('lighting');
        setTimeout(() => {
            setIsLit(true);
            setPrayerPhase('praying');
            spawnParticles(50, 70, 20, deity.color);
        }, 800);
    };

    const handlePray = () => {
        if (prayerPhase !== 'praying' || !selectedBlessing) return;
        setPrayerPhase('blessed');
        const gain = 10 + Math.floor(Math.random() * 15);
        const newMerit = merit + gain;
        const newCount = prayerCount + 1;
        setMerit(newMerit);
        setPrayerCount(newCount);
        setMeritDelta(gain);
        setShowMeritAnim(true);
        setTimeout(() => setShowMeritAnim(false), 2000);
        localStorage.setItem('prayer_merit', String(newMerit));
        localStorage.setItem('prayer_count', String(newCount));
        setShowLotus(true);
        spawnParticles(50, 50, 40, deity.color);
    };

    const handleReset = () => {
        setIsLit(false);
        setPrayerPhase('idle');
        setSelectedBlessing('');
        setCustomWish('');
        setShowWishInput(false);
    };

    return (
        <div
            className="min-h-full flex flex-col relative overflow-hidden"
            style={{ background: `linear-gradient(180deg, #1a0a00 0%, #2d1200 40%, #1a0800 100%)` }}
        >
            {/* Global Styles */}
            <style>{`
        @keyframes smokeRise {
          0%   { transform: translate(0, 0) scale(0.5); opacity: var(--init-opacity, 0.4); }
          50%  { transform: translate(var(--smoke-offset, 0px), -80px) scale(1.2); opacity: 0.2; }
          100% { transform: translate(calc(var(--smoke-offset, 0px) * 1.5), -160px) scale(2); opacity: 0; }
        }
        @keyframes petalBurst {
          0%   { transform: rotate(var(--angle)) translateY(0) scale(0); opacity: 1; }
          60%  { transform: rotate(var(--angle)) translateY(-80px) scale(1.2); opacity: 0.9; }
          100% { transform: rotate(var(--angle)) translateY(-120px) scale(0.5); opacity: 0; }
        }
        @keyframes centerGlow {
          0%   { transform: scale(0.5); opacity: 0; }
          30%  { transform: scale(1.5); opacity: 1; }
          100% { transform: scale(2); opacity: 0; }
        }
        @keyframes flicker {
          0%,100% { opacity: 1; transform: scaleY(1); }
          25%  { opacity: 0.8; transform: scaleY(0.9) scaleX(1.1); }
          50%  { opacity: 0.9; transform: scaleY(1.05); }
          75%  { opacity: 0.85; transform: scaleY(0.95) scaleX(0.9); }
        }
        @keyframes aureole {
          0%   { transform: rotate(0deg) scale(1); opacity: 0.4; }
          50%  { transform: rotate(180deg) scale(1.05); opacity: 0.6; }
          100% { transform: rotate(360deg) scale(1); opacity: 0.4; }
        }
        @keyframes floatUp {
          0%   { transform: translateY(0); }
          50%  { transform: translateY(-8px); }
          100% { transform: translateY(0); }
        }
        @keyframes meritPop {
          0%   { transform: translateY(0) scale(0.5); opacity: 0; }
          30%  { transform: translateY(-20px) scale(1.3); opacity: 1; }
          100% { transform: translateY(-60px) scale(1); opacity: 0; }
        }
        @keyframes goldPulse {
          0%,100% { box-shadow: 0 0 20px rgba(212,160,23,0.3); }
          50%      { box-shadow: 0 0 50px rgba(212,160,23,0.7), 0 0 100px rgba(212,160,23,0.2); }
        }
        @keyframes lanternSway {
          0%,100% { transform: rotate(-3deg); }
          50%      { transform: rotate(3deg); }
        }
        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        .gold-text {
          background: linear-gradient(90deg, #c8860a, #f5d16b, #c8860a, #f5d16b);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shimmer 3s linear infinite;
        }
        .deity-btn-active {
          box-shadow: 0 0 0 2px #D4A017, 0 0 20px rgba(212,160,23,0.5);
        }
      `}</style>

            {/* ── Particle Canvas ── */}
            <div className="fixed inset-0 pointer-events-none z-50">
                {particles.map(p => (
                    <div
                        key={p.id}
                        className="absolute rounded-full"
                        style={{
                            left: `${p.x}%`,
                            top: `${p.y}%`,
                            width: p.size,
                            height: p.size,
                            backgroundColor: p.color,
                            opacity: p.opacity,
                            transform: 'translate(-50%, -50%)',
                            boxShadow: `0 0 ${p.size * 2}px ${p.color}`,
                        }}
                    />
                ))}
            </div>

            {/* ── Header ── */}
            <div className="flex items-center justify-between px-5 pt-12 pb-4 z-10 relative">
                <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center active:scale-90 transition-transform">
                    <ChevronLeft className="w-5 h-5 text-amber-200" />
                </button>
                <div className="text-center">
                    <p className="text-amber-300/60 text-[10px] font-bold tracking-[0.3em] uppercase">TEMPLE · 心愿殿堂</p>
                    <h1 className="text-white text-lg font-black tracking-wider">祈福拜神</h1>
                </div>
                <div className="flex flex-col items-center">
                    <div className="px-3 py-1.5 bg-gradient-to-r from-amber-600/30 to-yellow-500/20 border border-amber-500/30 rounded-full">
                        <span className="text-amber-300 text-xs font-black">功德 {merit}</span>
                    </div>
                </div>
            </div>

            {/* ── Lantern Decorations ── */}
            <div className="absolute top-8 left-3 z-10 pointer-events-none" style={{ animation: 'lanternSway 3s ease-in-out infinite' }}>
                <div className="text-3xl">🏮</div>
            </div>
            <div className="absolute top-8 right-3 z-10 pointer-events-none" style={{ animation: 'lanternSway 3s ease-in-out infinite 1.5s' }}>
                <div className="text-3xl">🏮</div>
            </div>

            {/* ── Deity Selector ── */}
            <div className="px-4 z-10 relative">
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                    {DEITIES.map((d, i) => (
                        <button
                            key={d.id}
                            onClick={() => { setSelectedDeity(i); handleReset(); }}
                            className={`flex-shrink-0 flex flex-col items-center px-4 py-3 rounded-2xl border transition-all ${selectedDeity === i
                                    ? 'bg-amber-900/60 border-amber-500/60 deity-btn-active'
                                    : 'bg-white/5 border-white/10'
                                }`}
                        >
                            <span className="text-xl">{d.emoji}</span>
                            <span className="text-[10px] text-amber-200/80 font-bold mt-1 whitespace-nowrap">{d.name}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* ── Deity Display ── */}
            <div className="flex-1 flex flex-col items-center px-4 pt-2 pb-6 relative z-10">
                {/* Aureole */}
                <div className="relative flex items-center justify-center mb-4">
                    <div
                        className="absolute w-52 h-52 rounded-full"
                        style={{
                            background: `conic-gradient(from 0deg, transparent, ${deity.glowColor}, transparent, ${deity.glowColor}, transparent)`,
                            animation: 'aureole 8s linear infinite',
                        }}
                    />
                    <div
                        className="absolute w-44 h-44 rounded-full opacity-20"
                        style={{ background: `radial-gradient(circle, ${deity.color} 0%, transparent 70%)` }}
                    />

                    {/* Deity Icon */}
                    <div
                        className="relative w-44 h-44 rounded-full flex items-center justify-center overflow-hidden"
                        style={{
                            background: `linear-gradient(135deg, #3d1a02 0%, #1a0800 100%)`,
                            border: `3px solid ${deity.color}55`,
                            boxShadow: isLit ? `0 0 40px ${deity.glowColor}, 0 0 80px ${deity.glowColor}` : 'none',
                            animation: 'floatUp 4s ease-in-out infinite',
                            transition: 'box-shadow 1s ease',
                        }}
                    >
                        <div className="text-8xl">{deity.emoji}</div>
                        {/* Golden border ring */}
                        <div
                            className="absolute inset-0 rounded-full"
                            style={{ border: `1px solid ${deity.color}33`, boxShadow: `inset 0 0 20px ${deity.glowColor}` }}
                        />
                    </div>

                    {/* Lotus Burst */}
                    <LotusBurst trigger={showLotus} onEnd={() => setShowLotus(false)} />
                </div>

                {/* Deity Name */}
                <div className="text-center mb-4">
                    <h2 className="text-2xl font-black gold-text">{deity.name}</h2>
                    <p className="text-amber-300/50 text-[10px] tracking-[0.25em] mt-1 font-bold">{deity.title}</p>
                </div>

                {/* Merit Pop Animation */}
                {showMeritAnim && (
                    <div
                        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-amber-300 font-black text-4xl z-50 pointer-events-none"
                        style={{ animation: 'meritPop 2s ease-out forwards', textShadow: `0 0 20px ${deity.color}` }}
                    >
                        +{meritDelta} 功德
                    </div>
                )}

                {/* ── Phase: Idle — Light Incense ── */}
                {prayerPhase === 'idle' && (
                    <div className="w-full max-w-sm space-y-4">
                        {/* Incense Sticks */}
                        <div className="flex items-end justify-center gap-3 h-32 relative">
                            {[0, 1, 2].map(i => (
                                <div key={i} className="relative flex flex-col items-center" style={{ height: `${100 - i * 8}px` }}>
                                    <div className="w-1 flex-1 rounded-full" style={{ background: 'linear-gradient(to bottom, #8B4513, #D2691E)', boxShadow: '0 0 4px rgba(139,69,19,0.5)' }} />
                                </div>
                            ))}
                        </div>
                        <button
                            onClick={handleLight}
                            className="w-full py-5 rounded-3xl font-black text-lg text-white tracking-widest relative overflow-hidden active:scale-95 transition-transform"
                            style={{
                                background: `linear-gradient(135deg, ${deity.color}, #8B4513)`,
                                boxShadow: `0 8px 32px ${deity.glowColor}`,
                            }}
                        >
                            <span className="relative z-10">🕯️ 点燃心香</span>
                        </button>
                        {/* Prayer Count */}
                        <p className="text-center text-amber-300/40 text-xs font-bold">已祈福 {prayerCount} 次 · 功德值 {merit}</p>
                    </div>
                )}

                {/* ── Phase: Lighting ── */}
                {prayerPhase === 'lighting' && (
                    <div className="w-full max-w-sm flex flex-col items-center gap-6">
                        <div className="flex items-end justify-center gap-3 h-32 relative">
                            {[0, 1, 2].map(i => (
                                <div key={i} className="relative flex flex-col items-center" style={{ height: `${100 - i * 8}px` }}>
                                    <div className="w-5 h-6 relative">
                                        <div className="absolute inset-0 text-xl text-center" style={{ animation: 'flicker 0.3s ease-in-out infinite' }}>🔥</div>
                                    </div>
                                    <div className="w-1 flex-1 rounded-full" style={{ background: 'linear-gradient(to bottom, #ff6b00, #8B4513)' }} />
                                </div>
                            ))}
                        </div>
                        <p className="text-amber-300/60 text-sm font-bold animate-pulse">心香正在点燃…</p>
                    </div>
                )}

                {/* ── Phase: Praying ── */}
                {prayerPhase === 'praying' && (
                    <div className="w-full max-w-sm space-y-4">
                        {/* Incense with smoke */}
                        <div className="flex items-end justify-center gap-3 h-28 relative">
                            <IncenseSmoke isLit={true} color={deity.color} />
                            {[0, 1, 2].map(i => (
                                <div key={i} className="relative flex flex-col items-center" style={{ height: `${100 - i * 8}px` }}>
                                    <div className="w-4 h-5 relative flex-shrink-0">
                                        <div className="absolute inset-0 text-lg text-center" style={{ animation: 'flicker 0.4s ease-in-out infinite', animationDelay: `${i * 0.1}s` }}>🔥</div>
                                    </div>
                                    <div className="w-1 flex-1 rounded-full" style={{ background: 'linear-gradient(to bottom, #ff6b00, #8B4513)' }} />
                                </div>
                            ))}
                        </div>

                        <p className="text-center text-amber-200/60 text-[10px] tracking-[0.2em] font-bold">{deity.prayerText}</p>

                        {/* Blessing Selection */}
                        <div className="grid grid-cols-2 gap-2">
                            {deity.blessings.map((b) => (
                                <button
                                    key={b}
                                    onClick={() => setSelectedBlessing(b)}
                                    className={`py-3 px-3 rounded-2xl text-xs font-bold leading-snug transition-all active:scale-95 ${selectedBlessing === b
                                            ? 'text-amber-900 font-black'
                                            : 'text-amber-200/70 bg-white/5 border border-white/10'
                                        }`}
                                    style={selectedBlessing === b ? {
                                        background: `linear-gradient(135deg, ${deity.color}, #D4A017)`,
                                        boxShadow: `0 4px 16px ${deity.glowColor}`,
                                    } : {}}
                                >
                                    {b}
                                </button>
                            ))}
                        </div>

                        {/* Custom Wish */}
                        {!showWishInput ? (
                            <button
                                onClick={() => setShowWishInput(true)}
                                className="w-full py-3 border border-dashed border-amber-500/30 rounded-2xl text-amber-400/50 text-xs font-bold"
                            >
                                ✍️ 私语心愿（自定义）
                            </button>
                        ) : (
                            <div className="relative">
                                <textarea
                                    value={customWish}
                                    onChange={e => { setCustomWish(e.target.value); setSelectedBlessing(e.target.value); }}
                                    placeholder="在此写下您的心愿…"
                                    rows={2}
                                    className="w-full bg-white/5 border border-amber-500/30 rounded-2xl p-4 text-amber-100 text-xs resize-none outline-none placeholder:text-amber-300/30"
                                />
                            </div>
                        )}

                        {/* Pray Button */}
                        <button
                            onClick={handlePray}
                            disabled={!selectedBlessing}
                            className="w-full py-5 rounded-3xl font-black text-lg tracking-widest active:scale-95 transition-all"
                            style={{
                                background: selectedBlessing
                                    ? `linear-gradient(135deg, ${deity.color}, #8B4513)`
                                    : 'rgba(255,255,255,0.05)',
                                color: selectedBlessing ? 'white' : 'rgba(255,255,255,0.2)',
                                boxShadow: selectedBlessing ? `0 8px 32px ${deity.glowColor}` : 'none',
                            }}
                        >
                            🙏 虔诚祈愿
                        </button>
                    </div>
                )}

                {/* ── Phase: Blessed ── */}
                {prayerPhase === 'blessed' && (
                    <div className="w-full max-w-sm space-y-5 text-center">
                        {/* Blessed Message */}
                        <div
                            className="rounded-3xl p-8 border relative overflow-hidden"
                            style={{
                                background: `linear-gradient(135deg, ${deity.color}22, ${deity.color}11)`,
                                borderColor: `${deity.color}44`,
                                boxShadow: `0 0 40px ${deity.glowColor}`,
                                animation: 'goldPulse 3s ease-in-out infinite',
                            }}
                        >
                            <div className="text-5xl mb-4">✨</div>
                            <p className="text-amber-200/60 text-[10px] tracking-[0.3em] font-bold mb-3">佛光普照 · 心愿已达</p>
                            <p className="gold-text text-xl font-black leading-relaxed">{selectedBlessing || customWish}</p>
                            <div className="mt-4 pt-4 border-t border-amber-500/20">
                                <p className="text-amber-300/40 text-[10px]">{deity.name} 已收到您的心愿 · +{meritDelta} 功德</p>
                            </div>
                        </div>

                        {/* Divination Prompt */}
                        <button
                            onClick={() => navigate('/divination')}
                            className="w-full py-5 rounded-3xl font-black text-base text-amber-900 tracking-wider active:scale-95 transition-transform"
                            style={{
                                background: `linear-gradient(135deg, #F5D16B, #D4A017)`,
                                boxShadow: '0 8px 24px rgba(212,160,23,0.4)',
                            }}
                        >
                            🎲 掷杯问卦 · 求聖示
                        </button>

                        {/* Action Buttons */}
                        <div className="flex gap-3">
                            <button
                                onClick={() => {
                                    const msg = `我在心愿殿堂向${deity.name}祈愿："${selectedBlessing}"，获得${meritDelta}功德值！`;
                                    if (navigator.share) navigator.share({ title: '祈福心愿', text: msg });
                                    else alert(msg);
                                }}
                                className="flex-1 py-4 rounded-2xl flex items-center justify-center gap-2 bg-white/10 border border-white/10 text-amber-200 text-sm font-bold active:scale-95 transition-transform"
                            >
                                <Share2 className="w-4 h-4" />分享功德
                            </button>
                            <button
                                onClick={handleReset}
                                className="flex-1 py-4 rounded-2xl flex items-center justify-center gap-2 bg-white/10 border border-white/10 text-amber-200 text-sm font-bold active:scale-95 transition-transform"
                            >
                                <Heart className="w-4 h-4" />再次祈愿
                            </button>
                        </div>

                        {/* Divination Link */}
                        <button
                            onClick={() => navigate('/divination')}
                            className="flex items-center justify-center gap-2 text-amber-400/60 text-xs font-bold"
                        >
                            <Sparkles className="w-3 h-3" /> 查看今日运势签文
                        </button>
                    </div>
                )}
            </div>

            {/* ── Bottom Merit Bar ── */}
            <div className="shrink-0 px-4 pb-8 z-10 relative">
                <div
                    className="rounded-2xl p-4 flex items-center justify-between"
                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(212,160,23,0.15)' }}
                >
                    <div className="flex items-center gap-3">
                        <div className="text-2xl">🌟</div>
                        <div>
                            <p className="text-amber-200/60 text-[10px] font-bold">我的功德值</p>
                            <p className="gold-text text-xl font-black">{merit}</p>
                        </div>
                    </div>
                    <button
                        onClick={() => navigate('/divination')}
                        className="px-5 py-3 rounded-xl text-amber-900 font-black text-xs active:scale-90 transition-transform"
                        style={{ background: 'linear-gradient(135deg, #F5D16B, #D4A017)' }}
                    >
                        <Star className="w-4 h-4 inline mr-1" />掷杯问卦
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Prayer;
