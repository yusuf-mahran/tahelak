import { Json } from '@/lib/supabase';
import { findOne, updateById } from '@/lib/supabase/db';

export const getOrganizationDetails = async (orgId: string) => {
  try {
    const { data, error } = await findOne('organizations', 'id', orgId);
    if (error) {
      throw new Error(`Failed to fetch organization details: ${error}`);
    }
    return data;
  } catch (error) {
    throw error instanceof Error
      ? error
      : typeof error === 'string'
        ? new Error(error)
        : new Error(
            'An unknown error occurred while fetching organization details',
          );
  }
};

export const updateOrganization = async (
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
    const { data, error } = await updateById(
      'organizations',
      orgId,
      updateData,
    );
    if (error) {
      throw new Error(`Failed to update organization: ${error}`);
    }
    return data;
  } catch (error) {
    throw error instanceof Error
      ? error
      : typeof error === 'string'
        ? new Error(error)
        : new Error('An unknown error occurred while updating organization');
  }
};
