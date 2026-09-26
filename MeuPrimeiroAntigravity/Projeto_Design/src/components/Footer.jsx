import React from 'react';
import { Sprout, ShieldCheck, HeartHandshake, Leaf, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="mt-16 bg-stone-900 text-stone-300 border-t border-stone-800 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          {/* Brand */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-800 text-white flex items-center justify-center">
                <Sprout className="w-5 h-5 text-emerald-300" />
              </div>
              <span className="font-serif font-bold text-lg text-white">
                Horta-na-Mão
              </span>
            </div>
            <p className="text-stone-400 leading-relaxed text-xs">
              Conectando famílias urbanas a pequenos agricultores familiares agroecológicos. Alimento limpo, fresco e colhido no dia.
            </p>
          </div>

          {/* Regras e Compromisso */}
          <div className="space-y-2">
            <h4 className="font-serif font-bold text-white text-sm">
              Logística & Regras
            </h4>
            <ul className="space-y-1.5 text-stone-400">
              <li className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                <span>Entregas exclusivas na Zona Sul</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Leaf className="w-3.5 h-3.5 text-emerald-400" />
                <span>Troca de itens até Domingo 23:59h</span>
              </li>
              <li className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Colheita matinal na Segunda-feira</span>
              </li>
            </ul>
          </div>

          {/* Sustentabilidade */}
          <div className="space-y-2">
            <h4 className="font-serif font-bold text-white text-sm">
              Sustentabilidade
            </h4>
            <ul className="space-y-1.5 text-stone-400">
              <li>• 100% livre de agrotóxicos e químicos</li>
              <li>• Apoio a 24 famílias da agricultura familiar</li>
              <li>• Cestas e embalagens retornáveis biodegradáveis</li>
              <li>• Menor pegada de carbono por rota concentrada</li>
            </ul>
          </div>

          {/* Pagamento Seguro */}
          <div className="space-y-2">
            <h4 className="font-serif font-bold text-white text-sm">
              Pagamento Recorrente
            </h4>
            <p className="text-stone-400 text-xs">
              Assinatura semanal com débito no Cartão de Crédito. Sem taxas ocultas, cancele quando desejar.
            </p>
            <div className="p-2.5 bg-stone-800/80 rounded-xl border border-stone-700 text-[11px] text-emerald-400 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" />
              <span>Transações seguras com criptografia 256 bits</span>
            </div>
          </div>

        </div>

        <div className="pt-8 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-stone-500 text-[11px]">
          <div>
            © {new Date().getFullYear()} Horta-na-Mão Ltda. Todos os direitos reservados.
          </div>
          <div className="flex items-center gap-4">
            <span>Termos de Assinatura</span>
            <span>Política de Privacidade</span>
            <span>Certificação Agroecológica</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
