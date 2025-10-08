// script.js
(function(){
  // Cube model: each face is an array of 9 stickers (indexes 0..8)
  // Faces: U, R, F, D, L, B (standard cubing notation)
  const initial = {
    U: Array(9).fill('white'),
    R: Array(9).fill('red'),
    F: Array(9).fill('blue'),
    D: Array(9).fill('yellow'),
    L: Array(9).fill('orange'),
    B: Array(9).fill('green')
  };

  let cube = deepCopy(initial);

  const faceOrder = ['U','R','F','D','L','B'];
  const faceLabels = {U:'Up', R:'Right', F:'Front', D:'Down', L:'Left', B:'Back'};

  const facesContainer = document.querySelector('.faces');

  function deepCopy(obj){return JSON.parse(JSON.stringify(obj))}

  function render(){
    facesContainer.innerHTML = '';
    for(const face of faceOrder){
      const wrap = document.createElement('div');
      wrap.className = 'face-wrap';
      const label = document.createElement('div');
      label.className = 'face-name'; label.textContent = face + ' — ' + faceLabels[face];
      const faceEl = document.createElement('div');
      faceEl.className = 'face';
      faceEl.dataset.face = face;
      cube[face].forEach((col, idx)=>{
        const s = document.createElement('div');
        s.className = 'sticker c-' + colorNameToClass(col);
        s.dataset.index = idx;
        faceEl.appendChild(s);
      });
      wrap.appendChild(label);
      wrap.appendChild(faceEl);
      facesContainer.appendChild(wrap);
    }
  }

  function colorNameToClass(name){
    switch(name){
      case 'white': return 'white';
      case 'red': return 'red';
      case 'blue': return 'blue';
      case 'yellow': return 'yellow';
      case 'orange': return 'orange';
      case 'green': return 'green';
      default: return 'white';
    }
  }

  // Rotate a single face's stickers clockwise
  function rotateFaceArray(arr, clockwise=true){
    const m = arr.slice();
    const mapCW = [6,3,0,7,4,1,8,5,2];
    const mapCCW = [2,5,8,1,4,7,0,3,6];
    const map = clockwise ? mapCW : mapCCW;
    for(let i=0;i<9;i++) arr[i]=m[map[i]];
  }

  // Define the effect of rotating each face on adjacent face stickers
  const adjacentMap = {
    U: [ ['B',[2,1,0]], ['R',[2,1,0]], ['F',[2,1,0]], ['L',[2,1,0]] ],
    D: [ ['F',[6,7,8]], ['R',[6,7,8]], ['B',[6,7,8]], ['L',[6,7,8]] ],
    F: [ ['U',[6,7,8]], ['R',[0,3,6]], ['D',[2,1,0]], ['L',[8,5,2]] ],
    B: [ ['U',[2,1,0]], ['L',[0,3,6]], ['D',[6,7,8]], ['R',[8,5,2]] ],
    R: [ ['U',[8,5,2]], ['B',[0,3,6]], ['D',[8,5,2]], ['F',[8,5,2]] ],
    L: [ ['U',[0,3,6]], ['F',[0,3,6]], ['D',[0,3,6]], ['B',[8,5,2]] ]
  };

  function rotate(face, clockwise=true){
    rotateFaceArray(cube[face], clockwise);

    const strips = adjacentMap[face];
    const extracted = strips.map(([f, idxs])=> idxs.map(i=>cube[f][i]));

    const shifted = extracted.slice();
    for(let i=0;i<4;i++){
      const from = (i + (clockwise?3:1)) % 4;
      shifted[i] = extracted[from];
    }

    for(let i=0;i<4;i++){
      const [f, idxs] = strips[i];
      for(let j=0;j<idxs.length;j++){
        cube[f][idxs[j]] = shifted[i][j];
      }
    }

    render();
  }

  function doMove(notation){
    const prime = notation.endsWith("'");
    const face = prime ? notation[0] : notation;
    rotate(face, !prime);
  }

  function randomMove(){
    const moves = ['U','U\'','R','R\'','F','F\'','D','D\'','L','L\'','B','B\''];
    const m = moves[Math.floor(Math.random()*moves.length)];
    doMove(m);
    return m;
  }

  function scramble(n=20){
    const seq = [];
    for(let i=0;i<n;i++) seq.push(randomMove());
    return seq;
  }

  function resetCube(){ cube = deepCopy(initial); render(); }

  document.addEventListener('click', e=>{
    const mv = e.target.dataset.move;
    if(mv) doMove(mv);
  });
  document.getElementById('scramble').addEventListener('click', ()=>{
    scramble(25);
  });
  document.getElementById('reset').addEventListener('click', ()=>resetCube());
  document.getElementById('random-move').addEventListener('click', ()=>randomMove());

  document.addEventListener('keydown', e=>{
    const key = e.key.toUpperCase();
    if(['U','R','F','D','L','B'].includes(key)){
      const notation = e.shiftKey ? key + "'" : key;
      doMove(notation);
    }
  });

  render();
})();
