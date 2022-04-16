import { CSSProperties, RefObject } from 'react'

import Icon from '@mdi/react'
import clsx from 'clsx'

import './IconButton.scss'

interface IconButtonProps
  extends Omit<
    React.DetailedHTMLProps<
      React.ButtonHTMLAttributes<HTMLButtonElement>,
      HTMLButtonElement
    >,
    'color' | 'ref' | 'title'
  > {
  id?: string
  path: string
  ref?: RefObject<SVGSVGElement>
  title?: string | null
  description?: string | null
  size?: number | string | null
  color?: string | null
  horizontal?: boolean
  vertical?: boolean
  rotate?: number
  spin?: boolean | number
  style?: CSSProperties
  inStack?: boolean
}

export const IconButton = ({
  id,
  path,
  ref,
  title,
  description,
  size,
  color,
  horizontal,
  vertical,
  rotate,
  spin,
  style,
  inStack,
  ...buttonProps
}: IconButtonProps) => {
  return (
    <button
      {...buttonProps}
      className={clsx('icon-button', buttonProps.className)}
    >
      <Icon
        id={id}
        path={path}
        ref={ref}
        title={title}
        description={description}
        size={size}
        color={color}
        horizontal={horizontal}
        vertical={vertical}
        rotate={rotate}
        spin={spin}
        style={style}
        inStack={inStack}
      />
    </button>
  )
}
