import Link from "next/link";

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16">
      <Link href="/" className="text-sm font-medium text-brand-700 underline underline-offset-2">
        ← Volver
      </Link>
      <h1 className="mb-2 mt-6 text-2xl font-semibold tracking-tight">Aviso de Privacidad</h1>
      <p className="mb-8 text-sm text-[var(--color-text-muted)]">Última actualización: agosto de 2026</p>

      <div className="space-y-6 text-sm leading-relaxed text-[var(--foreground)]">
        <section>
          <p>
            En cumplimiento de la Ley Federal de Protección de Datos Personales en Posesión de los
            Particulares (LFPDPPP), Kobrex informa lo siguiente sobre el tratamiento de tus datos
            personales.
          </p>
        </section>

        <section>
          <h2 className="mb-2 font-semibold">1. Datos que recopilamos</h2>
          <p>
            Nombre, correo electrónico, contraseña (almacenada de forma cifrada), y de forma opcional: RFC,
            domicilio fiscal, teléfono y régimen fiscal — que tú mismo capturas para usarlos como emisor en
            tus recibos y contratos. También almacenamos los datos que tú registras sobre tus propios
            clientes (nombre, RFC, domicilio, contacto).
          </p>
        </section>

        <section>
          <h2 className="mb-2 font-semibold">2. Finalidad</h2>
          <p>
            Usamos estos datos únicamente para operar el servicio: autenticarte, generar tus documentos en
            PDF, enviarte recordatorios de cobro y procesar tu suscripción. No vendemos ni compartimos tus
            datos con terceros con fines publicitarios.
          </p>
        </section>

        <section>
          <h2 className="mb-2 font-semibold">3. Terceros involucrados</h2>
          <p>
            Usamos Stripe para procesar pagos y Resend para el envío de correos transaccionales. Ambos
            proveedores procesan datos únicamente en la medida necesaria para prestar esos servicios.
          </p>
        </section>

        <section>
          <h2 className="mb-2 font-semibold">4. Derechos ARCO</h2>
          <p>
            Puedes solicitar Acceso, Rectificación, Cancelación u Oposición al tratamiento de tus datos
            personales en cualquier momento, escribiendo al correo asociado a tu cuenta de Kobrex. Puedes
            editar o eliminar la mayoría de tus datos directamente desde tu panel.
          </p>
        </section>

        <section>
          <h2 className="mb-2 font-semibold">5. Seguridad</h2>
          <p>
            Las contraseñas se almacenan cifradas y nunca en texto plano. El acceso a la plataforma se
            realiza mediante conexión cifrada (HTTPS).
          </p>
        </section>
      </div>
    </div>
  );
}
