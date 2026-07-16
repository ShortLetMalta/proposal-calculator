/*!
 * i18n.js — minimal IT/EN dictionary + DOM translator + language switcher
 * Loaded BEFORE the page scripts so window.I18N is available everywhere.
 *
 * Public API:
 *   I18N.t(key, params?)              -> translated string
 *   I18N.locale()                     -> 'it' | 'en'
 *   I18N.setLocale('en' | 'it')       -> switch, persist, re-apply, dispatch 'i18n:change'
 *   I18N.apply()                      -> walk [data-i18n] and replace textContent
 *   I18N.applyTo(el)                  -> scope walk to a subtree
 *   I18N.init({ onChange? })          -> set up, apply once, install switcher
 */
(function (global) {
  'use strict';

  // ---- dictionary --------------------------------------------------------
  // Flat key namespace: <area>.<thing>
  const STRINGS = {
    it: {
      // shared
      'common.backToArchive':   '← Torna all\'archivio',
      'common.backToArchiveCalc': '← Torna al calcolatore',
      'common.openCalculator':  'Apri calcolatore',
      'common.refresh':         'Aggiorna elenco',
      'common.save':            'Salva',
      'common.cancel':          'Annulla',
      'common.delete':          'Elimina',
      'common.confirm':         'Conferma',
      'common.required':        'Obbligatorio',
      'common.optional':        'opzionale',
      'common.loading':         'Caricamento…',
      'common.searchPh':        'Cerca…',
      'common.noResults':       'Nessun risultato',

      // nav menu
      'menu.calculator':  'Calcolatore',
      'menu.archive':     'Archivio',
      'menu.properties':  'Proprietà',
      'menu.language':    'Lingua',
      'menu.lang.it':     'Italiano',
      'menu.lang.en':     'English',

      // property scheda
      'property.newTitle':         'Nuova proprietà',
      'property.intro':            'Compila i dati dell\'immobile e del proprietario. Dopo il salvataggio potrai creare prospetti collegati direttamente da questa pagina.',
      'property.sectionData':      'Dati proprietà',
      'property.fieldName':        'Nome proprietà',
      'property.fieldNamePh':      'Es. Tigne Point 12',
      'property.fieldSlug':        'Slug',
      'property.fieldSlugPh':      'tigne-point-12',
      'property.fieldAddress':     'Indirizzo',
      'property.fieldAddressPh':   'Indirizzo completo',
      'property.fieldCity':        'Città',
      'property.fieldCityPh':      'Città',
      'property.fieldOwnerName':   'Nome proprietario',
      'property.fieldOwnerNamePh': 'Nome e cognome',
      'property.fieldOwnerEmail':  'Email proprietario',
      'property.fieldOwnerPhone':  'Telefono proprietario',
      'property.fieldNote':        'Note interne',
      'property.fieldNotePh':      'Note utili sul proprietario o sull\'immobile',
      'property.btnSave':          'Salva proprietà',
      'property.btnNewProspect':   'Crea nuovo prospetto',
      'property.btnDelete':        'Elimina proprietà',
      'property.sectionLinked':    'Prospetti collegati',
      'property.statusSaved':      'Proprietà salvata correttamente.',
      'property.statusUpdated':    'Proprietà aggiornata correttamente.',
      'property.statusLoadErr':    'Errore nel recupero della proprietà.',
      'property.statusDeleteErr':  'Impossibile eliminare la proprietà.',
      'property.statusDeleted':    'Proprietà eliminata correttamente.',
      'property.statusRequiredName': 'Inserisci almeno il nome della proprietà.',
      'property.statusRequiredSlug': 'Inserisci nome o indirizzo per generare lo slug.',
      'property.statusLoading':    'Caricamento proprietà…',
      'property.confirmDelete':    'Eliminare la proprietà "{slug}"? L\'operazione non può essere annullata.',
      'property.detachWarningOne': '\n\nAttenzione: 1 prospetto collegato verrà spostato nella sezione "Prospetti senza proprietà".',
      'property.detachWarningMany':'\n\nAttenzione: {count} prospetti collegati verranno spostati nella sezione "Prospetti senza proprietà".',
      'property.detachOne':        ' 1 prospetto spostato',
      'property.detachMany':       ' {count} prospetti spostati',
      'property.detachSuffix':     ' nella sezione senza proprietà.',
      'property.statusNoDelete':   'Nessuna proprietà da eliminare.',
      'property.statusWasRemoved': 'La proprietà era già stata rimossa.',
      'property.statusSlugMissing':'Slug non trovato per la proprietà da eliminare.',
      'property.statusDeleting':   'Eliminazione proprietà in corso…',
      'property.statusErrLoadList':'Errore nel recupero delle proprietà.',
      'property.statusSavedAs':    'Proprietà selezionata: {name}.',
      'property.statusVanished':   'La proprietà {name} non esiste più.',
      'property.statusTotals':     'Proprietà totali: {count}.',
      'property.statusNoReg':      'Nessuna proprietà registrata.',
      'property.prospectDelConfirm':'Eliminare il prospetto "{slug}"? L\'operazione non può essere annullata.',
      'property.prospectDelStart': 'Eliminazione prospetto in corso...',
      'property.prospectDelDone':  'Prospetto eliminato correttamente.',
      'property.prospectAlreadyDel':'Il prospetto era già stato eliminato.',
      'property.prospectDelErr':   "Errore durante l'eliminazione del prospetto.",
      'property.prospectNoLinked': 'Nessun prospetto collegato.',
      'property.prospectNotFound': 'Prospetto non trovato.',
      'property.prospectLoaded':   'Proprietà caricata.',
      'property.prospectMissing':  'Proprietà non trovata.',
      'property.statusInvalidSlug':'Slug non valido.',
      'property.statusSaving':     'Salvataggio in corso...',
      'property.statusSaveErrFallback':'richiesta non riuscita',
      'property.statusSaveErr':    'Errore durante il salvataggio: {msg}',
      'property.statusDelStart':   'Eliminazione in corso...',
      'property.statusAlreadyDel': 'Proprietà già rimossa.',
      'property.statusSlugGenOk':  'Slug generato.',
      'property.statusProspectDelStart': 'Eliminazione del prospetto "{slug}" in corso...',
      'property.statusProspectSlugMissing':'Slug non trovato per il prospetto da eliminare.',
      'property.statusProspectNotFound':'Prospetto non trovato.',
      'property.errProspectDelete':'Errore durante l\'eliminazione del prospetto.',

      // archive
      'archive.title':            'Archivio Proprietà',
      'archive.intro':            'Seleziona una proprietà per filtrare i prospetti salvati oppure apri la scheda dedicata per gestire i dettagli dell\'immobile.',
      'archive.labelProperty':    'Proprietà',
      'archive.optionAll':        'Tutte le proprietà',
      'archive.btnOpenProperty':  'Apri scheda',
      'archive.labelSearch':      'Ricerca prospetti',
      'archive.searchPh':         'Titolo, indirizzo o slug',
      'archive.sectionProspects': 'Prospetti salvati',
      'archive.noProperties':     'Nessuna proprietà salvata.',
      'archive.noPropertiesReg':  'Nessuna proprietà registrata.',
      'archive.optionNone':       'Nessuna proprietà',
      'archive.labelLink':        'Proprietà',
      'archive.labelAssign':      'Associa a proprietà',
      'archive.noPropertySection':'Prospetti senza proprietà',
      'archive.noOwner':          'Nessun dato proprietario',
      'archive.statusNotFound':   'La proprietà "{name}" non esiste.',
      'archive.statusErrLoad':    'Errore nel recupero delle proprietà.',
      'archive.statusLoading':    'Carricamento proprietà…',
      'archive.statusDeleteIn':   'Eliminazione proprietà in corso…',
      'archive.statusDeleted':    'Proprietà eliminata correttamente.',
      'archive.statusErrDelete':  'Impossibile eliminare la proprietà.',
      'archive.detachWarnOne':    '\n\nAttenzione: 1 prospetto collegato verrà spostato nella sezione "Prospetti senza proprietà".',
      'archive.detachWarnMany':   '\n\nAttenzione: {count} prospetti collegati verranno spostati nella sezione "Prospetti senza proprietà".',
      'archive.confirmDelete':    'Eliminare la proprietà "{slug}"? L\'operazione non può essere annullata.',
      'archive.detachSuffix':     ' nella sezione senza proprietà.',
      'archive.detachOne':        ' 1 prospetto spostato',
      'archive.detachMany':       ' {count} prospetti spostati',
      'archive.statusSelected':   'Proprietà selezionata: {name}.',
      'archive.statusMissing':    'La proprietà {name} non esiste più.',
      'archive.statusTotals':     'Proprietà totali: {count}.',
      'archive.statusProspFor':   'Prospetti per {name}: {count}.',
      'archive.statusNoneAssigned':'Nessun prospetto assegnato a {name}.',
      'archive.statusFoundProsp': 'Trovati {count} prospetti salvati.',
      'archive.statusNoProsp':    'Nessun prospetto salvato.',
      'archive.statusLoading':    'Caricamento...',
      'archive.statusErrProps':   'Errore nel recupero delle proprietà.',
      'archive.statusErrProsp':   'Errore nel recupero dei prospetti.',
      'archive.statusLoadingProps':'Caricamento proprietà...',
      'archive.statusLoadingProsp':'Caricamento prospetti...',
      'archive.prospectDelConfirm':'Eliminare il prospetto "{slug}"? L\'operazione non può essere annullata.',
      'archive.prospectDelStart': 'Eliminazione prospetto in corso...',
      'archive.prospectAlreadyDel':'Il prospetto era già stato eliminato.',
      'archive.prospectDelDone':  'Prospetto eliminato correttamente.',
      'archive.prospectDelErr':   "Errore durante l'eliminazione del prospetto.",
      'archive.propertyDelConfirm':'Eliminare la proprietà "{slug}"? L\'operazione non può essere annullata.',
      'archive.propertyDelStart': 'Eliminazione proprietà in corso...',
      'archive.propertyAlreadyDel':'La proprietà era già stata rimossa.',
      'archive.propertyDelDone':  'Proprietà eliminata correttamente.',
      'archive.propertyDelErr':   'Impossibile eliminare la proprietà.',
      'archive.statusRefreshing': 'Aggiornamento in corso...',
      'archive.statusProspUpdated':'Prospetto aggiornato correttamente.',
      'archive.statusProspUpdateErr':"Errore durante l'aggiornamento del prospetto.",
      'archive.statusSlugMissingDel':'Slug non trovato per la proprietà da eliminare.',
      'archive.statusDeletingProp': 'Eliminazione di "{slug}" in corso...',
      'archive.statusSlugMissingProsp':'Slug non trovato per il prospetto da eliminare.',
      'archive.statusDeletingProsp': 'Eliminazione del prospetto "{slug}" in corso...',
      'archive.prospectDelSingle': 'Eliminare il prospetto "{slug}"? L\'operazione non può essere annullata.',
      'archive.cardProp':         'Proprietà',
      'archive.cardAddress':      'Indirizzo',
      'archive.cardUpdated':      'Aggiornato',
      'archive.cardAssign':       'Associa a proprietà',
      'archive.cardUpdate':       'Aggiorna',
      'archive.cardCalc':         'Apri nel calcolatore',
      'archive.cardPrint':        'Apri e stampa',
      'archive.cardDelete':       'Elimina',
      'archive.cardNoProsp':      'Nessun prospetto salvato.',
      'archive.cardEmpty':        'Nessuna proprietà salvata.',
      'archive.cardNoReg':        'Nessuna proprietà registrata.',
      'archive.cardProspectOne':  '1 prospetto',
      'archive.cardProspectMany': '{count} prospetti',
      'archive.quickAssign':      'Assegna a {name}',
      'archive.statusNoMatch':    'Nessun prospetto corrisponde alla ricerca "{term}".',
      'archive.cardProspFor':     'Prospetti per {name}',
      'archive.statusNoUnassigned':'Nessun prospetto non assegnato.',
      'archive.statusNoAddress':  'Indirizzo non impostato',

      // calculator — top bar
      'calc.title':               'Calcolatore Prospetti · Eleva Malta',
      'calc.documentProspect':    'Prospetto: {address}',
      'calc.vatShort':            'IVA',
      'calc.perBooking':          'per prenotazione',
      'calc.h1':                  'Simulatore di Utile Netto Annuale',
      'calc.formula':             'Formula: <b>Base fiscale proprietario = Ricavo Lordo Totale</b>, prima di commissioni e costi. Il PM si calcola sulla base selezionata sotto. Le commissioni OTA si applicano su <b>Affitti + Pulizie + Assicurazione</b>.',

      // prospect manager
      'calc.prospectManagerTitle':'Gestione Prospetti',
      'calc.prospectManagerNote': 'Salva le configurazioni nel backend e gestiscile dall\'<a href="pages/archivio/index.html" target="_blank" rel="noopener" data-append-api-link>Archivio Proprietà</a>.',
      'calc.linkedProperty':      'Proprietà collegata',
      'calc.noProperty':          'Nessuna proprietà',
      'calc.btnCreateProperty':  'Crea scheda proprietà',
      'calc.btnOpenProperty':     'Apri scheda proprietà',
      'calc.btnRefreshProperties':'Aggiorna elenco proprietà',
      'calc.savedProspect':      'Prospetto salvato',
      'calc.selectProspect':     '— Seleziona —',
      'calc.fieldSlug':           'Slug',
      'calc.slugPh':              'triq-it-torri',
      'calc.btnAuto':             'Auto',
      'calc.fieldTitle':          'Titolo',
      'calc.titlePh':             'Titolo prospetto',
      'calc.btnSaveProspect':     'Salva / Aggiorna',
      'calc.btnApplyProspect':    'Applica dati al calcolatore',
      'calc.btnNew':              'Nuovo',
      'calc.btnOpenArchive':      'Apri archivio',
      'calc.errLoadProperties':   'Errore caricamento proprietà',
      'calc.errPropertyListPrefill':'Errore nel prefill della proprietà',
      'calc.warnOpenProperty':    'Seleziona una proprietà collegata per aprire la scheda.',
      'calc.refreshingProps':     'Aggiornamento elenco proprietà in corso…',
      'calc.refreshedProps':      'Elenco proprietà aggiornato.',
      'calc.refreshedPropsInfo':  'aggiornamento delle proprietà.',

      // prospect manager status
      'calc.prospectNewInfo':     'Modulo pronto per un nuovo prospetto',
      'calc.prospectListLoading': 'Caricamento elenco prospetti...',
      'calc.prospectListFound':   'Trovati {count} prospetti salvati{suffix}',
      'calc.prospectListNone':    'Nessun prospetto salvato{suffix}',
      'calc.prospectListErr':     "Errore nel caricare l'elenco dei prospetti",
      'calc.prospectLoading':     'Caricamento prospetto...',
      'calc.prospectLoaded':      'Prospetto caricato. Usa "Applica dati" per ripristinare i valori.',
      'calc.prospectLoadErr':     'Errore nel caricare il prospetto selezionato',
      'calc.prospectNeedAddr':    'Inserisci un indirizzo o un titolo per generare lo slug',
      'calc.prospectSlugConflict':'Lo slug del prospetto coincide con quello di una proprietà esistente. Modificalo prima di salvare.',
      'calc.prospectSaving':      'Salvataggio in corso...',
      'calc.prospectSaved':       'Prospetto salvato correttamente',
      'calc.prospectSaveErr':     'Errore durante il salvataggio del prospetto: {msg}',
      'calc.prospectSaveErrFallback':'richiesta non riuscita',
      'calc.prospectApplyPick':   'Seleziona prima un prospetto da applicare',
      'calc.prospectApplied':     'Dati applicati al calcolatore',
      'calc.prospectNoData':      'Il prospetto non contiene dati del calcolatore salvati',
      'calc.prospectSlugAutoInfo':'Inserisci un titolo o un indirizzo per generare lo slug',
      'calc.prospectSlugAutoOk':  'Slug aggiornato automaticamente',
      'calc.prospectNotFound':    'Il prospetto richiesto non è stato trovato.',
      'calc.prospectDatiJsonWarn':'Impossibile leggere datiJson del prospetto',
      'calc.prospectFormStateWarn':'Impossibile leggere formState salvato',
      'calc.prospectLoadedInfo':  'Prospetto caricato. Usa "Applica dati" per ripristinare i valori.',
      'calc.prospectSlugAdjusted':'Slug già utilizzato da una proprietà. Impostato automaticamente su "{slug}".',

      // section 0
      'calc.s0Title':             '0) Dati per il Report',
      'calc.s0Addr1':             'Indirizzo — Riga 1',
      'calc.s0Addr1Ph':           'Triq it-Torri',
      'calc.s0Addr2':             'Indirizzo — Riga 2',
      'calc.s0Addr2Ph':           'Sliema',
      'calc.s0Date':              'Data (ISO, opzionale)',

      // section 1
      'calc.s1Title':             '1) Stima Ricavi & Volume',
      'calc.s1Adr':               'Prezzo Medio a Notte (€)',
      'calc.s1Occ':               'Occupazione Annuale (%)',
      'calc.s1Days':              'Giorni Occupati Stimati',

      // section 2a
      'calc.s2aTitle':            '2a) Parametri per Soggiorno',
      'calc.s2aStay':             'Durata media soggiorno (notti)',
      'calc.s2aClean':            'Pulizie e Nolleggio Biancheria (€) per soggiorno',
      'calc.s2aKit':              'Welcome kit per soggiorno (€)',
      'calc.s2aIns':              'Protezione per prenotazione con guest screening Truvi',
      'calc.insNone':             '— Nessuna assicurazione —',
      'calc.insScreening':        'Truvi Guest Screening + Protezione danni (fino a €500) — €20,10 / prenotazione',
      'calc.insDamage':           'Truvi Guest Screening + Protezione danni (fino a €50K) — €28,75 / prenotazione',
      'calc.insTruviNote':        'Guest screening fornito da <a href="https://truvi.com" target="_blank" rel="noopener">Truvi</a>, incluso nei piani di protezione a pagamento.',

      // section 2b
      'calc.s2bTitle':            '2b) Totali annui (pulizie, kit & assicurazione)',
      'calc.s2bAuto':             'Calcola automaticamente dai soggiorni',
      'calc.s2bEstStays':         'Soggiorni stimati',
      'calc.s2bCleanYear':        'Pulizie annue (da soggiorni)',
      'calc.s2bKitYear':          'Kit annuo (da soggiorni)',
      'calc.s2bInsYear':          'Assicurazione annua (da soggiorni)',
      'calc.s2bCleanManual':      'Pulizie totali annue (€)',
      'calc.s2bKitManual':        'Welcome Kit annuo (€)',
      'calc.s2bInsManual':        'Assicurazione annua manuale (€)',
      'calc.s2bManualNote':       'Se disattivi il toggle, puoi impostare manualmente pulizie e kit annui. L\'assicurazione resta calcolata in base all\'importo per prenotazione.',

      // section 3
      'calc.s3Title':             '3) Utenze & Amministrazione',
      'calc.s3Months':            'Mesi considerati',
      'calc.s3MonthsNote':        'Inserisci importi mensili: verranno moltiplicati per il numero di mesi indicato.',
      'calc.s3Light':             'Luce e Gas<br> (€/mese)',
      'calc.s3Wifi':              'Wi-Fi / Internet<br> (€/mese)',
      'calc.s3Admin':             'Amministrazione<br> (€/mese)',
      'calc.s3Water':             'Acqua<br> (€/mese)',
      'calc.s3MtaLicence':        'Licenza MTA (mensilizzata)<br> (€/mese)',
      'calc.s3MtaLicenceNote':    'Licenza MTA: ~€130/anno per unità a Malta, mensilizzata qui su 12 mesi. Verifica l\'importo esatto e la cadenza di rinnovo sul sito della Malta Tourism Authority.',
      'calc.s3AddBtn':            '+ Aggiungi costo fisso extra mensile',

      // section 4
      'calc.s4Title':             '4) Commissioni',
      'calc.s4Ota':               'Commissioni OTA (%) <br>(Airbnb e Booking)',
      'calc.s4Pm':                'Commissione PM (% + IVA)',
      'calc.s4TaxMode':           'Regime fiscale del proprietario',
      'calc.s4TaxArticle31d':     'Article 31D — imposta finale 15% sul lordo',
      'calc.s4TaxCustom':         'Aliquota personalizzata sul lordo (default 0%)',
      'calc.s4Cedolare':          'Aliquota fiscale proprietario sul lordo (%)',
      'calc.s4BasePm':            'Base PM calcolata come',
      'calc.s4BaseOta':           'Lordo − OTA (default)',
      'calc.s4BaseCleanOta':      'Lordo − Pulizie − OTA',
      'calc.s4BaseCleanInsOta':  'Lordo − Pulizie − Assicurazione − OTA',
      'calc.s4VatOwner':          'IVA sulla commissione fatturata al proprietario (%)',

      // section 5
      'calc.s5Title':             '5) Abbonamenti',
      'calc.s5RingSub':           'Ring Intercom — abbonamento mensile (€)',
      'calc.s5RingTotal':         'Totale Ring Annuale',
      'calc.s5Setup':             'Setup',
      'calc.s5Sub12':             'Abbonamento (12 mesi)',
      'calc.s5RingTotalLabel':    'Totale Ring',
      'calc.s6Title':             '6) Costi di Start-up',
      'calc.s6RingSetup':         'Ring Intercom — setup una tantum (€)',
      'calc.s6CostLabel':         'Costo (€)',
      'calc.s6Kit':               'Kit Sicurezza<br>(Estintore, rilevatore fumo, monossido di carbonio, gas combustibile)',
      'calc.s6ExtrasTitle':       'Altre spese extra una tantum (opzionali)',
      'calc.s6ExtrasDesc':        'Descrizione',
      'calc.s6ExtrasAmt':         'Importo (€)',
      'calc.s6Remove':            'Rimuovi',
      'calc.s6AddExtra':          '+ Aggiungi spesa extra',
      'calc.s6AddExtraPh':        'Spesa Extra',

      // extras opzionali
      'calc.optTitle':            'Spese Extra Opzionali',
      'calc.optInclude':          'Includi nel prospetto',
      'calc.optAdd':              '+ Aggiungi spesa extra opzionale',
      'calc.optPh':               'Spesa Extra Opzionale',
      'calc.optNote':             'OPZIONALE',

      // section 7
      'calc.s7Title':             '7) Punti di Forza',
      'calc.s7Punti':             'Punti di forza (una riga per punto)',
      'calc.s7Default':           '- Ottima connettività con i mezzi pubblici.\n- Alta domanda turistica nel quartiere.\n- Immobile ristrutturato e pronto all\'uso.',

      // summary
      'calc.summary':             'Riepilogo',
      'calc.sumLordoPren':        'Ricavo Lordo Prenotazioni',
      'calc.sumClean':            'Pulizie',
      'calc.sumIns':              'Assicurazione',
      'calc.sumLordoTot':         'Ricavo Lordo Totale<br> (Affitti + Pulizie + Assicurazione)',
      'calc.basePmOta':           'Base PM<br> (Lordo - OTA)',
      'calc.basePmCleanOta':      'Base PM<br> (Lordo - Pulizie - OTA)',
      'calc.basePmCleanInsOta':   'Base PM<br> (Lordo - Pulizie - Assicurazione - OTA)',
      'calc.basisOta':            'su Fatturato Lordo − OTA',
      'calc.basisCleanOta':       'su Fatturato Lordo − Pulizie − OTA',
      'calc.basisCleanInsOta':    'su Fatturato Lordo − Pulizie − Assicurazione − OTA',
      'calc.sumKit':              'Welcome Kit',
      'calc.sumOta':              'Commissioni OTA<br>(Airbnb e Booking) (<span id="percOtaOutput">0%</span>)',
      'calc.sumBasePm':           'Base PM<br> (Lordo - Pulizie - Assicurazione - OTA)',
      'calc.sumIvaPm':            'IVA su PM (<span id="percIvaPmOutput">0%</span>)',
      'calc.sumCostoPm':          'Costo PM + IVA (<span id="percPmOutput">0%</span>)',
      'calc.sumUtenze':           'Utenze Totali (annue)',
      'calc.sumRingSetup':        'Ring — setup',
      'calc.sumRingSub':          'Ring — abbonamento (12 mesi)',
      'calc.sumBaseImp':          'Base Imponibile (Tassa Affitti)',
      'calc.sumImposta':          'Tassa sugli Affitti (<span id="percCedolareOutput">0%</span>)',
      'calc.sumUtileAnno':        'UTILE NETTO ANNUALE',
      'calc.sumUtileMese':        'Mensile',
      'calc.btnUpdateReport':     'Aggiorna Report (Embed 2)',
      'calc.reportNote':          'Il report (Embed 2) si aggiorna anche in automatico ad ogni modifica.',

      // Eleva admin
      'calc.elevaTaxMode':        'Struttura fiscale Eleva',
      'calc.elevaTaxSelf':        'Self-employed individual — riserva fiscale 25% (default)',
      'calc.elevaTaxLtd':         'Malta Ltd — corporate tax headline 35%',
      'calc.ovIres':              'Aliquota fiscale Eleva stimata (%)',
      'calc.elevaSoftware':       'Software / PMS Eleva (annuo €)',
      'calc.elevaAdmin':          'Commercialista e amministrazione (annuo €)',
      'calc.elevaMarketing':      'Marketing Eleva (annuo €)',
      'calc.elevaOther':          'Altri costi Eleva (annuo €)',
      'calc.elevaSsc':            'Class 2 SSC stimati (annuo €)',
      'calc.elevaCostsTotal':     'Costi operativi Eleva (annui)',
      'calc.elevaTaxBase':        'Utile Eleva prima delle tasse',
      'calc.btnElevaPdf':         'Apri PDF guadagni Eleva',
      'calc.ovComm':              'Commissione Eleva (annua)',
      'calc.ovTasse':             'Tasse Eleva (stima)',
      'calc.ovNettoAnno':         'Netto Eleva (annuo)',
      'calc.ovNettoMese':         'Netto Eleva (mensile)',
      'calc.ovNettoNote':         'Self-employed: riserva modificabile basata sulle aliquote personali progressive; inserisci i Class 2 SSC separatamente. Malta Ltd: il 35% è la corporate tax headline; l\'eventuale shareholder refund non è anticipato nel calcolo.',

      // toolbar / print
      'calc.btnPrint':            'Stampa / PDF',

      // PDF report
      'pdf.p1Title':              'Proposta di<br>Gestione',
      'pdf.p1Subtitle':           'offerta per l\'immobile sito in',
      'pdf.p2Title':              'Perché affidarsi a <br>Eleva Malta?',
      'pdf.p2P1':                 'Siamo una realtà specializzata nella gestione professionale degli affitti brevi turistici a Malta.',
      'pdf.p2P2':                 'Conosciamo in profondità il mercato locale e le dinamiche delle piattaforme di prenotazione come Airbnb e Booking: ottimizziamo annunci, pricing e revenue management per garantire il <b>massimo rendimento</b> ai proprietari.',
      'pdf.p2P3':                 'Coordiniamo <b>pulizie e biancheria</b> con partner certificati, gestiamo <b>check-in/check-out smart</b> e presidiamo ogni <b>adempimento amministrativo e fiscale</b>.',
      'pdf.p2P4':                 'Affidarvi a Eleva Malta significa una gestione completa, trasparente e orientata ai risultati: voi godete dei profitti, noi pensiamo a tutto il resto.',
      'pdf.p3Title':              'I nostri servizi e le<br>nostre garanzie',
      'pdf.svc1':                 'Creazione annuncio professionale e pubblicazione sui maggiori siti <br>OTA (Online Travel Agencies) come Airbnb, Booking',
      'pdf.svc2':                 'Servizio fotografico professionale per valorizzare la casa',
      'pdf.svc3':                 'Pulizia e noleggio biancheria',
      'pdf.svc4':                 'Manutenzione ordinaria e straordinaria',
      'pdf.svc5':                 'Marketing online per aumentare le prenotazioni extra-OTA',
      'pdf.svc6':                 'Completa gestione amministrativa: Licenza MTA, registrazione ospiti, Environmental Contribution',
      'pdf.svc7':                 'Guest screening e protezione danni con copertura assicurativa per ogni prenotazione coperta',
      'pdf.p4Title':              'Descrizione dell\'appartamento',
      'pdf.p4Punti':              'Punti di forza:',
      'pdf.p5Title':              'Previsioni',
      'pdf.p5Stat':               'Statistiche',
      'pdf.p5Occ':                'Tasso di occupazione medio',
      'pdf.p5Adr':                'Media affitto giornaliera',
      'pdf.p5Lordo':              'Reddito lordo stimato',
      'pdf.p5Fatt':               'Fatturato Lordo Annuo',
      'pdf.p5FattNote':           'Per "fatturato lordo annuo" si intende quanto ricevuto dalle piattaforme o prenotazioni dirette ({items}).',
      'pdf.p5FattNoteRent':       'affitti',
      'pdf.p5FattNoteCleaning':   'pulizie',
      'pdf.p5FattNoteInsurance':  'assicurazione',
      'pdf.p6Title':              'Previsioni di Spesa',
      'pdf.p6Pulizie':            'Pulizie / Noleggio biancheria',
      'pdf.p6Assicurazione':      'Assicurazione per soggiorno',
      'pdf.p6Kit':                'Welcome Kit (annuo)',
      'pdf.p6Utenze':             'Utenze',
      'pdf.p6UtenzeAdmin':        'Costi Immobile (Utenze, amministrazione{wifi})',
      'pdf.p6UtenzeWifi':         ', WIFI',
      'pdf.p6Ota':                'Commissioni OTA <br>(Airbnb e Booking)',
      'pdf.p6OtaSub':             '(<span id="p6-ota-percent"></span> su affitti + pulizie + assicurazione)',
      'pdf.p6OtaSubNoIns':        '(<span id="p6-ota-percent"></span> su affitti + pulizie)',
      'pdf.ringPerMonth':         '<br><span style="font-weight:400;font-size:0.95em">{amount} al mese di abbonamento</span>',
      'pdf.p6Pm':                 'Commissione Eleva Malta',
      'pdf.p6PmSub':              '(<span id="p6-pm-pct">—</span>)',
      'pdf.p6RingAnnual':         'Ring Intercom — abbonamento (annuo)',
      'pdf.p6Cedolare':           'Tassazione del proprietario',
      'pdf.p6CedolareSub':        '(<span id="p6-cedolare-percent">—</span> sul ricavo lordo totale, prima di commissioni e costi)',
      'pdf.p6Totale':             'Totale Spese',
      'pdf.p7Title':              'Costi di Start-up',
      'pdf.p6RingSetup':          'Ring Intercom – setup (una tantum)',
      'pdf.p6Una':                'Kit Sicurezza<br>(Estintore, rilevatore fumo, monossido di carbonio, gas combustibile)',
      'pdf.p6TotaleStartup':      'Totale Costi di Start-up (una tantum)',
      'pdf.p7UtileTitle':         'Utile Lordo e Netto',
      'pdf.p7UtileLordo':         'Utile Lordo Annuo',
      'pdf.p7UtileNetto':         'Utile Netto Annuo',
      'pdf.p7MensileNetto':       'Mensile Netto: ',
      'pdf.p7TaxNote':            '*La tassazione del proprietario viene stimata sul ricavo lordo totale, prima delle spese di pulizia, commissioni OTA e commissioni di gestione Eleva.',
      'pdf.p7EstimatesP1':        'Queste stime sono basate su un\'analisi di appartamenti simili, che tiene conto di un primo anno iniziale in cui si deve costruire la reputazione positiva sui siti. I risultati, sia in termini di tariffa media a notte che di tasso di occupazione, sono quindi <span style="color:#c9a96e; font-style:italic;">potenzialmente incrementabili a partire dal secondo anno.</span>',
      'pdf.p7EstimatesP2':        'Si intende che in nessun modo sono garanzia di un risultato futuro, ma come Società di Affitti Brevi la nostra missione è quella di <span style="font-weight:700;">massimizzare il vostro guadagno, ridurre i costi e ottimizzare la gestione.</span>',
    },

    en: {
      // shared
      'common.backToArchive':   '← Back to archive',
      'common.backToArchiveCalc': '← Back to calculator',
      'common.openCalculator':  'Open calculator',
      'common.refresh':         'Refresh list',
      'common.save':            'Save',
      'common.cancel':          'Cancel',
      'common.delete':          'Delete',
      'common.confirm':         'Confirm',
      'common.required':        'Required',
      'common.optional':        'optional',
      'common.loading':         'Loading…',
      'common.searchPh':        'Search…',
      'common.noResults':       'No results',

      // nav menu
      'menu.calculator':  'Calculator',
      'menu.archive':     'Archive',
      'menu.properties':  'Properties',
      'menu.language':    'Language',
      'menu.lang.it':     'Italiano',
      'menu.lang.en':     'English',

      // property scheda
      'property.newTitle':         'New property',
      'property.intro':            'Fill in the property and owner details. After saving, you can create linked prospects directly from this page.',
      'property.sectionData':      'Property details',
      'property.fieldName':        'Property name',
      'property.fieldNamePh':      'e.g. Tigne Point 12',
      'property.fieldSlug':        'Slug',
      'property.fieldSlugPh':      'tigne-point-12',
      'property.fieldAddress':     'Address',
      'property.fieldAddressPh':   'Full address',
      'property.fieldCity':        'City',
      'property.fieldCityPh':      'City',
      'property.fieldOwnerName':   'Owner name',
      'property.fieldOwnerNamePh': 'First and last name',
      'property.fieldOwnerEmail':  'Owner email',
      'property.fieldOwnerPhone':  'Owner phone',
      'property.fieldNote':        'Internal notes',
      'property.fieldNotePh':      'Useful notes about the owner or the property',
      'property.btnSave':          'Save property',
      'property.btnNewProspect':   'Create new prospect',
      'property.btnDelete':        'Delete property',
      'property.sectionLinked':    'Linked prospects',
      'property.statusSaved':      'Property saved successfully.',
      'property.statusUpdated':    'Property updated successfully.',
      'property.statusLoadErr':    'Error loading the property.',
      'property.statusDeleteErr':  'Could not delete the property.',
      'property.statusDeleted':    'Property deleted successfully.',
      'property.statusRequiredName': 'Please enter at least the property name.',
      'property.statusRequiredSlug': 'Enter a name or address to generate the slug.',
      'property.statusLoading':    'Loading property…',
      'property.confirmDelete':    'Delete property "{slug}"? This action cannot be undone.',
      'property.detachWarningOne': '\n\nWarning: 1 linked prospect will be moved to the "Prospects without property" section.',
      'property.detachWarningMany':'\n\nWarning: {count} linked prospects will be moved to the "Prospects without property" section.',
      'property.detachOne':        ' 1 prospect moved',
      'property.detachMany':       ' {count} prospects moved',
      'property.detachSuffix':     ' to the without-property section.',
      'property.statusNoDelete':   'No property to delete.',
      'property.statusWasRemoved': 'The property had already been removed.',
      'property.statusSlugMissing':'No slug found for the property to delete.',
      'property.statusDeleting':   'Deleting property…',
      'property.statusErrLoadList':'Error fetching properties.',
      'property.statusSavedAs':    'Property selected: {name}.',
      'property.statusVanished':   'Property {name} no longer exists.',
      'property.statusTotals':     'Total properties: {count}.',
      'property.statusNoReg':      'No properties registered.',
      'property.prospectDelConfirm':'Delete prospect "{slug}"? This action cannot be undone.',
      'property.prospectDelStart': 'Deleting prospect…',
      'property.prospectDelDone':  'Prospect deleted successfully.',
      'property.prospectAlreadyDel':'The prospect had already been deleted.',
      'property.prospectDelErr':   "Error deleting the prospect.",
      'property.prospectNoLinked': 'No linked prospect.',
      'property.prospectNotFound': 'Prospect not found.',
      'property.prospectLoaded':   'Property loaded.',
      'property.prospectMissing':  'Property not found.',
      'property.statusInvalidSlug':'Invalid slug.',
      'property.statusSaving':     'Saving…',
      'property.statusSaveErrFallback':'request failed',
      'property.statusSaveErr':    'Error while saving: {msg}',
      'property.statusDelStart':   'Deleting…',
      'property.statusAlreadyDel': 'Property already removed.',
      'property.statusSlugGenOk':  'Slug generated.',
      'property.statusProspectDelStart': 'Deleting prospect "{slug}"…',
      'property.statusProspectSlugMissing':'No slug found for the prospect to delete.',
      'property.statusProspectNotFound':'Prospect not found.',
      'property.errProspectDelete':'Error deleting the prospect.',

      // archive
      'archive.title':            'Property Archive',
      'archive.intro':            'Pick a property to filter the saved prospects, or open its dedicated card to manage the property details.',
      'archive.labelProperty':    'Property',
      'archive.optionAll':        'All properties',
      'archive.btnOpenProperty':  'Open card',
      'archive.labelSearch':      'Search prospects',
      'archive.searchPh':         'Title, address or slug',
      'archive.sectionProspects': 'Saved prospects',
      'archive.noProperties':     'No property saved.',
      'archive.noPropertiesReg':  'No property registered.',
      'archive.optionNone':       'No property',
      'archive.labelLink':        'Property',
      'archive.labelAssign':      'Assign to property',
      'archive.noPropertySection':'Prospects without property',
      'archive.noOwner':          'No owner data',
      'archive.statusNotFound':   'Property "{name}" does not exist.',
      'archive.statusErrLoad':    'Error fetching properties.',
      'archive.statusLoading':    'Loading properties…',
      'archive.statusDeleteIn':   'Deleting property…',
      'archive.statusDeleted':    'Property deleted successfully.',
      'archive.statusErrDelete':  'Could not delete the property.',
      'archive.detachWarnOne':    '\n\nWarning: 1 linked prospect will be moved to the "Prospects without property" section.',
      'archive.detachWarnMany':   '\n\nWarning: {count} linked prospects will be moved to the "Prospects without property" section.',
      'archive.confirmDelete':    'Delete property "{slug}"? This action cannot be undone.',
      'archive.detachSuffix':     ' to the without-property section.',
      'archive.detachOne':        ' 1 prospect moved',
      'archive.detachMany':       ' {count} prospects moved',
      'archive.statusSelected':   'Property selected: {name}.',
      'archive.statusMissing':    'Property {name} no longer exists.',
      'archive.statusTotals':     'Total properties: {count}.',
      'archive.statusProspFor':   'Prospects for {name}: {count}.',
      'archive.statusNoneAssigned':'No prospect assigned to {name}.',
      'archive.statusFoundProsp': 'Found {count} saved prospects.',
      'archive.statusNoProsp':    'No saved prospect.',
      'archive.statusLoading':    'Loading…',
      'archive.statusErrProps':   'Error fetching properties.',
      'archive.statusErrProsp':   'Error fetching prospects.',
      'archive.statusLoadingProps':'Loading properties…',
      'archive.statusLoadingProsp':'Loading prospects…',
      'archive.prospectDelConfirm':'Delete prospect "{slug}"? This action cannot be undone.',
      'archive.prospectDelStart': 'Deleting prospect…',
      'archive.prospectAlreadyDel':'The prospect had already been deleted.',
      'archive.prospectDelDone':  'Prospect deleted successfully.',
      'archive.prospectDelErr':   "Error deleting the prospect.",
      'archive.propertyDelConfirm':'Delete property "{slug}"? This action cannot be undone.',
      'archive.propertyDelStart': 'Deleting property…',
      'archive.propertyAlreadyDel':'The property had already been removed.',
      'archive.propertyDelDone':  'Property deleted successfully.',
      'archive.propertyDelErr':   'Could not delete the property.',
      'archive.statusRefreshing': 'Refreshing…',
      'archive.statusProspUpdated':'Prospect updated successfully.',
      'archive.statusProspUpdateErr':"Error updating the prospect.",
      'archive.statusSlugMissingDel':'No slug found for the property to delete.',
      'archive.statusDeletingProp': 'Deleting "{slug}"…',
      'archive.statusSlugMissingProsp':'No slug found for the prospect to delete.',
      'archive.statusDeletingProsp': 'Deleting prospect "{slug}"…',
      'archive.prospectDelSingle': 'Delete prospect "{slug}"? This action cannot be undone.',
      'archive.cardProp':         'Property',
      'archive.cardAddress':      'Address',
      'archive.cardUpdated':      'Updated',
      'archive.cardAssign':       'Assign to property',
      'archive.cardUpdate':       'Update',
      'archive.cardCalc':         'Open in calculator',
      'archive.cardPrint':        'Open and print',
      'archive.cardDelete':       'Delete',
      'archive.cardNoProsp':      'No saved prospect.',
      'archive.cardEmpty':        'No property saved.',
      'archive.cardNoReg':        'No property registered.',
      'archive.cardProspectOne':  '1 prospect',
      'archive.cardProspectMany': '{count} prospects',
      'archive.quickAssign':      'Assign to {name}',
      'archive.statusNoMatch':    'No prospect matches the search "{term}".',
      'archive.cardProspFor':     'Prospects for {name}',
      'archive.statusNoUnassigned':'No unassigned prospect.',
      'archive.statusNoAddress':  'Address not set',

      // calculator — top bar
      'calc.title':               'Proposal Calculator · Eleva Malta',
      'calc.documentProspect':    'Prospect: {address}',
      'calc.vatShort':            'VAT',
      'calc.perBooking':          'per booking',
      'calc.h1':                  'Annual Net Profit Simulator',
      'calc.formula':             'Formula: <b>Owner tax base = Total Gross Revenue</b>, before commissions and costs. PM is calculated using the basis selected below. OTA commissions apply to <b>Rent + Cleaning + Insurance</b>.',

      // prospect manager
      'calc.prospectManagerTitle':'Prospect Management',
      'calc.prospectManagerNote': 'Save configurations in the backend and manage them from the <a href="pages/archivio/index.html" target="_blank" rel="noopener" data-append-api-link">Property Archive</a>.',
      'calc.linkedProperty':      'Linked property',
      'calc.noProperty':          'No property',
      'calc.btnCreateProperty':  'Create property card',
      'calc.btnOpenProperty':     'Open property card',
      'calc.btnRefreshProperties':'Refresh property list',
      'calc.savedProspect':      'Saved prospect',
      'calc.selectProspect':     '— Select —',
      'calc.fieldSlug':           'Slug',
      'calc.slugPh':              'triq-it-torri',
      'calc.btnAuto':             'Auto',
      'calc.fieldTitle':          'Title',
      'calc.titlePh':             'Prospect title',
      'calc.btnSaveProspect':     'Save / Update',
      'calc.btnApplyProspect':    'Apply data to calculator',
      'calc.btnNew':              'New',
      'calc.btnOpenArchive':      'Open archive',
      'calc.errLoadProperties':   'Error loading properties',
      'calc.errPropertyListPrefill':'Error prefilling the property',
      'calc.warnOpenProperty':    'Select a linked property to open its card.',
      'calc.refreshingProps':     'Refreshing property list…',
      'calc.refreshedProps':      'Property list updated.',
      'calc.refreshedPropsInfo':  'property refresh.',

      // prospect manager status
      'calc.prospectNewInfo':     'Form ready for a new prospect',
      'calc.prospectListLoading': 'Loading prospect list…',
      'calc.prospectListFound':   'Found {count} saved prospects{suffix}',
      'calc.prospectListNone':    'No saved prospect{suffix}',
      'calc.prospectListErr':     "Error loading the prospect list",
      'calc.prospectLoading':     'Loading prospect…',
      'calc.prospectLoaded':      'Prospect loaded. Use "Apply data" to restore the values.',
      'calc.prospectLoadErr':     'Error loading the selected prospect',
      'calc.prospectNeedAddr':    'Enter an address or a title to generate the slug',
      'calc.prospectSlugConflict':'The prospect slug matches an existing property. Please change it before saving.',
      'calc.prospectSaving':      'Saving…',
      'calc.prospectSaved':       'Prospect saved successfully',
      'calc.prospectSaveErr':     'Error saving the prospect: {msg}',
      'calc.prospectSaveErrFallback':'request failed',
      'calc.prospectApplyPick':   'Pick a prospect to apply first',
      'calc.prospectApplied':     'Data applied to the calculator',
      'calc.prospectNoData':      'The prospect contains no saved calculator data',
      'calc.prospectSlugAutoInfo':'Enter a title or address to generate the slug',
      'calc.prospectSlugAutoOk':  'Slug updated automatically',
      'calc.prospectNotFound':    'The requested prospect was not found.',
      'calc.prospectDatiJsonWarn':'Could not read the prospect datiJson',
      'calc.prospectFormStateWarn':'Could not read the saved formState',
      'calc.prospectLoadedInfo':  'Prospect loaded. Use "Apply data" to restore the values.',
      'calc.prospectSlugAdjusted':'Slug already used by a property. Automatically set to "{slug}".',

      // section 0
      'calc.s0Title':             '0) Report Data',
      'calc.s0Addr1':             'Address — Line 1',
      'calc.s0Addr1Ph':           'Triq it-Torri',
      'calc.s0Addr2':             'Address — Line 2',
      'calc.s0Addr2Ph':           'Sliema',
      'calc.s0Date':              'Date (ISO, optional)',

      // section 1
      'calc.s1Title':             '1) Revenue & Volume Estimate',
      'calc.s1Adr':               'Average Nightly Rate (€)',
      'calc.s1Occ':               'Annual Occupancy (%)',
      'calc.s1Days':              'Estimated Occupied Nights',

      // section 2a
      'calc.s2aTitle':            '2a) Stay Parameters',
      'calc.s2aStay':             'Average stay length (nights)',
      'calc.s2aClean':            'Cleaning & Linen Rental (€) per stay',
      'calc.s2aKit':              'Welcome kit per stay (€)',
      'calc.s2aIns':              'Protection per booking with Truvi guest screening',
      'calc.insNone':             '— No insurance —',
      'calc.insScreening':        'Truvi Guest Screening + Damage Protection (up to €500) — €20.10 / booking',
      'calc.insDamage':           'Truvi Guest Screening + Damage Protection (up to €50K) — €28.75 / booking',
      'calc.insTruviNote':        'Guest screening provided by <a href="https://truvi.com" target="_blank" rel="noopener">Truvi</a>, included with every paid protection plan.',

      // section 2b
      'calc.s2bTitle':            '2b) Annual totals (cleaning, kit & insurance)',
      'calc.s2bAuto':             'Auto-calculate from stays',
      'calc.s2bEstStays':         'Estimated stays',
      'calc.s2bCleanYear':        'Annual cleaning (from stays)',
      'calc.s2bKitYear':          'Annual kit (from stays)',
      'calc.s2bInsYear':          'Annual insurance (from stays)',
      'calc.s2bCleanManual':      'Total annual cleaning (€)',
      'calc.s2bKitManual':        'Annual Welcome Kit (€)',
      'calc.s2bInsManual':        'Manual annual insurance (€)',
      'calc.s2bManualNote':       'If you switch off the toggle, you can set annual cleaning and kit manually. Insurance remains calculated from the per-booking amount.',

      // section 3
      'calc.s3Title':             '3) Utilities & Administration',
      'calc.s3Months':            'Months considered',
      'calc.s3MonthsNote':        'Enter monthly amounts: they will be multiplied by the number of months specified.',
      'calc.s3Light':             'Electricity & Gas<br> (€/month)',
      'calc.s3Wifi':              'Wi-Fi / Internet<br> (€/month)',
      'calc.s3Admin':             'Administration<br> (€/month)',
      'calc.s3Water':             'Water<br> (€/month)',
      'calc.s3MtaLicence':        'MTA Licence (monthly-equivalent)<br> (€/month)',
      'calc.s3MtaLicenceNote':    'MTA Licence: ~€130/year per unit in Malta, spread here over 12 months. Confirm the exact fee and renewal cadence with the Malta Tourism Authority.',
      'calc.s3AddBtn':            '+ Add extra monthly fixed cost',

      // section 4
      'calc.s4Title':             '4) Commissions',
      'calc.s4Ota':               'OTA Commissions (%) <br>(Airbnb and Booking)',
      'calc.s4Pm':                'PM Commission (% + VAT)',
      'calc.s4TaxMode':           'Owner tax regime',
      'calc.s4TaxArticle31d':     'Article 31D — 15% final tax on gross income',
      'calc.s4TaxCustom':         'Custom owner tax rate on gross income (default 0%)',
      'calc.s4Cedolare':          'Owner tax rate on gross income (%)',
      'calc.s4BasePm':            'PM base calculated as',
      'calc.s4BaseOta':           'Gross − OTA (default)',
      'calc.s4BaseCleanOta':      'Gross − Cleaning − OTA',
      'calc.s4BaseCleanInsOta':  'Gross − Cleaning − Insurance − OTA',
      'calc.s4VatOwner':          'VAT on the commission invoiced to the owner (%)',

      // section 5
      'calc.s5Title':             '5) Subscriptions',
      'calc.s5RingSub':           'Ring Intercom — monthly subscription (€)',
      'calc.s5RingTotal':         'Total annual Ring',
      'calc.s5Setup':             'Setup',
      'calc.s5Sub12':             'Subscription (12 months)',
      'calc.s5RingTotalLabel':    'Total Ring',
      'calc.s6Title':             '6) Start-up Costs',
      'calc.s6RingSetup':         'Ring Intercom — one-time setup (€)',
      'calc.s6CostLabel':         'Cost (€)',
      'calc.s6Kit':               'Safety Kit<br>(Extinguisher, smoke detector, carbon monoxide, combustible gas)',
      'calc.s6ExtrasTitle':       'Other one-time extra expenses (optional)',
      'calc.s6ExtrasDesc':        'Description',
      'calc.s6ExtrasAmt':         'Amount (€)',
      'calc.s6Remove':            'Remove',
      'calc.s6AddExtra':          '+ Add extra expense',
      'calc.s6AddExtraPh':        'Extra expense',

      // extras opzionali
      'calc.optTitle':            'Optional Extra Expenses',
      'calc.optInclude':          'Include in prospect',
      'calc.optAdd':              '+ Add optional extra expense',
      'calc.optPh':               'Optional extra expense',
      'calc.optNote':             'OPTIONAL',

      // section 7
      'calc.s7Title':             '7) Strengths',
      'calc.s7Punti':             'Strengths (one per line)',
      'calc.s7Default':           '- Excellent public transport connections.\n- High tourist demand in the area.\n- Renovated property, ready to use.',

      // summary
      'calc.summary':             'Summary',
      'calc.sumLordoPren':        'Gross Booking Revenue',
      'calc.sumClean':            'Cleaning',
      'calc.sumIns':              'Insurance',
      'calc.sumLordoTot':         'Total Gross Revenue<br> (Rent + Cleaning + Insurance)',
      'calc.basePmOta':           'PM Base<br> (Gross - OTA)',
      'calc.basePmCleanOta':      'PM Base<br> (Gross - Cleaning - OTA)',
      'calc.basePmCleanInsOta':   'PM Base<br> (Gross - Cleaning - Insurance - OTA)',
      'calc.basisOta':            'on Gross Revenue − OTA',
      'calc.basisCleanOta':       'on Gross Revenue − Cleaning − OTA',
      'calc.basisCleanInsOta':    'on Gross Revenue − Cleaning − Insurance − OTA',
      'calc.sumKit':              'Welcome Kit',
      'calc.sumOta':              'OTA Commissions<br>(Airbnb and Booking) (<span id="percOtaOutput">0%</span>)',
      'calc.sumBasePm':           'PM Base<br> (Gross − Cleaning − Insurance − OTA)',
      'calc.sumIvaPm':            'VAT on PM (<span id="percIvaPmOutput">0%</span>)',
      'calc.sumCostoPm':          'PM Cost + VAT (<span id="percPmOutput">0%</span>)',
      'calc.sumUtenze':           'Total Utilities (annual)',
      'calc.sumRingSetup':        'Ring — setup',
      'calc.sumRingSub':          'Ring — subscription (12 months)',
      'calc.sumBaseImp':          'Taxable Base (Rental Income Tax)',
      'calc.sumImposta':          'Rental Income Tax (<span id="percCedolareOutput">0%</span>)',
      'calc.sumUtileAnno':        'ANNUAL NET PROFIT',
      'calc.sumUtileMese':        'Monthly',
      'calc.btnUpdateReport':     'Update Report (Embed 2)',
      'calc.reportNote':          'The report (Embed 2) also updates automatically on every change.',

      // Eleva admin
      'calc.elevaTaxMode':        'Eleva tax structure',
      'calc.elevaTaxSelf':        'Self-employed individual — 25% tax reserve (default)',
      'calc.elevaTaxLtd':         'Malta Ltd — 35% headline corporate tax',
      'calc.ovIres':              'Estimated Eleva tax rate (%)',
      'calc.elevaSoftware':       'Eleva software / PMS (annual €)',
      'calc.elevaAdmin':          'Accounting and administration (annual €)',
      'calc.elevaMarketing':      'Eleva marketing (annual €)',
      'calc.elevaOther':          'Other Eleva costs (annual €)',
      'calc.elevaSsc':            'Estimated Class 2 SSC (annual €)',
      'calc.elevaCostsTotal':     'Eleva operating costs (annual)',
      'calc.elevaTaxBase':        'Eleva profit before tax',
      'calc.btnElevaPdf':         'Open Eleva earnings PDF',
      'calc.ovComm':              'Eleva Commission (annual)',
      'calc.ovTasse':             'Eleva Taxes (estimate)',
      'calc.ovNettoAnno':         'Eleva Net (annual)',
      'calc.ovNettoMese':         'Eleva Net (monthly)',
      'calc.ovNettoNote':         'Self-employed: editable reserve based on progressive personal rates; enter Class 2 SSC separately. Malta Ltd: 35% is the headline corporate tax; any shareholder refund is not anticipated in this calculation.',

      // toolbar / print
      'calc.btnPrint':            'Print / PDF',

      // PDF report
      'pdf.p1Title':              'Management<br>Proposal',
      'pdf.p1Subtitle':           'offer for the property located in',
      'pdf.p2Title':              'Why choose<br>Eleva Malta?',
      'pdf.p2P1':                 'We are a company specialised in the professional management of short-term tourist rentals in Malta.',
      'pdf.p2P2':                 'We know the local market and the dynamics of platforms like Airbnb and Booking in depth: we optimise listings, pricing and revenue management to deliver the <b>highest returns</b> to owners.',
      'pdf.p2P3':                 'We coordinate <b>cleaning and linen</b> with certified partners, handle <b>smart check-in/check-out</b> and oversee every <b>administrative and tax obligation</b>.',
      'pdf.p2P4':                 'Entrusting your property to Eleva Malta means complete, transparent, results-oriented management: you enjoy the profits, we take care of everything else.',
      'pdf.p3Title':              'Our services and<br>our guarantees',
      'pdf.svc1':                 'Professional listing creation and publication on the major <br>OTA (Online Travel Agencies) such as Airbnb and Booking',
      'pdf.svc2':                 'Professional photo shoot to showcase the property',
      'pdf.svc3':                 'Cleaning and linen rental',
      'pdf.svc4':                 'Routine and extraordinary maintenance',
      'pdf.svc5':                 'Online marketing to increase direct bookings outside the OTAs',
      'pdf.svc6':                 'Full administrative management: MTA Licence, guest registration, Environmental Contribution',
      'pdf.svc7':                 'Guest screening and insurance-backed damage protection for every covered booking',
      'pdf.p4Title':              'Property description',
      'pdf.p4Punti':              'Strengths:',
      'pdf.p5Title':              'Forecast',
      'pdf.p5Stat':               'Statistics',
      'pdf.p5Occ':                'Average occupancy rate',
      'pdf.p5Adr':                'Average daily rate',
      'pdf.p5Lordo':              'Estimated gross revenue',
      'pdf.p5Fatt':               'Annual gross revenue',
      'pdf.p5FattNote':           'By "annual gross revenue" we mean the amount received from platforms or direct bookings ({items}).',
      'pdf.p5FattNoteRent':       'rent',
      'pdf.p5FattNoteCleaning':   'cleaning',
      'pdf.p5FattNoteInsurance':  'insurance',
      'pdf.p6Title':              'Expense forecast',
      'pdf.p6Pulizie':            'Cleaning / Linen rental',
      'pdf.p6Assicurazione':      'Insurance per stay',
      'pdf.p6Kit':                'Welcome Kit (annual)',
      'pdf.p6Utenze':             'Utilities',
      'pdf.p6UtenzeAdmin':        'Property costs (Utilities, administration{wifi})',
      'pdf.p6UtenzeWifi':         ', Wi-Fi',
      'pdf.p6Ota':                'OTA Commissions <br>(Airbnb and Booking)',
      'pdf.p6OtaSub':             '(<span id="p6-ota-percent"></span> on rent + cleaning + insurance)',
      'pdf.p6OtaSubNoIns':        '(<span id="p6-ota-percent"></span> on rent + cleaning)',
      'pdf.ringPerMonth':         '<br><span style="font-weight:400;font-size:0.95em">{amount} per month subscription</span>',
      'pdf.p6Pm':                 'Eleva Malta Commission',
      'pdf.p6PmSub':              '(<span id="p6-pm-pct">—</span>)',
      'pdf.p6RingAnnual':         'Ring Intercom — subscription (annual)',
      'pdf.p6Cedolare':           'Owner taxation',
      'pdf.p6CedolareSub':        '(<span id="p6-cedolare-percent">—</span> on total gross income, before commissions and costs)',
      'pdf.p6Totale':             'Total expenses',
      'pdf.p7Title':              'Start-up Costs',
      'pdf.p6RingSetup':          'Ring Intercom – setup (one-time)',
      'pdf.p6Una':                'Safety Kit<br>(Extinguisher, smoke detector, carbon monoxide, combustible gas)',
      'pdf.p6TotaleStartup':      'Total Start-up Costs (one-time)',
      'pdf.p7UtileTitle':         'Gross and Net Profit',
      'pdf.p7UtileLordo':         'Annual Profit Before Tax',
      'pdf.p7UtileNetto':         'Annual Net Profit',
      'pdf.p7MensileNetto':       'Monthly Net: ',
      'pdf.p7TaxNote':            '*Owner taxation is estimated on total gross income, before cleaning costs, OTA commissions and Eleva management fees.',
      'pdf.p7EstimatesP1':        'These estimates are based on an analysis of similar apartments, taking into account a first initial year in which a positive reputation on the sites must be built. Results, both in terms of the average nightly rate and the occupancy rate, are therefore <span style="color:#c9a96e; font-style:italic;">potentially increasable from the second year onwards.</span>',
      'pdf.p7EstimatesP2':        'They are in no way a guarantee of future results, but as a Short-Term Rental company our mission is to <span style="font-weight:700;">maximise your earnings, reduce costs and optimise management.</span>',
    }
  };

  const SUPPORTED = ['it', 'en'];
  const STORAGE_KEY = 'elevamalta.locale';
  const DEFAULT_LOCALE = 'en';

  // ---- locale state ------------------------------------------------------
  function readStored() {
    try { return localStorage.getItem(STORAGE_KEY); } catch (e) { return null; }
  }
  function writeStored(loc) {
    try { localStorage.setItem(STORAGE_KEY, loc); } catch (e) { /* ignore */ }
  }
  function detectLocale() {
    const stored = readStored();
    if (stored && SUPPORTED.indexOf(stored) !== -1) return stored;
    const nav = (navigator.language || navigator.userLanguage || '').toLowerCase();
    if (nav.indexOf('en') === 0) return 'en';
    return DEFAULT_LOCALE;
  }

  let current = detectLocale();
  let onChangeHandlers = [];

  // ---- core: t() ---------------------------------------------------------
  function t(key, params) {
    const dict = STRINGS[current] || {};
    let s = dict[key];
    if (s === undefined) s = (STRINGS[DEFAULT_LOCALE] || {})[key] || key;
    if (params && typeof s === 'string') {
      s = s.replace(/\{(\w+)\}/g, function (m, k) {
        return Object.prototype.hasOwnProperty.call(params, k) ? params[k] : m;
      });
    }
    return s;
  }

  // ---- DOM apply ---------------------------------------------------------
  // Walks the subtree replacing textContent of any element with [data-i18n].
  // Also handles [data-i18n-placeholder] and [data-i18n-title].
  function applyTo(root) {
    if (!root) return;
    const scope = root.nodeType === 1 ? root : document;
    const nodes = scope.querySelectorAll('[data-i18n]');
    for (let i = 0; i < nodes.length; i++) {
      const el = nodes[i];
      const key = el.getAttribute('data-i18n');
      if (!key) continue;
      el.innerHTML = t(key);
    }
    const placeholders = scope.querySelectorAll('[data-i18n-placeholder]');
    for (let i = 0; i < placeholders.length; i++) {
      const el = placeholders[i];
      const key = el.getAttribute('data-i18n-placeholder');
      if (key) el.setAttribute('placeholder', t(key));
    }
    const titles = scope.querySelectorAll('[data-i18n-title]');
    for (let i = 0; i < titles.length; i++) {
      const el = titles[i];
      const key = el.getAttribute('data-i18n-title');
      if (key) el.setAttribute('title', t(key));
    }
  }
  function apply() {
    applyTo(document);
    // swap <html lang>
    document.documentElement.setAttribute('lang', current);
  }

  // ---- locale change -----------------------------------------------------
  function setLocale(loc) {
    if (SUPPORTED.indexOf(loc) === -1) loc = DEFAULT_LOCALE;
    if (loc === current) return;
    current = loc;
    writeStored(loc);
    apply();
    // Keep the language switcher in sync with the active locale. The buttons
    // are rendered once at init, so we need to flip aria-pressed here.
    const buttons = document.querySelectorAll('[data-i18n-menu] button[data-locale]');
    for (let i = 0; i < buttons.length; i++) {
      buttons[i].setAttribute('aria-pressed', String(buttons[i].getAttribute('data-locale') === current));
    }
    for (let i = 0; i < onChangeHandlers.length; i++) {
      try { onChangeHandlers[i](loc); } catch (e) { console.error('i18n onChange', e); }
    }
  }
  function onChange(fn) { onChangeHandlers.push(fn); }

  // ---- menu render -------------------------------------------------------
  // Builds a small IT|EN switcher. Designed to be placed inside a header.
  // Container must have position: relative (or any positioned ancestor).
  // Renders into the first [data-i18n-menu] element found.
  function renderMenu() {
    const host = document.querySelector('[data-i18n-menu]');
    if (!host) return;
    host.innerHTML =
      '<div class="i18n-menu" role="group" aria-label="' + t('menu.language') + '">' +
        '<button type="button" class="i18n-btn" data-locale="it" aria-pressed="' + (current === 'it') + '">' +
          '<span class="i18n-flag" aria-hidden="true">🇮🇹</span><span class="i18n-label">IT</span>' +
        '</button>' +
        '<button type="button" class="i18n-btn" data-locale="en" aria-pressed="' + (current === 'en') + '">' +
          '<span class="i18n-flag" aria-hidden="true">🇬🇧</span><span class="i18n-label">EN</span>' +
        '</button>' +
      '</div>';
    const buttons = host.querySelectorAll('button[data-locale]');
    for (let i = 0; i < buttons.length; i++) {
      // Use currentTarget so the handler still works when the click hits an
      // inner element (flag emoji, label span) instead of the button itself.
      buttons[i].addEventListener('click', function (e) {
        const target = e.currentTarget;
        setLocale(target.getAttribute('data-locale'));
      });
    }
  }

  // ---- init --------------------------------------------------------------
  function init(opts) {
    opts = opts || {};
    if (opts.onChange) onChangeHandlers.push(opts.onChange);
    apply();
    renderMenu();
  }

  // expose
  global.I18N = {
    t: t,
    locale: function () { return current; },
    setLocale: setLocale,
    onChange: onChange,
    apply: apply,
    applyTo: applyTo,
    init: init,
    STRINGS: STRINGS
  };
})(window);
