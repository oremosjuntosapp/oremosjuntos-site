-- Lock down site_content table
-- Remove the insecure "update for all" policy
drop policy if exists "Enable update for all users" on public.site_content;

-- Create secure policy: Only service_role (Edge Functions/Admin) can update
-- This ensures writes ONLY happen via the secure save-content function
create policy "Enable update for service_role" on public.site_content
  for update
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');
