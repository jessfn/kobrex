import Link from "next/link";
import { PLAN_PRICE_MXN } from "@/lib/subscription";

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16">
      <Link href="/" className="text-sm font-medium text-brand-700 underline underline-offset-2">
        ← Volver
      </Link>
      <h1 className="mb-2 mt-6 text-2xl font-semibold tracking-tight">Términos y Condiciones</h1>
      <p className="mb-8 text-sm text-[var(--color-text-muted)]">Última actualización: agosto de 2026</p>

      <div className="space-y-6 text-sm leading-relaxed text-[var(--foreground)]">
        <section>
          <h2 className="mb-2 font-semibold">1. Descripción del servicio</h2>
          <p>
            Kobrex es una herramienta de gestión de clientes, proyectos, recibos y contratos dirigida a
            freelancers y pequeños negocios. Kobrex no es una institución financiera ni un Proveedor
            Autorizado de Certificación (PAC); los recibos generados por la plataforma <strong>no
            constituyen un Comprobante Fiscal Digital por Internet (CFDI)</strong> ante el SAT.
          </p>
        </section>

        <section>
          <h2 className="mb-2 font-semibold">2. Cuenta y periodo de prueba</h2>
          <p>
            Al registrarte obtienes acceso gratuito por 14 días. Al finalizar la prueba, el acceso a la
            plataforma requiere una suscripción activa de ${PLAN_PRICE_MXN} MXN al mes, cobrada de forma
            recurrente a través de Stripe, Inc.
          </p>
        </section>

        <section>
          <h2 className="mb-2 font-semibold">3. Cancelación y reembolsos</h2>
          <p>
            Puedes cancelar tu suscripción en cualquier momento desde tu panel de facturación; el acceso se
            mantiene hasta el final del periodo ya pagado. No se realizan reembolsos por periodos parciales
            ya iniciados, salvo que la ley aplicable indique lo contrario.
          </p>
        </section>

        <section>
          <h2 className="mb-2 font-semibold">4. Responsabilidad del usuario sobre sus datos</h2>
          <p>
            Eres responsable de la exactitud de los datos que capturas sobre tus clientes y de cumplir tus
            propias obligaciones fiscales. Los contratos generados por la plataforma son plantillas
            informativas y no sustituyen la asesoría de un profesional del derecho.
          </p>
        </section>

        <section>
          <h2 className="mb-2 font-semibold">5. Disponibilidad y limitación de responsabilidad</h2>
          <p>
            Kobrex se ofrece &ldquo;tal cual&rdquo;, sin garantías de disponibilidad ininterrumpida. En la
            máxima medida permitida por la ley, la responsabilidad de Kobrex frente al usuario no excederá el
            monto pagado por el usuario en los últimos 3 meses de suscripción.
          </p>
        </section>

        <section>
          <h2 className="mb-2 font-semibold">6. Contacto</h2>
          <p>Para dudas sobre estos términos, contáctanos al correo asociado a tu cuenta de Kobrex.</p>
        </section>
      </div>
    </div>
  );
}
