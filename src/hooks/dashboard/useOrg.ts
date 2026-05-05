'use client';

import { useCallback, useState } from 'react';
import { Database, Json } from '@/lib/supabase';
import {
  getOrganizationDetails,
  updateOrganization as updateOrgApi,
} from '@/repositories/organization';

type OrgRow = Database['public']['Tables']['organizations']['Row'];

export const useOrg = () => {
  const [organization, setOrganization] = useState<OrgRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrganization = useCallback(async (orgId: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await getOrganizationDetails(orgId);
      setOrganization(data);
      return data;
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : 'Failed to fetch organization';
      setError(msg);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateOrganization = useCallback(
    async (
      orgId: string,
      updateData: {
        name?: string;
        address?: string;
        link?: string;
        image?: string;
        subscription?: Json | null;
      },
    ) => {
      try {
        setLoading(true);
        setError(null);
        const data = await updateOrgApi(orgId, updateData);
        setOrganization(data);
        return data;
      } catch (err) {
        const msg =
          err instanceof Error ? err.message : 'Failed to update organization';
        setError(msg);
        return null;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const resetOrg = useCallback(() => setOrganization(null), []);

  return {
    organization,
    loading,
    error,
    fetchOrganization,
    updateOrganization,
    resetOrg,
  };
};
