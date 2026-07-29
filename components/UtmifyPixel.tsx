import Script from 'next/script';

/* Pixel + captura de UTMs da UTMify. Versão desofuscada dos loaders oficiais:
   - pixel.js exige window.pixelId definido ANTES de carregar (por isso o
     append manual no mesmo inline script, preservando a ordem).
   - utms/latest.js persiste os parâmetros de UTM da sessão; os atributos
     data-utmify-prevent-* vêm da configuração original do painel. */
const UTMIFY_PIXEL_ID = '6a2b0f26049323753c49905e';

export function UtmifyPixel() {
  return (
    <>
      <Script
        id="utmify-pixel"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.pixelId = '${UTMIFY_PIXEL_ID}';
            (function () {
              var s = document.createElement('script');
              s.src = 'https://cdn.utmify.com.br/scripts/pixel/pixel.js';
              s.async = true;
              s.defer = true;
              document.head.appendChild(s);
            })();
          `,
        }}
      />
      <Script
        id="utmify-utms"
        src="https://cdn.utmify.com.br/scripts/utms/latest.js"
        strategy="afterInteractive"
        data-utmify-prevent-xcod-sck=""
        data-utmify-prevent-subids=""
      />
    </>
  );
}
