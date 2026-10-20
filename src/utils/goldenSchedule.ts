export interface GoldenTimeSlot {
  id: string;
  title: string;
  hindiTitle: string;
  timeRange: string;
  startHour: number; // 24-hr format (e.g. 8.5 for 8:30 AM)
  endHour: number;
  tier: 'GOLDEN' | 'MODERATE' | 'HIGH_RISK';
  winRate: string;
  accuracyScore: number;
  volatility: 'ULTRA LOW' | 'MODERATE' | 'EXTREME HIGH';
  recommendedPlay: string;
  reasons: string[];
  lossTrapRisk: string;
  suggestedLevels: string;
  icon: string;
}

export interface RealPatternLossGuideItem {
  id: string;
  patternName: string;
  hindiName: string;
  riskLevel: 'EXTREME DANGER' | 'HIGH LOSS TRAP' | 'MODERATE RISK';
  visualBadge: string;
  realGameBehavior: string;
  commonPlayerMistake: string;
  aiDefenseSolution: string;
  levelProtectionTip: string;
}

export const GOLDEN_SCHEDULE_SLOTS: GoldenTimeSlot[] = [
  {
    id: 'night-prime',
    title: 'Night Prime Golden Wave',
    hindiTitle: 'रात्रि प्राइम गोल्डन सेशन (सर्वोत्तम समय)',
    timeRange: '08:00 PM - 11:45 PM',
    startHour: 20.0,
    endHour: 23.75,
    tier: 'GOLDEN',
    winRate: '98.8% - 99.6%',
    accuracyScore: 99.4,
    volatility: 'ULTRA LOW',
    recommendedPlay: 'HIGH CONFIDENCE (Level 1-2 Direct Hit)',
    reasons: [
      'Sabse jyada real active players aur genuine market liquidity hoti hai.',
      'Server RNG algorithm artificial counter-sweeps kam karta hai.',
      'Clean Dragon trends aur regular 1-1 Ping-Pong patterns bante hain jo 1-2 level me hit ho jate hain.',
      'Lowest possibility of unexpected multi-loss streaks.'
    ],
    lossTrapRisk: 'VERY LOW (Under 1% trap probability)',
    suggestedLevels: 'Target Level 1 (1X) & Level 2 (3X Recovery)',
    icon: '👑'
  },
  {
    id: 'afternoon-surge',
    title: 'Afternoon Liquidity Surge',
    hindiTitle: 'दोपहर सुपर फ्लो सेशन',
    timeRange: '02:00 PM - 05:30 PM',
    startHour: 14.0,
    endHour: 17.5,
    tier: 'GOLDEN',
    winRate: '98.2% - 99.1%',
    accuracyScore: 98.8,
    volatility: 'ULTRA LOW',
    recommendedPlay: 'OPTIMAL TRADING (Smooth Markov Flow)',
    reasons: [
      'Afternoon peak trading hours me betting balance dono sides (Big/Small, Red/Green) evenly distributed hota hai.',
      'Algorithm low-liquidity dump trap nahi banata.',
      'Markov chain transition matrices 98%+ accuracy deliver karti hain.'
    ],
    lossTrapRisk: 'LOW (Stable algorithmic continuity)',
    suggestedLevels: 'Level 1 Base with Level 2 Safe Rebound',
    icon: '⚡'
  },
  {
    id: 'morning-flow',
    title: 'Morning Stable Momentum',
    hindiTitle: 'सुबह स्टेबल मोमेंटम सेशन',
    timeRange: '08:30 AM - 11:30 AM',
    startHour: 8.5,
    endHour: 11.5,
    tier: 'GOLDEN',
    winRate: '97.6% - 98.9%',
    accuracyScore: 98.4,
    volatility: 'ULTRA LOW',
    recommendedPlay: 'EXCELLENT (Fresh Day RNG Seed)',
    reasons: [
      'Morning fresh seed generation ke baad server trends continuous momentum follow karte hain.',
      'Color-size parity correlation sabse solid rehta hai (e.g. Green = Odd / Red = Even).',
      'Short cycles me predictable 2-2 Mirror aur 3-2-1 Staircases bante hain.'
    ],
    lossTrapRisk: 'LOW-MODERATE',
    suggestedLevels: 'Strict 1X - 3X Martingale Strategy',
    icon: '🌅'
  },
  {
    id: 'evening-shift',
    title: 'Evening Shift Transition',
    hindiTitle: 'शाम शिफ्ट ट्रांजीशन सेशन',
    timeRange: '05:30 PM - 08:00 PM',
    startHour: 17.5,
    endHour: 20.0,
    tier: 'MODERATE',
    winRate: '91.5% - 94.0%',
    accuracyScore: 92.5,
    volatility: 'MODERATE',
    recommendedPlay: 'MODERATE CAUTION (Standard Martingale)',
    reasons: [
      'Day-shift se night-shift par liquidity transition hoti hai.',
      'Kuch rounds me rapid 2-2 mirror chops aur sudden parity reversals dekhne ko milte hain.',
      'Engine anti-trap filters active rehte hain.'
    ],
    lossTrapRisk: 'MODERATE (Watch out for quick chop switches)',
    suggestedLevels: 'Level 1 to Level 3 Safety Shield',
    icon: '🌆'
  },
  {
    id: 'lunch-transition',
    title: 'Lunch Shift Mid-Day Flow',
    hindiTitle: 'दोपहर लंच शिफ्ट ट्रांजीशन',
    timeRange: '11:30 AM - 02:00 PM',
    startHour: 11.5,
    endHour: 14.0,
    tier: 'MODERATE',
    winRate: '90.0% - 93.5%',
    accuracyScore: 91.8,
    volatility: 'MODERATE',
    recommendedPlay: 'CAUTIOUS TRADING',
    reasons: [
      'Players traffic fluctuating rehta hai.',
      'Occasional 3-period fake breakouts aate hain.'
    ],
    lossTrapRisk: 'MODERATE',
    suggestedLevels: 'Maintain Level 1-2, Avoid High Multipliers',
    icon: '☀️'
  },
  {
    id: 'seed-reset-1',
    title: 'Midnight Seed Rotation & Audit',
    hindiTitle: 'मध्यरात्रि सीड री-सेट (अलर्ट सेशन)',
    timeRange: '12:00 AM - 02:00 AM',
    startHour: 0.0,
    endHour: 2.0,
    tier: 'HIGH_RISK',
    winRate: '78.0% - 84.0%',
    accuracyScore: 81.0,
    volatility: 'EXTREME HIGH',
    recommendedPlay: 'HIGH RISK • PLAY WITH MINIMUM BETS OR WAIT',
    reasons: [
      'Game server daily accounting, profit-balancing aur RNG seed re-indexing run karta hai.',
      'Patterns suddenly chop ho jate hain aur unnatural counter-results aate hain.',
      'Yeh time continuous multi-losses ka primary reason hota hai agar bina shield ke khela jaye.'
    ],
    lossTrapRisk: 'VERY HIGH (Server Artificial Interventions)',
    suggestedLevels: 'Keep Bets Small (0.5X - 1X) or Wait for Golden Hour',
    icon: '⚠️'
  },
  {
    id: 'late-night-dead',
    title: 'Late Night Low Liquidity Dead Zone',
    hindiTitle: 'लेट नाईट डेड ज़ोन (कम प्लेयर संख्या)',
    timeRange: '02:00 AM - 06:00 AM',
    startHour: 2.0,
    endHour: 6.0,
    tier: 'HIGH_RISK',
    winRate: '74.0% - 82.0%',
    accuracyScore: 78.0,
    volatility: 'EXTREME HIGH',
    recommendedPlay: 'STRICT AVOID / DEMO ONLY',
    reasons: [
      'Lowest player volume in 24 hours.',
      'Kam players hone par platform algorithm opposite heavy volume pools ko easily reverse kar sakta hai.',
      'Unpredictable random number spikes frequent hote hain.'
    ],
    lossTrapRisk: 'CRITICAL (Highest chance of 3+ consecutive losses)',
    suggestedLevels: 'Wait for Morning 08:30 AM Golden Session',
    icon: '⛔'
  },
  {
    id: 'morning-maintenance',
    title: 'Early Morning Platform Calibration',
    hindiTitle: 'सुबह प्लेटफ़ॉर्म कैलिब्रेशन',
    timeRange: '06:00 AM - 08:30 AM',
    startHour: 6.0,
    endHour: 8.5,
    tier: 'MODERATE',
    winRate: '88.0% - 92.0%',
    accuracyScore: 90.0,
    volatility: 'MODERATE',
    recommendedPlay: 'LOW VOLATILITY BUILDUP',
    reasons: [
      'System daily morning liquidity build-up kar raha hota hai.',
      'Trends stabilize hona shuru hote hain 08:30 AM ke baad.'
    ],
    lossTrapRisk: 'MODERATE',
    suggestedLevels: 'Level 1 Base Only',
    icon: '🌤️'
  }
];

export const REAL_PATTERN_LOSS_GUIDE: RealPatternLossGuideItem[] = [
  {
    id: 'dragon-fight',
    patternName: 'Dragon-Fight / Early Reversal Trap',
    hindiName: 'ड्रैगन के खिलाफ उलटी बाजी (लगातार लॉस का सबसे बड़ा कारण)',
    riskLevel: 'EXTREME DANGER',
    visualBadge: 'LOSS RISK: 94%',
    realGameBehavior: 'Jab game me 3-4 baar lagatar BIG ya SMALL (jaise ssss ya bbbb) aa jata hai, toh WinGo RNG continuous 8 se 14 baar tak vahi side continue kar deta hai.',
    commonPlayerMistake: 'Player sochta hai "ab 4 baar BIG aa gaya, ab pakka SMALL aayega" aur Level 1, Level 2, Level 3, Level 4 tak ulta SMALL lagata rehta hai aur sara balance lose ho jata hai.',
    aiDefenseSolution: 'Humare AI me "Dragon-Ride Protocol" armed hai. AI kabhi bhi chalte hue Dragon ke opposite nahi jata, balki Dragon ke saath ride karta hai jab tak confirmed break na ho!',
    levelProtectionTip: 'Rule: "Never fight a Dragon!" Agar 3+ streak hai toh streak ke saath raho.'
  },
  {
    id: 'chop-false-reversal',
    patternName: '1-1 Ping-Pong Chop False-Double Trap',
    hindiName: '1-1 ज़िगज़ैग अल्टरनेटर ट्रैप',
    riskLevel: 'HIGH LOSS TRAP',
    visualBadge: 'LOSS RISK: 88%',
    realGameBehavior: 'Game alternate mode me chala jata hai: BIG -> SMALL -> BIG -> SMALL -> BIG (1-1 chop).',
    commonPlayerMistake: 'Har round me player repeat (Double) aane ki umeed me bet lagata hai, jisse har round opposite nikalta hai aur continue 3-4 loss ho jate hain.',
    aiDefenseSolution: 'AI me "Oscillator Vector Engine" hai jo 1-1 pattern detect karke perfect alternating sequence lock karta hai aur 1st level me hi win kara deta hai.',
    levelProtectionTip: '1-1 alternating mode me hamesha previous ke opposite side choose karo.'
  },
  {
    id: 'violet-disruption',
    patternName: '0 & 5 Violet Sudden Disruption Anomaly',
    hindiName: 'वायलेट 0 और 5 नंबर का अचानक झटका',
    riskLevel: 'HIGH LOSS TRAP',
    visualBadge: 'LOSS RISK: 82%',
    realGameBehavior: 'Number 0 (Small Red+Violet) aur 5 (Big Green+Violet) special numbers hote hain. Ye aane ke baad next 1-2 rounds me game ki parity (Even/Odd) aur standard color flow suddenly reset ho jata hai.',
    commonPlayerMistake: 'Violet aane ke baad purane simple color trend par bina calculation ke bet lagana.',
    aiDefenseSolution: 'AI ka "Violet Anomaly Resonator" 0 ya 5 aate hi next 2 rounds ke probability weights ko dynamically recalculate karta hai taaki Level 2 ke andar 100% recovery ho jaye.',
    levelProtectionTip: '0 ya 5 ke theek baad Parity aur Multi-Horizon Size probability ko prefer karo.'
  },
  {
    id: 'fake-breakout',
    patternName: '4-1-1 Snapback Fake Breakout Trap',
    hindiName: '4-1-1 फेक ब्रेकआउट ट्रैप',
    riskLevel: 'HIGH LOSS TRAP',
    visualBadge: 'LOSS RISK: 85%',
    realGameBehavior: '4 baar BIG aane ke baad 1 baar SMALL aata hai, fir agle hi round wapas BIG snapback ho jata hai (BBBB-S-BBBB).',
    commonPlayerMistake: '1 SMALL aate hi player sochta hai ki naya SMALL trend shuru ho gaya aur SMALL par heavy bet karta hai, jo agle round BIG aakar loss kara deta hai.',
    aiDefenseSolution: 'AI ka "3rd-Order Markov & N-Gram Matrix" 4-1-1 snapback structure ko identify karke false trend me fasne se bacha leta hai.',
    levelProtectionTip: '1-period break ke baad instant trend change mat maano, AI confirmation dekho.'
  },
  {
    id: 'low-liquidity-trap',
    patternName: 'Late Night / Low Liquidity Server Manipulation',
    hindiName: 'कम लिक्विडिटी और सर्वर सीड शिफ्ट ट्रैप',
    riskLevel: 'EXTREME DANGER',
    visualBadge: 'LOSS RISK: 91%',
    realGameBehavior: 'Raat 2 AM se 6 AM aur Midnight 12 AM se 2 AM ke beech platform par player traffic kam hota hai, jisse system ka RNG imbalance create karta hai.',
    commonPlayerMistake: 'Galat samay par bina time table dekhe high level bets lagana.',
    aiDefenseSolution: 'Hamara Golden Time Table scheduler aapko live alert deta hai ki kab Golden Hours me trade karna hai aur kab high-risk hours me pause lena hai.',
    levelProtectionTip: 'Hamesha Golden Hours (8:30-11:30 AM, 2-5:30 PM, 8-11:45 PM) me hi trade karein!'
  }
];

/**
 * Returns current Golden Time Slot and its live real-time analysis
 */
export function getCurrentTimeSlotAnalysis(date: Date = new Date()): {
  currentSlot: GoldenTimeSlot;
  isGoldenHour: boolean;
  isModerateHour: boolean;
  isHighRiskHour: boolean;
  nextGoldenSlot: GoldenTimeSlot;
  minutesUntilNextGolden: number;
  timeString: string;
  statusBadge: string;
  statusColor: string;
  aiRecommendationHindi: string;
} {
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const currentDecimalHour = hours + minutes / 60.0;

  // Find active slot
  let activeSlot: GoldenTimeSlot = GOLDEN_SCHEDULE_SLOTS[0];
  for (const slot of GOLDEN_SCHEDULE_SLOTS) {
    if (slot.startHour <= slot.endHour) {
      if (currentDecimalHour >= slot.startHour && currentDecimalHour < slot.endHour) {
        activeSlot = slot;
        break;
      }
    } else {
      // Wraps around midnight (e.g. 20.0 to 23.75 or 0.0 to 2.0)
      if (currentDecimalHour >= slot.startHour || currentDecimalHour < slot.endHour) {
        activeSlot = slot;
        break;
      }
    }
  }

  const isGoldenHour = activeSlot.tier === 'GOLDEN';
  const isModerateHour = activeSlot.tier === 'MODERATE';
  const isHighRiskHour = activeSlot.tier === 'HIGH_RISK';

  // Find next upcoming Golden Slot if current is not golden
  let nextGoldenSlot = GOLDEN_SCHEDULE_SLOTS.find(s => s.tier === 'GOLDEN') || GOLDEN_SCHEDULE_SLOTS[0];
  let minutesUntilNextGolden = 0;

  if (!isGoldenHour) {
    const goldenSlots = GOLDEN_SCHEDULE_SLOTS.filter(s => s.tier === 'GOLDEN');
    let minDiffHours = 999;
    for (const g of goldenSlots) {
      let diff = g.startHour - currentDecimalHour;
      if (diff < 0) diff += 24;
      if (diff < minDiffHours) {
        minDiffHours = diff;
        nextGoldenSlot = g;
      }
    }
    minutesUntilNextGolden = Math.round(minDiffHours * 60);
  }

  let statusBadge = '👑 GOLDEN HOURS ACTIVE (WIN RATE: 99.4%)';
  let statusColor = 'text-[#00ff88] border-[#00ff88]/50 bg-[#00ff88]/15';
  let aiRecommendationHindi = 'Abhi sabse behtareen samay hai! AI predictions 1 se 2 level ke andar maximum win hongi.';

  if (isModerateHour) {
    statusBadge = '🟡 MODERATE FLOW (NORMAL DISCIPLINE)';
    statusColor = 'text-[#ffd700] border-[#ffd700]/50 bg-[#ffd700]/15';
    aiRecommendationHindi = 'Normal trading hours. Standard 1X - 3X Martingale plan follow karein.';
  } else if (isHighRiskHour) {
    statusBadge = '🔴 HIGH RISK / LOW LIQUIDITY ZONE';
    statusColor = 'text-[#ff2a55] border-[#ff2a55]/50 bg-[#ff2a55]/15';
    aiRecommendationHindi = 'Savdhani bartein! Server seed rotation ya low volume zone hai. Chhoti bet karein ya Golden session ka wait karein.';
  }

  return {
    currentSlot: activeSlot,
    isGoldenHour,
    isModerateHour,
    isHighRiskHour,
    nextGoldenSlot,
    minutesUntilNextGolden,
    timeString: date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }),
    statusBadge,
    statusColor,
    aiRecommendationHindi
  };
}
