"use client";

import { useActionState, useMemo, useState } from "react";
import Link from "next/link";
import { createContractAction, type ActionResult } from "@/lib/actions/contracts";
import { Button, Card, ErrorText, Input, Label, Select, Textarea } from "@/components/ui";

type ClientOption = { id: string; name: string; rfc: string | null; address: string | null };

export function NewContractForm({
  clients,
  projects,
  template,
  defaultFreelancer,
}: {
  clients: ClientOption[];
  projects: { id: string; name: string; clientId: string }[];
  template: string;
  defaultFreelancer: { name: string; rfc: string; address: string };
}) {
  const [state, formAction, pending] = useActionState<ActionResult, FormData>(createContractAction, {});
  const [clientId, setClientId] = useState(clients[0]?.id ?? "");
  const [freelancer, setFreelancer] = useState(defaultFreelancer.name);
  const [freelancerRfc, setFreelancerRfc] = useState(defaultFreelancer.rfc);
  const [freelancerAddress, setFreelancerAddress] = useState(defaultFreelancer.address);
  const [proyecto, setProyecto] = useState("");
  const [monto, setMonto] = useState("");
  const [fecha, setFecha] = useState("");
  const [formaPago, setFormaPago] = useState("transferencia electrónica");
  const [jurisdiccion, setJurisdiccion] = useState("Ciudad de México");

  const filteredProjects = useMemo(() => projects.filter((p) => p.clientId === clientId), [projects, clientId]);
  const selectedClient = clients.find((c) => c.id === clientId);

  const content = useMemo(() => {
    const freelancerRfcLine = freelancerRfc ? `, RFC ${freelancerRfc}` : "";
    const clienteRfcLine = selectedClient?.rfc ? `, RFC ${selectedClient.rfc}` : "";
    return template
      .replaceAll("{{freelancer}}", freelancer || "____________")
      .replaceAll("{{freelancerRfcLine}}", freelancerRfcLine)
      .replaceAll("{{freelancerAddress}}", freelancerAddress || "____________")
      .replaceAll("{{cliente}}", selectedClient?.name || "____________")
      .replaceAll("{{clienteRfcLine}}", clienteRfcLine)
      .replaceAll("{{clienteAddress}}", selectedClient?.address || "____________")
      .replaceAll("{{proyecto}}", proyecto || "____________")
      .replaceAll("{{monto}}", monto || "0.00")
      .replaceAll("{{formaPago}}", formaPago || "____________")
      .replaceAll("{{fecha}}", fecha || "____________")
      .replaceAll("{{jurisdiccion}}", jurisdiccion || "____________");
  }, [template, freelancer, freelancerRfc, freelancerAddress, selectedClient, proyecto, monto, formaPago, fecha, jurisdiccion]);

  if (clients.length === 0) {
    return (
      <Card className="text-center text-[var(--color-text-muted)]">
        Necesitas al menos un cliente antes de crear un contrato.{" "}
        <Link href="/clients/new" className="font-medium text-brand-700 underline underline-offset-2">
          Crear cliente
        </Link>
      </Card>
    );
  }

  return (
    <Card>
      <form action={formAction} className="space-y-4">
        <div>
          <Label htmlFor="title">Título del contrato *</Label>
          <Input id="title" name="title" required placeholder="Ej. Contrato de diseño web" />
        </div>

        <div>
          <Label htmlFor="clientId">Cliente *</Label>
          <Select id="clientId" name="clientId" required value={clientId} onChange={(e) => setClientId(e.target.value)}>
            {clients.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </Select>
          {selectedClient && !selectedClient.rfc && (
            <p className="mt-1.5 text-xs text-[var(--color-text-muted)]">
              Este cliente no tiene RFC/domicilio capturado.{" "}
              <Link href="/clients/new" className="underline">
                Agrégalo en su ficha
              </Link>
              .
            </p>
          )}
        </div>

        {filteredProjects.length > 0 && (
          <div>
            <Label htmlFor="projectId">Proyecto (opcional)</Label>
            <Select id="projectId" name="projectId" defaultValue="">
              <option value="">Sin proyecto</option>
              {filteredProjects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </Select>
          </div>
        )}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <Label>Tu nombre / razón social</Label>
            <Input value={freelancer} onChange={(e) => setFreelancer(e.target.value)} />
          </div>
          <div>
            <Label>Tu RFC (opcional)</Label>
            <Input value={freelancerRfc} onChange={(e) => setFreelancerRfc(e.target.value)} />
          </div>
          <div className="sm:col-span-2">
            <Label>Tu domicilio</Label>
            <Input value={freelancerAddress} onChange={(e) => setFreelancerAddress(e.target.value)} />
          </div>
          <div>
            <Label>Nombre del proyecto</Label>
            <Input value={proyecto} onChange={(e) => setProyecto(e.target.value)} />
          </div>
          <div>
            <Label>Monto (MXN)</Label>
            <Input type="number" step="0.01" value={monto} onChange={(e) => setMonto(e.target.value)} />
          </div>
          <div>
            <Label>Forma de pago</Label>
            <Input value={formaPago} onChange={(e) => setFormaPago(e.target.value)} />
          </div>
          <div>
            <Label>Fecha de inicio</Label>
            <Input type="date" value={fecha} onChange={(e) => setFecha(e.target.value)} />
          </div>
          <div className="sm:col-span-2">
            <Label>Jurisdicción (ciudad/estado)</Label>
            <Input value={jurisdiccion} onChange={(e) => setJurisdiccion(e.target.value)} />
          </div>
        </div>

        <div>
          <Label htmlFor="content">Contenido del contrato *</Label>
          <Textarea id="content" name="content" rows={16} value={content} readOnly className="font-mono text-xs" />
          <p className="mt-1.5 text-xs text-[var(--color-text-muted)]">
            Se genera automáticamente con las variables de arriba. Puedes editarlo manualmente después de crearlo. Esta
            plantilla es informativa y no sustituye la revisión de un profesional del derecho.
          </p>
        </div>

        <ErrorText>{state.error}</ErrorText>
        <Button type="submit" disabled={pending} className="w-full">
          {pending ? "Guardando..." : "Guardar contrato"}
        </Button>
      </form>
    </Card>
  );
}
