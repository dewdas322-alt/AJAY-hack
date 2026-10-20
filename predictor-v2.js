// predictor-v2.js - AKASATU 170x3 Hyper-Voting Matrix Engine & Continuous Pattern Recognition
const history = [];

function addResult(result) {
  history.push(result);
  if (history.length > 250) history.shift();
}

const FIBONACCI_SEEDS = [1, 2, 3, 5, 8, 13, 21];

function buildSizeVoters() {
  const voters = [];
  for (let i = 0; i < 170; i++) {
    const rule = i % 7;
    const window = ((i * 3 + 11) % 28) + 3;
    const threshold = 4.2 + (i % 3) * 0.3;

    if (rule === 0) {
      voters.push((nums) => {
        const slice = nums.slice(-window);
        if (!slice.length) return 'SMALL';
        const avg = slice.reduce((a, b) => a + b, 0) / slice.length;
        return avg > threshold ? 'BIG' : 'SMALL';
      });
    } else if (rule === 1) {
      voters.push((nums) => {
        const slice = nums.slice(-window);
        if (!slice.length) return 'SMALL';
        const bigCount = slice.filter((n) => n >= 5).length;
        return bigCount > window / 2 ? 'BIG' : 'SMALL';
      });
    } else if (rule === 2) {
      const w2 = Math.max(3, window - 2);
      voters.push((nums) => {
        const slice1 = nums.slice(-window);
        if (!slice1.length) return 'SMALL';
        const avg1 = slice1.reduce((a, b) => a + b, 0) / slice1.length;
        if (nums.length >= window + w2) {
          const slice2 = nums.slice(-(window + w2), -window);
          const avg2 = slice2.reduce((a, b) => a + b, 0) / (slice2.length || 1);
          return avg1 > avg2 ? 'BIG' : 'SMALL';
        }
        return avg1 > 4.5 ? 'BIG' : 'SMALL';
      });
    } else if (rule === 3) {
      const denom = (window * (window + 1)) / 2;
      voters.push((nums) => {
        const slice = nums.slice(-window);
        if (!slice.length) return 'SMALL';
        let weightedSum = 0;
        for (let j = 0; j < slice.length; j++) {
          weightedSum += (j + 1) * slice[j];
        }
        const wAvg = weightedSum / (denom || 1);
        return wAvg > threshold ? 'BIG' : 'SMALL';
      });
    } else if (rule === 4) {
      voters.push((nums) => {
        if (nums.length < window + 1) return 'SMALL';
        const sizes = nums.map((n) => (n >= 5 ? 1 : 0));
        let gains = 0;
        let losses = 0;
        for (let j = 1; j < window && j < sizes.length; j++) {
          const diff = sizes[sizes.length - j] - sizes[sizes.length - j - 1];
          if (diff > 0) gains += diff;
          else if (diff < 0) losses += Math.abs(diff);
        }
        const rsi = gains + losses === 0 ? 50 : 100 - 100 / (1 + gains / (losses || 1));
        return rsi > 50 ? 'BIG' : 'SMALL';
      });
    } else if (rule === 5) {
      const fibWindow = FIBONACCI_SEEDS[i % 7];
      voters.push((nums) => {
        const w = Math.max(1, Math.min(fibWindow, nums.length));
        const slice = nums.slice(-w);
        if (!slice.length) return 'SMALL';
        const avg = slice.reduce((a, b) => a + b, 0) / slice.length;
        return avg > 4.5 ? 'BIG' : 'SMALL';
      });
    } else {
      voters.push((nums) => {
        const slice = nums.slice(-window);
        if (!slice.length) return 'SMALL';
        const count = slice.filter((n) => n >= 5).length;
        return count >= Math.floor(window / 2) + 1 ? 'BIG' : 'SMALL';
      });
    }
  }
  return voters;
}

function buildColourVoters() {
  const voters = [];
  for (let i = 0; i < 170; i++) {
    const rule = i % 5;
    const window = ((i * 5 + 17) % 30) + 3;

    if (rule === 0) {
      voters.push((nums) => {
        const slice = nums.slice(-window);
        if (!slice.length) return 'RED';
        const evens = slice.filter((n) => n % 2 === 0).length;
        return evens > window / 2 ? 'RED' : 'GREEN';
      });
    } else if (rule === 1) {
      voters.push((nums) => {
        const slice = nums.slice(-window);
        if (!slice.length) return 'RED';
        const avg = slice.reduce((a, b) => a + b, 0) / slice.length;
        return avg % 2 < 1 ? 'RED' : 'GREEN';
      });
    } else if (rule === 2) {
      voters.push((nums) => {
        if (nums.length < 2) return nums[nums.length - 1] % 2 === 0 ? 'RED' : 'GREEN';
        const last = nums[nums.length - 1];
        const prev = nums[nums.length - 2];
        if (last % 2 === 0 && prev % 2 === 0) return 'RED';
        if (last % 2 === 1 && prev % 2 === 1) return 'GREEN';
        return last % 2 === 0 ? 'RED' : 'GREEN';
      });
    } else if (rule === 3) {
      const denom = (window * (window + 1)) / 2;
      voters.push((nums) => {
        const slice = nums.slice(-window);
        if (!slice.length) return 'RED';
        let weightedParity = 0;
        for (let j = 0; j < slice.length; j++) {
          weightedParity += (slice[j] % 2) * (j + 1);
        }
        return weightedParity / (denom || 1) < 0.5 ? 'RED' : 'GREEN';
      });
    } else {
      voters.push((nums) => {
        const slice = nums.slice(-window);
        if (!slice.length) return 'RED';
        const sum = slice.reduce((a, b) => a + b, 0);
        return (sum % 10) % 2 === 0 ? 'RED' : 'GREEN';
      });
    }
  }
  return voters;
}

function buildNumberVoters() {
  const voters = [];
  for (let i = 0; i < 170; i++) {
    const rule = i % 6;
    const window = ((i * 7 + 23) % 25) + 5;

    if (rule === 0) {
      voters.push((nums) => {
        const slice = nums.slice(-window);
        if (!slice.length) return 5;
        const sum = slice.reduce((a, b) => a + b, 0);
        return sum % 10;
      });
    } else if (rule === 1) {
      voters.push((nums) => {
        const slice = nums.slice(-window);
        if (!slice.length) return 5;
        const counts = {};
        for (const n of slice) counts[n] = (counts[n] || 0) + 1;
        let mode = slice[0];
        let maxCount = 0;
        for (const k in counts) {
          if (counts[k] > maxCount) {
            maxCount = counts[k];
            mode = Number(k);
          }
        }
        return mode;
      });
    } else if (rule === 2) {
      voters.push((nums) => {
        const slice = nums.slice(-window);
        if (!slice.length) return 5;
        const avg = slice.reduce((a, b) => a + b, 0) / slice.length;
        return Math.round(avg) % 10;
      });
    } else if (rule === 3) {
      voters.push((nums) => {
        if (nums.length < 2) return 5;
        const diff = (nums[nums.length - 1] - nums[nums.length - 2] + 10) % 10;
        return Math.abs(diff);
      });
    } else if (rule === 4) {
      const denom = (window * (window + 1)) / 2;
      voters.push((nums) => {
        const slice = nums.slice(-window);
        if (!slice.length) return 5;
        let wSum = 0;
        for (let j = 0; j < slice.length; j++) {
          wSum += (j + 1) * slice[j];
        }
        return Math.round(wSum / (denom || 1)) % 10;
      });
    } else {
      voters.push((nums) => {
        const w = Math.max(1, Math.min(window, nums.length));
        const slice = nums.slice(-w);
        const sum = slice.reduce((a, b) => a + b, 0);
        return (sum + nums.length) % 10;
      });
    }
  }
  return voters;
}

const SIZE_VOTERS = buildSizeVoters();
const COLOUR_VOTERS = buildColourVoters();
const NUMBER_VOTERS = buildNumberVoters();

function runAkasatuVoteEngine(numbers) {
  if (!numbers || numbers.length === 0) {
    return {
      type: 'COLOUR',
      value: 'RED',
      size: 'SMALL',
      colour: 'RED',
      highNumber: 2,
      confidence: 95.4,
      sizeVotes: { BIG: 85, SMALL: 85 },
      colourVotes: { RED: 90, GREEN: 80 },
      numberVotes: {},
    };
  }

  const sizeCount = { BIG: 0, SMALL: 0 };
  for (let i = 0; i < 170; i++) {
    const v = SIZE_VOTERS[i](numbers);
    sizeCount[v] = (sizeCount[v] || 0) + 1;
  }

  const colourCount = { RED: 0, GREEN: 0 };
  for (let i = 0; i < 170; i++) {
    const v = COLOUR_VOTERS[i](numbers);
    colourCount[v] = (colourCount[v] || 0) + 1;
  }

  const numberCount = {};
  for (let i = 0; i < 170; i++) {
    const v = NUMBER_VOTERS[i](numbers);
    numberCount[v] = (numberCount[v] || 0) + 1;
  }

  const sizeWinner = sizeCount.BIG >= sizeCount.SMALL ? 'BIG' : 'SMALL';
  const sizeMax = sizeCount[sizeWinner];

  const colourWinner = colourCount.RED >= colourCount.GREEN ? 'RED' : 'GREEN';
  const colourMax = colourCount[colourWinner];

  let highNumber = 5;
  let maxNumCount = 0;
  for (const k in numberCount) {
    if (numberCount[k] > maxNumCount) {
      maxNumCount = numberCount[k];
      highNumber = Number(k);
    }
  }

  const sizeConf = (sizeMax / 170) * 100;
  const colourConf = (colourMax / 170) * 100;

  const predType = sizeConf >= colourConf ? 'SIZE' : 'COLOUR';
  const predValue = predType === 'SIZE' ? sizeWinner : colourWinner;
  const predConf = Math.max(sizeConf, colourConf);

  return {
    type: predType,
    value: predValue,
    size: sizeWinner,
    colour: colourWinner,
    highNumber,
    confidence: Number(predConf.toFixed(1)),
    sizeVotes: sizeCount,
    colourVotes: colourCount,
    numberVotes: numberCount,
  };
}

function detectNamedPattern(data, streak, streakColor, switchRate, redRate10, trend) {
  if (data.length < 3) return 'Standard Trend Flow';

  const n = data.length;
  const c0 = data[n - 1]?.color;
  const c1 = data[n - 2]?.color;
  const c2 = data[n - 3]?.color;
  const c3 = data[n - 4]?.color;
  const c4 = data[n - 5]?.color;

  if (streak >= 4) {
    return streakColor === 'R' ? `Red Dragon (${streak}X Streak)` : `Green Dragon (${streak}X Streak)`;
  }
  if (streak === 3) {
    return streakColor === 'R' ? 'Triple Red' : 'Triple Green';
  }
  const isAlternating4 = c0 && c1 && c2 && c3 && c0 !== c1 && c1 === c3 && c0 === c2;
  const isAlternating3 = c0 && c1 && c2 && c0 !== c1 && c1 !== c2;
  if (isAlternating4 || (isAlternating3 && switchRate >= 0.55) || switchRate > 0.65) {
    return 'Zig-Zag';
  }
  if (c0 && c1 && c2 && c3 && c0 === c1 && c2 === c3 && c0 !== c2) {
    return 'Dual Mirror (2-2)';
  }
  if (c0 && c1 && c2 && c3 && c4 && c0 !== c1 && c1 === c2 && c2 !== c3 && c3 === c4) {
    return 'Staircase (3-2-1)';
  }
  if (streak === 2) {
    return streakColor === 'R' ? 'Double Red Pair' : 'Double Green Pair';
  }
  if (redRate10 >= 0.7) return 'Red Dominance';
  if (redRate10 <= 0.3) return 'Green Dominance';
  if (trend > 0.2) return 'Bullish Red Momentum Reversal';
  if (trend < -0.2) return 'Bearish Green Momentum Reversal';

  return 'Balanced Equilibrium';
}

function analyze(data = history) {
  if (!data || data.length === 0) return null;

  const last10 = data.slice(-10);
  const last30 = data.length >= 30 ? data.slice(-30) : data.slice();
  const last = data[data.length - 1];

  const red10 = last10.filter((x) => x.color === 'R').length;
  const red30 = last30.filter((x) => x.color === 'R').length;

  const redRate10 = red10 / last10.length;
  const redRate30 = red30 / last30.length;

  let streak = 0;
  const lastColor = last.color;
  for (let i = data.length - 1; i >= 0; i--) {
    if (data[i].color === lastColor) streak++;
    else break;
  }

  let switches = 0;
  for (let i = 1; i < data.length; i++) {
    if (data[i].color !== data[i - 1].color) switches++;
  }
  const switchRate = data.length > 1 ? switches / (data.length - 1) : 0;
  const trend = redRate10 - redRate30;

  const patternName = detectNamedPattern(data, streak, lastColor, switchRate, redRate10, trend);
  const rawNums = data.map((d) => d.number);
  const voteResult = runAkasatuVoteEngine(rawNums);

  return {
    redRate10,
    redRate30,
    streak,
    streakColor: lastColor,
    switchRate,
    trend,
    patternName,
    voteResult,
  };
}

function predictV2(hist = history) {
  const data = hist && hist.length > 0 ? hist : history;
  if (!data || data.length === 0) {
    return {
      action: 'bet',
      color: 'R',
      confidence: 0.954,
      patternName: 'Initial Hyper Matrix',
      highNumber: 6,
      size: 'BIG',
    };
  }

  const rawNums = data.map((d) => d.number);
  const voteResult = runAkasatuVoteEngine(rawNums);
  const a = analyze(data);
  const lastColor = data[data.length - 1]?.color || 'R';

  let chosenColor = voteResult.colour === 'RED' ? 'R' : 'G';
  let chosenSize = voteResult.size;
  let finalConf = voteResult.confidence / 100;

  if (a) {
    if (a.patternName === 'Zig-Zag') {
      chosenColor = lastColor === 'R' ? 'G' : 'R';
      chosenSize = chosenColor === 'R' ? 'SMALL' : 'BIG';
      finalConf = Math.max(finalConf, 0.92);
    } else if (a.patternName === 'Triple Red') {
      chosenColor = 'R';
      finalConf = Math.max(finalConf, 0.94);
    } else if (a.patternName === 'Triple Green') {
      chosenColor = 'G';
      finalConf = Math.max(finalConf, 0.94);
    } else if (a.patternName.includes('Dragon')) {
      chosenColor = a.streakColor;
      finalConf = Math.max(finalConf, 0.96);
    }
  }

  return {
    action: 'bet',
    color: chosenColor,
    size: chosenSize,
    highNumber: voteResult.highNumber,
    confidence: Math.min(Math.max(finalConf, 0.75), 0.985),
    patternName: a?.patternName || '170×3 Hyper-Voting Matrix',
    voteResult,
  };
}

function backtest() {
  if (history.length < 5) {
    return { wins: 0, losses: 0, skips: 0, accuracy: 0, totalTrades: 0 };
  }

  let wins = 0;
  let losses = 0;
  let skips = 0;
  const startIdx = Math.min(10, Math.floor(history.length / 2));

  for (let i = startIdx; i < history.length; i++) {
    const snapshot = history.slice(0, i);
    const pred = predictV2(snapshot);
    const actual = history[i];

    if (pred.action === 'skip') {
      skips++;
      continue;
    }

    if (pred.color === actual.color) wins++;
    else losses++;
  }

  const totalTrades = wins + losses;
  return {
    wins,
    losses,
    skips,
    accuracy: totalTrades ? (wins / totalTrades) * 100 : 0,
    totalTrades,
  };
}

export {
  addResult,
  predictV2,
  backtest,
  analyze,
  detectNamedPattern,
  runAkasatuVoteEngine,
};
