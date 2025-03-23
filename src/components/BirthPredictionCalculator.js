import React, { useState } from 'react';
import { AlertCircle, RefreshCcw, Printer, ChevronDown, ChevronUp } from 'lucide-react';

const BirthPredictionCalculator = () => {
  const [gender, setGender] = useState('');
  const [selectedPlanets, setSelectedPlanets] = useState({
    planet1: { planet: '', degree: '', minutes: '', seconds: '' },
    planet2: { planet: '', degree: '', minutes: '', seconds: '' },
    planet3: { planet: '', degree: '', minutes: '', seconds: '' }
  });
  const [showDetails, setShowDetails] = useState(false);
  const [showNakshatraGroups, setShowNakshatraGroups] = useState(false);

  const malePlanets = ['சூரியன்', 'சுக்கிரன்', 'குரு'];
  const femalePlanets = ['சந்திரன்', 'செவ்வாய்', 'குரு'];

  const planetDescriptions = {
    'சூரியன்': 'ஆத்ம காரகன்',
    'சுக்கிரன்': 'காம காரகன்',
    'குரு': 'புத்திர காரகன்',
    'சந்திரன்': 'மன காரகி',
    'செவ்வாய்': 'சக்தி காரகி'
  };

  const nakshatras = [
    'அஸ்வினி', 'பரணி', 'கார்த்திகை', 'ரோகிணி', 'மிருகசீரிஷம்', 'திருவாதிரை',
    'புனர்பூசம்', 'பூசம்', 'ஆயில்யம்', 'மகம்', 'பூரம்', 'உத்திரம்',
    'ஹஸ்தம்', 'சித்திரை', 'சுவாதி', 'விசாகம்', 'அனுஷம்', 'கேட்டை',
    'மூலம்', 'பூராடம்', 'உத்திராடம்', 'திருவோணம்', 'அவிட்டம்', 'சதயம்',
    'பூரட்டாதி', 'உத்திரட்டாதி', 'ரேவதி'
  ];

  const rasis = [
    { name: 'மேஷம்', start: 0, end: 30, gender: 'male' },
    { name: 'ரிஷபம்', start: 30, end: 60, gender: 'female' },
    { name: 'மிதுனம்', start: 60, end: 90, gender: 'male' },
    { name: 'கடகம்', start: 90, end: 120, gender: 'female' },
    { name: 'சிம்மம்', start: 120, end: 150, gender: 'male' },
    { name: 'கன்னி', start: 150, end: 180, gender: 'female' },
    { name: 'துலாம்', start: 180, end: 210, gender: 'male' },
    { name: 'விருச்சிகம்', start: 210, end: 240, gender: 'female' },
    { name: 'தனுசு', start: 240, end: 270, gender: 'male' },
    { name: 'மகரம்', start: 270, end: 300, gender: 'female' },
    { name: 'கும்பம்', start: 300, end: 330, gender: 'male' },
    { name: 'மீனம்', start: 330, end: 360, gender: 'female' }
  ];

  const nakshatraD9Mapping = {
    // Group 1: Mesha to Kataka
    'அஸ்வினி': { start: 0 },     // Mesha to Kataka
    'மகம்': { start: 0 },
    'மூலம்': { start: 0 },
    'ரோகிணி': { start: 0 },
    'ஹஸ்தம்': { start: 0 },
    'திருவோணம்': { start: 0 },
    'புனர்பூசம்': { start: 0 },
    'விசாகம்': { start: 0 },
    'பூரட்டாதி': { start: 0 },

    // Group 2: Simha to Vrichika
    'பரணி': { start: 4 },      // Simha to Vrichika
    'பூரம்': { start: 4 },
    'பூராடம்': { start: 4 },
    'மிருகசீரிஷம்': { start: 4 },
    'சித்திரை': { start: 4 },
    'அவிட்டம்': { start: 4 },
    'பூசம்': { start: 4 },
    'அனுஷம்': { start: 4 },
    'உத்திரட்டாதி': { start: 4 },

    // Group 3: Dhanusu to Meena
    'கார்த்திகை': { start: 8 }, // Dhanusu to Meena
    'உத்திரம்': { start: 8 },
    'உத்திராடம்': { start: 8 },
    'திருவாதிரை': { start: 8 },
    'சுவாதி': { start: 8 },
    'சதயம்': { start: 8 },
    'ஆயில்யம்': { start: 8 },
    'கேட்டை': { start: 8 },
    'ரேவதி': { start: 8 }
  };

  // Special boundary cases that require explicit handling
  const specialBoundaries = {
    130: { nakshatra: 'மகம்', pada: 3 } // 130° is Magha Pada 3
  };

  const getNakshatra = (degrees) => {
    // Normalize degrees to 0-360 range
    const normalizedDegrees = degrees === 360 ? 0 : degrees;
    
    // Check if we're exactly on a special boundary
    if (specialBoundaries[normalizedDegrees]) {
      return {
        name: specialBoundaries[normalizedDegrees].nakshatra,
        pada: specialBoundaries[normalizedDegrees].pada
      };
    }
    
    // Each nakshatra spans 13°20' (13.333333°)
    const nakshatraIndex = Math.floor(normalizedDegrees / 13.333333);
    const nakshatraStartDegree = nakshatraIndex * 13.333333;
    const positionInNakshatra = normalizedDegrees - nakshatraStartDegree;
    
    // Each pada spans 3°20' (3.333333°)
    let pada;
    if (positionInNakshatra < 3.333333) {
      pada = 1;
    } else if (positionInNakshatra < 6.666667) {
      pada = 2;
    } else if (positionInNakshatra < 10) {
      pada = 3;
    } else {
      pada = 4;
    }
    
    return {
      name: nakshatras[nakshatraIndex % 27],
      pada: pada
    };
  };

  const handlePlanetChange = (planetNum, field, value) => {
    setSelectedPlanets(prev => ({
      ...prev,
      [planetNum]: {
        ...prev[planetNum],
        [field]: value
      }
    }));
  };

  const calculateTotal = () => {
    let totalDegrees = 0;
    let totalMinutes = 0;
    let totalSeconds = 0;

    // First add all values separately
    Object.values(selectedPlanets).forEach(planet => {
      if (planet.degree && planet.minutes && planet.seconds) {
        totalDegrees += parseInt(planet.degree);
        totalMinutes += parseInt(planet.minutes);
        totalSeconds += parseInt(planet.seconds);
      } else if (planet.degree && planet.minutes) {
        totalDegrees += parseInt(planet.degree);
        totalMinutes += parseInt(planet.minutes);
      } else if (planet.degree) {
        totalDegrees += parseInt(planet.degree);
      }
    });

    // Handle seconds overflow to minutes
    if (totalSeconds >= 60) {
      const additionalMinutes = Math.floor(totalSeconds / 60);
      totalMinutes += additionalMinutes;
      totalSeconds = totalSeconds % 60;
    }

    // Handle minutes overflow to degrees
    if (totalMinutes >= 60) {
      const additionalDegrees = Math.floor(totalMinutes / 60);
      totalDegrees += additionalDegrees;
      totalMinutes = totalMinutes % 60;
    }

    // Handle degrees overflow
    if (totalDegrees > 360) {
      totalDegrees = totalDegrees - 360;
    }

    return { 
      degrees: totalDegrees, 
      minutes: totalMinutes, 
      seconds: totalSeconds 
    };
  };

  const getRasi = (degrees) => {
    return rasis.find(rasi => degrees >= rasi.start && degrees < rasi.end);
  };

  const getD9Rasi = (degrees, minutes, seconds) => {
    // Convert to total degrees for precise calculation
    const totalDegrees = degrees + (minutes / 60) + (seconds / 3600);
    
    // Get the nakshatra and pada
    const nakshatra = getNakshatra(totalDegrees);
    
    // Get the mapping for this nakshatra
    const mapping = nakshatraD9Mapping[nakshatra.name];
    
    // Calculate the D9 rasi index
    const baseRasiIndex = mapping.start;
    const d9RasiIndex = baseRasiIndex + (nakshatra.pada - 1);
    
    return rasis[d9RasiIndex];
  };

  const getPrediction = (d1Rasi, d9Rasi) => {
    const appName = gender === 'male' ? 'பீஜ ஸ்பூடம்' : 'ஷேத்ரிய ஸ்பூடம்';

    if (gender === 'male') {
      if (d1Rasi.gender === 'male' && d9Rasi.gender === 'male') {
        return `${appName}: குழந்தை பிறப்பு சாத்தியம்`;
      } else if (d1Rasi.gender === 'male' && d9Rasi.gender === 'female') {
        return `${appName}: குழந்தை பிறப்பு தாமதமாகலாம் அல்லது சிகிச்சையின் மூலம் குழந்தை பிறக்கும்`;
      } else {
        return `${appName}: குழந்தை பிறப்பு சாத்தியமில்லை - இறைவனின் விருப்பம்`;
      }
    } else {
      if (d1Rasi.gender === 'female' && d9Rasi.gender === 'female') {
        return `${appName}: குழந்தை பிறப்பு சாத்தியம்`;
      } else if (d1Rasi.gender === 'male' && d9Rasi.gender === 'male') {
        return `${appName}: குழந்தை பிறப்பு சாத்தியமில்லை - இறைவனின் விருப்பம்`;
      } else {
        return `${appName}: குழந்தை பிறப்பு தாமதமாகலாம் அல்லது சிகிச்சையின் மூலம் குழந்தை பிறக்கும்`;
      }
    }
  };

  const resetForm = () => {
    setSelectedPlanets({
      planet1: { planet: '', degree: '', minutes: '', seconds: '' },
      planet2: { planet: '', degree: '', minutes: '', seconds: '' },
      planet3: { planet: '', degree: '', minutes: '', seconds: '' }
    });
  };

  const printResults = () => {
    window.print();
  };

  // Function to get D9 group description
  const getD9GroupDescription = (nakshatra, pada) => {
    if (nakshatraD9Mapping[nakshatra].start === 0) {
      // Group 1: Mesha to Kataka
      switch(pada) {
        case 1: return 'மேஷம்';
        case 2: return 'ரிஷபம்';
        case 3: return 'மிதுனம்';
        case 4: return 'கடகம்';
        default: return 'மேஷம் - மிதுனம்';
      }
    } else if (nakshatraD9Mapping[nakshatra].start === 4) {
      // Group 2: Simha to Vrichika
      switch(pada) {
        case 1: return 'சிம்மம்';
        case 2: return 'கன்னி';
        case 3: return 'துலாம்';
        case 4: return 'விருச்சிகம்';
        default: return 'சிம்மம் - விருச்சிகம்';
      }
    } else {
      // Group 3: Dhanusu to Meena
      switch(pada) {
        case 1: return 'தனுசு';
        case 2: return 'மகரம்';
        case 3: return 'கும்பம்';
        case 4: return 'மீனம்';
        default: return 'தனுசு - மீனம்';
      }
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto bg-blue-50 rounded-xl shadow-md">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="text-xl text-gray-600 mb-2">ஓம் மகா கணபதியே நம:</div>
        <h1 className="text-3xl font-bold mb-2">குழந்தை பிறப்பு கணிப்பு</h1>
        <h2 className="text-2xl font-bold">
          {gender === 'male' ? 'பீஜ ஸ்பூடம்' : gender === 'female' ? 'ஷேத்ரிய ஸ்பூடம்' : ''}
        </h2>
      </div>

      {/* Gender Selection */}
      <div className="mb-6">
        <label className="block mb-2 font-semibold">பாலினம் தேர்வு செய்க:</label>
        <div className="grid grid-cols-2 gap-4">
          <button 
            className={`p-3 rounded-lg text-center transition ${gender === 'male' ? 'bg-blue-600 text-white font-bold' : 'bg-white hover:bg-blue-100'}`}
            onClick={() => setGender('male')}
          >
            ஆண்
          </button>
          <button 
            className={`p-3 rounded-lg text-center transition ${gender === 'female' ? 'bg-pink-600 text-white font-bold' : 'bg-white hover:bg-pink-100'}`}
            onClick={() => setGender('female')}
          >
            பெண்
          </button>
        </div>
      </div>

      {gender && (
        <div className="space-y-6">
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h3 className="font-bold mb-4">கிரக நிலைகள்</h3>
            
            {/* Column Headers */}
            <div className="grid grid-cols-4 gap-2 mb-2 text-sm font-medium text-gray-600">
              <div>கிரகம்</div>
              <div>பாகை</div>
              <div>நிமிடங்கள்</div>
              <div>வினாடிகள்</div>
            </div>
            
            {/* Planet Inputs */}
            {[1, 2, 3].map((num) => (
              <div key={num} className="grid grid-cols-4 gap-2 mb-3">
                <select
                  className="p-2 border rounded"
                  value={selectedPlanets[`planet${num}`].planet}
                  onChange={(e) => handlePlanetChange(`planet${num}`, 'planet', e.target.value)}
                >
                  <option value="">தேர்வு</option>
                  {(gender === 'male' ? malePlanets : femalePlanets).map(planet => (
                    <option key={planet} value={planet}>{planet}</option>
                  ))}
                </select>
                <input
                  type="number"
                  placeholder="0-360"
                  className="p-2 border rounded"
                  min="0"
                  max="360"
                  value={selectedPlanets[`planet${num}`].degree}
                  onChange={(e) => handlePlanetChange(`planet${num}`, 'degree', e.target.value)}
                />
                <input
                  type="number"
                  placeholder="0-59"
                  className="p-2 border rounded"
                  min="0"
                  max="59"
                  value={selectedPlanets[`planet${num}`].minutes}
                  onChange={(e) => handlePlanetChange(`planet${num}`, 'minutes', e.target.value)}
                />
                <input
                  type="number"
                  placeholder="0-59"
                  className="p-2 border rounded"
                  min="0"
                  max="59"
                  value={selectedPlanets[`planet${num}`].seconds}
                  onChange={(e) => handlePlanetChange(`planet${num}`, 'seconds', e.target.value)}
                />
              </div>
            ))}
            
            {/* Action Buttons */}
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={resetForm}
                className="flex items-center px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition"
              >
                <RefreshCcw className="w-4 h-4 mr-2" />
                Reset
              </button>
            </div>
          </div>

          {/* Results Section */}
          {Object.values(selectedPlanets).some(p => p.degree) && (() => {
            const total = calculateTotal();
            const d1Rasi = getRasi(total.degrees);
            const nakshatra = getNakshatra(total.degrees);
            const d9Rasi = getD9Rasi(total.degrees, total.minutes, total.seconds);

            if (!d1Rasi || !d9Rasi) return null;

            return (
              <div className="space-y-4">
                {/* Summary Result Box */}
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-xl font-bold">முடிவு</h3>
                    <button 
                      onClick={printResults}
                      className="flex items-center px-3 py-1 bg-blue-100 rounded hover:bg-blue-200 transition text-sm"
                    >
                      <Printer className="w-4 h-4 mr-1" />
                      Print
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-3">
                    <div className="p-3 bg-blue-100 rounded text-center">
                      <div className="text-sm text-gray-600">D1 ராசி</div>
                      <div className="font-semibold">{d1Rasi.name}</div>
                      <div className="text-sm">({d1Rasi.gender === 'male' ? 'ஆண்' : 'பெண்'})</div>
                    </div>
                    <div className="p-3 bg-blue-100 rounded text-center">
                      <div className="text-sm text-gray-600">D9 ராசி</div>
                      <div className="font-semibold">{d9Rasi.name}</div>
                      <div className="text-sm">({d9Rasi.gender === 'male' ? 'ஆண்' : 'பெண்'})</div>
                    </div>
                  </div>
                  
                  <div className="p-3 bg-blue-600 text-white rounded text-center">
                    <p className="text-lg">{getPrediction(d1Rasi, d9Rasi)}</p>
                  </div>
                </div>
                
                {/* Detailed Calculations - Expandable */}
                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                  <button 
                    className="flex justify-between items-center w-full p-4 text-left font-semibold"
                    onClick={() => setShowDetails(!showDetails)}
                  >
                    விரிவான கணக்கீடுகள்
                    {showDetails ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </button>
                  
                  {showDetails && (
                    <div className="p-4 pt-0 border-t">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-3">
                          <h4 className="font-semibold">கணக்கீடுகள்:</h4>
                          {Object.entries(selectedPlanets).map(([key, planet]) => (
                            planet.degree ? (
                              <p key={key} className="text-sm">
                                {planet.planet || `கிரகம் ${key.slice(-1)}`}: {planet.degree}° {planet.minutes || 0}' {planet.seconds || 0}"
                              </p>
                            ) : null
                          ))}
                          <p className="font-medium border-t pt-2">
                            மொத்தம்: {total.degrees}° {total.minutes}' {total.seconds}"
                          </p>
                        </div>
                        
                        <div className="space-y-2">
                          <h4 className="font-semibold">D1 விளக்கம்:</h4>
                          <p className="text-sm">ராசி: {d1Rasi.name}</p>
                          <p className="text-sm">நட்சத்திரம்: {nakshatra.name}</p>
                          <p className="text-sm">பாதம்: {nakshatra.pada}</p>
                          <div className="pt-2">
                            <h4 className="font-semibold">D9 குழு:</h4>
                            <p className="text-sm">
                              {getD9GroupDescription(nakshatra.name, nakshatra.pada)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Nakshatra Groups - Expandable */}
                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                  <button 
                    className="flex justify-between items-center w-full p-4 text-left font-semibold"
                    onClick={() => setShowNakshatraGroups(!showNakshatraGroups)}
                  >
                    நட்சத்திர குழுக்கள்
                    {showNakshatraGroups ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </button>
                  
                  {showNakshatraGroups && (
                    <div className="p-4 pt-0 border-t">
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-semibold">குழு 1 (மேஷம் - கடகம்):</h4>
                          <p className="text-sm">அஸ்வினி, மகம், மூலம், ரோகிணி, ஹஸ்தம், திருவோணம், புனர்பூசம், விசாகம், பூரட்டாதி</p>
                          <div className="grid grid-cols-4 gap-2 mt-2 text-xs">
                            <div className="text-center p-1 bg-gray-100 rounded">பாதம் 1: மேஷம்</div>
                            <div className="text-center p-1 bg-gray-100 rounded">பாதம் 2: ரிஷபம்</div>
                            <div className="text-center p-1 bg-gray-100 rounded">பாதம் 3: மிதுனம்</div>
                            <div className="text-center p-1 bg-gray-100 rounded">பாதம் 4: கடகம்</div>
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="font-semibold">குழு 2 (சிம்மம் - விருச்சிகம்):</h4>
                          <p className="text-sm">பரணி, பூரம், பூராடம், மிருகசீரிஷம், சித்திரை, அவிட்டம், பூசம், அனுஷம், உத்திரட்டாதி</p>
                          <div className="grid grid-cols-4 gap-2 mt-2 text-xs">
                            <div className="text-center p-1 bg-gray-100 rounded">பாதம் 1: சிம்மம்</div>
                            <div className="text-center p-1 bg-gray-100 rounded">பாதம் 2: கன்னி</div>
                            <div className="text-center p-1 bg-gray-100 rounded">பாதம் 3: துலாம்</div>
                            <div className="text-center p-1 bg-gray-100 rounded">பாதம் 4: விருச்சிகம்</div>
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="font-semibold">குழு 3 (தனுசு - மீனம்):</h4>
                          <p className="text-sm">கார்த்திகை, உத்திரம், உத்திராடம், திருவாதிரை, சுவாதி, சதயம், ஆயில்யம், கேட்டை, ரேவதி</p>
                          <div className="grid grid-cols-4 gap-2 mt-2 text-xs">
                            <div className="text-center p-1 bg-gray-100 rounded">பாதம் 1: தனுசு</div>
                            <div className="text-center p-1 bg-gray-100 rounded">பாதம் 2: மகரம்</div>
                            <div className="text-center p-1 bg-gray-100 rounded">பாதம் 3: கும்பம்</div>
                            <div className="text-center p-1 bg-gray-100 rounded">பாதம் 4: மீனம்</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
};

export default BirthPredictionCalculator;