const canvas= document.querySelector('canvas');
canvas.width= innerWidth;
canvas.height= innerHeight;
const c= canvas.getContext('2d');

function spaceshipImg() {
    var c = document.querySelector('canvas');
    var ctx = c.getContext("2d");
    var img = document.getElementById("spaceship");
    ctx.drawImage(img, 5, 417);
  } 

  const scoreEl = document.getElementById('scoreEl')
  const startbtn = document.getElementById('start')
  const module = document.getElementById('module')
  const bigScore = document.getElementById('bigScore')
  const highScore = document.getElementById('highScore')

  class Player{
    constructor(x, y, r, color){
      this.x= x
      this.y= y
      this.r= r
      this.color= color
    }
    draw() {
      c.beginPath()
      c.arc(this.x, this.y, this.r, 0, Math.PI * 2, false)
      c.fillStyle= this.color
      c.fill()
    }
  }
  let player= new Player(100, 450, 10, 'white')
  let projectiles= []
  let enemies=[]
  let praticles= []

  function init() {
    score= 0
    bigScore.innerHTML= score
    scoreEl.innerHTML= score
    player= new Player(100, 450, 10, 'white')
    projectiles= []
    enemies=[]
    praticles= []
  }

  class Projectile{
    constructor(x, y, r, color, velocity){
      this.x= x
      this.y= y
      this.r= r
      this.color= color
      this.velocity= velocity
    }
    draw() {
      c.beginPath()
      c.arc(this.x, this.y, this.r, 0, Math.PI*2, false)
      c.fillStyle= this.color
      c.fill()
    }
    update(){
      this.draw()
      this.x= this.x + this.velocity.x
      this.y= this.y + this.velocity.y
    }
  }
    class Enemy{
      constructor(x, y, r, color, velocity){
        this.x= x
        this.y= y
        this.r= r
        this.color= color
        this.velocity= velocity
      }
      draw() {
        c.beginPath()
        c.arc(this.x, this.y, this.r, 0, Math.PI*2, false)
        c.fillStyle= this.color
        c.fill()
      }
      update(){
        this.draw()
        this.x= this.x + this.velocity.x
        this.y= this.y + this.velocity.y
      }
    }
    const friction= 0.99
    class Particle{
      constructor(x, y, r, color, velocity){
        this.x= x
        this.y= y
        this.r= r
        this.color= color
        this.velocity= velocity
        this.alpha= 1
      }
      draw() {
        c.save()
        c.globalAlpha= this.alpha
        c.beginPath()
        c.arc(this.x, this.y, this.r, 0, Math.PI*2, false)
        c.fillStyle= this.color
        c.fill()
        c.restore()
      }
      update(){
        this.draw()
        this.velocity.x = this.velocity.x * friction
        this.velocity.y = this.velocity.y * friction
        this.x= this.x + this.velocity.x
        this.y= this.y + this.velocity.y
        this.alpha = this.alpha - 0.01
      }
    }
  
  function spawnEnemies(){
    setInterval( () =>{
      const x= 1350
      const y= Math.random() * canvas.height
      const r= Math.random() * (30-4) + 4
      const color= `hsl( ${ Math.random() * 360}, 50%, 50%)`
      const angle= Math.atan2(450-y, 100-x)
      const velocity= {
        x: Math.cos(angle),
        y: Math.sin(angle)}
      enemies.push(new Enemy(x, y, r, color, velocity))
    }, 1000)
  }
  let animationId
  let score = 0
  function animate(){
    animationId = requestAnimationFrame(animate);
    spaceshipImg()
    c.fillStyle= 'rgba(0, 0, 0, 0.1)'
    c.fillRect(0,0, canvas.width, canvas.height)
    player.draw()
    praticles.forEach((praticle, index) => {
      if(praticle.alpha<=0){
        praticles.splice(index)
      }else{
        praticle.update()
      }
    })
    projectiles.forEach((projectile, index) =>
      {
        projectile.update()
        //remove from screen
        if (projectile.x +projectile.r < 0 || projectile.x- projectile.r > canvas.width ||
          projectile.y +projectile.r < 0|| projectile.y- projectile.r > canvas.height ){
          setTimeout(() =>{
            projectiles.splice(index, 1)
          }, 0)
        }
      })
    
    //Enemy & Projectile removal
    enemies.forEach((enemy, index )=>{
      enemy.update()
      const dist= Math.hypot(player.x - enemy.x, player.y - enemy.y)
      //endgame
      if (dist- enemy.r- player.r < 1){
        cancelAnimationFrame(animationId)
        bigScore.innerHTML= score
        highScore.innerHTML= score
        module.style.display= 'flex'
      }

      projectiles.forEach((projectile, projectileIndex) => {
        const dist= Math.hypot(projectile.x - enemy.x, projectile.y - enemy.y)
        //when projectiles touch the ememies.
        if (dist- enemy.r- projectile.r < 1){
         
          //create explosions
          for(let i=0; i<enemy.r * 2; i++){
            praticles.push(
              new Particle(projectile.x, projectile.y, Math.random()*2, enemy.color, {
                x: (Math.random() -0.5) * (Math.random()* 6),
                y: (Math.random() -0.5) *(Math.random()*6)
              }))
          }
          if(enemy.r -10> 10){
             //increase the score
            score= score+ 10
            scoreEl.innerHTML= score
            enemy.r = enemy.r - 10
            setTimeout(() =>{
              projectiles.splice(projectileIndex, 1)

            }, 0)
          }else{
             //the score bonus
              score= score+ 20
              scoreEl.innerHTML= score
              setTimeout(() =>{
              enemies.splice(index, 1)
              projectiles.splice(projectileIndex, 1)
            }, 0) 
          }
        }
      })
    })
  }
  addEventListener('click', (event) =>
    { 
      console.log(projectiles)
      const angle= Math.atan2(event.clientY- 450,event.clientX- 100)
      const velocity= {
        x: Math.cos(angle)*5 ,
        y: Math.sin(angle)*5
      }
      projectiles.push(new Projectile(
        100,
        450,
        5,
        'white',
        velocity)
      )
    })
  startbtn.addEventListener('click', () =>
  {
    alert("You are on a space exploration mission to find other life forms in the universe")
    alert("Your spacecraft is sidetracked during the expedition, and you land on an alien planet Ampelos") 
    alert("The planet is home to a species called Whitespikes and now they are threatened by your presence")
    alert("Kill them before they reach upto your spaceship")
    init()
    module.style.display= 'none'
    animate() 
    spawnEnemies()
  })
  
