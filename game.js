const config = {
	type: Phaser.AUTO,
	width: 224 * 3,
	height: 224 * 2,
	backgroundColor: '#88F',
	roundPixels: true,
	pixelArt: true,
	parent: 'foobar',
	autoCenter: Phaser.Scale.Center.CENTER_BOTH,
	physics: {
		default: 'arcade',
		arcade: {
			debug: true
		}
	},
	scene: [ LevelOne ]
};

const game = new Phaser.Game(config);