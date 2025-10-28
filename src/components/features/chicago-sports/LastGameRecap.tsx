'use client';

import { useState, useEffect } from 'react';
import { ChicagoTeam } from '@/data/chicagoTeams';
import { useGameData } from '@/hooks/useGameData';

interface LastGameRecapProps {
  team: ChicagoTeam;
}

export function LastGameRecap({ team }: LastGameRecapProps) {
  const { gameData, loading, error } = useGameData(team.id);
  const [isReplaying, setIsReplaying] = useState(false);
  const [currentPeriod, setCurrentPeriod] = useState(0);

  useEffect(() => {
    if (!isReplaying) {
      setCurrentPeriod(0);
      return;
    }

    if (!gameData) return;

    const interval = setInterval(() => {
      setCurrentPeriod(prev => {
        if (prev >= gameData.scoreProgression.length - 1) {
          setIsReplaying(false);
          return prev;
        }
        return prev + 1;
      });
    }, 2000); // 2 seconds per period

    return () => clearInterval(interval);
  }, [isReplaying, gameData]);

  if (loading) {
    return (
      <div className="text-white">
        <h2 className="text-2xl font-bold mb-4">Last Game Recap</h2>
        <div className="text-center py-8">
          <div className="inline-block animate-spin">
            <div
              className="w-8 h-8 border-4 border-gray-300 rounded-full"
              style={{
                borderTopColor: team.colors.secondary,
              }}
            />
          </div>
          <p className="text-gray-400 mt-4">Loading game data...</p>
        </div>
      </div>
    );
  }

  if (error || !gameData) {
    return (
      <div className="text-white">
        <h2 className="text-2xl font-bold mb-4">Last Game Recap</h2>
        <div
          className="p-6 rounded-lg text-center opacity-75"
          style={{ backgroundColor: `${team.colors.secondary}20` }}
        >
          <p>{error || 'No game data available'}</p>
        </div>
      </div>
    );
  }

  const currentScore = gameData.scoreProgression[currentPeriod];

  return (
    <div className="text-white space-y-6">
      <h2 className="text-2xl font-bold">Last Game Recap</h2>

      {/* Game Header */}
      <div
        className="p-6 rounded-lg border-2"
        style={{
          backgroundColor: `${team.colors.secondary}10`,
          borderColor: team.colors.secondary,
        }}
      >
        <p className="text-sm opacity-75 mb-2">{gameData.date}</p>
        <div className="flex items-center justify-between mb-4">
          <div className="text-center flex-1">
            <p className="text-sm opacity-75 mb-1">Final Score</p>
            <p className="text-4xl font-bold">{gameData.finalScore.team}</p>
          </div>
          <div className="text-center flex-1">
            <p className={`text-2xl font-bold px-4 py-2 rounded ${
              gameData.result === 'W'
                ? 'bg-green-500/20 text-green-300'
                : gameData.result === 'L'
                ? 'bg-red-500/20 text-red-300'
                : 'bg-yellow-500/20 text-yellow-300'
            }`}>
              {gameData.result === 'W' ? 'WIN' : gameData.result === 'L' ? 'LOSS' : 'TIE'}
            </p>
          </div>
          <div className="text-center flex-1">
            <p className="text-sm opacity-75 mb-1">Opponent</p>
            <p className="text-4xl font-bold">{gameData.finalScore.opponent}</p>
          </div>
        </div>
        <p className="text-sm opacity-50 text-center">{gameData.location}</p>
      </div>

      {/* Score Progression Replay */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Score Progression</h3>
          <button
            onClick={() => setIsReplaying(!isReplaying)}
            className="px-4 py-2 rounded text-sm font-medium transition-all"
            style={{
              backgroundColor: isReplaying ? `${team.colors.secondary}50` : team.colors.secondary,
              color: team.colors.primary === '#000000' ? 'white' : team.colors.primary,
            }}
          >
            {isReplaying ? '⏸ Pause' : '▶ Replay'}
          </button>
        </div>

        {/* Live Score Display */}
        {currentScore && (
          <div
            className="p-6 rounded-lg mb-4"
            style={{ backgroundColor: `${team.colors.secondary}20` }}
          >
            <div className="text-center">
              <p className="text-sm opacity-75 mb-2">{currentScore.timestamp}</p>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="opacity-75 text-sm">Team</p>
                  <p className="text-3xl font-bold">{currentScore.teamScore}</p>
                </div>
                <div>
                  <p className="opacity-75 text-sm">vs</p>
                  <p className="text-sm mt-2">-</p>
                </div>
                <div>
                  <p className="opacity-75 text-sm">Opponent</p>
                  <p className="text-3xl font-bold">{currentScore.opponentScore}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Period Timeline */}
        <div className="space-y-2">
          {gameData.scoreProgression.map((score, index) => (
            <button
              key={index}
              onClick={() => {
                setCurrentPeriod(index);
                setIsReplaying(false);
              }}
              className="w-full p-3 rounded text-left transition-all hover:shadow-md"
              style={{
                backgroundColor:
                  index === currentPeriod
                    ? `${team.colors.secondary}50`
                    : `${team.colors.secondary}20`,
                borderLeft: index === currentPeriod ? `4px solid ${team.colors.secondary}` : 'none',
              }}
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold">{score.timestamp}</span>
                <span className="text-sm opacity-75">
                  {score.teamScore} - {score.opponentScore}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Game Summary */}
      <div
        className="p-4 rounded-lg text-sm opacity-75"
        style={{ backgroundColor: `${team.colors.secondary}10` }}
      >
        <p>
          {team.name} {gameData.result === 'W' ? 'defeated' : 'lost to'} {gameData.opponent}{' '}
          {gameData.finalScore.team} - {gameData.finalScore.opponent} on {gameData.date} at{' '}
          {gameData.location}.
        </p>
      </div>
    </div>
  );
}