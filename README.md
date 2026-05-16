[claw_machine_game.html](https://github.com/user-attachments/files/27854176/claw_machine_game.html)
# clawmachinewords<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>🎮 Claw Machine - Spelling Game</title>
<link href="https://fonts.googleapis.com/css2?family=Fredoka+One&family=Nunito:wght@600;800&display=swap" rel="stylesheet">
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:'Nunito',sans-serif;background:linear-gradient(135deg,#1a1a2e,#16213e,#0f3460);min-height:100vh;overflow:hidden;display:flex;align-items:center;justify-content:center}
#game-container{position:relative;width:900px;height:650px;background:linear-gradient(180deg,#2a1a4e 0%,#1a1040 100%);border-radius:24px;box-shadow:0 0 60px rgba(120,80,220,0.4),inset 0 0 80px rgba(0,0,0,0.3);border:3px solid rgba(255,255,255,0.1);overflow:hidden}
canvas{display:block;width:100%;height:100%}
#setup-screen{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;background:linear-gradient(135deg,rgba(40,20,80,0.97),rgba(20,10,60,0.97));z-index:10;gap:20px}
#setup-screen h1{font-family:'Fredoka One',cursive;font-size:42px;background:linear-gradient(135deg,#ff6b9d,#c084fc,#60a5fa);-webkit-background-clip:text;-webkit-text-fill-color:transparent;text-shadow:none;margin-bottom:10px}
#setup-screen p{color:rgba(255,255,255,0.6);font-size:16px}
#word-input{width:320px;padding:16px 24px;font-size:28px;font-family:'Fredoka One',cursive;text-align:center;border:3px solid rgba(192,132,252,0.4);border-radius:16px;background:rgba(255,255,255,0.08);color:#e0d0ff;letter-spacing:6px;outline:none;text-transform:uppercase}
#word-input:focus{border-color:#c084fc;box-shadow:0 0 20px rgba(192,132,252,0.3)}
#word-input::placeholder{color:rgba(255,255,255,0.2);letter-spacing:2px;font-size:18px}
.btn{padding:14px 40px;font-family:'Fredoka One',cursive;font-size:20px;border:none;border-radius:14px;cursor:pointer;transition:all .2s;text-transform:uppercase;letter-spacing:2px}
.btn-start{background:linear-gradient(135deg,#c084fc,#818cf8);color:#fff;box-shadow:0 6px 20px rgba(192,132,252,0.4)}
.btn-start:hover{transform:translateY(-2px) scale(1.05);box-shadow:0 8px 30px rgba(192,132,252,0.6)}
#hud{position:absolute;top:0;left:0;right:0;padding:12px 20px;display:flex;justify-content:space-between;align-items:center;z-index:5;pointer-events:none}
#word-display{display:flex;gap:8px;justify-content:center;pointer-events:none}
.slot{width:48px;height:56px;background:rgba(255,255,255,0.08);border:2px solid rgba(255,255,255,0.15);border-radius:10px;display:flex;align-items:center;justify-content:center;font-family:'Fredoka One',cursive;font-size:30px;color:rgba(255,255,255,0.25);transition:all .3s}
.slot.filled{background:linear-gradient(135deg,#34d399,#6ee7b7);border-color:#34d399;color:#064e3b;transform:scale(1.1);box-shadow:0 0 15px rgba(52,211,153,0.5)}
#score-display{font-family:'Fredoka One',cursive;color:#fbbf24;font-size:18px;pointer-events:none}
#controls{position:absolute;bottom:16px;left:50%;transform:translateX(-50%);display:flex;gap:10px;z-index:5}
.ctrl-btn{width:70px;height:56px;border:none;border-radius:14px;font-size:26px;cursor:pointer;transition:all .15s;user-select:none;-webkit-user-select:none;touch-action:manipulation}
.ctrl-btn:active{transform:scale(0.92)}
.dir-btn{background:linear-gradient(180deg,rgba(255,255,255,0.15),rgba(255,255,255,0.05));color:#fff;border:2px solid rgba(255,255,255,0.15)}
.dir-btn:hover{background:rgba(255,255,255,0.2)}
.catch-btn{background:linear-gradient(135deg,#f43f5e,#ec4899);color:#fff;width:90px;font-family:'Fredoka One',cursive;font-size:15px;box-shadow:0 4px 15px rgba(244,63,94,0.4);border:2px solid rgba(255,255,255,0.2)}
.catch-btn:hover{box-shadow:0 6px 25px rgba(244,63,94,0.6)}
.catch-btn:disabled{opacity:0.4;cursor:not-allowed}
#feedback{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);font-family:'Fredoka One',cursive;font-size:48px;z-index:8;pointer-events:none;opacity:0;transition:opacity .3s}
#victory-screen{position:absolute;inset:0;display:none;flex-direction:column;align-items:center;justify-content:center;background:rgba(10,5,30,0.92);z-index:10;gap:16px}
#victory-screen h2{font-family:'Fredoka One',cursive;font-size:52px;background:linear-gradient(135deg,#fbbf24,#f97316,#ef4444);-webkit-background-clip:text;-webkit-text-fill-color:transparent}
#victory-screen p{color:rgba(255,255,255,0.8);font-size:22px}
.stars{font-size:60px;animation:bounce 0.6s ease infinite alternate}
@keyframes bounce{0%{transform:scale(1)}100%{transform:scale(1.15)}}
@keyframes popIn{0%{transform:scale(0);opacity:0}50%{transform:scale(1.2)}100%{transform:scale(1);opacity:1}}
#new-word-btn{pointer-events:auto}
</style>
</head>
<body>

<div id="game-container">
  <canvas id="gameCanvas"></canvas>
  
  <div id="setup-screen">
    <h1>🎮 Claw Machine</h1>
    <p>Type a word for students to spell!</p>
    <input type="text" id="word-input" placeholder="e.g. CAT" maxlength="8" autocomplete="off">
    <button class="btn btn-start" onclick="startGame()">▶ Start Game</button>
    <p style="color:rgba(255,255,255,0.35);font-size:13px;margin-top:8px">Use ◀ ▶ to move claw, then press CATCH!</p>
  </div>

  <div id="hud">
    <div id="word-display"></div>
    <div id="score-display">⭐ 0</div>
  </div>

  <div id="controls" style="display:none">
    <button class="ctrl-btn dir-btn" onpointerdown="moveDir=-1" onpointerup="moveDir=0" onpointerleave="moveDir=0">◀</button>
    <button class="ctrl-btn catch-btn" id="catch-btn" onclick="dropClaw()">CATCH</button>
    <button class="ctrl-btn dir-btn" onpointerdown="moveDir=1" onpointerup="moveDir=0" onpointerleave="moveDir=0">▶</button>
  </div>

  <div id="feedback"></div>

  <div id="victory-screen">
    <div class="stars">⭐🎉⭐</div>
    <h2>YOU DID IT!</h2>
    <p id="victory-word"></p>
    <button class="btn btn-start" id="new-word-btn" onclick="resetToSetup()">New Word</button>
  </div>
</div>

<script>
// ============ GAME CONFIG ============
const CVS = document.getElementById('gameCanvas');
const CTX = CVS.getContext('2d');
const W = 900, H = 650;
CVS.width = W; CVS.height = H;

const PASTEL = ['#ff9eb5','#ffc078','#a5d8ff','#b2f2bb','#d0bfff','#fcc2d7','#99e9f2','#ffec99','#e599f7','#96f2d7'];
const MACHINE_TOP = 80, MACHINE_BOTTOM = 520, MACHINE_LEFT = 100, MACHINE_RIGHT = 800;
const LETTER_SIZE = 32, GRAB_RADIUS = 50;

// ============ GAME STATE ============
let targetWord = '', slotsFilled = [], score = 0, gameActive = false;
let moveDir = 0; // -1 left, 0 stop, 1 right
let letters = []; // {x,y,vx,vy,char,color,grabbed,used,radius}
let claw = {x: 450, y: MACHINE_TOP + 30, homeY: MACHINE_TOP + 30, state:'idle', heldLetter:null, fingerAngle:25, targetFinger:25, armW:6};
let particles = [];
let feedbackTimer = 0, feedbackMsg = '', feedbackColor = '';

// ============ AUDIO (Web Audio API) ============
let audioCtx;
function initAudio(){if(!audioCtx) audioCtx = new (window.AudioContext||window.webkitAudioContext)()}
function playTone(freq,dur,type='square',vol=0.08){
  if(!audioCtx)return;
  const o=audioCtx.createOscillator(),g=audioCtx.createGain();
  o.type=type;o.frequency.value=freq;g.gain.value=vol;
  g.gain.exponentialRampToValueAtTime(0.001,audioCtx.currentTime+dur);
  o.connect(g);g.connect(audioCtx.destination);o.start();o.stop(audioCtx.currentTime+dur);
}
function sndGrab(){playTone(520,0.15,'sine',0.12);setTimeout(()=>playTone(780,0.12,'sine',0.1),80)}
function sndCorrect(){playTone(523,0.12,'sine',0.1);setTimeout(()=>playTone(659,0.12,'sine',0.1),100);setTimeout(()=>playTone(784,0.2,'sine',0.12),200)}
function sndWrong(){playTone(200,0.25,'sawtooth',0.06)}
function sndWin(){[523,659,784,1047].forEach((f,i)=>setTimeout(()=>playTone(f,0.3,'sine',0.1),i*120))}
function sndDrop(){playTone(400,0.1,'triangle',0.06);setTimeout(()=>playTone(300,0.15,'triangle',0.05),60)}

// ============ LETTER SPAWNING ============
function spawnLetters(){
  letters = [];
  // Ensure target letters are present (2 copies each)
  let needed = [];
  for(let c of targetWord){needed.push(c);needed.push(c)}
  // Fill with random letters
  const alpha = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  while(needed.length < 35) needed.push(alpha[Math.random()*26|0]);
  // Shuffle
  for(let i=needed.length-1;i>0;i--){const j=Math.random()*(i+1)|0;[needed[i],needed[j]]=[needed[j],needed[i]]}
  // Create letter objects
  for(let c of needed){
    letters.push({
      x: MACHINE_LEFT+40+Math.random()*(MACHINE_RIGHT-MACHINE_LEFT-80),
      y: MACHINE_BOTTOM-30-Math.random()*180,
      vx:(Math.random()-0.5)*0.5, vy:0,
      char:c, color:PASTEL[Math.random()*PASTEL.length|0],
      grabbed:false, used:false, radius:LETTER_SIZE/2+4
    });
  }
}

// ============ PHYSICS UPDATE ============
function updateLetters(dt){
  for(let L of letters){
    if(L.grabbed||L.used) continue;
    L.vy += 200*dt; // gravity
    L.x += L.vx*dt*60; L.y += L.vy*dt;
    // Floor
    if(L.y > MACHINE_BOTTOM-L.radius){L.y=MACHINE_BOTTOM-L.radius;L.vy*=-0.3;L.vx*=0.9}
    // Walls
    if(L.x < MACHINE_LEFT+L.radius){L.x=MACHINE_LEFT+L.radius;L.vx=Math.abs(L.vx)*0.5}
    if(L.x > MACHINE_RIGHT-L.radius){L.x=MACHINE_RIGHT-L.radius;L.vx=-Math.abs(L.vx)*0.5}
    // Damping
    L.vx *= 0.998;
  }
}

// ============ CLAW LOGIC ============
function updateClaw(dt){
  // Horizontal movement when idle
  if(claw.state==='idle' && moveDir!==0){
    claw.x += moveDir * 250 * dt;
    claw.x = Math.max(MACHINE_LEFT+30, Math.min(MACHINE_RIGHT-30, claw.x));
  }
  // Finger animation
  claw.fingerAngle += (claw.targetFinger - claw.fingerAngle) * 6 * dt;

  if(claw.state==='dropping'){
    claw.y += 220 * dt;
    if(claw.y >= MACHINE_BOTTOM - 40){
      claw.y = MACHINE_BOTTOM - 40;
      claw.state = 'grabbing';
      tryGrab();
    }
  }
  else if(claw.state==='rising'){
    claw.y -= 160 * dt;
    if(claw.y <= claw.homeY){
      claw.y = claw.homeY;
      if(claw.heldLetter){
        validateLetter();
      } else {
        claw.state='idle';
        claw.targetFinger=25;
        document.getElementById('catch-btn').disabled=false;
      }
    }
    if(claw.heldLetter){claw.heldLetter.x=claw.x;claw.heldLetter.y=claw.y+35}
  }
}

function dropClaw(){
  if(claw.state!=='idle'||!gameActive)return;
  initAudio();
  claw.state='dropping';
  claw.targetFinger=25;
  claw.heldLetter=null;
  document.getElementById('catch-btn').disabled=true;
  sndDrop();
}

function tryGrab(){
  let closest=null, closestD=Infinity;
  for(let L of letters){
    if(L.grabbed||L.used)continue;
    const d=Math.hypot(L.x-claw.x, L.y-(claw.y+20));
    if(d<GRAB_RADIUS && d<closestD){closestD=d;closest=L}
  }
  if(closest){
    closest.grabbed=true;
    claw.heldLetter=closest;
    claw.targetFinger=0;
    sndGrab();
    spawnParticles(claw.x,claw.y+20,6,'#fbbf24');
  } else {
    claw.targetFinger=0;
  }
  setTimeout(()=>{claw.state='rising'},200);
}

function validateLetter(){
  const L = claw.heldLetter;
  const c = L.char;
  // Find first unfilled slot needing this letter
  let slotIdx = -1;
  for(let i=0;i<targetWord.length;i++){
    if(!slotsFilled[i] && targetWord[i]===c){slotIdx=i;break}
  }
  if(slotIdx>=0){
    slotsFilled[slotIdx]=true;
    L.used=true; L.grabbed=false;
    score += 10;
    document.getElementById('score-display').textContent = '⭐ '+score;
    updateWordDisplay();
    sndCorrect();
    showFeedback('Great Job! ⭐','#34d399');
    spawnParticles(claw.x,claw.y,20,'#34d399');
    // Check win
    if(slotsFilled.every(Boolean)){
      setTimeout(()=>winGame(),600);
    }
  } else {
    // Wrong letter - return it
    L.grabbed=false;
    L.vy=-3;L.vx=(Math.random()-0.5)*3;
    sndWrong();
    showFeedback('Try Again! 💪','#f97316');
  }
  claw.heldLetter=null;
  claw.targetFinger=25;
  claw.state='idle';
  document.getElementById('catch-btn').disabled=false;
}

// ============ PARTICLES ============
function spawnParticles(x,y,n,color){
  for(let i=0;i<n;i++){
    const a=Math.random()*Math.PI*2, sp=1+Math.random()*3;
    particles.push({x,y,vx:Math.cos(a)*sp,vy:Math.sin(a)*sp-2,life:1,color,size:3+Math.random()*4});
  }
}
function updateParticles(dt){
  for(let i=particles.length-1;i>=0;i--){
    const p=particles[i];
    p.x+=p.vx;p.y+=p.vy;p.vy+=0.1;p.life-=dt*1.5;
    if(p.life<=0)particles.splice(i,1);
  }
}

// ============ FEEDBACK ============
function showFeedback(msg,color){
  feedbackMsg=msg;feedbackColor=color;feedbackTimer=1.5;
  const el=document.getElementById('feedback');
  el.textContent=msg;el.style.color=color;el.style.opacity=1;
  setTimeout(()=>{el.style.opacity=0},1200);
}

// ============ DRAWING ============
function draw(){
  CTX.clearRect(0,0,W,H);
  
  // Machine body
  const grd=CTX.createLinearGradient(MACHINE_LEFT,MACHINE_TOP,MACHINE_LEFT,MACHINE_BOTTOM+40);
  grd.addColorStop(0,'rgba(60,30,120,0.6)');grd.addColorStop(1,'rgba(30,15,60,0.8)');
  CTX.fillStyle=grd;
  CTX.beginPath();
  CTX.roundRect(MACHINE_LEFT-10,MACHINE_TOP-10,MACHINE_RIGHT-MACHINE_LEFT+20,MACHINE_BOTTOM-MACHINE_TOP+50,16);
  CTX.fill();
  
  // Glass panels
  CTX.strokeStyle='rgba(255,255,255,0.12)';CTX.lineWidth=2;
  CTX.beginPath();
  CTX.roundRect(MACHINE_LEFT,MACHINE_TOP,MACHINE_RIGHT-MACHINE_LEFT,MACHINE_BOTTOM-MACHINE_TOP+30,12);
  CTX.stroke();
  
  // Rail at top
  CTX.fillStyle='rgba(255,255,255,0.1)';
  CTX.fillRect(MACHINE_LEFT,MACHINE_TOP-5,MACHINE_RIGHT-MACHINE_LEFT,8);
  
  // Claw indicator on rail
  CTX.fillStyle='rgba(192,132,252,0.6)';
  CTX.fillRect(claw.x-15,MACHINE_TOP-5,30,8);
  
  // Letters
  for(let L of letters){
    if(L.used)continue;
    CTX.save();
    CTX.translate(L.x,L.y);
    // Shadow
    CTX.fillStyle='rgba(0,0,0,0.2)';
    CTX.beginPath();CTX.arc(2,3,L.radius,0,Math.PI*2);CTX.fill();
    // Body
    const lg=CTX.createRadialGradient(-3,-3,2,0,0,L.radius);
    lg.addColorStop(0,'white');lg.addColorStop(0.3,L.color);lg.addColorStop(1,L.color);
    CTX.fillStyle=lg;
    CTX.beginPath();CTX.arc(0,0,L.radius,0,Math.PI*2);CTX.fill();
    // Border
    CTX.strokeStyle='rgba(255,255,255,0.4)';CTX.lineWidth=1.5;
    CTX.beginPath();CTX.arc(0,0,L.radius,0,Math.PI*2);CTX.stroke();
    // Letter text
    CTX.fillStyle='#1a1a2e';CTX.font='bold 22px "Fredoka One",cursive';CTX.textAlign='center';CTX.textBaseline='middle';
    CTX.fillText(L.char,0,1);
    CTX.restore();
  }
  
  // Claw arm (rope)
  CTX.strokeStyle='rgba(200,200,220,0.7)';CTX.lineWidth=claw.armW;
  CTX.setLineDash([6,4]);
  CTX.beginPath();CTX.moveTo(claw.x,MACHINE_TOP);CTX.lineTo(claw.x,claw.y);CTX.stroke();
  CTX.setLineDash([]);
  
  // Claw head
  CTX.save();CTX.translate(claw.x,claw.y);
  // Head circle
  const hg=CTX.createRadialGradient(-2,-2,1,0,0,14);
  hg.addColorStop(0,'#e0d0ff');hg.addColorStop(1,'#8b5cf6');
  CTX.fillStyle=hg;
  CTX.beginPath();CTX.arc(0,0,14,0,Math.PI*2);CTX.fill();
  CTX.strokeStyle='rgba(255,255,255,0.3)';CTX.lineWidth=2;
  CTX.beginPath();CTX.arc(0,0,14,0,Math.PI*2);CTX.stroke();
  
  // Fingers (3)
  const fa=claw.fingerAngle*Math.PI/180;
  for(let i=-1;i<=1;i++){
    const baseAngle = Math.PI/2 + i*fa;
    CTX.strokeStyle='#c084fc';CTX.lineWidth=5;CTX.lineCap='round';
    CTX.beginPath();
    CTX.moveTo(Math.cos(baseAngle)*10, Math.sin(baseAngle)*10);
    CTX.lineTo(Math.cos(baseAngle)*28, Math.sin(baseAngle)*28);
    CTX.stroke();
    // Finger tip
    CTX.fillStyle='#ddd6fe';
    CTX.beginPath();CTX.arc(Math.cos(baseAngle)*28,Math.sin(baseAngle)*28,4,0,Math.PI*2);CTX.fill();
  }
  CTX.restore();
  
  // Particles
  for(let p of particles){
    CTX.globalAlpha=p.life;
    CTX.fillStyle=p.color;
    CTX.beginPath();CTX.arc(p.x,p.y,p.size*p.life,0,Math.PI*2);CTX.fill();
  }
  CTX.globalAlpha=1;
  
  // Bottom decoration
  CTX.fillStyle='rgba(192,132,252,0.08)';
  CTX.fillRect(MACHINE_LEFT,MACHINE_BOTTOM+10,MACHINE_RIGHT-MACHINE_LEFT,30);
  CTX.fillStyle='rgba(255,255,255,0.06)';
  CTX.font='13px Nunito';CTX.textAlign='center';
  CTX.fillText('🎯 Move the claw and press CATCH to grab letters!',W/2,MACHINE_BOTTOM+28);
}

// ============ UI UPDATES ============
function updateWordDisplay(){
  const container=document.getElementById('word-display');
  container.innerHTML='';
  for(let i=0;i<targetWord.length;i++){
    const div=document.createElement('div');
    div.className='slot'+(slotsFilled[i]?' filled':'');
    div.textContent=slotsFilled[i]?targetWord[i]:'_';
    if(slotsFilled[i])div.style.animation='popIn 0.3s ease';
    container.appendChild(div);
  }
}

// ============ GAME FLOW ============
function startGame(){
  initAudio();
  let word=document.getElementById('word-input').value.replace(/[^a-zA-Z]/g,'').toUpperCase();
  if(!word)word='CAT';
  if(word.length>8)word=word.substring(0,8);
  targetWord=word;
  slotsFilled=new Array(word.length).fill(false);
  score=0;
  document.getElementById('score-display').textContent='⭐ 0';
  claw={x:450,y:MACHINE_TOP+30,homeY:MACHINE_TOP+30,state:'idle',heldLetter:null,fingerAngle:25,targetFinger:25,armW:6};
  particles=[];
  spawnLetters();
  updateWordDisplay();
  document.getElementById('setup-screen').style.display='none';
  document.getElementById('controls').style.display='flex';
  document.getElementById('victory-screen').style.display='none';
  gameActive=true;
  playTone(440,0.1,'sine',0.05);
}

function winGame(){
  gameActive=false;
  sndWin();
  // Big particle burst
  for(let i=0;i<50;i++) spawnParticles(W/2+Math.random()*200-100,H/2,1,PASTEL[Math.random()*PASTEL.length|0]);
  document.getElementById('victory-word').textContent='You spelled "'+targetWord+'"! 🎉';
  document.getElementById('victory-screen').style.display='flex';
  document.getElementById('controls').style.display='none';
}

function resetToSetup(){
  document.getElementById('victory-screen').style.display='none';
  document.getElementById('setup-screen').style.display='flex';
  document.getElementById('controls').style.display='none';
  document.getElementById('word-input').value='';
  document.getElementById('word-display').innerHTML='';
  gameActive=false;
}

// ============ KEYBOARD CONTROLS ============
document.addEventListener('keydown',e=>{
  if(e.key==='ArrowLeft')moveDir=-1;
  else if(e.key==='ArrowRight')moveDir=1;
  else if(e.key===' '||e.key==='Enter'){if(gameActive)dropClaw();else startGame()}
});
document.addEventListener('keyup',e=>{
  if(e.key==='ArrowLeft'&&moveDir===-1)moveDir=0;
  if(e.key==='ArrowRight'&&moveDir===1)moveDir=0;
});

// ============ GAME LOOP ============
let lastTime=0;
function gameLoop(time){
  const dt=Math.min((time-lastTime)/1000,0.05);lastTime=time;
  if(gameActive){updateLetters(dt);updateClaw(dt);updateParticles(dt)}
  draw();
  requestAnimationFrame(gameLoop);
}
requestAnimationFrame(gameLoop);
</script>
</body>
</html>
