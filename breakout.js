function	init()
{
	var	canvas = document.getElementById("canvas");
	var	context = canvas.getContext("2d");

	var	x = canvas.width / 2;
	var y = canvas.height - 30;
	var dx = 2;
	var dy = -2;

	// ball
	var	ballRadius = 10;

	// Platform
	var	paddleHeight = 10;
	var	paddleWidth = 75;
	var	paddleX = (canvas.width - paddleWidth) / 2;

	// clavier
	var	rightPressed = false;
	var	leftPressed = false;

	// briques
	var	briqueRow = 7;
	var briqueCol = 10;
	var	briqueW = 50;
	var briqueH = 20;
	var	briquePadding = 10; //ecart entre les briques
	var	briqueOffsetTop = 30;
	var	briqueOffsetLeft = 35;
	var briques = [];
	var	briqueX;
	var	briqueY;
	var	redBrick = 0;
	var blueBrick = 0;

	var	score = 0;
	var vies = 3;
	var random;
	var	vitesse = 1;

	function	fillBrique()
	{
		for (var i = 0; i < briqueCol; i++)
		{
			briques[i] = [];
			for (var j = 0; j < briqueRow; j++)
			{
				random = Math.random() * (30 - 1) + 1;
				if (random > 20)
				{
					briques[i][j] = {x : 0, y : 0, status : 1, special : 1};
					redBrick++;
				}
				else if (random <= 20)
				{
					briques[i][j] = {x : 0, y : 0, status : 1, special : 0};
					blueBrick++;
				}
			}
		}
	}

	function	affVies()
	{
		context.font = "20px bold";
		context.fillStyle = "#FF0000";
		context.fillText("Vies : " + vies, canvas.width - 65, 15);
	}

	function	drawScore()
	{
		context.font = "20px bold";
		context.fillStyle = "#FF0000";
		context.fillText("Score : " + score, 5, 15);
	}

	function	drawBriques()
	{
		for (var i = 0; i < briqueCol; i++)
		{
			for (var j = 0; j < briqueRow; j++)
			{
				if (briques[i][j].status == 1)
				{
					briqueX = (i * (briqueW + briquePadding)) + briqueOffsetLeft;
					briqueY = (j * (briqueH + briquePadding)) + briqueOffsetTop;
					briques[i][j].x = briqueX;
					briques[i][j].y = briqueY;
					if (briques[i][j].special == 1)
					{
						context.fillStyle = "#FF0000";
						context.beginPath();
						context.rect(briqueX, briqueY, briqueW, briqueH);
						context.fill();
						context.closePath();
					}
					else if (briques[i][j].special == 0)
					{
						context.fillStyle = "#0080FF";
						context.beginPath();
						context.rect(briqueX, briqueY, briqueW, briqueH);
						context.fill();
						context.closePath();
					}
				}
			}
		}
	}

	function	drawPaddle()
	{
		context.beginPath();
		context.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
		context.fillStyle = "#0080DD";
		context.fill();
		context.closePath();
	}

	function	drawBall()
	{
		context.beginPath();
		context.arc(x, y, ballRadius, 0, Math.PI * 2);
		context.fillStyle = "#0080DD";
		context.fill();
		context.closePath();
	}

	function briqueCollision()
	{
		for (var i = 0; i < briqueCol; i++)
		{
			for (var j = 0; j < briqueRow; j++)
			{
				var brick = briques[i][j];
				if (brick.status == 1)
				{
					if (x > brick.x && x < brick.x + briqueW && y > brick.y && y < brick.y + briqueH)
					{
						if (brick.special == 1)
						{
							dy = -dy;
							brick.status = 0;
							score = score + 3;
						}
						else if (brick.special == 0)
						{
							dy = -dy;
							brick.status = 0;
							score++;
						}
					}
				}
			}
		}
	}

	function	movePaddle()
	{
		if (rightPressed == true && paddleX < canvas.width - paddleWidth)
			paddleX += 4;
		else if (leftPressed == true && paddleX > 0)
			paddleX -= 4;
	}

	function		gameOver()
	{
		var i = briqueRow * briqueCol;
		var redPoints = redBrick * 3;
		var bluePoints = blueBrick;
		if (score == redPoints + bluePoints)
			{
				alert("c'est gagné !");
				window.location.reload();
			}
	}

	function	addSpeed()
	{
		if (score < 5)
			vitesse = 1.5;
		else if (score >= 5 && score < 10)
			vitesse = 1.9;
		else if (score >= 10 && score < 15)
			vitesse = 2.3;
		else if (score >= 15 && score < 50)
			vitesse = 2.7;
		else if (score >= 40)
			vitesse = 3.5;
	}

	function	draw()
	{
		context.clearRect(0, 0, canvas.width, canvas.height);
		addSpeed();
		drawBriques();
		drawBall();
		bounceCollision();
		briqueCollision();
		drawScore();
		affVies();
		drawPaddle();
		movePaddle();
		x += dx * vitesse;
		y += dy * vitesse;
		gameOver();
	}

	function	bounceCollision()
	{
		if (x + dx > canvas.width - ballRadius || x + dx < ballRadius)
			dx = -dx;
		if (y + dy < ballRadius)
			dy = -dy;
		else if (y + dy > canvas.height - ballRadius)
		{
			if (x > paddleX && x < paddleX + paddleWidth) // si le centre de de la balle touche la plateforme
				dy = -dy;
			else
			{
				vies--;
				if (vies == 0)
				{
					alert("Vous avez perdu");
					window.location.reload();
				}
				else
				{
					x = canvas.width / 2;
					y = canvas.height - 30;
					dx =  2;
					dy = -2;
					paddleX = (canvas.width - paddleWidth) / 2;
				}

			}
		}
	}

	function	keyDown(e)
	{
		if (e.keyCode == 39)
			rightPressed = true;
		else if (e.keyCode == 37)
			leftPressed = true;
	}

	function	keyUp(e)
	{
		if (e.keyCode == 39)
			rightPressed = false;
		else if (e.keyCode == 37)
			leftPressed = false;
	}

	fillBrique();
	document.addEventListener("keydown", keyDown, false);
	document.addEventListener("keyup", keyUp, false);
	setInterval(draw, 10);
}