window.requestAnimFrame = (function () {
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function (callback, element) {
            window.setTimeout(callback, 1000 / 60);
        };
})();

class Animate {
    constructor(canvasId, options) {
        let defaultOptions = {
            fps: 30,
            firstFrame: 0,
            lastFrame: (options.images || []).length,
            images: [],
            loop: false
        };

        options = Object.assign(defaultOptions, options);

        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.options = options;
        this._loop = this.loop.bind(this);
        this.lastTimestamp = Date.now();
        this.fpsInterval = 1000 / options.fps;
        this.isPause = false;
    }

    start() {
        this.loadImages(this.options.images)
            .then(this.onLoadImages.bind(this))
            .catch(function (err) {
                console.error(err);
            });
    }

    onLoadImages(images) {
        this.images = images;
        this.currentFrame = this.options.firstFrame;
        this.loop();
    }

    loadImages(images) {
        images = images.map(function (srcImg) {
            return new Promise(function (resolve, reject) {
                let img = new Image();
                img.onload = function () {
                    resolve(img);
                };
                img.src = srcImg;
                img.onerror = reject;
            });
        });

        return Promise.all(images);
    }

    loop() {
        requestAnimFrame(this._loop);
        let now = Date.now();
        let elapsed = now - this.lastTimestamp;
        if (this.isPause) {
            return;
        }
        if (this.options.loop) {
            if (elapsed > this.fpsInterval) {
                this.lastTimestamp = now - (elapsed % this.fpsInterval);
                this.draw();
            }
        } else {
            if (this.currentFrame >= this.options.lastFrame - 1) {
                return
            }
            if (elapsed > this.fpsInterval) {
                this.lastTimestamp = now - (elapsed % this.fpsInterval);
                this.draw();
            }
        }


    }

    draw() {
        let image = this.images[this.currentFrame];
        this.clear();
        this.ctx.drawImage(image, 0, 0, image.width, image.height, 0, 0, image.width, image.height);

        if (this.currentFrame === this.options.lastFrame - 1) {
            this.currentFrame = this.options.firstFrame;
        }

        this.currentFrame++;
    }

    clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

export default Animate;
