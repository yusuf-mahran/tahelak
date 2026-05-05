'use client';

import { TypographyP } from '@/components/ui/typography';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  MapPin,
  Globe,
  Edit2,
  AlertCircle,
  Loader2,
  Camera,
  Building,
} from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useDashboardDataContext } from '@/context/DashboardDataContext';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/useToast';
import { RoleGuard } from '../../auth/RoleGuard';
import CardContainer from '../../shared/CardContainer';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { uploadImageToCloudinary } from '@/lib/cloudinary';
import { Modal } from '@/components/ui/modal';

export function OrgProfile() {
  const { organization, orgLoading, orgError, updateOrganization } =
    useDashboardDataContext();
  const { showToast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    link: '',
    image: '',
  });

  // Reset form to org data whenever modal opens
  useEffect(() => {
    if (organization) {
      setFormData({
        name: organization.name || '',
        address: organization.address || '',
        link: organization.link || '',
        image: organization.image || '',
      });
      setPreviewUrl(organization.image || '');
      setImageFile(null);
    }
  }, [organization, isEditOpen]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      showToast({
        title: 'Error',
        description: 'Only image files are allowed',
        type: 'error',
      });
      return;
    }

    // Validate file size (3MB)
    const maxSize = 3 * 1024 * 1024;
    if (file.size > maxSize) {
      showToast({
        title: 'Error',
        description: 'File size must be less than 3MB',
        type: 'error',
      });
      return;
    }

    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleUpdate = async () => {
    if (!organization?.id) return;
    try {
      setUploadingImage(true);
      let imageUrl = formData.image;

      if (imageFile) {
        const res = await uploadImageToCloudinary(imageFile);
        imageUrl = res.secure_url;
      }

      const result = await updateOrganization(organization.id, {
        ...formData,
        image: imageUrl,
      });

      if (result) {
        showToast({
          title: 'Success',
          description: 'Organization profile updated successfully.',
          type: 'success',
        });
        setIsEditOpen(false);
        setImageFile(null);
      }
    } catch (error) {
      showToast({
        title: 'Error',
        description:
          error instanceof Error
            ? error.message
            : typeof error === 'string'
              ? error
              : 'Failed to update organization profile.',
        type: 'error',
      });
    } finally {
      setUploadingImage(false);
    }
  };

  if (orgLoading && !organization) {
    return (
      <CardContainer className="flex flex-col w-full p-4 md:p-6 gap-6 md:gap-8 items-center animate-pulse">
        <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-muted shadow-inner" />
        <div className="flex-1 space-y-8 w-full">
          <div className="space-y-3 flex flex-col items-center">
            <div className="h-8 bg-muted rounded-lg w-48" />
            <div className="h-4 bg-muted rounded-md w-32" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
            <div className="h-12 bg-muted rounded-xl w-full" />
            <div className="h-12 bg-muted rounded-xl w-full" />
          </div>
        </div>
      </CardContainer>
    );
  }

  if (orgError) {
    return (
      <div className="h-full flex items-center justify-center p-8 bg-destructive/5 rounded-3xl border border-destructive/10">
        <div className="flex flex-col items-center gap-4 text-center">
          <AlertCircle className="h-10 w-10 text-destructive" />
          <TypographyP className="text-destructive font-bold">
            Failed to load organization
          </TypographyP>
          <Button
            variant="outline"
            size="sm"
            className="border-destructive/20 hover:bg-destructive/10 text-destructive"
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-lg">
      <div className="absolute top-0 left-0 w-full h-1/4">
        <svg
          viewBox="0 0 200 200"
          xmlns="http://www.w3.org/2000/svg"
          className="w-md aspect-square absolute -top-60 -left-30 opacity-70 text-secondary"
        >
          <path
            fill="var(--secondary)"
            d="M24.8,-29.4C31.4,-23.9,35.6,-15.5,37.1,-6.6C38.6,2.3,37.4,11.6,34.8,23.7C32.1,35.9,28,50.8,16.5,62.3C5.1,73.8,-13.8,81.8,-31.2,78.5C-48.6,75.3,-64.5,60.9,-73.5,43.3C-82.5,25.8,-84.6,5.3,-81.8,-15.1C-79,-35.4,-71.2,-55.5,-56.7,-59.5C-42.3,-63.6,-21.1,-51.5,-6,-44.3C9.1,-37.1,18.1,-34.8,24.8,-29.4Z"
            transform="translate(100 100)"
          />
        </svg>
        <svg
          viewBox="0 0 200 200"
          xmlns="http://www.w3.org/2000/svg"
          className="w-sm aspect-square absolute -top-50 -right-50 opacity-70 text-muted"
        >
          <path
            fill="var(--muted)"
            d="M24.8,-29.4C31.4,-23.9,35.6,-15.5,37.1,-6.6C38.6,2.3,37.4,11.6,34.8,23.7C32.1,35.9,28,50.8,16.5,62.3C5.1,73.8,-13.8,81.8,-31.2,78.5C-48.6,75.3,-64.5,60.9,-73.5,43.3C-82.5,25.8,-84.6,5.3,-81.8,-15.1C-79,-35.4,-71.2,-55.5,-56.7,-59.5C-42.3,-63.6,-21.1,-51.5,-6,-44.3C9.1,-37.1,18.1,-34.8,24.8,-29.4Z"
            transform="translate(100 100)"
          />
        </svg>
      </div>

      <CardContainer
        className={cn(
          'h-full flex flex-col w-full p-4 md:p-6 gap-6 md:gap-8 justify-center items-center transition-all duration-300',
          orgLoading && 'animate-pulse opacity-80 pointer-events-none',
        )}
      >
        <RoleGuard allowedRoles={['root']}>
          {!orgLoading && (
            <Button
              variant="outline"
              size="icon"
              className="absolute top-5 end-5 h-8 w-8 rounded-full bg-background shadow-md border"
              onClick={() => setIsEditOpen(true)}
            >
              <Edit2 className="h-3 w-3" />
            </Button>
          )}
        </RoleGuard>

        {/* Profile Image */}
        <div className="relative shrink-0">
          <motion.div
            layoutId="avatar"
            className="relative w-24 h-24 md:w-32 md:h-32 overflow-hidden rounded-full"
          >
            <div className="w-full h-full rounded-full bg-background flex items-center justify-center text-primary shadow-sm overflow-hidden border-2 border-border relative">
              {organization?.image ? (
                <Image
                  src={organization.image}
                  alt={organization?.name || 'Organization'}
                  fill
                  className="w-full h-full object-cover rounded-full"
                />
              ) : (
                <span className="text-6xl font-bold text-primary">
                  {organization?.name?.charAt(0) || 'O'}
                </span>
              )}
            </div>
          </motion.div>
        </div>

        {/* Info Content */}
        <div className="shrink-0 grow-0 space-y-8 w-full">
          <div className="space-y-1 text-center">
            <h2 className="text-xl md:text-2xl font-bold text-foreground">
              {organization?.name || 'Your Organization'}
            </h2>
            <TypographyP className="text-muted-foreground text-xs font-mono not-first:mt-0">
              ID: {organization?.id?.split('-')[0] || 'org_handle'}
            </TypographyP>
          </div>

          <div className="max-xl:flex flex-col xl:grid xl:grid-cols-2 w-full gap-4 justify-center items-center max-xl:text-center">
            <div className="max-w-full max-xl:flex xl:grid grid-cols-[auto_1fr] items-center justify-center md:justify-start gap-3 text-muted-foreground">
              <MapPin className="h-4 w-4 text-primary shrink-0" />
              <p className="text-sm font-medium m-0 truncate">
                {organization?.address || 'No address registered'}
              </p>
            </div>

            <div className="max-w-full max-xl:flex xl:grid grid-cols-[auto_1fr] items-center justify-center md:justify-start gap-3 text-muted-foreground">
              <Globe className="h-4 w-4 text-primary shrink-0" />
              <Link
                target="_blank"
                href={organization?.link || '#'}
                className="text-sm font-medium m-0 truncate text-primary/80 hover:text-primary transition-colors"
              >
                {organization?.link || 'No website link'}
              </Link>
            </div>
          </div>
        </div>
      </CardContainer>

      {/* Edit Modal */}
      <Modal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        title="Edit Organization Profile"
        size="md"
      >
        <div className="space-y-6">
          {/* Avatar upload */}
          <div className="flex justify-center">
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={handleImageChange}
            />
            <button
              type="button"
              disabled={uploadingImage}
              onClick={() => fileInputRef.current?.click()}
              className="relative w-24 h-24 rounded-full overflow-hidden group/avatar border-2 border-border"
            >
              {previewUrl ? (
                <Image
                  src={previewUrl}
                  alt="Preview"
                  fill
                  className={cn('object-cover', uploadingImage && 'opacity-50')}
                />
              ) : (
                <span className="flex h-full w-full items-center justify-center bg-muted text-3xl font-bold text-primary">
                  {formData.name?.charAt(0) || 'O'}
                </span>
              )}
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover/avatar:opacity-100 transition-opacity">
                {uploadingImage ? (
                  <Loader2 className="h-6 w-6 text-white animate-spin" />
                ) : (
                  <Camera className="h-6 w-6 text-white" />
                )}
              </div>
            </button>
          </div>

          {/* Fields */}
          <div className="space-y-4">
            <Input
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="Organization Name"
              icon={Building}
            />
            <Input
              value={formData.address}
              onChange={(e) =>
                setFormData({ ...formData, address: e.target.value })
              }
              placeholder="Address"
              icon={MapPin}
            />
            <Input
              value={formData.link}
              onChange={(e) =>
                setFormData({ ...formData, link: e.target.value })
              }
              placeholder="Website Link"
              icon={Globe}
            />
          </div>

          <Button
            className="w-full rounded-xl"
            onClick={handleUpdate}
            disabled={uploadingImage || orgLoading}
          >
            {uploadingImage || orgLoading ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : null}
            Save Changes
          </Button>
        </div>
      </Modal>
    </div>
  );
}
