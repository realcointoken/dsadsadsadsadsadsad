import React from 'react'
import { AutoRenewIcon, BlockIcon, StarLineIcon, CommunityIcon, RefreshIcon, Tag, TagProps, TimerIcon, VerifiedIcon, VoteIcon } from 'uikit'
import { useTranslation } from 'contexts/Localization'

const CoreTag: React.FC<TagProps> = ( props ) => {
  const { t } = useTranslation()
  return (
    <Tag variant="secondary" outline startIcon={ <VerifiedIcon width="18px" color="secondary" mr="4px"/> } { ...props }>
      { t( 'Core' ) }
    </Tag>
  )
}

const CommunityTag: React.FC<TagProps> = ( props ) => {
  const { t } = useTranslation()
  return (
    <Tag variant="failure" outline startIcon={ <CommunityIcon width="18px" color="failure" mr="4px"/> } { ...props }>
      { t( 'Community' ) }
    </Tag>
  )
}

const DualTag: React.FC<TagProps> = ( props ) => {
  const { t } = useTranslation()
  return (
    <Tag variant="textSubtle" outline { ...props }>
      { t( 'Dual' ) }
    </Tag>
  )
}

const ManualPoolTag: React.FC<TagProps> = ( props ) => {
  const { t } = useTranslation()
  return (
    <Tag variant="secondary" outline startIcon={ <RefreshIcon width="18px" color="secondary" mr="4px"/> } { ...props }>
      { t( 'Manual' ) }
    </Tag>
  )
}

const BonusTag: React.FC<TagProps> = ( props ) => {
  const { t } = useTranslation()
  return (
    <Tag variant="warning" outline startIcon={ <StarLineIcon width="18px" color="warning" mr="4px"/> } { ...props }>
      { t( 'Bonus' ) }
    </Tag>
  )
}

const CompoundingPoolTag: React.FC<TagProps> = ( props ) => {
  const { t } = useTranslation()
  return (
    <Tag variant="success" outline startIcon={ <AutoRenewIcon width="18px" color="success" mr="4px"/> } { ...props }>
      { t( 'Auto' ) }
    </Tag>
  )
}

const VoteNowTag: React.FC<TagProps> = ( props ) => {
  const { t } = useTranslation()
  return (
    <Tag variant="success" startIcon={ <VoteIcon width="18px" color="success" mr="4px"/> } { ...props }>
      { t( 'Vote Now' ) }
    </Tag>
  )
}

const SoonTag: React.FC<TagProps> = ( props ) => {
  const { t } = useTranslation()
  return (
    <Tag variant="binance" startIcon={ <TimerIcon width="18px" color="success" mr="4px"/> } { ...props }>
      { t( 'Soon' ) }
    </Tag>
  )
}

const ClosedTag: React.FC<TagProps> = ( props ) => {
  const { t } = useTranslation()
  return (
    <Tag variant="textDisabled" startIcon={ <BlockIcon width="18px" color="textDisabled" mr="4px"/> } { ...props }>
      { t( 'Closed' ) }
    </Tag>
  )
}

export { CoreTag, CommunityTag, DualTag, ManualPoolTag, CompoundingPoolTag, VoteNowTag, SoonTag, ClosedTag, BonusTag }