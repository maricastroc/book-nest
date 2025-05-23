import * as Dialog from '@radix-ui/react-dialog'
import { ReactNode } from 'react'
import { X } from 'phosphor-react'
import {
  CloseButton,
  Content,
  Description,
  Header,
  Overlay,
  Title,
} from './styles'

interface BaseModalProps {
  onClose: () => void
  title?: string
  isLarger?: boolean
  hasAlignMiddleContent?: boolean
  children: ReactNode
  showCloseButton?: boolean
}

export function BaseModal({
  onClose,
  title,
  children,
  isLarger = false,
  hasAlignMiddleContent = false,
  showCloseButton = true,
}: BaseModalProps) {
  return (
    <Dialog.Portal>
      <Overlay className="DialogOverlay" onClick={onClose} />
      <Content className="DialogContent" isLarger={isLarger}>
        {title && (
          <Header className="DialogHeader">
            <Title
              hasAlignMiddleContent={hasAlignMiddleContent}
              className="DialogTitle"
            >
              {title}
            </Title>
            {showCloseButton && (
              <CloseButton onClick={onClose}>
                <X size={20} alt="Close modal" />
              </CloseButton>
            )}
          </Header>
        )}
        <Description
          hasAlignMiddleContent={hasAlignMiddleContent}
          className="DialogDescription"
        >
          {children}
        </Description>
      </Content>
    </Dialog.Portal>
  )
}
