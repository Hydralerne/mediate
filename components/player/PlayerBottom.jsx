import { useState, lazy, Suspense } from 'react';
import { player } from '../../hooks/usePlayer';

const Player = lazy(() => import('./PlayerCore'));

const PlayerBottom = () => {
    const [playerData, setPlayer] = useState(null);
    player.setPlayer = setPlayer;

    if (playerData) {
        return (
            <Suspense fallback={null}>
                <Player data={playerData} />
            </Suspense>
        );
    }
    return null;
};

export default PlayerBottom;
