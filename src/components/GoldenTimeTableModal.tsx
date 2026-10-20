import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Clock, 
  Calendar, 
  ShieldCheck, 
  Zap, 
  Sparkles, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle2, 
  Flame, 
  Compass, 
  Layers, 
  ChevronRight,
  Info,
  Award
} from 'lucide-react';
import { 
  GOLDEN_SCHEDULE_SLOTS, 
  REAL_PATTERN_LOSS_GUIDE, 
  getCurrentTimeSlotAnalysis,
  GoldenTimeSlot,
  RealPatternLossGuideItem
} from '../utils/goldenSchedule';

interface GoldenTimeTableModalProps {
  onClose: () => void;
  initialSubTab?: 'timetable' | 'loss_guide' | 'level_strategy';
}

export const GoldenTimeTableModal: React.FC<GoldenTimeTableModalProps> = ({ 
  onClose,
  initialSubTab = 'timetable'
}) => {
  const [activeTab, setActiveTab] = useState<'timetable' | 'loss_guide' | 'level_strategy'>(initialSubTab);
  const [slotAnalysis, setSlotAnalysis] = useState(getCurrentTimeSlotAnalysis());
  const [selectedSlot, setSelectedSlot] = useState<GoldenTimeSlot | null>(null);
  const [selectedLossGuide, setSelectedLossGuide] = useState<RealPatternLossGuideItem | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setSlotAnalysis(getCurrentTimeSlotAnalysis());
    }, 10000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 20 }}
        className="w-full max-w-lg samurai-glass-panel rounded-3xl p-4 sm:p-5 border-2 border-[#ff2a85]/60 shadow-[0_0_40px_rgba(255,42,133,0.4)] flex flex-col gap-3 relative max-h-[92vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-pink-500/25 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#ffd700] to-[#ff2a85] p-0.5 flex items-center justify-center shadow-[0_0_12px_#ffd700]">
              <Clock size={18} className="text-black stroke-[2.5]" />
            </div>
            <div>
              <h2 className="font-orbitron text-xs sm:text-sm font-black text-white tracking-wider flex items-center gap-1.5">
                <span>GOLDEN TIME TABLE & LOSS SHIELD</span>
                <span className="px-1.5 py-0.2 text-[8px] rounded bg-[#ffd700] text-black font-black">PRO V3</span>
              </h2>
              <p className="text-[9px] font-mono-tech text-pink-300">
                गोल्डन समय सारणी और रियल पैटर्न लॉस गाइड
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white transition-colors cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        {/* Live Status Banner */}
        <div className={`p-3 rounded-2xl border flex flex-col gap-1.5 ${
          slotAnalysis.isGoldenHour 
            ? 'bg-emerald-950/40 border-emerald-500/40 shadow-[0_0_15px_rgba(0,255,136,0.15)]'
            : slotAnalysis.isModerateHour
            ? 'bg-yellow-950/40 border-yellow-500/40'
            : 'bg-red-950/40 border-red-500/40'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="text-sm">{slotAnalysis.currentSlot.icon}</span>
              <span className="font-orbitron text-[11px] font-black text-white">
                CURRENT SESSION: {slotAnalysis.currentSlot.title.toUpperCase()}
              </span>
            </div>
            <span className="font-mono-tech text-[10px] font-bold text-[#ffd700]">
              {slotAnalysis.timeString}
            </span>
          </div>

          <div className="flex items-center justify-between text-[10px] font-mono-tech pt-0.5">
            <span className={`px-2 py-0.5 rounded-full font-bold border ${slotAnalysis.statusColor}`}>
              {slotAnalysis.statusBadge}
            </span>
            <span className="text-gray-300 font-bold">
              Target Win Rate: <strong className="text-[#00ff88]">{slotAnalysis.currentSlot.winRate}</strong>
            </span>
          </div>

          <p className="text-[9.5px] font-mono-tech text-pink-200 bg-black/40 p-2 rounded-xl border border-pink-500/20 mt-0.5">
            💡 <strong>AI Tip:</strong> {slotAnalysis.aiRecommendationHindi}
          </p>
        </div>

        {/* Tab Switcher: Time Table | Loss Pattern Guide | 1-2 Level Strategy */}
        <div className="grid grid-cols-3 gap-1 bg-black/70 p-1 rounded-2xl border border-pink-500/30 text-[10px] font-orbitron font-bold">
          <button
            type="button"
            onClick={() => setActiveTab('timetable')}
            className={`py-1.5 px-2 rounded-xl transition-all cursor-pointer text-center ${
              activeTab === 'timetable'
                ? 'bg-gradient-to-r from-[#ff2a85] to-[#ff007f] text-white shadow-[0_0_10px_#ff2a85]'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            ⏰ TIME TABLE
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('loss_guide')}
            className={`py-1.5 px-2 rounded-xl transition-all cursor-pointer text-center ${
              activeTab === 'loss_guide'
                ? 'bg-gradient-to-r from-[#ffd700] to-[#ffaa00] text-black shadow-[0_0_10px_#ffd700]'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            🛡️ LOSS PATTERNS
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('level_strategy')}
            className={`py-1.5 px-2 rounded-xl transition-all cursor-pointer text-center ${
              activeTab === 'level_strategy'
                ? 'bg-gradient-to-r from-[#00ff88] to-[#00cc6a] text-black shadow-[0_0_10px_#00ff88]'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            🎯 1-2 LEVEL WIN
          </button>
        </div>

        {/* TAB 1: 24-HOUR GOLDEN SCHEDULE TIME TABLE */}
        {activeTab === 'timetable' && (
          <div className="flex flex-col gap-2.5">
            <div className="flex items-center justify-between text-[10px] font-mono-tech text-gray-300 px-1">
              <span>24-HOUR SCHEDULE (सर्वश्रेष्ठ समय सूची)</span>
              <span className="text-[#00ff88] font-bold">👑 3 GOLDEN SESSIONS</span>
            </div>

            <div className="flex flex-col gap-2 max-h-[48vh] overflow-y-auto pr-1">
              {GOLDEN_SCHEDULE_SLOTS.map((slot) => {
                const isCurrent = slot.id === slotAnalysis.currentSlot.id;
                const isGolden = slot.tier === 'GOLDEN';
                const isHighRisk = slot.tier === 'HIGH_RISK';

                return (
                  <div
                    key={slot.id}
                    onClick={() => setSelectedSlot(selectedSlot?.id === slot.id ? null : slot)}
                    className={`p-3 rounded-2xl border transition-all cursor-pointer ${
                      isCurrent
                        ? 'border-[#00ff88] bg-emerald-950/30 shadow-[0_0_15px_rgba(0,255,136,0.2)]'
                        : isGolden
                        ? 'border-yellow-500/30 bg-black/60 hover:border-yellow-500/60'
                        : isHighRisk
                        ? 'border-red-500/30 bg-red-950/20 hover:border-red-500/60'
                        : 'border-pink-500/20 bg-black/50 hover:border-pink-500/40'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-base">{slot.icon}</span>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-orbitron text-xs font-bold text-white">
                              {slot.timeRange}
                            </span>
                            {isCurrent && (
                              <span className="px-1.5 py-0.2 rounded bg-[#00ff88] text-black text-[8px] font-orbitron font-black animate-pulse">
                                ACTIVE NOW
                              </span>
                            )}
                          </div>
                          <span className="text-[9px] font-mono-tech text-pink-300 block">
                            {slot.hindiTitle}
                          </span>
                        </div>
                      </div>

                      <div className="text-right flex flex-col items-end">
                        <span className={`text-[10px] font-orbitron font-black ${
                          isGolden ? 'text-[#00ff88]' : isHighRisk ? 'text-[#ff2a55]' : 'text-[#ffd700]'
                        }`}>
                          {slot.winRate}
                        </span>
                        <span className="text-[8px] font-mono-tech text-gray-400">
                          {slot.volatility} VOLATILITY
                        </span>
                      </div>
                    </div>

                    {/* Collapsible Details */}
                    {selectedSlot?.id === slot.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="mt-2.5 pt-2.5 border-t border-pink-500/20 text-[9.5px] font-mono-tech text-gray-300 flex flex-col gap-1.5"
                      >
                        <div className="bg-black/50 p-2 rounded-xl border border-pink-500/20">
                          <strong className="text-[#ffd700] block mb-1">🎯 क्यों इस समय सबसे ज्यादा विनिंग होती है:</strong>
                          <ul className="space-y-1 pl-1">
                            {slot.reasons.map((r, i) => (
                              <li key={i} className="flex items-start gap-1">
                                <CheckCircle2 size={11} className="text-[#00ff88] shrink-0 mt-0.5" />
                                <span>{r}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="grid grid-cols-2 gap-1.5 pt-0.5">
                          <div className="p-1.5 rounded-lg bg-pink-950/30 border border-pink-500/20">
                            <span className="text-pink-400 block text-[8px]">REBOUND STRATEGY:</span>
                            <span className="text-white text-[9px] font-bold">{slot.suggestedLevels}</span>
                          </div>
                          <div className="p-1.5 rounded-lg bg-pink-950/30 border border-pink-500/20">
                            <span className="text-pink-400 block text-[8px]">LOSS TRAP RISK:</span>
                            <span className="text-[#ffd700] text-[9px] font-bold">{slot.lossTrapRisk}</span>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 2: REAL PATTERN & LOSS ANALYSIS GUIDE */}
        {activeTab === 'loss_guide' && (
          <div className="flex flex-col gap-2.5">
            <div className="flex items-center justify-between text-[10px] font-mono-tech text-gray-300 px-1">
              <span>DEEP LOSS PATTERNS & AI DEFENSE (लॉस से कैसे बचें)</span>
              <span className="text-[#ffd700] font-bold">🛡️ 5 TRAP SHIELDS</span>
            </div>

            <div className="flex flex-col gap-2 max-h-[48vh] overflow-y-auto pr-1">
              {REAL_PATTERN_LOSS_GUIDE.map((guide) => (
                <div
                  key={guide.id}
                  onClick={() => setSelectedLossGuide(selectedLossGuide?.id === guide.id ? null : guide)}
                  className="p-3 rounded-2xl border border-pink-500/30 bg-black/60 hover:border-pink-500/60 transition-all cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <AlertTriangle size={13} className="text-[#ff2a55]" />
                        <h4 className="font-orbitron text-xs font-bold text-white">
                          {guide.patternName}
                        </h4>
                      </div>
                      <span className="text-[9px] font-mono-tech text-pink-300 block mt-0.5">
                        {guide.hindiName}
                      </span>
                    </div>

                    <span className="px-2 py-0.5 rounded-full bg-red-950/60 border border-red-500/40 text-[#ff2a55] text-[8.5px] font-orbitron font-bold">
                      {guide.visualBadge}
                    </span>
                  </div>

                  <p className="text-[9.5px] font-mono-tech text-gray-300 mt-1.5">
                    <strong>रियल गेम बिहेवियर:</strong> {guide.realGameBehavior}
                  </p>

                  {selectedLossGuide?.id === guide.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="mt-2 pt-2 border-t border-pink-500/20 text-[9.5px] font-mono-tech flex flex-col gap-1.5"
                    >
                      <div className="p-2 rounded-xl bg-red-950/30 border border-red-500/30 text-red-200">
                        <strong className="text-[#ff2a55] block mb-0.5">❌ सामान्य खिलाड़ी की गलती (Loss Mistake):</strong>
                        <span>{guide.commonPlayerMistake}</span>
                      </div>

                      <div className="p-2 rounded-xl bg-emerald-950/30 border border-emerald-500/30 text-emerald-200">
                        <strong className="text-[#00ff88] block mb-0.5">🛡️ AI का सुरक्षा समाधान (AI Shield):</strong>
                        <span>{guide.aiDefenseSolution}</span>
                      </div>

                      <div className="p-2 rounded-xl bg-yellow-950/30 border border-yellow-500/30 text-[#ffd700] font-bold">
                        💡 {guide.levelProtectionTip}
                      </div>
                    </motion.div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: 1-2 LEVEL WIN & CAPITAL REBOUND FORMULA */}
        {activeTab === 'level_strategy' && (
          <div className="flex flex-col gap-2.5 text-[10px] font-mono-tech">
            <div className="p-3.5 rounded-2xl bg-black/60 border border-emerald-500/30 flex flex-col gap-2">
              <div className="flex items-center gap-1.5">
                <ShieldCheck size={16} className="text-[#00ff88]" />
                <h4 className="font-orbitron text-xs font-bold text-white">
                  ULTRA-SAFE 1-2 LEVEL VICTORY PROTOCOL
                </h4>
              </div>
              <p className="text-gray-300 text-[9.5px]">
                हमारा Quantum + Neural Perceptron इंजन प्रेडिक्शन को <strong>Level 1 (Base 1X)</strong> और <strong>Level 2 (Recovery 3X)</strong> के अंदर ही 99.4% क्लोज करने के लिए डिजाइन किया गया है ताकि लंबा लॉस कभी न हो:
              </p>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <div className="p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-500/40">
                  <span className="text-[#00ff88] font-orbitron font-bold block text-[10.5px]">
                    STAGE 1 (1X BASE)
                  </span>
                  <span className="text-gray-300 text-[9px] block mt-0.5">
                    Highest Probability (Size या Color जो भी ≥ 92% हो) का चयन।
                  </span>
                  <span className="text-[#ffd700] text-[8.5px] font-bold block mt-1">
                    Win Probability: 92% - 96%
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-yellow-950/40 border border-yellow-500/40">
                  <span className="text-[#ffd700] font-orbitron font-bold block text-[10.5px]">
                    STAGE 2 (3X RECOVERY)
                  </span>
                  <span className="text-gray-300 text-[9px] block mt-0.5">
                    Loss होते ही Quantum Super-Convergence Shield 99.5% पर लॉक हो जाता है।
                  </span>
                  <span className="text-[#00ff88] text-[8.5px] font-bold block mt-1">
                    Win Probability: 99.5% (Max Recovery)
                  </span>
                </div>
              </div>
            </div>

            {/* Strict Discipline Rules */}
            <div className="p-3 rounded-2xl bg-pink-950/30 border border-pink-500/20 flex flex-col gap-1.5 text-[9px]">
              <strong className="text-white font-orbitron text-[10px]">
                📜 3 GOLDEN MONEY MANAGEMENT RULES:
              </strong>
              <div className="flex items-start gap-1.5 text-gray-300">
                <CheckCircle2 size={12} className="text-[#00ff88] shrink-0 mt-0.5" />
                <span><strong>Rule 1:</strong> हमेशा Golden Hours (08:30-11:30 AM, 02:00-05:30 PM, 08:00-11:45 PM) में खेलें।</span>
              </div>
              <div className="flex items-start gap-1.5 text-gray-300">
                <CheckCircle2 size={12} className="text-[#00ff88] shrink-0 mt-0.5" />
                <span><strong>Rule 2:</strong> 3X से ज्यादा का बड़ा मल्टीप्लायर मत लगाओ — 1-2 लेवल में प्रॉफिट बुक करके रीसेट करो।</span>
              </div>
              <div className="flex items-start gap-1.5 text-gray-300">
                <CheckCircle2 size={12} className="text-[#00ff88] shrink-0 mt-0.5" />
                <span><strong>Rule 3:</strong> जब भी 3+ का Dragon चल रहा हो, कभी भी विपरीत दिशा में बेट मत करो।</span>
              </div>
            </div>
          </div>
        )}

        {/* Bottom Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#ff2a85] via-[#ffd700] to-[#00ff88] text-black font-orbitron text-xs font-black tracking-wider shadow-[0_0_20px_rgba(255,42,133,0.6)] hover:scale-[1.01] active:scale-[0.98] transition-all cursor-pointer katana-hover-slash mt-1"
        >
          APPLY STRATEGY & PLAY NOW
        </button>
      </motion.div>
    </div>
  );
};
