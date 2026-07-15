(() => {
  const $ = id => document.getElementById(id);
  const model = (() => { try{return JSON.parse(localStorage.getItem('elevamalta:model') || '{}')}catch(_){return {}} })();
  const e = model.eleva || {};
  const costs = e.costs || {};
  const locale = localStorage.getItem('elevamalta.locale') === 'it' ? 'it' : 'en';
  const eur = value => new Intl.NumberFormat(locale === 'it' ? 'it-IT' : 'en-MT',{style:'currency',currency:'EUR'}).format(Number(value)||0);
  const pct = value => `${new Intl.NumberFormat(locale === 'it' ? 'it-IT' : 'en-MT',{maximumFractionDigits:2}).format(Number(value)||0)}%`;
  const text = locale === 'it' ? {
    title:'Report Guadagni Eleva',back:'Torna al calcolatore',print:'Stampa / Salva PDF',property:'PROPRIETÀ',commission:'Commissione netta annua',profit:'Utile prima delle tasse',net:'Netto Eleva annuo',monthly:'Netto Eleva mensile',revenue:'Ricavi e IVA',pmBase:'Base di calcolo PM',pmRate:'Aliquota commissione PM',commissionRow:'Commissione al netto IVA',vat:'IVA incassata (non è ricavo)',billed:'Totale fatturato incluso IVA',costs:'Costi Eleva annuali',software:'Software / PMS',admin:'Commercialista e amministrazione',marketing:'Marketing',other:'Altri costi operativi',operating:'Totale costi operativi',tax:'Stima fiscale e guadagno netto',taxBase:'Utile prima delle tasse',taxRate:'Aliquota fiscale stimata',taxAmount:'Tasse stimate',ssc:'Class 2 SSC',finalNet:'Netto Eleva annuo',disclaimer:'Stima gestionale interna. Confermare il trattamento fiscale e contributivo con un commercialista maltese.',self:'Self-employed individual',ltd:'Malta Ltd'
  } : {
    title:'Eleva Earnings Report',back:'Back to calculator',print:'Print / Save PDF',property:'PROPERTY',commission:'Net annual commission',profit:'Profit before tax',net:'Eleva annual net',monthly:'Eleva monthly net',revenue:'Revenue and VAT',pmBase:'PM calculation base',pmRate:'PM commission rate',commissionRow:'Commission excluding VAT',vat:'VAT collected (not revenue)',billed:'Total invoiced including VAT',costs:'Eleva annual costs',software:'Software / PMS',admin:'Accounting and administration',marketing:'Marketing',other:'Other operating costs',operating:'Total operating costs',tax:'Tax estimate and net earnings',taxBase:'Profit before tax',taxRate:'Estimated tax rate',taxAmount:'Estimated tax',ssc:'Class 2 SSC',finalNet:'Eleva annual net',disclaimer:'Internal management estimate. Confirm tax and social-security treatment with a Malta accountant.',self:'Self-employed individual',ltd:'Malta Ltd'
  };
  const labels = {reportTitle:'title',backLink:'back',printBtn:'print',propertyLabel:'property',metricCommissionLabel:'commission',metricProfitLabel:'profit',metricNetLabel:'net',metricMonthlyLabel:'monthly',revenueTitle:'revenue',pmBaseLabel:'pmBase',pmRateLabel:'pmRate',commissionLabel:'commissionRow',vatLabel:'vat',billedLabel:'billed',costsTitle:'costs',softwareLabel:'software',adminLabel:'admin',marketingLabel:'marketing',otherLabel:'other',operatingLabel:'operating',taxTitle:'tax',taxBaseLabel:'taxBase',taxRateLabel:'taxRate',taxAmountLabel:'taxAmount',sscLabel:'ssc',finalNetLabel:'finalNet',disclaimer:'disclaimer'};
  Object.entries(labels).forEach(([id,key])=>{if($(id)) $(id).textContent=text[key]});
  document.documentElement.lang = locale;
  document.title = text.title;
  $('reportDate').textContent = new Date(model.dataISO || Date.now()).toLocaleDateString(locale === 'it' ? 'it-IT' : 'en-GB');
  $('propertyName').textContent = [model.indirizzoRiga1,model.indirizzoRiga2].filter(Boolean).join(', ') || '—';
  $('taxStructure').textContent = `${e.taxMode === 'malta-ltd' ? text.ltd : text.self} · ${pct(e.taxRatePct)}`;
  const money = {commissionNet:e.commissionNet,profitBeforeTax:e.profitBeforeTax,netAnnual:e.netAnnual,netMonthly:e.netMonthly,pmBase:e.pmBase,commissionNetRow:e.commissionNet,vatCollected:e.vatCollected,commissionBilled:e.commissionBilled,costSoftware:costs.software,costAdmin:costs.admin,costMarketing:costs.marketing,costOther:costs.other,operatingCosts:e.operatingCosts,taxBase:e.profitBeforeTax,estimatedTax:e.estimatedTax,costSsc:costs.ssc,finalNet:e.netAnnual};
  Object.entries(money).forEach(([id,value])=>{if($(id)) $(id).textContent=eur(value)});
  $('pmRate').textContent = pct(e.pmRatePct);
  $('taxRate').textContent = pct(e.taxRatePct);
})();
