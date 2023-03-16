/*********** VARIABLES ***********/
// Globals variables.
var scene = 0;
var points = 0;
var gameEnabled = false;
var keyLeft = false;
var keyRight = false;
var keySpace = false;
var keyM = false;
var Player = new Ship (Math.floor((Math.random() * 720) + 10), 515, 80, 76);

// Arrays (first char in letter caps).
var Bullet = new Array();
var EnemyBullet = new Array();
var Enemy = new Array();

// Images variables.
var backgroundImg;
var gameOverBackgroundImg;
var enemyBulletImg;
var enhancerBulletImg;
var enhancerHeartImg;
var enhancerNoBulletsImg;
var enhancerBombImg;
var meteorImg;

// Audio variables and volume settings.
var audioInitialMusic = new Audio('./audio/initialMusicAudio.mp3');
audioInitialMusic.volume = 0.3;
var audioShoot = new Audio('./audio/shootAudio.mp3');
audioShoot.volume = 0.2;
var audioEnemyDeath = new Audio('./audio/enemyDeathAudio.mp3');
audioEnemyDeath.volume = 0.2;
var audioPlayerDeath = new Audio('./audio/playerDeathAudio.mp3');
audioPlayerDeath.volume = 0.5;
var audioBombEnhancer = new Audio('./audio/bombEnhancerAudio.mp3');
audioBombEnhancer.volume = 0.6;

// Cooldown variables (timers).
var cooldownFrames = 0;
var cooldownBullets = 10;
var cooldownBulletsEnhancer = 0;
var cooldownBombEnhancer = 0;
var cooldownEnemySpawn = 400;
var cooldownEnemyMovement = 0;
var cooldownEnemyBoss = 0;
var cooldownEnemyBulletBoss = 400;

// Other variables.
var enemyBossActivated = true;
var enemyBoss = false;
var enemyBoss2 = false;
var backgroundScroll = 0;
var bulletNumber = 1;
var bombNumber = 0;
var meteorPosY = -175;
var meteorPosX = Math.floor(Math.random() * 590 + 10);


/*********** GLOBAL FUNCTIONS ***********/
// When a key is down the bool is activated.
function keysDown (event) {
	switch (event.which) {
		case 32:
			keySpace = true;
			break;
		case 37: case 65: case 97:
			keyLeft = true;
			break;
		case 39: case 68: case 100:
			keyRight = true;
			break;
		case 77: case 109:
			keyM = true;
			break;
		default: 
			break;
	}
}

// When a key is up the bool is deactivated.
function keysUp (event) {
	switch (event.which) {
		case 32:
			keySpace = false;
			break;
		case 37: case 65: case 97:
			keyLeft = false;
			break;
		case 39: case 68: case 100: 
			keyRight = false;
			break;
		case 77: case 109:
			keyM = false;
			break;
		default: 
			break;
	}
}

// When the document is ready read the keys down and up and activate the functions.
$(document).ready(function(){
	$(document).keydown(keysDown);
	$(document).keyup(keysUp);
})

// Ship class.
function Ship(X, Y, W, H) {
	// Global variables.
	this.PosX = X;
	this.PosY = Y;
	this.Width = W;
	this.Height = H;
	this.img;
	this.Life = 4;
	
	// Enhancers variables.
	this.bulletEnhancer = false;
	this.heartEnhancer = false;
	this.noBulletsEnhancer = false;
	this.bombEnhancer = false;
	
	// Player variables.
	this.heart = new Array();

	// Enemy variables.
	this.EnemyPosXD = ((Math.floor((Math.random() * 60) + 20)) * Math.sin(0.005*20));
	this.EnemyPosXI = -this.EnemyPosXD;
	
	// Bullet variables.
	this.activatedBullet = false;
}

// Function to check collisions between two variables.
function checkCollision(Ship1, Ship2){
	if ((Ship1.PosX < Ship2.PosX + Ship2.Width) && (Ship2.PosX < Ship1.PosX + Ship1.Width) && (Ship1.PosY < Ship2.PosY + Ship2.Height) && (Ship2.PosY < Ship1.PosY + Ship1.Height)) return true;
	return false;
}

// Function to shorten the initialization of images.
function createImage(src) {
	var img = new Image();
	img.src = src;
	return img;
}

// Function to paint inside the canvas the points onto the left top corner.
function paintPoints() {
	// Creation of the stroke again.
	var canvas = document.getElementById("myCanvas");
	var ctx = canvas.getContext("2d");

	// Change font and color style.
	ctx.font = "1.2em 'Silkscreen', cursive";
	ctx.fillStyle = "#9759b3";

	// Paints the points depending on the quantity.
	if (points < 10) {
		ctx.fillText("Points: " + points, 650, 35);
	} else if (points >= 10 && points < 100) {
			ctx.fillText("Points: " + points, 635, 35);
		} else if (points >= 100 && points < 200) {
				ctx.fillText("Points: " + points, 620, 35);
			} else if (points >= 200 && points < 1000) {	
					ctx.fillText("Points: " + points, 615, 35);
				} else if (points >= 1000 && points < 10000) {
						ctx.fillText("Points: " + points, 600, 35);
					} else if (points >= 10000 && points < 100000) {
							ctx.fillText("Points: " + points, 585, 35);
						}
}

// Function to hide all the HTML Elements, show the game like we want and activate the game.
function buttonPlay() {
	document.getElementById("button").style = "display: none";
	document.getElementById("subtitle").style = "display: none";
	document.getElementById("title").style = "margin: 0.1vw 0vw 1.5vw 0vw";
	document.getElementById("canvas").style = "display: ";
	document.getElementById("myCanvas").style = "border: 1px solid #d3d3d3";
	$(document).ready(function() {
		$(".text").hide();   
	});
	gameEnabled = true;
}


// Function to restart all the variables and start the game again.
function buttonPlayAgain() {
	// Globals variables.
	scene = 2;
	points = 0;
	gameEnabled = true;
	Player = new Ship (Math.floor((Math.random() * 720) + 10), 515, 80, 76);
	Player.img = [createImage("./images/shipBlue.png"), createImage("./images/shipGreen.png"), createImage("./images/shipPurple.png"), createImage("./images/shipRed.png")];
	Player.heart = [createImage("./images/fullHeart.png"), createImage("./images/damagedHeart1.png"), createImage("./images/damagedHeart2.png"), createImage("./images/damagedHeart3.png")];
	Player.Life = 4;

	// Arrays (first char in letter caps).
	Bullet = new Array();	
	Bullet.img = createImage("./images/bullet.png");
	EnemyBullet = new Array();
	Enemy = new Array();
	Enemy.img = createImage("./images/enemyship.png");

	// Other variables.
	enemyBossActivated = true;
	enemyBoss = false;
	enemyBoss2 = false;
	cooldownFrames = 0;
	cooldownBullets = 10;
	cooldownBulletsEnhancer = 0;
	cooldownBombEnhancer = 0;
	cooldownEnemySpawn = 400;
	cooldownEnemyMovement = 0;
	cooldownEnemyBoss = 0;
	cooldownEnemyBulletBoss = 400;
	backgroundScroll = 0;
	bulletNumber = 1;
	bombNumber = 0;
	meteorPosY = -175;
	meteorPosX = Math.floor(Math.random() * 590 + 10);

	// Show the Play Again button.
	document.getElementById("buttonAgain").style = "display: none";
}


/*********** GAME LOOP FUNCTIONS ***********/
// Function to make the requestAnimationFrame all the time and change between scenes.
function game(){
	switch(scene){
		case 0:
			loadingImages();
			break;
		case 1:
			waitLoadImages();
			break;
		case 2:
			loopGame();
			break;
		case 3:
			gameOver();
			break;
	}
	requestAnimationFrame(game);
}

// Function to create images with the function createImage.
function loadingImages(){
	backgroundImg = createImage("./images/background.png");
  	gameOverBackgroundImg = createImage("./images/backgroundGameOver.png");
  	enemyBulletImg = createImage("./images/enemyBullet.png");
  	enhancerBulletImg = createImage("./images/bulletEnhancer.png");
  	enhancerHeartImg = createImage("./images/heartEnhancer.png");
  	enhancerNoBulletsImg = createImage("./images/noBulletsEnhancer.png");
  	enhancerBombImg = createImage("./images/bombEnhancer.png");
  	meteorImg = createImage("./images/meteor.png");
	Player.img = [createImage("./images/shipBlue.png"), createImage("./images/shipGreen.png"), createImage("./images/shipPurple.png"), createImage("./images/shipRed.png")];
	Player.heart = [createImage("./images/fullHeart.png"), createImage("./images/damagedHeart1.png"), createImage("./images/damagedHeart2.png"), createImage("./images/damagedHeart3.png")];
  	Enemy.img = createImage("./images/enemyship.png");
  	Bullet.img = createImage("./images/bullet.png");
	scene = 1;
}

// Function to wait unless all the images are fully loaded.
function waitLoadImages(){
	var loading = false;

	if (backgroundImg.complete && gameOverBackgroundImg.complete && enemyBulletImg.complete && enhancerBulletImg.complete && enhancerHeartImg.complete && enhancerNoBulletsImg.complete && enhancerBombImg.complete && meteorImg.complete && Player.img[0].complete && Player.img[1].complete && Player.img[2].complete && Player.img[3].complete && Player.heart[0].complete && Player.heart[1].complete && Player.heart[2].complete && Player.heart[3].complete && Enemy.img.complete && Bullet.img.complete) loading = true;

	if (loading) scene = 2;
}

// Function with the logic of the game.
function loopGame(){
	// Creation of the stroke.
	var canvas = document.getElementById("myCanvas");
	var ctx = canvas.getContext("2d");

	// If the game is enabled and have passed 16ms will play the loop.
	if (gameEnabled && (Date.now() - cooldownFrames) >= 16) {
		// Inital music paused.
		audioInitialMusic.pause();

		// Clear the canvas.
		ctx.clearRect(0, 0, 800, 600);

		// Background scroll.
		ctx.drawImage(backgroundImg, 0, backgroundScroll);
		ctx.drawImage(backgroundImg, 0, (backgroundScroll-600));
		backgroundScroll += 2;
		if (backgroundScroll == 600) backgroundScroll = 0;

		// Drawing of inoffensive meteors.
		ctx.drawImage(meteorImg, meteorPosX, meteorPosY);
		meteorPosY++;
		if (meteorPosY > 600) {
			meteorPosY = -175;
			meteorPosX = Math.floor(Math.random() * 590 + 10);
		}
		
		// Drawing of the player.
		if (document.getElementById("blue").checked) ctx.drawImage(Player.img[0], Player.PosX, Player.PosY);
		if (document.getElementById("green").checked) ctx.drawImage(Player.img[1], Player.PosX, Player.PosY);
		if (document.getElementById("purple").checked) ctx.drawImage(Player.img[2], Player.PosX, Player.PosY);
		if (document.getElementById("red").checked) ctx.drawImage(Player.img[3], Player.PosX, Player.PosY);

		// Checking if an enemy or an enhancer collisions the player.
		Enemy.forEach((enemy, index) => {
			if (checkCollision(enemy, Player) && Enemy[index].bulletEnhancer) {
				Enemy.splice(index, 1);
				bulletNumber++;
			} else if (checkCollision(enemy, Player) && Enemy[index].heartEnhancer) {
					Enemy.splice(index, 1);
					Player.Life = 4;
				} else if (checkCollision(enemy, Player) && Enemy[index].noBulletsEnhancer) {
						Enemy.splice(index, 1);
						cooldownBulletsEnhancer = Date.now();
					} else if (checkCollision(enemy, Player) && Enemy[index].bombEnhancer) {
							Enemy.splice(index, 1);
							bombNumber++;
						} else if (checkCollision(enemy, Player) && !Enemy[index].bulletEnhancer && !Enemy[index].heartEnhancer && !Enemy[index].noBulletsEnhancer && !Enemy[index].bombEnhancer) {
								Enemy.splice(index, 1);
								Player.Life--;
						}
		});

		// Limiter of bullets. If bullets are more than 5 and the points are less than 10000 it turn back to 5 bullets and recompense the player with 250 points.
		if (bulletNumber > 5 && points < 10000) {
			bulletNumber = 5;
			points += 250;
		}

		// Limiter of bullets. If bullets are more than 7 and the points are less than 20000 it turn back to 7 bullets and recompense the player with 500 points.
		if (bulletNumber > 7 && points < 20000) {
			bulletNumber = 7;
			points += 500;
		}

		// Limiter of bullets. If bullets are more than 10 and the points are more than 20000 it turn back to 10 bullets and recompense the player with 1000 points.
		if (bulletNumber > 10 && points > 20000) {
			bulletNumber = 10;
			points += 1000;
		}
		
		// If the player has a bomb and press the key M it delete all the enemies and create the images again.
		if (bombNumber > 0 && keyM && !enemyBoss && (Date.now() - cooldownBombEnhancer) >= 200) {
			cooldownBombEnhancer = Date.now();
			audioBombEnhancer.play();
			Enemy = new Array();		
			bombNumber--;
			
			if (points < 10000) {
				Enemy.img = createImage("./images/enemyship.png");
			} else if (points >= 10000 && points <= 15000) {
				Enemy.img = createImage("./images/enemyship2.png");
			} else if (points > 20000) {
				Enemy.img = createImage("./images/enemyship3.png");
			}	
		}

		// Enabled the boss.
		if (points >= 10000 && points <= 10250 && !enemyBoss) enemyBoss = true;

		// Enabled the second boss.
		if (points >= 20000 && points <= 20250 && !enemyBoss) {
			enemyBoss = true;
			enemyBossActivated = true;
		}

		// Check if a bullet collision with an enemy and if it does it delete it, subtract life to the enemy and add 5 points.
		Bullet.forEach((bullet, index) => {
			Enemy.forEach((enemy, index2) => {
				if (checkCollision(enemy, bullet)) {
					Bullet.splice(index, 1);
					Enemy[index2].Life--;
					points += 5;
				}
			});
		});

		// Check if a enemy bullet collision with the player and the bullets.
		EnemyBullet.forEach((enemyBullet, index) => {
			if (checkCollision(enemyBullet, Player)) {
				EnemyBullet.splice(index, 1);
				Player.Life--;
			}

			Bullet.forEach((bullet, index2) => {
				if (checkCollision(enemyBullet, bullet)) Bullet.splice(index2, 1);
			});
		});

		// Modify the position of the player.
		if (keyLeft && !keyRight && Player.PosX > 10 && !enemyBoss)	Player.PosX -= 4;
		if (keyLeft && !keyRight && Player.PosX > 10 && enemyBoss) Player.PosX -= 6;
		if (keyRight && !keyLeft && Player.PosX < 710 && !enemyBoss) Player.PosX += 4;
		if (keyRight && !keyLeft && Player.PosX < 710 && enemyBoss) Player.PosX += 6;
		
		// Spawn of bullets if key space is pressed.
		if (keySpace && (Date.now() - cooldownBullets) >= 350 && (Date.now() - cooldownBulletsEnhancer) >= 500) {
			Bullet.push(new Ship ((Player.PosX + 27), (Player.PosY - 30), 16, 35));
			Bullet[Bullet.length-1].activatedBullet = true;

			// Creation of more bullets if the Player has picked up bullets enhancers.
			for (let bulletCount = 1; bulletCount < bulletNumber; bulletCount++) {
				if (bulletCount % 2 == 0) {
					Bullet.push(new Ship (((Player.PosX + 30) - 10 * bulletCount), (Player.PosY - 30), 16, 35));
				} else {
					Bullet.push(new Ship (((Player.PosX + 35) + 10 * bulletCount), (Player.PosY - 30), 16, 35));
				}

				Bullet[Bullet.length-1].activatedBullet = true;
			}

			// Cooldown update and audio.
			cooldownBullets = Date.now();
			audioShoot.play();
		}

		// If the boss is activated we delete the enemies and depending on the points we spawn one or another boss.
		if (enemyBoss && enemyBossActivated) {
			Enemy = new Array();

			if (points >= 10000 && points <= 11000) {
				Enemy.push(new Ship(310, 15, 180, 220));
				Enemy[0].Life = 200;
				Enemy[0].img = new Image();
				Enemy[0].img.src = "./images/enemyboss.png";
			}
			if (points >= 20000 && points <= 21000) {
				Enemy.push(new Ship(310, 15, 192, 150));
				Enemy[0].Life = 500;
				Enemy[0].img = new Image();
				Enemy[0].img.src = "./images/enemyboss2.png";
				enemyBoss2 = true;
			}
			
			cooldownEnemyBoss = Date.now();
			enemyBossActivated = false;
		}
		
		// If the boss enemy life reach 0 it dies and is destroyed. Then the boss is unenabled and depending on the points it changes the image of the enemy ships.
		if (enemyBoss && Enemy[Enemy.length-1].Life <= 0) {
			Enemy.shift();

			if (points > 10000 && points < 20000 && enemyBoss) {
				Enemy.img = createImage("./images/enemyship2.png");
			} else if (points > 20000 && enemyBoss) {
				Enemy.img = createImage("./images/enemyship3.png");
			}
			
			enemyBoss = false;
			enemyBoss2 = false;
			cooldownEnemySpawn = Date.now() + 400;
		} 

		// If the boss enemy has been created it changes the positions, draw it and spawn and draw the enemy bullets.
		if (enemyBoss && !enemyBossActivated) {
			// Positions of the enemy boss.
			if ((Date.now() - cooldownEnemyBoss) <= 2500 && Enemy[0].PosX < 600) {
				Enemy[0].PosX += Enemy[0].EnemyPosXD;
			} else if ((Date.now() - cooldownEnemyBoss) >= 2500 && (Date.now() - cooldownEnemyBoss) <= 2520) {
				Enemy[0].EnemyPosXD = ((Math.floor((Math.random() * 60) + 20)) * Math.sin(0.01*20));
				Enemy[0].EnemyPosXI = -Enemy[0].EnemyPosXD;
			} else if ((Date.now() - cooldownEnemyBoss) >= 2520 && Enemy[0].PosX > 10) {
				Enemy[0].PosX += Enemy[0].EnemyPosXI;
			}

			if (enemyBoss2) {
				Enemy[0].PosY += Enemy[0].EnemyPosXD;
				if (Enemy[0].PosY >= 200) enemyBoss2 = false;
			} else {
				Enemy[0].PosY -= 3;
				if (Enemy[0].PosY <= 15) enemyBoss2 = true;
			}

			// Drawing of the enemies.
			ctx.drawImage(Enemy[0].img, Enemy[0].PosX, Enemy[0].PosY);
			
			// Spawn of bullets.
			if (((Date.now() - cooldownEnemyBulletBoss) >= 750) && points >= 10000 && points <= 15000) {
				EnemyBullet.push(new Ship ((Enemy[0].PosX + 74), (Enemy[0].PosY + 220), 32, 70));
				EnemyBullet[EnemyBullet.length-1].activatedBullet = true;
			} 
			if (((Date.now() - cooldownEnemyBulletBoss) >= 750) && points >= 20000 && points <= 25000)  {
				EnemyBullet.push(new Ship ((Enemy[0].PosX + 80), (Enemy[0].PosY + 150), 32, 70));
				EnemyBullet[EnemyBullet.length-1].activatedBullet = true;
			}
			
			// Drawing of the enemy bullets.
			EnemyBullet.forEach((bullet, index) => {
				ctx.drawImage(enemyBulletImg, EnemyBullet[index].PosX, EnemyBullet[index].PosY);
			});

			// Limiter cooldowns.
			if ((Date.now() - cooldownEnemyBulletBoss) > 751) cooldownEnemyBulletBoss = Date.now();
			if ((Date.now() - cooldownEnemyBoss) >= 4540) cooldownEnemyBoss = Date.now();
		}
		
		// Spawn of enemies and depending on the points the life starts with one value or another.
		if (Enemy.length <= 35 && ((Date.now() - cooldownEnemySpawn) >= 900) && !enemyBoss) {
			if (points < 10000) Enemy.push(new Ship (Math.floor((Math.random() * 738) + 10), -48, 70, 66));
			if (points > 10000 && points < 20000) Enemy.push(new Ship (Math.floor((Math.random() * 738) + 10), -48, 72, 70));
			if (points > 20000) Enemy.push(new Ship (Math.floor((Math.random() * 738) + 10), -48, 64, 84));
			
			if (points < 1000) {
				Enemy[Enemy.length-1].Life = 3;
			} else if (points < 5000) {
				Enemy[Enemy.length-1].Life = 6;
			} else if (points < 10000) {
				Enemy[Enemy.length-1].Life = 10; 
			} else {
				Enemy[Enemy.length-1].Life = 15;
			}

			cooldownEnemySpawn = Date.now();
		}
		
		// If any bullet is activated the PosY subtract 2.
		Bullet.forEach((bullet, index) => {
			if (Bullet[index].activatedBullet) Bullet[index].PosY -= 3;
		});
		
		// If any enemy bullet is activated the PosY add 2.
		EnemyBullet.forEach((enemyBullet, index) => {
			if (EnemyBullet[index].activatedBullet) EnemyBullet[index].PosY += 2;
		});
		
		// If the cooldown reaches a limit it restarts.
		if ((Date.now() - cooldownEnemyMovement) >= 2000) cooldownEnemyMovement = Date.now();

		Enemy.forEach((enemy, index) => {
			// Changes the PosX.
			if ((Date.now() - cooldownEnemyMovement) < 1000 && !Enemy[index].bulletEnhancer && !Enemy[index].heartEnhancer && !Enemy[index].noBulletsEnhancer && !Enemy[index].bombEnhancer && !enemyBoss) {
				Enemy[index].PosX += Enemy[index].EnemyPosXD;
			} else if ((Date.now() - cooldownEnemyMovement) > 1000 && !Enemy[index].bulletEnhancer && !Enemy[index].heartEnhancer && !Enemy[index].noBulletsEnhancer && !Enemy[index].bombEnhancer && !enemyBoss) {
				Enemy[index].PosX += Enemy[index].EnemyPosXI;
			}

			// Add 2 to PosY of the enemy.
			Enemy[index].PosY += 2;

			if (!enemyBoss) {
				// Draw the enemies.
				if (Enemy[index].bulletEnhancer) {
					ctx.drawImage(enhancerBulletImg, Enemy[index].PosX, Enemy[index].PosY);
				} else if (Enemy[index].heartEnhancer) {
						ctx.drawImage(enhancerHeartImg, Enemy[index].PosX, Enemy[index].PosY);
					} else if (Enemy[index].noBulletsEnhancer) {
							ctx.drawImage(enhancerNoBulletsImg, Enemy[index].PosX, Enemy[index].PosY);
						} else if (Enemy[index].bombEnhancer) {
								ctx.drawImage(enhancerBombImg, Enemy[index].PosX, Enemy[index].PosY);
							} else {
								ctx.drawImage(Enemy.img, Enemy[index].PosX, Enemy[index].PosY);	
							}
							
			}

			// If any enemy pass the limit it destroy it.
			if (Enemy[index].PosY > 600) Enemy.shift();

			// If the enemies life's reaches 0 it can transform to an enhancer or delete it self.
			if (Enemy[index].Life <= 0 && !enemyBoss) {
				if (Math.floor(Math.random() * 15) == 0) {
					Enemy[index].bulletEnhancer = true;
					Enemy[index].Width = 27;
					Enemy[index].Height = 27;
					Enemy[index].Life = 1000;
					} else if (Math.floor(Math.random() * 15) == 5 && Player.Life <= 2) {
						Enemy[index].heartEnhancer = true;
						Enemy[index].Width = 27;
						Enemy[index].Height = 27;
						Enemy[index].Life = 1000;
						} else if (Math.floor(Math.random() * 50) == 10) {
							Enemy[index].bombEnhancer = true;
							Enemy[index].Width = 27;
							Enemy[index].Height = 27;
							Enemy[index].Life = 1000;
							} else if (Math.floor(Math.random() * 50) == 15) {
								Enemy[index].noBulletsEnhancer = true;
								Enemy[index].Life = 1000;
								} else if (!Enemy[index].bulletEnhancer && !Enemy[index].heartEnhancer && !Enemy[index].noBulletsEnhancer && !Enemy[index].bombEnhancer) {
									Enemy.splice(index, 1);
									audioEnemyDeath.play();
								}

				audioEnemyDeath.play();
			}
		});

		// Draw the bullets.
		Bullet.forEach((bullet1, index) => {
			ctx.drawImage(Bullet.img, Bullet[index].PosX, Bullet[index].PosY);
		});

		// Delete the bullet if it go out the canvas.
		Bullet.forEach((bullet, index) => {
			if (Bullet[index].PosY < -34) Bullet.splice(Bullet[index], 1);
		});

		// Delete the enemy bullet if it go out the canvas.
		EnemyBullet.forEach((enemyBullet, index) => {
			if (EnemyBullet[index].PosY > 670) EnemyBullet.splice(EnemyBullet[index], 1);
		});

		// If the player dies reaching 0 lifes the game plays a death audio and changes to the death screen, the Game Over.
		if (Player.Life == 0) {
			audioPlayerDeath.play();
			scene = 3;
		}
		
		// Execution of the function paintPoints.
		paintPoints();

		// Depending on the Player life it will draw a heart or another.
		if (Player.Life == 4) ctx.drawImage(Player.heart[0], 10, 10);
		if (Player.Life == 3) ctx.drawImage(Player.heart[1], 10, 10);
		if (Player.Life == 2) ctx.drawImage(Player.heart[2], 10, 10);
		if (Player.Life == 1) ctx.drawImage(Player.heart[3], 10, 10);
		
		// Cooldown for the frames.
		cooldownFrames = Date.now();
	} 

	// If the game is not enabled the music will sound.
	if (!gameEnabled) {
		audioInitialMusic.play();
	}
}

// Function to the death screen.
function gameOver() {
	// Creation of the stroke again.
	var canvas = document.getElementById("myCanvas");
	var ctx = canvas.getContext("2d");
	
	// Drawing the Game Over background and the points.
	ctx.drawImage(gameOverBackgroundImg, 0, 0);
	paintPoints();

	// Show the Play Again button and unenabled the game.
	gameEnabled = false;
	document.getElementById("buttonAgain").style = "display: ";
}