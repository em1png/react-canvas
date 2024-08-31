import { useState } from "react";
import { fireRateLimit, speedLimit } from "../utils/constants";

const Hero = ({ hero, update }) => {
    const [speed, setSpeed] = useState(hero.state.speed);
    const [fireRate, setFireRate] = useState(hero.state.fireRate);

    const onChangeSpeed = (e) => {
        const value = Number(e.target.value);
        hero.setSpeed(value);
        setSpeed(value);
    };

    const onChangeFireRate = (e) => {
        const value = Number(e.target.value);
        hero.setFireRate(value);
        setFireRate(value);
        update(prev => [...prev]);
    }

    return (
        <div className="hero">
            <h2 style={{ marginBottom: '15px' }}>{hero.color}</h2>
            <div className="hero__settings">
                <div className="hero_settings_item">
                    Частота стрельбы:
                    <input
                        type="range"
                        min={fireRateLimit.min}
                        max={fireRateLimit.max}
                        value={fireRate}
                        onChange={onChangeFireRate}
                    />
                    {hero.state.fireRate} мс
                </div>
                <div>
                    Скорость:
                    <input
                        type="range"
                        min={1}
                        max={speedLimit.max}
                        value={speed}
                        onChange={onChangeSpeed}
                    />
                    {speed}
                </div>
            </div>

        </div>
    );
};

export default Hero;