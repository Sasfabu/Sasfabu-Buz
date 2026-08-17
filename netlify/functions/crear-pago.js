const { MercadoPagoConfig, Preference } = require('mercadopago');

// Inicialización directa del cliente de Mercado Pago con tu Token real
const client = new MercadoPagoConfig({
    accessToken: "APP_USR-8131154838810215-081520-cd26964757e39dd117ca4d4bd6070c85-2672519756"
});

exports.handler = async function (event, context) {
    if (event.httpMethod !== "POST") {
        return { statusCode: 405, body: "Método no permitido" };
    }

    try {
        const datos = JSON.parse(event.body);

        // Creamos el objeto de cobro directo en Pesos Chilenos (CLP)
        const preference = new Preference(client);
        const resultado = await preference.create({
            body: {
                items: [
                    {
                        title: `Recarga Móvil Sasfabu - Cel: ${datos.celular}`,
                        quantity: 1,
                        unit_price: parseFloat(datos.monto), // Toma el monto directo en pesos (ej: 5000)
                        currency_id: "CLP" // Moneda fija para Chile
                    }
                ],
                back_urls: {
                    success: "https://sasfabu.com",
                    failure: "https://sasfabu.com",
                    pending: "https://sasfabu.com"
                },
                auto_return: "approved",
                external_reference: JSON.stringify({
                    celular: datos.celular,
                    monto: datos.monto,
                    operador: datos.operador
                })
            }
        });

        return {
            statusCode: 200,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: resultado.id, urlPago: resultado.init_point })
        };

    } catch (error) {
        console.error("Error al generar el cobro en CLP:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "No se pudo generar el enlace de pago." })
        };
    }
};
