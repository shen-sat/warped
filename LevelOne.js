class LevelOne extends Phaser.Scene {

	constructor() {
		super({key: 'LevelOne'});
	}

	preload() {
		this.load.image('bg', 'assets/bg-3.png');
		
		
	}

	create() {
		this.bg = this.add.tileSprite(224, 224, 224 * 3, 224, 'bg');
		this.bg.setScale(2);
	}

	update() {
		this.bg.tilePositionX += 5;
		// if (this.keys.right.isDown) {
		// 	this.example.y -= 1;
		// };	
	}
}