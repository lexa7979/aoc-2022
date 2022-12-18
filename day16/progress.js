class Progress {
  /**
   * @param {object} inputBag
   * @param {Function | null} [inputBag.handleLogEvent]
   */
  constructor({ handleLogEvent = null }) {
    this.handleLogEvent = handleLogEvent;
    this.prevProgressPercentage = null;
    this.prevProgressLogMS = 0;
  }

  init(maxStepCount) {
    if (!this.handleLogEvent) {
      return;
    }

    if (this.maxStepCount < 1) {
      throw new Error("Invalid maxStepCount");
    }
    this.currStepCount = 0;
    this.prevProgressPercentage = null;
    this.maxStepCount = maxStepCount;
    this.startTS = Date.now();

    this.handleLogEvent([`${new Date().toLocaleTimeString()}:`, "init,", `awaiting ${maxStepCount} steps`].join(" "));
    this.prevProgressLogMS = this.startTS;
  }

  step(currStepCount) {
    if (!this.handleLogEvent || !this.startTS || currStepCount === 0) {
      return;
    }

    const now = Date.now();
    const currProgress = currStepCount / this.maxStepCount;
    const currProgressPercentage = Math.floor(currProgress * 100);

    const hasAlreadyLoggedCurrentProgressPercentage =
      this.prevProgressPercentage != null && currProgressPercentage <= this.prevProgressPercentage;
    const hasNotPassedLogTimeoutForFirstPercentage =
      this.prevProgressPercentage == null && currProgressPercentage === 0 && now - this.startTS < 60000;
    const hasJustLogged = now - this.prevProgressLogMS < 5000;
    if (hasAlreadyLoggedCurrentProgressPercentage || hasNotPassedLogTimeoutForFirstPercentage || hasJustLogged) {
      return;
    }

    this.prevProgressLogMS = now;
    this.prevProgressPercentage = currProgressPercentage;

    const runningMS = now - this.startTS;

    const estimatedStepTimeMS = runningMS / currStepCount;
    const estimatedTotalMS = estimatedStepTimeMS * this.maxStepCount;
    const stepsPerSecond = Math.floor((1000 / estimatedStepTimeMS) * 10) / 10;

    const currTime = new Date(now).toLocaleTimeString();
    const estimatedFinishTime = new Date(this.startTS + estimatedTotalMS).toLocaleTimeString();

    this.handleLogEvent(
      [
        `${currTime}:`,
        currProgressPercentage === 0 ? `1 min gone` : `${currProgressPercentage}% done`,
        `(${currStepCount} steps),`,
        `ready ~${estimatedFinishTime}`,
        `(${stepsPerSecond} steps/sec)`,
      ].join(" ")
    );
  }

  finalize() {
    if (!this.handleLogEvent || !this.startTS) {
      return;
    }

    const runningTimeMS = Date.now() - this.startTS;

    let runningTimeText = new Date(new Date(2022, 1, 1, 0, 0, 0).getTime() + runningTimeMS).toLocaleTimeString();
    if (runningTimeMS < 10000) {
      runningTimeText = `${runningTimeMS} ms`;
    } else if (runningTimeMS < 120000) {
      runningTimeText = `${Math.floor(runningTimeMS / 1000)} s`;
    }

    this.handleLogEvent(
      [
        `${new Date().toLocaleTimeString()}:`,
        "finished,",
        `processed ${this.maxStepCount} steps`,
        `in ${runningTimeText}`,
      ].join(" ")
    );

    this.startTS = null;
  }
}

module.exports = Progress;
