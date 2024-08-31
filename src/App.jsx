import "./App.css";

import { useEffect, useRef, useState } from "react";
import { Player } from "./classes/Player";
import { Bullet } from "./classes/Bullet";
import Hero from "./components/Hero";
import { gameFieldSize, mousePosition, playerColors } from "./utils/constants";

function App() {
  // Refs
  const canvasRef = useRef(null);
  const bulletsRef = useRef([]);

  // States
  const [menuVisible, setMenuVisible] = useState({ visible: false, player: null });
  const [players, setPlayers] = useState(null);

  // Handlers
  const handleMouseMove = (e) => {
    const mouseX = e.clientX;
    const mouseY = e.clientY;
    mousePosition.x = mouseX;
    mousePosition.y = mouseY;
  };

  const handleClick = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    // Hit detection
    for (const player of players) {
      const dx = mouseX - player.state.position.x;
      const dy = mouseY - player.state.position.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < player.state.radius) {
        setMenuVisible(prev => ({ visible: !prev.visible, player }));
      };
    };
  };

  useEffect(() => {
    // Vars
    let animationFrameId;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    // Event Listeners
    document.addEventListener('mousemove', handleMouseMove);

    // Class instances
    const Player1 = new Player(40, 40, 20, 'red', context);
    const Player2 = new Player(460, 20, 20, 'yellow', context);
    setPlayers([Player1, Player2]);

    // Draw function
    const draw = () => {
      context.clearRect(0, 0, canvas.width, canvas.height);

      Player1.updatePosition();
      Player1.draw();

      Player2.updatePosition();
      Player2.draw();

      // Bullet hit detection
      for (let [index, bullet] of bulletsRef.current.entries()) {
        bullet.start();

        // Bullet removal off-screen
        if (bullet.isOffScreen()) {
          bulletsRef.current.splice(index, 1);
        }

        if (
          bullet.color !== Player1.state.color &&
          bullet.x >= Player1.state.position.x - Player1.state.radius &&
          bullet.x <= Player1.state.position.x + Player1.state.radius &&
          bullet.y >= Player1.state.position.y - Player1.state.radius &&
          bullet.y <= Player1.state.position.y + Player1.state.radius
        ) {
          Player2.addPoints(setPlayers);
          bulletsRef.current.splice(index, 1);
        }

        if (
          bullet.color !== Player2.state.color &&
          bullet.x >= Player2.state.position.x - Player2.state.radius &&
          bullet.x <= Player2.state.position.x + Player2.state.radius &&
          bullet.y >= Player2.state.position.y - Player2.state.radius &&
          bullet.y <= Player2.state.position.y + Player2.state.radius
        ) {
          Player1.addPoints(setPlayers);
          bulletsRef.current.splice(index, 1);
        }
      }

      requestAnimationFrame(draw);
    };

    draw();

    // Clean up return fn
    return () => {
      cancelAnimationFrame(animationFrameId);
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  // Shooting frequency's interval update
  useEffect(() => {
    // Vars
    let p1Interval = null;
    let p2Interval = null;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    if (players && players.length >= 2) {
      const Player1 = players[0];
      const Player2 = players[1];

      p1Interval = setInterval(() => {
        bulletsRef.current.push(new Bullet(Player1.state.position.x, Player1.state.position.y, false, Player1.state.color, context));
      }, Player1.state.fireRate);

      p2Interval = setInterval(() => {
        bulletsRef.current.push(new Bullet(Player2.state.position.x, Player2.state.position.y, true, Player2.state.color, context));
      }, Player2.state.fireRate);
    }

    return () => {
      clearInterval(p1Interval);
      clearInterval(p2Interval);
    };
  }, [players]);

  return (
    <>
      <div className="container">
        <canvas ref={canvasRef} onClick={handleClick} width={gameFieldSize.width} height={gameFieldSize.height} />
        <div style={{borderRight: '3px solid black', borderBottom: '3px solid black', width: '500px'}}>
          <div style={{ display: 'flex', justifyContent: 'space-evenly', width: '100%', paddingTop: '10px' }}>
            <span>{players && players.length >= 2 && players[0].state.points}</span>
            <span>:</span>
            <span>{players && players.length >= 2 && players[1].state.points}</span>
          </div>
          <div className="players">
            {players && players.map((item) => <Hero key={item.state.color} hero={item} update={setPlayers} />)}
          </div>
        </div>
      </div>

      {menuVisible.visible && (
        <div className="colorSettings">
          <h3>Выберите цвет заклинаний:</h3>
          <div className="colorSettings__items">
            {playerColors.map(color => (
              <div className="colorSettings__item"
                key={color}
                style={{ backgroundColor: color }}
                onClick={() => menuVisible.player.state.color = color}
              />
            ))}
          </div>
          <button className="colorSettings__close" onClick={() => setMenuVisible(false)}>Close</button>
        </div>
      )}
    </>
  )
}

export default App
