import * as Dialog from '@radix-ui/react-dialog'
import { Controller } from 'react-hook-form'
import { ImageCropper } from '@/components/ui/ImageCropper'
import { Input } from '@/components/ui/Input'
import { BaseModal } from '@/components/ui/BaseModal'
import { AvatarUploadField } from './partials/AvatarUploadField'
import { useEditProfileForm } from './partials/useEditProfileForm'

interface EditProfileModalProps {
  onClose: () => void
}

const sectionLabelClass =
  'text-[10px] font-semibold uppercase tracking-[0.16em] text-fg3'

export function EditProfileModal({ onClose }: EditProfileModalProps) {
  const {
    control,
    errors,
    isSubmitting,
    changePassword,
    setChangePassword,
    inputFileRef,
    avatarPreview,
    showCropper,
    originalImage,
    setShowCropper,
    handleAvatarChange,
    handleCroppedImage,
    handleDeleteAvatar,
    handleSubmit,
    handleEditProfile,
    handleClose,
  } = useEditProfileForm({ onClose })

  if (originalImage && showCropper) {
    return (
      <Dialog.Portal>
        <ImageCropper
          src={originalImage}
          onCrop={handleCroppedImage}
          aspectRatio={1}
          onClose={() => setShowCropper(false)}
        />
      </Dialog.Portal>
    )
  }

  return (
    <Dialog.Portal>
      <BaseModal
        onClose={handleClose}
        title="Edit Profile"
        description="Keep your public profile up to date."
        footer={
          <div className="flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={handleClose}
              className="rounded-lg border border-line px-4 py-2.5 text-[14px] font-medium text-fg2 transition-colors hover:border-line-strong hover:text-fg"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="editProfileForm"
              disabled={isSubmitting}
              className="rounded-lg bg-ac px-5 py-2.5 text-[14px] font-semibold text-ac-ink transition-[filter] hover:brightness-110 disabled:opacity-60"
            >
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        }
      >
        <form
          id="editProfileForm"
          onSubmit={handleSubmit(handleEditProfile)}
          className="flex flex-col gap-7"
        >
          <AvatarUploadField
            avatarPreview={avatarPreview}
            inputFileRef={inputFileRef}
            onFileChange={handleAvatarChange}
            onRemove={handleDeleteAvatar}
            errorMessage={errors.avatarUrl?.message}
          />

          {/* Personal information */}
          <div className="flex flex-col gap-4 border-t border-line pt-6">
            <p className={sectionLabelClass}>Personal Information</p>

            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <Input
                  id="name"
                  label="Name"
                  error={errors.name ? 'Name is required.' : undefined}
                  {...field}
                />
              )}
            />

            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <Input
                  id="email"
                  label="Email"
                  error={errors.email?.message}
                  {...field}
                />
              )}
            />
          </div>

          <div className="flex flex-col gap-4 border-t border-line pt-6">
            <p className={sectionLabelClass}>Security</p>

            <label className="flex cursor-pointer items-center gap-2.5 text-[13px] text-fg2">
              <input
                type="checkbox"
                checked={changePassword}
                onChange={() => setChangePassword((prev) => !prev)}
                className="h-4 w-4 accent-ac"
              />
              I want to change my password
            </label>

            {changePassword && (
              <>
                <Controller
                  name="oldPassword"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="oldPassword"
                      label="Current password"
                      type="password"
                      error={
                        errors.oldPassword
                          ? 'Password must be at least 8 characters.'
                          : undefined
                      }
                      {...field}
                    />
                  )}
                />

                <Controller
                  name="password"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="password"
                      label="New password"
                      type="password"
                      error={
                        errors.password
                          ? 'New password must be at least 8 characters.'
                          : undefined
                      }
                      {...field}
                    />
                  )}
                />
              </>
            )}
          </div>
        </form>
      </BaseModal>
    </Dialog.Portal>
  )
}
