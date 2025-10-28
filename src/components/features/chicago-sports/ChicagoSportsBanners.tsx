'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { chicagoTeams } from '@/data/chicagoTeams';
import { useSportsStats } from '@/hooks/useSportsStats';

export function ChicagoSportsBanners() {
  const router = useRouter();
  const { teams } = useSportsStats();
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const getTeamStats = (teamName: string) => {
    return teams.find(t => t.name === teamName);
  };

  const handleBannerClick = (teamId: string) => {
    router.push(`/chicago-sports/${teamId}`);
  };

  return (
    <div className="w-full bg-gray-900 flex items-center justify-center" style={{ height: 'calc(100vh - 200px)' }}>
      <div className="w-full h-full max-w-7xl mx-auto">
        
        {/* All 7 Teams - Full Height, No Scroll */}
        <motion.div
          className="flex items-stretch h-full"
          style={{
            gap: "0px",
            justifyContent: "space-between"
          }}
        >
          {chicagoTeams.map((team, index) => {
            const stats = getTeamStats(team.fullName);
            const isHovered = hoveredId === team.id;
            const isOtherHovered = hoveredId !== null && hoveredId !== team.id;

            return (
              <motion.button
                key={team.id}
                layout
                animate={{
                  flex: isHovered ? 2 : 1  // Hovered gets 2x the space
                }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 30,
                  mass: 0.8
                }}
                onMouseEnter={() => setHoveredId(team.id)}
                onMouseLeave={() => setHoveredId(null)}
                onClick={() => handleBannerClick(team.id)}
                className={`relative overflow-hidden cursor-pointer transition-all duration-300 group focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 flex flex-col items-center justify-center ${
                  isHovered
                    ? "shadow-2xl z-10"
                    : isOtherHovered
                    ? "opacity-40 blur-sm"
                    : "shadow-none hover:shadow-lg"
                }`}
                style={{
                  background: `linear-gradient(135deg, ${team.colors.primary} 0%, ${team.colors.secondary} 100%)`,
                  borderColor: team.colors.secondary,
                  borderRight: index < chicagoTeams.length - 1 ? '1px solid rgba(255,255,255,0.1)' : 'none'
                }}
              >
                {/* Background Overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/40 group-hover:from-black/10 group-hover:to-black/50 transition-all duration-300" />

                {/* Content Container - Centered by default, expands on hover */}
                <div className="relative h-full flex flex-col justify-center items-center p-6 text-white w-full">
                  
                  {/* Logo - Always Visible */}
                  <motion.div
                    className="relative"
                    animate={{ 
                      scale: isHovered ? 1.2 : 1,
                      marginBottom: isHovered ? 24 : 0
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="relative w-16 h-16 md:w-24 md:h-24 flex items-center justify-center">
                      <Image
                        src={team.logo}
                        alt={team.fullName}
                        width={96}
                        height={96}
                        className="w-full h-full object-contain"
                        priority
                      />
                    </div>
                  </motion.div>

                  {/* Team Name - Visible on Hover */}
                  <motion.div
                    className="text-center"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{
                      opacity: isHovered ? 1 : 0,
                      height: isHovered ? "auto" : 0
                    }}
                    transition={{ duration: 0.3 }}
                    style={{ overflow: "hidden" }}
                  >
                    <motion.h2
                      className="text-2xl md:text-3xl font-bold leading-tight mb-1"
                      animate={{ 
                        whiteSpace: isHovered ? "normal" : "nowrap"
                      }}
                    >
                      {team.fullName}
                    </motion.h2>
                    
                    <motion.div
                      className="text-sm font-semibold opacity-80 mb-4"
                    >
                      {team.sport}
                    </motion.div>
                  </motion.div>

                  {/* Stats - Visible on Hover */}
                  <motion.div
                    className="text-center w-full px-4"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{
                      opacity: isHovered ? 1 : 0,
                      height: isHovered ? "auto" : 0
                    }}
                    transition={{ duration: 0.3, delay: 0.05 }}
                    style={{ overflow: "hidden" }}
                  >
                    {stats ? (
                      <div className="space-y-3 w-full">
                        {/* Full Record */}
                        <div className="bg-white/15 backdrop-blur-sm rounded-lg px-4 py-3">
                          <p className="text-xs text-white/80 mb-1">Record</p>
                          <p className="text-2xl md:text-3xl font-bold">{stats.record}</p>
                        </div>

                        {/* W-L-T Stats */}
                        <div className="flex gap-2 justify-center text-xs">
                          <div className="flex-1 bg-white/15 backdrop-blur-sm rounded px-3 py-2 text-center">
                            <p className="text-white/70 text-xs mb-1">W</p>
                            <p className="font-bold text-lg">{stats.wins}</p>
                          </div>
                          <div className="flex-1 bg-white/15 backdrop-blur-sm rounded px-3 py-2 text-center">
                            <p className="text-white/70 text-xs mb-1">L</p>
                            <p className="font-bold text-lg">{stats.losses}</p>
                          </div>
                          {stats.ties !== undefined && (
                            <div className="flex-1 bg-white/15 backdrop-blur-sm rounded px-3 py-2 text-center">
                              <p className="text-white/70 text-xs mb-1">T</p>
                              <p className="font-bold text-lg">{stats.ties}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="text-xs opacity-50">Loading...</div>
                    )}
                  </motion.div>

                  {/* Last Updated - Visible on Hover */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: isHovered ? 1 : 0 }}
                    transition={{ duration: 0.3, delay: 0.15 }}
                    className="text-xs text-white/50 mt-4"
                  >
                    {stats ? `Updated: ${stats.lastUpdated}` : ""}
                  </motion.div>
                </div>

                {/* Hover Overlay Effect */}
                <div className="absolute inset-0 bg-white/0 group-hover:bg-white/5 transition-colors duration-300 pointer-events-none" />
              </motion.button>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
}