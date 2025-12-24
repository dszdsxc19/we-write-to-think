/* eslint-disable jsx-a11y/anchor-has-content */
import { Link as NextIntlLink } from '@/navigation'
import { AnchorHTMLAttributes } from 'react'

const CustomLink = ({ href, ...rest }: { href: string } & AnchorHTMLAttributes<HTMLAnchorElement>) => {
  const isInternalLink = href && href.startsWith('/')
  const isAnchorLink = href && href.startsWith('#')

  if (isInternalLink) {
    return <NextIntlLink className="break-words" href={href} {...rest} />
  }

  if (isAnchorLink) {
    return <a className="break-words" href={href} {...rest} />
  }

  return (
    <a className="break-words" target="_blank" rel="noopener noreferrer" href={href} {...rest} />
  )
}

export default CustomLink
