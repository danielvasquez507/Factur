-- Habilitar RLS
ALTER TABLE "clients" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "clients" FORCE ROW LEVEL SECURITY;

ALTER TABLE "services" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "services" FORCE ROW LEVEL SECURITY;

ALTER TABLE "client_services" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "client_services" FORCE ROW LEVEL SECURITY;

ALTER TABLE "invoices" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "invoices" FORCE ROW LEVEL SECURITY;

-- Políticas
CREATE POLICY tenant_isolation_clients ON "clients"
  FOR ALL
  USING (
    current_setting('app.bypass_rls', true) = 'on'
    OR company_id = NULLIF(current_setting('app.current_tenant', true), '')::uuid
  );

CREATE POLICY tenant_isolation_services ON "services"
  FOR ALL
  USING (
    current_setting('app.bypass_rls', true) = 'on'
    OR company_id = NULLIF(current_setting('app.current_tenant', true), '')::uuid
  );

CREATE POLICY tenant_isolation_client_services ON "client_services"
  FOR ALL
  USING (
    current_setting('app.bypass_rls', true) = 'on'
    OR company_id = NULLIF(current_setting('app.current_tenant', true), '')::uuid
  );

CREATE POLICY tenant_isolation_invoices ON "invoices"
  FOR ALL
  USING (
    current_setting('app.bypass_rls', true) = 'on'
    OR company_id = NULLIF(current_setting('app.current_tenant', true), '')::uuid
  );