import LogoSvg from '../data/logo.svg'

export default function Logo({ className = '' }: { className?: string }) {
  return <LogoSvg className={className} />
}
