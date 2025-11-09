'use client';

import { useDebugESPNData } from '@/hooks/useDebugESPNData';

export default function DebugESPNData() {
  const {
    debugInfo,
    allTeamsInfo,
    debugNFLData,
    compareFields,
    getFormattedBearsData,
  } = useDebugESPNData();

  return (
    <div className="p-6 bg-slate-900 text-white rounded-lg border border-slate-700 max-w-4xl mx-auto my-4">
      <h2 className="text-2xl font-bold mb-4">🔍 ESPN Data Debugger</h2>

      {/* Fetch Button */}
      <button
        onClick={debugNFLData}
        className="px-6 py-2 bg-blue-600 rounded hover:bg-blue-700 font-semibold mb-4"
      >
        Fetch NFL Data & Debug
      </button>

      {debugInfo && (
        <div className="space-y-4">
          {/* Status */}
          <div className="bg-slate-800 p-4 rounded">
            <h3 className="font-bold mb-2">📊 Status:</h3>
            <div className="space-y-1 text-sm">
              <p>
                <span className="font-semibold">Request Status:</span>{' '}
                {debugInfo.status === 'fetching' && '⏳ Fetching...'}
                {debugInfo.status === 'success' && '✅ Success'}
                {debugInfo.status === 'error' && '❌ Error'}
              </p>
              <p>
                <span className="font-semibold">Bears Found:</span>{' '}
                {debugInfo.bearsFound ? '✅ YES' : '❌ NO'}
              </p>
              <p>
                <span className="font-semibold">Total Teams Found:</span>{' '}
                {allTeamsInfo.length}
              </p>
              <p>
                <span className="font-semibold">Timestamp:</span>{' '}
                {new Date(debugInfo.timestamp).toLocaleTimeString()}
              </p>
            </div>
          </div>

          {/* All Teams List */}
          {allTeamsInfo.length > 0 && (
            <div className="bg-slate-800 p-4 rounded">
              <h3 className="font-bold mb-2">👥 All Teams Found ({allTeamsInfo.length}):</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                {allTeamsInfo.map((team, idx) => (
                  <div
                    key={idx}
                    className={`p-2 rounded ${
                      team.name.includes('Bears')
                        ? 'bg-orange-900/30 border border-orange-600'
                        : 'bg-slate-700'
                    }`}
                  >
                    <p className="font-semibold">{team.name}</p>
                    <p className="text-xs opacity-75">
                      Logo: {team.hasLogo ? '✅' : '❌'}
                    </p>
                    {team.recordData && (
                      <p className="text-xs opacity-75">
                        Record: {team.recordData.displayValue}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Bears Data Section */}
          {debugInfo.bearsData && (
            <div className="bg-orange-950/30 border-2 border-orange-600 p-4 rounded">
              <h3 className="font-bold mb-2 text-orange-400">🐻 Bears Data Structure:</h3>

              <div className="bg-slate-800 p-3 rounded mb-3 font-mono text-xs overflow-x-auto">
                <pre>{JSON.stringify(debugInfo.bearsData, null, 2)}</pre>
              </div>

              {/* Formatted Data */}
              <div className="bg-slate-800 p-3 rounded">
                <h4 className="font-bold mb-2 text-green-400">✅ Formatted for Component:</h4>
                <pre className="font-mono text-xs overflow-x-auto">
                  {JSON.stringify(getFormattedBearsData(), null, 2)}
                </pre>
              </div>
            </div>
          )}

          {/* Error Section */}
          {debugInfo.error && (
            <div className="bg-red-950/30 border-2 border-red-600 p-4 rounded">
              <h3 className="font-bold mb-2 text-red-400">❌ Error:</h3>
              <p className="font-mono text-sm">{debugInfo.error}</p>
            </div>
          )}

          {/* Analysis */}
          {debugInfo.bearsFound === false && debugInfo.status === 'success' && (
            <div className="bg-yellow-950/30 border-2 border-yellow-600 p-4 rounded">
              <h3 className="font-bold mb-2 text-yellow-400">⚠️ Analysis:</h3>
              <div className="space-y-2 text-sm">
                <p>
                  Found {allTeamsInfo.length} teams in the response, but none matched
                  'Bears'.
                </p>
                <p>
                  <strong>Possible Issues:</strong>
                </p>
                <ul className="list-disc list-inside ml-2 space-y-1">
                  <li>Team name in API is different than expected</li>
                  <li>Check the "All Teams Found" list above for exact names</li>
                  <li>Your filter condition might be looking for wrong text</li>
                </ul>
                <p className="mt-3">
                  <strong>Next Step:</strong> Look at team names above and update
                  your filter in useSportsStats.ts
                </p>
              </div>
            </div>
          )}

          {/* Copy Code Button */}
          <div>
            <button
              onClick={() => {
                compareFields();
                console.log('Formatted Data:', getFormattedBearsData());
                console.log('Full Debug Info:', debugInfo);
                alert('See browser console (F12) for detailed comparison table');
              }}
              className="px-4 py-2 bg-green-600 rounded hover:bg-green-700 text-sm font-semibold"
            >
              Compare Fields (Open Console with F12)
            </button>
          </div>
        </div>
      )}

      {!debugInfo && (
        <div className="bg-slate-800 p-4 rounded text-center text-slate-400">
          Click "Fetch NFL Data & Debug" to start debugging
        </div>
      )}
    </div>
  );
}