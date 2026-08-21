import Script from 'next/script';
import { MATOMO } from '@/lib/site';

/**
 * Mesure d'audience Matomo, auto-hébergée et SANS COOKIE.
 *
 * ⚠️ `disableCookies` n'est pas un détail de configuration : c'est lui qui
 * permet au site de se passer de bandeau de consentement, et les mentions
 * légales le DÉCRIVENT. Le retirer rendrait ces pages fausses.
 *
 * Sans identifiant de site, rien n'est émis — c'est le comportement voulu en
 * développement, où la moindre valeur enverrait des vues de test dans les
 * statistiques du site réel.
 */
export function Matomo() {
    if (!MATOMO.url || !MATOMO.siteId) return null;

    const origin = MATOMO.url.replace(/\/$/, '');

    return (
        <Script id="matomo" strategy="afterInteractive">
            {`var _paq=window._paq=window._paq||[];_paq.push(['disableCookies']);_paq.push(['trackPageView']);_paq.push(['enableLinkTracking']);(function(){var u="${origin}/";_paq.push(['setTrackerUrl',u+'matomo.php']);_paq.push(['setSiteId','${MATOMO.siteId}']);var d=document,g=d.createElement('script'),s=d.getElementsByTagName('script')[0];g.async=true;g.src=u+'matomo.js';s.parentNode.insertBefore(g,s);})();`}
        </Script>
    );
}
