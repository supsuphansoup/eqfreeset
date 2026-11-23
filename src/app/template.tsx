import type { ReactNode } from 'react'

// template은 페이지를 이동할 때마다 새로 마운트되므로, 이동한 화면에 짧은 등장 애니메이션을 준다
export default function Template({ children }: { children: ReactNode }) {
  return <div className="route-enter">{children}</div>
}
