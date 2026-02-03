class Play extends Phaser.Scene {
    constructor() {
        super('playScene')
    }

    init() {
        // useful variables
        this.SHOT_VELOCITY_X = 200
        this.SHOT_VELOCITY_Y_MIN = 800
        this.SHOT_VELOCITY_Y_MAX = 1100

        //counter for the shots taken for the counter
        this.shots_taken = 0

        //counter for the score of player
        this.player_score = 0

        //variables for successful shot percentage 
        this.successfulShots = 0
        this.totalShots = 0

    }

    preload() {
        this.load.path = './assets/img/'
        this.load.image('grass', 'grass.jpg')
        this.load.image('cup', 'cup.jpg')
        this.load.image('ball', 'ball.png')
        this.load.image('wall', 'wall.png')
        this.load.image('oneway', 'one_way_wall.png')
    }

    create() {
        // add background grass
        this.grass = this.add.image(0, 0, 'grass').setOrigin(0)

        // add cup
        this.cup = this.physics.add.sprite(width / 2, height / 10, 'cup')
        this.cup.body.setCircle(this.cup.width / 4)
        this.cup.body.setOffset(this.cup.width / 4)
        this.cup.body.setImmovable(true)

        // add ball
        this.ball = this.physics.add.sprite(width / 2, height - height / 10, 'ball')
        this.ball.body.setCircle(this.ball.width / 2)
        this.ball.body.setCollideWorldBounds(true)
        this.ball.body.setBounce(0.5)
        this.ball.body.setDamping(true).setDrag(0.5)

        // add walls
        let wallA = this.physics.add.sprite(0, height / 4, 'wall')
        wallA.setX(Phaser.Math.Between(0 + wallA.width / 2, width - wallA.width / 2))
        wallA.body.setCollideWorldBounds(true) //makes wall bounce off worldBounds
        wallA.setBounce(1) //make it bounce off the wall
        wallA.body.setVelocityX(200)

        // wallA.body.setImmovable(true), dont need this anymore since we're making wallA move left and right and bouncing off the screen

        let wallB = this.physics.add.sprite(0, height / 2, 'wall')
        wallB.setX(Phaser.Math.Between(0 + wallB.width / 2, width - wallB.width / 2))
        wallB.body.setImmovable(true)

        this.walls = this.add.group([wallA, wallB])

        // add one-way
        this.oneWay = this.physics.add.sprite(width / 2, height / 4 * 3, 'oneway')
        this.oneWay.setX(Phaser.Math.Between(0 + this.oneWay.width / 2, width - this.oneWay.width / 2))
        this.oneWay.body.setImmovable(true)

        //below line removes the collision from the bottom side of one-way box
        this.oneWay.body.checkCollision.down = false

        // add pointer input
        this.input.on('pointerdown', (pointer) => {

            //everytime a shot is taken, we add 1 to the shots_taken counter and the totalShots taken
            this.shots_taken++
            this.totalShots++

            let shotDirection = pointer.y <= this.ball.y ? 1 : -1 //is the mouse above or below the ball's position

            this.ball.body.setVelocityX(Phaser.Math.Between(-this.SHOT_VELOCITY_X, this.SHOT_VELOCITY_X))
            this.ball.setVelocityY(Phaser.Math.Between(this.SHOT_VELOCITY_Y_MIN, this.SHOT_VELOCITY_Y_MAX) * shotDirection)


            //debugging to see if the shots are being taken
            // console.log(this.shots_taken)
        })

        //Displays the shots taken, game starts with this text
        this.shotText = this.add.text(10, 10, 'Shots: 0')

        //Displayers player_score, game starts with this text
        this.scoreText = this.add.text(10, 40, 'Score: 0')

        this.statsText = this.add.text(10, 70, '')


        // cup/ball collision
        this.physics.add.collider(this.ball, this.cup, (ball, cup) => {
            ball.setPosition(width / 2, height - height / 10)
            ball.body.setVelocity(0, 0)

            //everytime cup and ball collide, player_score and successfulShots gets incremented
            this.player_score++
            this.successfulShots++

            // console.log(this.player_score)
        })


        // ball/wall collision
        this.physics.add.collider(this.ball, this.walls)

        // ball/one-way collision
        this.physics.add.collider(this.ball, this.oneWay)



    }

    update() 
    {
        //text updates as game progresses/shots are taken
        this.shotText.setText('Shots: ' + this.shots_taken)

        this.scoreText.setText('Shots: ' + this.player_score)

        //calculates the percentage of shots percentage and avoids divide-by-zero if no shots have been taken
        this.percentage = this.totalShots === 0 ? 0 : (this.successfulShots / this.totalShots * 100)

        //Upadtes text as shots are missed and made
        this.statsText.setText('Accuracy: ' + this.percentage.toFixed(1) + '%')


    }
}

/*
CODE CHALLENGE
Try to implement at least 3/4 of the following features during the remainder of class (hint: each takes roughly 15 or fewer lines of code to implement):
[ ✅ ] Add ball reset logic on successful shot
[ ] Improve shot logic by making pointer’s relative x-position shoot the ball in correct x-direction
[ ✅  ] Make one obstacle move left/right and bounce against screen edges
[ ✅ ] Create and display shot counter, score, and successful shot percentage
*/