import React, { useState } from 'react';
import { X, MapPin, CheckCircle, AlertTriangle, Search } from 'lucide-react';
import { ZONA_SUL_NEIGHBORHOODS } from '../data/mockData';

export default function AllowedNeighborhoodsModal({ isOpen, onClose, onSelectNeighborhood }) {
  const [search, setSearch] = useState('');

  if (!isOpen) return null;

  const filtered = ZONA_SUL_NEIGHBORHOODS.filter(b => 
    b.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs transition-opacity animate-in fade-in">
      <div className="relative w-full max-w-lg bg-[#FAF8F5] rounded-2xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-emerald-800 to-emerald-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-700/80 rounded-xl">
              <MapPin className="w-5 h-5 text-emerald-200" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-lg text-emerald-50">Área de Cobertura Exclusiva</h3>
              <p className="text-xs text-emerald-200">Entregas de orgânicos restritas à Zona Sul</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-emerald-200 hover:text-white hover:bg-emerald-700/60 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Notice */}
        <div className="p-4 bg-amber-50 border-b border-amber-200 text-xs text-amber-900 flex items-start gap-2.5">
          <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold">Regra de Logística Sustentável:</span> Para garantir que as hortaliças colhidas às 5h cheguem frescas na sua mesa antes do almoço e reduzir a pegada de carbono, atendemos unicamente bairros da <strong>Zona Sul</strong>.
          </div>
        </div>

        {/* Search */}
        <div className="p-4 border-b border-stone-200 bg-white">
          <div className="relative">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Buscar bairro da Zona Sul..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-stone-50 border border-stone-300 rounded-xl text-sm focus:ring-2 focus:ring-emerald-600 focus:border-emerald-600 outline-none"
            />
          </div>
        </div>

        {/* Neighborhood List */}
        <div className="p-4 overflow-y-auto flex-1 divide-y divide-stone-100">
          <div className="grid grid-cols-2 gap-2">
            {filtered.map((neighborhood) => (
              <button
                key={neighborhood}
                onClick={() => {
                  onSelectNeighborhood(neighborhood);
                  onClose();
                }}
                className="flex items-center justify-between p-2.5 rounded-xl border border-stone-200 bg-white hover:border-emerald-500 hover:bg-emerald-50/60 text-left transition group"
              >
                <span className="text-xs font-medium text-stone-800 group-hover:text-emerald-900">
                  {neighborhood}
                </span>
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600 opacity-60 group-hover:opacity-100" />
              </button>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-8 text-stone-500 text-sm">
              Nenhum bairro da Zona Sul encontrado com esse nome.
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-stone-100 border-t border-stone-200 flex justify-between items-center text-xs text-stone-600">
          <span>Clique em um bairro para selecioná-lo automaticamente</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-stone-800 text-white rounded-lg hover:bg-stone-700 transition"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
