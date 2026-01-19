
import React from 'react';
import { FORMAT_CURRENCY } from '../constants';

interface ProductCardProps {
  product: any;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const isExclusive = product.isExclusive === true;
  
  // Recalculate values if exclusive (force 50%)
  const displayCommission = isExclusive ? 50 : (product.commission || 0);
  const displayProfit = isExclusive ? (product.price * 0.5) : (product.profit || 0);
  
  // Use override totalIncome if provided, otherwise calculate
  const totalKeuntungan = product.totalIncome !== undefined 
    ? (isExclusive ? (product.price + displayProfit) : product.totalIncome)
    : (product.price + displayProfit);
    
  const actionText = product.statusText || 'Detail';
  
  return (
    <div 
      className={`bg-[var(--bg-panel)] border rounded-xl flex flex-row overflow-hidden shadow-2xl transition-all duration-700 group h-full relative 
        ${isExclusive 
          ? 'border-[#D4AF37] border-2 shadow-[0_0_50px_rgba(212,175,55,0.4)] ring-4 ring-[#D4AF37]/10 z-20 scale-[1.01]' 
          : 'border-[var(--color-border-dim)] hover:border-[var(--color-border-mid)] hover:shadow-[0_25px_50px_-12px_rgba(0,0,0,0.15)]'
        }`}
    >
      
      {/* EXCLUSIVE DECORATIVE GLOW (Only for Exclusive) */}
      {isExclusive && (
        <div className="absolute inset-0 bg-gradient-to-tr from-[#D4AF37]/5 via-transparent to-[#D4AF37]/5 pointer-events-none z-0"></div>
      )}

      {/* LEFT COLUMN: NORMALIZED PREMIUM VISUAL (60%) */}
      <div className="w-[60%] h-full relative overflow-hidden bg-[#050505] border-r border-white/5">
        <img 
          src={product.imageUrl} 
          alt={product.name} 
          className={`w-full h-full object-cover transition-all duration-[1.5s] group-hover:scale-110 
            ${isExclusive ? 'opacity-90 grayscale-0 brightness-110 contrast-125' : 'opacity-70 grayscale-[15%] brightness-95 group-hover:opacity-100 group-hover:grayscale-0 group-hover:brightness-105 contrast-110'}`}
        />
        
        {/* Master Normalization Overlays - vignette & gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/30"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-black/40"></div>
        <div className="absolute inset-0 ring-inset ring-1 ring-white/5 pointer-events-none"></div>
        
        {/* Category Label - Standardized across all catalogs */}
        <div className="absolute top-2.5 left-2.5 sm:top-3 sm:left-3 z-10">
           <span className="text-[clamp(10px,0.8vw,11px)] font-black text-white px-2.5 py-1 bg-black/70 backdrop-blur-xl border border-white/10 tracking-[0.2em] uppercase rounded shadow-2xl">
             {product.label}
           </span>
        </div>

        {/* HIGH-VISIBILITY EXCLUSIVE BADGE */}
        {isExclusive && (
          <div className="absolute top-2.5 right-2.5 sm:top-3 sm:right-3 z-20">
            <div className="flex flex-col items-end">
              <span className="text-[8px] font-black text-black px-3 py-1 bg-gradient-to-r from-[#D4AF37] via-[#F9E79F] to-[#D4AF37] tracking-[0.35em] uppercase rounded-full shadow-[0_10px_20px_rgba(0,0,0,0.6)] border border-white/20 animate-soft-pulse">
                EXCLUSIVE
              </span>
              <div className="w-1/2 h-0.5 bg-[#D4AF37] mt-1 rounded-full blur-[2px] opacity-60"></div>
            </div>
          </div>
        )}
      </div>

      {/* RIGHT COLUMN: REFINED DYNAMIC INFO PANEL (40%) */}
      <div className={`w-[40%] flex flex-col p-4 sm:p-5 justify-between relative backdrop-blur-md border-l border-white/10 
        ${isExclusive 
          ? 'bg-gradient-to-br from-[#221c10] via-[#111111] to-[#080808] shadow-[inset_0_0_50px_rgba(212,175,55,0.15)]' 
          : 'bg-gradient-to-br from-[#1e1e1e] via-[#161616] to-[#0c0c0c] shadow-[inset_0_0_40px_rgba(179,139,77,0.1)]'
        }`}
      >
        
        {/* Subtle Edge Glow Overlay */}
        <div className={`absolute inset-0 pointer-events-none border transition-colors duration-700 
          ${isExclusive ? 'border-[#D4AF37]/30' : 'border-transparent group-hover:border-[var(--accent)]/30'}`}
        ></div>

        {/* Product Title Section - Space optimized */}
        <div className="space-y-1 relative z-10 shrink-0 mb-1">
          <h3 className={`text-[clamp(12px,1.6vw,15px)] font-black leading-tight uppercase tracking-wider [text-shadow:0_2px_4px_rgba(0,0,0,1)]
            ${isExclusive ? 'text-[#F9E79F]' : 'text-white'}`}
          >
            {product.name}
          </h3>
          <div className={`h-[1px] w-1/3 bg-gradient-to-r to-transparent opacity-60 
            ${isExclusive ? 'from-[#D4AF37]' : 'from-[var(--accent)]'}`}
          ></div>
        </div>

        {/* REPOSISI: Commission Badge Pill - Now between Name and Price */}
        <div className="relative z-10 my-2.5 flex items-center shrink-0">
          <span className={`text-[14px] font-black tracking-widest px-3.5 py-1.5 rounded-full border-[1.5px] leading-none transition-all shadow-xl
            ${isExclusive 
              ? 'text-[#F9E79F] bg-[#D4AF37]/30 border-[#D4AF37]/60 shadow-[0_0_15px_rgba(212,175,55,0.3)]' 
              : 'text-[var(--accent)] bg-[var(--accent)]/15 border-[var(--accent)]/30'}`}>
            {displayCommission}%
          </span>
          <div className={`ml-3 h-[0.5px] flex-grow opacity-10 ${isExclusive ? 'bg-[#D4AF37]' : 'bg-[var(--accent)]'}`}></div>
        </div>

        {/* Data Matrix Grid - Spacing tightened for maximum content safety */}
        <div className="space-y-3 sm:space-y-4 mt-auto relative z-10">
          <div className="grid grid-cols-1 gap-3 sm:gap-4">
            <div className="flex flex-col">
              <span className="text-[9px] font-black text-[#888888] uppercase tracking-[0.2em] mb-0.5 italic opacity-80">PRICE</span>
              <span className="text-[clamp(12px,1.3vw,14px)] font-extrabold text-[#fdfcf0] tracking-wider leading-none [text-shadow:0_2px_4px_rgba(0,0,0,1)]">
                {FORMAT_CURRENCY(product.price)}
              </span>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2 mb-0.5">
                <span className={`text-[9px] font-black uppercase tracking-[0.2em] italic
                  ${isExclusive ? 'text-[#D4AF37]' : 'text-[var(--accent)]'}`}
                >
                  COMMISSION
                </span>
                {/* Badge removed from here as it is relocated above */}
              </div>
              <span className={`text-[clamp(12px,1.3vw,14px)] font-extrabold leading-none [text-shadow:0_2px_5px_rgba(0,0,0,1)]
                ${isExclusive ? 'text-[#FFD700] scale-105 origin-left transition-transform' : 'text-[#94f3b8] brightness-110'}`}
              >
                {FORMAT_CURRENCY(displayProfit)}
              </span>
            </div>
          </div>

          <div className={`pt-3 sm:pt-4 border-t flex flex-col ${isExclusive ? 'border-[#D4AF37]/30' : 'border-white/10'}`}>
            <span className="text-[9px] font-black text-[#AAAAAA] uppercase tracking-[0.2em] mb-0.5 italic opacity-80">INCOME</span>
            <span className={`text-[clamp(15px,1.8vw,18px)] font-black leading-none [text-shadow:0_3px_10px_rgba(0,0,0,1)]
              ${isExclusive ? 'text-[#FFD700] text-glow-gold scale-105 origin-left' : 'text-[#ffef9c] text-glow-gold'}`}
            >
              {FORMAT_CURRENCY(totalKeuntungan)}
            </span>
          </div>
        </div>

        {/* Standardized Detail Action - Fixed at bottom */}
        <div className={`flex items-center justify-between mt-3 pt-2 group/btn cursor-pointer relative z-10 border-t 
          ${isExclusive ? 'border-[#D4AF37]/30' : 'border-white/5'}`}
        >
           <span className={`text-[9px] font-black uppercase tracking-[0.3em] transition-all
             ${isExclusive ? 'text-[#D4AF37] group-hover/btn:text-white' : 'text-[#999999] group-hover/btn:text-white'}`}
           >
             {actionText}
           </span>
           <div className={`flex-grow ml-3 h-[0.5px] opacity-30 group-hover/btn:opacity-100 transition-all origin-left group-hover/btn:scale-x-105
             ${isExclusive ? 'bg-[#D4AF37]' : 'bg-[var(--accent)]'}`}
           ></div>
           <svg className={`w-3.5 h-3.5 ml-1.5 opacity-30 group-hover/btn:opacity-100 -translate-x-1 group-hover/btn:translate-x-0 transition-all
             ${isExclusive ? 'text-[#D4AF37]' : 'text-[var(--accent)]'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M9 5l7 7-7 7" />
           </svg>
        </div>
      </div>
      
      {/* MASTER DECORATIVE ELEMENTS */}
      <div className={`absolute -bottom-6 -right-6 w-24 h-24 rounded-full blur-3xl pointer-events-none transition-opacity
        ${isExclusive ? 'bg-[#D4AF37] opacity-[0.15] group-hover:opacity-[0.25]' : 'bg-[var(--accent)] opacity-[0.05] group-hover:opacity-[0.08]'}`}
      ></div>
    </div>
  );
};

export default ProductCard;
