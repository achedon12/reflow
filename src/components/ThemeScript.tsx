import { THEME_COLORS } from '@/lib/theme';

// S'exécute AVANT le premier rendu : pose l'attribut que la cascade lit, ce
// qui évite le flash de thème clair sur une page forcée en sombre. C'est aussi
// ce qui impose le `suppressHydrationWarning` sur <html>.
//
// Les deux balises `theme-color` reçoivent la couleur forcée quelle que soit
// leur requête média : sinon la barre d'adresse suit le SYSTÈME et reste claire
// autour d'une page sombre.
//
// Le try/catch n'est pas décoratif : `localStorage` lève en navigation privée,
// et une exception ici laisserait la page entière sans style.
const THEME_SCRIPT = `(function(){try{var t=localStorage.getItem('theme');if(t!=='light'&&t!=='dark')return;document.documentElement.setAttribute('data-theme',t);var c=t==='light'?'${THEME_COLORS.light}':'${THEME_COLORS.dark}',m=document.querySelectorAll('meta[name="theme-color"]');for(var i=0;i<m.length;i++)m[i].setAttribute('content',c);}catch(e){}})();`;

export function ThemeScript() {
    return <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />;
}
