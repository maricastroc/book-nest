/* eslint-disable @typescript-eslint/no-explicit-any */
import { useRef, useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { Controller } from 'react-hook-form'
import Select from 'react-select'
import {
  Book,
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  Sparkle,
  UploadSimple,
} from 'phosphor-react'
import { MainLayout } from '@/layouts/MainLayout'
import { InputContainer } from '@/components/ui/InputContainer'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Label } from '@/components/ui/Label'
import { Button } from '@/components/ui/Button'
import { FormErrors } from '@/components/ui/FormErrors'
import { OutlineButton } from '@/components/ui/OutlineButton'
import { customStyles } from '@/utils/getCustomStyles'
import { useSubmitBookForm } from '@/hooks/useSubmitBookForm'
import {
  PageWrapper,
  StepBar,
  StepItem,
  StepDot,
  StepLabel,
  StepConnector,
  StepSubtitle,
  IsbnSection,
  IsbnRow,
  IsbnInputWrapper,
  IsbnHint,
  BookMatchIntro,
  BookMatchCard,
  BookCover,
  BookMatchInfo,
  BookMatchTitle,
  BookMatchAuthor,
  BookMatchMeta,
  MatchBadge,
  MatchMessage,
  MatchMessageTitle,
  MatchMessageBody,
  SectionLabel,
  FieldGrid,
  FieldFull,
  CoverUploadArea,
  CoverThumb,
  CoverUploadText,
  NavRow,
  HiddenInput,
} from './styles'

type WizardStep = 1 | 2 | 3

const STEP_LABELS: Record<WizardStep, string> = {
  1: 'Find book',
  2: 'Review information',
  3: 'Extras & submit',
}

export default function NewSubmission() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [wizardStep, setWizardStep] = useState<WizardStep>(1)

  const {
    control,
    data,
    handleSubmit,
    handleSubmitBook,
    onInvalid,
    coverPreview,
    handleCoverChange,
    getBookInfoWithGoogleBooks,
    categoriesOptions,
    isValidBook,
    isSubmitting,
    isLoading,
    errors,
    form,
  } = useSubmitBookForm({
    isEdit: false,
    onClose: () => router.push('/library'),
  })

  useEffect(() => {
    if (isValidBook && wizardStep === 1) setWizardStep(2)
  }, [isValidBook, wizardStep])

  useEffect(() => {
    if (!isValidBook) setWizardStep(1)
  }, [isValidBook])

  const stepClass = (n: WizardStep) => {
    if (wizardStep > n) return 'done'
    if (wizardStep === n) return 'active'
    return ''
  }

  const metaParts = [
    data.totalPages && `${data.totalPages} pages`,
    data.publishingYear,
    data.publisher,
    data.language,
  ].filter(Boolean)

  return (
    <MainLayout
      title="Submit a Book | BookNest"
      icon={<Book />}
      pageTitle="Submit a Book"
    >
      <PageWrapper>
        <StepBar>
          <StepItem>
            <StepDot className={stepClass(1)}>
              {wizardStep > 1 ? <CheckCircle size={14} weight="fill" /> : '1'}
            </StepDot>
            <StepLabel className={stepClass(1)}>Find book</StepLabel>
          </StepItem>
          <StepConnector className={wizardStep > 1 ? 'done' : ''} />
          <StepItem>
            <StepDot className={stepClass(2)}>
              {wizardStep > 2 ? <CheckCircle size={14} weight="fill" /> : '2'}
            </StepDot>
            <StepLabel className={stepClass(2)}>Review info</StepLabel>
          </StepItem>
          <StepConnector className={wizardStep > 2 ? 'done' : ''} />
          <StepItem>
            <StepDot className={stepClass(3)}>3</StepDot>
            <StepLabel className={stepClass(3)}>Extras &amp; submit</StepLabel>
          </StepItem>
        </StepBar>

        {wizardStep > 1 && (
          <StepSubtitle>
            <span>Step {wizardStep} of 3</span>
            <h3>{STEP_LABELS[wizardStep]}</h3>
          </StepSubtitle>
        )}

        <form
          onSubmit={handleSubmit(handleSubmitBook, onInvalid)}
          style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
        >
          {wizardStep === 1 && (
            <IsbnSection>
              <IsbnHint>
                Enter the ISBN of the book you want to submit. We&apos;ll fetch
                the details automatically from Google Books.
              </IsbnHint>
              <IsbnRow>
                <IsbnInputWrapper>
                  <InputContainer>
                    <Controller
                      name="isbn"
                      control={control}
                      render={({ field }) => (
                        <Input
                          variant="secondary"
                          label="ISBN"
                          placeholder="e.g. 978-0-7475-3269-9"
                          {...field}
                        />
                      )}
                    />
                    {errors.isbn && <FormErrors error={errors.isbn.message} />}
                  </InputContainer>
                </IsbnInputWrapper>
                <Button
                  type="button"
                  content={isLoading ? 'Searching…' : 'Find Book'}
                  onClick={() => getBookInfoWithGoogleBooks(form?.isbn)}
                  disabled={!form?.isbn || isLoading}
                  style={{
                    width: 'auto',
                    flexShrink: 0,
                    padding: '0.7rem 1.5rem',
                    marginBottom: errors.isbn ? '1.4rem' : 0,
                  }}
                />
              </IsbnRow>
            </IsbnSection>
          )}

          {wizardStep >= 2 && isValidBook && (
            <>
              <BookMatchIntro>
                <BookMatchCard>
                  <BookCover>
                    {coverPreview ? (
                      <img src={coverPreview} alt="Book cover" />
                    ) : (
                      <Book size={24} />
                    )}
                  </BookCover>
                  <BookMatchInfo>
                    <BookMatchTitle>{data.name || '—'}</BookMatchTitle>
                    <BookMatchAuthor>{data.author || '—'}</BookMatchAuthor>
                    {metaParts.length > 0 && (
                      <BookMatchMeta>{metaParts.join(' • ')}</BookMatchMeta>
                    )}
                    <MatchBadge>
                      <CheckCircle size={12} weight="fill" />
                      Google Books match
                    </MatchBadge>
                  </BookMatchInfo>
                </BookMatchCard>

                <MatchMessage>
                  <MatchMessageTitle>
                    <Sparkle size={18} weight="fill" />
                    Auto-filled
                  </MatchMessageTitle>
                  <MatchMessageBody>
                    Fields were imported from Google Books. Review and correct
                    any information if necessary before submitting.
                  </MatchMessageBody>
                </MatchMessage>
              </BookMatchIntro>

              {wizardStep === 2 && (
                <>
                  <SectionLabel>Review &amp; edit if needed</SectionLabel>
                  <FieldGrid>
                    <FieldFull>
                      <InputContainer>
                        <Controller
                          name="name"
                          control={control}
                          render={({ field }) => (
                            <Input
                              variant="secondary"
                              label="Title"
                              placeholder="e.g. Harry Potter and the Philosopher's Stone"
                              {...field}
                            />
                          )}
                        />
                        {errors.name && (
                          <FormErrors error={errors.name.message} />
                        )}
                      </InputContainer>
                    </FieldFull>

                    <InputContainer>
                      <Controller
                        name="author"
                        control={control}
                        render={({ field }) => (
                          <Input
                            variant="secondary"
                            label="Author"
                            placeholder="e.g. J. K. Rowling"
                            {...field}
                          />
                        )}
                      />
                      {errors.author && (
                        <FormErrors error={errors.author.message} />
                      )}
                    </InputContainer>

                    <InputContainer>
                      <Controller
                        name="publisher"
                        control={control}
                        render={({ field }) => (
                          <Input
                            variant="secondary"
                            label="Publisher"
                            placeholder="e.g. Bloomsbury"
                            {...field}
                          />
                        )}
                      />
                      {errors.publisher && (
                        <FormErrors error={errors.publisher.message} />
                      )}
                    </InputContainer>

                    <InputContainer>
                      <Controller
                        name="publishingYear"
                        control={control}
                        render={({ field }) => (
                          <Input
                            variant="secondary"
                            label="Publishing year"
                            placeholder="e.g. 1997"
                            {...field}
                          />
                        )}
                      />
                      {errors.publishingYear && (
                        <FormErrors error={errors.publishingYear.message} />
                      )}
                    </InputContainer>

                    <InputContainer>
                      <Controller
                        name="totalPages"
                        control={control}
                        render={({ field }) => (
                          <Input
                            variant="secondary"
                            label="Pages"
                            placeholder="e.g. 320"
                            {...field}
                          />
                        )}
                      />
                      {errors.totalPages && (
                        <FormErrors error={errors.totalPages.message} />
                      )}
                    </InputContainer>

                    <FieldFull>
                      <InputContainer>
                        <Controller
                          name="language"
                          control={control}
                          render={({ field }) => (
                            <Input
                              variant="secondary"
                              label="Language"
                              placeholder="e.g. English"
                              {...field}
                            />
                          )}
                        />
                        {errors.language && (
                          <FormErrors error={errors.language.message} />
                        )}
                      </InputContainer>
                    </FieldFull>

                    <FieldFull>
                      <InputContainer>
                        <Controller
                          name="summary"
                          control={control}
                          render={({ field }) => (
                            <Textarea
                              label="Summary"
                              rows={5}
                              maxLength={2000}
                              placeholder="A short description of the book…"
                              {...field}
                            />
                          )}
                        />
                        {errors.summary && (
                          <FormErrors error={errors.summary.message} />
                        )}
                      </InputContainer>
                    </FieldFull>
                  </FieldGrid>
                </>
              )}

              {wizardStep === 3 && (
                <>
                  <SectionLabel>Cover image</SectionLabel>
                  <HiddenInput
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleCoverChange}
                  />
                  <CoverUploadArea
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <CoverThumb>
                      {coverPreview ? (
                        <img src={coverPreview} alt="Book cover" />
                      ) : (
                        <Book size={24} />
                      )}
                    </CoverThumb>
                    <CoverUploadText>
                      <strong>
                        {coverPreview
                          ? 'Change cover image'
                          : 'Upload cover image'}
                      </strong>
                      <span>
                        {coverPreview
                          ? 'Click to replace the current cover'
                          : 'Click to select a file — JPG, PNG or WebP'}
                      </span>
                    </CoverUploadText>
                    <UploadSimple
                      size={20}
                      style={{
                        marginLeft: 'auto',
                        flexShrink: 0,
                        color: '#5A698F',
                      }}
                    />
                  </CoverUploadArea>

                  {categoriesOptions?.length > 0 && (
                    <>
                      <SectionLabel>Categories</SectionLabel>
                      <InputContainer>
                        <Label content="Select one or more categories" />
                        <Controller
                          name="categories"
                          control={control}
                          defaultValue={[]}
                          render={({ field }) => (
                            <Select
                              {...field}
                              isMulti
                              menuPlacement="auto"
                              options={categoriesOptions as any}
                              styles={customStyles}
                              onChange={(selected) => field.onChange(selected)}
                            />
                          )}
                        />
                        {errors.categories && (
                          <FormErrors error={errors.categories.message} />
                        )}
                      </InputContainer>
                    </>
                  )}
                </>
              )}
            </>
          )}

          {wizardStep === 1 && (
            <NavRow>
              <OutlineButton type="button" onClick={() => router.back()}>
                <ArrowLeft size={15} />
                Cancel
              </OutlineButton>
              <div />
            </NavRow>
          )}

          {wizardStep === 2 && (
            <NavRow>
              <OutlineButton type="button" onClick={() => router.back()}>
                <ArrowLeft size={15} />
                Cancel
              </OutlineButton>
              <Button
                type="button"
                content="Next"
                onClick={() => setWizardStep(3)}
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
              >
                <ArrowRight size={15} />
              </Button>
            </NavRow>
          )}

          {wizardStep === 3 && (
            <NavRow>
              <OutlineButton type="button" onClick={() => setWizardStep(2)}>
                <ArrowLeft size={15} />
                Back
              </OutlineButton>
              <Button
                type="submit"
                content={isSubmitting ? 'Submitting…' : 'Submit Book'}
                disabled={isSubmitting}
              />
            </NavRow>
          )}
        </form>
      </PageWrapper>
    </MainLayout>
  )
}
