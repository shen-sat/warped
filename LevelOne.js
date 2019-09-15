class LevelOne extends Phaser.Scene {

	constructor() {
		super({key: 'LevelOne'});
	}

	preload() {
		this.load.image('bg', 'assets/bg-3.png');
		this.load.spritesheet('ship', 'assets/ship-with-thrusts.png', { frameWidth: 106, frameHeight: 77 }, 8);
		this.load.image('fg', 'assets/foreground-2.png');
		this.load.spritesheet('bullet', 'assets/bullet.png', { frameWidth: 13, frameHeight: 5 }, 2);
		
		
		
	}

	create() {
		//Set background and foreground
		this.bg = this.add.tileSprite(224, 224, 224 * 3, 224, 'bg');
		this.bg.setScale(2);
		this.fg = this.add.tileSprite(224, 224, 224 * 3, 224, 'fg');
		this.fg.setScale(2);
		//Set ship and its animation
		this.ship = this.physics.add.sprite(224, 180, 'ship');
		this.shipTwo = this.physics.add.sprite(400, 180, 'ship');
		// this.ship.setCollideWorldBounds(false);

		this.anims.create({
			key: 'idle',
			frames: this.anims.generateFrameNumbers('ship', { frames: [0,1,2,3,4,5,6,7,8]}),
			frameRate: 12,
			repeat: -1
		});
		this.ship.play('idle');
		//Set bullet animation	
		this.anims.create({
			key: 'fizz',
			frames: this.anims.generateFrameNumbers('bullet', { frames: [0,1]}),
			frameRate: 20,
			repeat: -1
		});
		//Set depth
		this.bg.depth = 0;
		this.ship.depth = 1;
		this.fg.depth = 2;
		//Keys
		this.keys = this.input.keyboard.createCursorKeys();
		this.keyA = this.input.keyboard.addKey('A');
		//Speeds
		this.shipVerticalSpeed = 0;
		this.shipHorizontalSpeed = 0;
		//Bullets setup
		this.bulletsConfig = {
			key: 'bullet',
			repeat: 9,
			active: false,
			setScale: {
				x: 2,
				y: 2
			},
			createCallback: this.foobar(),
			runChildUpdate: true
			
		}
		this.bullets = this.physics.add.group(this.bulletsConfig);

		//Other	
		this.keyAIsDown = false;
		this.physics.add.overlap(this.ship, this.shipTwo, this.barfoo);

	}

	update() {
		if (this.keyA.isDown && !this.keyAIsDown) {
			this.keyAIsDown = true;
			this.fire();
		} else if (this.keyA.isUp) {
			this.keyAIsDown = false;
		}
		// console.log(this.gunPosition());
		this.bg.tilePositionX += 5;
		this.fg.tilePositionX += 7;

		if (this.keys.up.isDown) {
			this.shipVerticalSpeed = -5;
		} else if (this.keys.down.isDown) {
			this.shipVerticalSpeed = 5;
		} else {
			if (this.shipVerticalSpeed < 0) {
				if (this.shipVerticalSpeed + 0.2 > 0) {
					this.shipVerticalSpeed = 0;
				} else {
					this.shipVerticalSpeed += 0.2;
				}
			} else if (this.shipVerticalSpeed > 0) {
				if (this.shipVerticalSpeed - 0.2 < 0) {
					this.shipVerticalSpeed = 0;
				} else {
					this.shipVerticalSpeed -= 0.2;
				}
			}
		}
		if (this.keys.left.isDown) {
			this.shipHorizontalSpeed = -5;
		} else if (this.keys.right.isDown) {
			this.shipHorizontalSpeed = 5;
		} else {
			if (this.shipHorizontalSpeed < 0) {
				if (this.shipHorizontalSpeed + 0.2 > 0) {
					this.shipHorizontalSpeed = 0;
				} else {
					this.shipHorizontalSpeed += 0.2;
				}
			} else if (this.shipHorizontalSpeed > 0) {
				if (this.shipHorizontalSpeed - 0.2 < 0) {
					this.shipHorizontalSpeed = 0;
				} else {
					this.shipHorizontalSpeed -= 0.2;
				}
			}
		}
		this.ship.y += this.shipVerticalSpeed;
		this.ship.x += this.shipHorizontalSpeed;

		// console.log(this.firstBullet);
		// this.ship.body.checkWorldBounds();
		// this.ship.setCollideWorldBounds(false);
		
		// this.isOverlapping = this.physics.world.overlap(this.ship, this.world);
		// console.log(this.isOverlapping);		
	}

	fire() {
		this.firstBullet = this.bullets.getFirstDead();
		if (this.firstBullet) {
			this.firstBullet.active = true;
			this.firstBullet.setPosition(this.ship.x, this.ship.y);
			this.firstBullet.body.velocity.x = 500;
		}

	}
	foobar() {
		console.log("Hello World");
	}
	barfoo(object, objectNext) {
		console.log(object);
	}
}