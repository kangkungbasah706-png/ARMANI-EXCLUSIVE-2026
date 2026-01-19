
import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import ProductCard from './components/ProductCard';
import { CATALOGS_DATA, FORMAT_CURRENCY } from './constants';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState('catalogue');
  const [catalogIndex, setCatalogIndex] = useState(0);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [adminTab, setAdminTab] = useState('catalogue');
  const [adminSystemSubTab, setAdminSystemSubTab] = useState<'common' | 'kesalahan' | 'kredit' | 'verifikasi'>('common');
  const [isConfirmed, setIsConfirmed] = useState(() => localStorage.getItem('armani_confirmed') === 'true');
  const [currentThemeId, setCurrentThemeId] = useState(() => localStorage.getItem('global_theme_id') || 'IVORY_EXECUTIVE');

  useEffect(() => {
    const handleThemeChange = (e: any) => setCurrentThemeId(e.detail);
    window.addEventListener('themeChanged', handleThemeChange);
    return () => window.removeEventListener('themeChanged', handleThemeChange);
  }, []);

  const parseCurrency = (val: any): number => {
    if (typeof val === 'number') return val;
    if (typeof val !== 'string') return 0;
    const cleaned = val.replace(/IDR/g, '').replace(/\./g, '').replace(/\s/g, '').replace(/,/g, '').trim();
    const num = parseFloat(cleaned);
    return isNaN(num) ? 0 : num;
  };

  const [catalogs, setCatalogs] = useState(() => {
    const saved = localStorage.getItem('armani_catalogs');
    if (saved) {
      const parsed = JSON.parse(saved);
      return parsed.map((cat: any) => ({
        ...cat,
        products: cat.products.map((p: any) => ({
          ...p,
          isVisible: p.isVisible !== undefined ? p.isVisible : true,
          statusText: p.statusText || 'Detail',
          totalIncome: p.totalIncome !== undefined ? p.totalIncome : (p.price + p.profit),
          isExclusive: p.isExclusive !== undefined ? p.isExclusive : false
        }))
      }));
    }
    return JSON.parse(JSON.stringify(CATALOGS_DATA)).map((cat: any) => ({
      ...cat,
      products: cat.products.map((p: any) => ({
        ...p,
        isVisible: true,
        statusText: 'Detail',
        totalIncome: (p.price + p.profit),
        isExclusive: false
      }))
    }));
  });

  const [detailContent, setDetailContent] = useState(() => {
    const saved = localStorage.getItem('armani_detail');
    const defaultDetail = {
      subtitle: "DOKUMENTASI STRATEGIS INTERNAL",
      title: "DETAIL TUGAS",
      taskDetailTitle: "RINCIAN TUGAS",
      accId: "ELITE PLATINUM GROUP",
      packageAmount: 3300000,
      profitRange: "20% - 50% NETT",
      contractStatus: "Protokol Hukum Terverifikasi",
      warningText: "KONFIRMASI",
      contractItems: [
        "Detail tugas merupakan bagian dari perjanjian resmi Pengguna and Sistem.",
        "Dana yang dikirim akan otomatis menjadi saldo akun kerja.",
        "Seluruh proses mengikuti ketentuan sistem yang berlaku.",
        "Aktivasi tugas berarti Pengguna menyetujui seluruh ketentuan.",
        "Dokumen ini sah tanpa tanda tangan tertulis."
      ],
      jobItemsText: "SISTEM KERJA\n1 KALI PENYELESAIAN TUGAS 1 KALI PENARIKAN",
      workflowItems: [
        { n: "01", t: "SISTEM", d: "MASUK AKUN BISNIS" },
        { n: "02", t: "START", d: "SCROLL KE BAWAH LALU KLIK START AUTOMATIC PROMOTION LALU KLIK MULAI" },
        { n: "03", t: "PROFIT", d: "SELESAI & TERIMA KOMISI" }
      ],
      taskDetailsList: [
        { l: 'KETENTUAN', d: 'Pesanan diterbitkan otomatis oleh pusat.' },
        { l: 'PROSES', d: 'Sistem memproses tugas secara otomatis.' },
        { l: 'TUGAS', d: 'Satu pesanan satu produk total satu pesanan' },
        { l: 'STATUS penarikan', d: 'Jika tugas belum selesai, sistem tidak dapat mengizinkan' },
        { l: 'KONFIRMASI', d: 'Wajib mengikuti arahan mentor pembimbing.' }
      ],
      contractNoteTitle: "PENTING!!!",
      contractNoteText: "SETIAP MISI PEKERJAAN DISELESAIKAN, PENARIKAN DAPAT LANGSUNG DI LAKUKAN. HARAP SELESAIKAN PEKERJAAN INI DALAM WAKTU YANG DI TENTUKAN",
    };
    if (saved) {
      const parsed = JSON.parse(saved);
      return { ...defaultDetail, ...parsed };
    }
    return defaultDetail;
  });

  const [systemContent, setSystemContent] = useState(() => {
    const saved = localStorage.getItem('armani_system');
    const defaultSystem = {
      visualMode: 'verifikasi',
      common: {
        title: "DETEKSI SISTEM",
        accNo: "0821-2437-2410",
        reportDate: "18 JAN 2026",
        owner: "IWAN EGY",
        status: "VERIFIKASI AKUN",
        bank: "BNI",
        pembayaran: 9900000,
        rek: "0897714140",
        frequency: "1",
        saldo: 15850000,
        pendapatan: 29700000,
      },
      kesalahan: {
        target: 14850000,
        withdrawal: 15850000,
        recovery_override: "",
        left_title: "PEMULIHAN",
        left_subtitle: "KESALAHAN TERDETEKSI: SALURAN PENARIKAN ERROR",
        left_note: "SISTEM CRASH DAN INFORMASI TUGAS HILANG. PEMULIHAN SALURAN PENARIKAN DI PERLUKAN !!!",
        left_footer_label: "VARIANSI PROTOKOL",
        left_footer_label_value: "IDR 1.000.000",
        right_title: "INFORMASI",
        right_paragraph: "Anggota melanggar aturan penarikan and jumlah penarikan tidak sesuai dengan jumlah yang di tentukan oleh sistem, sehingga menyebabkan beberapa hal :",
        right_bullets: "SALURAN PENARIKAN TERKUNCI\nINFORMASI TUGAS HILANG\nKREDIBILITAS AKUN MENURUN",
        right_highlight_title: "PENTING !!!",
        right_highlight_text: "HARAP SEGERA PULIHKAN SALURAN PENARIKAN UNTUK MEMBUKA KEMBALI PENARIKAN DENGAN SETORAN SEJUMLAH Rp 1.560.000"
      },
      kredit: {
        kreditSaatIni: 56,
        left_title: "PEMULIHAN KREDIT",
        left_subtitle: "KREDIBILITAS MENURUN | PEMULIHAN DIPERLUKAN",
        left_note: "1 Point kredit = 1.044.900 atau 1% dari total saldo akun.\n44 Point x 1.094.900 = 45.975.600",
        left_footer_label: "KUOTA PEMULIHAN",
        left_footer_label_value: "IDR 35.640.000",
        right_title: "INFORMASI",
        right_paragraph: "SETIAP AKUN ANGGOTA AKAN MENDAPATKAN 100 POIN KREDIT SETELAH PROSES PENDAFTARAN SELESAI. POIN KREDIT INI DI GUNAKAN SEBAGAI TOLOK UKUR UNTUK MENGEVALUASI TINGKAT KEPERCAYAAN DAN KUALITAS SEORANG PELANGGAN.",
        right_bullets: "",
        right_highlight_title: "PENTING !!!",
        right_highlight_text: "HARAP MELAKUKAN SETORAN SEJUMLAH Rp. 35.640.000 UNTUK MENAIKAN POIN KREDIT MENJADI 100 AND SEJUMLAH Rp 330.000.000 DAPAT DITARIK."
      },
      verifikasi: {
        verifList: [
          { label: "KESALAHAN PENARIKAN", val: 10000000 },
          { label: "BATAS WAKTU", val: 10000000 },
          { label: "KREDIT POIN", val: 2268750 }
        ],
        left_title: "VERIFIKASI AKUN",
        left_subtitle: "VERIFIKASI PENARIKAN UNTUK PENCAIRAN",
        left_note: "SESUAI KETENTUAN BIAYA VERIFIKASI ADALAH 50% DARI TOTAL KESALAHAN YANG TERDETEKSI.",
        left_footer_label: "BIAYA VERIFIKASI",
        left_footer_label_value: "IDR 11.134.375",
        right_title: "INFORMASI",
        right_paragraph: "Verifikasi akun di perlukan karena anggota telah melakukan kesalahan berulang kali, sebagai berikut :",
        right_bullets: "Melakukan penarikan yang tidak sesuai dengan ketentuan\nMelebihi batas waktu yang di tentukan\nKredit poin menurun 80 poin",
        right_highlight_title: "PENTING !!!",
        right_highlight_text: "Harap melakukan setoran verifikasi sejumlah Rp 11.134.375 and sejumlah Rp 330.000.000 akan langsung di proses ke Rekening anggota tanpa kendala."
      }
    };
    return saved ? JSON.parse(saved) : defaultSystem;
  });

  const [bankContent, setBankContent] = useState(() => {
    const saved = localStorage.getItem('armani_bank');
    const defaultBank = {
      bankName: "BNI",
      rek: "1988 0158 80",
      owner: "IMAN HADI KESUMA",
      logo: "https://upload.wikimedia.org/wikipedia/id/thumb/1/15/BNI_logo.svg/1200px-BNI_logo.svg.png",
      status: "TERVERIFIKASI",
      certTitle: "DETAIL TUGAS TELAH DIKONFIRMASI.",
      certSubtitle: "SURAT PERSETUJUAN KERJAGIORGIO ARMANI BUSINESS",
      certItems: "01. SAYA MENYATAKAN SETUJU UNTUK MENYELESAIKAN SELURUH TUGAS SESUAI KETENTUAN SISTEM.\n02. SAYA MEMAHAMI BAHWA TUGAS YANG TELAH DIMULAI TIDAK DAPAT DIBATALKAN SECARA SEPIHAK.\n03. SAYA BERSEDIA MENGIKUTI ARAHAN MENTOR UNTUK KELANCARAN PROSES PENCAIRAN KOMISI.",
      certStatus: "SIGNED & VERIFIED",
      certFooter: "SECURED BY ARMANI PRIVÉ"
    };
    if (saved) {
      const parsed = JSON.parse(saved);
      return { ...defaultBank, ...parsed };
    }
    return defaultBank;
  });

  const handleSave = () => {
    localStorage.setItem('armani_catalogs', JSON.stringify(catalogs));
    localStorage.setItem('armani_detail', JSON.stringify(detailContent));
    localStorage.setItem('armani_system', JSON.stringify(systemContent));
    localStorage.setItem('armani_bank', JSON.stringify(bankContent));
    setIsAdminOpen(false);
  };

  const nextCatalog = () => setCatalogIndex((prev) => (prev + 1) % catalogs.length);
  const prevCatalog = () => setCatalogIndex((prev) => (prev - 1 + catalogs.length) % catalogs.length);

  const renderContent = () => {
    if (activeView === 'detail') {
      return (
        <div className="flex flex-col items-center w-full h-auto bg-transparent view-readability-optimized">
          {/* Header Section */}
          <div className="w-full flex flex-col items-center justify-center pt-2 pb-1 bg-transparent shrink-0">
            <div className="flex items-center gap-4 mb-1">
              <div className="w-14 h-[1px] bg-[var(--accent)] opacity-40"></div>
              <span className="text-[11px] font-black text-[var(--accent)] tracking-[0.5em] uppercase italic">{detailContent.subtitle}</span>
              <div className="w-14 h-[1px] bg-[var(--accent)] opacity-40"></div>
            </div>
            <h1 className="font-brand text-[72px] font-black text-[var(--text-primary)] tracking-tight leading-none text-center italic uppercase [text-shadow:0_4px_8px_rgba(0,0,0,0.1)]">
              {detailContent.title}
            </h1>
          </div>
          
          <div className="w-full px-10 pb-4">
            <div className="grid grid-cols-2 gap-x-6 gap-y-4 max-w-[960px] mx-auto">
              
              {/* Box 1: INFORMASI AKUN */}
              <div className="bg-white border border-[#B38B4D]/30 rounded-2xl p-6 shadow-xl flex flex-col">
                <h3 className="text-[14px] font-black text-[#B38B4D] tracking-[0.3em] uppercase italic mb-5">INFORMASI AKUN</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-[12px] text-[#525252] font-bold uppercase tracking-widest">ID AKUN</span>
                    <span className="text-[14px] text-black font-black uppercase italic">{detailContent.accId}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[12px] text-[#525252] font-bold uppercase tracking-widest">TUGAS</span>
                    <span className="text-[16px] text-[#B38B4D] font-black">{FORMAT_CURRENCY(detailContent.packageAmount)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[12px] text-[#525252] font-bold uppercase tracking-widest">KOMISI</span>
                    <span className="text-[14px] text-[#064e3b] font-black italic">{detailContent.profitRange}</span>
                  </div>
                </div>
              </div>

              {/* Box 2: CARA PENYELESAIAN TUGAS */}
              <div className="bg-white border border-[#B38B4D]/10 rounded-2xl p-6 shadow-xl flex flex-col items-center justify-between">
                <h3 className="text-[12px] font-black text-[#B38B4D]/60 tracking-[0.4em] uppercase italic mb-4">CARA PENYELESAIAN TUGAS</h3>
                <div className="grid grid-cols-3 gap-2 w-full">
                  {detailContent.workflowItems.map((item: any, i: number) => (
                    <div key={i} className="text-center flex flex-col items-center px-1">
                      <span className="text-[16px] text-black font-black uppercase italic leading-none mb-1.5">{item.t}</span>
                      <span className="text-[10px] text-[#525252] font-bold uppercase tracking-widest leading-tight text-center">{item.d}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Box 3: KETENTUAN KONTRAK - REFINED VISUALS */}
              <div className="bg-white border border-[#B38B4D]/10 rounded-2xl p-6 shadow-xl flex flex-col min-h-[280px]">
                <h3 className="text-[14px] font-black text-[#B38B4D] tracking-[0.3em] uppercase italic mb-6">KETENTUAN KONTRAK</h3>
                <div className="space-y-4">
                  {detailContent.contractItems.map((text: string, i: number) => (
                    <div key={i} className="flex gap-4 items-start group">
                      <span className="text-[#B38B4D] font-black text-[15px] mt-0.5 opacity-70 w-4 shrink-0 text-center">§</span>
                      <p className="text-[12px] leading-[1.3] text-[#525252] font-bold uppercase tracking-tight">{text}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Box 4: RINCIAN TUGAS POINT - REFINED VISUALS */}
              <div className="bg-white border border-[#B38B4D]/10 rounded-2xl p-6 shadow-xl flex flex-col min-h-[280px]">
                <h3 className="text-[14px] font-black text-[#B38B4D] tracking-[0.3em] uppercase italic mb-6">{detailContent.taskDetailTitle || "RINCIAN TUGAS"}</h3>
                <div className="space-y-4 mb-auto">
                  {(detailContent.taskDetailsList || []).map((item: any, i: number) => (
                    <div key={i} className="flex gap-4 items-start">
                      <div className="w-2 h-2 rounded-full bg-[#B38B4D]/40 mt-1.5 shrink-0"></div>
                      <div className="flex flex-col sm:flex-row sm:gap-4 flex-grow items-baseline">
                        <span className="text-[11px] font-black text-[#B38B4D] uppercase italic tracking-[0.15em] w-[110px] shrink-0 leading-tight">{item.l}</span>
                        <p className="text-[11px] text-black font-bold leading-tight uppercase tracking-wide">{item.d}</p>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Sistem Kerja Box */}
                <div className="bg-[#999999]/20 p-3 rounded-lg text-center mt-6 border border-black/5">
                   <h4 className="text-[11px] font-black text-[#333333] uppercase italic mb-1 opacity-70">SISTEM KERJA</h4>
                   <p className="text-[11px] font-black text-[#444444] uppercase tracking-wider">1 KALI PENYELESAIAN TUGAS 1 KALI PENARIKAN</p>
                </div>
              </div>

              {/* Box 5: PENTING!!! (Bottom Left) */}
              <div className="bg-[#1a1a1a] border-2 border-[#B38B4D]/40 rounded-2xl p-5 shadow-2xl flex flex-col justify-center h-[100px]">
                <h3 className="text-[14px] font-black text-[#B38B4D] tracking-[0.3em] uppercase italic mb-2">PENTING!!!</h3>
                <p className="text-[11px] leading-tight text-[#888888] font-black uppercase italic">
                  {detailContent.contractNoteText}
                </p>
              </div>

              {/* Box 6: KONFIRMASI (Bottom Right) */}
              <div 
                onClick={() => {
                  localStorage.setItem('armani_confirmed', 'true');
                  setIsConfirmed(true);
                  setActiveView('bank');
                }}
                className="bg-[#8a6a35] border border-[#8a6a35] rounded-2xl shadow-[0_15px_40px_-10px_rgba(138,106,53,0.5)] cursor-pointer group hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center h-[100px]"
              >
                <p className="text-[32px] font-black text-white uppercase tracking-[0.5em] leading-none italic drop-shadow-lg">
                  {detailContent.warningText}
                </p>
              </div>

            </div>
          </div>
        </div>
      );
    }

    if (activeView === 'system') {
      const s = systemContent;
      const common = s.common;
      const currentModeData = s[s.visualMode as keyof typeof s] as any;
      
      let footerValueToDisplay = currentModeData.left_footer_label_value;
      if (s.visualMode === 'kesalahan') {
        if (s.kesalahan.recovery_override) {
          footerValueToDisplay = s.kesalahan.recovery_override;
        } else {
          const targetNum = parseCurrency(s.kesalahan.target);
          const withdrawalNum = parseCurrency(s.kesalahan.withdrawal);
          const diff = withdrawalNum - targetNum;
          footerValueToDisplay = FORMAT_CURRENCY(diff);
        }
      }

      return (
        <div className="flex flex-col items-center w-full h-auto bg-transparent view-readability-optimized">
          <div className="w-full h-auto pt-4 px-12 pb-1 flex flex-col gap-4 justify-start">
            <div className="w-full flex flex-col items-center border-b border-white/10 pb-2 shrink-0 relative">
               <span className="text-[12px] font-black text-[var(--accent)] tracking-[0.8em] uppercase mb-1">Protokol Audit Internal</span>
               <h2 className="text-[46px] font-brand font-black text-[var(--color-text-primary)] tracking-tight uppercase italic">{common.title}</h2>
            </div>
            
            <div className="w-full bg-[var(--bg-panel)] rounded-2xl p-6 border border-white/5 luxury-gradient-border shadow-2xl shrink-0">
                <div className="grid grid-cols-2 gap-x-12 gap-y-3">
                   {[
                     { l: "ID AKUN", v: common.accNo }, { l: "TANGGAL", v: common.reportDate },
                     { l: "NAMA", v: common.owner }, { l: "STATUS AKUN", v: s.visualMode === 'kredit' ? 'KREDIT POIN' : common.status, highlight: true },
                     { l: "NAMA BANK", v: common.bank }, { l: "PEMBAYARAN", v: FORMAT_CURRENCY(common.pembayaran) },
                     { l: "NOMOR REKENING", v: common.rek }, { l: "FREKUENSI", v: common.frequency },
                     { l: "INFORMASI SALDO", v: FORMAT_CURRENCY(common.saldo) }, { l: "Total Pendapatan", v: FORMAT_CURRENCY(common.pembayaran) }
                   ].map((item, i) => (
                     <div key={i} className="flex justify-between items-end border-b border-white/5 pb-1">
                       <span className="text-[12px] font-black tracking-[0.3em] uppercase text-[var(--color-text-secondary)] italic">{item.l}</span>
                       <span className={`text-[16px] font-sans font-extrabold tracking-tight uppercase ${item.highlight ? 'text-[var(--status-error)] animate-pulse' : 'text-[var(--color-text-primary)]'}`}>{item.v}</span>
                     </div>
                   ))}
                </div>
            </div>

            <div className="w-full grid grid-cols-12 gap-4 overflow-visible">
              <div className="col-span-7 flex flex-col h-auto bg-[var(--bg-panel)] border border-white/5 shadow-2xl rounded-2xl overflow-visible">
                 <div className="w-full py-2 bg-white/5 text-center border-b border-white/5 shrink-0">
                   <span className="text-[12px] font-black uppercase tracking-[0.5em] text-[var(--accent)] italic">DETEKSI SISTEM</span>
                 </div>
                 
                 <div className="flex-grow p-6 flex flex-col justify-between h-auto overflow-visible">
                    <div className="flex flex-col gap-4 flex-grow">
                        <div className="shrink-0">
                            <h4 className="text-[24px] font-brand font-black text-[var(--color-text-primary)] uppercase tracking-wide border-l-4 border-[var(--accent)] pl-6 italic">{currentModeData.left_title}</h4>
                            <p className="text-[11px] text-[var(--accent)] font-black uppercase tracking-[0.25em] mt-1 opacity-80 italic">{currentModeData.left_subtitle}</p>
                        </div>

                        <div className="flex flex-col justify-center h-auto">
                            {s.visualMode === 'kesalahan' && (
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-black/40 p-4 border border-white/5 rounded-xl flex flex-col justify-center">
                                        <h4 className="text-[10px] text-[var(--color-text-secondary)] uppercase tracking-[0.3em] mb-1 font-black italic">PENARIKAN YANG DITENTUKAN</h4>
                                        <span className="text-[22px] font-sans font-extrabold text-[var(--color-success)]">{FORMAT_CURRENCY(parseCurrency(s.kesalahan.target))}</span>
                                    </div>
                                    <div className="bg-black/40 p-4 border border-[var(--status-error)]/20 rounded-xl flex flex-col justify-center">
                                        <h4 className="text-[10px] text-[var(--color-text-secondary)] uppercase tracking-[0.3em] mb-1 font-black italic">PENARIKAN YANG DILAKUKAN</h4>
                                        <span className="text-[22px] font-sans font-extrabold text-[var(--status-error)]">{FORMAT_CURRENCY(parseCurrency(s.kesalahan.withdrawal))}</span>
                                    </div>
                                </div>
                            )}

                            {s.visualMode === 'kredit' && (
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-black/40 p-6 border border-white/5 rounded-xl flex flex-col justify-center min-h-[110px] shadow-inner">
                                        <h4 className="text-[11px] mb-2 text-[var(--color-text-secondary)] uppercase tracking-[0.35em] font-black italic border-b border-white/5 pb-1">POIN AWAL</h4>
                                        <span className="text-[32px] font-sans font-black text-[var(--color-text-primary)] leading-none text-glow-gold">100</span>
                                    </div>
                                    <div className="bg-black/40 p-6 border border-[var(--status-error)]/20 rounded-xl flex flex-col justify-center min-h-[110px] shadow-inner">
                                        <h4 className="text-[11px] mb-2 text-[var(--status-error)] uppercase tracking-[0.35em] font-black italic border-b border-[var(--status-error)]/10 pb-1">SKOR SAAT INI</h4>
                                        <span className="text-[32px] font-sans font-black text-[var(--status-error)] leading-none animate-soft-pulse">{s.kredit.kreditSaatIni}</span>
                                    </div>
                                </div>
                            )}

                            {s.visualMode === 'verifikasi' && (
                                <div className="bg-black/40 border border-white/5 rounded-xl overflow-hidden shadow-xl">
                                    <table className="w-full text-[13px] border-collapse">
                                        <thead>
                                            <tr className="bg-white/10">
                                                <th className="text-left py-2 px-4 text-[var(--accent)] uppercase tracking-[0.25em] font-black italic">RINCIAN KESALAHAN</th>
                                                <th className="text-right py-2 px-4 text-[var(--accent)] uppercase tracking-[0.25em] font-black italic">BIAYA KESALAHAN</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {s.verifikasi.verifList.map((item: any, idx: number) => (
                                                <tr key={idx} className="border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors">
                                                    <td className="py-2 px-4 text-[var(--color-text-secondary)] font-bold uppercase tracking-wider">{item.label}</td>
                                                    <td className="py-2 px-4 text-right font-sans font-extrabold text-[var(--status-error)]">{FORMAT_CURRENCY(item.val * 0.5)}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>

                        <div className="shrink-0 mt-2">
                           <p className="text-[14px] whitespace-pre-line leading-relaxed text-[var(--color-text-secondary)] font-bold italic pr-4 border-l border-white/10 pl-4">
                                {currentModeData.left_note}
                            </p>
                        </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-white/10 flex justify-between items-center bg-black/40 p-6 rounded-xl border-t-[4px] border-t-[var(--accent)] shadow-2xl shrink-0">
                        <span className="text-[12px] font-black text-[var(--accent)] uppercase tracking-[0.5em] italic">
                          {s.visualMode === 'verifikasi' ? 'BIAYA VERIFIKASI' : 'PEMULIHAN'}
                        </span>
                        <span className="text-[32px] font-sans font-black text-[var(--color-text-primary)] text-glow-gold">
                          {footerValueToDisplay || 'IDR 0'}
                        </span>
                    </div>
                 </div>
              </div>

              <div className="col-span-5 bg-[var(--bg-panel)] border border-white/5 flex flex-col p-6 shadow-2xl rounded-2xl h-auto overflow-visible relative">
                 <div className="w-full border-b pb-2 mb-4 border-white/10 flex justify-between items-center shrink-0">
                   <span className="text-[16px] font-brand font-black uppercase tracking-[0.4em] text-[var(--accent)] italic">{currentModeData.right_title}</span>
                   <div className="w-3 h-3 bg-[var(--status-error)] rounded-full animate-pulse shadow-[0_0_15px_var(--status-error)]"></div>
                 </div>

                 <div className="flex-grow flex flex-col justify-between h-auto">
                    <div className="flex flex-col gap-4">
                        <div className="text-[15px] font-bold leading-relaxed text-[var(--color-text-secondary)] pr-2">
                            {currentModeData.right_paragraph}
                        </div>

                        {currentModeData.right_bullets && currentModeData.right_bullets.trim() !== '' && (
                            <div className="space-y-3 bg-black/40 p-4 rounded-xl border border-white/5 shadow-inner">
                                {currentModeData.right_bullets.split('\n').filter((t:string)=>t.trim()!=='').map((text: string, i: number) => (
                                    <div key={i} className="flex items-center gap-4">
                                        <div className="w-1.5 h-1.5 bg-[var(--accent)] rounded-full opacity-60 shadow-[0_0_5px_var(--accent)]"></div>
                                        <span className="text-[12px] text-[var(--color-text-primary)] font-extrabold uppercase tracking-[0.15em] opacity-80">{text}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="mt-4">
                        <div className="p-4 bg-gradient-to-br from-[var(--status-error)]/15 to-transparent border border-[var(--status-error)]/30 rounded-2xl space-y-2 shadow-2xl backdrop-blur-sm border-l-[4px] border-l-[var(--status-error)]">
                            <h5 className="text-[13px] font-black text-[var(--status-error)] uppercase tracking-[0.4em] italic">
                                <span className="flex items-center gap-2">
                                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                                  {currentModeData.right_highlight_title}
                                </span>
                            </h5>
                            <p className="text-[13px] font-extrabold text-[var(--color-text-primary)] uppercase tracking-[0.12em] leading-relaxed italic">
                                {currentModeData.right_highlight_text}
                            </p>
                        </div>
                    </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (activeView === 'bank') {
      const b = bankContent;
      return (
        <div className="flex flex-col items-center justify-center w-full h-auto bg-transparent px-12 pt-12 pb-6 relative">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,var(--accent)_0%,transparent_70%)] opacity-[0.03] pointer-events-none"></div>
          
          {isConfirmed && (
            <div className="w-[760px] p-6 bg-[var(--bg-panel)] border border-white/5 rounded-[24px] luxury-gradient-border shadow-2xl mb-6 relative overflow-hidden shrink-0">
               <div className="absolute top-0 left-0 w-full h-1 bg-[var(--accent)]"></div>
               <h3 className="text-[11px] font-black text-[var(--accent)] tracking-[0.5em] mb-2 text-center uppercase italic opacity-70">
                 {b.certSubtitle}
               </h3>
               <p className="text-[14px] font-black text-[var(--color-text-primary)] text-center mb-4 border-b border-white/10 pb-2 tracking-widest uppercase italic">
                 {b.certTitle}
               </p>
               <div className="space-y-2 text-[11px] text-[var(--color-text-secondary)] font-bold leading-relaxed uppercase">
                  {(b.certItems || "").split('\n').map((line: string, i: number) => {
                    const lineTrim = line.trim();
                    if (!lineTrim) return null;
                    const parts = lineTrim.split(/^(\d+\.)/);
                    if (parts.length > 2) {
                      return (
                        <p key={i} className="flex gap-3">
                          <span className="text-[var(--accent)]">{parts[1]}</span> {parts[2]}
                        </p>
                      );
                    }
                    return <p key={i} className="flex gap-3">{lineTrim}</p>;
                  })}
               </div>
               <div className="mt-5 flex justify-between items-end border-t border-white/5 pt-3">
                  <div className="flex flex-col">
                     <span className="text-[8px] opacity-40 uppercase tracking-[0.2em] font-black mb-1">Status Verifikasi</span>
                     <span className="text-[10px] font-black italic text-[var(--color-success)] px-3 py-1 bg-[var(--color-success)]/10 rounded-full border border-[var(--color-success)]/20 uppercase">
                       {b.certStatus}
                     </span>
                  </div>
                  <div className="flex flex-col text-right">
                     <span className="text-[10px] font-sans font-black text-[var(--color-text-primary)] tracking-wider uppercase">
                       {b.certFooter}
                     </span>
                  </div>
               </div>
            </div>
          )}

          <div className="w-[760px] h-[380px] bg-[var(--bg-panel)] shadow-[0_60px_100px_-30px_rgba(0,0,0,1)] relative overflow-hidden border border-white/5 flex flex-col rounded-[32px] luxury-gradient-border shrink-0">
            <div className="flex-grow flex flex-col px-12 pt-8 pb-8 relative z-10">
              <div className="absolute top-8 right-12">
                <span className="text-[11px] font-black text-white uppercase tracking-[0.4em] px-6 py-2 rounded-full bg-black/40 backdrop-blur-xl border border-white/10 italic">
                  {b.status}
                </span>
              </div>
              <div className="mb-6 border-b border-white/5 pb-5">
                <h2 className="text-[36px] font-brand font-black tracking-tight leading-none uppercase text-[var(--color-text-primary)] italic">
                  BANK ACCOUNT <span className="text-[var(--accent)] font-medium">CARD</span>
                </h2>
                <p className="text-[10px] text-[var(--color-text-secondary)] font-black uppercase tracking-[0.6em] mt-2.5 italic">DIGITAL BUSINESS PROGRAM BY GIORGIO ARMANI</p>
              </div>
              <div className="flex-grow grid grid-cols-12 gap-10 items-center">
                <div className="col-span-4 flex items-center justify-center border-r border-white/5 pr-10">
                  <div className="w-full aspect-square bg-black rounded-2xl shadow-2xl border border-white/5 flex items-center justify-center p-6 relative overflow-hidden">
                    <img src={b.logo} alt="Bank Logo" className="w-full h-full object-contain grayscale brightness-125" />
                  </div>
                </div>
                <div className="col-span-8 pl-10 flex flex-col justify-center gap-5">
                  {/* DISPLAYING BANK NAME ABOVE ACCOUNT NUMBER */}
                  <div className="flex flex-col">
                    <span className="text-[9px] font-black text-[var(--color-text-secondary)] uppercase tracking-[0.5em] mb-1.5 italic">NAMA BANK</span>
                    <span className="text-[18px] font-brand font-black text-[var(--color-text-primary)] uppercase tracking-wide leading-none">{b.bankName}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[9px] font-black text-[var(--color-text-secondary)] uppercase tracking-[0.5em] mb-1.5 italic">NOMOR REKENING</span>
                    <span className="text-[34px] font-sans font-medium text-[var(--accent)] tracking-normal leading-none">{b.rek}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[9px] font-black text-[var(--color-text-secondary)] uppercase tracking-[0.5em] mb-1.5 italic">NAMA</span>
                    <span className="text-[20px] font-brand font-black text-[var(--color-text-primary)] uppercase tracking-wide leading-none">{b.owner}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="flex flex-col items-center justify-between w-full h-[calc(1000px-72px-30px)] bg-transparent bg-gradient-to-b from-transparent via-black/5 to-black/10">
        {/* Unified Catalog Header - Space balanced */}
        <div className="w-full h-32 flex flex-col items-center justify-center shrink-0 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[var(--accent)]/10 to-transparent"></div>
          <div className="relative z-10 flex flex-col items-center">
            <h2 className="font-brand text-[clamp(24px,3.5vw,42px)] font-black text-[var(--color-text-primary)] tracking-[0.4em] uppercase text-center leading-none italic [text-shadow:0_2px_4px_rgba(0,0,0,0.1)]">
              {catalogs[catalogIndex].name}
            </h2>
            <div className="flex items-center gap-6 mt-4">
               <div className="w-20 h-[1px] bg-[var(--accent)] opacity-40"></div>
               <p className="text-[clamp(10px,1.1vw,13px)] font-black text-[var(--accent)] tracking-[0.8em] uppercase italic">COLLECTION 2026</p>
               <div className="w-20 h-[1px] bg-[var(--accent)] opacity-40"></div>
            </div>
          </div>
          {/* Subtle decorative background text */}
          <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-[120px] font-black text-black/[0.03] pointer-events-none select-none tracking-widest uppercase">
            {catalogs[catalogIndex].name}
          </span>
        </div>

        {/* Unified Grid Layout - Fully responsive rows with stretch items */}
        <div className="grid grid-cols-2 grid-rows-2 items-stretch gap-x-8 gap-y-6 w-full max-w-[960px] px-10 py-2 mb-auto flex-grow min-h-0 overflow-hidden">
          {catalogs[catalogIndex].products.map((product: any) => (
            product.isVisible !== false && (
              <div key={product.id} className="flex flex-col h-full min-h-0">
                <ProductCard product={product} />
              </div>
            )
          ))}
        </div>

        {/* Standardized Navigation - Fixed position */}
        <div className="w-full h-20 flex items-center justify-center gap-16 shrink-0 border-t border-black/5 bg-transparent">
          <button onClick={prevCatalog} className="text-[var(--color-text-secondary)] hover:text-[var(--accent)] transition-all uppercase font-black text-[11px] tracking-[0.5em] italic group flex items-center gap-2">
            <span className="opacity-0 group-hover:opacity-100 transition-all">-</span> SEBELUMNYA
          </button>
          <div className="flex gap-4">
            {catalogs.map((_: any, i: number) => (
              <div key={i} className={`w-2.5 h-2.5 rounded-full border transition-all duration-700 ${i === catalogIndex ? 'bg-[var(--accent)] scale-150 border-none shadow-[0_0_10px_var(--accent)]' : 'bg-transparent border-[var(--accent)]/40 hover:border-[var(--accent)]'}`} />
            ))}
          </div>
          <button onClick={nextCatalog} className="text-[var(--color-text-secondary)] hover:text-[var(--accent)] transition-all uppercase font-black text-[11px] tracking-[0.5em] italic group flex items-center gap-2">
            SELANJUTNYA <span className="opacity-0 group-hover:opacity-100 transition-all">-</span>
          </button>
        </div>
      </div>
    );
  };

  return (
    <div 
      className="app-canvas flex flex-col bg-transparent relative"
      style={{ height: '1000px', minHeight: '1000px', overflow: 'hidden' }}
    >
      <Header activeView={activeView} setActiveView={setActiveView} />
      <main className="relative z-10 flex-grow flex flex-col overflow-hidden">
        {renderContent()}
      </main>
      <footer className="relative z-10 w-full text-center py-2 bg-transparent border-t border-white/5 text-[9px] font-black text-[var(--color-text-secondary)] uppercase tracking-[1em] shrink-0 opacity-20 italic">
        GIORGIO ARMANI SYSTEM 2026
      </footer>

      <button onClick={() => setIsAdminOpen(true)} className="fixed bottom-4 right-4 z-[100] w-10 h-10 bg-black/40 backdrop-blur-md hover:bg-[var(--accent)] border border-white/10 rounded-full flex items-center justify-center transition-all opacity-20 hover:opacity-100 hover:text-black group">
        <svg className="w-5 h-5 transition-transform group-hover:rotate-180" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd"></path></svg>
      </button>

      {isAdminOpen && (
        <div className="fixed inset-0 z-[200] bg-black/98 backdrop-blur-3xl flex items-center justify-center p-6">
          <div className="w-full max-w-[1200px] h-[90vh] bg-[#080808] border border-white/5 rounded-[40px] shadow-[0_100px_200px_-50px_rgba(0,0,0,1)] overflow-hidden flex flex-col">
            <div className="p-8 bg-[#0c0c0c] border-b border-white/5 flex justify-between items-center shrink-0">
              <div>
                <h2 className="text-white font-brand font-black text-2xl uppercase tracking-widest italic">Pusat Kontrol Strategis</h2>
                <p className="text-[var(--accent)] text-[11px] mt-1 uppercase tracking-[0.5em] italic font-black">Tata Kelola Konten & Parameter Sistem</p>
              </div>
              <div className="flex gap-4">
                <button onClick={() => setIsAdminOpen(false)} className="text-white/40 hover:text-white px-6 py-3 rounded-xl font-bold text-[11px] uppercase tracking-widest border border-white/5 transition-all">Batal</button>
                <button onClick={handleSave} className="bg-[var(--accent)] text-black px-10 py-3 rounded-xl font-black text-[11px] uppercase tracking-widest hover:bg-white transition-all shadow-xl">Simpan Perubahan</button>
              </div>
            </div>

            <div className="flex flex-grow overflow-hidden">
              <div className="w-[280px] border-r border-white/5 bg-[#0a0a0a] p-6 flex flex-col gap-2 shrink-0 overflow-y-auto custom-scrollbar">
                <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em] mb-4 ml-4">Halaman Aktif</p>
                {['catalogue', 'detail', 'system', 'bank', 'preset'].map(t => (
                  <button 
                    key={t} 
                    onClick={() => setAdminTab(t)} 
                    className={`text-left px-6 py-4 rounded-xl text-[11px] font-black uppercase tracking-[0.3em] transition-all italic ${adminTab === t ? 'bg-[var(--accent)] text-black' : 'text-white/30 hover:text-white hover:bg-white/5'}`}
                  >
                    {t === 'preset' ? 'Preset Visual' : `Kontrol ${t.toUpperCase()}`}
                  </button>
                ))}
              </div>

              <div className="flex-grow overflow-y-auto p-12 bg-[#080808] custom-scrollbar">
                <div className="max-w-4xl mx-auto pb-20">
                  {/* CATALOGUE TAB */}
                  {adminTab === 'catalogue' && (
                    <div className="space-y-10">
                      <div className="flex justify-between items-center mb-6">
                        <h3 className="text-white font-black text-lg uppercase tracking-widest italic">Edit Katalog Produk</h3>
                        <div className="flex gap-2">
                          {catalogs.map((c: any, i: number) => (
                            <button key={i} onClick={() => setCatalogIndex(i)} className={`px-4 py-2 rounded-lg text-[10px] font-bold uppercase transition-all ${catalogIndex === i ? 'bg-[var(--accent)] text-black' : 'bg-white/5 text-white/40'}`}>
                              {c.name}
                            </button>
                          ))}
                        </div>
                      </div>
                      <AdminGroup label={`Katalog: ${catalogs[catalogIndex].name}`}>
                        <AdminInput label="Nama Katalog" value={catalogs[catalogIndex].name} onChange={(v: string) => {
                          const newC = [...catalogs];
                          newC[catalogIndex].name = v;
                          setCatalogs(newC);
                        }} />
                      </AdminGroup>
                      {catalogs[catalogIndex].products.map((p: any, pIdx: number) => (
                        <AdminGroup key={p.id} label={`Produk ${p.label}`}>
                          <div className="grid grid-cols-2 gap-x-6 gap-y-8">
                            <AdminCheckbox label="Tampilkan Produk" value={p.isVisible !== false} onChange={(v: boolean) => {
                               const newC = [...catalogs];
                               newC[catalogIndex].products[pIdx].isVisible = v;
                               setCatalogs(newC);
                            }} />
                            <AdminCheckbox label="Exclusive Mode (Force 50%)" value={p.isExclusive === true} onChange={(v: boolean) => {
                               const newC = [...catalogs];
                               newC[catalogIndex].products[pIdx].isExclusive = v;
                               setCatalogs(newC);
                            }} />
                            
                            <AdminInput label="Label" value={p.label} onChange={(v: string) => {
                               const newC = [...catalogs];
                               newC[catalogIndex].products[pIdx].label = v;
                               setCatalogs(newC);
                            }} />
                            <AdminInput label="Nama Produk" value={p.name} onChange={(v: string) => {
                               const newC = [...catalogs];
                               newC[catalogIndex].products[pIdx].name = v;
                               setCatalogs(newC);
                            }} />
                            <AdminInput label="Harga (IDR)" type="number" value={p.price} onChange={(v: any) => {
                               const newC = [...catalogs];
                               newC[catalogIndex].products[pIdx].price = Number(v);
                               setCatalogs(newC);
                            }} />
                            <AdminInput label="Profit (IDR)" type="number" value={p.profit} onChange={(v: any) => {
                               const newC = [...catalogs];
                               newC[catalogIndex].products[pIdx].profit = Number(v);
                               setCatalogs(newC);
                            }} />
                            <AdminInput label="Persentase Komisi (%)" type="number" value={p.commission} onChange={(v: any) => {
                               const newC = [...catalogs];
                               newC[catalogIndex].products[pIdx].commission = Number(v);
                               setCatalogs(newC);
                            }} />
                            <AdminInput label="Total Pendapatan (Override)" type="number" value={p.totalIncome} onChange={(v: any) => {
                               const newC = [...catalogs];
                               newC[catalogIndex].products[pIdx].totalIncome = Number(v);
                               setCatalogs(newC);
                            }} />
                            <AdminInput label="Teks Tombol Detail" value={p.statusText || 'Detail'} onChange={(v: string) => {
                               const newC = [...catalogs];
                               newC[catalogIndex].products[pIdx].statusText = v;
                               setCatalogs(newC);
                            }} />
                            <AdminInput label="URL Gambar" value={p.imageUrl} onChange={(v: string) => {
                               const newC = [...catalogs];
                               newC[catalogIndex].products[pIdx].imageUrl = v;
                               setCatalogs(newC);
                            }} />
                          </div>
                        </AdminGroup>
                      ))}
                    </div>
                  )}

                  {/* DETAIL TAB */}
                  {adminTab === 'detail' && (
                    <div className="space-y-12">
                      <AdminGroup label="Header Rincian">
                        <div className="grid grid-cols-2 gap-8">
                          <AdminInput label="Judul Utama" value={detailContent.title} onChange={(v: string) => setDetailContent((p:any)=>({...p, title: v}))} />
                          <AdminInput label="Sub Judul" value={detailContent.subtitle} onChange={(v: string) => setDetailContent((p:any)=>({...p, subtitle: v}))} />
                          <AdminInput label="Label Box Rincian" value={detailContent.taskDetailTitle || "RINCIAN TUGAS"} onChange={(v: string) => setDetailContent((p:any)=>({...p, taskDetailTitle: v}))} />
                        </div>
                      </AdminGroup>
                      <AdminGroup label="Data Akun Elite">
                        <div className="grid grid-cols-2 gap-8">
                          <AdminInput label="ID Akun" value={detailContent.accId} onChange={(v: string) => setDetailContent((p:any)=>({...p, accId: v}))} />
                          <AdminInput label="Nilai Tugas" type="number" value={detailContent.packageAmount} onChange={(v: any) => setDetailContent((p:any)=>({...p, packageAmount: Number(v)}))} />
                          <AdminInput label="Rentang Komisi" value={detailContent.profitRange} onChange={(v: string) => setDetailContent((p:any)=>({...p, profitRange: v}))} />
                          <AdminInput label="Status Kontrak" value={detailContent.contractStatus} onChange={(v: string) => setDetailContent((p:any)=>({...p, contractStatus: v}))} />
                        </div>
                      </AdminGroup>

                      <AdminGroup label="Workflow Penyeleasian">
                        {detailContent.workflowItems.map((item: any, idx: number) => (
                          <div key={idx} className="grid grid-cols-12 gap-4 items-end mb-4 last:mb-0 border-b border-white/5 pb-4 last:border-0">
                            <div className="col-span-2">
                              <AdminInput label={`No ${idx+1}`} value={item.n} onChange={(v:any)=> {
                                const items = [...detailContent.workflowItems];
                                items[idx].n = v;
                                setDetailContent((p:any)=>({...p, workflowItems: items}));
                              }} />
                            </div>
                            <div className="col-span-4">
                              <AdminInput label={`Tag ${idx+1}`} value={item.t} onChange={(v:any)=> {
                                const items = [...detailContent.workflowItems];
                                items[idx].t = v;
                                setDetailContent((p:any)=>({...p, workflowItems: items}));
                              }} />
                            </div>
                            <div className="col-span-6">
                              <AdminInput label={`Deskripsi ${idx+1}`} value={item.d} onChange={(v:any)=> {
                                const items = [...detailContent.workflowItems];
                                items[idx].d = v;
                                setDetailContent((p:any)=>({...p, workflowItems: items}));
                              }} />
                            </div>
                          </div>
                        ))}
                      </AdminGroup>

                      <AdminGroup label="Poin Rincian Tugas (List)">
                        {(detailContent.taskDetailsList || []).map((item: any, idx: number) => (
                          <div key={idx} className="grid grid-cols-12 gap-4 items-end mb-4 last:mb-0 border-b border-white/5 pb-4 last:border-0">
                            <div className="col-span-4">
                              <AdminInput label={`Label ${idx+1}`} value={item.l} onChange={(v:any)=> {
                                const items = [...detailContent.taskDetailsList];
                                items[idx].l = v;
                                setDetailContent((p:any)=>({...p, taskDetailsList: items}));
                              }} />
                            </div>
                            <div className="col-span-8">
                              <AdminInput label={`Deskripsi ${idx+1}`} value={item.d} onChange={(v:any)=> {
                                const items = [...detailContent.taskDetailsList];
                                items[idx].d = v;
                                setDetailContent((p:any)=>({...p, taskDetailsList: items}));
                              }} />
                            </div>
                          </div>
                        ))}
                      </AdminGroup>

                      <AdminGroup label="Rincian Tugas (Paragraf)">
                        <AdminTextArea label="Teks Rincian Tugas" value={detailContent.jobItemsText} onChange={(v: string) => setDetailContent((p:any)=>({...p, jobItemsText: v}))} />
                      </AdminGroup>

                      <AdminGroup label="Kontrak & Keamanan">
                        <AdminTextArea label="Item Kontrak (Baris Baru)" value={detailContent.contractItems.join('\n')} onChange={(v: string) => setDetailContent((p:any)=>({...p, contractItems: v.split('\n')}))} />
                        <div className="grid grid-cols-2 gap-8 mt-6">
                           <AdminInput label="Judul Catatan Penting" value={detailContent.contractNoteTitle} onChange={(v: string) => setDetailContent((p:any)=>({...p, contractNoteTitle: v}))} />
                           <AdminInput label="Teks Catatan Penting" value={detailContent.contractNoteText} onChange={(v: string) => setDetailContent((p:any)=>({...p, contractNoteText: v}))} />
                        </div>
                      </AdminGroup>
                      <AdminGroup label="Tombol">
                         <AdminInput label="Teks Tombol Aksi" value={detailContent.warningText} onChange={(v: string) => setDetailContent((p:any)=>({...p, warningText: v}))} />
                      </AdminGroup>
                    </div>
                  )}

                  {/* SYSTEM TAB */}
                  {adminTab === 'system' && (
                    <div className="space-y-10">
                      <div className="flex bg-white/5 p-1 rounded-xl mb-6 sticky top-0 z-[10]">
                        {['common', 'kesalahan', 'kredit', 'verifikasi'].map(st => (
                          <button key={st} onClick={() => setAdminSystemSubTab(st as any)} className={`flex-grow py-3 rounded-lg text-[11px] font-black uppercase tracking-widest transition-all ${adminSystemSubTab === st ? 'bg-[var(--accent)] text-black shadow-lg' : 'text-white/40 hover:text-white'}`}>
                            {st}
                          </button>
                        ))}
                      </div>

                      <div className="max-h-[60vh] overflow-y-auto custom-scrollbar pr-4">
                        {adminSystemSubTab === 'common' && (
                          <AdminGroup label="Data Umum Audit">
                            <div className="grid grid-cols-2 gap-6">
                              <AdminInput label="Judul Laporan" value={systemContent.common.title} onChange={(v: string) => setSystemContent((p:any)=>({...p, common: {...p.common, title: v}}))} />
                              <AdminInput label="ID Akun" value={systemContent.common.accNo} onChange={(v: string) => setSystemContent((p:any)=>({...p, common: {...p.common, accNo: v}}))} />
                              <AdminInput label="Tanggal Laporan" value={systemContent.common.reportDate} onChange={(v: string) => setSystemContent((p:any)=>({...p, common: {...p.common, reportDate: v}}))} />
                              <AdminInput label="Nama Pemilik" value={systemContent.common.owner} onChange={(v: string) => setSystemContent((p:any)=>({...p, common: {...p.common, owner: v}}))} />
                              <AdminInput label="Status Protokol" value={systemContent.common.status} onChange={(v: string) => setSystemContent((p:any)=>({...p, common: {...p.common, status: v}}))} />
                              <AdminInput label="Bank Referensi" value={systemContent.common.bank} onChange={(v: string) => setSystemContent((p:any)=>({...p, common: {...p.common, bank: v}}))} />
                              <AdminInput label="Nilai Pembayaran" type="number" value={systemContent.common.pembayaran} onChange={(v: any) => setSystemContent((p:any)=>({...p, common: {...p.common, pembayaran: Number(v)}}))} />
                              <AdminInput label="Rekening Referensi" value={systemContent.common.rek} onChange={(v: string) => setSystemContent((p:any)=>({...p, common: {...p.common, rek: v}}))} />
                              <AdminInput label="Frekuensi" value={systemContent.common.frequency} onChange={(v: string) => setSystemContent((p:any)=>({...p, common: {...p.common, frequency: v}}))} />
                              <AdminInput label="Saldo Akun" type="number" value={systemContent.common.saldo} onChange={(v: any) => setSystemContent((p:any)=>({...p, common: {...p.common, saldo: Number(v)}}))} />
                              <AdminInput label="Total Pendapatan" type="number" value={systemContent.common.pembayaran || systemContent.common.pendapatan} onChange={(v: any) => setSystemContent((p:any)=>({...p, common: {...p.common, pendapatan: Number(v)}}))} />
                            </div>
                          </AdminGroup>
                        )}

                        {adminSystemSubTab === 'kesalahan' && (
                          <AdminGroup label="Kontrol Mode Kesalahan">
                            <div className="grid grid-cols-2 gap-6">
                              <AdminInput label="Penarikan Ditentukan (Target)" type="number" value={systemContent.kesalahan.target} onChange={(v: any) => setSystemContent((p:any)=>({...p, kesalahan: {...p.kesalahan, target: Number(v)}}))} />
                              <AdminInput label="Penarikan Dilakukan (Actual)" type="number" value={systemContent.kesalahan.withdrawal} onChange={(v: any) => setSystemContent((p:any)=>({...p, kesalahan: {...p.kesalahan, withdrawal: Number(v)}}))} />
                              <AdminInput label="Override Nilai Pemulihan (Opsional)" value={systemContent.kesalahan.recovery_override} onChange={(v: string) => setSystemContent((p:any)=>({...p, kesalahan: {...p.kesalahan, recovery_override: v}}))} />
                              <AdminInput label="Judul Kiri" value={systemContent.kesalahan.left_title} onChange={(v: string) => setSystemContent((p:any)=>({...p, kesalahan: {...p.kesalahan, left_title: v}}))} />
                              <AdminInput label="Sub-Judul Kiri" value={systemContent.kesalahan.left_subtitle} onChange={(v: string) => setSystemContent((p:any)=>({...p, kesalahan: {...p.kesalahan, left_subtitle: v}}))} />
                              <div className="col-span-2">
                                <AdminTextArea label="Catatan Kiri" value={systemContent.kesalahan.left_note} onChange={(v: string) => setSystemContent((p:any)=>({...p, kesalahan: {...p.kesalahan, left_note: v}}))} />
                              </div>
                              <AdminInput label="Label Footer Kiri" value={systemContent.kesalahan.left_footer_label} onChange={(v: string) => setSystemContent((p:any)=>({...p, kesalahan: {...p.kesalahan, left_footer_label: v}}))} />
                              <AdminInput label="Value Footer Kiri" value={systemContent.kesalahan.left_footer_label_value} onChange={(v: string) => setSystemContent((p:any)=>({...p, kesalahan: {...p.kesalahan, left_footer_label_value: v}}))} />
                              <AdminInput label="Judul Kanan" value={systemContent.kesalahan.right_title} onChange={(v: string) => setSystemContent((p:any)=>({...p, kesalahan: {...p.kesalahan, right_title: v}}))} />
                              <div className="col-span-2">
                                <AdminTextArea label="Paragraf Kanan" value={systemContent.kesalahan.right_paragraph} onChange={(v: string) => setSystemContent((p:any)=>({...p, kesalahan: {...p.kesalahan, right_paragraph: v}}))} />
                                <AdminTextArea label="List Bullet Kanan (Baris Baru)" value={systemContent.kesalahan.right_bullets} onChange={(v: string) => setSystemContent((p:any)=>({...p, kesalahan: {...p.kesalahan, right_bullets: v}}))} />
                              </div>
                              <AdminInput label="Judul Highlight PENTING" value={systemContent.kesalahan.right_highlight_title} onChange={(v: string) => setSystemContent((p:any)=>({...p, kesalahan: {...p.kesalahan, right_highlight_title: v}}))} />
                              <div className="col-span-2">
                                <AdminTextArea label="Teks Highlight PENTING" value={systemContent.kesalahan.right_highlight_text} onChange={(v: string) => setSystemContent((p:any)=>({...p, kesalahan: {...p.kesalahan, right_highlight_text: v}}))} />
                              </div>
                            </div>
                          </AdminGroup>
                        )}

                        {adminSystemSubTab === 'kredit' && (
                          <AdminGroup label="Kontrol Mode Kredit">
                            <div className="grid grid-cols-2 gap-6">
                              <AdminInput label="Skor Kredit Saat Ini" type="number" value={systemContent.kredit.kreditSaatIni} onChange={(v: any) => setSystemContent((p:any)=>({...p, kredit: {...p.kredit, kreditSaatIni: Number(v)}}))} />
                              <AdminInput label="Judul Kiri" value={systemContent.kredit.left_title} onChange={(v: string) => setSystemContent((p:any)=>({...p, kredit: {...p.kredit, left_title: v}}))} />
                              <AdminInput label="Sub-Judul Kiri" value={systemContent.kredit.left_subtitle} onChange={(v: string) => setSystemContent((p:any)=>({...p, kredit: {...p.kredit, left_subtitle: v}}))} />
                              <div className="col-span-2">
                                <AdminTextArea label="Catatan Kiri" value={systemContent.kredit.left_note} onChange={(v: string) => setSystemContent((p:any)=>({...p, kredit: {...p.kredit, left_note: v}}))} />
                              </div>
                              <AdminInput label="Label Footer Kiri" value={systemContent.kredit.left_footer_label} onChange={(v: string) => setSystemContent((p:any)=>({...p, kredit: {...p.kredit, left_footer_label: v}}))} />
                              <AdminInput label="Value Footer Kiri" value={systemContent.kredit.left_footer_label_value} onChange={(v: string) => setSystemContent((p:any)=>({...p, kredit: {...p.kredit, left_footer_label_value: v}}))} />
                              <AdminInput label="Judul Kanan" value={systemContent.kredit.right_title} onChange={(v: string) => setSystemContent((p:any)=>({...p, kredit: {...p.kredit, right_title: v}}))} />
                              <div className="col-span-2">
                                <AdminTextArea label="Paragraf Kanan" value={systemContent.kredit.right_paragraph} onChange={(v: string) => setSystemContent((p:any)=>({...p, kredit: {...p.kredit, right_paragraph: v}}))} />
                              </div>
                              <AdminInput label="Judul Highlight PENTING" value={systemContent.kredit.right_highlight_title} onChange={(v: string) => setSystemContent((p:any)=>({...p, kredit: {...p.kredit, right_highlight_title: v}}))} />
                              <div className="col-span-2">
                                <AdminTextArea label="Teks Highlight PENTING" value={systemContent.kredit.right_highlight_text} onChange={(v: string) => setSystemContent((p:any)=>({...p, kredit: {...p.kredit, right_highlight_text: v}}))} />
                              </div>
                            </div>
                          </AdminGroup>
                        )}

                        {adminSystemSubTab === 'verifikasi' && (
                          <AdminGroup label="Kontrol Mode Verifikasi">
                            <div className="grid grid-cols-2 gap-6">
                              <div className="col-span-2 bg-black/40 p-6 rounded-2xl border border-white/5 space-y-4">
                                <p className="text-[10px] text-[var(--accent)] font-black uppercase tracking-[0.4em]">Daftar Kesalahan Verifikasi (Biaya akan otomatis dikali 50%)</p>
                                {systemContent.verifikasi.verifList.map((item: any, idx: number) => (
                                  <div key={idx} className="grid grid-cols-12 gap-4 items-end">
                                    <div className="col-span-7">
                                      <AdminInput label={`Label ${idx + 1}`} value={item.label} onChange={(v: string) => {
                                        const newList = [...systemContent.verifikasi.verifList];
                                        newList[idx].label = v;
                                        setSystemContent((p: any) => ({ ...p, verifikasi: { ...p.verifikasi, verifList: newList } }));
                                      }} />
                                    </div>
                                    <div className="col-span-5">
                                      <AdminInput label={`Nilai Full ${idx + 1}`} type="number" value={item.val} onChange={(v: any) => {
                                        const newList = [...systemContent.verifikasi.verifList];
                                        newList[idx].val = Number(v);
                                        setSystemContent((p: any) => ({ ...p, verifikasi: { ...p.verifikasi, verifList: newList } }));
                                      }} />
                                    </div>
                                  </div>
                                ))}
                              </div>
                              <AdminInput label="Judul Kiri" value={systemContent.verifikasi.left_title} onChange={(v: string) => setSystemContent((p:any)=>({...p, verifikasi: {...p.verifikasi, left_title: v}}))} />
                              <AdminInput label="Sub-Judul Kiri" value={systemContent.verifikasi.left_subtitle} onChange={(v: string) => setSystemContent((p:any)=>({...p, verifikasi: {...p.verifikasi, left_subtitle: v}}))} />
                              <div className="col-span-2">
                                <AdminTextArea label="Catatan Kiri" value={systemContent.verifikasi.left_note} onChange={(v: string) => setSystemContent((p:any)=>({...p, verifikasi: {...p.verifikasi, left_note: v}}))} />
                              </div>
                              <AdminInput label="Label Footer Kiri" value={systemContent.verifikasi.left_footer_label} onChange={(v: string) => setSystemContent((p:any)=>({...p, verifikasi: {...p.verifikasi, left_footer_label: v}}))} />
                              <AdminInput label="Value Footer Kiri" value={systemContent.verifikasi.left_footer_label_value} onChange={(v: string) => setSystemContent((p:any)=>({...p, verifikasi: {...p.verifikasi, left_footer_label_value: v}}))} />
                              <AdminInput label="Judul Kanan" value={systemContent.verifikasi.right_title} onChange={(v: string) => setSystemContent((p:any)=>({...p, verifikasi: {...p.verifikasi, right_title: v}}))} />
                              <div className="col-span-2">
                                <AdminTextArea label="Paragraf Kanan" value={systemContent.verifikasi.right_paragraph} onChange={(v: string) => setSystemContent((p:any)=>({...p, verifikasi: {...p.verifikasi, right_paragraph: v}}))} />
                                <AdminTextArea label="List Bullet Kanan (Baris Baru)" value={systemContent.verifikasi.right_bullets} onChange={(v: string) => setSystemContent((p:any)=>({...p, verifikasi: {...p.verifikasi, right_bullets: v}}))} />
                              </div>
                              <AdminInput label="Judul Highlight PENTING" value={systemContent.verifikasi.right_highlight_title} onChange={(v: string) => setSystemContent((p:any)=>({...p, verifikasi: {...p.verifikasi, right_highlight_title: v}}))} />
                              <div className="col-span-2">
                                <AdminTextArea label="Teks Highlight PENTING" value={systemContent.verifikasi.right_highlight_text} onChange={(v: string) => setSystemContent((p:any)=>({...p, verifikasi: {...p.verifikasi, right_highlight_text: v}}))} />
                              </div>
                            </div>
                          </AdminGroup>
                        )}
                      </div>

                      <div className="p-8 bg-white/5 rounded-2xl shrink-0">
                        <p className="text-[10px] text-white/20 mb-4 uppercase tracking-widest font-black">Mode Visual Aktif di Halaman (Live Preview)</p>
                        <div className="flex gap-4">
                          {['kesalahan', 'kredit', 'verifikasi'].map(m => (
                            <button key={m} onClick={() => setSystemContent((p:any)=>({...p, visualMode: m}))} className={`px-6 py-2 rounded-lg text-[11px] font-black uppercase tracking-widest ${systemContent.visualMode === m ? 'bg-white text-black' : 'border border-white/10 text-white/40'}`}>
                              {m}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* BANK TAB */}
                  {adminTab === 'bank' && (
                    <div className="space-y-12">
                      <AdminGroup label="Detail Bank Account Card">
                        <div className="grid grid-cols-2 gap-8">
                          <AdminInput label="Nama Bank" value={bankContent.bankName} onChange={(v: string) => setBankContent((p:any)=>({...p, bankName: v}))} />
                          <AdminInput label="Nomor Rekening" value={bankContent.rek} onChange={(v: string) => setBankContent((p:any)=>({...p, rek: v}))} />
                          <AdminInput label="Nama Pemilik" value={bankContent.owner} onChange={(v: string) => setBankContent((p:any)=>({...p, owner: v}))} />
                          <AdminInput label="Status Verifikasi" value={bankContent.status} onChange={(v: string) => setBankContent((p:any)=>({...p, status: v}))} />
                          <AdminInput label="Logo URL" value={bankContent.logo} onChange={(v: string) => setBankContent((p:any)=>({...p, logo: v}))} />
                        </div>
                      </AdminGroup>

                      <AdminGroup label="Kontrol Surat Persetujuan">
                        <div className="grid grid-cols-2 gap-8">
                          <AdminInput label="Sub Judul (Gold)" value={bankContent.certSubtitle} onChange={(v: string) => setBankContent((p:any)=>({...p, certSubtitle: v}))} />
                          <AdminInput label="Judul (Black)" value={bankContent.certTitle} onChange={(v: string) => setBankContent((p:any)=>({...p, certTitle: v}))} />
                          <div className="col-span-2">
                            <AdminTextArea label="Item Persetujuan (Baris Baru)" value={bankContent.certItems} onChange={(v: string) => setBankContent((p:any)=>({...p, certItems: v}))} />
                          </div>
                          <AdminInput label="Status Verifikasi (Teal)" value={bankContent.certStatus} onChange={(v: string) => setBankContent((p:any)=>({...p, certStatus: v}))} />
                          <AdminInput label="Footer (Bottom Right)" value={bankContent.certFooter} onChange={(v: string) => setBankContent((p:any)=>({...p, certFooter: v}))} />
                          <AdminCheckbox label="Paksa Status Terkonfirmasi" value={isConfirmed} onChange={(v: boolean) => {
                            localStorage.setItem('armani_confirmed', v ? 'true' : 'false');
                            setIsConfirmed(v);
                          }} />
                        </div>
                      </AdminGroup>
                    </div>
                  )}

                  {/* PRESET VISUAL */}
                  {adminTab === 'preset' && (
                    <div className="space-y-8">
                      <AdminGroup label="Tema Aktif">
                        <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
                           {[
                             { id: 'IVORY_EXECUTIVE', name: 'Ivory Executive', acc: '#B38B4D', bg: '#faf9f6' },
                             { id: 'ONYX_NOIR', name: 'Onyx Noir', acc: '#FFFFFF', bg: '#0a0a0a' },
                             { id: 'MIDNIGHT_GOLD', name: 'Midnight Gold', acc: '#B38B4D', bg: '#121212' },
                             { id: 'SAPPHIRE_SILVER', name: 'Sapphire Silver', acc: '#8E9EB0', bg: '#f0f4f8' },
                             { id: 'EMERALD_SAGE', name: 'Emerald Sage', acc: '#748E63', bg: '#f5f7f2' },
                             { id: 'ROYAL_BURGUNDY', name: 'Royal Burgundy', acc: '#A67B7B', bg: '#faf7f7' },
                             { id: 'SLATE_MODERN', name: 'Slate Modern', acc: '#64748b', bg: '#f8fafc' },
                             { id: 'COCOA_CREAM', name: 'Cocoa Cream', acc: '#8b5e3c', bg: '#faf6f2' },
                             { id: 'PEARL_MINIMAL', name: 'Pearl Minimal', acc: '#444444', bg: '#ffffff' },
                             { id: 'CHAMPAGEM_ROSE', name: 'Champagne Rose', acc: '#D4AF37', bg: '#fffcf0' },
                             { id: 'PLATINUM_SLATE', name: 'Platinum Slate', accent: '#94a3b8', bg: '#1e293b' },
                             { id: 'DEEP_CARBON', name: 'Deep Carbon', acc: '#f97316', bg: '#0f172a' }
                           ].map(theme => (
                             <button 
                                key={theme.id}
                                onClick={() => (window as any).applyPreset(theme.id)} 
                                className={`group p-6 rounded-[24px] border-4 transition-all flex flex-col items-center gap-4 ${currentThemeId === theme.id ? 'border-[var(--accent)] bg-white/10' : 'border-white/5 bg-black/40 hover:border-white/20'}`}
                             >
                                <div className="flex gap-1">
                                  <div className="w-8 h-8 rounded-full border border-white/10 shadow-xl" style={{ backgroundColor: theme.bg }}></div>
                                  <div className="w-8 h-8 rounded-full border border-white/10 shadow-xl -ml-4" style={{ backgroundColor: theme.acc }}></div>
                                </div>
                                <span className="text-[11px] font-black uppercase tracking-widest text-center text-white/80 group-hover:text-white">{theme.name}</span>
                             </button>
                           ))}
                        </div>
                      </AdminGroup>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// --- HELPERS ---
const AdminGroup = ({ label, children }: any) => (
  <div className="bg-white/[0.03] p-10 rounded-[32px] border border-white/5 space-y-8 mb-10">
    <h4 className="text-[var(--accent)] text-[11px] font-black uppercase tracking-[0.6em] mb-4 border-l-[3px] border-[var(--accent)] pl-6 italic">{label}</h4>
    {children}
  </div>
);

const AdminInput = ({ label, value, type = "text", onChange }: any) => (
  <div className="flex flex-col gap-3 w-full">
    <label className="text-white/20 text-[10px] font-black uppercase tracking-[0.4em] ml-1">{label}</label>
    <input 
      type={type} 
      value={value} 
      onChange={e => onChange(e.target.value)} 
      className="bg-black/60 border border-white/10 rounded-xl p-5 text-white text-[14px] outline-none focus:border-[var(--accent)] focus:ring-4 focus:ring-[var(--accent)]/5 transition-all font-bold" 
    />
  </div>
);

const AdminTextArea = ({ label, value, onChange }: any) => (
  <div className="flex flex-col gap-3 w-full">
    <label className="text-white/20 text-[10px] font-black uppercase tracking-[0.4em] ml-1">{label}</label>
    <textarea 
      value={value} 
      onChange={e => onChange(e.target.value)} 
      rows={4}
      className="bg-black/60 border border-white/10 rounded-xl p-5 text-white text-[14px] outline-none focus:border-[var(--accent)] focus:ring-4 focus:ring-[var(--accent)]/5 transition-all resize-none custom-scrollbar font-bold" 
    />
  </div>
);

const AdminCheckbox = ({ label, value, onChange }: any) => (
  <div className="flex items-center gap-3 w-full">
    <input 
      type="checkbox" 
      checked={value} 
      onChange={e => onChange(e.target.checked)} 
      className="w-5 h-5 accent-[var(--accent)] rounded border-white/10 bg-black/60" 
    />
    <label className="text-white/20 text-[10px] font-black uppercase tracking-[0.4em]">{label}</label>
  </div>
);

export default App;
