**Render on canvas images**. <br>
Options default:<br>
  1.**fps**: '30'<br>
  2.**firstFrame**: '0'<br>
  3.**lastFrame**: 'Array length'<br>
  4.**images**: 'Array images'<br>
  5.**loop**: 'false'<br>
  
let animate = new Animate('canvas-id',{ <br>
    fps:20, <br>
    images:['img/img.jpg','img/img.jpg','img/img.jpg','img/img.jpg'] <br>
})<br>
animate.start();

