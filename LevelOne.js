class LevelOne extends Phaser.Scene {

	constructor() {
		super({key: 'LevelOne'});
	}

	preload() {
		this.load.image('bg', 'assets/bg-3.png');
		this.load.spritesheet('ship', 'assets/ship-with-thrusts.png', { frameWidth: 106, frameHeight: 77 }, 8);
		this.load.image('fg', 'assets/foreground-2.png');
		
		
		
	}

	create() {
		
		this.bg = this.add.tileSprite(224, 224, 224 * 3, 224, 'bg');
		this.bg.setScale(2);
		this.anims.create({
			key: 'idle',
			frames: this.anims.generateFrameNumbers('ship', { frames: [0,1,2,3,4,5,6,7,8]}),
			frameRate: 12,
			repeat: -1
		});
		this.ship = this.add.sprite(224, 180, 'ship');
		this.ship.play('idle');
		this.fg = this.add.tileSprite(224, 224, 224 * 3, 224, 'fg');
		this.fg.setScale(2);

	}

	update() {
		this.bg.tilePositionX += 5;
		this.fg.tilePositionX += 7;
		// if (this.keys.right.isDown) {
		// 	this.example.y -= 1;
		// };	
	}
}