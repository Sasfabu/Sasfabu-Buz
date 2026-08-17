const fetch = require('node-fetch');
const { HttpsProxyAgent } = require('hpagent');
const URL_PROXY = "http://webshare.io";

exports.handler = async function (event, context) {

    if (event.httpMethod !== "POST") {
        return {
            statusCode: 405,
            body: JSON.stringify({ error: "Método no permitido" }),
            headers: { "Content-Type": "application/json" }
        };
    }

    try {
        const datos = JSON.parse(event.body);

        const DING_API_KEY = process.env.DING_API_KEY || context.env?.DING_API_KEY;
        const URL_PROVEEDOR = process.env.URL_PROVEEDOR || context.env?.URL_PROVEEDOR;

        if (!DING_API_KEY) {
            return {
                statusCode: 500,
                body: JSON.stringify({ error: "Falta configurar la credencial en Netlify." }),
                headers: { "Content-Type": "application/json" }
            };
        }

        const operador = (datos.operador || "").toLowerCase();

        let skuReal = "ENTEL_CL_TOPUP";

        if (operador.includes("movistar")) {
            skuReal = "MOVISTAR_CL_TOPUP";
        } else if (operador.includes("claro")) {
            skuReal = "CLARO_CL_TOPUP";
        } else if (operador.includes("wom")) {
            skuReal = "WOM_CL_TOPUP";
        }

        const cuerpoPeticion = {
            SkuCode: datos.skuCode || skuReal,
            SendValue: parseFloat(datos.monto),
            DistributorRef: "Sasfabu-" + Date.now(),
            AccountNumber: datos.celular.replace('+', '')
        };

        const respuestaDing = await fetch("https://dingconnect.com", {
            method: "POST",
            agent: new HttpsProxyAgent({
                keepAlive: true,
                proxy: URL_PROXY
            }),
            headers: {
                "accept": "application/json",
                "content-type": "application/json",
                "api_key": DING_API_KEY,
                "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36"
            },
            body: JSON.stringify(cuerpoPeticion)
        });

        // ============================================================
        // MEJORA CLAVE: VALIDAMOS SI DING RESPONDIÓ CON TEXTO O HTML
        // ============================================================
        const textoRespuesta = await respuestaDing.text();
        let datosFinales;
        console.log("TEXTO CRUDO DE DING:", textoRespuesta);

        try {
            // Si la respuesta es JSON puro, la procesamos normal
            datosFinales = JSON.parse(textoRespuesta);
        } catch (e) {
            // Si Ding nos mandó un HTML de error, extraemos el texto para mostrarlo en tu pantalla
            datosFinales = {
                error: "Respuesta inválida de Ding Connect",
                detalleCorto: textoRespuesta.substring(0, 150) // Toma los primeros letras para ver el error
            };
        }

        return {
            statusCode: respuestaDing.status,
            body: JSON.stringify({ success: respuestaDing.ok, resultado: datosFinales }),
            headers: { "Content-Type": "application/json" }
        };

    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Error de conexión en Sasfabu: " + error.message }),
            headers: { "Content-Type": "application/json" }
        };
    }
};
