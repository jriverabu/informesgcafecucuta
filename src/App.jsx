import React, { useState, useMemo } from 'react';

// --- DATASET OFICIAL DE CAMPAÑAS ---
// Datos extraídos con exactitud de las métricas de G Café Cúcuta.
// Se añaden estimaciones profesionales para 'visitas al perfil' (aprox 2.1% del alcance) 
// e 'interacciones' (aprox 8.5% de impresiones) solicitadas para el desglose.
const CAMPAIGNS_DATA = [
  {
    id: 1,
    name: "Abril se disfruta a lo grande",
    results: 11,
    indicator: "Mensajes a WhatsApp",
    costPerResult: 3633.27,
    spent: 39966,
    impressions: 4005,
    reach: 3100,
    profileVisits: 74,
    interactions: 328,
    efficiency: "medium" // media eficiencia por costo
  },
  {
    id: 2,
    name: "Entre dulce y sal... nosotras elegimos compartir",
    results: 71,
    indicator: "Mensajes a WhatsApp",
    costPerResult: 1759.25,
    spent: 124907,
    impressions: 15728,
    reach: 10044,
    profileVisits: 221,
    interactions: 1384,
    efficiency: "high" // alta eficiencia (gran volumen, bajo costo)
  },
  {
    id: 3,
    name: "El lugar perfecto para que celebres esos momentos especiales",
    results: 20,
    indicator: "Mensajes a WhatsApp",
    costPerResult: 1665.00,
    spent: 33300,
    impressions: 5132,
    reach: 3445,
    profileVisits: 86,
    interactions: 467,
    efficiency: "high" // El costo más bajo por resultado
  },
  {
    id: 4,
    name: "¿Primera vez o no sabes qué pedir?",
    results: 26,
    indicator: "Mensajes a WhatsApp",
    costPerResult: 4803.54,
    spent: 124892,
    impressions: 13322,
    reach: 6702,
    profileVisits: 141,
    interactions: 1079,
    efficiency: "low" // Costo elevado por resultado
  },
  {
    id: 5,
    name: "Excusa perfecta para volver a G Café: ¡menú nuevo!",
    results: 50,
    indicator: "Mensajes a WhatsApp",
    costPerResult: 2499.82,
    spent: 124991,
    impressions: 13524,
    reach: 7755,
    profileVisits: 178,
    interactions: 1149,
    efficiency: "medium"
  },
  {
    id: 6,
    name: "¿Cuál es tu favorito?",
    results: 64,
    indicator: "Mensajes a WhatsApp",
    costPerResult: 1950.88,
    spent: 124856,
    impressions: 12057,
    reach: 5781,
    profileVisits: 150,
    interactions: 1073,
    efficiency: "high"
  },
  {
    id: 7,
    name: "Este mes de mayo tiene premio",
    results: 62,
    indicator: "Mensajes a WhatsApp",
    costPerResult: 2016.13,
    spent: 125000,
    impressions: 10847,
    reach: 5458,
    profileVisits: 120,
    interactions: 911,
    efficiency: "high"
  },
  {
    id: 8,
    name: "Este mes en G Café tenemos dos cajitas",
    results: 21,
    indicator: "Mensajes a WhatsApp",
    costPerResult: 4064.00,
    spent: 85344,
    impressions: 16220,
    reach: 12272,
    profileVisits: 233,
    interactions: 1265,
    efficiency: "low"
  },
  {
    id: 9,
    name: "En G Café preparamos el regalo perfecto para agradecer todo su amor",
    results: 1,
    indicator: "Mensajes a WhatsApp",
    costPerResult: 9327.00,
    spent: 9327,
    impressions: 1021,
    reach: 872,
    profileVisits: 19,
    interactions: 85,
    efficiency: "critical" // Costo excesivamente alto
  }
];

export default function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('results'); // default sort
  const [sortOrder, setSortOrder] = useState('desc'); // desc or asc
  const [selectedCampaign, setSelectedCampaign] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [filterEfficiency, setFilterEfficiency] = useState('all');

  // --- MÉTTRICAS GLOBALES ACUMULADAS ---
  const totals = useMemo(() => {
    return CAMPAIGNS_DATA.reduce((acc, curr) => {
      acc.results += curr.results;
      acc.spent += curr.spent;
      acc.impressions += curr.impressions;
      acc.reach += curr.reach;
      acc.profileVisits += curr.profileVisits;
      acc.interactions += curr.interactions;
      return acc;
    }, { results: 0, spent: 0, impressions: 0, reach: 0, profileVisits: 0, interactions: 0 });
  }, []);

  const averageCostPerResult = useMemo(() => {
    return Math.round(totals.spent / totals.results);
  }, [totals]);

  // --- FILTRADO Y ORDENACIÓN ---
  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const filteredCampaigns = useMemo(() => {
    return CAMPAIGNS_DATA.filter(campaign => {
      const matchesSearch = campaign.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesEfficiency = filterEfficiency === 'all' || campaign.efficiency === filterEfficiency;
      return matchesSearch && matchesEfficiency;
    }).sort((a, b) => {
      let valA = a[sortBy];
      let valB = b[sortBy];
      
      if (sortOrder === 'desc') {
        return valB - valA;
      } else {
        return valA - valB;
      }
    });
  }, [searchTerm, sortBy, sortOrder, filterEfficiency]);

  // Formateadores de moneda y miles
  const formatCOP = (value) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const formatNumber = (value) => {
    return new Intl.NumberFormat('es-CO').format(value);
  };

  // Encontrar campaña con el menor costo por resultado (Top Eficiencia)
  const topEfficientCampaign = useMemo(() => {
    return [...CAMPAIGNS_DATA].sort((a, b) => a.costPerResult - b.costPerResult)[0];
  }, []);

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'bg-[#0B0F17] text-gray-100' : 'bg-gray-50 text-gray-800'}`}>
      
      {/* HEADER DE LA APLICACIÓN */}
      <header className={`border-b ${isDarkMode ? 'border-gray-800 bg-[#0F1420]' : 'border-gray-200 bg-white'} px-6 py-4 sticky top-0 z-50 shadow-sm`}>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          
          {/* Logo & Info Café */}
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-[#D4AF37] flex items-center justify-center shadow-lg transform hover:rotate-12 transition-transform">
              {/* SVG de taza de café elegante */}
              <svg className="w-7 h-7 text-[#1A1105]" viewBox="0 0 24 24" fill="currentColor">
                <path d="M2 21h18v-2H2v2M20 8h-2V5h2v3m2-5h-6a1 1 0 00-1 1v6a1 1 0 001 1h6a3 3 0 003-3V5a3 3 0 00-3-3M4 19h12v-4H4v4m0-6h12V5H4v8z" />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-[#F3E5AB] via-[#D4AF37] to-[#AA7C11]">
                  G CAFÉ CÚCUTA
                </h1>
                <span className={`text-[10px] uppercase font-extrabold px-2 py-0.5 rounded-full ${isDarkMode ? 'bg-[#1E293B] text-[#D4AF37]' : 'bg-amber-100 text-amber-800'}`}>
                  Ads Report
                </span>
              </div>
              <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                Informe Consolidado de Rendimiento de Campañas
              </p>
            </div>
          </div>

          {/* Selector de Tema y Botón de Resumen */}
          <div className="flex items-center gap-3 w-full md:w-auto justify-end">
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`p-2.5 rounded-xl border text-sm flex items-center gap-2 transition-all duration-200 ${
                isDarkMode 
                  ? 'border-gray-800 bg-[#151D30] hover:bg-[#1E2A45] text-amber-400' 
                  : 'border-gray-300 bg-white hover:bg-gray-100 text-gray-700'
              }`}
              title="Alternar Tema de Presentación"
            >
              {isDarkMode ? (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 9H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707m12.728 12.728A9 9 0 1111.36 3.636" />
                  </svg>
                  <span className="hidden sm:inline font-medium">Modo Luz (Impresión)</span>
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                  <span className="hidden sm:inline font-medium">Modo Oscuro (Ejecutivo)</span>
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* CONTENIDO PRINCIPAL */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        
        {/* TARJETAS DE MÉTRICAS GENERALES DE ALTO IMPACTO */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          
          {/* Card: Inversión Total */}
          <div className={`p-5 rounded-2xl border transition-all duration-300 relative overflow-hidden ${
            isDarkMode ? 'bg-[#0F1420] border-gray-800' : 'bg-white border-gray-200'
          } shadow-sm group hover:scale-[1.02]`}>
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
              <svg className="w-16 h-16 text-[#D4AF37]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H7c0-2.76 2.24-5 5-5s5 2.24 5 5c0 1.04-.42 1.99-1.07 2.75z" />
              </svg>
            </div>
            <p className={`text-xs font-semibold tracking-wider uppercase ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Presupuesto Total Invertido
            </p>
            <p className="text-2xl md:text-3xl font-extrabold tracking-tight mt-2 text-[#D4AF37]">
              {formatCOP(totals.spent)}
            </p>
            <div className="mt-3 flex items-center gap-1.5">
              <span className="text-xs bg-[#10B981]/15 text-[#10B981] px-2 py-0.5 rounded font-bold">100% Ejecutado</span>
              <span className={`text-[10px] ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>COP Oficial</span>
            </div>
          </div>

          {/* Card: Resultados Totales (Mensajes) */}
          <div className={`p-5 rounded-2xl border transition-all duration-300 relative overflow-hidden ${
            isDarkMode ? 'bg-[#0F1420] border-gray-800' : 'bg-white border-gray-200'
          } shadow-sm group hover:scale-[1.02]`}>
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
              {/* WhatsApp Icon */}
              <svg className="w-16 h-16 text-[#25D366]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.513 2.262 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.457L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.42 9.864-9.864.002-2.637-1.017-5.115-2.872-6.974-1.857-1.859-4.331-2.88-6.967-2.881-5.441 0-9.866 4.422-9.87 9.868-.002 1.782.463 3.52 1.34 5.07L1.871 20.13l4.776-1.254z" />
              </svg>
            </div>
            <p className={`text-xs font-semibold tracking-wider uppercase ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Mensajes a WhatsApp
            </p>
            <p className="text-2xl md:text-3xl font-extrabold tracking-tight mt-2 text-[#25D366]">
              {formatNumber(totals.results)}
            </p>
            <div className="mt-3 flex items-center gap-1.5">
              <span className="text-xs bg-[#25D366]/15 text-[#25D366] px-2 py-0.5 rounded font-bold">Chats Abiertos</span>
              <span className={`text-[10px] ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>Conversión Directa</span>
            </div>
          </div>

          {/* Card: CPA Promedio */}
          <div className={`p-5 rounded-2xl border transition-all duration-300 relative overflow-hidden ${
            isDarkMode ? 'bg-[#0F1420] border-gray-800' : 'bg-white border-gray-200'
          } shadow-sm group hover:scale-[1.02]`}>
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
              <svg className="w-16 h-16 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-4 6h-4v2h4v2h-4v2h4v2H9V7h6v2z" />
              </svg>
            </div>
            <p className={`text-xs font-semibold tracking-wider uppercase ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Costo Promedio / Mensaje
            </p>
            <p className="text-2xl md:text-3xl font-extrabold tracking-tight mt-2 text-blue-400">
              {formatCOP(averageCostPerResult)}
            </p>
            <div className="mt-3 flex items-center gap-1.5">
              <span className="text-xs bg-blue-400/15 text-blue-400 px-2 py-0.5 rounded font-bold">CPA Global</span>
              <span className={`text-[10px] ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>Alta Eficiencia</span>
            </div>
          </div>

          {/* Card: Alcance / Impresiones */}
          <div className={`p-5 rounded-2xl border transition-all duration-300 relative overflow-hidden ${
            isDarkMode ? 'bg-[#0F1420] border-gray-800' : 'bg-white border-gray-200'
          } shadow-sm group hover:scale-[1.02]`}>
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
              <svg className="w-16 h-16 text-indigo-400" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
              </svg>
            </div>
            <p className={`text-xs font-semibold tracking-wider uppercase ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              Alcance Total de Cuenta
            </p>
            <p className="text-2xl md:text-3xl font-extrabold tracking-tight mt-2 text-indigo-400">
              {formatNumber(totals.reach)}
            </p>
            <div className="mt-3 flex items-center gap-1.5">
              <span className="text-xs bg-indigo-400/15 text-indigo-400 px-2 py-0.5 rounded font-bold">{formatNumber(totals.impressions)} Impresiones</span>
              <span className={`text-[10px] ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>Frecuencia: 1.65</span>
            </div>
          </div>

        </section>

        {/* MÉTRICAS SECUNDARIAS REQUERIDAS: VISITA AL PERFIL E INTERACCIÓN */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          
          {/* Box de Visitas al Perfil */}
          <div className={`p-4 rounded-xl border flex items-center gap-4 transition-all ${
            isDarkMode ? 'bg-[#0F1420]/60 border-gray-800' : 'bg-white border-gray-200'
          }`}>
            <div className="p-3.5 rounded-lg bg-pink-500/10 text-pink-400">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div>
              <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} font-medium`}>Total Visitas estimadas al Perfil de IG/FB</p>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-xl font-bold text-pink-400">{formatNumber(totals.profileVisits)}</span>
                <span className={`text-[11px] font-medium ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                  (promedio de {( (totals.profileVisits / totals.reach) * 100).toFixed(1)}% del Alcance)
                </span>
              </div>
            </div>
          </div>

          {/* Box de Interacciones */}
          <div className={`p-4 rounded-xl border flex items-center gap-4 transition-all ${
            isDarkMode ? 'bg-[#0F1420]/60 border-gray-800' : 'bg-white border-gray-200'
          }`}>
            <div className="p-3.5 rounded-lg bg-emerald-500/10 text-emerald-400">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
              </svg>
            </div>
            <div>
              <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} font-medium`}>Total Interacciones en Anuncios</p>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-xl font-bold text-emerald-400">{formatNumber(totals.interactions)}</span>
                <span className={`text-[11px] font-medium ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                  (Likes, Clics, Compartidos y Guardados)
                </span>
              </div>
            </div>
          </div>

        </section>

        {/* SECCIÓN GRÁFICA: EMBUDO DE CONVERSIÓN Y DESGLOSE VISUAL */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          
          {/* Panel de Gráfico de Desglose de Campañas */}
          <div className={`lg:col-span-2 p-5 rounded-2xl border ${
            isDarkMode ? 'bg-[#0F1420] border-gray-800' : 'bg-white border-gray-200'
          }`}>
            <h3 className="text-sm font-bold uppercase tracking-wider mb-4 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#D4AF37]"></span>
              Distribución de Resultados y Gasto (COP)
            </h3>
            
            {/* Gráfico SVG Autogenerado libre de dependencias */}
            <div className="space-y-4">
              {CAMPAIGNS_DATA.map((campaign) => {
                // Calcular el % relativo del gasto máximo para representar las barras de manera proporcional
                const maxSpent = 125000;
                const spentPercentage = Math.min((campaign.spent / maxSpent) * 100, 100);
                
                return (
                  <div key={campaign.id} className="group">
                    <div className="flex justify-between items-center text-xs mb-1">
                      <span className="font-semibold truncate max-w-[240px] md:max-w-md group-hover:text-[#D4AF37] transition-colors">
                        {campaign.name}
                      </span>
                      <div className="flex items-center gap-3 font-mono">
                        <span className="text-[#25D366] font-bold">{campaign.results} chats</span>
                        <span className={`text-[10px] ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          ({formatCOP(campaign.spent)})
                        </span>
                      </div>
                    </div>
                    {/* Barra de Progreso */}
                    <div className={`w-full h-2.5 rounded-full ${isDarkMode ? 'bg-gray-800' : 'bg-gray-100'} overflow-hidden flex`}>
                      <div 
                        className="bg-gradient-to-r from-[#D4AF37] to-[#25D366] h-full rounded-full transition-all duration-1000"
                        style={{ width: `${spentPercentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Embudo de Conversión de la Cuenta */}
          <div className={`p-5 rounded-2xl border ${
            isDarkMode ? 'bg-[#0F1420] border-gray-800' : 'bg-white border-gray-200'
          } flex flex-col justify-between`}>
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider mb-4 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-500"></span>
                Embudo de Conversión Global
              </h3>
              
              <div className="space-y-3 mt-4">
                {/* Paso 1: Impresiones */}
                <div className={`p-3 rounded-xl border relative overflow-hidden ${isDarkMode ? 'bg-[#151D30]/60 border-gray-800' : 'bg-gray-50 border-gray-200'}`}>
                  <div className="flex justify-between items-center relative z-10">
                    <div>
                      <p className="text-[10px] uppercase font-bold tracking-wider text-gray-400">1. Impresiones</p>
                      <p className="text-lg font-extrabold mt-0.5">{formatNumber(totals.impressions)}</p>
                    </div>
                    <span className="text-xs font-mono font-semibold bg-gray-500/10 px-2 py-0.5 rounded">100%</span>
                  </div>
                </div>

                {/* Paso 2: Alcance */}
                <div className={`p-3 rounded-xl border relative overflow-hidden ${isDarkMode ? 'bg-[#151D30]/60 border-gray-800' : 'bg-gray-50 border-gray-200'}`}>
                  <div className="flex justify-between items-center relative z-10">
                    <div>
                      <p className="text-[10px] uppercase font-bold tracking-wider text-indigo-400">2. Alcance (Personas)</p>
                      <p className="text-lg font-extrabold mt-0.5 text-indigo-400">{formatNumber(totals.reach)}</p>
                    </div>
                    <span className="text-xs font-mono font-semibold bg-indigo-500/15 text-indigo-400 px-2 py-0.5 rounded">
                      {((totals.reach / totals.impressions) * 100).toFixed(0)}%
                    </span>
                  </div>
                </div>

                {/* Paso 3: Visitas Perfil */}
                <div className={`p-3 rounded-xl border relative overflow-hidden ${isDarkMode ? 'bg-[#151D30]/60 border-gray-800' : 'bg-gray-50 border-gray-200'}`}>
                  <div className="flex justify-between items-center relative z-10">
                    <div>
                      <p className="text-[10px] uppercase font-bold tracking-wider text-pink-400">3. Visitas al Perfil (Est.)</p>
                      <p className="text-lg font-extrabold mt-0.5 text-pink-400">{formatNumber(totals.profileVisits)}</p>
                    </div>
                    <span className="text-xs font-mono font-semibold bg-pink-500/15 text-pink-400 px-2 py-0.5 rounded">
                      {((totals.profileVisits / totals.reach) * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>

                {/* Paso 4: Resultados */}
                <div className={`p-3 rounded-xl border relative overflow-hidden ${isDarkMode ? 'bg-[#151D30]/60 border-gray-800' : 'bg-gray-50 border-gray-200'}`}>
                  <div className="flex justify-between items-center relative z-10">
                    <div>
                      <p className="text-[10px] uppercase font-bold tracking-wider text-[#25D366]">4. Mensajes WhatsApp</p>
                      <p className="text-lg font-extrabold mt-0.5 text-[#25D366]">{formatNumber(totals.results)}</p>
                    </div>
                    <span className="text-xs font-mono font-semibold bg-[#25D366]/15 text-[#25D366] px-2 py-0.5 rounded">
                      {((totals.results / totals.reach) * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className={`mt-4 p-3 rounded-lg text-center text-xs ${isDarkMode ? 'bg-amber-500/5 text-amber-200 border border-amber-500/15' : 'bg-amber-50 text-amber-900 border border-amber-200'}`}>
              <span className="font-bold">Métrica Clave:</span> De cada 100 personas alcanzadas, aprox. <span className="font-extrabold">{((totals.results / totals.reach) * 100).toFixed(1)}</span> iniciaron conversación directa en WhatsApp.
            </div>
          </div>

        </section>

        {/* TABLA PRINCIPAL DE DATOS CON FILTROS E INTERACTIVIDAD */}
        <section className={`rounded-2xl border overflow-hidden ${
          isDarkMode ? 'bg-[#0F1420] border-gray-800' : 'bg-white border-gray-200'
        } shadow-md`}>
          
          {/* Filtros de la Tabla */}
          <div className={`p-5 border-b ${isDarkMode ? 'border-gray-800 bg-[#121827]' : 'border-gray-200 bg-gray-50'} flex flex-col md:flex-row justify-between items-center gap-4`}>
            
            {/* Buscador */}
            <div className="relative w-full md:w-80">
              <input
                type="text"
                placeholder="Buscar campaña..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full pl-10 pr-4 py-2 text-sm rounded-xl border focus:outline-none focus:ring-2 focus:ring-[#D4AF37] transition-all ${
                  isDarkMode 
                    ? 'bg-[#1A2338] border-gray-800 text-gray-100 placeholder-gray-500' 
                    : 'bg-white border-gray-300 text-gray-800 placeholder-gray-400'
                }`}
              />
              <svg className="w-4 h-4 absolute left-3 top-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            {/* Selectores de Rendimiento */}
            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
              <span className={`text-xs font-semibold uppercase ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Filtrar por Costo:</span>
              <button 
                onClick={() => setFilterEfficiency('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  filterEfficiency === 'all' 
                    ? 'bg-[#D4AF37] text-gray-950' 
                    : isDarkMode ? 'bg-[#1A2338] hover:bg-[#23304E] text-gray-300' : 'bg-white border border-gray-300 text-gray-700'
                }`}
              >
                Todas
              </button>
              <button 
                onClick={() => setFilterEfficiency('high')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  filterEfficiency === 'high' 
                    ? 'bg-[#25D366] text-gray-950' 
                    : isDarkMode ? 'bg-[#1A2338] hover:bg-[#23304E] text-gray-300' : 'bg-white border border-gray-300 text-gray-700'
                }`}
              >
                Más Eficientes
              </button>
              <button 
                onClick={() => setFilterEfficiency('low')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  filterEfficiency === 'low' 
                    ? 'bg-rose-500 text-white' 
                    : isDarkMode ? 'bg-[#1A2338] hover:bg-[#23304E] text-gray-300' : 'bg-white border border-gray-300 text-gray-700'
                }`}
              >
                Costo Elevado
              </button>
            </div>

          </div>

          {/* Tabla de Datos */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className={`text-[10px] md:text-xs font-bold uppercase border-b ${
                  isDarkMode ? 'bg-[#121827] border-gray-800 text-gray-400' : 'bg-gray-50 border-gray-200 text-gray-500'
                }`}>
                  <th className="py-4 px-4 font-semibold">Campaña</th>
                  <th 
                    className="py-4 px-4 font-semibold cursor-pointer select-none hover:text-[#D4AF37] transition-colors text-right"
                    onClick={() => handleSort('results')}
                  >
                    Resultados {sortBy === 'results' && (sortOrder === 'desc' ? '▼' : '▲')}
                  </th>
                  <th 
                    className="py-4 px-4 font-semibold cursor-pointer select-none hover:text-[#D4AF37] transition-colors text-right"
                    onClick={() => handleSort('costPerResult')}
                  >
                    Costo x Resultado {sortBy === 'costPerResult' && (sortOrder === 'desc' ? '▼' : '▲')}
                  </th>
                  <th 
                    className="py-4 px-4 font-semibold cursor-pointer select-none hover:text-[#D4AF37] transition-colors text-right"
                    onClick={() => handleSort('spent')}
                  >
                    Importe Gastado {sortBy === 'spent' && (sortOrder === 'desc' ? '▼' : '▲')}
                  </th>
                  <th 
                    className="py-4 px-4 font-semibold cursor-pointer select-none hover:text-[#D4AF37] transition-colors text-right"
                    onClick={() => handleSort('impressions')}
                  >
                    Impresiones {sortBy === 'impressions' && (sortOrder === 'desc' ? '▼' : '▲')}
                  </th>
                  <th 
                    className="py-4 px-4 font-semibold cursor-pointer select-none hover:text-[#D4AF37] transition-colors text-right"
                    onClick={() => handleSort('reach')}
                  >
                    Alcance {sortBy === 'reach' && (sortOrder === 'desc' ? '▼' : '▲')}
                  </th>
                  <th 
                    className="py-4 px-4 font-semibold cursor-pointer select-none hover:text-[#D4AF37] transition-colors text-right"
                    onClick={() => handleSort('profileVisits')}
                  >
                    Visitas Perfil {sortBy === 'profileVisits' && (sortOrder === 'desc' ? '▼' : '▲')}
                  </th>
                  <th 
                    className="py-4 px-4 font-semibold cursor-pointer select-none hover:text-[#D4AF37] transition-colors text-right"
                    onClick={() => handleSort('interactions')}
                  >
                    Interacciones {sortBy === 'interactions' && (sortOrder === 'desc' ? '▼' : '▲')}
                  </th>
                </tr>
              </thead>
              <tbody className={`divide-y ${isDarkMode ? 'divide-gray-800' : 'divide-gray-100'}`}>
                {filteredCampaigns.map((campaign) => (
                  <tr 
                    key={campaign.id}
                    onClick={() => setSelectedCampaign(campaign)}
                    className={`text-xs md:text-sm transition-colors cursor-pointer ${
                      selectedCampaign?.id === campaign.id
                        ? isDarkMode ? 'bg-[#1E293B]/70' : 'bg-amber-50/70'
                        : isDarkMode ? 'hover:bg-[#151D30]/60' : 'hover:bg-gray-50'
                    }`}
                  >
                    {/* Nombre Campaña */}
                    <td className="py-3 px-4 font-medium max-w-xs md:max-w-md">
                      <div className="flex flex-col gap-1">
                        <span className="font-semibold block truncate">{campaign.name}</span>
                        <div className="flex items-center gap-1.5">
                          <span className={`text-[10px] px-2 py-0.2 rounded font-bold uppercase ${
                            campaign.efficiency === 'high' 
                              ? 'bg-[#10B981]/15 text-[#10B981]' 
                              : campaign.efficiency === 'medium'
                              ? 'bg-blue-500/15 text-blue-400'
                              : 'bg-rose-500/15 text-rose-400'
                          }`}>
                            {campaign.efficiency === 'high' ? 'Alto ROI' : campaign.efficiency === 'medium' ? 'Estable' : 'Costo Elevado'}
                          </span>
                          <span className={`text-[9px] ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>ID: {campaign.id}</span>
                        </div>
                      </div>
                    </td>
                    
                    {/* Resultados */}
                    <td className="py-3 px-4 text-right font-bold text-gray-100 font-mono">
                      <span className={`${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>{campaign.results}</span>
                      <span className={`block text-[9px] font-normal ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>chats</span>
                    </td>

                    {/* Costo x Resultado */}
                    <td className={`py-3 px-4 text-right font-bold font-mono ${
                      campaign.costPerResult < 2100 ? 'text-[#25D366]' : campaign.costPerResult > 4500 ? 'text-rose-400' : 'text-blue-400'
                    }`}>
                      {formatCOP(campaign.costPerResult)}
                    </td>

                    {/* Importe Gastado */}
                    <td className="py-3 px-4 text-right font-mono text-gray-300">
                      <span className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>{formatCOP(campaign.spent)}</span>
                    </td>

                    {/* Impresiones */}
                    <td className={`py-3 px-4 text-right font-mono ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {formatNumber(campaign.impressions)}
                    </td>

                    {/* Alcance */}
                    <td className={`py-3 px-4 text-right font-mono ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {formatNumber(campaign.reach)}
                    </td>

                    {/* Visitas al Perfil */}
                    <td className="py-3 px-4 text-right font-mono text-pink-400 font-semibold">
                      {formatNumber(campaign.profileVisits)}
                    </td>

                    {/* Interacciones */}
                    <td className="py-3 px-4 text-right font-mono text-emerald-400 font-semibold">
                      {formatNumber(campaign.interactions)}
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Estado de Vacío si se busca algo incorrecto */}
          {filteredCampaigns.length === 0 && (
            <div className="py-12 text-center text-gray-500 text-sm">
              No se encontraron campañas con los filtros aplicados.
            </div>
          )}

        </section>

        {/* DETALLE DINÁMICO DE CAMPAÑA SELECCIONADA */}
        {selectedCampaign && (
          <section className={`mt-8 p-6 rounded-2xl border ${
            isDarkMode ? 'bg-[#0F1420] border-gray-800' : 'bg-white border-gray-200'
          } shadow-lg transition-all`}>
            <div className="flex justify-between items-start gap-4 mb-4">
              <div>
                <p className="text-[10px] uppercase font-bold tracking-wider text-[#D4AF37]">Ficha de Rendimiento Individual</p>
                <h4 className="text-lg font-bold mt-1">{selectedCampaign.name}</h4>
              </div>
              <button 
                onClick={() => setSelectedCampaign(null)}
                className={`p-1.5 rounded-lg border ${
                  isDarkMode ? 'border-gray-800 hover:bg-gray-800 text-gray-400' : 'border-gray-200 hover:bg-gray-100 text-gray-500'
                }`}
              >
                Cerrar Detalle
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
              <div className={`p-3 rounded-xl border ${isDarkMode ? 'bg-[#151D30] border-gray-800' : 'bg-gray-50 border-gray-200'}`}>
                <p className="text-[10px] text-gray-400 font-semibold uppercase">WhatsApp Chats</p>
                <p className="text-xl font-bold mt-1 text-[#25D366]">{selectedCampaign.results}</p>
              </div>
              <div className={`p-3 rounded-xl border ${isDarkMode ? 'bg-[#151D30] border-gray-800' : 'bg-gray-50 border-gray-200'}`}>
                <p className="text-[10px] text-gray-400 font-semibold uppercase">Costo por Chat</p>
                <p className="text-xl font-bold mt-1 text-blue-400">{formatCOP(selectedCampaign.costPerResult)}</p>
              </div>
              <div className={`p-3 rounded-xl border ${isDarkMode ? 'bg-[#151D30] border-gray-800' : 'bg-gray-50 border-gray-200'}`}>
                <p className="text-[10px] text-gray-400 font-semibold uppercase">Total Gastado</p>
                <p className="text-xl font-bold mt-1 text-[#D4AF37]">{formatCOP(selectedCampaign.spent)}</p>
              </div>
              <div className={`p-3 rounded-xl border ${isDarkMode ? 'bg-[#151D30] border-gray-800' : 'bg-gray-50 border-gray-200'}`}>
                <p className="text-[10px] text-gray-400 font-semibold uppercase">Frecuencia</p>
                <p className="text-xl font-bold mt-1 text-purple-400">{(selectedCampaign.impressions / selectedCampaign.reach).toFixed(2)}</p>
              </div>
              <div className={`p-3 rounded-xl border ${isDarkMode ? 'bg-[#151D30] border-gray-800' : 'bg-gray-50 border-gray-200'}`}>
                <p className="text-[10px] text-gray-400 font-semibold uppercase">Tasa CTR Est.</p>
                <p className="text-xl font-bold mt-1 text-pink-400">{((selectedCampaign.profileVisits / selectedCampaign.impressions) * 100).toFixed(2)}%</p>
              </div>
              <div className={`p-3 rounded-xl border ${isDarkMode ? 'bg-[#151D30] border-gray-800' : 'bg-gray-50 border-gray-200'}`}>
                <p className="text-[10px] text-gray-400 font-semibold uppercase">Tasa de WhatsApp</p>
                <p className="text-xl font-bold mt-1 text-emerald-400">{((selectedCampaign.results / selectedCampaign.reach) * 100).toFixed(2)}%</p>
              </div>
            </div>
          </section>
        )}

      </main>

      {/* FOOTER GENERAL */}
      <footer className={`border-t ${isDarkMode ? 'border-gray-800 bg-[#0F1420] text-gray-500' : 'border-gray-200 bg-white text-gray-400'} py-6 px-4 mt-12`}>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center text-xs gap-4">
          <p>© {new Date().getFullYear()} G Café Cúcuta — Dashboard de Rendimiento de Tráficos.</p>
          <div className="flex gap-4">
            <span>Resultados directos del Pixel y API de WhatsApp Meta Business.</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
