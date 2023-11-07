const config={
	width:1920,//ancho
	height:1080,//alto
	scale: { // para establecer responsive
		mode: Phaser.Scale.FIT,
		autoCenter: Phaser.Scale.CENTER_BOTH,
		parent:"container" // es el contenedor id creado en el html
	},
	backgroundColor:"#9b59b6",//color de fondo
	type:Phaser.AUTO,// permite detectar la mejor opción entre renderizado en Canvas o WebGL
	scene:{ //escenas
		preload:preload, // cargar estos recursos (imágenes, audio, spritesheets, etc.)
		create:create,// se utiliza para crear los elementos visuales del juego
		update:update,// se utiliza para actualizar el estado del juego
	},
	physics:{
		default:'arcade',//se utiliza para especificar el motor de física
		arcade:{
			gravity:{y:0},
			gravitx:{x:0},
			debug:false
			}
		}    
	}
let game = new Phaser.Game(config) // se instancia el objeto game
let w,h;
let player;
let amigo0,amigo1,amigo2;
let submarino;
let vidas=10;
let puntosParaGanar=50;
let bullet;
let mouseY = 0;
let mouseX = 0;
let isDown = false;
let lastFired = 0;
let stats;
let speed;
let ship;
let bullets;
let burbujas;
function preload(){
	this.physics.world.setBoundsCollision(false,true,true,true);
	this.load.image('fondo', 'assets/fondos/f1.png');
	this.load.image('burbujas', 'assets/img/burbujas.png');
	this.load.image('player', 'assets/submarinos/player0.png');
	this.load.image('amigo0', 'assets/submarinos/amigo0.png');
	this.load.image('amigo1', 'assets/submarinos/amigo1.png');
	this.load.image('amigo2', 'assets/submarinos/amigo2.png');
	this.load.image('bullet', 'assets/img/balaHor.png');
	// imagenes de ganaste y perdiste
	this.load.image('ganaste','assets/img/ganaste.png');
	this.load.image('gameover','assets/img/gameover01.png');
	// sonidos
	this.load.audio('disparo','assets/sonidos/disparos.mp3');
	this.load.audio('captura','assets/sonidos/captura1.mp3')
	this.load.audio('pierde','assets/sonidos/pierde.mp3');
	//enemigos naves espaciales
	this.load.image('ene01','assets/submarinos/sub1.png');
	this.load.image('ene02','assets/submarinos/sub2.png');
	this.load.image('ene03','assets/submarinos/sub3.png');
	this.load.image('ene04','assets/submarinos/sub4.png');
	this.load.image('ene05','assets/submarinos/sub5.png');
	this.load.image('ene06','assets/submarinos/sub6.png');
	this.load.image('ene07','assets/submarinos/sub7.png');
	this.load.image('ene08','assets/submarinos/sub8.png');
	this.load.image('ene09','assets/submarinos/sub9.png');
	this.load.image('ene10','assets/submarinos/sub10.png');
	this.load.image('ene11','assets/submarinos/sub11.png');
	this.load.image('ene12','assets/submarinos/sub12.png');

	
}
function create(){

	w=game.config.width/2;
	h=game.config.height/2;
	// sonidos
	disparo      = this.sound.add('disparo');
	captura      = this.sound.add('captura');
	pierde       = this.sound.add('pierde');
	// fondo
	this.add.image(0,0,'fondo').setOrigin(0);


	// burbujas
	const emitter1 = this.add.particles('burbujas').createEmitter({
		x: 250,
		y: game.config.height,
		speed: { min: -100, max: 100 },
		angle: { min: 0, max: 360 },
		frequency: 100,
		lifespan: 5000,
		gravityY: -200,
		scale: { start: 1, end: 0 },
		alpha: { start: 1, end: 0 },
		blendMode: 'ADD'
	  });
	const emitter = this.add.particles('burbujas').createEmitter({
		x: w,
		y: game.config.height,
		speed: { min: -100, max: 100 },
		angle: { min: 0, max: 360 },
		frequency: 100,
		lifespan: 5000,
		gravityY: -200,
		scale: { start: 1, end: 0 },
		alpha: { start: 1, end: 0 },
		blendMode: 'ADD'
	  });
	  const emitter2 = this.add.particles('burbujas').createEmitter({
		x: game.config.width-200,
		y: game.config.height,
		speed: { min: -100, max: 100 },
		angle: { min: 0, max: 360 },
		frequency: 100,
		lifespan: 5000,
		gravityY: -200,
		scale: { start: 1, end: 0 },
		alpha: { start: 1, end: 0 },
		blendMode: 'ADD'
	  });
	  
	
	  //emitter.setParticleTexture('burbujas');
	  //emitter1.start();
	  //emitter.start();
	//player
	player=this.physics.add.sprite(w,h,'player');// ubicacion del player
	player.setOrigin(0.5);//para que el player este centrado en horizontal
	player.setDepth(10);// numero de la capa
	player.setScale(1);// tamaño del player
	player.setCollideWorldBounds(true);// que tenga colisiones con el mundo
	player.setImmovable(true);// si le pego un enemimo no le afectas las fisicas
	player.puntos=0;// puntos inicioales
	player.vidas=vidas;// vidas iniciales
	cursors = this.input.keyboard.createCursorKeys(); // movimientos con las flechas


	// amigos
	amigo0=this.physics.add.sprite(110,h,'amigo0');// ubicacion del player
	amigo0.setScale(1);// tamaño del player
	amigo0.setCollideWorldBounds(true);// que tenga colisiones con el mundo
	amigo0.setImmovable(true);// si le pego un enemimo no le afectas las fisicas
	amigo0.setBounce(1);//establece los valores de rebote en un objeto 
	//amigo1
	amigo1=this.physics.add.sprite(300,h,'amigo1');// ubicacion del player
	amigo1.setScale(1);// tamaño del player
	amigo1.setCollideWorldBounds(true);// que tenga colisiones con el mundo
	amigo1.setImmovable(true);// si le pego un enemimo no le afectas las fisicas
	amigo1.setBounce(0.5);//establece los valores de rebote en un objeto 
	//amigo2
	amigo2=this.physics.add.sprite(900,900,'amigo2');// ubicacion del player
	amigo2.setScale(1);// tamaño del player
	amigo2.setCollideWorldBounds(true);// que tenga colisiones con el mundo
	amigo2.setImmovable(true);// si le pego un enemimo no le afectas las fisicas
	amigo0.setVelocityY(-50);
	amigo1.setVelocityY(100);	

	//textos
	textoPuntos = this.add.text(100,20, "Puntos: "+player.puntos+" de "+puntosParaGanar,
	{ font: '24px sans serif Bold', fill: '#000000' }).setOrigin(0.5);
	let creador=this.add.text(w,20, "Realizado por Ar Sistema",
	{ font: '24px sans serif Bold', fill: '#000000' }).setOrigin(0.5);
	textoVidas = this.add.text(game.config.width-60,20, "Vidas: "+player.vidas,
	{ font: '24px sans serif Bold', fill: '#000000' }).setOrigin(0.5);
	// balas
	bullets=this.bullets = this.add.group({
		classType: Bullet,
		maxSize: 20,// determina cuantas balas pueden salir
		runChildUpdate: true
	});
	this.input.on('pointerdown', pointer =>
	{
		this.isDown = true;
		this.mouseX = pointer.x;
		this.mouseY = pointer.y;
	});

	this.input.on('pointermove', pointer =>
	{
		this.mouseX = pointer.x;
		this.mouseY = pointer.y;

	});
	this.input.on('pointerup', pointer =>
	{
		this.isDown = false;

	});
	enemigos=['ene01','ene02','ene03','ene04','ene05','ene06','ene07','ene08','ene09','ene10','ene11','ene12'];
	this.time.addEvent({
		delay:1500,// cada 900 milesegungos
		loop:true,// que el loop sea infinito (false)
		callback:()=>{
			let ene	=enemigos[Phaser.Math.Between(0,11)]// selecciona un asteroide del arreglo
			let posY 	=Phaser.Math.Between(100,game.config.height-50); // crea la posicion en x que va de 
			let posX 	=Phaser.Math.Between(100,1500); // crea la posicion en x que va de 
			let Tam 	=Phaser.Math.FloatBetween(0.5,1)//para cambiar los tamaÃ±os
			let graX	=Phaser.Math.FloatBetween(10, 250)//afecta la gravedad en x
			let graY	=Phaser.Math.FloatBetween(10, 200)//afecta la gravedad en y
			enemigo   =this.physics.add.image(1900,posY,ene).setScale(Tam) // crea el asteroide
			enemigo.setCollideWorldBounds(true); //permite que colisione
			enemigo.body.setGravity(-graX, 0); //le asigna la gravedad diferente a cada asteroide
			//enemigo.setBounce(0.9);//establece los valores de rebote en un objeto 
			this.physics.add.overlap(bullets, enemigo, eliminaEnemigo, null, this)// balas a las naves enemigas
			this.physics.add.collider(bullets, amigo0, quitaVida, null, this)// balas contra el submarino
			this.physics.add.collider(bullets, amigo1, quitaVida, null, this)// balas contra el amigo1
			this.physics.add.collider(bullets, amigo2, quitaVida, null, this)// balas contra el amigo2
			
			this.physics.add.collider(enemigo, player, quitaVida, null, this)// enemigo contra el player
			this.physics.add.collider(enemigo, amigo0, quitaVida, null, this)// enemigos contra el submarino
			this.physics.add.collider(enemigo, amigo1, quitaVida, null, this)// enemigos contra el amigo1
			this.physics.add.collider(enemigo, amigo2, quitaVida, null, this)// enemigos contra el amigo2

			
		}
	})


}
function eliminaEnemigo(bullets, enemigo){
    if(enemigo.active){
        captura.play();
        player.puntos++;
        textoPuntos.setText("Puntos: "+player.puntos+" de "+puntosParaGanar)
        enemigo.setActive(false);
        enemigo.destroy();
        bullets.setVisible(false);
        bullets.destroy();
    } 
    if( player.puntos>=puntosParaGanar){
        this.add.image(game.config.width/2,game.config.height/2,'ganaste').setDepth(10).setVisible(true).setOrigin(0.5);
        this.add.text(game.config.width/2,game.config.height/2+150, "F5 para Reiniciar",
        { font: '30px Arial Bold', fill: '#FBFBAC' }).setOrigin(0.5);
        game.scene.pause("default") 
    }
}
function quitaVida(enemigo, amigo){
	if(amigo.active){
        amigo.setTint(0xff0000);
        enemigo.setVisible(false);
        enemigo.destroy();
        player.vidas-=1;
        textoVidas.setText("Vidas: "+player.vidas)
        pierde.play()
    }
    if(player.vidas<=0){
        this.add.image(game.config.width/2,game.config.height/2,'gameover').setDepth(10).setVisible(true).setOrigin(0.5);
        this.add.text(game.config.width/2,game.config.height/2+150, "F5 para Reiniciar",
        { font: '30px Arial Bold', fill: '#FBFBAC' }).setOrigin(0.5);
        game.scene.pause("default") 
    }

    this.time.addEvent({
        delay:1800,
        loop:false,
        callback:()=>{
            amigo.setTint(0xffffff);

        } 
    })
}


function update(time, delta){
	player.setRotation(Phaser.Math.Angle.Between(this.mouseX, this.mouseY, player.x, player.y) - Math.PI / 2);
	if (this.isDown && time > lastFired){
		const Bullet = this.bullets.get();
		if (Bullet){
			disparo.play()
			Bullet.fire(this.mouseX, this.mouseY);
			lastFired = time + 250;
		}
		this.physics.add.existing(Bullet);
	}		
}	


class Bullet extends Phaser.GameObjects.Image{
    constructor (scene){
        super(scene, 0, 0, 'bullet');
        this.incX = 0;
        this.incY = 0;
        this.lifespan = 0;
		this.setFlip(true)
		this.setScale(0.5)
        this.speed = Phaser.Math.GetSpeed(800, 1);
    }
    fire (x, y){
        this.setActive(true);
        this.setVisible(true);
        this.setPosition(w, h);
        const angle = Phaser.Math.Angle.Between(x, y, w, h);
        this.setRotation(angle);
        this.incX = Math.cos(angle);
        this.incY = Math.sin(angle);
        this.lifespan = 1000;
    }
    update (time, delta){
        this.lifespan -= delta;
        this.x -= this.incX * (this.speed * delta);
        this.y -= this.incY * (this.speed * delta);
        if (this.lifespan <= 0){
            this.setActive(false);
            this.setVisible(false);
        }
    }
}