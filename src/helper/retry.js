function getExponentialBackoffDelay(attempt, base = 1000, max = 30000) {
  const expDelay = Math.min(base * 2 ** (attempt - 1), max);
  const jitter = Math.floor(Math.random() * (expDelay * 0.3));
  return expDelay + jitter;
}


async function retry(fn, retries = 5, baseDelayMs = 1000) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      return await fn();
    } catch (err) {
      const isLastAttempt = attempt === retries;
      const delayMs = getExponentialBackoffDelay(attempt, baseDelayMs);

      console.warn(`⚠️ Attempt ${attempt} failed: ${err.message || err}`);
      if (isLastAttempt) {
        console.error("❌ All retry attempts failed.");
        throw err;
      }

      console.log(`⏳ Retrying in ${(delayMs / 1000).toFixed(2)}s...\n`);
      await sleep(delayMs);
    }
  }
}

module.exports = retry;