import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

function App() {
  const generateColor = () => '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');

  const [colors, setColors] = useState([
    generateColor(), generateColor(), generateColor(), generateColor(), generateColor()
  ]);
  const [copyStatus, setCopyStatus] = useState(null);
  const [view, setView] = useState('generator'); // 'generator', 'policies', 'favorites'
  const [favorites, setFavorites] = useState([]);

  // Cargar favoritos al iniciar
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('myPalettes')) || [];
    setFavorites(saved);
  }, []);

  // Guardar favoritos cuando cambien
  useEffect(() => {
    localStorage.setItem('myPalettes', JSON.stringify(favorites));
  }, [favorites]);

  const addColor = () => {
    if (colors.length < 5) setColors([...colors, generateColor()]);
  };

  const removeColor = (index) => {
    if (colors.length > 2) setColors(colors.filter((_, i) => i !== index));
  };

  const copyToClipboard = (hex) => {
    navigator.clipboard.writeText(hex);
    setCopyStatus(hex);
    setTimeout(() => setCopyStatus(null), 2000);
  };

  const saveToFavorites = () => {
    if (!favorites.some(p => JSON.stringify(p) === JSON.stringify(colors))) {
      setFavorites([...favorites, [...colors]]);
    }
  };

  const removeFavorite = (index) => {
    setFavorites(favorites.filter((_, i) => i !== index));
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-white font-sans overflow-hidden">
      
      {/* NAVBAR GLASS */}
      <nav className="z-50 w-full border-b border-white/10 bg-slate-900/40 backdrop-blur-xl px-8 py-4 flex justify-between items-center">
        <div 
          className="flex items-center gap-3 font-black text-xl tracking-tighter italic cursor-pointer"
          onClick={() => setView('generator')}
        >
          <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-indigo-500 to-fuchsia-500 rotate-12" />
          COLORGLASS
        </div>
        <div className="hidden md:flex gap-8 text-sm font-bold text-slate-400">
          <button onClick={() => setView('generator')} className={`hover:text-white transition-colors ${view === 'generator' ? 'text-white' : ''}`}>EXPLORAR</button>
          <button onClick={() => setView('favorites')} className={`hover:text-white transition-colors ${view === 'favorites' ? 'text-white' : ''}`}>MIS PALETAS ({favorites.length})</button>
        </div>
      </nav>

      {/* CONTENIDO PRINCIPAL */}
      <main className="flex-1 flex flex-col p-6 md:p-12 max-w-7xl mx-auto w-full overflow-hidden">
        
        <AnimatePresence mode="wait">
          {view === 'generator' && (
            <motion.div key="gen" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="flex-1 flex flex-col">
              <div className="flex justify-between items-center mb-6 px-4">
                <h2 className="text-xl font-bold opacity-50 uppercase tracking-widest">Generador</h2>
                <button 
                  onClick={saveToFavorites}
                  className="bg-white/10 hover:bg-red-500/20 border border-white/10 p-3 rounded-2xl transition-all group"
                >
                  <svg className="w-6 h-6 group-active:scale-125 transition-transform text-red-500" fill="currentColor" viewBox="0 0 24 24"><path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.5 3c1.557 0 3.046.727 4 2.015C12.454 3.727 13.943 3 15.5 3 18.286 3 20.75 5.322 20.75 8.25c0 3.924-2.438 7.11-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001z" /></svg>
                </button>
              </div>

              <div className="flex-1 bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[3.5rem] p-4 flex flex-col md:flex-row gap-4 relative shadow-2xl overflow-hidden">
                <AnimatePresence mode='popLayout'>
                  {colors.map((color, index) => (
                    <motion.div key={color} layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.5 }} transition={{ type: "spring", stiffness: 400, damping: 30 }} style={{ backgroundColor: color }} className="group relative flex-1 min-h-[140px] md:min-h-full rounded-[2.5rem] flex items-center justify-center transition-[flex] duration-500 ease-in-out hover:flex-[1.6]">
                      <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => copyToClipboard(color)} className="bg-black/20 backdrop-blur-xl border border-white/20 px-6 py-3 rounded-2xl font-mono font-black text-xl shadow-xl opacity-0 md:opacity-100 group-hover:opacity-100 transition-opacity">
                        {color.toUpperCase()}
                      </motion.button>
                      {colors.length > 2 && (
                        <button onClick={() => removeColor(index)} className="absolute top-6 right-6 bg-white/10 hover:bg-red-500 p-2.5 rounded-full opacity-0 group-hover:opacity-100 transition-all backdrop-blur-md border border-white/10">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              <div className="flex flex-wrap justify-center gap-6 mt-12">
                <button onClick={addColor} disabled={colors.length >= 5} className="px-8 py-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 disabled:opacity-20 transition-all font-bold tracking-wide">+ AÑADIR COLOR</button>
                <button onClick={() => setColors(colors.map(() => generateColor()))} className="px-10 py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-500 shadow-[0_0_30px_rgba(79,70,229,0.4)] transition-all font-black text-lg">GENERAR NUEVA</button>
              </div>
            </motion.div>
          )}

          {view === 'favorites' && (
            <motion.div key="favs" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="flex-1 overflow-y-auto px-4 custom-scrollbar">
              <h2 className="text-4xl font-black mb-10 italic">MIS PALETAS</h2>
              {favorites.length === 0 ? (
                <div className="text-slate-500 text-center mt-20">Aún no has guardado ninguna paleta.</div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                  {favorites.map((pal, pIdx) => (
                    <div key={pIdx} className="bg-white/5 border border-white/10 p-4 rounded-[2.5rem] shadow-xl group">
                      <div className="flex h-32 w-full rounded-[1.5rem] overflow-hidden mb-4 border border-white/5">
                        {pal.map((c, cIdx) => (
                          <div key={cIdx} style={{ backgroundColor: c }} className="flex-1" />
                        ))}
                      </div>
                      <div className="flex justify-between items-center px-2">
                        <button onClick={() => {setColors(pal); setView('generator')}} className="text-[10px] font-bold tracking-widest uppercase hover:text-indigo-400 transition-colors">Cargar</button>
                        <button onClick={() => removeFavorite(pIdx)} className="text-red-500/50 hover:text-red-500 transition-colors">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {view === 'policies' && (
            <motion.div key="pol" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="flex-1 bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[3.5rem] p-10 md:p-16 shadow-2xl overflow-y-auto">
              <h2 className="text-4xl font-black mb-8 italic">POLÍTICAS</h2>
              <p className="text-slate-300 leading-relaxed max-w-2xl opacity-80">ColorGlass es una herramienta de código abierto. Todas tus paletas favoritas se guardan localmente en tu navegador mediante LocalStorage.</p>
              <button onClick={() => setView('generator')} className="mt-8 px-6 py-3 bg-white text-slate-950 font-bold rounded-xl hover:bg-indigo-100">VOLVER</button>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* FOOTER */}
      <footer className="w-full border-t border-white/5 py-10 px-8 flex flex-col md:flex-row justify-between items-center gap-6 text-slate-500 text-[10px] font-bold tracking-[0.2em]">
        <div className="flex items-center gap-4">
          <span className="text-white/40 italic text-sm">COLORGLASS PROJECT</span>
          <span>© 2026</span>
        </div>
        <div className="flex gap-10 underline underline-offset-8 decoration-indigo-500/50">
          <a href="#" className="hover:text-white transition-colors uppercase">GITHUB</a>
          <button onClick={() => setView('policies')} className="hover:text-white transition-colors uppercase">POLÍTICAS</button>
        </div>
      </footer>

      {/* POP DE COPIADO */}
      <AnimatePresence>
        {copyStatus && (
          <motion.div initial={{ opacity: 0, y: 100 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.5 }} className="fixed bottom-12 left-1/2 -translate-x-1/2 z-[100] bg-white text-slate-900 px-8 py-4 rounded-3xl shadow-2xl flex items-center gap-4 border border-white/20">
            <div className="w-4 h-4 rounded-full" style={{ backgroundColor: copyStatus }} />
            <span className="font-bold uppercase tracking-widest text-xs tracking-tighter italic">Copiado con éxito</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default App