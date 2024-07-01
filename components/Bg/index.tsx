'use client'

import Hud from './Hud'

export default function Bg() {
  return <div className={`
    fixed z-0 -top-[160px] -left-[160px] size-[2000px] 2xl:size-[2800px]`}>
    <Hud />
  </div>
}
