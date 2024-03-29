class LevelOne extends Phaser.Scene {

	constructor() {
		super({key: 'LevelOne'});
	}

	preload() {
		this.load.image('bg', 'assets/bg-3.png');
		this.load.spritesheet('ship', 'assets/ship-with-thrusts.png', { frameWidth: 106, frameHeight: 77 }, 8);
		this.load.image('fg', 'assets/foreground-2.png');
		this.load.spritesheet('bullet', 'assets/bullet.png', { frameWidth: 13, frameHeight: 5 }, 2);
		this.load.spritesheet('boss', 'assets/boss-jostle.png', { frameWidth: 165, frameHeight: 156 }, 8)
	}

	create() {
		//Set background and foreground
		this.bg = this.add.tileSprite(224, 224, 224 * 3, 224, 'bg');
		this.bg.setScale(2);
		this.fg = this.add.tileSprite(224, 224, 224 * 3, 224, 'fg');
		this.fg.setScale(2);
		//Set ship and its animation
		this.ship = this.physics.add.sprite(224, 180, 'ship');
		this.anims.create({
			key: 'idle',
			frames: this.anims.generateFrameNumbers('ship', { frames: [0,1,2,3,4,5,6,7,8]}),
			frameRate: 12,
			repeat: -1
		});
		this.ship.play('idle');
		// //Set boss
		this.boss = this.physics.add.sprite(500, this.cameras.main.height/2, 'boss');
		this.boss.y = this.cameras.main.height + this.boss.height;
		this.boss.setScale(2);
		this.anims.create({
			key: 'jostle',
			frames: this.anims.generateFrameNumbers('boss', { frames: [0,1,2,3,4,5,6,7,8]}),
			frameRate: 12,
			repeat: -1
		});
		this.boss.play('jostle');	
		this.boss.body.setSize(this.boss.width,this.boss.height/1.5,(0,0));
		this.bossIntro = true;
		this.bossNormalMovement = false;
		this.bossReadyForFirstFire = true; //Flag to kick of shoot event
		//Set depth of objects
		this.bg.depth = 0;
		this.ship.depth = 1;
		this.fg.depth = 2;
		//Bullets setup
		this.bulletsConfig = {
			key: 'bullet',
			repeat: 9,
			active: false,
			visible: false,
			setScale: {
				x: 2,
				y: 2
			}
		}
		this.bullets = this.physics.add.group(this.bulletsConfig);
		//Set bullet animation	
		this.anims.create({
			key: 'fizz',
			frames: this.anims.generateFrameNumbers('bullet', { frames: [0,1]}),
			frameRate: 20,
			repeat: -1
		});
		//Create bullet catcher
		this.bulletCatcher = this.physics.add.sprite(this.cameras.main.width/2, this.cameras.main.height/2, null);
		this.bulletCatcher.setVisible(false);
		this.bulletCatcher.displayHeight = this.cameras.main.height;
		this.physics.add.overlap(this.bulletCatcher, this.bullets, this.catchBullet);
		this.bulletCatcher.x = this.cameras.main.width + this.bulletCatcher.width/2;
		//Keys
		this.keys = this.input.keyboard.createCursorKeys();
		this.keyA = this.input.keyboard.addKey('A');
		this.keyAIsDown = false;
		//Speeds
		this.shipVerticalSpeed = 0;
		this.shipHorizontalSpeed = 0;
	}

	update() {
		//Movement
		if (this.keyA.isDown && !this.keyAIsDown) {
			this.keyAIsDown = true;
			this.fire();
		} else if (this.keyA.isUp) {
			this.keyAIsDown = false;
		}
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
		this.bossMovement();
	}

	fire() {
		this.bulletFired = this.bullets.getFirstDead();
		if (this.bulletFired) {
			this.bulletFired.debugShowBody = false; // For screenshot purposes
			this.bulletFired.debugShowVelocity = false; // For screenshot purposes
			this.bulletFired.setActive(true);
			this.bulletFired.setVisible(true);
			this.bulletFired.setPosition(this.ship.x, this.ship.y);
			this.bulletFired.body.velocity.x = 500;
		}

	}
	catchBullet(bulletCatcher, bullet) {	
		bullet.setActive(false);
		bullet.setVisible(false);

	}

	bossMovement() {
		if (this.boss.y > this.cameras.main.height/2 && this.bossIntro) {
			//Intro movement
			this.boss.setVelocity(0, -100);
		} else if (this.bossNormalMovement == false) {
			//Bounce movement
			this.bossIntro = false;
			this.bossNormalMovement = true
			this.boss.setBounce(1);
			this.boss.setCollideWorldBounds(true);
			this.boss.setVelocity(0, -200);
			//Randomly stop (to fire)
		} else if (this.bossReadyForFirstFire) {
			this.bossReadyForFirstFire = false;
			this.addBossShootEvent();
		}		
	}

	addBossShootEvent() {
		if (this.timedEvent) { this.timedEvent.destroy() } 
		this.timedEvent = this.time.addEvent({ 
			delay: Math.random() * 10 * 500, 
			callback: this.bossShoot, 
			callbackScope: this,
			loop: true
		});﻿﻿	
	}

	bossShoot() {
		console.log('BZZZT!');
		this.addBossShootEvent();
	}

}