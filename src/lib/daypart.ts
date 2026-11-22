export type Daypart = "dawn" | "morning" | "afternoon" | "evening" | "night";

export function daypartOf(hour: number): Daypart {
  if (hour >= 4 && hour < 7) return "dawn";
  if (hour >= 7 && hour < 12) return "morning";
  if (hour >= 12 && hour < 17) return "afternoon";
  if (hour >= 17 && hour < 20) return "evening";
  return "night";
}

export const daypartCopy: Record<Daypart, { en: string; gu: string }> = {
  dawn: { en: "The milk is just arriving.", gu: "દૂધ હમણાં જ આવી રહ્યું છે." },
  morning: { en: "The shops are open and the milk is cold.", gu: "દુકાનો ખુલી ગઈ છે, દૂધ ઠંડું છે." },
  afternoon: { en: "Hot outside. Chaas time.", gu: "બહાર ગરમી છે. છાશનો સમય." },
  evening: { en: "Evening chai needs fresh milk.", gu: "સાંજની ચા માટે તાજું દૂધ." },
  night: { en: "The book is lamp-lit. Order now for the morning.", gu: "ચોપડો દીવાના અજવાળે. સવાર માટે હમણાં ઓર્ડર કરો." },
};

/**
 * Runs before first paint (inlined in <head>): sets language and time of day on <html>.
 * Keep it tiny and dependency-free.
 */
export const bootScript = `(function(){var d=document.documentElement;try{var l=localStorage.getItem('kd-lang');d.dataset.lang=l==='gu'?'gu':'en';if(l==='gu')d.lang='gu'}catch(e){d.dataset.lang='en'}var h=new Date().getHours();d.dataset.time=h>=4&&h<7?'dawn':h<12&&h>=7?'morning':h<17&&h>=12?'afternoon':h<20&&h>=17?'evening':'night'})();`;
