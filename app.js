let imageArray = [];

for(let i = 0; i < 15; i++){
    let section = document.createElement('section');
    let div = document.createElement('div');
    div.classList.add('image__container');
    let image = document.createElement('img');
    image.src = `./assets/${i+1}.avif`;

    div.appendChild(image);
    section.appendChild(div);
    document.body.appendChild(section)
}

let options = {
    rootMargin: '0px',
    threshold: 1.0
}

let callback = (entries => {
    entries.forEach(entry => {
        if(entry.isIntersecting){
            console.log(entry.target.classList[0]);
            imageArray[+entry.target.classList[0]].reveal();

        }
    });
})

let observer = new IntersectionObserver(callback, options);

class PixelImage{
    constructor(id, image, width, height){
        this.id = id;
        this.image = image;
        this.styleWidth = width;
        this.styleHeight = height;
        this.width = width * window.devicePixelRatio;
        this.height = height * window.devicePixelRatio;
        this.percent = .001;
        this.applyCanvas();
        this.draw();
    }

    applyCanvas(){
        this.canvas = document.createElement('canvas');
        this.canvas.classList.add(this.id);
        this.ctx = this.canvas.getContext('2d');
        this.image.parentElement.appendChild(this.canvas);
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.canvas.style.width = `${this.styleWidth}px`;
        this.canvas.style.height = `${this.styleHeight}px`;
        this.scaledWidth = this.width * this.percent;
        this.scaledHeight = this.height * this.percent;

        // turn off image aliasing
        this.ctx.msImageSmoothingEnabled = false;
        this.ctx.mozImageSmoothingEnabled = false;
        this.ctx.webkitImageSmoothingEnabled = false;
        this.ctx.imageSmoothingEnabled = false;

        observer.observe(this.canvas);
    }

    draw(){
        this.ctx.drawImage(this.image, 0, 0, this.scaledWidth, this.scaledHeight);
        this.ctx.drawImage(this.canvas, 0, 0, this.scaledWidth, this.scaledHeight, 0, 0, this.width, this.height);
    }

    reveal(){
        this.canvas.classList.add('active');
        this.percent = this.percent < .1 ? this.percent += .002 : this.percent += .2;
        if(this.percent > 1) this.percent = 1;
        this.scaledWidth = this.width * this.percent;
        this.scaledHeight = this.height * this.percent;

        this.ctx.drawImage(this.image, 0, 0, this.scaledWidth, this.scaledHeight);
        this.ctx.drawImage(this.canvas, 0, 0, this.scaledWidth, this.scaledHeight, 0, 0, this.width, this.height);
        if(this.percent < 1) requestAnimationFrame(this.reveal.bind(this));
    }
}

function generatePixelImages(){
    let images = [...document.querySelectorAll('img')];
    images.forEach((image, idx) => {
        let {width, height} = image.getBoundingClientRect();
        let pixelImage = new PixelImage(idx, image, width, height);
        imageArray.push(pixelImage);
    })
}

setTimeout(() => {
    generatePixelImages();
}, 100)