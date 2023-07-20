import { Check, Star, X } from 'phosphor-react'
import {
  ActionButton,
  AvatarContainer,
  AvatarDefault,
  ButtonsContainer,
  CharacterCounter,
  Container,
  ReviewForm,
  ReviewFormContainer,
  ReviewFormHeader,
  UserData,
} from './styles'

import { Rating } from 'react-simple-star-rating'
import { useState } from 'react'

interface ReviewCardFormProps {
  avatar_url: string
  name: string
  onClose: () => void
}

export function ReviewCardForm({
  avatar_url,
  name,
  onClose,
}: ReviewCardFormProps) {
  const [characterCount, setCharacterCount] = useState(0)

  return (
    <Container>
      <ReviewFormHeader>
        <UserData>
          <AvatarContainer>
            <AvatarDefault src={avatar_url} />
          </AvatarContainer>
          <p>{name}</p>
        </UserData>
        <Rating
          emptyIcon={<Star size={20} />}
          fillIcon={<Star weight="fill" size={20} />}
          emptyColor="#8381D9"
          fillColor="#8381D9"
        />
      </ReviewFormHeader>
      <ReviewFormContainer>
        <ReviewForm
          placeholder="Write your review here"
          maxLength={450}
          onChange={(e) => setCharacterCount(e.target.value.length)}
        />
        <CharacterCounter>
          <span>{characterCount}</span>/450
        </CharacterCounter>
      </ReviewFormContainer>
      <ButtonsContainer>
        <ActionButton>
          <X color="#8381D9" onClick={() => onClose()} />
        </ActionButton>
        <ActionButton>
          <Check color="#50B2C0" />
        </ActionButton>
      </ButtonsContainer>
    </Container>
  )
}
