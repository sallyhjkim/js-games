// reference: https://www.cssscript.com/confetti-falling-animation/
var supportsAnimationFrame =
    window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame;
var colors = [
    "rgba(30,144,255,",
    "rgba(107,142,35,",
    "rgba(255,215,0,",
    "rgba(255,192,203,",
    "rgba(106,90,205,",
    "rgba(173,216,230,",
    "rgba(238,130,238,",
    "rgba(152,251,152,",
    "rgba(70,130,180,",
    "rgba(244,164,96,",
    "rgba(210,105,30,",
    "rgba(220,20,60,",
];
var streamingConfetti = false;
var animationTimer = null;
var pause = false;
var lastFrameTime = Date.now();
var particles = [];
var waveAngle = 0;
var context = null;

var width = window.innerWidth;
var height = window.innerHeight;
export class Confetti {
    constructor() {
        this.maxCount = 150; //set max confetti count
        this.speed = 1; //set the particle animation speed
        this.frameInterval = 15; //the confetti animation frame interval in milliseconds
        this.alpha = 1.0; //the alpha opacity of the confetti (between 0 and 1, where 1 is opaque and 0 is invisible)
        this.gradient = false; //whether to use gradients for the confetti particles
        this.start = null; //call to start confetti animation (with optional timeout in milliseconds, and optional min and max random confetti count)
        this.stop = null; //call to stop adding confetti
        this.toggle = null; //call to start or stop the confetti animation depending on whether it's already running
        this.pause = null; //call to freeze confetti animation
        this.resume = null; //call to unfreeze confetti animation
        this.togglePause = null; //call to toggle whether the confetti animation is paused
        this.remove = null; //call to stop the confetti animation and remove all confetti immediately
        this.isPaused = null; //call and returns true or false depending on whether the confetti animation is paused
        this.isRunning = null; //call and returns true or false depending on whether the animation is running
    }
    resetParticle(particle, width, height) {
        particle.color =
            colors[(Math.random() * colors.length) | 0] + (this.alpha + ")");
        particle.color2 =
            colors[(Math.random() * colors.length) | 0] + (this.alpha + ")");
        particle.x = Math.random() * width;
        particle.y = Math.random() * height - height;
        particle.diameter = Math.random() * 10 + 5;
        particle.tilt = Math.random() * 10 - 10;
        particle.tiltAngleIncrement = Math.random() * 0.07 + 0.05;
        particle.tiltAngle = Math.random() * Math.PI;
        return particle;
    }
    runAnimation() {
        if (pause) return;
        else if (particles.length === 0) {
            context.clearRect(0, 0, window.innerWidth, window.innerHeight);
            animationTimer = null;
        } else {
            var now = Date.now();
            var delta = now - lastFrameTime;
            if (!supportsAnimationFrame || delta > this.frameInterval) {
                context.clearRect(0, 0, window.innerWidth, window.innerHeight);
                this.updateParticles();
                this.drawParticles(context);
                lastFrameTime = now - (delta % this.frameInterval);
            }
            animationTimer = requestAnimationFrame(
                this.runAnimation.bind(this)
            );
        }
    }

    drawParticles(context) {
        var particle;
        var x, y, x2, y2;
        for (var i = 0; i < particles.length; i++) {
            particle = particles[i];
            context.beginPath();
            context.lineWidth = particle.diameter;
            x2 = particle.x + particle.tilt;
            x = x2 + particle.diameter / 2;
            y2 = particle.y + particle.tilt + particle.diameter / 2;
            if (this.gradient) {
                var gradient = context.createLinearGradient(
                    x,
                    particle.y,
                    x2,
                    y2
                );
                gradient.addColorStop("0", particle.color);
                gradient.addColorStop("1.0", particle.color2);
                context.strokeStyle = gradient;
            } else context.strokeStyle = particle.color;
            context.moveTo(x, particle.y);
            context.lineTo(x2, y2);
            context.stroke();
        }
    }

    stopConfetti() {
        streamingConfetti = false;
    }
    updateParticles() {
        var particle;
        waveAngle += 0.01;
        for (var i = 0; i < particles.length; i++) {
            particle = particles[i];
            if (!streamingConfetti && particle.y < -15)
                particle.y = height + 100;
            else {
                particle.tiltAngle += particle.tiltAngleIncrement;
                particle.x += Math.sin(waveAngle) - 0.5;
                particle.y +=
                    (Math.cos(waveAngle) + particle.diameter + this.speed) *
                    0.5;
                particle.tilt = Math.sin(particle.tiltAngle) * 15;
            }
            if (
                particle.x > width + 20 ||
                particle.x < -20 ||
                particle.y > height
            ) {
                if (streamingConfetti && particles.length <= this.maxCount)
                    this.resetParticle(particle, width, height);
                else {
                    particles.splice(i, 1);
                    i--;
                }
            }
        }
    }
    setSize(w, h) {
        var canvas = document.getElementById("congrat");
        canvas.style.width = w;
        canvas.style.width = h;
    }
    congrats() {
        window.requestAnimationFrame = (function () {
            return (
                window.requestAnimationFrame ||
                window.webkitRequestAnimationFrame ||
                window.mozRequestAnimationFrame ||
                window.oRequestAnimationFrame ||
                window.msRequestAnimationFrame ||
                function (callback) {
                    return window.setTimeout(callback, this.frameInterval);
                }
            );
        })();
        var canvas = document.getElementById("canvas");
        if (canvas === null) {
            canvas = document.createElement("canvas");
            canvas.setAttribute("id", "canvas");
            canvas.setAttribute(
                "style",
                "display:block;z-index:999999;pointer-events:none;position:fixed;top:0"
            );
            document.body.prepend(canvas);
            canvas.width = width;
            canvas.height = height;
            window.addEventListener(
                "resize",
                function () {
                    canvas.width = width;
                    canvas.height = height;
                },
                true
            );
            context = canvas.getContext("2d");
        } else if (context === null) context = canvas.getContext("2d");
        var count = this.maxCount;

        while (particles.length < count)
            particles.push(this.resetParticle({}, width, height));
        streamingConfetti = true;
        this.runAnimation();
        window.setTimeout(this.stopConfetti, 5000);
    }
}
