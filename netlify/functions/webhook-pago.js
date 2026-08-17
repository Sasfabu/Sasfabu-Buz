const fetch = require('node-fetch');

exports.handler = async function (event, context) {
    if (event.httpMethod !== "POST") {
        return { statusCode: 405, body: "Método no permitido" };
    }

    try {
        // Mercado Pago envía el ID de la transacción en la URL de la petición
        const { topic, resource } = event.queryStringParameters || {};
        const bodyQuery = JSON.parse(event.body || "{}");

        const action = bodyQuery.action || topic;
        const dataId = (bodyQuery.data && bodyQuery.data.id) || resource;

        // Validamos si la notificación es sobre un pago aprobado
        if (action === "payment.updated" || action === "payment") {
            // Consultamos los detalles del pago directamente a Mercado Pago para verificar que es real
            const respuestaPago = await fetch(`https://mercadopago.com{dataId}`, {
                headers: { "Authorization": `Bearer APP_USR-8131154838810215-081520-cd26964757e39dd117ca4d4bd6070c85-2672519756` }
            });

            const datosPago = await respuestaPago.json();

            if (datosPago.status === "approved") {
                // Extraemos los datos del celular que guardamos ocultos en el Paso 1
                const datosRecarga = JSON.parse(datosPago.external_reference);

                console.log(`¡PAGO APROBADO! Procesando recarga para: ${datosRecarga.celular}`);

                // LLAMADA AUTOMÁTICA A TU FUNCIÓN DE DING
                const ejecutarRecarga = await fetch("https://sasfabu.com", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        celular: datosRecarga.celular,
                        monto: datosRecarga.monto,
                        operador: datosRecarga.operador
                    })
                });

                const respuestaFinalDing = await ejecutarRecarga.text();
                console.log("Resultado final de la recarga automática:", respuestaFinalDing);
            }
        }

        return { statusCode: 200, body: "Notificación procesada con éxito" };

    } catch (error) {
        console.error("Error en Webhook de Mercado Pago:", error);
        return { statusCode: 500, body: "Error interno procesando webhook" };
    }
};
