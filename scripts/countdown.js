class Countdown {
    timeLeft = null;
    running = false;
    interval = null;
    onComplete = () => {};
    onTick = () => {};

    constructor(length) {
        this.len = length;
    }

    clear() {
        clearInterval(this.interval)
    }

    go() {
        this.clear()
        this.interval = setInterval(() => {
            this.timeLeft -= 0.1;
            this.onTick(this.timeLeft);
            if (this.timeLeft <= 0) {
                this.clear()
                this.timeLeft = 0;
                this.onComplete()
            }
        }, 100)
    }

    startFromBeginning() {
        this.timeLeft = this.len
        this.go()
    }
}

export {
    Countdown
}